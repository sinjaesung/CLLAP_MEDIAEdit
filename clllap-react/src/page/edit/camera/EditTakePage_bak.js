import React, { useState,useEffect,useRef} from "react";

//css
import styled from "styled-components"
import "react-circular-progressbar/dist/styles.css";

//img
import CameraBg from "../../../img/img/camera_bg.jpg"
import iconPlay from "../../../img/icon/icon_play_btn.svg"
import iconTakeBg from "../../../img/icon/icon_take_bg.svg"
import iconPrev from "../../../img/icon/icon_video_prev.svg"
import iconNext from "../../../img/icon/icon_video_next.svg"
import iconTakePrev from "../../../img/icon/icon_take_prev.svg"
import iconTakeNext from "../../../img/icon/icon_take_next.svg"
import iconMediaCut from "../../../img/icon/icon_mediaCut.png"

//import VideoImageThumbnail from 'react-video-thumbnail-image';
//import VideoPlayer from '../../Videoplayer';
import VideoPlayer from 'react-video-js-player';

// component
import CameraDefault from '../../../component/camera/CameraDefault';

//servercontroller
import serverController from '../../../server/serverController';
import serverController2_1 from '../../../server/serverController2_1';

import LodingModal from '../../../component/modal/LodingModal';

import { useSelector } from 'react-redux';

//common공통관련
import * as s3_related_url from '../../../component/common/s3_related_url';

import {CommonUtil} from '../../../component/common/commonutil';

