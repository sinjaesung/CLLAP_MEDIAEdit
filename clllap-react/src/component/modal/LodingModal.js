//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconLoding from "../../img/icon/icon_loding.svg"


export default function LodingModal() {
    const history = useHistory();

    return (
        <>
            <Bg/>
            <ModalWrap>
                <LodingImg src={IconLoding} alt="Loding.." />
                {/*<LodingText>Clllllllllllllap…</LodingText>*/}
            </ModalWrap>
        </>
    );
}


const Bg = styled.div`
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100vh;
    background: rgba(1,1,1,0.87);
    z-index: 200;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`
const ModalWrap = styled.div`
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    z-index: 500;
`
const LodingImg = styled.img`
    width: calc(100vw*(70/428));
    margin: 0 auto calc(100vw*(12/428));
    animation: rotation 3s infinite;
    @keyframes rotation {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(90deg); }
        50% { transform: rotate(180deg); }
        75% { transform: rotate(270deg); }
        100% { transform: rotate(360deg); }
    }
`
const LodingText = styled.p`
    font-size: calc(100vw*(16/428));
    font-weight: bold;
    text-align: center;
    color: #fff;
`