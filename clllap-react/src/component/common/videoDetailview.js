import { useState,useEffect ,useRef} from "react";

//css
import styled from "styled-components"

//img
import iconPlay from "../../../img/icon/icon_play_btn.svg"

// component
import CameraDefault from '../../../component/camera/CameraDefault';
import LodingModal from '../../../component/modal/LodingModal';

import serverController from '../../../server/serverController';

import { useSelector } from 'react-redux';

export default function PreviewPage() {

    const [videosrc,setvideosrc] = useState("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/rJL9AZb6xAZG59FF7AI8_finalOutput.mp4");
    const [overlayvideo,setoverlayvideo] = useState("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/particles3.mp4");

    const userData = useSelector(store => store.userData.userData);
    const videoElement=useRef(null);const overlayvideoElement=useRef(null);
    
    const canvasEl=useRef();
    const [CanvasContext,setCanvasContext]=useState({});
    const overlaycanvasEl=useRef();
    const [overlayCanvasContext,setOverlayCanvasContext] = useState({});

    //let standbydata=location.state.nextParameter; //datas,datastore,lloPc-0ount

    const [effectdata,setEffectdata]=useState({});
    const [test_refer_data,setTest_refer_data]=useState([]);
    useEffect(() => {
        console.log('===페이지 로드시점 확인됨:',global.cv);
        document.addEventListener("message",async(event)=>{
            let test_data=JSON.parse(event.data);
           // alert(event.data);

            setStandbydatas(test_data);
            setalreadyReceive(true);
        })

        //videoElement.current.addEventListener("playing",onVideoStarted,false);
        //videoElement.current.addEventListener("pause",onVideoStopped,false);
        //videoElement.current.addEventListener("ended",onVideoStopped,false);

        //overlayvideoElement.current.addEventListener("ended",overlayvideoStopped,false);

        if(canvasEl.current){
            console.log('===>페이지 로드시점 canvasElement본체:',canvasEl.current,canvasEl.current.getContext('2d'));
            setCanvasContext(canvasEl.current.getContext('2d'));
        }
        if(overlaycanvasEl.current){
            console.log('===>페이지로드시점 overlaycanvasElement본체:',overlaycanvasEl.current,overlaycanvasEl.current.getContext('2d'));
            setOverlayCanvasContext(overlaycanvasEl.current.getContext('2d'));
        }

        return () =>{
            console.log('previewPage이탈시에 발생 clenauP unmount시점 발생:',streaming_timeout);
            //clearTimeout(streaming_timeout);
            onVideoStopped();alert("previewpage페이지 이탈!! ")
        }
    },[]);
    useEffect(async()=>{
        console.log('stadnbydatasss:',standbydatas);

        if(alreadyReceive){
            return false;//이미 서버에 요청 한번했다면 true상태일터이고, 이때는 더이상 보내지않음.한번만보냄.
        }

        //alert('stnadbysatsss'+JSON.stringify(standbydatas));
        //alert('effectDatsss:'+JSON.stringify(standbydatas['effect']));
        let music=standbydatas['music'];
        let effect=standbydatas['effect'];
        let musictransitiontype=standbydatas['selecttransition'];
        //let musictransitiontype='opencv';
        var takeedit_video_list=standbydatas['takeedit_video_list'];
        var memid=standbydatas['memid'];
        //let common_timebase=standbydatas['common_timebase'];//takeedit videolist 비디오들의 통일화된 일관화된 timebase값
       // setTest_refer_data(takeedit_video_list);

        if(standbydatas){
            if(standbydatas['effect']){
                let effect_object=JSON.parse(effect);
                let effect_two_sort=Object.keys(effect_object);//이펙트 관련 요소의 effect_two_sort종류.

                let filter;
                let filter_start;let filter_end;
                let filter_value;
                let overlay;
                let overlay_start;let overlay_end;
                let overlay_value;

                for(let j=0; j<effect_two_sort.length;j++){
                    let local_item=effect_two_sort[j];
                    if(local_item.indexOf(".mp4")!=-1){
                        //overlay
                        overlay=local_item;
                        overlay_value=effect_object[local_item];
                        overlay_start=overlay_value.split('~')[0];
                        overlay_end=overlay_value.split('~')[1];
                    }else{
                        //filter effect
                        filter=local_item;
                        filter_value=effect_object[local_item];
                        filter_start=filter_value.split('~')[0];
                        filter_end=filter_value.split("~")[1];
                    }
                }
                setoverlayvideo("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/"+overlay); //overlayvideo데이터 지정.
                setEffectdata(JSON.parse(standbydatas['effect']));
            }else{
                setoverlayvideo("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/rain18.mp4");
                setEffectdata(JSON.parse('{"rain18.mp4":"2~5","canny":"10~13"}'));
            }
        }
        
        if(music && musictransitiontype && takeedit_video_list && takeedit_video_list.length>=1){
            let formdata=new FormData();
           // formdata.append('user_id',userData.user_id ? userData.user_id : 30);
            formdata.append("user_id",memid);
            formdata.append('edittake_videolist',takeedit_video_list&& takeedit_video_list.join(','));
            formdata.append('music',music);
            formdata.append('select_overlay',1);
            formdata.append('select_filter','canny');
            formdata.append('transition_type',musictransitiontype);

            setLodingModal(true);

            //formdata.append("common_timebase",common_timebase);

            let iscompleted=false;
            let res= serverController.connectFetchController('media/videomake','POST',formdata,function(res){
                if(res){
                    setalreadyReceive(true)
                    
                    console.log('====>>처리결과::',res);
    
                    setLodingModal(false);
                    
                    setvideosrc(res.video_result_final);
                    let next_data={
    
                    };
                    next_data['video_result_final']=res.video_result_final;
                    setNextdatas(next_data);
                    setnextpossible(true);
                    iscompleted=true;
                }
            });
            let standby_cnt=0;
            let effectprocess_standby=setInterval(function(){

                if(standby_cnt==70){
                    //70초가 넘었는데도 반응없다면!

                    if(iscompleted==false){
                        setLodingModal(false);
                        alert('처리에 지연이 있는것같습니다. 이전페이지로 복귀후 다시 시도해주세요');
                    }

                    alert("70초 특정시간 경과amount시에 interval자원해제!");
                    clearInterval(effectprocess_standby);
                    return false;
                }
                standby_cnt++;

            },1000);//1초
        }
        //alert(standbydatas['effect']);
    },[standbydatas]);
    useEffect(()=>{
        //alert("VIDEO REUSLTS FINALSSS:"+videosrc);
    },[videosrc])
    useEffect(()=>{
        console.log('effectDatass debugsssgss:',effectdata);
    },[effectdata]);
    useEffect(()=>{
        console.log('===>overlayvideos setting지정:',overlayvideo);
        //alert('overlayvideo지정:'+overlayvideo);
    },[overlayvideo]);
    useEffect(()=>{
        console.log('canvasCOntextss:',CanvasContext,overlayCanvasContext);
    },[CanvasContext,overlayCanvasContext])

    var dstC1=null;
    var dstC2=null;
    var dstC3=null;
    var dstC4=null;
    var src=null;
    var effect_src=null;

    var vc;var effect_vc;
    var streaming=false;

    let streaming_timeout=false;

    //let cv=global.cv;
    let cv =global.cv;
    //let canvasFrame=document.getElementById('canvasOutput');
    //console.log('===canvasFramess:',canvasFrame);
    //let context=canvasFrame&&canvasFrame.getContext('2d');

    function passThrough(src){
        return src;
    }
    function gray(src){
        cv.cvtColor(src,dstC1,cv.COLOR_RGBA2GRAY);
        return dstC1;
    }
    function hsv(src){
        cv.cvtColor(src,dstC3,cv.COLOR_RGBA2RGB);
        cv.cvtColor(dstC3,dstC3,cv.COLOR_RGB2HSV);
        //cv.cvtColor(dstC3,dstC4,cv.COLOR_)
        return dstC3;
    }
    function canny(src){
        cv.cvtColor(src,dstC1,cv.COLOR_RGBA2GRAY);
        cv.Canny(dstC1,dstC1,4,4,5,10);

        return dstC1;
    }
    let contoursColor = [];
    for (let i = 0; i < 10000; i++) {
        contoursColor.push([Math.round(Math.random() * 255),
                            Math.round(Math.random() * 255),
                            Math.round(Math.random() * 255), 0]);
    }
    //contours
    function contours(src) {
        cv.cvtColor(src, dstC1, cv.COLOR_RGBA2GRAY);
        cv.threshold(dstC1, dstC4, 160, 240, cv.THRESH_BINARY);
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(dstC4, contours, hierarchy,
                        Number(cv.RETR_CCOMP),
                        Number(cv.CHAIN_APPROX_SIMPLE), {x: 0, y: 0});
        dstC3.delete();
        dstC3 = cv.Mat.ones(640, 360, cv.CV_8UC3);
        for (let i = 0; i<contours.size(); ++i) {
            let color = contoursColor[i];
            cv.drawContours(dstC3, contours, i, color, 1, cv.LINE_8, hierarchy);
        }
        contours.delete(); hierarchy.delete();
        return dstC3;
    }
    //범위출력
    function inRange(src){
        let lowvalue=90;
        let lowScalar=new cv.Scalar(lowvalue,lowvalue,lowvalue,255);
        let highvalue=140;
        let highScalar=new cv.Scalar(highvalue,highvalue,highvalue,255);
        let low=new cv.Mat(640,360,src.type(),lowScalar);
        let high=new cv.Mat(640,360,src.type(),highScalar);
        cv.inRange(src,low,high,dstC1);
        low.delete();high.delete();
        return dstC1;
    }
    function threshold(src){
        cv.threshold(src,dstC4,5,200,cv.THRESH_BINARY);
        return dstC4;
    }
    function adaptiveThreshold(src){
        let mat=new cv.Mat(640,360,cv.CV_8U);
        cv.cvtColor(src,mat,cv.COLOR_RGBA2GRAY);
        cv.adaptiveThreshold(mat, dstC1, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY, Number("27"), 2);

        mat.delete();
        return dstC1;
    }
    function laplacian(src){
        let mat=new cv.Mat(640,360,cv.CV_8UC1);
        cv.cvtColor(src,mat,cv.COLOR_RGB2GRAY);
        cv.Laplacian(mat,dstC1,cv.CV_8U,5,1,0,cv.BORDER_DEFAULT);
        mat.delete();
        return dstC1;
    }
    var filter_array={
        'gray':gray,
        'hsv':hsv,
        'canny':canny,
        'contours':contours,
        'inRange':inRange,
        'threshold':threshold,
        'adaptiveThreshold':adaptiveThreshold,
        'laplacian':laplacian
    }

    const processVideo=()=>{
        console.log('prcoessinvVIdoesss:',vc,src,effect_vc,effect_src);
        console.log('now video times currentTiemss:',videoElement.current.currentTime,videoElement.current.duration);
        console.log('===>processVideosss: streaming여부 상태]]]]]][[timeout id]]',streaming,streaming_timeout);
        let begin=Date.now();//처리시작 시점.
        if(!streaming) {
            console.log('streaming상태가아닌경우<<processVideo>>:',streaming);
            if(src!=null &&!src.isDeleted())src.delete();
            if(dstC1!=null && !dstC1.isDeleted()) dstC1.delete();
            if(dstC3!=null && !dstC3.isDeleted()) dstC3.delete();
            if(dstC4!=null && !dstC4.isDeleted()) dstC4.delete();
            return;
        }

        src.crossOrigin='anonymous';
        effect_src.crossOrigin='anonymous';

        let effect_two_sort=Object.keys(effectdata);
        //let effect1=effectdata[effect_two_sort[0]];
        //let effect2=effectdata[effect_two_sort[1]];
        let filter;
        let filter_start;let filter_end;
        let filter_value;
        let overlay;
        let overlay_start;let overlay_end;
        let overlay_value;

        for(let j=0; j<effect_two_sort.length;j++){
            let local_item=effect_two_sort[j];
            if(local_item.indexOf(".mp4")!=-1){
                //overlay
                overlay=local_item;
                overlay_value=effectdata[local_item];
                overlay_start=overlay_value.split('~')[0];
                overlay_end=overlay_value.split('~')[1];
            }else{
                //filter effect
                filter=local_item;
                filter_value=effectdata[local_item];
                filter_start=filter_value.split('~')[0];
                filter_end=filter_value.split("~")[1];
            }
        }
        //if(effect1)
        //vc.read(src);effect_vc.read(effect_src);
        //console.log('contextss:',canvasEl,canvasEl.current,canvasEl.current.getContext('2d'));
        //let context=canvasEl.current.getContext('2d');
             
        //version2
        console.log('canvsContextssss:',CanvasContext);
        CanvasContext.drawImage(videoElement.current,0,0,360,640);
        src.data.set(CanvasContext.getImageData(0,0,360,640).data);
        console.log('canvasContextss(overlay):',overlayCanvasContext);
       
        let result;

        let video_current_time=videoElement.current.currentTime;
        let video_total_duration=videoElement.current.duration;

        //filter효과부여. 선택한 음악에 대한 이펙트처리(서버단 트랜지션,음악지정)
        //effect효과부여는 브라우저에서 서버단처리결과물에 대해서 재생시에 타임라인에 따라서 반영한다.필터효과반영부분.
        console.log('===>지정음원에 대해서 관련된 필터:',filter,filter_array[filter]);
        if(video_current_time >=filter_start && video_current_time<=filter_end){
            //result=laplacian(src);
            result=filter_array[filter](src);
        }else{
            result=src;
        }
        //result=src;

        //filter gray,onechannel,rgb channel과 ,rgba(4)channel인 overlayresult는 동시에 병합연산은 불가합니다. 즉 필터영역의시간범위와, 오버레이 범위는 반드시 겹치지 않아야함!.. 또한 두개를 중첩연산시에 연산속도가 더걸리기에 모바일에선 특히 더 대역폭,delay차가 더 커지는 이슈생길수있음.
        //오버레이효과반영
        console.log('====>지정음원에 대해서 관련된 오버레이:',overlay);
        if(video_current_time>=overlay_start && video_current_time<=overlay_end){
            overlayCanvasContext.drawImage(overlayvideoElement.current,0,0,360,640);
            effect_src.data.set(overlayCanvasContext.getImageData(0,0,360,640).data);

            cv.imshow('overlaycanvasOutput',effect_src);//해당 범위에 속했던 경우에만 관련캔버스에

            cv.addWeighted(result,1,effect_src,1,0,result,-1);
        }

        console.log('got resultss:',result);
        cv.imshow('canvasOutput',result);

        //let delay=1000/25;
        let delay=1000/25 - (Date.now()-begin);
        console.log('procesVideo이미지처리시간 및 delay값:',(Date.now()-begin),delay);
        streaming_timeout=setTimeout(processVideo,delay);
    }
    const startVideoProcessing=()=>{
        src=new cv.Mat(640,360,cv.CV_8UC4);
        effect_src=new cv.Mat(640,360,cv.CV_8UC4);
        dstC1=new cv.Mat(640,360,cv.CV_8UC1);
        dstC3=new cv.Mat(640,360,cv.CV_8UC3);
        dstC4=new cv.Mat(640,360,cv.CV_8UC4);

        processVideo();
    }
    const onVideoStarted=()=>{
        console.log('====>비디오 스타트:',cv,cv.VideoCapture,videoElement.current.width,videoElement.current.height);
        overlayvideoElement.current.play();
        overlayvideoElement.current.currentTime=0;

        console.log('cv.capPropbufferSizse:',cv.CAP_PROP_BUFFER_SIZE);

        streaming=true;
        //vc=new cv.VideoCapture(videoElement.current);
        //effect_vc=new cv.VideoCapture(overlayvideoElement.current);
        //console.log('vc====>anonomyous settingss:',vc,effect_vc);
        startVideoProcessing();
    }
    const stopVideoProcessing=()=>{
        console.log('관련 src,dstsss자원 모두 해제');
        if(src!=null &&!src.isDeleted())src.delete();
        if(dstC1!=null && !dstC1.isDeleted()) dstC1.delete();
        if(dstC3!=null && !dstC3.isDeleted()) dstC3.delete();
        if(dstC4!=null && !dstC4.isDeleted()) dstC4.delete();
    }
    const onVideoStopped=()=>{
        console.log('=====>비디오 정지 or종료');
        console.log('===>비디오정지 종료되었다면 명시적cleartimeout:',streaming_timeout);
        videoElement.current.pause();
        overlayvideoElement.current.pause();
        clearTimeout(streaming_timeout);
        stopVideoProcessing();
        streaming=false;

        //alert("matrix자원해제");
    }
    const overlayvideoStopped=()=>{
        console.log('====>오버레이비디오는 종료(ends)될시에 계속 다시처음부터실행되게끔 반복');
        overlayvideoElement.current.play();
        overlayvideoElement.current.currentTime=0;
    }
    return (
        <>
            <CameraDefault title={'Preview'} next={'/edit/save'} nextClear={onVideoStopped} nextParameter={nextdatas}nextParameter_addon={[effectdata,overlayvideo]} nextPossible={nextpossible} camera={false}>
                <VideoWrap on={!LodingModal}>
                    <VideoPreview src={videosrc} crossOrigin={"true"}playsInline ref={videoElement} controls width={360}height={640} onPlaying={onVideoStarted} onPause={onVideoStopped} onEnded={onVideoStopped}></VideoPreview >
                    <LogTest>
                        {
                        /*test_refer_data&& test_refer_data.length>1 &&
                        test_refer_data.map((value,index)=>{
                            return (
                                <div key={index + 'key'}>{value}</div>
                            )
                        })*/
                        }
                    </LogTest>
                    <VideoPreview src={overlayvideo} crossOrigin={"true"}playsInline ref={overlayvideoElement} controls style={{display:"none"}}width={360}height={640} onEnded={overlayvideoStopped}/>
                    <CanvasOutput ref={canvasEl}
                    id='canvasOutput'
                    ></CanvasOutput>
                </VideoWrap>
                {/*<PlayBtn src={iconPlay} alt="" />*/} 
                <canvas style={{display:'none'}} id='overlaycanvasOutput' ref={overlaycanvasEl}></canvas>
            </CameraDefault>
            {
                lodingModal &&
                <LodingModal/>
            }
        </>
    );
}

const VideoWrap = styled.div`
    width:100%;height:100%;
    position:relative;
`
const LogTest = styled.div`
    width:100%;height:auto;overflow:hidden;text-overflow:wrap;white-space:normal;word-break:break-word;
`
const VideoPreview = styled.video`
    width: 100%;height:351px; position:absolute;bottom:30%;left:0;z-index:5;opacity:0.4
`
const VideoPreview_ = styled.video`
width: 100%;height:100%; position:relative;bottom:0%;z-index:5;opacity:0.4
`
const CanvasOutput=styled.canvas`
    width: 100%; height:100%;
`