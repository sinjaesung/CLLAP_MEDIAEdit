//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

import { useSelector } from 'react-redux';
import { UserDataAction } from "../../store/actionCreators";

import serverController from '../../server/serverController';

export default function MyModal({setMyModal,userdata,setuserdata}) {
    const history = useHistory();
    const userData = useSelector(store => store.userData.userData);

    const loginClick=()=>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"login"}));//로그인페이지 요청
        }else{
        }
    }
    const mypageClick=()=>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:'mypage'}));//마이페이지 요청
        }else{
        }
    }
    return (
        <>
            <Bg onClick={()=>{setMyModal(false)}}/>
            <ModalWrap>
                {
                    userData.user_id==0?
                    <Title onClick={() =>{/*history.push("/login")*/ loginClick()}}>로그인</Title>
                    :
                    <>
                        <Title onClick={() => {/*history.push("/mypage")*/ mypageClick()}}>마이페이지</Title>
                        <Title onClick={() => {
                            UserDataAction.updateLogout()
                            let res=serverController.connectFetchController("/user-logout","GET",null,function(res) {
                                console.log('logout ressss??:',res);
                                setuserdata({});
                                if(window.ReactNativeWebView){
                                    window.ReactNativeWebView.postMessage(JSON.stringify({type:'logout',target:'WebviewScreen'}));//메인페이지 재귀 요청
                                }
                                //history.push("/");
                            }, function(err) {console.log(err);});
                        }}>로그아웃</Title>
                    </>
                }
            </ModalWrap>
        </>
    );
}


const Bg = styled.div`
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100vh;
    z-index: 200;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`
const ModalWrap = styled.div`
    position: fixed; top: calc(100vw*(65/428)); right: calc(100vw*(25/428));
    width: auto;
    background: #F4F4FC;
    box-shadow: 0 0 calc(100vw*(15/428)) 0 rgba(75, 22, 160, 0.16);
    border-radius: calc(100vw*(12/428));
    padding: calc(100vw*(16/428)) calc(100vw*(17/428));
    z-index: 500;
`
const Title = styled.p`
    font-size: calc(100vw*(16/428));
    font-weight: bold;
    text-align: center;
    color: #281755;
    margin-bottom: calc(100vw*(20/428));
    cursor: pointer;
    &:last-child {margin-bottom: 0; color: #39394A;}
`