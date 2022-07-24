//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import SaveBg from "../../img/img/save_img.jpg"
import IconBack from "../../img/icon/icon_arrow_back.svg"
import IconPlay from "../../img/icon/icon_play_btn.svg"
import BtnBg from "../../img/img/btn_bg.jpg"

//common공통관련
import * as s3_related_url from '../common/s3_related_url';

//server
import serverController2 from '../../server/serverController2';
import serverController from '../../server/serverController';

export default function SaveVideo({setLodingModal,standbydata}) {
    const history = useHistory();
    const [standbydataState,setstandbydataState] = useState({});

  
    console.log('saveVideo페이지도달:',standbydata,global.cv);

    const [videosrc,setvideosrc] = useState("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/08jfVAlPl56rUHOFz5Tfvideos_withTransition.mp4");

    if(!standbydata ){
        standbydata={}
        standbydata['nextdatas']={};
        standbydata['nextdatas']['video_result_final']="https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/08jfVAlPl56rUHOFz5Tfvideos_withTransition.mp4";
    
    }
 
    const saveClick = async () =>{
        //setLodingModal(true)
        // return history.push(`/share`);

        /*console.log('===>비디오 처리저장 버튼 클릭!================>>처리시작 처리 api호출');
        let remote_url_list=standbydataState.remote_url_list;
        //let take_video_process_info=standbydataState.take_video_process_info;//여러개인경우 그 편집내역이 넘어올것이고, 한 원테이크였다면 넘어오지않음.
        let music = standbydataState.music;
        let musictransitiontype = standbydataState.musictransitiontype;

        let remote_url_lists=[];
        for(let j=0; j<remote_url_list.length; j++){
            remote_url_lists.push(remote_url_list[j]);
        }
        
        let formdata=new FormData();
        formdata.append('edittake_videolist',remote_url_lists.join(','));
        //formdata.append('take_video_process_info',JSON.stringify(take_video_process_info));
        formdata.append('music',music);
        formdata.append('select_overlay',1);
        formdata.append('select_filter','canny');
        formdata.append('transition_type',musictransitiontype);

        //let res=await serverController2.connectFetchController('transition_and_effect_process','POST',formdata); 초기 느린버전(비효율적버전으로 추정)
        let res=await serverController.connectFetchController('media/videomake','POST',formdata); //속도 업그레이드(ffmpeg트랜지션으로 처리) 로직과정자체를 좀더 효율화 가장basic한 기반으로 향후 쓰일예정.   
        //let res=await serverController2.connectFetchController('uploadlist_transitionAdapt','POST',formdata);
        //let res= await serverController.connectFetchController('media/videomake','POST',formdata);
        //let res= await serverController.connectFetchController("media/videomake",'POST',formdata);
        if(res){
            console.log('처리결과 ::(ress):',res);

            setLodingModal(false);

            history.push({
                pathname: "/share",
                state : {'video_result':res.video_result, 'video_result_final':res.video_result_final}
            });
        }*/
        //setLodingModal(false);

        /*history.push({
            pathname: "/share",
            state : {'video_result_final':standbydataState['video_result_final']}
        });*/

        //rn을 통해 페이지는 그대로 이동시키면서, 병렬적으로 nodejs에 직접 해당 영상에대한 처리를한다.
        /*let formdata=new FormData();
        // formdata.append('user_id',userData.user_id ? userData.user_id : 30);
        formdata.append('music',standbydata['nextdatas']['music']);
        formdata.append('target_url',standbydata['nextdatas']['video_result_final']);
        formdata.append('target_url2',standbydata['nextdatas']['video_result']);
        formdata.append('effect',JSON.stringify(standbydata['nextdatas']['effect']));

        let res= serverController2.connectFetchController('transition_and_effect_process_after','POST',formdata,function(res){
            if(res){
                console.log('====>>처리결과::',res);
                alert('==>>save페이지 병렬적 처리결과:'+res);
            }
        });*/

        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"Rn_nextMove", nextParam: standbydata}));
        }
    }
        
    useEffect(()=>{
        console.log('standbydataStatess:',standbydataState);
        //alert(standbydataState)
    },[standbydataState])
 
    return (
        <Container>
            <CameraWrap>
                {/*<BackBtn src={IconBack} alt="뒤로가기" onClick={backClick}/>*/}
                <Title>Save video</Title>
            </CameraWrap>
            <EditVideoWrap>
                <EditVideo src={standbydata&&standbydata['nextdatas']['video_result_final']}controls></EditVideo>
            </EditVideoWrap>
            <RightNowBtnWrap onClick={saveClick}>
                <RightNowBtn >Create video</RightNowBtn>
            </RightNowBtnWrap>
            
            {/*<EffectMatterial>
                <CanvasInput00></CanvasInput00>
                <OUTPUTVIDEO1 src={''}></OUTPUTVIDEO1>
                <TRANSITIONEFFECTAREA id='transitioneffect_canvasarea'>
                </TRANSITIONEFFECTAREA>
                <OverlayFilterEffectwritecanvas id='canvasinput_effect1'></OverlayFilterEffectwritecanvas>
                <BETWEENTRANSITION_STARTENDAREA id='video_between_transition_startendArea'>
                </BETWEENTRANSITION_STARTENDAREA>
                <TAKEVIDEO_imgpartTotal id='take_video_imgpart_total'></TAKEVIDEO_imgpartTotal>
                <RANDOMOVERLAY_serveframesArea id='random_overlay_serveframesArea'></RANDOMOVERLAY_serveframesArea>
            </EffectMatterial>*/}
        </Container>
    );
}


const Container = styled.div`
    width: 100%; min-height: 100vh;
    overflow: hidden; height:auto;
    background: #F4F4FC;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`

const CameraWrap = styled.div`
    position: fixed; top: 0; left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: calc(100vw*(12/428)) calc(100vw*(20/428));
`
const BackBtn = styled.img`
    position: relative;
    width: calc(100vw*(30/428));
    padding: calc(100vw*(10/428));
    cursor: pointer;
    z-index: 100;
`
const Title = styled.p`
    position: absolute; left: 0;
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    text-align: center;
    color: #281755;
    width: 100%;
    text-transform: uppercase;
`
const EditVideoWrap = styled.div`
    position: relative;
    width: 96%; position:relative;display:flex;flex-flow:row wrap;justify-content:center;
    height: calc(96vw*(16/9));
    border-radius: calc(100vw*(12/428));
    margin: calc(100vw*(68/428)) auto calc(100vw*(28/428));
`
const EditVideo = styled.video`
    width: 100%; height: 100%;  border-radius: calc(100vw*(12/428));

`
const PlayBtn = styled.img`
    position: absolute; top: 50%; left: 50%;
    width: calc(100vw*(52/428));
    transform: translate(-50%, -50%);
    cursor: pointer;
`
const RightNowBtnWrap = styled.div`
    position: relative;
    width: calc(100vw*(338/428));
    padding: calc(100vw*(5/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #E2E2EB;
    border-radius: calc(100vw*(15/428));
    margin: 0 auto;
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(15/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.2);}
`
const RightNowBtn = styled.p`
    width: 100%;
    font-size: calc(100vw*(22/428));
    text-align: center;
    font-weight: bold;
    color: #fff;
    padding: calc(100vw*(18/428)) 0;
    border-radius: calc(100vw*(15/428));
    text-transform: uppercase;
    background: url(${BtnBg}) no-repeat center/cover;
`
const CanvasOutput=styled.canvas`
    width: 100%; height: calc(100vw*(16/9));
    margin: calc(100vw*(68/428)) auto calc(100vw*(28/428));
    border-radius: calc(100vw*(12/428));
`