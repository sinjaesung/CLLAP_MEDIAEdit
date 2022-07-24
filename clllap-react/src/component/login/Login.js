//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import BgImg from "../../img/img/bg_img.jpg"
import IconLogo from "../../img/icon/icon_logo.svg"
import IconFace from "../../img/icon/icon_facebook.svg"
import IconKakao from "../../img/icon/icon_kakao.svg"
import IconApple from "../../img/icon/icon_apple.svg"
import Google from "../../img/icon/google_.svg"


export default function Login() {
    const emailLoginClick=()=>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"pageMove",target:"emailLogin"}));
        }
    }
    return (
        <Container>
            <LoginWrap>
                <LogoWrap>
                    <LogoImg src={IconLogo} alt="" />
                    <LogoText>Clllap</LogoText>
                </LogoWrap>
                <LoginList>
                    <LoginBtn onClick={() => {onClickSocial(0)}} src={IconFace} alt="페이스북 로그인" />
                    <LoginBtn onClick={() => {onClickSocial(1)}} src={IconKakao} alt="카카오 로그인" />
                    <LoginBtn onClick={() => {onClickSocial(2)}} src={IconApple} alt="애플 로그인" />
                </LoginList>
                <LoginText onClick={emailLoginClick}>이메일로 로그인 하기</LoginText>
            </LoginWrap>
        </Container>
    );
}

const onClickSocial = (index) => {

     console.log("social being clicked")
    if(index === 0){
        //window.location.href = "https://facebook.com";
        window.location.href ="https://teamspark.kr:8087/oauth2/authorization/facebook";
    }else if(index === 1){
        window.location.href ="https://teamspark.kr:8087/oauth2/authorization/kakao";
    }else if(index === 2){
        window.location.href = "https://apple.com";
        //window.location.href ="https://teamspark.kr:8087/oauth2/authorization/apple";
    }
}

// useEffect=()=>{

// }


const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; height: 100vh;
    background: url(${BgImg}) no-repeat center/cover;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`
const LoginWrap = styled.div`
    width: 100%;
    margin-bottom: calc(100vw*(50/428));
`
const LogoWrap = styled.div`
    width: 100%; 
`
const LogoImg = styled.img`
    width: calc(100vw*(232/428));
    margin: 0 auto;
`
const LogoText = styled.h1`
    width: 100%;
    font-size: calc(100vw*(41/428));
    margin-top: calc(100vw*(18/428));
    text-align: center;
    color: #fff;
    font-family: 'Gugi', sans-serif;
`
const LoginList = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; 
    margin-top: calc(100vw*(52/428));
`
const LoginBtn = styled.img`
    width: calc(100vw*(67/428));height:calc(100vw*(67/428));
    margin: 0 calc(100vw*(12/428));
    cursor: pointer; 
`
const LoginText = styled.p`
    width: 100%;
    font-size: calc(100vw*(19/428));
    margin-top: calc(100vw*(26/428));
    text-decoration: underline;
    text-align: center;
    color: #fff;
    cursor: pointer;
`