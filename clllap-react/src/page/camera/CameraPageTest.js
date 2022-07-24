import { useState,useEffect,useRef } from "react";
import { CircularProgressbar,buildStyles } from "react-circular-progressbar";

import getBlobDuration from 'get-blob-duration';

//css
import styled from "styled-components"
import "react-circular-progressbar/dist/styles.css";

//img
import VideoImg from "../../img/img/camera_bg.jpg"
import IconGallery from "../../img/icon/icon_gallery_wh.svg"
import IconClosed from "../../img/icon/icon_bt_arrow_wh.svg"
import IconOpen from "../../img/icon/icon_top_arrow_wh.svg"
import IconTake from "../../img/icon/icon_take.svg"
import IconPlus from "../../img/icon/icon_plus.svg"
import IconMinus from "../../img/icon/icon_minus.svg"
import IconNext from "../../img/icon/icon_next.svg"
import IconCamera from "../../img/icon/icon_camera_wh.svg"

// component
import CameraDefault from '../../component/camera/CameraDefault';
import VideoModal from '../../component/modal/VideoModal';

//server process
import serverController2 from '../../server/serverController2';
import serverController from '../../server/serverController';

import { Link,useHistory } from "react-router-dom";

import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';

import { useSelector } from 'react-redux';


export default function CameraPage() {
    const userData = useSelector(store => store.userData.userData);
   
    const history = useHistory();

    /*if( !(userData.user_id && userData.username)){
        alert("로그인 후 이용해주세요.");
        history.push('/login');
    }*/
    
    const [videoModalState, setVideoModalState] = useState(false);
    const [playvideo,setplayvideo] = useState("");

    const [takeCount, setTakeCount] = useState(0);
    const [shotCount, setShotCount] = useState(0);
    const [takeListState, setTakeListState] = useState(true);

    const videoref=useRef();
    const captureProgress = useRef();
    const videoSelect=useRef();

    // Camera percent(ui 제공)
    const [percentage,setPercentage] = useState(0);
    const [Count,setCount] = useState(0);

    //var takeArr = [1,2,3,4,5];
    const [takelist,settakelist] = useState([]);
    
    //remote upload encoded result urls list
    const [uploadlist,setuploadlist] = useState([]);
    const [uploadlistcnt,setuploadlistcnt] = useState(0);

    const [uploading,setuploading] = useState(false);
    //카메라 실행중 캡처중인상태여부
    const [istaking,setistaking] = useState(false);

    const [cameramode,setcameramode] = useState(0);//후면카메라0,전면카메라1
    const [recorder,setrecorder] = useState();
    const [stream,setStream] = useState({});
    const [timer,setTimer] = useState("");

    const [nextPossible,setnextPossible] = useState(false);

    const MinusClick = () => {
        if(takeCount < 1) return
        setTakeCount(takeCount-1)
    }
    const plusClick = () => {
        if(takeCount > 4) return
        setTakeCount(takeCount+1)
    }

    //const [camera_selectors,setcamera_selectors]=useState([videoSelect]);//전면,후면 카메라종류
    const handleError = function(error){
        console.log('navigator.mediaDeives.getUsermeida errors:',error);
    }
    const gotDevices= function(deviceInfos){
        //let values=camera_selectors.map(select=>select.current && select.current.value);//카메라종류,오디오인풋,오디오아웃풋각 select객체 value값.
        //console.log('what valuess:',values);
        //console.log('what selectorss:',camera_selectors);
        if(videoSelect.current){
            while(videoSelect.current.firstChild){
                videoSelect.current.removeChild(videoSelect.current.firstChild);
            }
         
            for(let i=0; i!==deviceInfos.length; i++){
                let deviceinfo=deviceInfos[i];
                let option=document.createElement('option');
                //let option2=document.createElement('option');
                option.value=deviceinfo.deviceId;
                if(deviceinfo.kind === 'audioinput'){
                    //option.text=deviceinfo.label || `microphone ${audioInputSelect.length + 1}`
                    //audioInputSelect.appendChild(option);
                }else if(deviceinfo.kind === 'audiooutput'){
                   // option.text=deviceinfo.label || `speaker ${audioOutputSelect.length +1}`;
                   // audioOutputSelect.appendChild(option);
                }else if(deviceinfo.kind === 'videoinput'){
                    option.text=deviceinfo.label || `camera ${videoSelect.current.length +1 }`;
                    videoSelect.current.appendChild(option);

                    //option2.text=deviceinfo.label || `camera ${videoSelect.current.length +1 }`;
                   // option2.value=deviceinfo.deviceId+'s';
                    //videoSelect.current.appendChild(option2);

                }else{
                    console.log('some other kind of source/deivess:',deviceinfo);
                }
            }
            /*console.log('childsnodess:',videoSelect.childNodes,Array.prototype.slice.call(videoSelect.childNodes));
            if(Array.prototype.slice.call(videoSelect.childNodes).some(n=>n.value===values[selectorIndex])){
                select.current.value=values[selectorIndex];
            }*/
        }    
    }
    /*
     function attachSinkId(element,sinkId){
            if(typeof element.sinkId !== 'undefined'){
                element.setSinkId(sinkId)
                .then(()=>{
                    console.log(`success audio output device attached:${sinkId}`);
                })
                .catch(error=>{
                    let errorMessage=error;
                    if(error.name==='SecurityError'){
                        errorMessage=`you need to use https for selecting audi ooutput deives:${error}`;
                    }
                    console.error(errorMessage);
                    audioOutputSelect.selectIndex=0;
                });
            }else{
                console.warn('Browser does not supprot output device selection.');
            }
        }
        function changeAudioDestination(){
            const audioDestination=audioOutputSelect.value;
            attachSinkId(videoElement,audioDestination);
        }
    */
   const gotStream=function(stream){
       videoref.current.srcObject=stream;
       videoref.current.play();

       let recorder = new RecordRTCPromisesHandler(stream,{type:'video',canvas:{width:720,height:1280}});

       setrecorder(recorder);
       setStream(stream);

       //alert('gotStream functions execute!!!');

       return navigator.mediaDevices.enumerateDevices();
   }
   
    const onLoad = ()=>{
        //navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
        //alert('하놔');
        //window.postMessage(JSON.stringify({name:'sinjaesung',age:28}));
        //let videosource=videoSelect.current && videoSelect.current.value;
        let constraints={
            audio:false,
            video:{ 
                width:{min:640, ideal: 1280},
                height:{min:360, ideal: 720},
                 //deviceId:videosource ? {exact:videosource}:undefined}
                facingMode : {ideal:"environment"}   
            }
        };
        /*navigator.mediaDevices.getUserMedia({ video: {width:720,height:1280}, audio:false })
        .then(function(stream) { 
            loadCamera(stream); 
        })
        .catch(function(error) {
            console.error(error); 
        });*/
        //navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
        //navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
    }
    const camerapage_streamRemove=()=>{
        if(stream){
            //alert(stream.getTracks());
            stream.getTracks().forEach(track=>{
                track.stop();
            });
        }
    }
    const onmodeChange=()=>{
        //let videosource=videoSelect.current && videoSelect.current.value;
        /*let videosource=e.target.value;
        
        //alert(videosource);*/
        if(istaking){
            return false;
        }
        let camerasetting;
        if(cameramode==1){
            console.log('전면=>후면');
            //전면카메라였던경우
            camerasetting="environment";
            setcameramode(0);
        }else{
            console.log('후면=>전면');
            camerasetting="user";
            setcameramode(1);
        }
        if(stream){
            //alert(stream.getTracks());
            stream.getTracks().forEach(track=>{
                track.stop();
            });
        }
        let constraints={
            audio:false,
            video:{
                width:{min:640, ideal: 1280},
                height:{min:360, ideal:720},
                //deviceId:videosource ? {exact:videosource}:undefined}
                facingMode : {exact:camerasetting}
            }
        };
        //navigator.mediaDevices.getUserMedia(constraints).then(gotStream_load).then(gotDevices).catch(handleError);
        navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
    }
    const onRecord = async () => {

        if(takelist.length+1 > takeCount){
            alert(`${takeCount}테이크까지만 촬영가능합니다. 최대 5테이크까지 가능합니다.`);
            return false;
        }
        /*if(window.stream){
            console.log('getTracksss:',window.stream.getTracks());
            window.stream.getTracks().forEach(track=>{
                track.stop();
            });
        }*/
        /*let videosource=videoSelect.current && videoSelect.current.value;
        console.log('현재 설정 비디오value값:',videosource);
        let constraints={
            audio:false,
            video:{width:720,height:1280, deviceId:videosource ? {exact:videosource}:undefined}
        };*/
        /*let stream = await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720}, audio:false});
        recorder.stream=stream;

        videoref.current.srcObject=stream;
        videoref.current.play();*/

        //navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
        recorder.startRecording();

        let counter=0;
        let interval_timer;        
        interval_timer=setInterval(async function(){
            console.log('interval timesersss:',interval_timer,counter);
            console.log(`${parseInt(100*(counter/50))} % progressss`);
            let progress = parseInt(100*(counter/50));
            setPercentage(progress);
            setCount(counter);
            if(counter==50){
                clearInterval(interval_timer);

                //recorder.stream.stop();
                onStop(recorder,counter);

                setPercentage(0);
                setCount(50);
            }
            counter++;
        },1000);//녹화종료>>>50초경과 타이머      
        setistaking(true);setTimer(interval_timer);  
    }
  
    const onStop = async (recorder,Count) => { 
        console.log('현 카운트값:',Count);

        if(Count<16){
            alert('촬영길이가 15초는 되야합니다.');
            return false;
        }
        console.log('=============onSTOP레코딩 종료 =======================================',recorder,recorder.stream,stream);
        clearInterval(timer);
       
        //recorder.stream.stop();
        await recorder.stopRecording();
        let blob=await recorder.getBlob();
        console.log('=======================[[[[[[[레코딩 종료 blob datass]]]]]]]]]]]]===========',blob,URL.createObjectURL(blob));

        setuploadlistcnt(uploadlistcnt+1);

        let aab;
        let fileReader=new FileReader();
        fileReader.onload = async function(){
            console.log('fileReader buffer reusltss:',this.result);

            aab=this.result;

            let blob=new File([aab],`take${shotCount+1}.mp4`,{
                type:'video/mp4'
            });
            console.log('blob whatss:',blob);
            let takestore={
                id:takelist.length,
                file:blob,
                url:URL.createObjectURL(blob),
                buffer:aab
            }
            
            console.log('tAKESTORESSS:',takestore);
            let original_takelist=[...takelist];
            original_takelist.push(takestore);
            settakelist(original_takelist);

            setShotCount(shotCount+1);

            let form_data =new FormData();
            form_data.append('videotake',blob);

            let res=await serverController.connectFetchController('media/regist','POST',form_data);

            if(res){
                console.log('UPLOAD ENCODING resultssss:',res.result);
                let blobsss=await fetch(res.result).then(response=>response.blob());
                console.log('get blosssss:',blobsss);
                let durationss=await getBlobDuration(blob);
                console.log('get duratisonss blos:',durationss);

                let original_uploadlist=[...uploadlist];
                let uploadstore={
                    id:takelist.length,
                    src: res.result,
                    time: durationss,
                    remote_src: res.result,
                    media_source_path: res.result
                }
                original_uploadlist.push(uploadstore);
                console.log('adapt originaluliplistst:',original_uploadlist);
                setuploadlist(original_uploadlist);
            }
        }
        fileReader.readAsArrayBuffer(blob);

        setCount(0);setPercentage(0);
        setistaking(false);setTimer(null);

        console.log('=======================[[[[[[[레코딩 종료 blob datass]]]]]]]]]]]]=========== ENDS======================');
    }

    const fileToDatauri = (file)=>{
        /*let reader=new FileReader();
        reader.onload = (event)=>{
            console.log('reader target reusltss:',event.target.result);
        }
        reader.readAsDataURL(file);*/
        let urlblob=URL.createObjectURL(file);
        console.log('url blbsss:',urlblob,file);

        let takestore={
            id: takelist.length,//3개->4개 
            file : file,
            url : urlblob,
            buffer : null
        }
        console.log('takestoresss:',takestore);
        let original_takelist=[...takelist];
        original_takelist.push(takestore);
        settakelist(original_takelist);

        setShotCount(shotCount+1);
    }
    const library_video_upload = async (e)=>{
        if(uploading || istaking){
            alert('처리중입니다.잠시만 기다려주세요.');
            return false;
        }
        if(window.confirm("해당 파일이 업로드 됩니다.그렇게 합니까?영상선택시에 선택영상은 모바일해상도 표준근사규격 ex:720x1280 입력을 권장드립니다.")){
            console.log('비디오테이크 라이브러리 업로드:',e.target);
            setuploadlistcnt(uploadlistcnt+1);
            setuploading(true);

            let file=e.target.files;
            console.log('filess:',file[0]);

            fileToDatauri(file[0]);

            let form_data =new FormData();
            form_data.append('videotake',file[0]);

            let res=await serverController.connectFetchController('media/regist','POST',form_data);

            if(res){
                console.log('UPLOAD ENCODING resultssss:',res);

                let video_element=document.createElement("VIDEO");
                video_element.src=res.result;
                video_element.onloadeddata=function(event){
                    console.log('대상체 관련 비디어 메타정보조회:',event.target);

                    let duration=event.target.duration;
                    let original_uploadlist=[...uploadlist];
                    let uploadstore={
                        id:takelist.length,
                        src:res.result,
                        time:duration,
                        remote_src:res.result
                    }
                    original_uploadlist.push(uploadstore);
                    console.log('adapt originalupdalist:',original_uploadlist);
                    setuploadlist(original_uploadlist);
                    setuploading(false);
                }

            }
        }   
    }
    
    useEffect(()=>{
        console.log('takelistss,uploadlist,takeCount,uploadlistcnt',takelist,uploadlist,takeCount,uploadlistcnt);
        console.log('videoModalState:',videoModalState);
        if(takeCount>=1){
            if(takeCount==uploadlist.length && takeCount==uploadlistcnt){
                setnextPossible(true);
            }else{
                setnextPossible(false);
            }
        }
        
    },[takelist,uploadlist,takeCount,uploadlistcnt,videoModalState]);

    useEffect(async()=>{
        onLoad();
    },[]);
    useEffect(()=>{
        console.log('페이지 첫 도달시에 스트림있나 여부:',stream);
    },[stream])

    return (
        <>
            <CameraDefault camerapage_streamRemove={camerapage_streamRemove} preview={false} save={false} camera={true} onmodeChange={onmodeChange} >
            
                <CAMERAACCESS>
                    <VIDEOACCESS ref={videoref}></VIDEOACCESS>
                </CAMERAACCESS>
                <CameraWrap>
                    <GalleryBtn alt="Gallery" for='videoupload'></GalleryBtn>
                    <Fileuploader id='videoupload' type='file' accept="audio/*,video/*" onChange={library_video_upload}/>
                    <CameraBtn onClick={()=>{ onRecord()}}on={istaking}>
                        <CircularProgressbar
                            text={`START`}
                            styles={buildStyles({
                            strokeLinecap: "butt",
                            pathColor: "gold",
                            trailColor: "gold",
                            textColor:"#fe2010"
                            })}
                        />
                    </CameraBtn>
                    <StopBtn on={istaking} onClick={()=>{ onStop(recorder,Count)}}>
                        <CircularProgressbar                        
                           ref={captureProgress}
                           value={percentage}
                           strokeWidth={3}
                           text={`${50-Count}`}
                           styles={buildStyles({
                           strokeLinecap: "butt",
                           pathColor: "gold",
                           trailColor: "gold",
                           textColor:"#fe2010"
                           })}
                        />  
                    </StopBtn>
                    <TakeWrap>
                        <Take src={IconTake} alt="" />
                        <CountWrap>
                            <MinusBtn src={IconMinus} alt=""  onClick={MinusClick}/>
                            <TakeCount><Bold>{shotCount}</Bold>/{takeCount}</TakeCount>
                            <PlusBtn src={IconPlus} alt="" onClick={plusClick}/>
                        </CountWrap>
                    </TakeWrap>
                </CameraWrap>
                <TakeListBtnWrap>
                    <TakeListBtn src={takeListState ? IconClosed : IconOpen} alt="" onClick={()=>{setTakeListState(!takeListState)}}/>
                    <TakeBarList>
                        {
                            takelist.map((value,index)=>{
                                console.log('takebar index:',index);
                                //if(index > takeCount+1){return}
                                /*return(
                                    index <= shotCount ?
                                    <TakeBar key={index + 'take count'}/>
                                    :
                                    <TakeBarOff key={index + 'take count'}/>
                                )*/
                                return(
                                    <TakeBar key={index + 'take count'}/>
                                )
                            })
                        }
                    </TakeBarList>
                </TakeListBtnWrap>
                {
                    takeListState &&
                    <TakeListWrap>
                        {
                            takelist.map((value,index)=>{
                                console.log('takelist values,index:',value,index);
                                if(index > 4){return}
                                return(
                                    <TakeListBox on={index > shotCount}>
                                        {
                                            <Takevideo key={index+ 'takevideo'} src={value.url} onTouchStart={()=>{setVideoModalState(true);setplayvideo(value.url)}} onMouseDown={()=>{setVideoModalState(true); setplayvideo(value.url)}}/>                                        
                                        }
                                    </TakeListBox>
                                )
                            })
                        }
                    </TakeListWrap>
                }
            </CameraDefault>
            <FixedWrap>
                <NextBtn onClick={()=>{ 
                   camerapage_streamRemove();//카메라페이지의 마지막 지정 스트림을 지우고 넘어감.
                }}to={{pathname:`/edit/music`,
                    state:{
                        nextParameter : uploadlist
                    } 
                }}on={nextPossible}>
                    <NextBtnImg src={IconNext} alt="다음단계로 이동" />
                </NextBtn>
            </FixedWrap>
            {
                videoModalState &&
                <VideoModal setVideoModalState={setVideoModalState} playvideo={playvideo} />
            }
        </>
    );
}


