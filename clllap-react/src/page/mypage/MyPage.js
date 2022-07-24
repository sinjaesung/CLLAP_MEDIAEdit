//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

import IconArrow from "../../img/icon/icon_arrow_back.svg"
import IconLogo from "../../img/icon/icon_main_logo.svg"

import icon_share_facebook from "../../img/icon/icon_share_facebook.png"
import icon_share_Instagram from "../../img/icon/icon_share_Instagram.png"
import icon_share_kakao from "../../img/icon/icon_share_kakao.png"
import icon_share_twitter from "../../img/icon/icon_share_twitter.png"

import { useSelector } from 'react-redux';
import { UserDataAction } from "../../store/actionCreators";

import serverController from '../../server/serverController';

export default function MyPage() {
    const history = useHistory();
    //const userData = useSelector(store => store.userData.userData);
    const [userData,setUserData]= useState({});
    const [userdatas,setuserdatas]=useState({});
    
    const socialData = [
        {title:"facebook", img:icon_share_facebook},
        {title:"Instagram", img:icon_share_Instagram},
        {title:"kakao", img:icon_share_kakao},
        {title:"twitter", img:icon_share_twitter},
    ]

    const tabData = [
        {title:"MY INFO", link:"myInfo"},
        {title:"LINK INFO", link:"linkInfo"},
        {title:"SETTING", link:"/setting"},
        //{title:"CAMERA", link:"/camera"},
        {title:"MY VIDEO", link:"/myLibrary"},
    ]

    const initial_info =()=>{
        serverController.connectFetchController(`user/info`, 'GET', null, function(res) {
            if(res.result == 1){
                //유저 정보얻기(로그인여부로 판단)성공
                let user=res.user;
                //alert("유저정보 조회성공 mypage페이지");
                //alert(JSON.stringify(user));
                
                const userData = {
                    user_age: user.user_age,
                    user_country: user.user_country,
                    user_email: user.user_email,
                    user_gender: user.user_gender,
                    user_id: user.user_id,
                    user_join_check: user.user_join_check,
                    user_name: user.user_name,
                    user_nickname: user.user_nickname,
                    user_phone: user.user_phone,
                    user_profile: user.user_profile,
                    user_region: user.user_region,
                    username: user.username,
                }
                UserDataAction.updateUserData({userData});
                setuserdatas(userData);
                /*if(window.ReactNativeWebView){
                    window.ReactNativeWebView.postMessage(JSON.stringify({type:"loginComplete",target:"WebviewScreen",userdata:userData}));
                }*/
            }else{
                alert("로그인정보가 없습니다!!");
            }
        }, function(err) {
            alert("what errorss:"+err);
            console.log(err);
        })
    }
    const onClickLogout = () => {
        UserDataAction.updateLogout();
       // history.push("/")
       /*if(window.ReactNativeWebView){
           window.ReactNativeWebView.postMessage(JSON.stringify({type:"pageMove",target:'WebviewScreen'}))
       }*/
        let res=serverController.connectFetchController("/user-logout","GET",null,function(res) {
            if(window.ReactNativeWebView){
                window.ReactNativeWebView.postMessage(JSON.stringify({type:'logout',target:'WebviewScreen'}));//메인페이지 재귀 요청
            }
        });
    }
    useEffect(()=>{
        initial_info();

        document.addEventListener("message",async (event) =>{
            let test_data=JSON.parse(event.data);
            //alert(event.data);
            
            let type=test_data['type'];
            
            if(type=='logout'){
                alert("로그아웃 요청이 있던경우 rn으로부터의메시지");
                window.location.href="https://teamspark.kr/";
            }
           
            /*setStandbydata({
                music: ,
                musictransitiontype: "opencv"
            })*/
        });
    },[])

    return (
        <Container>
            <TitleWrap>
                <BackBtn src={""} alt="" /*onClick={() => history.push("/")}*/ />
                <Title>마이페이지</Title>
                <div></div>
            </TitleWrap>

            <ContentGrid>

                <MainLogoWrap>
                    <MainLogoBox>
                        <MainLogo src={IconLogo} alt="CLLLAP"/>
                    </MainLogoBox>
                </MainLogoWrap>

                <Name>{userdatas.user_nickname}</Name>
                <Line></Line>

                <SocialBtnWrap>
                    {
                        socialData.map((item, index) => {
                            return(
                                <SocialLogin src={item.img} key={index}/>
                                )
                            })
                    }
                </SocialBtnWrap>
                
                {
                    tabData.map((item, index) => {
                        return(
                            <BtnWrap to={item.link} key={index}>
                                <BtnText>{item.title}</BtnText>
                            </BtnWrap>
                        )                    
                    })
                }
                
                    {/*<BtnWrap key={'myvideo'} onClick={()=>{
                        if(window.ReactNativeWebView){
                            window.ReactNativeWebView.postMessage(JSON.stringify({type:'pageMove',target:'myvideoScreen'}));
                        }
                    }}>
                        <BtnText>{"MY VIDEO"}</BtnText>
                </BtnWrap>*/}
                    
                

                <Logout onClick={onClickLogout}>로그아웃</Logout>
            </ContentGrid>
            {/* <InputWrap>
                <EmailLoginInput />
            </InputWrap> */}
        </Container>
    );
}

