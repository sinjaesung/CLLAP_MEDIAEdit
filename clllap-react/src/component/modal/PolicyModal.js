//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"


export default function DefaultModal({message,confirmClick}) {

    return (
        <>
            <Bg/>
            <ModalWrap>
                <Message>{message}</Message>
                <BtnWrap onClick={confirmClick}>
                    <Btn>확인</Btn>
                </BtnWrap>
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
    padding: calc(100vw*(40/428));
    transform: translate(-50%,-50%);
    z-index: 500;
`
const Message = styled.div`
    font-size: calc(100vw*(16/428));
    font-weight: bold;
    text-align: left;
    color: #39394A; white-space:pre-line;
    height:calc(100vw*(300/428));overflow-y:auto;
`
const BtnWrap = styled.div`
    position: relative;
    width: calc(100vw*(270/428));
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