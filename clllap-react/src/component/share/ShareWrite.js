//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import SaveBg from "../../img/img/save_img.jpg"
import IconPlay from "../../img/icon/icon_play_btn.svg"
import IconBack from "../../img/icon/icon_arrow_back.svg"
import IconWrite from "../../img/icon/icon_share_write.svg"
import IconArrow from "../../img/icon/icon_arrow_next.svg"

//component
import DefaultModal from "../modal/DefaultModal"

import {
    FacebookShareButton,
    FacebookIcon,
    //FacebookMessengerShareButton,
    //FacebookMessengerIcon,
    TwitterShareButton,
    TwitterIcon,
    //InstapaperShareButton,
    //InstapaperIcon

} from 'react-share';

export default function ShareWrite({video_result_final}) {

    console.log('==>>shareWrite페이지도달::]]]]::',video_result_final);

    const [modalOn, setModalOn] = useState(false)
    const history = useHistory();

    const backClick = () =>{
        //return history.goBack();
    }

    //server api에 작성>> 해당 remoteurl경로에 대해서 관련 링크 공유하는 기능구현
    const writeClick = () =>{

        //window.location.href="/";
        //return history.push(`/`);
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"RN_RootMove"}));
        }
    }

    const createKakaoButton=()=>{
        console.log("===>window.kakao??:",global.Kakao,window.Kakao);
        if(window.Kakao){
            const kakao=window.Kakao;

            try{
                if(!kakao.isInitialized()){
                    kakao.init("a59358359f5f2cd54dff11958fcd730b");
                }
                kakao.Link.createDefaultButton({
                    container:"#kakaobtn",
                    objectType:"feed",
                    content:{
                        title:"클랩 테스트",
                        description:"#클랩 동영상 공유",
                        imageUrl:'http://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg',
                        link:{
                            mobileWebUrl:"https://tree9odic.tistory.com/59",
                            webUrl:"https://tree9odic.tistory.com/59"
                        }
                    },
                    social:{
                        likeCount:0,
                        commentCount:0,
                        sharedCount:0
                    },
                    buttons:[
                        {
                            title:'보러가기',
                            link:{
                                mobileWebUrl:"https://tree9odic.tistory.com/59",
                                webUrl:"https://tree9odic.tistory.com/59" 
                            }
                        },
                        /*{
                            title:"앱으로보기",
                            link:{
                                mobileWebUrl:"https://tree9odic.tistory.com/59",
                                webUrl:"https://tree9odic.tistory.com/59"
                            }
                        }*/
                    ]
                });
                
            }catch(error){
                alert("errors:"+JSON.stringify(error));
            }
            
           //alert('====>kakao.link CreateBUttonLInkss:');
        }
    }
    const initKakao = () => {
        console.log("initKkaaaoss:",window.Kakao);
        if (window.Kakao) {
          const kakao = window.Kakao;
          if (!kakao.isInitialized()) {
            kakao.init("a59358359f5f2cd54dff11958fcd730b");
            console.log("=>>돼었는가??");
          }
        }
    };
        
    useEffect(()=>{
        initKakao();
        createKakaoButton();
    },[])

    const shareKakao = () => {
       console.log('===카카오 쉐어요청 rn요청:');

        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"kakao_share"}));
        }

    };
    
        
    return (
        <>
            <Container>
                <WriteWrap>
                    <BackBtn src={""} alt="" onClick={backClick}/>
                    <WriteBtn src={IconWrite} alt="작성하기" onClick={()=>{setModalOn(true)}}/>
                    <Title>새 게시물</Title>
                </WriteWrap>
                <WriteContent>
                    <WriteTop>
                        <WriteImgWrap>
                            <WriteVideo src={video_result_final} alt="share video" controls/>
                            {/*<PlayBtn src={IconPlay} alt="play" />*/}
                        </WriteImgWrap>
                        <Textarea placeholder={"문구 입력..."}/>
                    </WriteTop>
                    {/*<WriteRow>
                        <Text>사람 태그하기</Text>
                        <Arrow src={IconArrow} alt="" />
                    </WriteRow>
                    <WriteRow>
                        <Text>위치 추가</Text>
                        <Arrow src={IconArrow} alt="" />
                        <LocationList>
                            <LocationText>서울특별시</LocationText>
                            <LocationText>서초구</LocationText>
                        </LocationList>
                    </WriteRow>*/}
                    <WriteRow>
                        {/*<Text>다른 채널 게시</Text>
                        <SnsList>
                            <SnsText>Facebook</SnsText>
                            <Switch>
                                <SwitchInput type="checkbox"/>
                                <SwitchSlider></SwitchSlider>
                            </Switch>
                        </SnsList>
                        <SnsList>
                            <SnsText>Instagram</SnsText>
                            <Switch>
                                <SwitchInput type="checkbox"/>
                                <SwitchSlider></SwitchSlider>
                            </Switch>
                        </SnsList>
                        <SnsList>
                            <SnsText>Kakaotalk</SnsText>
                            <Switch>
                                <SwitchInput type="checkbox"/>
                                <SwitchSlider></SwitchSlider>
                            </Switch>
                        </SnsList>
                        <SnsList>
                            <SnsText>Twitter</SnsText>
                            <Switch>
                                <SwitchInput type="checkbox"/>
                                <SwitchSlider></SwitchSlider>
                            </Switch>
                        </SnsList>*/}
                        <FacebookShareButton style={{marginRight:"20px"}} url={"https://teamspark.kr"}>
                            <FacebookIcon size={48} round={true} borderRadius={24}></FacebookIcon>    
                        </FacebookShareButton>
                        <TwitterShareButton style={{marginRight:"20px"}} url={"https://teamspark.kr"}>
                            <TwitterIcon size={48} round={true} borderRadius={24}></TwitterIcon>    
                        </TwitterShareButton>
                        <div id='kakaobtn'>카카오공유</div>
                        
                    </WriteRow>
                </WriteContent>
            </Container>
            {
                modalOn &&
                <DefaultModal title={"게시글이 공유되었습니다."} nextClick={writeClick}/>
            }
        </>
    );
}


