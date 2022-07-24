import { useState,useEffect } from "react";

//css
import styled from "styled-components"

// component
import ShareWrite from '../../component/share/ShareWrite';



export default function WritePage() {

    //console.log('share writepage도달:',location);

    useEffect(()=>{
        /*if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"Test maiWebview Load", data:'test' }));
        }*/
       
        document.addEventListener("message",async(event)=>{
            let test_data=JSON.parse(event.data);
            //alert(event.data);

            set_video_result_final(test_data.video_result_final);
            //setalreadyReceive(true);
        })
       
    },[]);
    const [video_result_final,set_video_result_final] = useState("");

    /*let video_result;let video_result_final;
    if(location.state){
        //video_result=location.state.video_result;
        video_result_final=location.state.video_result_final;
    }else{
        //dummy tests
        //video_result = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/DGem2XxZrWBRGdR0OHPo_opencv_transition_merged.mp4";
        video_result_final = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/DGem2XxZrWBRGdR0OHPo_output.mp4";
    }*/
    return (
        <>
            <ShareWrite video_result_final={video_result_final}/>
        </>
    );
}
