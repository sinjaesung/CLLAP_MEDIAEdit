//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconComplete from "../../img/icon/icon_complete.svg"


export default function SignUpComplete() {

    const emailLoginClick=()=>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"pageMove",target:"emailLogin"}));
        }
    }
    return (
        <Container>
            <SignUpCompleteWrap>
                <CompletImg src={IconComplete} alt="회원가입 완료" />
                <CompletTitle>축하합니다~</CompletTitle>
                <CompletText>회원가입이 완료되었습니다.<br/>로그인 화면에서 로그인 해주세요.</CompletText>
                <BtnWrap onClick={emailLoginClick}>
                    <BtnText>Login</BtnText>
                </BtnWrap>
            </SignUpCompleteWrap>
        </Container>
    );
}


const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; min-height: 100vh;
    background: #F4F4FC;
    padding: calc(100vw*(35/428)) calc(100vw*(60/428));
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`
const SignUpCompleteWrap = styled.div`
    width: 100%;
    margin-bottom: calc(100vw*(50/428));
`
const CompletImg = styled.img`
    width: calc(100vw*(135/428));
    margin: 0 auto;
`
const CompletTitle = styled.h2`
    font-size: calc(100vw*(32/428));
    text-align: center;
    font-weight: bold;
    color: #A38DCC;
    margin-top: calc(100vw*(22/428));
`
const CompletText = styled.p`
    font-size: calc(100vw*(16/428));
    line-height: 1.34;
    text-align: center;
    font-weight: bold;
    color: #39394A;
    margin-top: calc(100vw*(20/428));
`
const BtnWrap = styled.p`
    position: relative;
    width: 100%;
    border-radius: calc(100vw*(27/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    padding: calc(100vw*(4/428));
    margin-top: calc(100vw*(45/428));
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(27/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const BtnText = styled.p`
    width: 100%; height: calc(100vw*(46/428));
    font-size: calc(100vw*(20/428));
    line-height: calc(100vw*(44/428));
    font-weight: bold;
    text-align: center;
    color: #281755;
    border-radius: calc(100vw*(27/428));
    background-color: #f7f7ff;
    padding: 0 calc(100vw*(20/428));
    &::placeholder {color: #c0b9ce; font-size: calc(100vw*(15/428));}
`