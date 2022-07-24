//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//component
import LibraryListLayout from "./LibraryListLayout"

//img
import IconDelete from "../../../img/icon/icon_delete.svg"
import IconNext from "../../../img/icon/icon_next.svg"


export default function LibraryList({srcload,check,librarylist,chklist,setchklist,setVideoModalState}) {

    console.log('libraraytlists:',librarylist);

    /*const chklist_update=function(e){
        console.log('대상 클릭요소:',e.target.parentElement);
        let target_mother=e.target.parentElement;

        let id=target_mother.getAttribute('id');
        console.log('===<>타깃요소:',id,chklist);

        setchklist(chklist.filter(item=> item.id != id));//libaraylist는 update_object로 임의memid유저의 관련 원본 업로드 비디오들이 떠야한다. 원본 비디오리스트들이며 그들 가각의 관련된 메타정보이다. remote_src,src,object,time,id 이들중에서 체크한 리스트들만 다음페이지로 보낸다.그게 곧 선택(업로드)테이크들이다.
    }*/

 
    return (
        <Container blank={check}>
            <LibraryListWrap>
                {
                    librarylist.map((value,index)=>{
                        return (
                            <LibraryListLayout key={index + 'libraryList'} chklist={chklist}setchklist={setchklist} value={value}  check={check}/>
                        )
                    })                   
                }
            </LibraryListWrap>
           
            {
            /*
                check && (chklist.length>=1 && chklist.length<=5) ?
                <FixedWrap>
                    <NextBtn to={{pathname:`/edit/music`,
                    state:{
                        nextParameter : chklist
                    }
                }}>
                        <NextBtnImg src={IconNext} alt="다음단계로 이동" />
                    </NextBtn>
                    <ChkWrap>
                        <ChkText onClick={srcload}>영상을 길게눌러 재생해 보실 수 있습니다.</ChkText>
                        <ChkListWrap>
                            {
                                chklist.map((value,index)=>{
                                    return (
                                        <ChkListBox key={index + 'chkList'} id={value.id}>
                                            <ChkListvideo src={value.src} alt="" />
                                        </ChkListBox>
                                    )
                                })
                            }
                        </ChkListWrap>
                    </ChkWrap>
                </FixedWrap>
                :
                null
            */
            }
        </Container>
        
    );
}


const Container = styled.div`
    width: 100%; height:100%;overflow-y:auto;
    ${({blank})=>{
        return blank ?
        `padding-bottom: calc(100vw*(170/428));`
        :
        `padding-bottom: calc(100vw*(30/428));`
    }}
    
`
const LibraryListWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;position:relative;z-index:8;
    padding: calc(100vw*(20/428)) calc(100vw*(16/428));
`
const FixedWrap = styled.div`
    position: fixed; bottom: 0; left: 0;
    width: 100%;
`
const NextBtn = styled(Link)`
    width: calc(100vw*(67/428));
    padding: 0 ;
    margin-left: auto;
    margin-right: calc(100vw*(16/428));
`
const NextBtnImg = styled.img`
    width: calc(100vw*(67/428));
    margin-bottom: calc(100vw*(14/428));
`
const ChkWrap = styled.div`
    width: 100%;
    background: #F4F4FC;
    padding-top: calc(100vw*(15/428));
    padding-bottom: calc(100vw*(15/428));
    border-radius: calc(100vw*(25/428)) calc(100vw*(25/428)) 0 0;
    box-shadow: 0 0 calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.16);
`
const ChkText = styled.div`
    font-size: calc(100vw*(14/428));
    text-align: center;
    color: #281755;
    margin-bottom: calc(100vw*(14/428));
`
const ChkListWrap = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: calc(100vw*(10/428)) calc(100vw*(16/428)) calc(100vw*(26/428));
    white-space: nowrap;
    overflow-y: visible;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
        display:none;
    }
`
const ChkListBox = styled.div`
    position: relative;
    width: calc(100vw*(70/428));
    margin-right: calc(100vw*(10/428));
    &:last-child {margin-right: 0;}
`
const ChkListImg = styled.img`
    width: calc(100vw*(70/428));
    border-radius: calc(100vw*(7/428));
`
const ChkListvideo = styled.video`
    width: calc(100vw*(70/428));
`
const DeleteImg = styled.img`
    position: absolute; bottom: calc(100vw*(-4/428)); right: calc(100vw*(-4/428));
    width: calc(100vw*(26/428));
    cursor: pointer;
`