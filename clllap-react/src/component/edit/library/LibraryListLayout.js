//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconCheck from "../../../img/icon/icon_check.svg"

import getBlobDuration from 'get-blob-duration';

//common util use
import { CommonUtil } from "../../common/commonutil";

export default function LibraryListLayout({value,check,chklist,setchklist,setVideoModalState}) {
    //const videoElement=useRef(0);
    //const [chkOn, setChkOn] = useState(false);
    
    const history=useHistory();
    let commonUtil_use=CommonUtil()();
    let second_to_timeformat=commonUtil_use['second_to_timeformat'];

    /*let chkid_array=[];
    for(let j=0; j<chklist.length; j++){
        chkid_array.push(chklist[j].id);
    }
    
    const libraryClick = async (event) => {
        if(check){
            setChkOn(!chkOn);
        }else{
            setVideoModalState(true);
        }

        if(! chkid_array.includes(value.media_id)){
            videoElement.current.play();

            console.log('타깃 체크 활성화>>>');
            console.log('기존 체크리스트:',chklist,event.target,value.media_id,value);

            let target=event.target;
            let src=target.src;
            //let duration=target.duration;
            let blobss=await fetch(src).then(response=>response.blob());
            let duration=await getBlobDuration(blobss);
            console.log('src,duration:',src,parseInt(duration));
            console.log('blossbsss:',blobss);

            let original_list=[...chklist];
            original_list.push({
                src : src, time:duration , id : value.media_id, remote_src: value.media_source_path, media_source_path:value.media_source_path, clientsrc: URL.createObjectURL(blobss)
            });
            console.log('적용 리스트 기존리스트:',original_list,typeof original_list);
            setchklist(original_list);
        }else{
            videoElement.current.pause();

            console.log('타깃 체크 해제>>>');
            let id=value.media_id;
            console.log('===<>타깃요소:',id);
            setchklist(chklist.filter(item=> item.id != id));
        }
    }*/
    


    return (
        <LibraryListBox>
            <LibraryVideo src={value.media_source_path} alt="" playsInline controls/>
            <LibraryTimeWrap>
                <LibraryTime></LibraryTime>
            </LibraryTimeWrap>
            {
                //chkid_array.includes(value.media_id) &&
                //<ChkImg src={IconCheck} alt="checked" />
            }
            
        </LibraryListBox>
      
    );
}

const FloatElementclick = styled.div`
    /*position:absolute;width:100%;height:100%;background-color:rgba(0,0,0,0.8);z-index:9;left:0;top:0;*/
`
const LibraryListBox = styled.div`
    position: relative;
    width: 93%; height:calc(90vw * (20/16));
    margin-right: calc(100vw*(6/428));
    margin-bottom: calc(100vw*(10/428));
    border-radius: calc(100vw*(10/428));
    overflow: hidden;
    cursor: pointer;
    &:nth-child(3n) {margin-right: 0;}
`
const LibraryImg = styled.img`
    width: 100%;
`
const LibraryVideo = styled.video`
    width:100%;height:100%;background-color:rgba(0,0,0,0.9)
`
const LibraryTimeWrap = styled.div`
    position:absolute;bottom:20%;left:50%;transform:translateX(-50%);
    display: flex;z-index:5;
    align-items: center;
    justify-content: flex-end;
    padding: calc(100vw*(6/428)) calc(100vw*(10/428));
`
const LibraryTime = styled.p`
    font-size: calc(100vw*(20/428));font-weight:bold;
    color: rgba(220,200,255,1)
`
const ChkImg = styled.img`
    position: absolute; top: calc(100vw*(10/428)); right: calc(100vw*(10/428));
    width: calc(100vw*(26/428));
`