export default function EditTakePage() {

    const userData = useSelector(store => store.userData.userData);

    const [takelist,setTakelist] = useState([]);
    const [remoteurllist,setremoteurllist] = useState([]);
    const [thumbnaillist,setthumbnaillist] = useState([]);
    const [timegridarray,] = useState([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]);
    const [standbydata,setStandbydata] = useState({});
    const [standbydata_final,setStandbydata_final] = useState({});
    const [isstandby,setIsstandby] = useState(false);
    const [takebarEdit,setTakebarEdit] = useState(false);
    const [lodingModal, setLodingModal] = useState(false)

    const [takecolor,settakecolor] = useState(['rgba(58,200,220,0.5)','rgba(228,50,50,0.5)','rgba(180,100,220,0.5)','rgba(55,160,50,0.5)','rgba(228,180,40,0.5)'])
    let commonUtil_use=CommonUtil()();

    const takevideocut_visual=useRef();
    const cutvideo=useRef();
    const playstatus = useRef();
    const [videosrc,setvideosrc] = useState("");

    //const getParams = location.state.nextParameter;
    //console.log('===>eidtTake 전달받은 파라미터데이터:',getParams);
    useEffect(()=>{
        //android
        document.addEventListener("message",async (event) =>{
            let test_data=JSON.parse(event.data);
            alert(event.data);
            
            let takefilelist=test_data['takefilelist'];//takefilelist를 받는다.
            setTakelist(takefilelist);
            setIsstandby(false);
            /*setStandbydata({
                music: ,
                musictransitiontype: "opencv"
            })*/
        });
        //setTakelist(getParams.standbydata.s3_url_list);
       
    },[]);

    
    //globe functisons===========================================
    //원본비디오 부분 제어 및 추출 관련 데이터처리
    function video_takecontrol_move_closure(){
        let move_target=null; let move_target_=null;
        let move_parentTarget=null;//무브 오브젝트 자체를 클릭한경우엔 move_parentTarget, move_target동일하게끔 하고, 그게 아닌경우라면 다르다
        let isdrag=false; let isdrag_=false;
        
        let move_object_pos={}; let move_object_pos_={};
        let time_grid_elements= document.getElementsByClassName('time_grid');
 
        function mousedown_module(event){
            event.preventDefault();

            move_target= event.target;

            console.log('===>>드래그할 대상 move_targetss:',move_target,move_target.classList,move_target.className);

            if(move_target.className.indexOf('videotake_control')==-1){
                //좌우 리사이즈 요소 관련처리한경우
                console.log('videoTkae_control요소가 아님!:',move_target,event.target);
                move_target=event.target;
                move_parentTarget=move_target.parentElement;//부모요소 해당 좌우요소의 부모요소(element자체)
            }else{
                //비디오 컨트롤 요소 자체를 처리하는 경우(위치이동)
                console.log('videoTake_control요소임!!!:',move_target,event.target);
                move_target=event.target;
                move_parentTarget = move_target;
            }
            
            
            isdrag=true;
        }  
        function mouseup_module(event){
            let current_target= event.target;
            console.log('mouseup이벤트발생 관련 객체:',current_target,event.target);

            if(isdrag){
                move_object_pos['x'] =event.clientX;
                move_object_pos['y'] = event.clientY;

                console.log('mouseup이벤트발생 up 당시떄의 offset위치정보값:',move_object_pos,move_target);

                if(move_target.className.indexOf('videotake_control')!=-1){
                    console.log('videotakeControl요소 자체를 이동시키려고 하는 경우:',move_target);
                    let adapt_x= move_object_pos['x'];
                    let distance_array=[];
                    for(let t=0; t<time_grid_elements.length; t++){
                        //console.log('===>mouseup당시떄의 adapt_x좌표 offsetX,clientX와 가장 가까운 대상찾기');
                        let item=time_grid_elements[t];
                        let offsetX=item.offsetLeft;
                        //console.log('item offsetX,adapt_x:',offsetX,adapt_x);

                        let distance=Math.abs(adapt_x-offsetX);
                        distance_array.push({
                            index: t+1,
                            object:time_grid_elements[t],
                            value:distance
                        });
                    }
                    console.log('===>매 확인된 distance값:',distance_array);
                    //가장 작은값 순으로 해서 정렬 가장 첫 요소 찾기
                    let sort_result= distance_array.sort(function(a,b){
                        let left=parseInt(a.value);
                        let right=parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    });
                    console.log('>>>정렬처리후에 distance_arrayss:',distance_array);
                    let adapt_final_target=distance_array[0].object;
                    console.log('===>대상타깃 leftoffsetX시작위치index값:',distance_array[0].index);
                    let adapt_final_targetindex = distance_array[0].index;
                    move_target.style.left = 3.333*(adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('change_duration'))/2) - 1)+'%';

                    let adapt_startpos=adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('change_duration'))/2) - 1;
                    
                    let original_duration= parseInt(move_target.getAttribute('original_duration'));
                    let change_duration = parseInt(move_target.getAttribute('change_duration'));//변화적용 최종길이값(초값) startpos=x+duration
                    let adapt_endpos = adapt_startpos + change_duration;

                    adapt_startpos = adapt_startpos < 0 ? 0 : adapt_startpos;
                    //adapt_endpos= adapt_endpos >30? 30 : adapt_endpos;
                    adapt_endpos = adapt_endpos > original_duration ? original_duration: adapt_endpos;
                    adapt_endpos = adapt_endpos > 30 ? 30 : adapt_endpos;

                    move_target.setAttribute('endpos',adapt_endpos);
                    move_target.setAttribute('startpos',adapt_startpos);

                    console.log('[[[[[moveing adapt start~end pos::!!]]]]]',adapt_startpos,adapt_endpos);

                   let take_video_process_info=[];
                   let split_and_move_video_controls=document.getElementsByClassName('take_row');
                   for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            //순차적 테이크 순서 절대적인 1~5순서쌍 정보>>>
                            let take_index=s+1;
                            let original_duration = parseInt(item.getAttribute('original_duration'));
                            let change_duration=parseInt(item.getAttribute('change_duration'));
                            let startpos = parseInt(item.getAttribute('startpos'));
                            let endpos = parseInt(item.getAttribute('endpos'));
                                        
                            let store_obj= {};
                            store_obj['take'] = take_index;
                            store_obj['duration'] = change_duration;
                            store_obj['startpos'] = startpos;
                            store_obj['endpos'] = endpos; 
                            store_obj['original_duration'] = original_duration;
            
                            take_video_process_info.push(store_obj);

                        }   
                    }    
                    console.log('takebar moviing take_video_process_info',take_video_process_info);
                    setStandbydata({
                        music: getParams.music,
                        musictransitiontype:getParams.musictransitiontype,
                        remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    }) 
                }else if(move_target.className.indexOf("video_left_duration_control")!=-1){
                    //이동연산 크기 연산 모두 진행>>
                    console.log('videoleftdurationcontrol요소를 mousedown했다가 drag하여 mouseup한경우:',move_target,move_parentTarget);
                    let adapt_x = move_object_pos['x'];
                    let distance_array=[];
                    let distance_array2=[];

                    let mother_object_offsetrightX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft']) + parseFloat(move_parentTarget.offsetLeft) + parseFloat(window.getComputedStyle(move_parentTarget,null)['width']);

                    for(let t=0; t<time_grid_elements.length; t++){
                        let item=time_grid_elements[t];
                        let offsetX=item.offsetLeft;
                        
                        let distance=Math.abs(adapt_x - offsetX);
                        distance_array.push({
                            index:t+1,
                            object:time_grid_elements[t],
                            value:distance
                        });
                        let distance2=Math.abs(mother_object_offsetrightX-offsetX);
                        distance_array2.push({
                            index:t+1,
                            object:time_grid_elements[t],
                            value:distance2
                        });
                        console.log('==>>hmmmm:',adapt_x,offsetX);
                        console.log('===>>hmmmmm:',mother_object_offsetrightX,offsetX);
                    }
                    let sort_result = distance_array.sort(function(a,b){
                        let left =parseInt(a.value);
                        let right= parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    });
                    console.log('정렬처리후 distance_arrayss:',distance_array);
                    let sort_result2 = distance_array2.sort(function(a,b){
                        let left =parseInt(a.value);
                        let right= parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    });
                    console.log('정렬처리후 distance_arrayss:',distance_array2);
                    
                    //1.최종 관련 마우스mouseup된 위치값과의 격차가 가장 적은 timegrid offsetLeft위치 object를 찾는다.그리고 그 위치로 moveTarget이동시킴.
                    let adapt_final_target=distance_array[0].object;
                    let adapt_final_targetindex=distance_array[0].index;
                    //move_parentTarget.style.left = adapt_final_target.offsetLeft + 'px';
                    move_parentTarget.style.left = (3.333 * (adapt_final_targetindex-1))+'%';
                    //2. mouseup이벤트 발생시점때에 motherElement의 offsetRight xleft값위치인접한 위치시작인댁스index-1 - adaptfinaltARGET INDEX값과의 차이값의 곧 IDNEX차이격차값이 각 인댁스는 일초값이고 이값 N% * s값 만큼의 폭을 가진다%폭으로 처리한다(반응형고려) 또한 몇초duration인지도 추적가능함.
                    
                    let adapt_final_posx_index=distance_array[0].index;//해당 이동할 위치와 moveMother object rightPosx와의 격차값은 새로 반영width크기이다.
                    let mother_object_offsetrightX_index= distance_array2[0].index;
                    console.log('adapt_final_posxIndex,mother_object_fofsetrightXindex:',adapt_final_posx_index,mother_object_offsetrightX_index);

                    let original_duration=parseInt(move_parentTarget.getAttribute('original_duration'));
                    let adapt_width_duration = mother_object_offsetrightX_index - adapt_final_posx_index;
                    console.log('적용 duration초 상수값::',adapt_width_duration);

                    if(adapt_width_duration >= 0 && adapt_width_duration < 1){
                        //alert('적용 duration이 1초는 되어야합니다.');
                        adapt_width_duration = 1;

                    }else if(adapt_width_duration > move_parentTarget.getAttribute('original_duration')){
                        //alert('영상 고유의 duration값보다 더 크게 지정하려고 했던경우.');
                        adapt_width_duration = move_parentTarget.getAttribute('original_duration');

                    }else if(adapt_width_duration < 0){
                        //alert('적용 duration이 유효하지 않습니다!!');
                        adapt_width_duration = 1;
                    }
                    move_parentTarget.setAttribute('change_duration',adapt_width_duration);
                    move_parentTarget.style.width = parseFloat( 3.333 * adapt_width_duration)+'%'; 

                    move_parentTarget.setAttribute('startpos',adapt_final_targetindex-1);
                    //변화 적용된 당시때의 change_duration값을 더해서 한다.
                    //let change_duration = parseInt(move_parentTarget.getAttribute('change_duration'));
                    let change_duration = adapt_width_duration;
                    let end_pos = (adapt_final_targetindex - 1) + change_duration;
                    end_pos = end_pos > original_duration ? original_duration: end_pos;
                    end_pos = end_pos > 30 ? 30 : end_pos;

                    move_parentTarget.setAttribute('endpos',end_pos);

                   let take_video_process_info=[];
                   let split_and_move_video_controls=document.getElementsByClassName('take_row');
                    for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            //순차적 테이크 순서 절대적인 1~5순서쌍 정보>>>
                            let take_index=s+1;
                            let original_duration = parseInt(item.getAttribute('original_duration'));
                            let change_duration=parseInt(item.getAttribute('change_duration'));
                            let startpos = parseInt(item.getAttribute('startpos'));
                            let endpos = parseInt(item.getAttribute('endpos'));
                         
                            let store_obj= {};
                            store_obj['take'] = take_index;
                            store_obj['duration'] = change_duration;
                            store_obj['startpos'] = startpos;
                            store_obj['endpos'] = endpos; 
                            store_obj['original_duration'] = original_duration;
            
                            take_video_process_info.push(store_obj);

                        }   
                    } 
                    console.log('takebar durationSize take_video_process_info',take_video_process_info);
   
                    setStandbydata({
                        music: getParams.music,
                        musictransitiontype:getParams.musictransitiontype,
                        remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    })
                }else if(move_target.className.indexOf("video_right_duration_control")!=-1){
                    console.log('videorightduraitoncontrol요소를 mousedown했다가 drag하여 mouseup한경우:',move_target,move_parentTarget);
                    let adapt_x=move_object_pos['x'];
                    let distance_array=[];
                    let distance_array2=[];
                    let mother_object_offsetleftX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft'])+parseFloat(move_parentTarget.offsetLeft);

                    for(let t=0; t<time_grid_elements.length; t++){
                        //console.log('mouseup당시때의 또한 대상타깃 offsetx,clientx대상 찾기');
                        let item=time_grid_elements[t];
                        let offsetX=item.offsetLeft;

                        let distance=Math.abs(adapt_x-offsetX);
                        distance_array.push({
                            index:t+1,
                            object:time_grid_elements[t],
                            value:distance
                        });
                        let distance2=Math.abs(mother_object_offsetleftX-offsetX);
                        distance_array2.push({
                            index:t+1,
                            object:time_grid_elements[t],
                            value:distance2
                        });
                    }
                    console.log('매확인된 distnace값:',distance_array,distance_array2);
                    let sort_result=distance_array.sort(function(a,b){
                        let left=parseInt(a.value);
                        let right=parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    });
                    console.log('정렬처리후에 distance_arrays:',distance_array);
                    let sort_result2=distance_array2.sort(function(a,b){
                        let left=parseInt(a.value);
                        let right=parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    })
                    console.log('정렬처리후에 distance_arraysss:',distance_array2);

                    let adapt_final_target=distance_array[0].object;
                    let adapt_final_targetindex=distance_array[0].index;

                    let adapt_final_posx_index=distance_array[0].index;
                    let mother_object_offsetleftX_index=distance_array2[0].index;

                    console.log('adapt final posxindex,mother object fostrightxindex:',adapt_final_posx_index,mother_object_offsetleftX_index);
                    let adapt_width_duration=adapt_final_posx_index - mother_object_offsetleftX_index;

                    if(adapt_width_duration >=0 && adapt_width_duration<1){
                        //alert('적용 druation이 1초는 되어야합니다.');
                        adapt_width_duration=1;
                    }else if(adapt_width_duration > move_parentTarget.getAttribute('original_duration')){
                        //alert('영상 고유의 duration값보다 더 크게 지정하려고 했던경우.');
                        adapt_width_duration = move_parentTarget.getAttribute('original_duration');

                    }else if(adapt_width_duration < 0){
                        //alert('적용 duration이 유효하지 않습니다.');
                        adapt_width_duration=1;
                    }
                    adapt_width_duration=parseInt(adapt_width_duration);

                    move_parentTarget.setAttribute('change_duration',adapt_width_duration);
                    move_parentTarget.style.width=parseFloat(3.333*adapt_width_duration)+'%';

                    let original_duration=parseInt(move_parentTarget.getAttribute('original_duration'));
                    let start_pos=parseInt(move_parentTarget.getAttribute('startpos'));
                    let end_pos=start_pos+adapt_width_duration;

                    end_pos = end_pos > original_duration ? original_duration : end_pos;
                    end_pos = end_pos > 30 ? 30 : end_pos;

                    move_parentTarget.setAttribute('endpos',end_pos);

                    let take_video_process_info=[];
                   let split_and_move_video_controls=document.getElementsByClassName('take_row');
                    for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            //순차적 테이크 순서 절대적인 1~5순서쌍 정보>>>
                            let take_index=s+1;
                            let original_duration = parseInt(item.getAttribute('original_duration'));
                            let change_duration=parseInt(item.getAttribute('change_duration'));
                            let startpos = parseInt(item.getAttribute('startpos'));
                            let endpos = parseInt(item.getAttribute('endpos'));
                         
                            let store_obj= {};
                            store_obj['take'] = take_index;
                            store_obj['duration'] = change_duration;
                            store_obj['startpos'] = startpos;
                            store_obj['endpos'] = endpos; 
                            store_obj['original_duration'] = original_duration;
            
                            take_video_process_info.push(store_obj);

                        }   
                    }
                    console.log('takebar durationSize take_video_process_info',take_video_process_info);          

                    setStandbydata({
                        music: getParams.music,
                        musictransitiontype:getParams.musictransitiontype,
                        remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    }) 
                }
            }
            isdrag=false;
        }
        function touchstart_module(event){
           // event.preventDefault();

            move_target= event.target;

            console.log('===>>터치 대상 move_targetss:',move_target,move_target.classList,move_target.className);

            if(move_target.className.indexOf('videotake_control')==-1){
                //좌우 리사이즈 요소 관련처리한경우
                console.log('videoTkae_control요소가 아님!:',move_target,event.target);
                move_target=event.target;
                move_parentTarget=move_target.parentElement;//부모요소 해당 좌우요소의 부모요소(element자체)
            }else{
                move_target=event.target;
                move_parentTarget=move_target;
            }
           
            isdrag=true;
        }  
        function touchend_module(event){
            let current_target= event.target;
            console.log('touchendup이벤트발생 관련 객체:',current_target,event.target,event.changedTouches[0],event.changedTouches[0].clientX,event.changedTouches[0].clientY);

            if(isdrag){
                move_object_pos['x'] =event.changedTouches[0].clientX;
                move_object_pos['y'] = event.changedTouches[0].clientY;

                console.log('touchendup이벤트발생 up 당시떄의 offset위치정보값:',move_object_pos,move_target);

                if(move_target.className.indexOf('videotake_control')!=-1){
                    console.log('videotakeControl요소 자체를 이동시키려고 하는 경우:',move_target);
                    let adapt_x= move_object_pos['x'];
                    let distance_array=[];
                    for(let t=0; t<time_grid_elements.length; t++){
                        console.log('===>touchendup당시떄의 adapt_x좌표 offsetX,clientX와 가장 가까운 대상찾기');
                        let item=time_grid_elements[t];
                        let offsetX=item.offsetLeft;
                        console.log('item offsetX,adapt_x:',offsetX,adapt_x);

                        let distance=Math.abs(adapt_x-offsetX);
                        distance_array.push({
                            index: t+1,
                            object:time_grid_elements[t],
                            value:distance
                        });
                    }
                    console.log('===>매 확인된 distance값:',distance_array);
                    //가장 작은값 순으로 해서 정렬 가장 첫 요소 찾기
                    let sort_result= distance_array.sort(function(a,b){
                        let left=parseInt(a.value);
                        let right=parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    });
                    console.log('>>>정렬처리후에 distance_arrayss:',distance_array);
                    let adapt_final_target=distance_array[0].object;
                    console.log('===>대상타깃 leftoffsetX시작위치index값:',distance_array[0].index);
                    let adapt_final_targetindex = distance_array[0].index;
                    move_target.style.left = 3.333*(adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('change_duration'))/2)-1)+'%';

                    let adapt_startpos=adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('change_duration'))/2)-1;

                    let original_duration=parseInt(move_target.getAttribute('original_duration'));
                    let change_duration=parseInt(move_target.getAttribute("change_duration"));
                    let end_pos = adapt_startpos + change_duration;
                    adapt_startpos = adapt_startpos < 0 ? 0:adapt_startpos;
                    end_pos= end_pos > original_duration?original_duration:end_pos;
                    end_pos = end_pos > 30 ? 30 : end_pos;

                    move_target.setAttribute('startpos',adapt_startpos);
                    move_target.setAttribute('endpos',end_pos);

                    /*let id_val = move_parentTarget.id.replace('control','');
                    //visual video target elemetns visible expand view conotrols
                    let visual_video_take_element = document.getElementById(`take${id_val}_video`);
                    let visual_video_take_element_rangechilds= visual_video_take_element.children;

                    let make_range_string=[];
                    for(let s= adapt_final_targetindex; s<=end_pos; s++){
                        make_range_string.push(s);
                    }
                    console.log('현재 videocontrol moveaction에 따른 시간범위 make_range_stringsss:',make_range_string);
                    for(let i=0; i<visual_video_take_element_rangechilds.length; i++){
                        if(visual_video_take_element_rangechilds[i].className.indexOf('visible_range_cut')!=-1){
                            let target=visual_video_take_element_rangechilds[i];
                            let target_timeindex=parseInt(target.getAttribute('time_index'));
                            console.log('==>>대상타깃 targetsss:',target,target_timeindex);
                            console.log('target whatsss 존재하나??:',target,make_range_string.includes(target_timeindex),i);
                            if(make_range_string.includes(target_timeindex)){
                                target.style.backgroundColor = 'rgba(0,0,0,0.0)';
                            }else{
                                target.style.backgroundColor='rgba(0,0,0,0.9)';
                            }
                        }
                    }*/

                    let take_video_process_info=[];
                   let split_and_move_video_controls=document.getElementsByClassName('take_row');
                   for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            //순차적 테이크 순서 절대적인 1~5순서쌍 정보>>>
                            let take_index=s+1;
                            let original_duration = parseInt(item.getAttribute('original_duration'));
                            let change_duration=parseInt(item.getAttribute('change_duration'));
                            let startpos = parseInt(item.getAttribute('startpos'));
                            let endpos = parseInt(item.getAttribute('endpos'));
                            
                            /*if(startpos < 0){
                                alert('프레임범위가 원본비디오를 벗어났습니다.');
                                break;
                                return false;
                            }
                            if(change_duration > original_duration){
                                alert('원본 비디오 길이보다 더 길게 지정은 불가합니다.');
                                break;
                                return false;
                            }
                            if(endpos > original_duration){
                                alert('프레임범위가 원본비디오를 벗어났습니다.');
                                break;
                                return false;
                            }*/
            
                            //change_duration_sum += change_duration;
            
                            let store_obj= {};
                            store_obj['take'] = take_index;
                            store_obj['duration'] = change_duration;
                            store_obj['startpos'] = startpos;
                            store_obj['endpos'] = endpos; 
                            store_obj['original_duration'] = original_duration;

                            take_video_process_info.push(store_obj);                         
                        }   
                    }
                    console.log('take_video_process_info',take_video_process_info);

                    setStandbydata({
                        music: getParams.music,
                        musictransitiontype:getParams.musictransitiontype,
                        remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    })     
                }else if(move_target.className.indexOf("video_left_duration_control")!=-1){
                    //이동연산 크기 연산 모두 진행>>
                    console.log('videoleftdurationcontrol요소를 mousedown했다가 drag하여 mouseup한경우:',move_target,move_parentTarget);
                    let adapt_x = move_object_pos['x'];
                    let distance_array=[];
                    let distance_array2=[];

                    let mother_object_offsetrightX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft']) + parseFloat(move_parentTarget.offsetLeft) + parseFloat(window.getComputedStyle(move_parentTarget,null)['width']);

                    for(let t=0; t<time_grid_elements.length; t++){
                        let item=time_grid_elements[t];
                        let offsetX=item.offsetLeft;
                        
                        let distance=Math.abs(adapt_x - offsetX);
                        distance_array.push({
                            index:t+1,
                            object:time_grid_elements[t],
                            value:distance
                        });
                        let distance2=Math.abs(mother_object_offsetrightX-offsetX);
                        distance_array2.push({
                            index:t+1,
                            object:time_grid_elements[t],
                            value:distance2
                        });
                        console.log('==>>hmmmm:',adapt_x,offsetX);
                        console.log('===>>hmmmmm:',mother_object_offsetrightX,offsetX);
                    }
                    let sort_result = distance_array.sort(function(a,b){
                        let left =parseInt(a.value);
                        let right= parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    });
                    console.log('정렬처리후 distance_arrayss:',distance_array);
                    let sort_result2 = distance_array2.sort(function(a,b){
                        let left =parseInt(a.value);
                        let right= parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    });
                    console.log('정렬처리후 distance_arrayss:',distance_array2);
                    
                    //1.최종 관련 마우스mouseup된 위치값과의 격차가 가장 적은 timegrid offsetLeft위치 object를 찾는다.그리고 그 위치로 moveTarget이동시킴.
                    let adapt_final_target=distance_array[0].object;
                    let adapt_final_targetindex=distance_array[0].index;
                    //move_parentTarget.style.left = adapt_final_target.offsetLeft + 'px';
                    move_parentTarget.style.left = (3.333 * (adapt_final_targetindex-1))+'%';
                    //2. mouseup이벤트 발생시점때에 motherElement의 offsetRight xleft값위치인접한 위치시작인댁스index-1 - adaptfinaltARGET INDEX값과의 차이값의 곧 IDNEX차이격차값이 각 인댁스는 일초값이고 이값 N% * s값 만큼의 폭을 가진다%폭으로 처리한다(반응형고려) 또한 몇초duration인지도 추적가능함.
                    
                    let adapt_final_posx_index=distance_array[0].index;//해당 이동할 위치와 moveMother object rightPosx와의 격차값은 새로 반영width크기이다.
                    let mother_object_offsetrightX_index= distance_array2[0].index;
                    console.log('adapt_final_posxIndex,mother_object_fofsetrightXindex:',adapt_final_posx_index,mother_object_offsetrightX_index);

                    let original_duration=parseInt(move_parentTarget.getAttribute('original_duration'));
                    let adapt_width_duration = mother_object_offsetrightX_index - adapt_final_posx_index;
                    console.log('적용 duration초 상수값::',adapt_width_duration);

                    if(adapt_width_duration >= 0 && adapt_width_duration < 1){
                        //alert('적용 duration이 1초는 되어야합니다.');
                        adapt_width_duration = 1;

                    }else if(adapt_width_duration > move_parentTarget.getAttribute('original_duration')){
                        //alert('영상 고유의 duration값보다 더 크게 지정하려고 했던경우.');
                        adapt_width_duration = move_parentTarget.getAttribute('original_duration');

                    }else if(adapt_width_duration < 0){
                        //alert('적용 duration이 유효하지 않습니다!!');
                        adapt_width_duration = 1;
                    }
                    move_parentTarget.setAttribute('change_duration',adapt_width_duration);
                    move_parentTarget.style.width = parseFloat( 3.333 * adapt_width_duration)+'%'; 

                    move_parentTarget.setAttribute('startpos',adapt_final_targetindex-1);
                    //변화 적용된 당시때의 change_duration값을 더해서 한다.
                    //let change_duration = parseInt(move_parentTarget.getAttribute('change_duration'));
                    let change_duration = adapt_width_duration;
                    let end_pos = (adapt_final_targetindex - 1) + change_duration;
                    end_pos = end_pos > original_duration ? original_duration: end_pos;
                    end_pos = end_pos > 30 ? 30 : end_pos;

                    move_parentTarget.setAttribute('endpos',end_pos);

                    let take_video_process_info=[];
                    let split_and_move_video_controls=document.getElementsByClassName('take_row');
                    for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            //순차적 테이크 순서 절대적인 1~5순서쌍 정보>>>
                            let take_index=s+1;
                            let original_duration = parseInt(item.getAttribute('original_duration'));
                            let change_duration=parseInt(item.getAttribute('change_duration'));
                            let startpos = parseInt(item.getAttribute('startpos'));
                            let endpos = parseInt(item.getAttribute('endpos'));
                        
                            let store_obj= {};
                            store_obj['take'] = take_index;
                            store_obj['duration'] = change_duration;
                            store_obj['startpos'] = startpos;
                            store_obj['endpos'] = endpos; 
                            store_obj['original_duration'] = original_duration;
            
                            take_video_process_info.push(store_obj);

                        }   
                    } 
                    console.log('takebar durationSize take_video_process_info',take_video_process_info);

                    setStandbydata({
                        music: getParams.music,
                        musictransitiontype:getParams.musictransitiontype,
                        remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    })
                }else if(move_target.className.indexOf("video_right_duration_control")!=-1){
                    console.log('videorightduraitoncontrol요소를 mousedown했다가 drag하여 touchendup한경우:',move_target,move_parentTarget);
                    let adapt_x=move_object_pos['x'];
                    let distance_array=[];
                    let distance_array2=[];
                    let mother_object_offsetleftX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft'])+parseFloat(move_parentTarget.offsetLeft);

                    for(let t=0; t<time_grid_elements.length; t++){
                        //console.log('mouseup당시때의 또한 대상타깃 offsetx,clientx대상 찾기');
                        let item=time_grid_elements[t];
                        let offsetX=item.offsetLeft;

                        let distance=Math.abs(adapt_x-offsetX);
                        distance_array.push({
                            index:t+1,
                            object:time_grid_elements[t],
                            value:distance
                        });
                        let distance2=Math.abs(mother_object_offsetleftX-offsetX);
                        distance_array2.push({
                            index:t+1,
                            object:time_grid_elements[t],
                            value:distance2
                        });
                    }
                    console.log('매확인된 distnace값:',distance_array,distance_array2);
                    let sort_result=distance_array.sort(function(a,b){
                        let left=parseInt(a.value);
                        let right=parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    });
                    console.log('정렬처리후에 distance_arrays:',distance_array);
                    let sort_result2=distance_array2.sort(function(a,b){
                        let left=parseInt(a.value);
                        let right=parseInt(b.value);

                        if(left < right){
                            return -1;
                        }
                        if(left > right){
                            return 1;
                        }
                        return 0;
                    })
                    console.log('정렬처리후에 distance_arraysss:',distance_array2);

                    let adapt_final_target=distance_array[0].object;
                    let adapt_final_targetindex=distance_array[0].index;

                    let adapt_final_posx_index=distance_array[0].index;
                    let mother_object_offsetleftX_index=distance_array2[0].index;

                    console.log('adapt final posxindex,mother object fostrightxindex:',adapt_final_posx_index,mother_object_offsetleftX_index);
                    let adapt_width_duration=adapt_final_posx_index - mother_object_offsetleftX_index;

                    if(adapt_width_duration >=0 && adapt_width_duration<1){
                        //alert('적용 druation이 1초는 되어야합니다.');
                        adapt_width_duration=1;
                    }else if(adapt_width_duration > move_parentTarget.getAttribute('original_duration')){
                        //alert('영상 고유의 duration값보다 더 크게 지정하려고 했던경우.');
                        adapt_width_duration = move_parentTarget.getAttribute('original_duration');

                    }else if(adapt_width_duration < 0){
                        //alert('적용 duration이 유효하지 않습니다.');
                        adapt_width_duration=1;
                    }
                    adapt_width_duration=parseInt(adapt_width_duration);

                    move_parentTarget.setAttribute('change_duration',adapt_width_duration);
                    move_parentTarget.style.width=parseFloat(3.333*adapt_width_duration)+'%';

                    let original_duration=parseInt(move_parentTarget.getAttribute('original_duration'));
                    let start_pos=parseInt(move_parentTarget.getAttribute('startpos'));
                    let end_pos=start_pos+adapt_width_duration;

                    end_pos = end_pos > original_duration ? original_duration : end_pos;
                    end_pos = end_pos > 30 ? 30 : end_pos;

                    move_parentTarget.setAttribute('endpos',end_pos);

                    let take_video_process_info=[];
                    let split_and_move_video_controls=document.getElementsByClassName('take_row');
                    for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            //순차적 테이크 순서 절대적인 1~5순서쌍 정보>>>
                            let take_index=s+1;
                            let original_duration = parseInt(item.getAttribute('original_duration'));
                            let change_duration=parseInt(item.getAttribute('change_duration'));
                            let startpos = parseInt(item.getAttribute('startpos'));
                            let endpos = parseInt(item.getAttribute('endpos'));
                        
                            let store_obj= {};
                            store_obj['take'] = take_index;
                            store_obj['duration'] = change_duration;
                            store_obj['startpos'] = startpos;
                            store_obj['endpos'] = endpos; 
                            store_obj['original_duration'] = original_duration;
            
                            take_video_process_info.push(store_obj);

                        }   
                    }
                    console.log('takebar durationSize take_video_process_info',take_video_process_info);          

                    setStandbydata({
                        music: getParams.music,
                        musictransitiontype:getParams.musictransitiontype,
                        remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    }) 
                }        
            }
            isdrag=false;
        }
        function mousedown_module_(event){
            event.preventDefault();

            move_target_=event.target;

            console.log('드래그대상 move_targetssss:',move_target_);

            isdrag_=true;
        }
        
        return [mousedown_module,mouseup_module,touchstart_module,touchend_module];
    }

    var return_set = video_takecontrol_move_closure();
    var video_takecontrol_mousedown= return_set[0];
    var video_takecontrol_mouseup = return_set[1];
    var video_takecontrol_touchstart = return_set[2];
    var video_takecontrol_touchend = return_set[3];

    console.log('관련 타깃 대상함수 globe범위에서 참조하는 형태로 한다:',video_takecontrol_mousedown,video_takecontrol_mouseup);
    //globe functisons===========================

    useEffect(()=>{
        console.log('takelist datass:',takelist);

        let upload_encoded_form_inputdata = document.getElementById('upload_encoded_form_data');
        let remote_url_list = [];
        let thumbnail_list=[];
        let videoper_change_duration;
        if(takelist.length==1){
            videoper_change_duration = 4; 
        }else{
            if(getParams.musictransitiontype=='opencv'){
                videoper_change_duration = 4;
            }else if(getParams.musictransitiontype=='ffmpeg'){
                videoper_change_duration = 4;
            }       
        }
        let take_video_process_info=[];
        for(let s=0; s<takelist.length; s++){
            remote_url_list.push(takelist[s]['src']);
            thumbnail_list.push(takelist[s]['clientsrc']);

            //let target_video = document.getElementById('upload_video'+s);
            //target_video.setAttribute('index',(s+1));

            let duration = Math.round(parseFloat(takelist[s]['time']));
            let target=document.getElementById(`take${s+1}_area`);
            target.style.display='block';

            let target2=document.getElementById(`control${s+1}`);
            target2.setAttribute(`original_duration`,duration);
            target2.setAttribute('change_duration',videoper_change_duration);
            target2.setAttribute('startpos',0);
            target2.setAttribute('endpos',0 + videoper_change_duration);
            target2.style.width = (3.333*videoper_change_duration)+'%';
            target2.style.backgroundColor= takecolor[s];

            let target3=document.getElementById(`control${s+1}_original`);
            target3.setAttribute(`original_duration`,duration);
            target3.style.width = (3.333*duration)+'%';
            let target3_text=target3.children[0];
            target3_text.innerText= `원본영상: ${duration}(s)`;

            //let takevideo_fixedTop= document.createElement("VIDEO");

            /*let visual_connect_target= document.getElementById(`take${s+1}_video`);
            for(let s=0; s<duration; s++){
                let make_visible_rangecut= document.createElement('DIV');
                make_visible_rangecut.classList.add('visible_range_cut');

                let calc_percent_width= (100 / duration).toFixed(3);
                make_visible_rangecut.style.width = (calc_percent_width)+'%';
                make_visible_rangecut.style.height='100%';
                make_visible_rangecut.style.backgroundColor='transparent';
                make_visible_rangecut.style.left = (calc_percent_width *s)+'%';//0,3.3333,3.333333* 형태구조로 처리
                make_visible_rangecut.style.top=0;
                make_visible_rangecut.style.position='absolute';

                make_visible_rangecut.setAttribute('time_index',s+1);
                visual_connect_target.appendChild(make_visible_rangecut);
            }*/

            /*let store_obj={};
            store_obj['take']=s+1;
            store_obj['duration'] = duration;
            store_obj['startpos'] = 0;
            store_obj['endpos'] = 0 + duration;

            take_video_process_info.push(store_obj);*/
        }
        console.log('remoteurllist:',remote_url_list,take_video_process_info);

        upload_encoded_form_inputdata.value=remote_url_list.join(',');

        setthumbnaillist(thumbnail_list);
        setremoteurllist(remote_url_list);
        setStandbydata({
            music: getParams.music,
            musictransitiontype:getParams.musictransitiontype,
            remote_url_list : remote_url_list,
            //take_video_process_info : take_video_process_info
        });
    },[takelist]);  
    
    useEffect(()=>{
        console.log('isstandby,standbydatas:',isstandby,standbydata);

        if(standbydata){
        
            let isvalid=false;
            
            let take_video_process_info=standbydata.take_video_process_info;
            /*
            for(let j=0; j<take_video_process_info.length; j++){
                let item=take_video_process_info[j];
                if(item.startpos < 0){
                    isvalid=false;
                }
                if(item.endpos > item.original_duration){
                    isvalid=false;
                }
            }*/

            //take_video_process_info위에서부터 테이크 0~4테이크 1~5테이크 이며, 단지 리스트로 넘어온 순서대로 할뿐이며, 위에있다는 이유만으로 우선순위에 있다.
            if(!take_video_process_info){
                return false;
            }

            let takeper_timerange_meta=[];
            for(let outer=take_video_process_info.length-1; outer>=0; outer--){
                console.log('outersss:',outer);
                let outer_item=take_video_process_info[outer];//0테이크:1테이크일때는 이전 테이크의 범위에 대해서 조회필요없음.
                takeper_timerange_meta[outer]={};
                if(outer==take_video_process_info.length-1){
                    let start=outer_item.startpos;
                    let end=outer_item.endpos;
                    takeper_timerange_meta[outer]['takeindex']=outer+1;
                    takeper_timerange_meta[outer]['info']=[];

                    for(let i=start+1; i<=end; i++){
                        takeper_timerange_meta[outer]['info'].push(i);//15~30=>15,16,17,18,19,20,....30
                    }
                    console.log('=>>takeper_timerange_metainfo final:',takeper_timerange_meta[outer]['info']);

                }else{
                    //outer : 1,2,3,4-> 1:1,0/2:2,1,0 / 3:3,2,1,0 / 4:4,3,2,1,0 >>>
                    let start=outer_item.startpos;
                    let end=outer_item.endpos;

                    takeper_timerange_meta[outer]['takeindex']=outer+1;
                    takeper_timerange_meta[outer]['info']=[];

                    for(let i=start+1; i<=end;i++){
                        takeper_timerange_meta[outer]['info'].push(i);//0~22=>1~22->>추후 컨벌트 1-1~22
                    }
                    let self=outer_item;
                    for(let r=outer; r<take_video_process_info.length; r++){
                        console.log('self outer:',self,outer,takeper_timerange_meta[outer]);
                        let compare=takeper_timerange_meta[r]['info'];
                        let compare_temp={};
                        
                        if(compare.length!=0){
                            let start_temp=compare[0];
                            let end_temp=compare[compare.length-1];
                            compare_temp['takeindex']=r+1;
                            compare_temp['info']=[];

                            for(let i=start_temp; i<=end_temp; i++){
                                compare_temp['info'].push(i);//15~30=>15,16,17,18,19,20,....30
                            }
                                
                            if(r==outer){
                            }else{
                                console.log('compare prev targetss:',compare_temp,r);
                                //let comparetarget_startpos=compare_temp['info'][0];
                                //let comparetarget_endpos=compare_temp['info'][compare_temp['info'].length-1];
                                console.log('outeritem start,end pos:',start,end);
                                //console.log('comparetarget start,endpos:',comparetarget_startpos,comparetarget_endpos);
                                
                               // takeper_timerange_meta[outer]['info']= takeper_timerange_meta[outer]['info'].filter((element)=> !(element>=comparetarget_startpos && element<=comparetarget_endpos));
                                takeper_timerange_meta[outer]['info']=takeper_timerange_meta[outer]['info'].filter((element)=>!compare_temp['info'].includes(element));

                                /*for(let compares=comparetarget_startpos; compares<comparetarget_endpos; compares++){
                                    
                                    let del_index=takeper_timerange_meta[outer]['info'].indexOf(compares);
                                    console.log('삭제할 대상 값:',compares,del_index);
                                    if(del_index!=-1){
                                        takeper_timerange_meta[outer]['info'].splice(del_index,1);

                                    }         
                                    console.log('takepr_timerange_meta info:',takeper_timerange_meta[outer]['info']);
                                }*/
                            }
                        }
                        
                    }
                    console.log('====>>takeper_timerange_metainfo final:=======',takeper_timerange_meta[outer]['info']);
                    
                }
            }
            console.log('===================>>>FINAL takeper_timerange_meta:]]]]======',takeper_timerange_meta);
            
            takeper_timerange_meta= takeper_timerange_meta.filter((element)=> element['info'].length>=1);
            console.log('===================>>>FINAL takeper_timerange_meta:]]]]======',takeper_timerange_meta);

            /*let sort = takeper_timerange_meta.sort(function(a,b){
                let left =parseInt(a['info'][0]);
                let right= parseInt(b['info'][0]);

                if(left < right){
                    return -1;
                }
                if(left > right){
                    return 1;
                }
                return 0;
            });
            console.log('정렬처리후 takeper_timerange_meta:',takeper_timerange_meta);*/
            
            let display_takevideos=[];
            let takeper_slice_info=[];//테이크별 쪼개어질 관련 정보

            for(let s=0; s<takeper_timerange_meta.length; s++){
                display_takevideos.push(takeper_timerange_meta[s]['takeindex']);
                let is_not_continues=false;//테이크별 불연속/연속요소인지 여부, 불연속 구간이 하나라도 있는지여부

                /*let first_insertValue=takeper_timerange_meta[s]['info'][0]-1;
                takeper_timerange_meta[s]['info'].unshift(first_insertValue);//1~10=>0~10 , 11=>10~11, []=>xx 값이 n개라는것은 n개 구간 0~1,1~2,.,...n-1~n 의 n개 구간있는것, 3개라면 1,2,3=>0~3  , 15,16,17,18,19,...25 =>14~25처리 및 의미함.*/

                //first takeindex1 3,4,5,6,7,8,9,10 => 연속성 / two takeindex 0,1,2,3,11,12 불연속성 연속이 끊어지는대상구간 4인댁스부터하여 둘로 쪼갠다.그리고 그 쪼개진 각 part는 어떤 takeindex비디오로부터의 출처인지 정보가 필요함.
                takeper_slice_info[s]={};
                takeper_slice_info[s]['takeindex']=takeper_timerange_meta[s]['takeindex'];
                takeper_slice_info[s]['info'] = [];
                let item=takeper_timerange_meta[s]['info'];
                //console.log('itemsss:',item);
                for(let inner=0; inner<item.length; inner++){
                    //console.log('sss:',s);
                    if(inner==0){
                        takeper_slice_info[s]['info'].push(inner);
                    }
                    if(item[inner+1]){
                        if(item[inner+1]-item[inner] >1){
                            is_not_continues=true;//불연속적인 경우
                            takeper_slice_info[s]['info'].push(inner+1);//2index,3index,...ends...
                        }
                    }
                }
                takeper_slice_info[s]['is_not_continues']=is_not_continues;
                is_not_continues=false;
            }
            console.log('CONVERT takeper_slice_meta:',takeper_slice_info);

            let takeper_slice_arrays=[];
            for(let t=0; t<takeper_slice_info.length; t++){

                takeper_slice_arrays[t]={};
                takeper_slice_arrays[t]['takeindex']=takeper_slice_info[t].takeindex;
                takeper_slice_arrays[t]['info']=[];
                let sliceinfo=takeper_slice_info[t]['info'];
                
                if(takeper_slice_info[t]['is_not_continues']==true){
                    for(let inner=0; inner<sliceinfo.length;inner++){
                        let start_slice=sliceinfo[inner];//3,4 ->>>4-3
                        let next_element=sliceinfo[inner+1];//4
                        if(next_element){
                            let slice_copy=takeper_timerange_meta[t]['info'].slice(start_slice,next_element);//3,7였다면 3에서 7전 인댁스까지자름.
                            takeper_slice_arrays[t]['info'].push(slice_copy);
                        }else{
                            let slice_copy=takeper_timerange_meta[t]['info'].slice(start_slice);//4index 위치부터 전체를 다 자른다>>
                            takeper_slice_arrays[t]['info'].push(slice_copy);
                        }
                    }
                }
                
                if(takeper_slice_info[t]['is_not_continues']==false){//불연속적 부분이 있어서 쪼개지는게 없는 take인 상황일때.
                    console.log('===>>쪼개어진 정보가 없는 takeindex',t+1,takeper_slice_info[t],takeper_timerange_meta[t]['info']);
                    
                    takeper_slice_arrays[t]['info'].push(takeper_timerange_meta[t]['info']);                     
                }
            }
            console.log('takeper slice arraysss:',takeper_slice_arrays);
            
            let takeper_timespace_array=[];
            let takeper_timetemp=[];

            for(let ss=0; ss<takeper_slice_arrays.length; ss++){
                let item=takeper_slice_arrays[ss];
                                    
                let item_info=item['info'];
                for(let j=0; j<item_info.length; j++){
                    let store={};
                    store['takeindex']=item['takeindex'];
                    store['info']=item_info[j];
                    
                    takeper_timetemp.push(store);
                }
            }
            console.log('takeper_timetemp',takeper_timetemp);
            
            let sort_results= takeper_timetemp.sort(function(a,b){
                let left=parseInt(a['info'][0]);
                let right=parseInt(b['info'][0]);

                if(left < right){
                    return -1;
                }
                if(left > right){
                    return 1;
                }
                return 0;
            });
            takeper_timespace_array=takeper_timetemp;
            console.log('takeper_timetemp firsttimme starts order',takeper_timetemp);

            //빈공간empty blank screen data추가>>
            let video_blackempty_spaces_array=[];
            for(let black=0; black<takeper_timetemp.length; black++){
                let outer=takeper_timetemp[black];
                let outer_childs=takeper_timetemp[black]['info'];
                let takeindex=takeper_timetemp[black]['takeindex'];

                for(let inner=0; inner<outer_childs.length; inner++){
                    let value=outer_childs[inner];
                    if(inner==outer_childs.length-1){
                        console.log('해당 배열소속outer및 마지막index도달, 다음 outer대상체 존재여부체크:',outer,value);
                        if(takeper_timetemp[black+1]){
                            console.log('다음 outer대상체takepart의 첫 info원소요소:',takeper_timetemp[black+1]['info']);
                            let nextpart_starttime=takeper_timetemp[black+1]['info'][0];
                            if(nextpart_starttime - value >= 1){
                                let store={};
                                store['info']=[];
                                store['takeindex']='blackempty';
                                store['depency_insert_index'] = black+1;
                                for(let insert=value+1; insert<nextpart_starttime; insert++){
                                    store['info'].push(insert);
                                }
                                video_blackempty_spaces_array.push(store);
                            }
                        }else{
                            console.log('다음 outer대상체takepart가 없는 마지막 timepart부분',outer.info,value);
                            let store={};
                            store['info']=[];
                            store['takeindex']='blackempty';
                            store['depency_insert_index']= black+1;
                            for(let insert=value+1; insert<=30; insert++){
                                store['info'].push(insert);
                            }
                            video_blackempty_spaces_array.push(store);
                        }
                    }
                    if(inner==0 && black==0){
                        console.log('가장 첫 시작start요소인경우에만, 그 시작start시간부분 관련 범위추출:',outer,value);
                        let store={};
                        store['info']=[];
                        store['takeindex']='blackempty';
                        store['depency_insert_index'] = 0;

                        for(let fs=1; fs<value; fs++){
                            store['info'].push(fs);
                        }
                        video_blackempty_spaces_array.push(store);
                    }
                }
            }

            console.log('video_balckempty_spacess_array:',video_blackempty_spaces_array);
            video_blackempty_spaces_array= video_blackempty_spaces_array.filter((element)=>element['info'].length>=1);
            /*for(let bb=0; bb<video_blackempty_spaces_array.length; bb++){
                let bb_item=video_blackempty_spaces_array[bb];
                let insert_target_index=bb_item['depency_insert_index'];
                if(bb_item['info'].length>=1){
                    takeper_timetemp.splice(insert_target_index+addon_depth,0,bb_item);
                }

            }*/
            console.log('video_balckempty_spacess_array:',video_blackempty_spaces_array);

            takeper_timetemp = takeper_timetemp.concat(video_blackempty_spaces_array);
            console.log('takeper timetempss:',takeper_timetemp);
            let sort_resultsss= takeper_timetemp.sort(function(a,b){
                let left=parseInt(a['info'][0]);
                let right=parseInt(b['info'][0]);

                if(left < right){
                    return -1;
                }
                if(left > right){
                    return 1;
                }
                return 0;
            });
            console.log('[[[[[[[[[[[[[takeper timetempss:]]]]]]]]]]]]]]',takeper_timetemp);


            var cell=takevideocut_visual.current;
            while(cell.hasChildNodes()){
                cell.removeChild(cell.firstChild);
            }
            
            for(let o=0; o<takeper_timetemp.length; o++){
                let item=takeper_timetemp[o];
                let item_info=item['info'];
                let takeindex=item['takeindex'];

                let taketimepart_elementWrap=document.createElement('DIV');
                taketimepart_elementWrap.style.overflow='hidden';
                taketimepart_elementWrap.style.position='relative';
                taketimepart_elementWrap.style.width=`${parseFloat(100/30)*item_info.length}%`;
                taketimepart_elementWrap.style.height='100%';
                //taketimepart_elementWrap.innerText=takelist[takeindex-1]['clientsrc'];
                if(takeindex=='blackempty'){
                    taketimepart_elementWrap.style.backgroundColor='rgba(0,0,0,0.8)';
                }else{
                    taketimepart_elementWrap.style.backgroundColor=takecolor[takeindex-1];

                    /*let video_child=document.createElement('VIDEO');
                    video_child.src=takelist[takeindex-1]['clientsrc'];
                    video_child.load();
                    video_child.style.width='auto';
                    video_child.style.height='100%';
                    video_child.style.position='absolute';
                    video_child.style.left='50%';video_child.style.top=0;
                    video_child.style.transform='translateX(-50%)';
                    video_child.style.zIndex=-1;
                    taketimepart_elementWrap.appendChild(video_child);*/
                    let img_child=document.createElement('IMG');
                    img_child.src=thumbnaillist[takeindex-1];
                    img_child.style.width='100%';
                    img_child.style.height='auto';
                    img_child.style.position='absolute';
                    img_child.style.left="50%";img_child.style.top=0;img_child.style.transform='translateX(-50%)';
                    img_child.style.zIndex=-1;
                    taketimepart_elementWrap.appendChild(img_child);
                }
       
                /*for(let inner=0; inner<item_info.length; inner++){
                    let taketimepart_element=document.createElement('DIV');
                    if(takeindex=='blackempty'){
                        taketimepart_element.style.backgroundColor='rgba(0,0,0,0.8)';
                    }else{
                        taketimepart_element.style.backgroundColor=takecolor[takeindex-1];
                    }

                    taketimepart_element.style.width=parseFloat(100/30)+'%';//3.333333333
                    taketimepart_element.style.height='100%';
                    taketimepart_elementWrap.appendChild(taketimepart_element);
                }*/

                cell.appendChild(taketimepart_elementWrap);
            }

            //final convertss
            for(let o=0; o<takeper_timetemp.length; o++){
                let item=takeper_timetemp[o];
                let item_info=item['info'];
                let takeindex=item['takeindex'];
                let remoteurl=remoteurllist[takeindex-1];
                item['remoteurl'] = remoteurl;
                let item_lastindex=item_info.length-1;

                let first_startpos=item_info[0];
                let last_endpos=item_info[item_lastindex];
                item['startpos']=first_startpos-1;
                item['endpos']=last_endpos;
               // item_info.splice(0,0,first_startpos-1);
            }

            setStandbydata_final({
                music:getParams.music,
                musictransitiontype:'opencv',
                remote_url_list:remoteurllist,
                take_video_cutprocess_info : takeper_timetemp
            });
            setTakebarEdit(true);
        }     
    },[standbydata]);

    const videoCutAction=async ()=>{
        console.log('videoCut action호출:',standbydata_final);

        setLodingModal(true);
        console.log(JSON.stringify(standbydata_final['take_video_cutprocess_info']));

        let take_video_cutprocess_info=standbydata_final['take_video_cutprocess_info'];
        let takeindex_count=0;//black video 가 아닌 테이크비디오분할부분의 수가 딱 한개이면서도 동시에 remote_url_list 선택비디오수가 한개(원테이크 빼박)였던 경우 모두 만족하는경우는 원테이크케이스로 간주되며, 이 경우에는.무조건take개수는 한개이기에.
        if(take_video_cutprocess_info.length==0){
            alert("타임라인에 처리할 비디오가 없습니다!");
            return false;
        }
        for(let f=0; f<take_video_cutprocess_info.length; f++){
            if(take_video_cutprocess_info[f].takeindex !='blackempty'){
                takeindex_count++;
            }
        }
        if(takeindex_count==1 && remoteurllist.length==1){
            take_video_cutprocess_info = take_video_cutprocess_info.filter(element=> element.takeindex!='blackempty');//순수 takeindex비디오만 (한개)남김.
        }
        let formdata=new FormData();
        formdata.append('user_id',userData.user_id ? userData.user_id : 30);
        formdata.append('upload_list_data',standbydata_final.remote_url_list.join(','));
        //formdata.append('take_video_cutprocess_info',JSON.stringify(standbydata_final.take_video_cutprocess_info));
        formdata.append("take_video_cutprocess_info",JSON.stringify(take_video_cutprocess_info));

        let res=await serverController.connectFetchController(`media/videosplit_start`,'POST',formdata);
        if(res){
            console.log('result sressss:',res);

            //cutvideo.current.src=res.result;
            setvideosrc(res.result);
            cutvideo.current.ontimeupdate=(event)=>{
                let target=event.target;
                console.log('the video currentTime attritubeth has been updatedd!!!:',event.target,target.currentTime);
                let now_time=parseInt(target.currentTime);
                console.log('now left:',(-0.3333333 + (parseFloat(100/30)*now_time)) );
                if(playstatus && playstatus.current)
                    playstatus.current.style.left=(-0.3333333 + (parseFloat(100/30)*now_time))+'%';
            }
            console.log('edittake_video_list resultssss:',res['edittake_video_list']);
            setStandbydata_final({
                music:getParams.music,
                musictransitiontype:'opencv',
                remote_url_list:remoteurllist,
                //take_video_cutprocess_info: standbydata_final.take_video_cutprocess_info,//이시점에는 필요없음.>>
                take_video_cutprocess_info: take_video_cutprocess_info,
                takeedit_video_list : res['edittake_video_list'],//편집처리된 비디오url리스트 넘기면 될뿐임.
                //common_timebase : res['common_timebase']
            });
            setIsstandby(true);
            setLodingModal(false);
        }
    }


    return (
        <>
            <CameraDefault preview={false} next={'/edit/preview'} nextPossible={isstandby} nextParameter={standbydata_final} camera={false}>
                <MediaProgressbar>
                    <p>Process 관련 연산처리중입니다.(트랜지션,필터&오버레이등..)</p>
                </MediaProgressbar>
                <MediaProgressbar>
                    <p>Process 관련 연산처리중입니다.(업로드영상 인코딩중FFMPEG)</p>
                </MediaProgressbar>
                <input type='hidden' name='upload_encoded_form_data' id='upload_encoded_form_data'/>
                <div id='video_between_transition_startendArea'>

                </div>
                <div id='take_video_imgpart_total'></div>
                <div id='random_overlay_serveframesArea'></div>

                <EditTakeWrap>
                    <CutVideoPreview>
                        <CutVideo ref={cutvideo} src={videosrc} controls></CutVideo>
                    </CutVideoPreview>
                    <EditToolWrap>
                        <EditToolList>
                            <CutBtn src={iconMediaCut} alt="" on={takebarEdit}onClick={videoCutAction}/>
                            {/*<PlayBtn src={iconPlay} alt=""/>*/}
                        </EditToolList>
                       {/* <ToolTimeWrap>
                            <ToolTime>00:00</ToolTime>
                            <ToolTotalTime>00:00</ToolTotalTime>
                        </ToolTimeWrap>*/}
                    </EditToolWrap>
                   
                    {/* take list */}
                    <EditTakeImgWrap>
                        <TakeBtnWrap><PrevBtn src={iconTakePrev} alt="" /></TakeBtnWrap>
                        <TakeImgList>
                            <PlayStatus ref={playstatus}></PlayStatus>
                            <TakeImgListWrap className='video_upload_area' id='video_upload_area' ref={takevideocut_visual}>                            
                            </TakeImgListWrap>
                            
                            {/*
                                takelist.map((value,index)=>{

                                    return(
                                        <TakeImgBox className='upload_video_element' style={{width: (92/takelist.length)+'%'}} takeindex={index+1} id={`take${index+1}_video`} key={index + 'edit take list'}>
                                            {<TakeImg src={CameraBg} alt="" />
                                            <Textss>{`take${index+1}`}</Textss>
                                            <TakeVideo src={value.src} alt='' id={`upload_video${index}`}></TakeVideo>
                                        </TakeImgBox>
                                    )
                                })
                            */
                            }

                        </TakeImgList>
                        <TakeBtnWrap><NextBtn src={iconTakeNext} alt="" /></TakeBtnWrap>
                    </EditTakeImgWrap>

                    {/* bg */}
                    <EditTakeImgWrap>
                        <TakeBtnWrap><div><PrevBtn src={iconTakeBg} alt="" /><BgText>BGM</BgText></div></TakeBtnWrap>
                        <EditBgWrap>
                            <EditBgInner>
                                <BgTitle style={{width: `100%`}}>Filter_1 / Clara Mae</BgTitle>
                                <EditBgBar style={{width: `100%`}}/>
                            </EditBgInner>
                            <EditBgArea/>
                        </EditBgWrap>
                    </EditTakeImgWrap>

                    {/* take edit */}
                    <EditTakeContent id='video_editing_area' className='editing_area'>
                        <TimesecondGridArea className='timesecond_grid_area'>
                            {
                                timegridarray.map((value,index)=>{
                                    return(                            
                                    <TimeGrid className='time_grid' id={`index${value+1}`}>
                                        
                                    </TimeGrid>
                                    )
                                })
                            }

                         {/*onTouchMove={(e)=>{onTakeMoveEvent(e,index)}} onTouchStart={onTakeMoveDown} onTouchEnd={onTakeMoveUp}
                            onMouseMove={(e)=>{onTakeMoveEvent(e,index)}} onMouseDown={onTakeMoveDown} onMouseUp={onTakeMoveUp}>*/
                        }
                        </TimesecondGridArea>
                        <TakeContentsWrap>
                        {
                            //take비디오가 단일 한개인경우에는 쪼개진 두개의 테이크를 이동시키는 로직flow는 없앤다.
                            takelist.map((value,index)=>{

                                let videoJsOptions = {
                                    autoplay: true,
                                    loop:true,
                                    muted:true,
                                    playbackRates: [0.5, 1, 1.25, 1.5, 2],
                                    width: "100%",
                                    height: "100%",
                                    controls: true,
                                    sources: [
                                      {
                                        src: `${value['src']}`,
                                        type: 'video/mp4',
                                      },
                                    ],
                                  };
                                return(
                                    <TakeContent key={index+1 +'edit take'} id={`take${index+1}_area`} className={`take_row`} onMouseUp={ video_takecontrol_mouseup} onTouchEnd={video_takecontrol_touchend}
                                    >
                                        <EditTakeText>
                                            <Texts>TAKE {index+1}</Texts>
                                        </EditTakeText>
                                        <EditTakeImg >
                                            <EditTakeControl className={"videotake_control"} dataset-take={index+1} id={`control${index+1}`} original_duration='20' change_duration='20' startpos='0' endpos='0' onMouseDown={video_takecontrol_mousedown} onTouchStart={video_takecontrol_touchstart}>
                                                {/*<TakeImg src={CameraBg} alt="" />*/}
                                                <LeftControl className='video_left_duration_control'></LeftControl>
                                                <RightControl className='video_right_duration_control'></RightControl>
                                            </EditTakeControl>
                                            <OriginalTakeImg original_duration='30'id={`control${index+1}_original`}>
                                                <OriginalDuration ></OriginalDuration>
                                                {/*<EditTakeVideoE>
                                                    <VideoPlayer 
                                                    controls={true}
                                                    src={value['src']}
                                                    width={"100%"}
                                                    height={"100%"}
                                                    autoplay={true}
                                                    hideControls={['volume','seekbar','timer','playbackrates','fullscreen']}
                                                    preload={"auto"}
                                                    />
                                                </EditTakeVideoE>*/}
                                               <EditTakeVideoE src={value['clientsrc']}>
                                               </EditTakeVideoE>
                                            </OriginalTakeImg>   
                                        </EditTakeImg> 
                                                                         
                                    </TakeContent>
                                )
                            })
                        }
                        </TakeContentsWrap>
                    </EditTakeContent>
                    
                </EditTakeWrap>
            </CameraDefault>
            {
                lodingModal &&
                <LodingModal/>
            }
        </>
    );
}

