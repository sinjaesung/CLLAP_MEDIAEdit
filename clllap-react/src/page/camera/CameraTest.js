import React from 'react';
import RecordRTC from 'recordrtc';

import { useState,useEffect,useRef } from "react";
import { CircularProgressbar,buildStyles } from "react-circular-progressbar";

export default function CameraTest(){
    const [recorder,setrecorder] = useState(null);
    const [video,setvideo ] =useState(null);
    const [src,setsrc]=useState(null);

    const onRecord = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(function(stream) { 
            readyCamera(stream); 
        })
        .catch(function(error) {
            console.error(error); 
        });
    }
    
    const readyCamera = (stream) => {
        const video = document.getElementById('test-video');
        video.muted = false;
        video.volume = 0; 
        video.srcObject = stream; 
        const recorder = new RecordRTC(stream, { type: 'video', }); 
        console.log('카메라 시작:ㅣ',recorder,recorder.startRecording);

        recorder.startRecording();  
        recorder.stream = stream; 
        
        //this.setState({ recorder }); 
        setrecorder(recorder);
    } 
    
    const onStop = async () => { 
        //const { recorder } = this.state;
        
        // 카메라 정지
        recorder.stream.stop();
        recorder.stopRecording(async function(){

            const video = document.getElementById('test-video'); 
            video.src = video.srcObject = null; 
            video.muted = false; 
            video.volume = 1; 
            //video.src = URL.createObjectURL(recorder.getBlob); 
            console.log('카메라 종료::',recorder.getBlob);
            let blob=await recorder.getBlob();
            console.log('blob datass:',blob);
        })
        // 서버 저장 등을 위해 영상object 데이터 저장 
        //this.keepVideo(recorder); 
        //this.setState({ recorder: null });
        keepVideo(recorder.getBlob);
        setrecorder(null);
    }
    const keepVideo = (data) => {
        //console.log('recorder datasss:',data,data.blob,data.getBlob());
        /*this.setState({
            video: data.blob, src: URL.createObjecetUrl(data.getBlob()), 
        });*/
        setvideo(data.blob);
        //setsrc(URL.createObjectUrl(data.getBlob());
    }

    useEffect(()=>{
        console.log('recoerder:',recorder);
    },[recorder])
    return(
        <>
        <div className='video-test-container'> 
        <video id='test-video' autoPlay playsInline controls />
        <span onClick={onRecord}>촬영하기</span>
        <span onClick={onStop}>중지하기</span>
        </div> 
        </>
    );  
}
    
    

