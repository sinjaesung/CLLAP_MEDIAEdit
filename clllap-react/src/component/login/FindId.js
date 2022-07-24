//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import IconLogo from "../../img/icon/icon_logo_color.svg"

import serverController from '../../server/serverController';


export default function FindId() {
    const [next,setNext] = useState(false);
    const [userName,setUserName] = useState("");
    const [phone,setPhone] = useState("");
    const [phoneConfirm, setPhoneConfirm] = useState("");
    const [confirmNum, setConfirmNum] = useState();
    const [isConfirm, setIsConfirm] = useState(false);

    const [isError, setIsError] = useState(false);
    const [isFind, setIsFind] = useState(false);
    const [userId, setUserId] = useState("");

    const onClickPhone = () => {
        let formData = new FormData();
        formData.append("user_phone", phone);
        serverController.connectFetchController(`sms`, 'POST', formData, function(res) {
            if(res.result == 1){
                setConfirmNum(res.identify_num);
            }else{
                alert("다시 시도해주세요.");
            }            
        }, function(err) {console.log(err);})
    }


    const onClickConfirm = () => {
        setIsConfirm(confirmNum == phoneConfirm);
        if(confirmNum !== phoneConfirm){
            alert("인증번호가 일치하지 않습니다.")
        }
    }

    const onClickFind = () => {
        if(!isConfirm){
            alert("핸드폰 인증을 해주세요.")
            return;
        };
        setUserId("");
        setIsFind(false);
        setIsError(false);

        let formData = new FormData();
        formData.append("user_phone", phone);
        serverController.connectFetchController(`user/find-id`, 'POST', formData, function(res) {
            if(res.result == 1){
                setUserId(res.user_id);
                setIsFind(true);
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
            <FindIdWrap>
                <LogoWrap>
                    <LogoImg src={IconLogo} alt="" />
                    <Title>Find ID</Title>
                </LogoWrap>

                <FindIdList>
                    {/* <InputWrap>
                        <FindIdInput errorOn={true} type="email" placeholder="이름을 입력해주세요." value={userName} onChange={(e)=>{setUserName(e.target.value)}}/>
                    </InputWrap> */}
                    <PhoneWrap>
                        <InputPhoneWrap>
                            <FindIdInput errorOn={false} type="tel" placeholder="전화번호를 입력해주세요." value={phone} onChange={(e)=>{setPhone(e.target.value)}}/>
                        </InputPhoneWrap>
                        <BtnWrap onClick={onClickPhone}>
                            <BtnText>인증</BtnText>
                        </BtnWrap>
                    </PhoneWrap>

                    <PhoneWrap>
                        <InputPhoneWrap>
                            <FindIdInput errorOn={false} type="tel" placeholder="인증번호를 입력해주세요." value={phoneConfirm} onChange={(e)=>{setPhoneConfirm(e.target.value)}}/>
                        </InputPhoneWrap>
                        <BtnWrap onClick={onClickConfirm}>
                            <BtnText>확인</BtnText>
                        </BtnWrap>
                    </PhoneWrap>
                    
                    <FindList> 
                        <FindText onClick={findpasswordClick}>비밀번호 찾기</FindText>
                        <SubLine>|</SubLine>
                        <FindText onClick={signupClick}>회원가입</FindText>
                    </FindList>
                </FindIdList>

                {
                    isFind && 
                    <FindEmailText>등록된 정보로 가입된 아이디는<br/>{userId} 입니다.</FindEmailText>
                }

                {
                    isError&&
                    <ErrorText>등록된 정보로 가입된 아이디가 없습니다.</ErrorText>
                }

                <FindIdBtnWrap on={isConfirm} onClick={onClickFind}>
                    <FindIdBtnText on={isConfirm}>Find ID</FindIdBtnText>
                </FindIdBtnWrap>
            </FindIdWrap>
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
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`
const FindIdWrap = styled.div`
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
const FindIdList = styled.div`
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
const FindText = styled.p`
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
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%; pointer-events:none;
        border-radius: calc(100vw*(27/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const FindIdInput = styled.input`
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
const PhoneWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: calc(100vw*(18/428));
`
const InputPhoneWrap = styled(InputWrap)`
    width: calc(100vw*(280/428));
    margin-bottom: 0;
`
const BtnWrap = styled(InputWrap)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100vw*(96/428));
    margin-bottom: 0;
    cursor: pointer;
`
const BtnText = styled.p`
    width: calc(100vw*(280/428)); height: calc(100vw*(46/428));
    font-size: calc(100vw*(16/428));
    line-height: calc(100vw*(46/428));
    border-radius: calc(100vw*(27/428));
    font-weight: bold;
    text-align: center;
    color: #fff;
    background: #A38DCC;
    box-shadow: inset calc(100vw*(6/428)) calc(100vw*(6/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);
`
const FindIdBtnWrap = styled.p`
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
const FindIdBtnText = styled.p`
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
const FindEmailText = styled(ErrorText)`
    color: #281755;
`