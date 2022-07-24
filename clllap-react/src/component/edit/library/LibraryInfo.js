//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconArrow from "../../../img/icon/icon_arrow_back.svg"
import IconCamera from "../../../img/icon/icon_camera.svg"
import IconVideo from "../../../img/icon/icon_editing.svg"


export default function LibraryInfo({title,tabIndex,setTabIndex}) {
    const history = useHistory();

    const backClick = () =>{
        return history.goBack();
    }

    return (
        <Container>
            <TitleWrap>
                <BackBtn src={IconArrow} alt="뒤로가기" onClick={backClick}/>
                <Title>{title}</Title>
                <CameraBtn src={IconCamera} alt="Camera" />
            </TitleWrap>
            {/*<TabListWrap>
                <TabBox onClick={()=>{setTabIndex(0)}}><TabTitle on={tabIndex == 0}>ALL</TabTitle></TabBox>
                <TabBox onClick={()=>{setTabIndex(1)}}><TabTitle on={tabIndex == 1}>Video</TabTitle></TabBox>
                <TabBox onClick={()=>{setTabIndex(2)}}><TabTitle on={tabIndex == 2}>PICTure</TabTitle></TabBox>
                <TabBox onClick={()=>{setTabIndex(3)}}><TabTitle on={tabIndex == 3}>GIF</TabTitle></TabBox>
            </TabListWrap>*/}
        </Container>
    );
}


const Container = styled.div`
    width: 100%;
    background: #F4F4FC;
    padding-top: calc(100vw*(10/428));
    padding-bottom: calc(100vw*(15/428));
    border-radius: 0 0 calc(100vw*(25/428)) calc(100vw*(25/428));
    box-shadow: 0 0 calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.16);
`
const TitleWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: calc(100vw*(22/428)) calc(100vw*(28/428));
`
const Title = styled.h3`
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    color: #281755;
    text-transform: uppercase;
`
const BackBtn = styled.img`
    width: calc(100vw*(10/428));
    cursor: pointer;
`
const CameraBtn = styled(BackBtn)`
    width: calc(100vw*(24/428));
`
const TabListWrap = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: calc(100vw*(14/428));
    padding: 0 calc(100vw*(28/428));
`
const TabBox = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: calc(100vw*(3/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #F7F7FF;
    border-radius: calc(100vw*(25/428));
    margin-right: calc(100vw*(8/428));
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(25/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const TabTitle = styled.h3`
    width: 100%; height: 100%;
    padding: calc(100vw*(8/428)) calc(100vw*(15/428));
    font-size: calc(100vw*(15/428));
    font-weight: bold;
    border-radius: calc(100vw*(25/428));
    text-transform: uppercase;
    ${({on})=>{
        return on ?
        `background: #A38DCC; color: #fff; box-shadow: inset calc(100vw*(6/428)) calc(100vw*(6/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);`
        :
        `background: F7F7FF; color: #A38DCC;`
    }}
`