const FixedWrap = styled.div`
    position: fixed; bottom: 0; left: 0;
    width: 100%;z-index:16;

`
const NextBtn = styled(Link)`
    width: calc(100vw*(67/428));
    padding: 0 ; position:relative;
    margin-left: auto;
    margin-right: calc(100vw*(16/428));
    ${({on})=>{
        return on ?
        `display:block`
        :
        `display:none`
    }}
`
const NextBtnImg = styled.img`
    width: calc(100vw*(67/428)); position:absolute;right:0;bottom:0;
    margin-bottom: calc(100vw*(14/428));
    height:calc(100vw * (64/428));
`

const CAMERAACCESS = styled.div`
    width:100vw;height:100vh;position:fixed;top:0;bottom:0;margin:auto 0;
`
const VIDEOACCESS =styled.video`
    width:auto;height:100%;

`
const CameraWrap = styled.div`
    display: flex; position:relative;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 calc(100vw*(30/428)) 0 calc(100vw*(25/428));
`
const CameraBtn = styled.div`
    position: absolute; left: 50%; transform: translateX(-50%);
    width: calc(100vw*(76/428));
    margin: 0 auto;
    &::after {content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: block;
    width: calc(100vw*(60/428)); height: calc(100vw*(60/428)); background: rgba(255,255,255,0.35); border-radius: 50%;}

    ${({on})=>{
        return on ?
        `display:none`
        :
        `display:block`
    }}
`
const StopBtn = styled.div`
position: absolute; left: 50%; transform: translateX(-50%);
width: calc(100vw*(76/428));
margin: 0 auto;
&::after {content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: block;
width: calc(100vw*(60/428)); height: calc(100vw*(60/428)); background: rgba(255,255,255,0.35); border-radius: 50%;}
${({on})=>{
    return on ?
    `display:block`
    :
    `display:none`
}}
`
const GalleryBtn = styled.label`
    width: calc(100vw*(50/428));height:calc(100vw * (50/428)); background-image:url(${IconGallery});
    display:block; background-repeat:no-repeat;background-size:cover;
    cursor: pointer;
`
const Fileuploader = styled.input` 
display:none;  
`
const TakeWrap = styled.div`
    width: calc(100vw*(90/428));
    padding-bottom: calc(100vw*(8/428));
    background: rgba(255,255,255,0.3);
    border-radius: calc(100vw*(6/428));position:relative;
`
const Take = styled.img`
    width: calc(100vw*(45/428));
    margin: 0 auto;
`
const MinusBtn = styled.img`
    width: calc(100vw*(9/428));
    cursor: pointer;
`
const PlusBtn = styled(MinusBtn)``
const CountWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`
const TakeCount = styled.p`
    font-size: calc(100vw*(13/428));
    font-weight: bold;
    color: rgba(255,255,255,0.5);
    padding: 0 calc(100vw*(8/428));