const Container = styled.div`
    width: 100%; height: auto; min-height:100vh;
    overflow: hidden;
    background: #F4F4FC;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`
const WriteWrap = styled.div`
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
const WriteBtn = styled(BackBtn)`
    width: calc(100vw*(38/428));
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
const WriteContent = styled.div`
    width: 100%;
    margin-top: calc(100vw*(70/428));
    padding: 0 calc(100vw*(28/428));
`
const WriteTop = styled.div`
    display: flex; position:relative; z-index:10;
    align-items: center;
    width: 100%;
    margin-bottom: calc(100vw*(18/428));
`
const WriteImgWrap = styled.div`
    position: relative;
    width: calc(100vw*(200/428)); height: calc(100vw*(280/428));
    border-radius: calc(100vw*(11/428));
    overflow: hidden;
    /*&::after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
    background: rgba(1,1,1,0.4);}*/
`
const Textarea = styled.textarea`
    width: calc(100% - calc(100vw*(100/428))); height: calc(100vw*(100/428));
    padding-left: calc(100vw*(18/428));
`
const WriteImg = styled.img`
    width: 100%; height: 100%;
    object-fit: cover;
`
const WriteVideo = styled.video`
    width:100%; height:100%;
`
const PlayBtn = styled.img`
    position: absolute; top: 50%; left: 50%;
    width: calc(100vw*(20/428));
    transform: translate(-50%, -50%);
    cursor: pointer;
    z-index: 10;
`
const WriteRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: calc(100vw*(16/428)) calc(100vw*(8/428));
    border-top: 1px solid #CFC8E3;
    cursor: pointer;
    &:last-child {border-bottom: 1px solid #CFC8E3;}
`
const Text = styled.p`
    font-size: calc(100vw*(16/428));
`
const Arrow = styled.img`
    width: calc(100vw*(8/428));
`
const LocationList = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: calc(100vw*(18/428));
`
const LocationText = styled.p`
    position: relative;
    width: auto;
    font-size: calc(100vw*(15/428));
    text-align: center;
    margin: 0 calc(100vw*(10/428));
    padding: calc(100vw*(5/428)) calc(100vw*(12/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    border-radius: calc(100vw*(25/428));
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(25/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const SnsList = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: calc(100vw*(18/428));
`
const SnsText = styled.p`
    font-size: calc(100vw*(15/428));
    font-weight: bold;
    color: #281755;
`

// checkbox
const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: calc(100vw*(52/428)); height: calc(100vw*(30/428));
    padding: calc(100vw*(4/428)) calc(100vw*(5/428));
    border-radius: calc(100vw*(34/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    background: #F7F7FF;
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(25/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.1);}
`
const SwitchInput = styled.input`
    opacity: 0;
    width: 0; height: 0;
    &:checked + span {
        background-color: #F7F7FF;
        border: 1px solid #9F8EC8;
    }
    &:checked + span::before {
        content: "";
        color: #ed2939;
        background-color: #A38DCC;
        text-indent: calc(100vw*(-25/428));
        transform: translateX(calc(100vw*(18/428)));
    }
`
const SwitchSlider = styled.span`
    position: absolute; top: calc(100vw*(4/428)); left: calc(100vw*(5/428)); right: 0; bottom: 0;
    width: calc(100vw*(42/428)); height: calc(100vw*(22/428));
    border: 1px solid #9F8EC8;
    border-radius: calc(100vw*(34/428));
    transition: .4s;
    &::before {
        content: "";
        color: #000;
        font-size: calc(100vw*(15/428)); font-weight: bold;
        text-indent: calc(100vw*(24/428));
        position: absolute; left: calc(100vw*(3/428)); bottom: calc(100vw*(2/428));
        width: calc(100vw*(16/428)); height: calc(100vw*(16/428));
        background-color: #D6CDD9; 
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
        box-sizing: border-box;
        box-shadow: inset 0 0 calc(100vw*(3/428)) 0 rgba(87, 62, 62, 0.2);
    }
`