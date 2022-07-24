//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"
import DangerModal from "../../component/modal/DangerModal";
import DefaultModal from "../../component/modal/DefaultModal";

import IconArrow from "../../img/icon/icon_arrow_back.svg"
import IconLogo from "../../img/icon/icon_main_logo.svg"


export default function GuidePage() {
    const history = useHistory();

    return (
        <Container>
            <TitleWrap>
                <BackBtn src={IconArrow} alt="뒤로가기" onClick={() => history.goBack()}/>
                <Title>사용자 가이드</Title>
                <div></div>
            </TitleWrap>

            <ContentGrid>
                <Text>사용자 가이드 내용 사용자 가이드 내용 사용자 가이드 내용 사용자 가이드 내용 사용자 가이드 내용 사용자 가이드 내용</Text>
            </ContentGrid>
        </Container>
    );
}

const Container = styled.div`
    width: 100%; min-height: 100vh;
    background: #F4F4FC;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`
const TitleWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: calc(100vw*(22/428)) calc(100vw*(28/428));
`
const BackBtn = styled.img`
    width: calc(100vw*(10/428));
    cursor: pointer;
`
const Title = styled.h3`
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    color: #281755;
    text-transform: uppercase;
`
const ContentGrid = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 calc(100vw*(26/428));
`
const Text = styled.p`
    font-size: calc(100vw*(16/428));
    line-height: 1.4;
    color: #281755;
`
