import { useState,useEffect } from "react";

//css
import styled from "styled-components"

// component
import ShareVideo from '../../component/share/ShareVideo';

export default function SharePage() {
   
    //console.log('share페이지도달::',location);
    
    useEffect(()=>{
        /*if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"Test maiWebview Load", data:'test' }));
        }*/
       
        document.addEventListener("message",async(event)=>{
            let test_data=JSON.parse(event.data);
            //alert(event.data);

            setstandbydatas(test_data);
            //setalreadyReceive(true);
        })
       
    },[]);
    const [standbydatas,setstandbydatas] = useState({});

    /*
    let video_result;let video_result_final;
    if(location){
        if(location.state){
            //video_result=location.state.video_result;
            video_result_final=location.state.video_result_final;
        }
    }else{
        //dummy tests
       // video_result = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/9pWTFQQaLXA74bKG2EoX_output.mp4";
        video_result_final = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/9pWTFQQaLXA74bKG2EoX_output.mp4";
    }*/

    return (
        <>
            <ShareVideo standbydatas={standbydatas}/>
        </>
    );
}