const Container = styled.div`
    width: 100%; min-height: 100vh;
    background: #F4F4FC;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`
const TitleWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: calc(100vw*(22/428)) calc(100vw*(28/428));
`
const BackBtn = styled.img`
width: calc(100vw*(10/428));
cursor: pointer;
`
const Title = styled.h3`
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    color: #281755;
    text-transform: uppercase;
`
const MainLogoWrap = styled.div`
    position: relative;
    width: calc(100vw*(136/428)); height: calc(100vw*(136/428));
    padding: calc(100vw*(8/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    border-radius: 50%;
    margin: calc(100vw*(20/428)) auto 0 ;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: 50%; box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const MainLogoBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; height: 100%;
    box-shadow: inset calc(100vw*(6/428)) calc(100vw*(6/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);
    background-color: #DBD0E5;
    border-radius: 50%;
`
const MainLogo = styled.img`
    width: 100%;
`
const Name = styled.div`
    font-weight: 700;
    font-size: calc(100vw*(17/428));
    margin: calc(100vw*(18/428)) 0 calc(100vw*(10/428));
`
const Line = styled.div`
    width: calc(100vw*(70/428));
    height: 1px;
    border-top: 1px solid #000;
`
const ContentGrid = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-bottom: calc(100vw*(30/428));
`
const SocialBtnWrap = styled.div`
    display: flex;
    margin: calc(100vw*(22/428)) 0 calc(100vw*(43/428));
`
const SocialLogin = styled.img`
    width: calc(100vw*(39/428));
    margin: 0 calc(100vw*(11/428));
`
const Logout = styled.div`
    color:#AAA;
    font-weight: 700;
    font-size: calc(100vw*(15/428));
`


// 보더 없는거
const BtnWrap = styled(Link)`
    position: relative;
    width: calc(100vw*(378/428));
    border-radius: calc(100vw*(48/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    padding: calc(100vw*(4/428));
    margin: 0 auto  calc(100vw*(31/428));
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(27/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const BtnText = styled.p`
    width: 100%; height: calc(100vw*(46/428));
    font-size: calc(100vw*(20/428));
    line-height: calc(100vw*(44/428));
    font-weight: bold;
    text-align: center;
    color: #281755;
    border-radius: calc(100vw*(27/428));
    background-color: #f7f7ff;
    padding: 0 calc(100vw*(20/428));
    &::placeholder {color: #c0b9ce; font-size: calc(100vw*(15/428));}
`








// 보더 있는거
const InputWrap = styled.div`
    position: relative;
    width: 100%;
    border-radius: calc(100vw*(27/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    padding: calc(100vw*(4/428));
    margin-bottom: calc(100vw*(18/428));
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(27/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const EmailLoginInput = styled.input`
    width: 100%; height: calc(100vw*(46/428));
    font-size: calc(100vw*(16/428));
    text-align: center;
    color: #281755;
    border-radius: calc(100vw*(27/428));
    background-color: #f7f7ff;
    padding: 0 calc(100vw*(20/428));
    &::placeholder {color: #c0b9ce; font-size: calc(100vw*(15/428));}
    ${({errorOn})=>{
        return errorOn ?
        `border: 1px solid #E24747; color: #E22D2D;`
        :
        `border: 1px solid #9f8ec8;`
    }}
`