//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconArrowBack from "../../../img/icon/icon_arrow_back.svg"
import IconArrowNext from "../../../img/icon/icon_arrow_next.svg"
import IconCamera from "../../../img/icon/icon_camera.svg"
import IconVideo from "../../../img/icon/icon_editing.svg"


export default function MusicInfo({tabIndex,setTabIndex,setModalOn,music,standbydata,accessfromApp}) {
    const history = useHistory();

    const backClick = () =>{return history.goBack();}

    const nextClick = () =>{return history.push("/edit/take");}

    return (
        <Container>
            <TitleWrap>
                {/*<BackBtn src={IconArrowBack} alt="뒤로가기" onClick={backClick}/>*/}
                <Title>Choose music</Title>
                <NextBtn src={IconArrowNext} alt="Camera" onClick={()=>{ setModalOn(true)}}/>
            </TitleWrap>
            <TabListWrap>
                <TabBox onClick={()=>{setTabIndex(0)}}><TabTitle on={tabIndex == 0}>ALL</TabTitle></TabBox>
                <TabBox onClick={()=>{setTabIndex(1)}}><TabTitle on={tabIndex == 1}>Theme</TabTitle></TabBox>
            </TabListWrap>
            {/*<TabListWrap>
                get ReactNativeData:{standbydata.s3_url_list && standbydata.s3_url_list.join(",")}
                whatss:{standbydata.s3_clientsrc_test} / accessFromApp:{accessfromApp?"yes":"no"}
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
const NextBtn = styled.img`
    width: calc(100vw*(10/428));
    cursor: pointer;
`
const TabListWrap = styled.div`
    display: flex; white-space:normal;
    align-items: center; word-break:break-all;
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