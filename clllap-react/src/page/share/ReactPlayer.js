/*import { useState,useEffect } from "react";
import React from 'react';
import ReactPlayer from 'react-player';

export default function ReactPlayers() {

    let video_result;let video_result_final;

    //video_result = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/9pWTFQQaLXA74bKG2EoX_output.mp4";
    //video_result_final = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/9pWTFQQaLXA74bKG2EoX_output.mp4";

    video_result = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/It49VfkBRlktKfdPMxNP_output.mp4";
    video_result_final = "https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/It49VfkBRlktKfdPMxNP_output.mp4";

    video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/encodingvideowDrtR3xp5hSimK4xKPdo_encoded1.mp4";
    video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/vQVTCynd2ooTqgQgTcBavideos_withTransition.mp4";
    video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/vQVTCynd2ooTqgQgTcBa_videoframeoutput.mp4";

    //video_result_final="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/outputsssaudio.webm";

    https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/5vyIxS8HTV1KajTCoN5t_output.mp4
    https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/BYQb9NMcPZP58w10h9VU_output.mp4
    return (
        <div
        dangerouslySetInnerHTML={{
          __html: `<video className="app__backgroundVideo" autoplay loop muted playsinline>
    <source src=${video_result_final} type="video/mp4" />
    Your browser does not support the video tag.
</video>`,
        }}
      />
    );
}
*/
import React, {useRef, useEffect} from "react"

export default function AutoPlaySilentVideo(props) {
    const videoRef = useRef(undefined);
    useEffect(() => {
        videoRef.current.defaultMuted = true;
    })
    return (
        <video
            className={props.className}
            ref={videoRef}
            controls
            playsInline>
            <source src={"https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/BYQb9NMcPZP58w10h9VU_output.mp4"} type="video/mp4"/>
        </video>
    );
}


/*import Iframe from 'react-iframe';

export default function ReactPlayers(){

    return(
        <Iframe url="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/vQVTCynd2ooTqgQgTcBa_videoframeoutput.mp4"
        width="450px"
        height="450px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"/>
    )
}*/
