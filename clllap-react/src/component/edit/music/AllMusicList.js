//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconPlay from "../../../img/icon/icon_play.svg"
import IconStop from "../../../img/icon/icon_stop.svg"


export default function AllMusicList({value,setmusic,music,setmusictransitiontype,effect,seteffect}) {
    const [chkOn, setChkOn] = useState(false)
    
    //const audio_element=useRef();
    console.log('AllmusicListss:',value);
    const music_play = ()=>{
        console.log('musicplayss!:',music_play)
        value['player'].current.play();
    }
    const music_stop = ()=>{
        console.log('musicstops!:',music_stop)
        value['player'].current.pause();
    }
    return (
        <Container on={music==value.id} onClick={()=>{setChkOn(!chkOn); setmusic(value.id);seteffect(value.effect);setmusictransitiontype(value.transition_type)}}>
            <AllTitleWrap>
                <AllImg src={value.src} alt="" />
                <AllTitleBox>
                    <Type>{value.type}</Type>
                    <Title>{value.title}</Title>
                    <Text>{value.text}</Text>
                </AllTitleBox>
            </AllTitleWrap>
            <Audio ref={value && value['player']} src={value.src_source}></Audio>
            {
                !chkOn ?
                <PlayBtn src={IconPlay} alt="play" onClick={()=>{music_play();}}/>
                :
                <StopBtn src={IconStop} alt="stop"onClick={()=>{music_stop();}}/>
            }
        </Container>
    );
}


const Container = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(100vw*(5/428)) calc(100vw*(30/428)) calc(100vw*(5/428)) calc(100vw*(5/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(8/428)) 0 #fff;
    background-color: #F7F7FF;
    border-radius: calc(100vw*(15/428));
    margin-bottom: calc(100vw*(12/428));
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(15/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
    ${({on})=>{
        return on ?
        `box-shadow: inset 0 calc(100vw*(3/428)) calc(100vw*(6/428)) 0 rgba(1,1,1,0.1); background: #EAEAF8;`
        :
        ``
    }}
`
const AllTitleWrap = styled.div`
    display: flex;
    align-items: center;
`
const Audio = styled.audio`
    display:none;
`
const AllTitleBox = styled.div`
    padding-left: calc(100vw*(15/428));
`
const Type = styled.span`
    display: block;
    font-size: calc(100vw*(10/428));
    font-weight: bold;
    color: #A38DCC;
    margin-bottom: calc(100vw*(3/428));
`
const Title = styled.p`
    font-size: calc(100vw*(16/428));
    font-weight: bold;
    color: #281755;
`
const Text = styled.p`
    font-size: calc(100vw*(13/428));
    color: #A2A2A2;
    margin-top: calc(100vw*(6/428));
`
const AllImg = styled.img`
    width: calc(100vw*(76/428));
    border-radius: calc(100vw*(11/428));
`
const PlayBtn = styled.img`
    width: calc(100vw*(20/428));
    cursor: pointer;position:relative;z-index:9
`
const StopBtn = styled(PlayBtn)`
    width: calc(100vw*(15/428));position:relative;z-index:9
`