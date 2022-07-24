import { useEffect, useRef, useState } from 'react'
//import cv from '../../../service/cv';

export default function Page() {
  const [processing, updateProcessing] = useState(false)
  const videoElement = useRef(null);const overlayvideoElement=useRef(null);
  const canvasEl = useRef(null);
  const [CV,setCv]=useState(false);

  const [videourl,setvideourl]=useState("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/08jfVAlPl56rUHOFz5Tfvideos_withTransition.mp4");
  const [overlayvideo,setoverlayvideo] = useState("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/particles3.mp4");
  //const [videourl,setvideourl]=useState("testVideo.mp4");

  useEffect(() => {
    console.log('===>페이지 로드시점 확인된:',global.cv);
    
    setCv(global.cv);

    videoElement.current.addEventListener("playing",onVideoStarted,false);
    videoElement.current.addEventListener("pause",onVideoStopped,false);
    videoElement.current.addEventListener("ended",onVideoStopped,false);

    overlayvideoElement.current.addEventListener('ended',overlayvideoStopped,false);

  }, []);
  useEffect(()=>{
    console.log('CV:',CV);
  },[CV])
  var dstC1=null;
  var dstC2=null;
  var dstC3=null;
  var dstC4=null;
  var src=null;
  var effect_src=null;
  
  var vc;var effect_vc;
  var streaming=false;
  let cv=global.cv;
  
  function gray(src){
    cv.cvtColor(src,dstC1,cv.COLOR_RGBA2GRAY);
    return dstC1;
  }
  function hsv(src){
    cv.cvtColor(src,dstC3,cv.COLOR_RGBA2RGB);
    cv.cvtColor(dstC3,dstC3,cv.COLOR_RGB2HSV);

    return dstC3;
  }
  function canny(src){
    cv.cvtColor(src,dstC1,cv.COLOR_RGBA2GRAY);
    cv.Canny(dstC1,dstC1,5,5,5,10);

    return dstC1;
  }

  function processVideo(){
    console.log('processingVIDEOSSS:',vc,src,effect_vc,effect_src);
    console.log('now video timesss currentTimess,vidoeTotaldurationsss:',videoElement.current.currentTime,videoElement.current.duration)
    if(!streaming) return;
    
    //var img=new Image();
    //img.crossOrigin = "anonymous";
    src.crossOrigin='anonymous';
    effect_src.crossOrigin='anonymous';
    //vc.read(src);

    //return false;
    vc.read(src);
    effect_vc.read(effect_src);

    let result;
    
    let video_current_time=videoElement.current.currentTime;
    let video_total_duration=videoElement.current.duration;

    //overlayvideoElement.current.currentTime=0;

    if(video_current_time>=4 && video_current_time<=7){
      result=hsv(src);
    }else{
      result=src;
    }

    if(video_current_time>=15 && video_current_time<=18){
      cv.addWeighted(result,1,effect_src,1.0,0.0,result,-1);
    }
    console.log('got reusltss:',result);
    cv.imshow('canvasOutput',result);
     
    //result.delete();//src.delete();
    let delay=1000/28;//40밀리초당 한번씩 캡처가된화면을 보여주면서 보인다.1초에 25장면(프레임)씩 25fps규격.
    setTimeout(processVideo,delay);

  }
  function startVideoProcessing(){
    
    src=new cv.Mat(640,360,cv.CV_8UC4);
    effect_src=new cv.Mat(640,360,cv.CV_8UC4);
    dstC1=new cv.Mat(640,360,cv.CV_8UC1)
    dstC3=new cv.Mat(640,360,cv.CV_8UC3);
    dstC4=new cv.Mat(640,360,cv.CV_8UC4);

    //requestAnimationFrame(processVideo);
    //setTimeout(processVideo,)//1000초  1000/25밀리초에 40밀리초:0.04초에 한프레임씩 장면씩 보인다.
    processVideo();
  }
  function onVideoStarted(){
    console.log('===비디오스타트',videoElement.current,videoElement.current.width,videoElement.current.height);
    overlayvideoElement.current.play();
    overlayvideoElement.current.currentTime=0;
    
    streaming=true;
    vc=new cv.VideoCapture(videoElement.current);
    effect_vc=new cv.VideoCapture(overlayvideoElement.current)
    console.log('vc==>anynomoussss settingss',vc,effect_vc);
    //vc.crossOrigin='anonymous';
    startVideoProcessing();
  }

  function stopVideoProcessing(){
    console.log('관련 src,dstss 자원 모두 해제!');
    if(src!=null && !src.isDeleted()) src.delete();
    if(dstC1 !=null && !dstC1.isDeleted()) dstC1.delete();
    if(dstC3 !=null && !dstC3.isDeleted()) dstC3.delete();
    if(dstC4 !=null && !dstC4.isDeleted()) dstC4.delete();
  }
  function onVideoStopped(){
    console.log('====비디오 정지or 종료!');
    if(!streaming) return;
    stopVideoProcessing();
    streaming=false;
  }

  function overlayvideoStopped(){
    console.log('===>오버레이 비디오는 정지될시에 계속 다시처음부터 실행되게끔반복한다!');
    overlayvideoElement.current.play();
    overlayvideoElement.current.currentTime=0;
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <video className="video" crossOrigin={"true"} src={videourl} playsInline ref={videoElement} controls style={{width:"360px"}} width={360}height={640}/>
      <video className='video' crossOrigin={"true"}src={overlayvideo} playsInline ref={overlayvideoElement} controls style={{width:"360px"}}width={360}height={640}/>
      <button
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Take a photo'}
      </button>
      <canvas id='canvasinput1'></canvas>
      <canvas id='canvasinput2'></canvas>
      <canvas style={{position:'absolute',top:"20%",right:"0%"}}
       id='canvasOutput'
        ref={canvasEl}
      ></canvas>
    </div>
  )
}