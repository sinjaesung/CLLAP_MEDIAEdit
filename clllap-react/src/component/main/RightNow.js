//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

//css
import 'swiper/swiper-bundle.css';
import styled from "styled-components"

//img
import RightNowBg from "../../img/img/main_btn_bg.jpg"
import BtnBg from "../../img/img/btn_bg.jpg"

import { useSelector } from 'react-redux';

export default function RightNow() {
    const history = useHistory();
    const userData = useSelector(store => store.userData.userData);

    const cameraClick = () =>{
        //alert("카메라클릭");
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"CAMERA", userId: userData && userData.user_id}));
        }
    }
    return (
        <Container>
            <TitleWrap>
                <Title>나의 <SubPu>일상</SubPu>이</Title>
                <Title>한 편의 <SubBl>광고</SubBl>가 되는 순간</Title>
            </TitleWrap>
            <RightNowBtn onClick={cameraClick}>RIGHT NOW</RightNowBtn>
        </Container>
    );
}



const Container = styled.div`
    width: 100%;
    margin-top: calc(100vw*(25/428));
    background: url(${RightNowBg}) no-repeat center top/120%;
    padding: 0 calc(100vw*(45/428));
`
const TitleWrap = styled.div`
    width: 100%;
    padding: calc(100vw*(90/428)) calc(100vw*(26/428)) 0;
`
const Title = styled.h3`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: calc(100vw*(20/428));
    font-weight: bold;
    color: #4F5050;
    margin-bottom: calc(100vw*(8/428));
`
const SubPu = styled.span`
    display: block;
    font-size: calc(100vw*(24/428));
    color: #501BEF;
    margin-left: calc(100vw*(5/428));
`
const SubBl = styled(SubPu)`
    color: #1B44EF;
`
const RightNowBtnWrap = styled(Link)`
    position: relative;
    width: 100%;
    padding: calc(100vw*(5/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #E2E2EB;
    border-radius: calc(100vw*(15/428));
    margin-top: calc(100vw*(40/428));
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
    background: url(${BtnBg}) no-repeat center/cover;
`