//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconLogo from "../../img/icon/icon_logo_color.svg"

import serverController from '../../server/serverController';
import { UserDataAction } from "../../store/actionCreators";

export default function EmailLogin() {
    const history = useHistory();
    const [next,setNext] = useState(false);
    const [userId,setUserId] = useState("q@qwe.qwe");
    const [password,setPassword] = useState("");//qwe123!!
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if(userId.length==0||password.length==0){setNext(false); return;}
        setNext(true)
    }, [userId, password])

    // 로그인 클릭
    const onClickLogin = () => {
        if(userId.length == 0 || password.length == 0){return;}
        setIsError(false);
        let formData = new FormData();
        formData.append("user_email",userId);
        formData.append("user_password",password);
        serverController.connectFetchController(`user-login`, 'POST', formData, function(res) {
            if(res.result == 1){
                const data = res.user;
                const userData = {
                    user_age: data.user_age,
                    user_country: data.user_country,
                    user_email: data.user_email,
                    user_gender: data.user_gender,
                    user_id: data.user_id,
                    user_join_check: data.user_join_check,
                    user_name: data.user_name,
                    user_nickname: data.user_nickname,
                    user_phone: data.user_phone,
                    user_profile: data.user_profile,
                    user_region: data.user_region,
                    username: data.username,
                }
                UserDataAction.updateUserData({userData});
                //history.push("/")
                if(window.ReactNativeWebView){
                    window.ReactNativeWebView.postMessage(JSON.stringify({type:"loginComplete",target:"WebviewScreen"}));
                }
            }else{
                setIsError(true);
            }
        }, function(err) {console.log(err);})
    }
    const findidClick=()=>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"pageMove",target:'findid'}))
        }
    }
    const findpasswordClick=()=>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"pageMove",target:'findpassword'}))
        }
    }
    const signupClick=()=>{
        if(window.ReactNativeWebView){
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"pageMove",target:'signup'}));
        }
    }

    return (
        <Container>
            <EmailLoginWrap>
                <LogoWrap>
                    <LogoImg src={IconLogo} alt="" />
                    <Title>Login</Title>
                </LogoWrap>

                <EmailLoginList>
                    <InputWrap>
                        <EmailLoginInput errorOn={isError} type="email" placeholder="이메일 주소를 입력해주세요." value={userId} onChange={(e)=>{setUserId(e.target.value)}}/>
                    </InputWrap>
                    <InputWrap>
                        <EmailLoginInput errorOn={isError} type="password" placeholder="비밀번호를 입력해주세요." value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    </InputWrap>
                    <FindList>
                        <FindText onClick={findidClick}>아이디 찾기</FindText>
                        <SubLine>|</SubLine>
                        <FindText onClick={findpasswordClick}>비밀번호 찾기</FindText>
                        <SubLine>|</SubLine>
                        <FindText onClick={signupClick}>회원가입</FindText>
                    </FindList>
                </EmailLoginList>
                {
                    isError && 
                    <ErrorText>비밀번호 또는 아이디가 일치하지 않습니다.</ErrorText>
                }
                <BtnWrap onClick={onClickLogin}>
                    <BtnText on={next}>Login</BtnText>
                </BtnWrap>
            </EmailLoginWrap>
        </Container>
    );
}


const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; min-height: 100vh;
    background: #F4F4FC;
    padding: calc(100vw*(35/428)) calc(100vw*(24/428)) calc(100vw*(65/428));
    /* iOS only */
    @supports (-webkit-touch-callout: none) { height: -webkit-fill-available; }
`
const EmailLoginWrap = styled.div`
    width: 100%; 
`
const LogoWrap = styled.div`
    width: 100%; 
`
const LogoImg = styled.img`
    width: calc(100vw*(140/428));
    margin: 0 auto;
`
const Title = styled.h2`
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    text-align: center;
    font-family: 'Gugi', sans-serif;
    color: #39394a;
    margin-top: calc(100vw*(20/428));
`
const EmailLoginList = styled.div`
    width: 100%; 
    margin-top: calc(100vw*(18/428));
`
const FindList = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; 
    margin-top: calc(100vw*(18/428));
    margin-bottom: calc(100vw*(40/428));
`
const FindText = styled.span`
    font-size: calc(100vw*(14/428));
    font-weight: bold;
    color: #888888;
    cursor: pointer;
`
const SubLine = styled.span`
    font-size: calc(100vw*(14/428));
    color: #C9C1EA;
    margin: 0 calc(100vw*(10/428));
`
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
const BtnWrap = styled.div`
    position: relative;
    width: 100%;
    border-radius: calc(100vw*(28/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    padding: calc(100vw*(4/428));
    margin-top: calc(100vw*(25/428));
    background: #F7F7FF;
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(28/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const BtnText = styled.p`
    width: 100%; height: calc(100vw*(60/428));
    font-size: calc(100vw*(20/428));
    line-height: calc(100vw*(58/428));
    font-weight: bold;
    text-align: center;
    border-radius: calc(100vw*(28/428));
    background-color: #f7f7ff;
    padding: 0 calc(100vw*(20/428));
    &::placeholder {color: #c0b9ce; font-size: calc(100vw*(15/428));}
    ${({on})=>{
        return on ?
        `background: #A38DCC; color: #fff; box-shadow: inset calc(100vw*(6/428)) calc(100vw*(6/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);`
        :
        `background: #F4F4FC; color: #281755;`
    }}
`
const ErrorText = styled.p`
    width: 100%;
    font-size: calc(100vw*(16/428));
    text-align: center;
    color: #E22D2D;
`