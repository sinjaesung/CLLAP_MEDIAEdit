//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

// component
import MusicInfo from '../../../component/edit/music/MusicInfo';
import MusicList from '../../../component/edit/music/MusicList';
import DefaultModal from '../../../component/modal/DefaultModal';

//img
import MusicImg from "../../../img/img/challenge_img1.jpg"
import themeImg1 from "../../../img/img/theme_img1.jpg"
import themeImg2 from "../../../img/img/theme_img2.jpg"
import themeImg3 from "../../../img/img/theme_img3.jpg"
import themeImg4 from "../../../img/img/theme_img4.jpg"
import themeImg5 from "../../../img/img/theme_img5.jpg"

//server
import serverController2 from '../../../server/serverController2';

import getBlobDuration from 'get-blob-duration';

import LodingModal from '../../../component/modal/LodingModal';

import { SelectVideoDataAction } from "../../../store/actionCreators";
import { useSelector } from 'react-redux';
import ThemeList from "../../../component/edit/music/ThemeList";

export default function MusicPage() {

    const selectVideoData = useSelector(store => store.selectVideoData);
    //alert(JSON.stringify(selectVideoData));
    const [tabIndex, setTabIndex] = useState(0)
    const [modalOn, setModalOn] = useState(false)
    const history = useHistory();
    const [isstandbydata,setisstandbydata] = useState(false);
    const [lodingModal, setLodingModal] = useState(false);
    const [standbydata,setstandbydata] = useState({});
    
    const [accessfromApp,setaccessfromApp] = useState(false);

    const [music,setmusic] = useState(false);//music id고유id값>>
    const [musictransitiontype,setmusictransitiontype] = useState('');
    const [effect,seteffect]=useState(false);

    const player1=useRef();const player2=useRef();const player3=useRef();const player4=useRef();const player5=useRef();const player6=useRef();
    const player7=useRef();const player8=useRef();const player9=useRef();const player10=useRef();const player11=useRef();const player12=useRef();

    const allList = [
        {src: MusicImg, src_source:"https://teamspark.kr:8080/resource/cllap_music1.mp3", type: 'POP', title: 'filter_1(FFMPEG)', text: 'Particle House(feat.Ptfrimaa)', id:1, transition_type:'ffmpeg',player:player1, effect: '{"overlay1.gif":"3~6", "COLOR_PINKPURPLE":"7~10"}'},
        {src: MusicImg, src_source:"https://teamspark.kr:8080/resource/cllap_music2.mp3", type: 'POP', title: 'filter_2(FFMPEG)', text: 'Two Peas in a Pod(Ooyy feat.Ella Faye)', id:2, transition_type:'ffmpeg',player:player2, effect:'{"Rotate_fast":"4~7","overlay4.gif":"0~3"}'},
        {src: MusicImg, src_source:"https://teamspark.kr:8080/resource/cllap_music3.mp3", type: 'POP', title: 'filter_3(FFMPEG)', text: 'Wholehearted(Daxten,Wai feat.StevenELiss)', id:3, transition_type:'ffmpeg',player:player3,effect:'{"GEQ_rgbshow":"1~4","overlay3.gif":"10~13"}'},
        {src: MusicImg, src_source:"https://teamspark.kr:8080/resource/test2_1.mp3", type: 'POP', title: 'filter_4(FFMPEG)', text: 'DontCry(하현우)', id:4, transition_type:'ffmpeg',player:player4,effect:'{"rain16_.gif":"2~5","Pseudocolor_shadows":"7~10"}'},
        {src: MusicImg, src_source:"https://teamspark.kr:8080/resource/test2_2.mp3", type: 'POP', title: 'filter_5(FFMPEG)', text: 'DontCry(하현우) ', id:5, transition_type:'ffmpeg',player:player5,effect:'{"particles1_.gif":"4~7","Pseudocolor_turbo":"10~13"}'},
        {src: MusicImg, src_source:"https://teamspark.kr:8080/resource/test2_3.mp3", type: 'POP', title: 'filter_6(FFMPEG)', text: 'DontCry(하현우) ', id:6, transition_type:'ffmpeg',player:player6,effect:'{"Rotate_default":"1~4","lensflaress6_.gif":"5~8"}'},
        {src: MusicImg, src_source:"https://teamspark.kr:8080/resource/test3_1.mp3", type: 'POP', title: 'filter_7(FFMPEG)', text: 'Lagenca(하현우)', id:7, transition_type:'ffmpeg',player:player7,effect:'{"GRID_FireBrick":"2~5","smoke4_.gif":"7~10"}'},
    ]
    const themeList = [
        {src: themeImg1, src_source:"https://teamspark.kr:8080/resource/test3_2.mp3",title: 'PARTY(OPENCV)', id:108, transition_type:'ffmpeg',player:player8,effect:'{"fireworks3_.gif":"5~8","CURVE_negative":"1~4"}'},
        {src: themeImg2, src_source:"https://teamspark.kr:8080/resource/test3_3.mp3",title: 'Classical(OPENCV)', id:109, transition_type:'ffmpeg',player:player9,effect:'{"fireworks16_.gif":"0~3","CONV_edgedetect":"5~8"}'},
        {src: themeImg3, src_source:"https://teamspark.kr:8080/resource/test4_1.mp3",title: 'Fantasy(OPENCV)', id:110, transition_type:'ffmpeg',player:player10,effect:'{"COLOR_BLUEPURPLE":"2~5","lensflaress7_.gif":"6~9"}'},
        {src: themeImg4, src_source:"https://teamspark.kr:8080/resource/test4_2.mp3",title: 'Nature(OPENCV)', id:111, transition_type:'ffmpeg',player:player11,effect:'{"particles1_.gif":"3~6","Rotate_slow":"7~10"}'},
        {src: themeImg5, src_source:"https://teamspark.kr:8080/resource/test4_3.mp3",title: 'Work Out(OPENCV)', id:112, transition_type:'ffmpeg',player:player12,effect:'{"HUE_colorshow":"4~7","particles3_.gif":"8~11"}'}
    ]

    useEffect(async()=>{
        
       //앱갤러리or앱카메라에서 접근한 경우에만 addEVentListener구문 실행(유효)
       //android
       /* document.addEventListener("message",async (event) =>{
            let test_data=JSON.parse(event.data);
            alert(event.data);
            if(test_data && test_data.test_data){
                let select_list=test_data.test_data?test_data.test_data:null;
                let select_data_list=[];
                let string_clientsrc_test="";
                if(select_list){
                    for(let f=0; f<select_list.length; f++){
                        //let url=select_list[f]['url'];
                        //let blobss= await fetch(url).then(response=>response.blob());
                        //let duration=await getBlobDuration(blobss);
                        let duration= select_list[f]['duration'];
                       let clientsrc= select_list[f]['uri'];
                        let uri= select_list[f]['uri'];

                        let store={};
                        store['src'] ="uri";
                        store['time']=duration;
                        store['id'] = f;
                        store['remote_src'] = "uri";
                        store['media_source_path'] = "uri";
                        store['clientsrc'] = "uri";
                        //string_clientsrc_test += (URL.createObjectURL(blobss)+'||');
                        //string_clientsrc_test += (clientsrc+"||");
                        select_data_list.push(store);
                    }
                }
                SelectVideoDataAction.updateS3stringdata({s3_string_data:event.data});
                SelectVideoDataAction.updateS3clientsrctest({s3_clientsrc_test : string_clientsrc_test});
                SelectVideoDataAction.updateS3urllist({select_data_list : select_data_list});

                setaccessfromApp(true);//메시지를 받았다는것은 앱에서 왔다는것.

                setstandbydata({
                    s3_string_data: event.data,
                    s3_clientsrc_test: string_clientsrc_test,
                    s3_url_list:select_data_list,
                });

                setisstandbydata(true);//이경우에 바로 보내며, 관련 데이터 바로 준비상태임.
            }
        });*/
        //ios
        /*window.addEventListener("message",async (event)=>{
            let s3_upload_data=JSON.parse(event.data);

            if(s3_upload_data && s3_upload_data.s3_url_data){
                let s3_url_list_temp=s3_upload_data.s3_url_data?s3_upload_data.s3_url_data:null;
                let s3_data_list=[];
                let string_clientsrc_test="";
                if(s3_url_list_temp){
                    for(let f=0; f<s3_url_list_temp.length; f++){
                        let url=s3_url_list_temp[f]['url'];
                        //let blobss= await fetch(url).then(response=>response.blob());
                        //let duration=await getBlobDuration(blobss);
                        let duration = s3_url_list_temp[f]['duration'];
                        let clientsrc= s3_url_list_temp[f]['clientsrc'];

                        let store={};
                        store['src'] =url;
                        store['time']=duration;
                        store['id'] = f;
                        store['remote_src'] = url;
                        store['media_source_path'] = url;
                        store['clientsrc'] = clientsrc;
                        //string_clientsrc_test += (URL.createObjectURL(blobss)+'||');
                        string_clientsrc_test += (clientsrc+"||");
                        s3_data_list.push(store);
                    }
                }

                SelectVideoDataAction.updateS3stringdata({s3_string_data:event.data});
                SelectVideoDataAction.updateS3clientsrctest({s3_clientsrc_test : string_clientsrc_test});
                SelectVideoDataAction.updateS3urllist({s3_url_list : s3_data_list});

                setaccessfromApp(true);//메시지를 받았다는것은 앱에서 왔다는것.

                setstandbydata({
                    s3_string_data: event.data,
                    s3_clientsrc_test: string_clientsrc_test,
                    s3_url_list:s3_data_list,
                });

                setisstandbydata(true);//이경우에 바로 보내며, 관련 데이터 바로 준비상태임.
            }
        });*/
     
    },[]);
    /*useEffect(()=>{
        if(accessfromApp){
            //앱으로부터의 접근일경우 굳이 기존 리덕스 데이터 여부는 중요하지 않음.앱전달 선택url리스트에 대해서 모두 리스트수만큼 다 읽어야만 setIststandby참이 되어 이동가능. 기존 데이터는 필요없고, 새로 넘어오는 그 데이터가 사실상 연결필요!
        }else{
            //테이크편집페이지에서 뒤로가기웹뷰로 넘어온경우 / 뒤로가기로 넘어왔는데 리덕스조차 비어있는경우는 진행할수없음.
            if(!!selectVideoData.selectvideoData.s3_string_data && !!selectVideoData.selectvideoData.s3_clientsrc_test && selectVideoData.selectvideoData.s3_url_list.length>=1){
                setstandbydata({
                    s3_string_data : selectVideoData.selectvideoData.s3_string_data,
                    s3_clientsrc_test : selectVideoData.selectvideoData.s3_clientsrc_test,
                    s3_url_list : selectVideoData.selectvideoData.s3_url_list
                });
                setisstandbydata(true);
            }
        }
    },[accessfromApp]);*/
    /*useEffect(()=>{
        console.log('====>isstandbydata,standbydata상태',isstandbydata,standbydata);
    },[isstandbydata,standbydata]);*/
  
    const nextClick = () =>{
        // setModalOn(false);
        if(music){
            /*if(!isstandbydata){
                setModalOn(false);
                alert('필요데이터가 충족되지 않았습니다.');
                return false;
            }
            return history.push({
                pathname : "/edit/take",
                state : { 
                    nextParameter: {
                        standbydata : standbydata,
                        music : music,
                        musictransitiontype : musictransitiontype
                    }
                }
            });*/
            for(let i=0; i<allList.length; i++){
                let item=allList[i];
                if(item && item.player && item.player.current){
                    console.log('itempalyer.curretsss:<<musicList>> pause()',item.player.current);
                    item.player.current.pause();
                }
            }
            for(let j=0; j<themeList.length; j++){
                let item=themeList[j];
                if(item && item.player && item.player.current){
                    console.log('itempalyer.curretsss:<<theme>> pause()',item.player.current);

                    item.player.current.pause();
                }
            }
            if(window.ReactNativeWebView){
                //재생중였던 모든음악들 다 끈다.테마리스트,음악리스트 컴포넌트별로마운트시점때 등록되어있던 리스트에 대해서만 처리한다.
                for(let i=0; i<allList.length; i++){
                    let item=allList[i];
                    if(item && item.player && item.player.current){
                        item.player.current.pause();
                    }
                }
                for(let j=0; j<themeList.length; j++){
                    let item=themeList[j];
                    if(item && item.player && item.player.current){
                        item.player.current.pause();
                    }
                }
                //let data=JSON.stringify(music);
                //alert(effect);
                window.ReactNativeWebView.postMessage(JSON.stringify({type:"SELECT_MUSIC",data:music,effect:effect,musictransitiontype:musictransitiontype}));
            }else{
                alert("window.REactNativeWebview is undefined");
            }
        }else{
            setModalOn(false);
        }      
    }
    
    return (
        <Container>
            <MusicInfo tabIndex={tabIndex} setTabIndex={setTabIndex} setModalOn={setModalOn} standbydata={standbydata} accessfromApp={accessfromApp}/>
            <MusicList tabIndex={tabIndex} allList={allList} themeList={themeList} music={music}setmusic={setmusic}effect={effect}seteffect={seteffect}musictransitiontype={musictransitiontype} setmusictransitiontype={setmusictransitiontype}/>
            {
                modalOn && 
                <DefaultModal title={music!=''?"음악을 고르신 후 다음단계로 이동해주세요.":`${music}음악을 선택하셨습니다.`} nextClick={nextClick}/>
                
            }
            {
                lodingModal &&
                <LodingModal/>
            }
        </Container>
    );
}

const Container = styled.div`
    width: 100%; min-height: 100vh;
    background: #F4F4FC;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`