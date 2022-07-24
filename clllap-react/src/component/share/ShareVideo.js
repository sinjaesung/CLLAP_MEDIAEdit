//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import SaveBg from "../../img/img/save_img.jpg"
import IconBack from "../../img/icon/icon_arrow_back.svg"
import IconPlay from "../../img/icon/icon_play_btn.svg"
import BtnBg from "../../img/img/btn_bg.jpg"

import IconClllap from "../../img/icon/icon_share_clllap.png"
import IconFacebook from "../../img/icon/icon_share_facebook.png"
import IconInstagram from "../../img/icon/icon_share_Instagram.png"
import IconKakao from "../../img/icon/icon_share_kakao.png"
import IconTwitter from "../../img/icon/icon_share_twitter.png"

//common util use
import { CommonUtil } from "../common/commonutil";

export default function ShareVideo({standbydatas}) {
    console.log('compoentns sharevideo page도달 :',standbydatas);
   // alert(JSON.stringify(standbydatas));
    console.log('sharevideo share페이지도달:',global.cv);
    const history = useHistory();

    const [videoresult,setvideoresult] =useState("");
    const [videoresult_final,setvideoresult_final] = useState("");

    const [duration,setduration] = useState(0);
    const [durationtime,setdurationtime] = useState("");

    if(!standbydatas['video_result_final']){
        standbydatas={};
        standbydatas['video_result_final']="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/08jfVAlPl56rUHOFz5Tfvideos_withTransition.mp4";
    }
    //alert(JSON.stringify(standbydatas));

    const writeClick = () =>{
        //return history.push(`/share/write`);//해당 링크 처리output링크 link등을 공유하면 될것임.

       /* history.push({
            pathname: "/share/write",
            state : { 'video_result_final':video_result_final}
        })*/
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"RN_nextMove", nextParam:standbydatas['video_result_final'] }));
        }
    }

    let CommonUtil_use=CommonUtil()();

    const [videosrc,setvideosrc] = useState("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/08jfVAlPl56rUHOFz5Tfvideos_withTransition.mp4");

    return (
        <Container>
            <CameraWrap>
                {/*<BackBtn src={IconBack} alt="뒤로가기" onClick={backClick}/>*/}
                <Title onClick={()=>{
                    //history.push('/')
                    if(window.ReactNativeWebView){
                        window.ReactNativeWebView.postMessage(JSON.stringify({type:"RN_RootMove"}));
                    }
                }}>Share</Title>
            </CameraWrap>
            <EditVideoWrap>
                <EditVideo_ src={standbydatas&&standbydatas['video_result_final']} controls />
            </EditVideoWrap>
            <Time>{durationtime}</Time>
            <ShareSnsList>
                <ShareSns src={IconClllap} alt="Clllap" />
                <ShareSns src={IconFacebook} alt="Facebook" />
                <ShareSns src={IconInstagram} alt="Instagram" />
                <ShareSns src={IconKakao} alt="Kakao" />
                <ShareSns src={IconTwitter} alt="Twitter" />
            </ShareSnsList>
            <RightNowBtnWrap onClick={writeClick}>
                <RightNowBtn>Share</RightNowBtn>
            </RightNowBtnWrap>
        </Container>
    );
}


const Container = styled.div`
    width: 100%; height: auto;min-height:100vh;
    overflow: hidden;
    background: #F4F4FC;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`
const CameraWrap = styled.div`
    position: fixed; top: 0; left: 0; height:calc(100vw*(60/428));
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`
const BackBtn = styled.img`
    position: relative;
    width: calc(100vw*(30/428));
    padding: calc(100vw*(10/428));
    cursor: pointer;
    z-index: 100;
`
const Title = styled.p`
   /* position: absolute; left: 0;*/
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    text-align: center;
    color: #281755;
    width: 100%;height:auto;
    text-transform: uppercase;
`
const EditVideoWrap = styled.div`
    position: relative;
    width: calc(100vw*(368/428)); height:calc(100vw*(368/428) * (16/9));
    /*height: auto;*/
    margin: calc(100vw*(68/428)) auto calc(100vw*(15/428));
    border-radius: calc(100vw*(11/428));
    overflow: hidden;
    /*&::after {content: ''; display: block; position: absolute; top: 0; left: 0;
    width: 100%; height: 100%; background: rgba(1,1,1,0.4);}*/
`
const EditVideo = styled.img`
    width: 100%; height: 100%;
    object-fit: cover;
`
const EditVideo_ = styled.video`
    width: 100%; height:100%;
`
const PlayBtn = styled.img`
    position: absolute; top: 50%; left: 50%;
    width: calc(100vw*(52/428));
    transform: translate(-50%, -50%);
    cursor: pointer;
    z-index: 10;
`
const Time = styled.p`
    font-size: calc(100vw*(18/428));
    text-align: center;
    font-weight: bold;
    color: #281755;
    margin-bottom: calc(100vw*(38/428));
`
const RightNowBtnWrap = styled.div`
    position: relative; 
    width: calc(100vw*(338/428));
    padding: calc(100vw*(5/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #E2E2EB;
    border-radius: calc(100vw*(15/428));
    margin: 0 auto;margin-top:calc(100vw*(78/428));
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(15/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.2);}
`
const RightNowBtn = styled.p`
    width: 100%;
    font-size: calc(100vw*(22/428));
    text-align: center;
    font-weight: bold;
    color: #fff;
    padding: calc(100vw*(18/428)) 0;
    border-radius: calc(100vw*(15/428));
    text-transform: uppercase;
    background: url(${BtnBg}) no-repeat center/cover;
`
const ShareSnsList = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 calc(100vw*(30/428));
    margin-bottom: calc(100vw*(36/428));
`
const ShareSns = styled.img`
    width: calc(100vw*(60/428));
    border-radius: 50%;
    box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.09);
    cursor: pointer;
`
