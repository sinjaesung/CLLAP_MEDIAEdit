//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//component
import AllMusicList from "./AllMusicList"
import ThemeList from "./ThemeList"


export default function MusicList({tabIndex,allList,themeList,setmusic,music,setmusictransitiontype,setlastselect,lastselect,effect,seteffect}) {

    return (
        <Container>
            {
                tabIndex == 0 ?
                allList.map((value,index)=>{
                    return (
                        <AllMusicList key={index + 'allList'} lastselect={lastselect} setlastselect={setlastselect}value={value}index={index} setmusic={setmusic} music={music} effect={effect}seteffect={seteffect}setmusictransitiontype={setmusictransitiontype}/>
                    )
                })
                :
                themeList.map((value,index)=>{
                    return (
                        <ThemeList key={index + 'themeList'} lastselect={lastselect} setlastselect={setlastselect}value={value}index={index}setmusic={setmusic} music={music} effect={effect}seteffect={seteffect}setmusictransitiontype={setmusictransitiontype}/>
                    )
                })
            }
        </Container>
    );
}


const Container = styled.div`
    width: 100%;
    padding: calc(100vw*(20/428)) calc(100vw*(22/428)) calc(100vw*(60/428));
`