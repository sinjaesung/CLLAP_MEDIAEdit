//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import CameraBg from "../../img/img/camera_bg.jpg"
import IconBack from "../../img/icon/icon_arrow_back_wh.svg"
import IconNext from "../../img/icon/icon_arrow_next_wh.svg"
import IconCamera from "../../img/icon/icon_camera_wh.svg"


export default function CameraDefault(props) {
    console.log('===>CamerDefault재랜더링??:',props);
    const history = useHistory();

    const [ischild,setischild] = useState(false);
    const backClick = () =>{
        /*if(props.camerapage_streamRemove){
            props.camerapage_streamRemove();//카메라페이지에 있는 관련 함수 실행하게됩니다.
        }*/
        //return history.goBack();
        //let prevClear=props.prevClear;

        //prevClear();
        //return history.goBack();
    }

    /*const nextClick = async () =>{     
        return history.push(`${props.next}`);          
    }*/

    const nextClick_RN = async ()=>{
        let nextParam=props.nextParameter;
        let nextParam_addon=props.nextParameter_addon;//never used
        //alert(JSON.stringify(nextParam_addon));
        //let nextClear=props.nextClear;//비디오자원자체를 멈추는것은 아니나  실행src들matsource제거/clearTimeout등처리,streaming=false로 더이상 관련 프로세싱처리실행부 멈추게한다.뒤로가기 연산시엔 다음연산보다 뭔가 확실히 리액트페이지자체의 일종 떠나는 연산을 진행하게된다.

        //nextClear();//관련 비디오재생 관련opencv메모리 실행내역 해제.
        if(window.ReactNativeWebView){
            if(nextParam_addon){
                window.ReactNativeWebView.postMessage(JSON.stringify({type:"Rn_nextMove", nextParam: nextParam, nextParam_addon:nextParam_addon}));
            }else{
                window.ReactNativeWebView.postMessage(JSON.stringify({type:"Rn_nextMove", nextParam: nextParam}));
            }
        }
    }

    return (
        <Container>
        {
        !props.ishide &&
            <CameraWrap>
                {
                    props.prev && 
                    <BackBtn src="" alt="" onClick={backClick}/>
                }
                {
                    props.next && !props.nextParameter && 
                    <BackBtn src={IconNext} alt="다음페이지" />
                }
                {
                    props.next && props.nextParameter && props.nextPossible && 
                    <BackBtn src={IconNext} onClick={nextClick_RN} alt="다음페이지"/>
                }
                {
                    props.title &&
                    <Title>{props.title}</Title>
                }
                {
                    props.camera &&
                    <CameraBtn src={IconCamera} alt="카메라" onClick={()=>{props.onmodeChange()}}/>
                }
            
            </CameraWrap>
        }
            <CameraBottom>
                {props.children}
            </CameraBottom>
        </Container>
    );
}


const Container = styled.div`
    width: 100%; height: auto; position:relative;z-index:9;
    overflow: hidden;
    background: url(${CameraBg}) no-repeat center/cover;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`

const CameraWrap = styled.div`
    position: fixed; top: 0; left: 0; z-index:50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: calc(100vw*(12/428)) calc(100vw*(20/428));
`
const BackBtn = styled.img`
    position: relative;
    width: calc(100vw*(35/428));
    padding: 0 calc(100vw*(5/428));
    cursor: pointer;
    z-index: 100;
`
const CameraBtn = styled.img`
    width: calc(100vw*(48/428));
    padding: 0 calc(100vw*(5/428));
    cursor: pointer;
`
const SelectCamera=styled.select`
width: calc(100vw*(48/428));
`
const Title = styled.p`
    position: absolute; left: 0;
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    text-align: center;
    color: #fff;
    width: 100%;
    text-transform: uppercase;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
`
const SaveBtn = styled(Link)`
    font-size: calc(100vw*(15/428));
    font-weight: bold;
    color: #fff;
    background: rgba(255,255,255,0.4);
    border-radius: calc(100vw*(26/428));
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
    padding: calc(100vw*(7/428)) calc(100vw*(22/428));
    cursor: pointer;
`
const CameraBottom = styled.div`
    position: fixed; bottom: 0; left: 0;
    width: 100%; height:100%;
`