const MediaProgressbar = styled.div`
    position:fixed;background-color:rgba(50,200,240,0.5);flex-flow:row wrap;justify-content:center;align-items:center;color:white;
    font-size:40px;font-weight:bold;display:none; width:50%;height:50%;z-index:9;left:50%;top:50%;transform:translateX(-50%)translateY(-50%)
`
const VideoTest = styled.video`
    width:calc(100vw * (240 / 480));height:calc(100vw * (160 / 480));
    background-color:rgba(50,50,50,0.8);
`
const EditTakeWrap = styled.div`
    background: rgba(1,1,1,0.28);position:relative;
`

const Fileuploadform= styled.div`
    display:flex;
    align-items:center;
    justify-content: space-between;
    flex-flow:row wrap;
    padding: calc(100vw*(7/428)) calc(100vw*(25/428));
    background-color:rgba(100,100,0,0.5);

`
const EditToolWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(100vw*(7/428)) calc(100vw*(25/428));
`
const EditToolList = styled.div`
    display: flex;
    align-items: center;
`
const CutVideoPreview = styled.div`
    display:block; width:100%;height:calc(100vw * (9/16));padding:0 calc(100vw * (38/428));
`
const CutVideo = styled.video`
    width:100%;height:100%;opacity:0.8
`
const CutBtn = styled.img`
    width: calc(100vw*(28/428));height:calc(100vw * (28/428));
    cursor: pointer;
    ${({on})=>{
        return on ?
        `display:block`
        :
        `display:none`
    }}
