//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"


export default function DangerModal({title,onClickCancel, onClickDanger, content}) {

    return (
        <>
            <Bg/>
            <ModalWrap>
                <Title>{title}</Title>
                <Content>{content}</Content>
                <BtnContainer>
                    <BtnWrap onClick={onClickCancel}>
                        <Btn>취소</Btn>
                    </BtnWrap>
                    <BtnWrap onClick={onClickDanger}>
                        <Btn style={{color:"#A28DCB"}}>회원탈퇴</Btn>
                    </BtnWrap>
                </BtnContainer>
            </ModalWrap>
        </>
    );
}


const Bg = styled.div`
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100vh;
    background: rgba(1,1,1,0.6);
    z-index: 200;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`
const ModalWrap = styled.div`
    position: fixed; top: 50%; left: 50%;
    width: calc(100vw*(400/428));
    background: #F4F4FC;
    border-radius: calc(100vw*(12/428));
    padding: calc(100vw*(20/428)) calc(100vw*(20/428)) calc(100vw*(30/428));
    transform: translate(-50%,-50%);
    z-index: 500;
`
const Title = styled.p`
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    text-align: center;
    color: #39394A;
`
const Content = styled.p`
    font-size: calc(100vw*(16/428));
    font-weight: regular;
    text-align: center;
    margin: calc(100vw*(36/428)) auto calc(100vw*(16/428));
    color: #39394A;
`
const BtnContainer = styled.div`
    display: flex;
    
`
const BtnWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 40%;
    padding: calc(100vw*(12/428)) 0;
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(8/428)) 0 #fff;
    background-color: #F7F7FF;
    border-radius: calc(100vw*(15/428));
    margin: calc(100vw*(45/428)) auto 0;
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(15/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const Btn = styled.p`
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    text-align: center;
    color: #281755;
`