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
import scrollbar1 from '../../../img/img/scroll1.png';
import scrollbar2 from '../../../img/img/scroll2.png';
import scrollbar3 from '../../../img/img/scroll3.png';
import scrollbar4 from '../../../img/img/scroll4.png';
import scrollbar5 from '../../../img/img/scroll5.png';

import ScrollHorizontal from '../../../img/img/scroll.png';

import scrollDown from '../../../img/img/scrollDown.png';

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

    const [takecolor,settakecolor] = useState(['rgba(58,200,220,0.6)','rgba(228,50,50,0.6)','rgba(180,100,220,0.6)','rgba(55,160,50,0.6)','rgba(228,180,40,0.6)'])
    let commonUtil_use=CommonUtil()();

    const takevideocut_visual=useRef();
    const timelineTarget=useRef();
    const cutvideo=useRef();
    const playstatus = useRef();
    const originalvideoScrollicon=useRef();
    const [videosrc,setvideosrc] = useState("");

    const [takecontrolvalid,settakecontrolvalid] = useState([]);
    //const getParams = location.state.nextParameter;
    //console.log('===>eidtTake 전달받은 파라미터데이터:',getParams);

   
    //playerSeek관련 재생제어관련
    const [playerSeek,setPlayerSeek] =useState({});
    //const [playbarstatus,setPlaybarStatus] = useState("");
    const playballview=useRef();
    useEffect(()=>{
        //android
        document.addEventListener("message",async (event) =>{
            let test_data=JSON.parse(event.data);
            //alert(event.data);
            
            let takefilelist=test_data['takefilelist'];//takefilelist를 받는다.
            let playbarstatus=test_data['playbarstatus'];
            let thumbnaillist=test_data['thumbnaillist'];
            let type=test_data['type'];
            if(takefilelist){
                setTakelist(takefilelist);
                setIsstandby(false);
    
                /*let initial=[];
                for(let i=0; i<takefilelist.length; i++){
                    console.log('takefileslistsss:',takefilelist[i]);
                    initial.push(true);//기본값은 true,true,true로한다.
                }
                console.log('initailsss:',initial);
               // settakecontrolvalid(initial);*/
            }
            if(playbarstatus>=0){
                //재생중 매초마다 통신받은 관련된 정보로 하여 동적으로 관련요소 갱신.
                //setPlaybarStatus(playbarstatus);//0~30초의숫자정수값.재생중일때마다 계속 호출된다.
               // playballview.current.style.left=3.333*(parseInt(playbarstatus)-1)+'%';
                //playstatus.current.style.left=3.333*(parseInt(playbarstatus)-1)+'%';0,1,2,3,4,5,6.....30까지넘어온다.
                //3.333*0~30
                playballview.current.style.left=3.333*(parseInt(playbarstatus))+'%';
                playstatus.current.style.left=3.333*(parseInt(playbarstatus))+'%';
            }
            if(type=='thumbnailGet' && thumbnaillist){
                setthumbnaillist(thumbnaillist);
            }
           
            /*setStandbydata({
                music: ,
                musictransitiontype: "opencv"
            })*/
        });
        //let initial=[false,false,false];
       
        //console.log('initailsss:',initial);
        //settakecontrolvalid(initial);
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
        
        //player관련
        let time_grid_elements_player= document.getElementsByClassName("time_grid_player");

        function touchstart_module(event){
           // event.preventDefault();

            move_target= event.target;

            console.log('===>>터치 대상 move_targetss:',move_target,move_target.classList,move_target.className);

            if(move_target.className.indexOf('videotake_control')==-1){
                if(move_target.className.indexOf("videotake_original")!=-1){
                    move_target=event.target.parentElement;
                    move_parentTarget=move_target;
                    console.log("videotake_original요소자체를이동시키려는 경우 이동연산만::",move_target);

                    if(originalvideoScrollicon&&originalvideoScrollicon.current){
                        originalvideoScrollicon.current.style.display='flex';
                        move_target.style.boxShadow="0 0 4px 4px rgba(150,20,230,0.5)";
                    }
                }else{
                    //좌우 리사이즈 요소 관련처리한경우
                    console.log('videoTkae_control요소가 아님!:',move_target,event.target);
                    move_target=event.target;
                    move_parentTarget=move_target.parentElement;//부모요소 해당 좌우요소의 부모요소(element자체)
                }
               
            }else if(move_target.className.indexOf("videotake_control")!=-1){
                //비디오컨트롤요소 자체를처리하는 경우(위치이동)
                move_target=event.target;
                move_parentTarget=move_target;
            }
           
            isdrag=true;
        }  
        function touchmove_module(event){
            //let current_target= event.target;
            //console.log('touchmove_module 관련 객체:',current_target,event.target,event.changedTouches[0],event.changedTouches[0].clientX,event.changedTouches[0].clientY);
            
            console.log('현재 관련 이동대상타깃:',move_target);
            console.log('isDrags값:',isdrag);
            if(isdrag){
                let move_x = event.changedTouches[0].clientX;
                //let move_y = event.changedTouches[0].clientY;
                
                console.log('touchmobrd이벤트발생 mobrd 당시떄의 offset위치정보값:',move_x,move_object_pos);

                if(move_target.className.indexOf('videotake_original_')!=-1){
                   
                    if(originalvideoScrollicon&&originalvideoScrollicon.current){
                        originalvideoScrollicon.current.style.display='flex';
                        move_target.style.boxShadow="0 0 4px 4px rgba(150,20,230,0.5)";
                    }
                    console.log('videotake_original요소를 이동시키려고 하는 경우<<TOUCH move>>',move_target);
                    
                    let prev_x=move_object_pos['x'];//마지막 xleft pos값.
                    let adapt_secondpos=0;
                    let move_distance=move_x - prev_x;//양수일떄 우측이동,음수일때 좌측이동.
                    console.log('==>>move_distancessssss(touchMove) originalvideoMove',move_distance);
                    if(move_distance <= -0.5){
                        //left이동
                        console.log('===>오리지널비디오 left이동====>>>>',move_x,prev_x,move_distance);
                        adapt_secondpos=-1;

                        //터치로 끄는형태로 move발생때마다 매번 이동한 방향에 따라서처리.어디로 이동했는지여부에따라.

                        //let adapt_final_targetindex = distance_array[0].index;
                        let prev_startpos=parseInt(move_target.getAttribute("startpos"));
                        let prev_endpos=parseInt(move_target.getAttribute("endpos"));
                        let prev_fixed_duration=parseInt(move_target.getAttribute("original_duration"));

                        console.log('===>originalVideo기존 prevstart,endpos:',prev_startpos,prev_endpos,prev_fixed_duration);

                        let adapt_final_targetindex =  prev_startpos + adapt_secondpos;//adapt startpos 매 touchmove or end상황 한번 발생시마다 +1or -1씩의 timeline abstraxct secondpos값 startpos~endpos값갱신합니다.
                        adapt_final_targetindex = adapt_final_targetindex>=28?28:adapt_final_targetindex;//28이상의값은 범위론 못가게처리.
                        let adapt_endpos= adapt_final_targetindex + prev_fixed_duration;//endpos는 startpos + original_duration길이공식.
                        adapt_endpos = adapt_endpos<=2?2:adapt_endpos;//2이하의값은 범위론못가게처리.
                        adapt_final_targetindex = adapt_endpos - prev_fixed_duration;

                        console.log('===>originalVideo변경 adaptstart,endpos:',adapt_final_targetindex,adapt_endpos);

                        // move_target.style.left = 3.333*(adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('original_duration'))/2)-1)+'%';
                        move_target.style.left= 3.333*(adapt_final_targetindex)+'%';

                        move_target.setAttribute("endpos",adapt_endpos);
                        move_target.setAttribute("startpos",adapt_final_targetindex);
                        /*let adapt_startpos=adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('original_duration'))/2)-1;

                        let original_duration=parseInt(move_target.getAttribute('original_duration'));

                        let adapt_endpos=adapt_startpos+original_duration;

                        move_target.setAttribute("endpos",adapt_endpos);
                        move_target.setAttribute("startpos",adapt_startpos)
                        console.log('[[[[[[moving adapt start~end poss]]]]]] (원본영상):',adapt_startpos,adapt_endpos);;*/
                    }else if(move_distance >= 0.5){
                        //right우측이동
                        console.log('===>오리지널비디오right이동=====>>>>',move_x,prev_x,move_distance);
                        adapt_secondpos=1;

                        //let adapt_final_targetindex = distance_array[0].index;
                        let prev_startpos=parseInt(move_target.getAttribute("startpos"));
                        let prev_endpos=parseInt(move_target.getAttribute("endpos"));
                        let prev_fixed_duration=parseInt(move_target.getAttribute("original_duration"));

                        console.log('===>originalVideo기존 prevstart,endpos:',prev_startpos,prev_endpos,prev_fixed_duration);

                        let adapt_final_targetindex =  prev_startpos + adapt_secondpos;//adapt startpos 매 touchmove or end상황 한번 발생시마다 +1or -1씩의 timeline abstraxct secondpos값 startpos~endpos값갱신합니다.
                        adapt_final_targetindex = adapt_final_targetindex>=28?28:adapt_final_targetindex;//28이상의값은 범위론 못가게처리.

                        let adapt_endpos= adapt_final_targetindex + prev_fixed_duration;//endpos는 startpos + original_duration길이공식.
                        adapt_endpos = adapt_endpos<=2?2:adapt_endpos;//2이하의값은 범위론못가게처리.
                        adapt_final_targetindex = adapt_endpos - prev_fixed_duration;

                        // move_target.style.left = 3.333*(adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('original_duration'))/2)-1)+'%';
                      
                        console.log('===>originalVideo변경 adaptstart,endpos:',adapt_final_targetindex,adapt_endpos);

                        move_target.style.left= 3.333*(adapt_final_targetindex)+'%';

                        move_target.setAttribute("endpos",adapt_endpos);
                        move_target.setAttribute("startpos",adapt_final_targetindex);
                        /*let adapt_startpos=adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('original_duration'))/2)-1;

                        let original_duration=parseInt(move_target.getAttribute('original_duration'));

                        let adapt_endpos=adapt_startpos+original_duration;

                        move_target.setAttribute("endpos",adapt_endpos);
                        move_target.setAttribute("startpos",adapt_startpos)
                        console.log('[[[[[[moving adapt start~end poss]]]]]] (원본영상):',adapt_startpos,adapt_endpos);;*/
                    }                  
                    
                }
                else if(move_target.className.indexOf('videotake_control')!=-1){
                    console.log('videotakeControl요소 자체를 이동시키려고 하는 경우:',move_target);
                    //let adapt_x= move_object_pos['x'];
                    let distance_array=[];

                    let rel_object_original=move_target.getAttribute("id").replace("control","");
                    rel_object_original=document.getElementById(`control${rel_object_original}_original`);
                    let rel_object_startpos=rel_object_original.getAttribute("startpos");
                    let rel_object_endpos= rel_object_original.getAttribute("endpos");

                    /*let rel_object=move_target.getAttribute("id").replace("control","");
                    let temp=[...takecontrolvalid];
                    temp[rel_object-1]=true;

                    rel_object=document.getElementById(`take${rel_object}_textValid`);
                    console.log('videotake original요소 움직여서,valid값 관련결정:',rel_object);
                    if(rel_object){
                        rel_object.innerText="";
                        rel_object.style.color='red';
                    }*/

                    for(let t=0; t<time_grid_elements.length; t++){
                        //console.log('===>touchendup당시떄의 adapt_x좌표 offsetX,clientX와 가장 가까운 대상찾기');
                        let item=time_grid_elements[t];
                        let item_parent=item.parentElement.offsetLeft;

                        //let offsetX=item.offsetLeft;
                        let offsetX = item_parent+ item.offsetLeft
                        //console.log('item offsetX,adapt_x:',offsetX);

                        let distance=Math.abs(move_x -offsetX);
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
                    //console.log('>>>정렬처리후에 distance_arrayss:',distance_array);
                    let adapt_final_target=distance_array[0].object;
                    console.log('===>대상타깃 leftoffsetX시작위치index값:',distance_array[0].index);
                    let adapt_final_targetindex = distance_array[0].index;

                    let adapt_startpos=adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('change_duration'))/2)-1;
                    let adapt_startpos_pos=adapt_startpos;
                    adapt_startpos_pos = adapt_startpos_pos < 0 ? 0 : adapt_startpos_pos;

                    /*let original_duration=parseInt(move_target.getAttribute('original_duration'));
                    let change_duration=parseInt(move_target.getAttribute("change_duration"));

                    adapt_startpos = adapt_startpos > rel_object_startpos ? adapt_startpos : rel_object_startpos;
                    adapt_startpos = adapt_startpos <= 0 ? 0:adapt_startpos;

                    let end_pos = adapt_startpos_pos + change_duration;

                    end_pos= end_pos > rel_object_endpos ?rel_object_endpos:end_pos;
                    end_pos = end_pos >= 30 ? 30 : end_pos;

                    move_target.setAttribute('startpos',adapt_startpos);
                    move_target.setAttribute('endpos',end_pos);

                    //move_target.style.left = 3.333*(adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('change_duration'))/2)-1)+'%';*/
                    console.log('takevideo target move statpossss:(position)',adapt_startpos_pos);

                    //console.log("=====>>video takebar move contolssss:",adapt_startpos,end_pos);
                    move_target.style.left= (3.333*adapt_startpos_pos)+'%';

                }else if(move_target.className.indexOf("video_left_duration_control")!=-1){
                    //이동연산 크기 연산 모두 진행>>
                    //console.log('videoleftdurationcontrol요소를 touchstartdown했다가 drag하여 touchmove한경우:',move_target,move_parentTarget);
                    //let adapt_x = move_object_pos['x'];
                    let distance_array=[];
                    let distance_array2=[];

                    let rel_object_original=move_parentTarget.getAttribute("id").replace("control","");
                    rel_object_original= document.getElementById(`control${rel_object_original}_original`);
                    let rel_object_startpos=rel_object_original.getAttribute("startpos");
                    let rel_object_endpos= rel_object_original.getAttribute("endpos");

                    /*let rel_object=move_parentTarget.getAttribute("id").replace("control","");
                    let temp=[...takecontrolvalid];
                    temp[rel_object-1]=false;
                    settakecontrolvalid(temp);

                    rel_object=document.getElementById(`take${rel_object}_textValid`);
                    console.log(`videotake original요소 움직여서,valid값 관련결정:`,rel_object);
                    if(rel_object){
                        rel_object.innerText='takebar를 움직여 편집할 최종상태를 결정해주세요';
                        rel_object.style.color='red';
                    }*/

                    let mother_object_offsetrightX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft']) + parseFloat(move_parentTarget.offsetLeft) + parseFloat(window.getComputedStyle(move_parentTarget,null)['width']);

                    for(let t=0; t<time_grid_elements.length; t++){
                        let item=time_grid_elements[t];
                        let item_parent=item.parentElement.offsetLeft;
                        let offsetX=item_parent + item.offsetLeft;
                        
                        let distance=Math.abs(move_x - offsetX);
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
                        //console.log('==>>hmmmm:',adapt_x,offsetX);
                        //console.log('===>>hmmmmm:',mother_object_offsetrightX,offsetX);
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
                    //adapt_final_targetindex =adapt_final_targetindex>=30?29:adapt_final_targetindex-1;
                    move_parentTarget.style.left = (3.333 * (adapt_final_targetindex>30?30:adapt_final_targetindex-1))+'%';
                    //2. mouseup이벤트 발생시점때에 motherElement의 offsetRight xleft값위치인접한 위치시작인댁스index-1 - adaptfinaltARGET INDEX값과의 차이값의 곧 IDNEX차이격차값이 각 인댁스는 일초값이고 이값 N% * s값 만큼의 폭을 가진다%폭으로 처리한다(반응형고려) 또한 몇초duration인지도 추적가능함.
                    
                    let adapt_final_posx_index=distance_array[0].index;//해당 이동할 위치와 moveMother object rightPosx와의 격차값은 새로 반영width크기이다.
                    let mother_object_offsetrightX_index= distance_array2[0].index;
                    console.log('adapt_final_posxIndex,mother_object_fofsetrightXindex:',adapt_final_posx_index,mother_object_offsetrightX_index);

                    let original_duration=parseInt(move_parentTarget.getAttribute('original_duration'));
                    let adapt_width_duration = mother_object_offsetrightX_index - adapt_final_posx_index;
                    console.log('적용 duration초 상수값::',adapt_width_duration);

                    if(adapt_width_duration >= 0 && adapt_width_duration < 2){
                        //alert('적용 duration이 1초는 되어야합니다.');
                        adapt_width_duration = 2;

                    }else if(adapt_width_duration > move_parentTarget.getAttribute('original_duration')){
                        //alert('영상 고유의 duration값보다 더 크게 지정하려고 했던경우.');
                        adapt_width_duration = move_parentTarget.getAttribute('original_duration');

                    }else if(adapt_width_duration < 0){
                        //alert('적용 duration이 유효하지 않습니다!!');
                        adapt_width_duration = 2;
                    }
                    move_parentTarget.setAttribute('change_duration',adapt_width_duration);
                    move_parentTarget.style.width = parseFloat( 3.333 * adapt_width_duration)+'%'; 

                    /*let start_pos=adapt_final_targetindex-1;
                    start_pos = start_pos > rel_object_startpos ? start_pos:rel_object_startpos;
                    start_pos = start_pos < 0 ? 0 : start_pos;

                    //변화 적용된 당시때의 change_duration값을 더해서 한다.
                    //let change_duration = parseInt(move_parentTarget.getAttribute('change_duration'));
                    let change_duration = adapt_width_duration;
                    let end_pos = (adapt_final_targetindex - 1) + change_duration;
                    end_pos = end_pos > rel_object_endpos ? rel_object_endpos: end_pos;
                    end_pos = end_pos >= 30 ? 30 : end_pos;*/

                    //move_parentTarget.setAttribute('endpos',end_pos);
                   // move_parentTarget.setAttribute('startpos',start_pos);

                   
                }else if(move_target.className.indexOf("video_right_duration_control")!=-1){
                    //console.log('videorightduraitoncontrol요소를 mousedown했다가 drag하여 touchendup한경우:',move_target,move_parentTarget);
                    //let adapt_x=move_object_pos['x'];
                    let distance_array=[];
                    let distance_array2=[];
                    let mother_object_offsetleftX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft'])+parseFloat(move_parentTarget.offsetLeft);

                    //let rel_object_original=move_parentTarget.getAttribute("id").replace("control","");
                    //let temp=[...takecontrolvalid];
                    //temp[rel_object_original-1]=false;
                    //settakecontrolvalid(temp);

                    let rel_object_original=move_parentTarget.getAttribute("id").replace("control","");
                    rel_object_original=document.getElementById(`control${rel_object_original}_original`);
                    let rel_object_startpos=rel_object_original.getAttribute("startpos");
                    let rel_object_endpos=rel_object_original.getAttribute("endpos");

                    /*let rel_object = move_parentTarget.getAttribute("id").replace("control","");
                    rel_object = document.getElementById(`take${rel_object}_textValid`);
                    console.log('videotake original요소 움직여서,valid값 관련결정:',rel_object);
                    if(rel_object){
                        rel_object.innerText='takebar를 움직여 편집할 최종상태를 결정해주세요';
                        rel_object.style.color='red';
                    }*/

                    for(let t=0; t<time_grid_elements.length; t++){
                        //console.log('mouseup당시때의 또한 대상타깃 offsetx,clientx대상 찾기');
                        let item=time_grid_elements[t];
                        let item_parent=item.parentElement.offsetLeft;

                        let offsetX=item_parent + item.offsetLeft;

                        let distance=Math.abs(move_x-offsetX);
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

                    if(adapt_width_duration >=0 && adapt_width_duration<2){
                        //alert('적용 druation이 1초는 되어야합니다.');
                        adapt_width_duration=2;
                    }else if(adapt_width_duration > move_parentTarget.getAttribute('original_duration')){
                        //alert('영상 고유의 duration값보다 더 크게 지정하려고 했던경우.');
                        adapt_width_duration = move_parentTarget.getAttribute('original_duration');

                    }else if(adapt_width_duration < 0){
                        //alert('적용 duration이 유효하지 않습니다.');
                        adapt_width_duration=2;
                    }
                    adapt_width_duration=parseInt(adapt_width_duration);

                    move_parentTarget.setAttribute('change_duration',adapt_width_duration);
                    move_parentTarget.style.width=parseFloat(3.333*adapt_width_duration)+'%';

                    /*let original_duration=parseInt(move_parentTarget.getAttribute('original_duration'));
                    let start_pos=parseInt(move_parentTarget.getAttribute('startpos'));
                    let end_pos=start_pos+adapt_width_duration;

                    end_pos = end_pos > rel_object_endpos ? rel_object_endpos : end_pos;
                    end_pos = end_pos >= 30 ? 30 : end_pos;*/

                    //move_parentTarget.setAttribute('endpos',end_pos);

                }
                console.log("====<<TOUCH START>>종료옵션 CLIETNx: MOVE_OBJECTPOS SETTINGS:",event.changedTouches[0].clientX);
                move_object_pos['x']= event.changedTouches[0].clientX;//마지막매번 pos값.        
            }
        }
        function touchend_module(event){
            let current_target= event.target;
            console.log('touchendup이벤트발생 관련 객체:',current_target,event.target,event.changedTouches[0],event.changedTouches[0].clientX,event.changedTouches[0].clientY);
            console.log('터치대상타깃:',move_target,isdrag);

          
            if(isdrag){
                let move_x =event.changedTouches[0].clientX;
                let move_y = event.changedTouches[0].clientY;

                console.log('touchendup이벤트발생 up 당시떄의 offset위치정보값:',move_object_pos,move_target);

                if(move_target.className.indexOf('videotake_original_')!=-1){
                    console.log('videotake_original요소를 이동시키려고 하는 경우:',move_target);
                    let rel_object=move_target.getAttribute("id").replace("_original","");
                    rel_object=rel_object.replace("control","");
                    let temp=[...takecontrolvalid];
                    //temp[rel_object-1]=false;
                    //settakecontrolvalid(temp);
                    if(originalvideoScrollicon&&originalvideoScrollicon.current){
                        originalvideoScrollicon.current.style.display='none';
                       
                        move_target.style.boxShadow="none";
                        
                    }

                    /*rel_object=document.getElementById(`take${rel_object}_textValid`);
                    console.log('videotake original요소를움직여,valid값 관련설정:',rel_object);
                    if(rel_object){
                        rel_object.innerText=`takebar를 움직여 편집할 최종상태를 결정해주세요`;
                        rel_object.style.color='red';
                    }*/

                    console.log("videoTake original요소 move endups된상황<touchmove>>:",move_x);
                    let prev_x=move_object_pos['x'];//마지막leftx값 pos값
                    let adapt_secondpos=0;
                    let move_distance=move_x - prev_x;
                    console.log('===>touchMove touchstartss videoOriginalss:',move_distance);

                    //if(move_distance<=-0.05){
                        console.log('====>오리지널비디오 endsup setting======>>',move_x,prev_x,move_distance);
                        adapt_secondpos=0;

                        let prev_startpos=parseInt(move_target.getAttribute("startpos"));//기존startpos위치값.
                        let prev_endpos=parseInt(move_target.getAttribute("endpos"));
                        let prev_fixed_duration=parseInt(move_target.getAttribute("original_duration"));
    
                        console.log('=====>>>originalvideo기존 prevstart,endpos:',prev_startpos,prev_endpos,prev_fixed_duration);
                        
                        let adapt_final_targetindex=prev_startpos + adapt_secondpos;
                        adapt_final_targetindex = adapt_final_targetindex>=28?28:adapt_final_targetindex;//28이상의값은 범위론 못가게처리.
                        let adapt_endpos=adapt_final_targetindex+ prev_fixed_duration;
                        adapt_endpos = adapt_endpos<=2?2:adapt_endpos;//2이하의값은 범위론못가게처리.
                        adapt_final_targetindex = adapt_endpos - prev_fixed_duration;
                        console.log('===><originalvideo touchends시점 변경adaptstartpos,endpos:',adapt_final_targetindex,adapt_endpos);
    
                        //move_target.style.left = 3.333*(adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('original_duration'))/2)-1)+'%';
                        move_target.style.left= 3.333*(adapt_final_targetindex)+'%';
    
                       // let adapt_startpos=adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('original_duration'))/2)-1;
                        let adapt_startpos=adapt_final_targetindex;//지정된startpos최종위치값.
    
                        //let original_duration=parseInt(move_target.getAttribute('original_duration'));
    
                        move_target.setAttribute("endpos",adapt_endpos);
                        move_target.setAttribute("startpos",adapt_startpos);
                        console.log('[[[[[[moving adapt start~end poss]]]]]] (원본영상):',adapt_startpos,adapt_endpos);
    
                        
                        let rel_object_take=move_target.getAttribute("id").replace("_original","");
                        rel_object_take=rel_object_take.replace("control","");
                        rel_object_take=document.getElementById(`control${rel_object_take}`);
                        //let rel_object_take_offsetLeftX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft'])+ parseFloat(rel_object_take.offsetLeft);
                        //let rel_object_take_offsetRightX=rel_object_take_offsetLeftX + parseFloat(window.getComputedStyle(rel_object_take,null)['width']);
                        let rel_object_take_offsetLeftX=parseFloat(rel_object_take.offsetLeft);
                        let rel_object_take_offsetRightX=rel_object_take_offsetLeftX + parseFloat(window.getComputedStyle(rel_object_take,null)['width']);
                        console.log('======>originalTKAE video요소 moving이벤트때의 기하학적dom위치:',rel_object_take_offsetLeftX,rel_object_take_offsetRightX);
    
                        let distance_array_=[];
                        let distance_array2_=[];
                        for(let t=0; t<time_grid_elements.length; t++){
                            console.log('====>orignalTake video moving이벤트떄의 move_x좌표 offsetX,clientX가까운 위치기반찾기');
                            let item=time_grid_elements[t];
                            let offsetX=item.offsetLeft;
                            console.log('item offsetX,rel_object_take_offsetLeftX:',offsetX,rel_object_take_offsetLeftX);
                            console.log('item offsetX,rel_object_take_offsetRightX:',offsetX,rel_object_take_offsetRightX);
    
                            let distance=Math.abs(rel_object_take_offsetLeftX-offsetX);
                            let distance2=Math.abs(rel_object_take_offsetRightX-offsetX);
                            distance_array_.push({
                                index:t+1,
                                object:time_grid_elements[t],
                                value:distance
                            });
                            distance_array2_.push({
                                index:t+1,
                                object:time_grid_elements[t],
                                value:distance2
                            })
                        }
                        console.log('====>originaltKE videoMovin이벤트때 확인된 관련된 takevideobar요소 위치대상값.실제적 위치참조 그 base위치를 매번 가져와서 처리, 기존prev데이터를가져오는것으론 로직 오류가크게 발생',distance_array_,distance_array2_);
                        let sort_result22=distance_array_.sort(function(a,b){
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
                        let sort_result222=distance_array2_.sort(function(a,b){
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
                        console.log('>>>정렬처리후에 distnace_arraysss1,2',distance_array_,distance_array2_);
                        //let takevideo_final_targetindex= distance_array[0].index;//그 상황때의 takevideo의 시작leftx위치,rightX위치.
                        let rel_object_startpos=distance_array_[0].index-1;
                        let rel_object_endpos=distance_array2_[0].index>30?30:distance_array2_[0].index-1;
                        //let rel_object_startpos=parseInt(rel_object_take.getAttribute("startpos"));
                        //let rel_object_endpos=parseInt(rel_object_take.getAttribute("endpos"));
    
                        let adapt_take_startpos= rel_object_startpos > adapt_startpos ? rel_object_startpos : adapt_startpos;
                        adapt_take_startpos = adapt_take_startpos < 0 ? 0 : adapt_take_startpos;
                        let adapt_take_endpos = rel_object_endpos > adapt_endpos ? adapt_endpos : rel_object_endpos;
                        adapt_take_endpos = adapt_take_endpos >= 30 ? 30 : adapt_take_endpos;
                        console.log('[[[[[[moving 기존 takebar영상 위치]]]]]]:',rel_object_startpos,rel_object_endpos);
                        console.log('[[[[[moving기존 takebar영상 반영위치adaptsss]]]]]]:',adapt_take_startpos,adapt_take_endpos);
                        rel_object_take.setAttribute("startpos",adapt_take_startpos);
                        rel_object_take.setAttribute("endpos",adapt_take_endpos);
    
                        let take_video_process_info=[];
                       let split_and_move_video_controls=document.getElementsByClassName('take_row');
                       let original_takevideo_controls=document.getElementsByClassName("videotake_original_");
    
                       for(let s=0; s<split_and_move_video_controls.length; s++){
                            if(split_and_move_video_controls[s].style.display=='block'){
                                //block인항목들에 대해서만 >>
                                //let item=split_and_move_video_controls[s];
                                let item=document.getElementById(`control${s+1}`);
                                let original_videos=original_takevideo_controls[s];
                                let original_video_startpos=parseInt(original_videos.getAttribute("startpos"));
                                let original_video_endpos=parseInt(original_videos.getAttribute("endpos"));
    
                                console.log('originalvideosss:',original_video_startpos,original_video_endpos);
    
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
                                store_obj['original_startpos'] = original_video_startpos;
                                store_obj['original_endpos'] = original_video_endpos;
    
                                take_video_process_info.push(store_obj);                         
                            }   
                        }
                        console.log('take_video_process_info',take_video_process_info);
    
                        setStandbydata({
                            //music: getParams.music,
                            //musictransitiontype:getParams.musictransitiontype,
                            //remote_url_list : remoteurllist,
                            take_video_process_info : take_video_process_info
                        })                     
                }
                else if(move_target.className.indexOf('videotake_control')!=-1){
                    console.log('videotakeControl요소 자체를 이동시키려고 하는 경우:',move_target);
                    let distance_array=[];

                    let rel_object_original=move_target.getAttribute("id").replace("control","");
                    rel_object_original=document.getElementById(`control${rel_object_original}_original`);
                    let rel_object_startpos=rel_object_original.getAttribute("startpos");
                    let rel_object_endpos= rel_object_original.getAttribute("endpos");

                    let rel_object=move_target.getAttribute("id").replace("control","");
                    let temp=[...takecontrolvalid];
                    //temp[rel_object-1]=true;
                    //settakecontrolvalid(temp);

                    /*rel_object=document.getElementById(`take${rel_object}_textValid`);
                    console.log('videotake original요소 움직여서,valid값 관련결정:',rel_object);
                    if(rel_object){
                        rel_object.innerText="";
                        rel_object.style.color='red';
                    }*/

                    for(let t=0; t<time_grid_elements.length; t++){
                        console.log('===>touchendup당시떄의 move_x좌표 offsetX,clientX와 가장 가까운 대상찾기');
                        let item=time_grid_elements[t];
                        let item_parent=item.parentElement.offsetLeft;
                        let offsetX=item_parent + item.offsetLeft;
                        console.log('item offsetX,move_x:',offsetX,move_x);

                        let distance=Math.abs(move_x-offsetX);
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

                    let adapt_startpos=adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('change_duration'))/2)-1;

                    let adapt_startpos_pos=adapt_startpos;
                    adapt_startpos_pos = adapt_startpos_pos <= 0 ? 0 : adapt_startpos_pos;

                    let original_duration=parseInt(move_target.getAttribute('original_duration'));
                    let change_duration=parseInt(move_target.getAttribute("change_duration"));

                    adapt_startpos = adapt_startpos > rel_object_startpos ? adapt_startpos : rel_object_startpos;
                    adapt_startpos = adapt_startpos <= 0 ? 0:adapt_startpos;

                    let end_pos = adapt_startpos_pos + change_duration;

                    end_pos= end_pos > rel_object_endpos ?rel_object_endpos:end_pos;
                    end_pos = end_pos >= 30 ? 30 : end_pos;

                    move_target.setAttribute('startpos',adapt_startpos);
                    move_target.setAttribute('endpos',end_pos);

                    console.log("위치기반추적,start,endpos:",adapt_startpos,end_pos);
                    console.log('===>>element요소 takebar left duratino사이즈조절 당시때의 원본영상bar 관련 index데이터::',rel_object_startpos,rel_object_endpos);
                    console.log('=====>>element요소 takebar left duration사이즈조절]]] 적용start~endss::',adapt_startpos,end_pos);


                    //move_target.style.left = 3.333*(adapt_final_targetindex - Math.ceil(parseInt(move_target.getAttribute('change_duration'))/2)-1)+'%';

                    move_target.style.left = (3.333*+adapt_startpos_pos)+'%';

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
                    console.log('[[[[movignadpat start~endposss!~!!]]]',typeof(adapt_startpos),adapt_startpos,end_pos);
                    let take_video_process_info=[];
                   let split_and_move_video_controls=document.getElementsByClassName('take_row');
                   let original_takevideo_controls=document.getElementsByClassName("videotake_original_");

                   for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            let original_videos=original_takevideo_controls[s];
                            let original_video_startpos=parseInt(original_videos.getAttribute("startpos"));
                            let original_video_endpos=parseInt(original_videos.getAttribute("endpos"));

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
                            store_obj['original_startpos'] = original_video_startpos;
                            store_obj['original_endpos'] = original_video_endpos;

                            take_video_process_info.push(store_obj);                         
                        }   
                    }
                    console.log('take_video_process_info',take_video_process_info);

                    setStandbydata({
                        //music: getParams.music,
                        //musictransitiontype:getParams.musictransitiontype,
                        //remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    })     
                }else if(move_target.className.indexOf("video_left_duration_control")!=-1){
                    //이동연산 크기 연산 모두 진행>>
                    console.log('videoleftdurationcontrol요소를 mousedown했다가 drag하여 mouseup한경우:',move_target,move_parentTarget);
                    let distance_array=[];
                    let distance_array2=[];

                    let rel_object_original=move_parentTarget.getAttribute("id").replace("control","");
                    rel_object_original= document.getElementById(`control${rel_object_original}_original`);
                    let rel_object_startpos=rel_object_original.getAttribute("startpos");
                    let rel_object_endpos= rel_object_original.getAttribute("endpos");

                    /*let rel_object=move_parentTarget.getAttribute("id").replace("control","");
                    let temp=[...takecontrolvalid];
                    //temp[rel_object-1]=false;
                   // settakecontrolvalid(temp);

                    rel_object=document.getElementById(`take${rel_object}_textValid`);
                    console.log(`videotake original요소 움직여서,valid값 관련결정:`,rel_object);
                    if(rel_object){
                        rel_object.innerText='takebar를 움직여 편집할 최종상태를 결정해주세요';
                        rel_object.style.color='red';
                    }*/

                    let mother_object_offsetrightX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft']) + parseFloat(move_parentTarget.offsetLeft) + parseFloat(window.getComputedStyle(move_parentTarget,null)['width']);

                    for(let t=0; t<time_grid_elements.length; t++){
                        let item=time_grid_elements[t];
                        let item_parent=item.parentElement.offsetLeft;
                        let offsetX= item_parent + item.offsetLeft;
                        
                        let distance=Math.abs(move_x - offsetX);
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
                        console.log('==>>hmmmm:',move_x,offsetX);
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
                    //adapt_final_targetindex= adapt_final_targetindex>=30?29:adapt_final_targetindex-1;
                    move_parentTarget.style.left = (3.333 * (adapt_final_targetindex>30?30:adapt_final_targetindex-1))+'%';
                    //2. mouseup이벤트 발생시점때에 motherElement의 offsetRight xleft값위치인접한 위치시작인댁스index-1 - adaptfinaltARGET INDEX값과의 차이값의 곧 IDNEX차이격차값이 각 인댁스는 일초값이고 이값 N% * s값 만큼의 폭을 가진다%폭으로 처리한다(반응형고려) 또한 몇초duration인지도 추적가능함.
                    
                    let adapt_final_posx_index=distance_array[0].index;//해당 이동할 위치와 moveMother object rightPosx와의 격차값은 새로 반영width크기이다.
                    let mother_object_offsetrightX_index= distance_array2[0].index;
                    console.log('adapt_final_posxIndex,mother_object_fofsetrightXindex:',adapt_final_posx_index,mother_object_offsetrightX_index);

                    let original_duration=parseInt(move_parentTarget.getAttribute('original_duration'));
                    let adapt_width_duration = mother_object_offsetrightX_index - adapt_final_posx_index;
                    console.log('적용 duration초 상수값::',adapt_width_duration);

                    if(adapt_width_duration >= 0 && adapt_width_duration < 2){
                        //alert('적용 duration이 1초는 되어야합니다.');
                        adapt_width_duration = 2;

                    }else if(adapt_width_duration > move_parentTarget.getAttribute('original_duration')){
                        //alert('영상 고유의 duration값보다 더 크게 지정하려고 했던경우.');
                        adapt_width_duration = move_parentTarget.getAttribute('original_duration');

                    }else if(adapt_width_duration < 0){
                        //alert('적용 duration이 유효하지 않습니다!!');
                        adapt_width_duration = 2;
                    }
                    move_parentTarget.setAttribute('change_duration',adapt_width_duration);
                    move_parentTarget.style.width = parseFloat( 3.333 * adapt_width_duration)+'%'; 

                    let start_pos=adapt_final_targetindex-1;
                    start_pos = start_pos > rel_object_startpos ? start_pos : rel_object_startpos;
                    start_pos = start_pos < 0 ? 0 : start_pos;

                    //변화 적용된 당시때의 change_duration값을 더해서 한다.
                    //let change_duration = parseInt(move_parentTarget.getAttribute('change_duration'));
                    let change_duration = adapt_width_duration;
                    let end_pos = (adapt_final_targetindex - 1) + change_duration;
                    end_pos = end_pos > rel_object_endpos ? rel_object_endpos: end_pos;
                    end_pos = end_pos >= 30 ? 30 : end_pos;

                    console.log('====>element요소 takebar left duration사이즈 조절]]] 순수 위치기반 starts~ends::',adapt_final_targetindex-1,mother_object_offsetrightX_index-1);
                    console.log('===>>element요소 takebar left duratino사이즈조절 당시때의 원본영상bar 관련 index데이터::',rel_object_startpos,rel_object_endpos);
                    console.log('=====>>element요소 takebar left duration사이즈조절]]] 적용start~endss::',start_pos,end_pos);

                    move_parentTarget.setAttribute('endpos',end_pos);
                    move_parentTarget.setAttribute('startpos',start_pos);

                    let take_video_process_info=[];
                    let split_and_move_video_controls=document.getElementsByClassName('take_row');
                    let original_takevideo_controls=document.getElementsByClassName("videotake_original_");

                    for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            let original_videos=original_takevideo_controls[s];
                            let original_video_startpos=parseInt(original_videos.getAttribute("startpos"));
                            let original_video_endpos=parseInt(original_videos.getAttribute("endpos"));

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
                            store_obj['original_startpos'] = original_video_startpos;
                            store_obj['original_endpos'] = original_video_endpos;

                            take_video_process_info.push(store_obj);

                        }   
                    } 
                    console.log('takebar durationSize take_video_process_info',take_video_process_info);

                    setStandbydata({
                        //music: getParams.music,
                        //musictransitiontype:getParams.musictransitiontype,
                        //remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    })
                }else if(move_target.className.indexOf("video_right_duration_control")!=-1){
                    console.log('videorightduraitoncontrol요소를 mousedown했다가 drag하여 touchendup한경우:',move_target,move_parentTarget);
                    let distance_array=[];
                    let distance_array2=[];
                    let mother_object_offsetleftX=parseFloat(window.getComputedStyle(document.getElementById('take1_area'),null)['paddingLeft'])+parseFloat(move_parentTarget.offsetLeft);

                    let rel_object_original=move_parentTarget.getAttribute("id").replace("control","");
                    let temp=[...takecontrolvalid];
                    //temp[rel_object_original-1]=false;
                    //settakecontrolvalid(temp);

                    rel_object_original=document.getElementById(`control${rel_object_original}_original`);
                    let rel_object_startpos=rel_object_original.getAttribute("startpos");
                    let rel_object_endpos=rel_object_original.getAttribute("endpos");

                    /*let rel_object = move_parentTarget.getAttribute("id").replace("control","");
                    rel_object = document.getElementById(`take${rel_object}_textValid`);
                    console.log('videotake original요소 움직여서,valid값 관련결정:',rel_object);
                    if(rel_object){
                        rel_object.innerText='takebar를 움직여 편집할 최종상태를 결정해주세요';
                        rel_object.style.color='red';
                    }*/

                    for(let t=0; t<time_grid_elements.length; t++){
                        //console.log('mouseup당시때의 또한 대상타깃 offsetx,clientx대상 찾기');
                        let item=time_grid_elements[t];
                        let item_parent=item.parentElement.offsetLeft;
                        let offsetX=item_parent + item.offsetLeft;

                        let distance=Math.abs(move_x-offsetX);
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

                    if(adapt_width_duration >=0 && adapt_width_duration<2){
                        //alert('적용 druation이 1초는 되어야합니다.');
                        adapt_width_duration=2;
                    }else if(adapt_width_duration > move_parentTarget.getAttribute('original_duration')){
                        //alert('영상 고유의 duration값보다 더 크게 지정하려고 했던경우.');
                        adapt_width_duration = move_parentTarget.getAttribute('original_duration');

                    }else if(adapt_width_duration < 0){
                        //alert('적용 duration이 유효하지 않습니다.');
                        adapt_width_duration=2;
                    }
                    adapt_width_duration=parseInt(adapt_width_duration);

                    move_parentTarget.setAttribute('change_duration',adapt_width_duration);
                    move_parentTarget.style.width=parseFloat(3.333*adapt_width_duration)+'%';

                    let original_duration=parseInt(move_parentTarget.getAttribute('original_duration'));
                    //let start_pos=parseInt(move_parentTarget.getAttribute('startpos'));
                    let start_pos=mother_object_offsetleftX_index-1;
                    let end_pos=start_pos+adapt_width_duration;

                    console.log('endpos what whwhahththht:',end_pos);
                    end_pos = end_pos > rel_object_endpos ? rel_object_endpos : end_pos;
                    end_pos = end_pos >= 30 ? 30 : end_pos;

                    move_parentTarget.setAttribute('endpos',end_pos);

                    console.log('====>>>>element요소takebar right duration사이즈 조절}]]] 순수 위치기반 start~endss:',mother_object_offsetleftX_index-1,adapt_final_posx_index-1);
                    console.log("=======>>element요소 takebar right duration사이즈조절 당시떄의원본영상bar관련 index데이터::",rel_object_startpos,rel_object_endpos);
                    console.log('=======>>>>element요소 takebar right duratino사이즈 조절]]]]]] 적용 start~endsss::',start_pos,end_pos);
                    
                    let take_video_process_info=[];
                    let split_and_move_video_controls=document.getElementsByClassName('take_row');
                    let original_takevideo_controls=document.getElementsByClassName("videotake_original_");

                    for(let s=0; s<split_and_move_video_controls.length; s++){
                        if(split_and_move_video_controls[s].style.display=='block'){
                            //block인항목들에 대해서만 >>
                            //let item=split_and_move_video_controls[s];
                            let item=document.getElementById(`control${s+1}`);
                            let original_videos=original_takevideo_controls[s];
                            let original_video_startpos=parseInt(original_videos.getAttribute("startpos"));
                            let original_video_endpos=parseInt(original_videos.getAttribute("endpos"));

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
                            store_obj['original_startpos'] = original_video_startpos;
                            store_obj['original_endpos'] = original_video_endpos;

                            take_video_process_info.push(store_obj);

                        }   
                    }
                    console.log('takebar durationSize take_video_process_info',take_video_process_info);          

                    setStandbydata({
                        //music: getParams.music,
                        //musictransitiontype:getParams.musictransitiontype,
                        //remote_url_list : remoteurllist,
                        take_video_process_info : take_video_process_info
                    })
                }        
            }
            console.log("====<<TOUCH START>>종료옵션 CLIETNx: MOVE_OBJECTPOS SETTINGS:",event.changedTouches[0].clientX);
            move_object_pos['x']= event.changedTouches[0].clientX;//마지막매번 pos값.       
            isdrag=false;
        }


        //playerControll touch관련
        let player_target;
        let timesecond_grid_area_container=document.getElementById("timesecond_grid_area_container");

        function player_touchstartmodule(event){
            player_target=event.target;

            console.log("====>player터치대상::",player_target);

            isdrag=true;
        }
        function player_touchmovemodule(event){
            if(isdrag){
                //console.log('====>터치무브중일떄는 관련반영하진 않고, css위치이동만반영.',event.changedTouches)

                let touchX=event.changedTouches[0].clientX;
                let touchY=event.changedTouches[0].clientY;

                //console.log('touchenss movess이벤트발생 move당시때의 offset위치정보값:',touchX,touchY);

                let paddingLeft=parseFloat(window.getComputedStyle(timesecond_grid_area_container,null)['paddingLeft']);

                let distance_array=[];
                for(let t=0; t<time_grid_elements_player.length; t++){
                    console.log('====>touchendups당시때의 adapt_x좌표 offsetX,clientX와가장 가까운대상찾기');
                    let item=time_grid_elements_player[t];
                    let offsetX=item.offsetLeft;
                    let offsetX_pos=paddingLeft+offsetX;
                    console.log('imte offsetX,touchX,offsetX_pos:',offsetX,offsetX_pos,touchX);

                    let distance=Math.abs(touchX-offsetX_pos);
                    distance_array.push({
                        index:t+1,
                        object:time_grid_elements[t],
                        value:distance
                    });
                }
                console.log('====>매 확인된 distance값:',distance_array);
                let sort_result=distance_array.sort(function(a,b){
                    let left=parseInt(a.value);
                    let right=parseInt(b.value);

                    if(left< right){
                        return -1;
                    }
                    if(left>right){
                        return 1;
                    }
                    return 0;
                });
                //console.log('===>player정렬처리후에 distance_arrayss:',distance_array);
                let adapt_final_target=distance_array[0].object;
                //console.log('===>대상타깃 leftoffsetX시작위치index값:',distance_array[0].index);
                let adapt_final_targetindex=distance_array[0].index;
                player_target.style.left= 3.333*(adapt_final_targetindex - 1)+'%';

                let adapt_startpos=adapt_final_targetindex-1;

                adapt_startpos=adapt_startpos < 0 ? 0:adapt_startpos;
                adapt_startpos=adapt_startpos > 30 ? 30 : adapt_startpos;

                player_target.setAttribute('seekpos',adapt_startpos);
                //console.log('[[[[moviniadpat start~pos jseekpos]]]]]',adapt_startpos);
            }
        }
        function player_touchendmodule(event){
            console.log('touchendups이벤트발생관련객체:',event);

            if(isdrag){
                let touchX=event.changedTouches[0].clientX;
                let touchY=event.changedTouches[0].clientY;

                console.log('touchendssup이벤트 발생 up당시떄의 offset위치정보값:',touchX,touchY);

                let paddingLeft=parseFloat(window.getComputedStyle(timesecond_grid_area_container,null)['paddingLeft']);

                let distance_array=[];
                for(let t=0; t<time_grid_elements_player.length; t++){
                    console.log('====>touchendups당시때의 adapt_x좌표 offsetX,clientX와가장 가까운대상찾기');
                    let item=time_grid_elements_player[t];
                    let offsetX=item.offsetLeft;
                    let offsetX_pos=paddingLeft+offsetX;
                    console.log('imte offsetX,touchX,offsetX_pos:',offsetX,offsetX_pos,touchX);

                    let distance=Math.abs(touchX-offsetX_pos);
                    distance_array.push({
                        index:t+1,
                        object:time_grid_elements[t],
                        value:distance
                    });
                }
                console.log('====>매 확인된 distance값:',distance_array);
                let sort_result=distance_array.sort(function(a,b){
                    let left=parseInt(a.value);
                    let right=parseInt(b.value);

                    if(left< right){
                        return -1;
                    }
                    if(left>right){
                        return 1;
                    }
                    return 0;
                });
                console.log('===>player정렬처리후에 distance_arrayss:',distance_array);
                let adapt_final_target=distance_array[0].object;
                console.log('===>대상타깃 leftoffsetX시작위치index값:',distance_array[0].index);
                let adapt_final_targetindex=distance_array[0].index;
                player_target.style.left= 3.333*(adapt_final_targetindex - 1)+'%';

                let adapt_startpos=adapt_final_targetindex-1;

                adapt_startpos=adapt_startpos < 0 ? 0:adapt_startpos;
                adapt_startpos=adapt_startpos > 30 ? 30 : adapt_startpos;

                player_target.setAttribute('seekpos',adapt_startpos);
                console.log('[[[[moviniadpat start~pos jseekpos]]]]]',adapt_startpos);

                setPlayerSeek({
                    seekpos : adapt_startpos//매번 갱신 마우스 떌때마다 관련 정보 위치정보 0~30 중에서 갱신.
                });

            }
            isdrag=false;
        }

        let timeline_target;
        let timeline_isdrag=false;
        let lastest_touchY=0;
        function timelineScrollstart(event){
            console.log('타임라인 스크롤시작 touchstartss:',event.target);
            timeline_target=event.target;

            timeline_isdrag=true;

            let touchX=event.changedTouches[0].clientX;
            let touchY=event.changedTouches[0].clientY;

            console.log('touchstarts이벤트발생 starts당시때의 offset위치정보값:',touchX,touchY);

            lastest_touchY=touchY;//origin위치시작 기준위치값.
        }
        function timelineScrollmove(event){
            if(timeline_isdrag){
                console.log("===>>타임라인 드래그 터치무브중일때 관련 감지",event.changedTouches);

                let touchX=event.changedTouches[0].clientX;
                let touchY=event.changedTouches[0].clientY;

                console.log('touchessmove이벤트발생 move당시때의 offset위치정보값:',touchX,touchY);
                console.log('마지막 위치touchY값(기존):',lastest_touchY);
                let distance_value=touchY-lastest_touchY;
                console.log('===>distance_values값:',distance_value);
                lastest_touchY=touchY;//마지막 위치값 touchY값 기억한다.마지막위치에 대해서

                if(timelineTarget && timelineTarget.current){
                    //timelineTarget.current.scrollTop += (-distance_value);
                    let prevScrollTop=timelineTarget.current.scrollTop;
                    console.log('====>기존 타임라인 prevScrollTopsss:',prevScrollTop);
                    prevScrollTop -= distance_value; 
                    console.log('====>적용 타임라인 scrollTopsss:',prevScrollTop);
                    timelineTarget.current.scrollTop = prevScrollTop;
                }
            }
        }
        function timelineScrollEnd(event){
            if(timeline_isdrag){
                console.log('======>>타임라인 드래그터치 ends일때 관련 감지:',event.changedTouches);

                let touchX=event.changedTouches[0].clientX;
                let touchY=event.changedTouches[0].clientY;

                console.log('touchsends이벤트발생 ends당시때의 offfset위치정보값:',touchX,touchY);
                console.log('마지막 위치touchY값(기존):',lastest_touchY);
                let distance_value=touchY-lastest_touchY;
                console.log('====>distance_values값:',distance_value);
                lastest_touchY=touchY;//마지막 위치값 touchY값 마지막 기억한다.

                if(timelineTarget && timelineTarget.current){
                    //timelineTarget.current.scrollTop += (-distance_value);
                    let prevScrollTop=timelineTarget.current.scrollTop;
                    console.log('====>기존 타임라인 prevScrollTopsss:',prevScrollTop);
                    prevScrollTop -= distance_value; 
                    console.log('====>적용 타임라인 scrollTopsss:',prevScrollTop);
                    timelineTarget.current.scrollTop = prevScrollTop;
                }
            }
            timeline_isdrag=false;
        }
       
        return [null,null,touchstart_module,touchend_module,player_touchstartmodule,player_touchendmodule,player_touchmovemodule,touchmove_module,  timelineScrollstart,timelineScrollmove,timelineScrollEnd];
    }

    var return_set = video_takecontrol_move_closure();
    var video_takecontrol_mousedown= return_set[0];
    var video_takecontrol_mouseup = return_set[1];
    var video_takecontrol_touchstart = return_set[2];
    var video_takecontrol_touchend = return_set[3];
    var video_takecontrol_touchmove = return_set[7];

    var videoplayer_control_touchstart = return_set[4];
    var videoplayer_control_touchend = return_set[5];
    var videoplayer_control_touchmove= return_set[6];//터치무브

    var timelineScrollstart= return_set[8];
    var timelineScrollmove= return_set[9];
    var timelineScrollEnd = return_set[10];

    console.log('관련 타깃 대상함수 globe범위에서 참조하는 형태로 한다:',video_takecontrol_mousedown,video_takecontrol_mouseup);
    //globe functisons===========================

    useEffect(()=>{
        console.log('takelist datass:',takelist);

        //let upload_encoded_form_inputdata = document.getElementById('upload_encoded_form_data');
        //let remote_url_list = [];//사용안함
        //let thumbnail_list=[];//사용안함
        let videoper_change_duration;
        if(takelist.length==1){
            videoper_change_duration = 4; 
        }else{
            videoper_change_duration = 4;          
        }
        let take_video_process_info=[];//비디오편집처리정보
        for(let s=0; s<takelist.length; s++){
            //remote_url_list.push(takelist[s]['uri']);
            //thumbnail_list.push(takelist[s]['clientsrc']);

            //let target_video = document.getElementById('upload_video'+s);
            //target_video.setAttribute('index',(s+1));

            let duration = Math.round(parseFloat(takelist[s]['duration']));
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
            target3.setAttribute("startpos",0);
            target3.setAttribute('endpos',0+duration);

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
        console.log('take_video_process_info:',take_video_process_info);

        //upload_encoded_form_inputdata.value=take_video_process_info.join(',');

        //setthumbnaillist(thumbnail_list);
        //setremoteurllist(remote_url_list);//local path filepathsss  not usesss
        /*setStandbydata({
           // music: getParams.music,
           //musictransitiontype:getParams.musictransitiontype,
            //remote_url_list : remote_url_list,
            //take_video_process_info : take_video_process_info
        });*/
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
                let localfile=takelist[takeindex-1] && takelist[takeindex-1]['uri'];//localPath list takeindex와 매칭되는 로컬파일패스를구한다.
                item['localfile'] = localfile;
                let item_lastindex=item_info.length-1;

                let first_startpos=item_info[0];
                let last_endpos=item_info[item_lastindex];
                item['startpos']=first_startpos-1;
                item['endpos']=last_endpos;

                let take_video_cutprocess_info_refer=take_video_process_info[takeindex-1];
                console.log('takevideocutprocess info refersss:',take_video_cutprocess_info_refer);
                if(take_video_cutprocess_info_refer){
                    let original_startpos=take_video_cutprocess_info_refer['original_startpos'];
                    let original_endpos=take_video_cutprocess_info_refer['original_endpos'];
                    if(takeindex!='blackempty'){
                        item['video_real_timeline_startpos'] = (first_startpos-1)-(original_startpos);
                        item['video_real_timeline_endpos'] = (last_endpos) - (original_startpos);
                    }
                }
               
               // item_info.splice(0,0,first_startpos-1);
            }

            setStandbydata_final({
                //music:getParams.music,
                //musictransitiontype:'opencv',
                //remote_url_list:remoteurllist,
                take_video_cutprocess_info : takeper_timetemp
            });
            setTakebarEdit(true);

            //편집데이터 전달(takeindex:1,2,3,4,5종류 이게 순환반복되는,같은것이있는 순열) / info:자르는구간관련정보 / startpos,endpos(자르는구간정보실질사용) 등의 편집정보 전달
            if(window.ReactNativeWebView){
                /*let valid_cnt=0;
                for(let i=0; i<takecontrolvalid.length; i++){
                    if(takecontrolvalid[i]==true){
                        valid_cnt++;
                    }
                }
                if(valid_cnt == takelist.length){
                    //alert("정보전달가능!!")
                    window.ReactNativeWebView.postMessage(JSON.stringify({type:"EditTake_by_interaction",data:takeper_timetemp,isvalid:true}));
                }else{
                    //alert("정보전달 불가능!");
                    window.ReactNativeWebView.postMessage(JSON.stringify({type:"EditTake_by_interaction",data:takeper_timetemp,isvalid:false}));
                }*/
                window.ReactNativeWebView.postMessage(JSON.stringify({type:"EditTake_by_interaction",data:takeper_timetemp,isvalid:true}));
            }
            setIsstandby(true);
        }     
    },[standbydata,takecontrolvalid]);
    useEffect(()=>{
        console.log('====>>>takecontrolvaliddsss:',takecontrolvalid);
    },[takecontrolvalid]);
    useEffect(()=>{
        console.log('===>>변화 playserSeek 플레이어탐색:',playerSeek);

        if(window.ReactNativeWebView){
            
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"EditTake_by_playerSeek",data:playerSeek}));   
        }
    },[playerSeek]);
    useEffect(()=>{
        //(thumbnaillist);
       // alert('thumnailslistss'+ JSON.stringify(thumbnaillist));
    },[thumbnaillist])

    return (
        <>
            <CameraDefault preview={false} next={'/edit/preview'} ishide={true}nextPossible={isstandby} nextParameter={standbydata_final} camera={false}>
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
                    {/*<CutVideoPreview>
                        <CutVideo ref={cutvideo} src={videosrc} controls></CutVideo>
                    </CutVideoPreview>*/}
                   
                    <EditToolWrap id="timesecond_grid_area_container">
                        {/*<CutBtn src={iconMediaCut} alt="" on={takebarEdit}onClick={videoCutAction}/>*/}
                        {/*<PlayBtn src={iconPlay} alt=""/>*/}
                        <PlaybarControl onTouchEnd={videoplayer_control_touchend} onTouchMove={videoplayer_control_touchmove}>
                            <PlayBall onTouchStart={videoplayer_control_touchstart}></PlayBall>
                            <TimesecondGridArea_player className='timesecond_grid_area_player'>
                                {
                                    timegridarray.map((value,index)=>{
                                        return(                            
                                        <TimeGrid_player className='time_grid_player' id={`index${value+1}`}>
                                            
                                        </TimeGrid_player>
                                        )
                                    })
                                }
                              
                                
                            {/*onTouchMove={(e)=>{onTakeMoveEvent(e,index)}} onTouchStart={onTakeMoveDown} onTouchEnd={onTakeMoveUp}
                                onMouseMove={(e)=>{onTakeMoveEvent(e,index)}} onMouseDown={onTakeMoveDown} onMouseUp={onTakeMoveUp}>*/
                            }
                            </TimesecondGridArea_player>
                            <PlaystatusBar></PlaystatusBar>
                            <PlayBallView ref={playballview}></PlayBallView>

                        </PlaybarControl>
                       {/* <ToolTimeWrap>
                            <ToolTime>00:00</ToolTime>
                            <ToolTotalTime>00:00</ToolTotalTime>
                        </ToolTimeWrap>*/}
                    </EditToolWrap>
                   
                    {/* take list */}
                    <EditTakeImgWrap>
                        <TakeBtnWrap><PrevBtn src={iconTakePrev} alt="" /></TakeBtnWrap>
                        <TakeImgList>
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
                            {/*<EditBgArea/>*/}
                        </EditBgWrap>
                    </EditTakeImgWrap>

                    {/* take edit */}
                    <EditTakeContent id='video_editing_area' className='editing_area'>
                        <OriginalVideoMovingScroll ref={originalvideoScrollicon}>
                            <ScrollIcon src={ScrollHorizontal}></ScrollIcon>
                        </OriginalVideoMovingScroll>

                        <TimelineScrollbar onTouchStart={timelineScrollstart} onTouchMove={timelineScrollmove} onTouchEnd={timelineScrollEnd}>
                            <ScrollImagedown src={scrollbar5}></ScrollImagedown>
                            <ScrollImageup src={scrollbar5}></ScrollImageup>
                        </TimelineScrollbar>
                        {/*<TimelineScrollbar_right onTouchStart={timelineScrollstart} onTouchMove={timelineScrollmove} onTouchEnd={timelineScrollEnd}>
                            <ScrollImagedown src={scrollbar5}></ScrollImagedown>
                            <ScrollImageup src={scrollbar5}></ScrollImageup>
                        </TimelineScrollbar_right>*/}
                        <TimesecondGridArea className='timesecond_grid_area'>
                            
                            <PlaystatusArea>
                                <PlayStatus ref={playstatus}></PlayStatus>
                            </PlaystatusArea>

                            <TimeGridWrap>
                            {
                                timegridarray.map((value,index)=>{
                                    return(                            
                                    <TimeGrid className='time_grid' id={`index${value+1}`} style={{left:3.333*value+'%'}}>
                                        
                                    </TimeGrid>
                                    )
                                })
                            }
                            <TimeGridOver className='time_grid' id={`index31`}style={{left:3.333*30+'%'}}>                      
                            </TimeGridOver>
                            </TimeGridWrap>
                            

                         {/*onTouchMove={(e)=>{onTakeMoveEvent(e,index)}} onTouchStart={onTakeMoveDown} onTouchEnd={onTakeMoveUp}
                            onMouseMove={(e)=>{onTakeMoveEvent(e,index)}} onMouseDown={onTakeMoveDown} onMouseUp={onTakeMoveUp}>*/
                        }
                        </TimesecondGridArea>
                        <TakeContentsWrap ref={timelineTarget}>
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
                                    <TakeContent key={index+1 +'edit take'} id={`take${index+1}_area`} className={`take_row`} onTouchEnd={video_takecontrol_touchend} onTouchMove={video_takecontrol_touchmove}
                                    >
                                        <EditTakeText>
                                            <Texts>TAKE {index+1}</Texts>
                                            <Textss id={`take${index+1}_textValid`}></Textss>
                                        </EditTakeText>
                                        <EditTakeImg >
                                            <EditTakeControl className={"videotake_control"} dataset-take={index+1} id={`control${index+1}`} original_duration='20' change_duration='20' startpos='0' endpos='0' onTouchStart={video_takecontrol_touchstart}>
                                                {/*<TakeImg src={CameraBg} alt="" />*/}
                                                <LeftControl className='video_left_duration_control'></LeftControl>
                                                <RightControl className='video_right_duration_control'></RightControl>
                                            </EditTakeControl>
                                            <OriginalTakeImg className={"videotake_original_"} id={`control${index+1}_original`}original_duration={takelist[index]['duration']} startpos={'0'} endpos={takelist[index]['duration']}>
                                                <OriginalDuration className={"videotake_original"} onTouchStart={video_takecontrol_touchstart}></OriginalDuration>
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
                                               <EditTakeVideoE src={thumbnaillist[index]}>
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
    background: transparent;background-color:rgba(0,0,0,0.1);
    position:relative;height:100%;
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
    height:calc(100vw*(48/428));
    position:relative;padding:0 calc(100vw *(28/428));
    background-color:rgba(50,50,50,0.3)
`
const PlaybarControl =styled.div`
    display:flex;align-items:center; width:100%;height:100%;position:relative;
`
const PlayBall = styled.div`
    display:block;width:calc(100vw* (24/428));height:calc(100vw *(48/428));background-color:rgba(255,255,255,0.5);position:absolute;left:0;top:0;z-index:8
`
const PlaystatusBar = styled.div`
    display:block; width:100%;height:calc(100vw * (6/428));background-color:rgba(255,255,255,0.7);z-index:2;
    border-radius:calc(100vw*(2/428))
`
const PlayBallView = styled.div`
    display:block;width:calc(100vw *(12/428));height:calc(100vw * (12/428));background-color:#fff;position:absolute;left:0;top:50%;z-index:3;
    transform:translateY(-50%);border-radius:50%
    
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
    background-color:rgba(255,255,255,0.3);
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
   display:block; position:relative;z-index:3;
`
const TakeImgListWrap = styled.div`
    display: flex; position:relative;
    align-items: center;
    justify-content: flex-start;
    width: calc(100vw*(342/428)); height: calc(100vw*(75/428));
    padding: calc(100vw*(6/428)) 0;
    background: rgba(255,255,255,0);
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
    width:100%;height:100%;display:flex;position:absolute;left:0%;top:50%;transform:translateY(-50%);color:purple;
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

const OriginalVideoMovingScroll = styled.div`
    width:calc(100vw*(60/428));display:none;align-items:center;justify-conter:center;background-color:rgba(150,20,230,0.7);border-radius:60%; box-shadow:0 0 6px 6px rgba(150,20,230,0.7);
    height:calc(100vw*(60/428));position:fixed;z-index:5;left:50%;top:50%;transform:translateX(-50%)translateY(-50%);flex-flow:row wrap;
`
const ScrollIcon = styled.img`
    width:70%;display:block;
    height:70%; position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;
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
    width:100%;height:auto; position:absolute; /*padding:0 calc(100vw * (8/428));*/left:0;top:0;height:100%;z-index:0;display:block; padding:0 calc(100vw *(38/428));
`
const TimelineScrollbar= styled.div`
    position:absolute;width:calc(100vw* (40/428));height:100%;left:0;top:0%;
    background-color:rgba(255,255,255,0.5);z-index:7;display:flex;
    flex-flow:column nowrap; justify-content:space-around;align-items:center;
`
const ScrollImageup= styled.img`
    width:calc(100vw* (40/428));height:calc(100vw*(40/428));
    transform:rotateZ(180deg);margin-top:50%
`
const ScrollImagedown= styled.img`
width:calc(100vw* (40/428));height:calc(100vw*(40/428));
margin-bottom:50%
`
const TimelineScrollbar_right= styled.div`
    position:absolute;width:calc(100vw* (26/428));height:100%;right:0;top:0%;
    background-color:rgba(255,255,255,0.5);z-index:7;display:flex;
    flex-flow:column nowrap; justify-content:space-around;align-items:center;
`

const PlaystatusArea = styled.div`
    width:100%;height:100%;position:absolute;background-color:rgba(0,0,0,0);left:0;top:0;padding:0 calc(100vw*(40/428))
`
const PlayStatus=styled.div`
    height:200%;display:block;width:1px;background-color:red;position:relative;top:-75%;left:0%;z-index:3;
`
const TimeGridWrap=styled.div`
    width:100%;height:100%;position:relative;
`
const TimeGrid = styled.div`
    width:calc(100vw*(352/428) / 30);border-left:calc(100vw * (0/360)) solid #fff;border-right:calc(100vw * (0/360)) solid #fff;height:100%;color:white;display:flex;flex-flow:row wrap;align-items:flex-start;justify-content:center;font-size:8px;position:absolute;
`
const TimeGridOver = styled(TimeGrid)`
    border-left:calc(100vw * (0/360)) solid #0020ef;border-right:calc(100vw * (0/360)) solid #0020ef;
`
const TimesecondGridArea_player = styled.div`
    width:100%;height:auto; position:absolute;
    left:0;top:0;height:100%;z-index:0;display:flex;flex-flow:row nowrap; 
`
const TimeGrid_player = styled.div`
    width:calc(100% / 30);height:100%;color:white;display:flex;flex-flow:row wrap;align-items:flex-start;justify-content:center;font-size:8px;
`

const TakeContentsWrap= styled.div`
    width:100%;position:absolute;height:100%;left:0;top:0;
    overflow-x: hidden;overflow-y:hidden;
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
    height: calc(100vw*(50/428));z-index:2;
`

const EditTakeControl = styled.div`
    position:absolute;left:0;top:0;width:20%;height:100%;
`
const OriginalTakeImg = styled.div`
    position:absolute;width:100%;height:calc(100vw *(50/428));bottom:0;left:0;background-color:rgba(0,0,0,0.7);z-index:-1;overflow:hidden;
`
const EditTakeVideoE = styled.img`
    height:auto;width:100%;display:block;position:absolute;left:50%;top:50%;transform:translateX(-50%)translateY(-50%);z-index:3
`
const OriginalDuration = styled.div`
    width:100%;height:100%;display:flex;flex-flow:row nowrap;justify-content:center;align-items:center;color:white;position:relative;z-index:5
`

const LeftControl = styled.div`
    position:absolute; top:calc(100vw *(0/428)); left:0;
width:calc(100vw * (15/428)); height:calc(100vw*(50/428)); background:#fff; border-radius: calc(100vw*(2/428)); z-index:10
`
const RightControl = styled.div`
    position:absolute; top:calc(100vw *(0/428));right:calc(100vw*(-8/428));
    width:calc(100vw*(15/428));height:calc(100vw*(50/428));background:#fff; border-radius: calc(100vw * (2/428)); z-index:10
`
const EditTakeText = styled.div`
    width: 100%;  height:calc(100vw *(18/428));
    margin-bottom: calc(100vw*(5/428)); position:relative;
`
const Texts=styled.p`
color: #fff; position:absolute;left:-10%;top:0;text-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
font-size: calc(100vw*(10/428));line-height:calc(100vw*(18/428)); height:100%;width:100%;
`

