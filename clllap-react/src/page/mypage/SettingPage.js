//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"
import DangerModal from "../../component/modal/DangerModal";
import DefaultModal from "../../component/modal/DefaultModal";

import IconArrow from "../../img/icon/icon_arrow_back.svg"
import IconLogo from "../../img/icon/icon_main_logo.svg"

//islogin
import isLogin from "../login/isLogin";

export default function SettingPage() {
    const history = useHistory();

    //console.log('isLogin:',isLogin());
    /*let islogin=async function(){
        let login_status=await isLogin();
        console.log('login_stautsss:',login_status);

        if(!login_status){
            alert("로그인이 필요한 서비스입니다");
            //history.push("/");
        }
    };
    islogin();*/
   
    const [isDangerModal, setIsDangerModal] = useState(false);
    const [isCompleteModal, setIsCompleteModal] = useState(false);

    const onClickDanger = () => {
        setIsDangerModal(false);
        setIsCompleteModal(true);
    }

    const onClickOut = () => {
        setIsCompleteModal(false);
    }

    return (
        <Container>
            
            <TitleWrap>
                <BackBtn src={IconArrow} alt="뒤로가기" onClick={() => history.push("/mypage")}/>
                <Title>Setting</Title>
                <div></div>
            </TitleWrap>

            <ContentGrid>
                <LinkWrap to={`/setting/guide`}>
                    <BtnText>사용자 가이드</BtnText>
                </LinkWrap>
                <BtnWrap href={'/qna'}>
                    <BtnText>문의하기</BtnText>
                </BtnWrap>
            </ContentGrid>
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
    margin-bottom: calc(100vw*(24/428));
`
const ContentGrid = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: calc(100vw*(100/428));
`
const Delete = styled.div`
    color:#AAA;
    font-weight: 700;
    font-size: calc(100vw*(15/428));
    margin: calc(100vw*(12/428)) 0 calc(100vw*(30/428));
`

const InputWrap = styled.div`
    position: relative;
    width: calc(100vw*(374/428));
    border-radius: calc(100vw*(27/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    padding: calc(100vw*(4/428));
    margin-bottom: calc(100vw*(26/428));
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(27/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const SignUpSelect = styled.select`
    position: relative;
    width: 100%; height: calc(100vw*(46/428));
    font-size: calc(100vw*(16/428));
    text-align: center;
    border: 1px solid #9f8ec8;
    border-radius: calc(100vw*(27/428));
    background: #f7f7ff url(${IconArrow}) no-repeat center right calc(100vw*(30/428))/calc(100vw*(9/428));
    padding: 0 calc(100vw*(20/428));
    -webkit-appearance: none;
    z-index: 10;
    ${({on})=>{
        return on ?
        `color: #281755;`
        :
        `color: #C0B9CE;`
    }}
    & option {font-size: calc(100vw*(16/428));}
`
const RegisterBtn = styled(InputWrap)`
    margin-bottom: calc(100vw*(62/428));
    border-radius: calc(100vw*(18/428));
    background-color: #e2e2eb;
    padding: calc(100vw*(5/428));
    cursor: pointer;
    &:after {box-shadow: calc(100vw*(3/428)) calc(100vw*(4/428)) calc(100vw*(10/428)) 0 rgba(0,0,0,0.15); border-radius: calc(100vw*(18/428));}
`
const RegisterText = styled.p`
    width: 100%; height: calc(100vw*(64/428));
    font-size: calc(100vw*(22/428));
    line-height: calc(100vw*(64/428));
    font-weight: bold;
    text-align: center;
    color: #fff;
    border-radius: calc(100vw*(18/428));
    background-image: linear-gradient(to right, #ee3dff, #7824f8 17%, #2a15e6 37%, #006cc9 60%, #00bcdd 80%, #15ce86 102%);
`
const BtnWrap = styled.a`
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
const LinkWrap = styled(Link)`
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
