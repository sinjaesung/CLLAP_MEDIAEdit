import { useState,useEffect } from "react";

//css
import styled from "styled-components"

// component
import ShareVideo from '../../component/share/ShareVideo';

export default function SharePage() {

    let video_result;let video_result_final;

    //video_result = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/9pWTFQQaLXA74bKG2EoX_output.mp4";
    //video_result_final = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/9pWTFQQaLXA74bKG2EoX_output.mp4";

    video_result = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/It49VfkBRlktKfdPMxNP_output.mp4";
    video_result_final = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/It49VfkBRlktKfdPMxNP_output.mp4";

    video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/encodingvideowDrtR3xp5hSimK4xKPdo_encoded1.mp4";
    video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/vQVTCynd2ooTqgQgTcBavideos_withTransition.mp4";
    video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/vQVTCynd2ooTqgQgTcBa_videoframeoutput.mp4";

    video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/outputsssaudio.webm";

    video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/BYQb9NMcPZP58w10h9VU_output.mp4";
    return (
        <>
            <ShareVideo video_result={video_result} video_result_final={video_result_final}/>
        </>
    );
}
