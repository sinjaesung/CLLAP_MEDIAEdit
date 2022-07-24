//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconLogo from "../../img/icon/icon_main_logo.svg"
import IconCamera from "../../img/icon/icon_camera.svg"
import IconVideo from "../../img/icon/icon_editing.svg"
import MainBg from "../../img/img/main_img.png"

//component
import MyModal from "../modal/MyModal";

import { useSelector } from 'react-redux';
import serverController from '../../server/serverController';
import { UserDataAction } from "../../store/actionCreators";

export default function MainInfo() {
    const userData = useSelector(store => store.userData.userData);
    
    const [userdata,setuserdata] = useState({});
    const [myModal, setMyModal] = useState(false);
    const history = useHistory();

    const cameraClick = () =>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"CAMERA", userId: userData.user_id }));
        }else{
            //alert("reactNativeWEbview가없는경우!!");
            //return history.push("/camera");
        }
    }

    const editClick = () =>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"GALLERY", userId: userData.user_id}));
        }else{
            //alert("reactNativeWEbview가없는경우!!");
           // return history.push("/edit/library");
        }
    }
   
    const moveClick=()=>{
        //history.push('/share/write');
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"ShareWrite"}));
        }
    }
    
    useEffect(async()=>{
        //alert("mainfinomain페이지 로드시점!!");
        console.log('===>페이지로드시점 관련실행:');
        
        serverController.connectFetchController(`user/info`, 'GET', null, function(res) {
            if(res.result == 1){
                //유저 정보얻기(로그인여부로 판단)성공
                let user=res.user;
               // alert("유저정보 조회성공mainInfo페이지");
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
                setuserdata(userData);
                /*if(window.ReactNativeWebView){
                    window.ReactNativeWebView.postMessage(JSON.stringify({type:"loginComplete",target:"WebviewScreen",userdata:userData}));
                }*/
            }else{
                //alert("로그인정보가 없습니다!!");
            }
        }, function(err) {
            alert("what errorss:"+err);
            console.log(err);
        })
        
    },[]);

    return (
        <>
            <Container>
                <MainInfoWrap>
                    <MainLogoWrap>
                        <MainLogoBox>
                            <MainLogo src={IconLogo} alt="CLLLAP"/>
                        </MainLogoBox>
                    </MainLogoWrap>
                    <MainTitleWrap>
                        <MainTitle>{userdata.user_id?userdata.user_nickname:userData.user_nickname}</MainTitle>
                        <MainText>{userdata.user_id?userdata.user_email:userData.user_email}</MainText>
                        <MainText onClick={moveClick}>테스트카톡공유</MainText>
                        <Line/>
                    </MainTitleWrap>
                </MainInfoWrap>
                <MainInfoListWrap>
                    <MainInfoList onClick={cameraClick}>
                        <CameraImg src={IconCamera} alt="Camera" />
                        <InfoListText>Camera</InfoListText>
                    </MainInfoList>
                    <MainInfoList onClick={editClick}>
                        <VideoImg src={IconVideo} alt="Video editing" />
                        <InfoListText>Video editing</InfoListText>
                    </MainInfoList>
                </MainInfoListWrap>
                <MyPageBtn onClick={()=>{setMyModal(true)}}>
                    <MyLine></MyLine>
                    <MyLine></MyLine>
                    <MyLine></MyLine>
                </MyPageBtn>
            </Container>
            {
                myModal &&
                <MyModal setMyModal={setMyModal} userdata={userdata}setuserdata={setuserdata}/>
            }
        </>
    );
}


const Container = styled.div`
    width: 100%;
    background: #F4F4FC url(${MainBg}) no-repeat top calc(100vw*(-58/428)) center/130%;
    padding-top: calc(100vw*(60/428));
    padding-bottom: calc(100vw*(45/428));
    border-radius: 0 0 calc(100vw*(25/428)) calc(100vw*(25/428));
    box-shadow: 0 0 calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.16);
`
const MainInfoWrap = styled.div`
    width: 100%;
    margin-bottom: calc(100vw*(35/428));
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
    margin: 0 auto;
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
const MainTitleWrap = styled.div`
    width: 100%;
    margin-top: calc(100vw*(20/428));
`
const MainTitle = styled.h3`
    font-size: calc(100vw*(22/428));
    font-weight: bold;
    text-align: center;
    color: #281755;
`
const MainText = styled.p`
    font-size: calc(100vw*(14/428));
    text-align: center;
    color: #9A9A9A;
    margin-top: calc(100vw*(5/428));
`
const Line = styled.div`
    width: calc(100vw*(100/428)); height: 1px;
    background: #BA98D8;
    margin: calc(100vw*(15/428)) auto;
`
const MainInfoListWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: calc(100vw*(30/428));
`
const MainInfoList = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: calc(100vw*(155/428)); height: calc(100vw*(155/428));
    margin: 0 calc(100vw*(12/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    border-radius: calc(100vw*(25/428));
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(25/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const CameraImg = styled.img`
    width: calc(100vw*(106/428));
    margin: 0 auto calc(100vw*(25/428));
`
const VideoImg = styled(CameraImg)`
    width: calc(100vw*(100/428));
`
const InfoListText = styled.p`
    position: absolute; bottom: calc(100vw*(15/428)); left: 0;
    width: 100%;
    font-size: calc(100vw*(10/428));
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    color: #39394A;
`
const MyPageBtn = styled.div`
    position: absolute; top: calc(100vw*(25/428)); right: calc(100vw*(25/428));
    cursor: pointer;
`
const MyLine = styled.span`
    display: block;
    width: calc(100vw*(4/428)); height: calc(100vw*(4/428));
    border-radius: 50%;
    margin-bottom: calc(100vw*(5/428));
    background: #2C003F;
`