`
const PrevBtn = styled.img`
    width: calc(100vw*(35/428));
    cursor: pointer;
    
`
const PlayBtn = styled.img`
    width: calc(100vw*(22/428));
    margin: 0 calc(100vw*(26/428));
    cursor: pointer;
`
const NextBtn = styled(PrevBtn)``
const ToolTimeWrap = styled.div`
    display: flex;
    align-items: center;
`
const ToolTime = styled.p`
    font-size: calc(100vw*(16/428));
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
    margin-right: calc(100vw*(20/428));
`
const ToolTotalTime = styled(ToolTime)`
    font-size: calc(100vw*(9/428));
    margin: 0 calc(100vw*(30/428));
`

// take list
const EditTakeImgWrap = styled.div`
    display: flex; 
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: calc(100vw*(5/428));
`
const TakeBtnWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100vw*(38/428)); height: calc(100vw*(75/428));
    background: rgba(255,255,255,0.6);
    cursor: pointer;
`
const TakeImgList = styled.div`
   display:block; position:relative;
`
const TakeImgListWrap = styled.div`
    display: flex; position:relative;
    align-items: center;
    justify-content: flex-start;
    width: calc(100vw*(342/428)); height: calc(100vw*(75/428));
    padding: calc(100vw*(6/428)) 0;
    background: rgba(255,255,255,0.3);
`
const PlayStatus=styled.div`
    height:100vh;display:block;width:1px;background-color:red;position:absolute;top:0;left:-0.3333333%;z-index:3;

`
const TakeImgBox = styled.div`
    position: relative;
    height: 100%;
    border:1px solid purple;
    /*&:first-child {padding: 0 calc(100vw*(2/428)) 0 0;}
    &:last-child {padding: 0 0 0 calc(100vw*(2/428));}*/
    &:last-child::after {display: none;} 
    /* &::after {content:''; position: absolute; top: 0; right: 0; display: block;
    width: 1px; height: calc(100vw*(350/428)); border-left: 1px dashed rgba(255,255,255,0.5); z-index: 100;} */
`
const TakeImg = styled.img`
    width: 100%; height: 100%;
    object-fit: cover;
`
const TakeVideo = styled.video`
    width: 100%; height: 100%; background-color:#808080
    object-fit: cover;
`
const Textss = styled.p`
    width:100%;height:100%;display:flex;position:absolute;left:50%;top:50%;transform:translateX(-50%)translateY(-50%);color:purple;
    justify-content:center;align-items:center;z-index:8; font-weight:bold;
`
const BgText = styled.p`
    font-size: calc(100vw*(10/428));
    text-align: center;
    color: #fff;
`
const EditBgWrap = styled.div`
    display: flex;
    align-items: center;
    width: calc(100vw*(384/428));
`
const EditBgInner = styled(TakeImgList)`
    display: block;
    width: calc(100vw*(341/428));
`
const EditBgBar = styled.div`
    height: calc(100vw*(26/428));
    background: #CCE3E3;
    margin: 0 auto;
`
const BgTitle = styled.p`
    font-size: calc(100vw*(10/428));
    color: #fff;
    margin: 0 auto;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
    margin-top: calc(100vw*(8/428));
    margin-bottom: calc(100vw*(4/428));
`
const EditBgArea = styled.div`
    width: calc(100vw*(43/428)); height: calc(100vw*(75/428));
    background: rgba(255,255,255,0.3);
`

