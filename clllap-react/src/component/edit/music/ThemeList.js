//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconPlay from "../../../img/icon/icon_play.svg"
import IconStop from "../../../img/icon/icon_stop.svg"


export default function ThemeList({value,music,setmusic,setmusictransitiontype,effect,seteffect}) {
    const [chkOn, setChkOn] = useState(false)

    console.log('==>ThemeListsss==>>>:',value);
    //const audio_element=useRef();
    
    const music_toggle = ()=>{
        if(!chkOn){
            value['player'].current.play();
        }else{
            value['player'].current.pause();
        }
    }
  

    return (
        <Container on={music==value.id} onClick={()=>{setChkOn(!chkOn);music_toggle();setmusic(value.id);seteffect(value.effect);setmusictransitiontype(value.transition_type)}}>
            <Title>{value.title}</Title>
            <AllImgWrap>
                <AllImg src={value.src} alt="" />
            </AllImgWrap>
            <Audio ref={value['player']} src={value.src_source}></Audio>
        </Container>
    );
}

const Audio = styled.audio`
    display:none;
`
const Container = styled.div`
    width: 100%;
    margin-bottom: calc(100vw*(26/428));
    cursor: pointer;
`
const Title = styled.p`
    position: relative;
    padding-left: calc(100vw*(5/428));
    font-size: calc(100vw*(16/428));
    font-weight: bold;
    color: #281755;
    z-index: 10;
`
const AllImgWrap = styled.div`
    width: 100%;
    position: relative;
    padding: calc(100vw*(5/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(8/428)) 0 #fff;
    background-color: #F7F7FF;
    border-radius: calc(100vw*(12/428));
    margin-bottom: calc(100vw*(12/428));
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(12/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const AllImg = styled.img`
    width: 100%;
    border-radius: calc(100vw*(12/428));
`