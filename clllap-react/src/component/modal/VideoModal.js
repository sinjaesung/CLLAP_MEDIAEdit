import { useState,useEffect,useRef } from "react";
import { CircularProgressbar,buildStyles } from "react-circular-progressbar";

//css
import styled from "styled-components"
import "react-circular-progressbar/dist/styles.css";

//img
import VideoImg from "../../img/img/camera_bg.jpg"
import IconPlay from "../../img/icon/icon_play_wh.svg"
import IconDelete from "../../img/icon/icon_delete_btn.svg"
import IconClosed from "../../img/icon/icon_closed_btn.svg"

export default function VideoModal({setVideoModalState,playvideo}) {

    const targetvideo=useRef();

    console.log('videoModal요소 실행::',playvideo);

    const target_play=function(){
        targetvideo.current.play();
    }
    const target_close=function(){
        targetvideo.current.pause();
    }
    return (
        <>
            <Container>
                <VideoWrap>
                    <Video src={playvideo} ref={targetvideo} controls></Video>
                    {/*<PlayBtn src={IconPlay} alt="" onClick={()=>{target_play();}}/>*/}
                    {/*<DeleteBtn src={IconDelete} alt="" />*/}
                    <ClosedBtn src={IconClosed} alt="" onClick={()=>{setVideoModalState(false);target_close();}}/>
                </VideoWrap>
            </Container>
        </>
    );
}


const Container = styled.div`
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100vh; z-index:99;
    background: rgba(1,1,1,0.3);
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`
const VideoWrap = styled.div`
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: calc(100vw*(286/428)); height: calc(100vw*(618/428));
    margin: 0 auto;
`
const Video = styled.video`
    display:block;width:100%;height:100%;
`
const PlayBtn = styled.img`
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: calc(100vw*(54/428));
    cursor: pointer;
`
const DeleteBtn = styled.img`
    position: absolute; bottom: calc(100vw*(15/428)); right: calc(100vw*(8/428));
    width: calc(100vw*(40/428));
    cursor: pointer;
`
const ClosedBtn = styled.img`
    position: absolute; top: calc(100vw*(5/428)); right: calc(100vw*(5/428));
    width: calc(100vw*(40/428));
    cursor: pointer;
`