// 테이크편집영역전체
const EditTakeContent = styled.div`
    width: 100%; min-height:calc(100vw *(214/428));
    height:auto;position:relative;
    background: rgba(255,255,255,0.3);
    padding: 0 0 calc(100vw*(40/428));
    
    &::-webkit-scrollbar-track {background-color:rgba(255,255,255,0);}
    &::-webkit-scrollbar {width:calc(100vw*(6/428));}
    &::-webkit-scrollbar-thumb {background-color:rgba(255,255,255,0.5)}
`
const TimesecondGridArea = styled.div`
    width:100%;height:auto; position:absolute; /*padding:0 calc(100vw * (8/428));*/left:0;top:0;height:100%;z-index:0;display:flex;flex-flow:row nowrap; padding:0 calc(100vw * (38/428));
`
const TimeGrid = styled.div`
    width:calc(100% / 30);border-left:calc(100vw * (1/360)) solid #fedf20;border-right:calc(100vw * (1/360)) solid #fedf20;height:100%;color:white;display:flex;flex-flow:row wrap;align-items:flex-start;justify-content:center;font-size:8px;
`
const TakeContentsWrap= styled.div`
    width:100%;position:absolute;height:100%;left:0;top:0;
    overflow-x: hidden;
    &::-webkit-scrollbar{
        display:none;
    }
`
const TakeContent = styled.div`
    /*width: calc(100vw*(342/428));*/
    width:100%; position:relative;
    /*padding: calc(100vw*(12/428)) 0 calc(100vw*(14/428));*/
    padding:0 calc(100vw * (38/428));
    margin:calc(100vw * (12 /428)) 0; display:none;
    /* &:first-child div {margin-left: calc(100vw*(85/428));}
    &:nth-child(2) div {margin-left: calc(100vw*(152/428));}
    &:nth-child(3) div {margin-left: calc(100vw*(178/428));}
    &:nth-child(4) div {margin-left: calc(100vw*(218/428));}
    &:nth-child(5) div {margin-left: calc(100vw*(258/428));} */
`
const EditTakeImg = styled.div`
    position: relative; width:100%;
    height: calc(100vw*(105/428));z-index:2;
`
const EditTakeControl = styled.div`
    position:absolute;left:0;top:0;width:20%;height:100%;
`
const OriginalTakeImg = styled.div`
    position:absolute;width:100%;height:calc(100vw *(105/428));bottom:0;left:0;background-color:rgba(0,0,0,0);z-index:-1;overflow:hidden;
`
const EditTakeVideoE = styled.img`
    height:auto;width:100%;display:block;position:absolute;left:50%;top:0;transform:translateX(-50%);z-index:3
`
const OriginalDuration = styled.div`
    width:100%;height:100%;display:flex;flex-flow:row nowrap;justify-content:center;align-items:center;color:white;position:relative;z-index:5
`

const LeftControl = styled.div`
    position:absolute; top:calc(100vw *(0/428)); left:0;
width:calc(100vw * (15/428)); height:calc(100vw*(105/428)); background:#fff; border-radius: calc(100vw*(2/428)); z-index:10
`
const RightControl = styled.div`
    position:absolute; top:calc(100vw *(0/428));right:calc(100vw*(-8/428));
    width:calc(100vw*(15/428));height:calc(100vw*(105/428));background:#fff; border-radius: calc(100vw * (2/428)); z-index:10
`
const EditTakeText = styled.div`
    width: 100%;  height:calc(100vw *(18/428));
    margin-bottom: calc(100vw*(5/428)); position:relative;
`
const Texts=styled.p`
color: #fff; position:absolute;left:-10%;top:0;text-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
font-size: calc(100vw*(10/428));line-height:calc(100vw*(18/428)); height:100%;width:100%;
`