`
const Bold = styled.b`
    font-size: calc(100vw*(13/428));
    font-weight: bold;
    color: #fff;
`
const TakeListBtnWrap = styled.div`
    width: 100%;
    padding-top: calc(100vw*(28/428));
`
const TakeListBtn = styled.img`
    width: calc(100vw*(30/428));
    margin: 0 auto;
    cursor: pointer;
`
const TakeBarList = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100vw*(70/428));
    margin: calc(100vw*(10/428)) auto 0;
`
const TakeBar = styled.div`
    width: 100%; height: calc(100vw*(5/428));
    background: #fff;
    margin: calc(100vw*(1.5/428));
`
const TakeBarOff = styled(TakeBar)`
    opacity: 0.5;
`
const TakeListWrap = styled.div`
    display: flex;z-index:18;
    align-items: center;
    width: calc(100vw*(384/428));
    margin: calc(100vw*(16/428)) auto 0;
    background: rgba(255,255,255,0.1);
    padding: calc(100vw*(6/428)) calc(100vw*(8/428));
    border-radius: calc(100vw*(6/428));
    margin-bottom: calc(100vw*(40/428));
`
const TakeListBox = styled.div`
    display: flex;z-index:25;
    align-items: center; 
    width: calc(100%/5 - calc(100vw*(8/428))); height: calc(100vw*(52/428));
    margin-right: calc(100vw*(10/428));
    overflow: hidden;
    background: rgba(255,255,255,0.91);
    border-radius: calc(100vw*(5/428));
    &:last-child {margin-right: 0;}
    ${({on})=>{
        return on ?
        `border: 1px dashed #fff;`
        :
        ``
    }}
`
const TakeImg = styled.img`
    object-fit: cover;
    cursor: pointer;
`
const Takevideo = styled.video`
    width:100%;height:100%;

`