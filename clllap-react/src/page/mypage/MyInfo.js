//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"
import DangerModal from "../../component/modal/DangerModal";
import DefaultModal from "../../component/modal/DefaultModal";

import IconArrow from "../../img/icon/icon_arrow_back.svg"
import IconLogo from "../../img/icon/icon_main_logo.svg"

import { useSelector } from 'react-redux';
import { UserDataAction } from "../../store/actionCreators";
import serverController from '../../server/serverController';

export default function MyInfo() {
    const history = useHistory();

    const [gender, setGender] = useState(0);
    const [country,setCountry] = useState('');
    const [area,setArea] = useState('');
    const [age,setAge] = useState('');
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    const [isDangerModal, setIsDangerModal] = useState(false);
    const [isCompleteModal, setIsCompleteModal] = useState(false);

    const userData = useSelector(store => store.userData.userData);

    const selectData = [
        {option:["성별을 선택해주세요.", "여성", "남성"]},
        {option:["연령대를 선택해주세요.", "10-20대", "20-30대", "30-40대", "50대 이상"]},
        {option:["국가를 선택해주세요.", "대한민국","미국","일본","중국","영국",]},
        {option:["지역을 선택해주세요.",  "서울", "경기도", "인천", "부산",]},
    ]

    const RegisterClick = () => {

        if(pw){
            const passwordRegex  = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{6,24}/; // 문자와 특수문자 조합의 6~24 자리
            if (!passwordRegex.test(pw)){
                alert("비밀번호는 특수문자를 포함하여 6~24자리를 입력해주세요.")
                return;
            }

            if(pw !== confirmPw){
                alert("비밀번호가 일치하지 않습니다.")
                return;
            }
        }


        let formData = new FormData();
        formData.append("user_gender", gender);
        formData.append("user_age", age);
        formData.append("user_country", country);
        formData.append("user_region", area);
        formData.append("user_phone", phone);
        pw && formData.append("user_password", pw);

        serverController.connectFetchController(`user/modify`, 'POST', formData, function(res) {
            if(res.result == 1){
                let newObj = JSON.parse(JSON.stringify(userData));
                newObj.user_gender = gender;
                newObj.user_age = age;
                newObj.user_country = country;
                newObj.user_region = area;
                newObj.user_phone = phone;

                UserDataAction.updateUserData({userData:newObj});
                alert("회원정보가 수정되었습니다.")
            }
        }, function(err) {console.log(err);})
    }
    /*const initial_info =()=>{
        serverController.connectFetchController(`user`,'GET',null,function(res){
            if(res.result==1){
                let result=res.user;
                alert('초기페이지도달:',JSON.stringify(result));
            }
        })
    }*/
    const onClickDanger = () => {        
        serverController.connectFetchController(`user/secession`, 'POST', null, function(res) {
            if(res.result == 1){
                setIsDangerModal(false);
                setIsCompleteModal(true);
                alert('회원탈퇴완료');
            }else{
                alert("잠시후 다시 시도해주세요.")
            }
        }, function(err) {console.log(err);})
    }

    const onClickOut = () => {
        setIsCompleteModal(false);
        UserDataAction.updateLogout();
        //history.push("/");
        let res=serverController.connectFetchController("/user-logout","GET",null,function(res) {
            //실질적인세션 서버 로그아웃까지처리해줘야한다.
            if(window.ReactNativeWebView){
                window.ReactNativeWebView.postMessage(JSON.stringify({type:"userOut",target:'WebviewScreen'}))
            }
        }, function(err) {console.log(err);});   
    }

    const returnDangerText = () => {
        return(
            <>
                CLLlap 탈퇴를 하시면 활동내역이 모두 삭제되어 <br />
                복구하실 수 없습니다.<br />
                <br />
                정말로 회원탈퇴를 원하신다면 아래에<br />
                회원탈퇴 버튼을 눌러주세요.
            </>
        )
    }


    const returnState = (index, e) => {
        const state = e?
        [setGender, setAge, setCountry, setArea]
        :
        [gender, age, country, area];
        

        if(e){
            return state[index](e.target.value);
        }else{
            return state[index];
        }
    }

    useEffect(() => {
        setGender(userData.user_gender);
        setCountry(userData.user_country);
        setArea(userData.user_region);
        setAge(userData.user_age);
        setPhone(userData.user_phone);
        setEmail(userData.user_email);
    }, [userData])

    useEffect(()=>{
        //initial_info();
    },[])
    return (
        <Container>


            {
                isDangerModal &&
                <DangerModal title={"회원탈퇴"} content={returnDangerText()} onClickCancel={() => setIsDangerModal(false)} onClickDanger={onClickDanger}/>
            }

            {
                isCompleteModal &&
                <DefaultModal title={"회원 탈퇴가 완료되었습니다."} nextClick={onClickOut}/>
            }

            <TitleWrap>
                <BackBtn src={IconArrow} alt="뒤로가기" onClick={() => history.goBack()}/>
                <Title>마이페이지</Title>
                <div></div>
            </TitleWrap>

            <ContentGrid>

                <MainLogoWrap>
                    <MainLogoBox>
                        <MainLogo src={IconLogo} alt="CLLLAP"/>
                    </MainLogoBox>
                </MainLogoWrap>

                <Name>{userData.user_nickname}</Name>

                <Line></Line>

                {
                    selectData.map((item, index) => {
                        return(
                            <InputWrap key={index}>
                                <SignUpSelect name="" id="" value={returnState(index)} on={item.state} onChange={e => returnState(index, e) }>
                                    {
                                        item.option.map((item2, index2) => {
                                            if(index2==0){
                                                return(
                                                    <option value={item2} selected disabled hidden>{item2}</option>
                                                )
                                            }else{
                                                return(
                                                    <option value={item2}>{item2}</option>
                                                )

                                            }
                                        })
                                    }
                                </SignUpSelect>
                            </InputWrap>
                        )
                    })
                }

                <InputWrap>
                    <SignUpInput errorOn={false} value={phone} onChange={e => setPhone(e.target.value)} type="text" placeholder="전화번호를 입력해주세요."/>
                </InputWrap>
                <InputWrap>
                    <SignUpInput errorOn={false} value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="이메일 주소를 입력해주세요."/>
                </InputWrap>
                <InputWrap>
                    <SignUpInput errorOn={false} value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="비밀번호를 입력해주세요."/>
                </InputWrap>
                <InputWrap>
                    <SignUpInput errorOn={false} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} type="password" placeholder="비밀번호를 다시 입력해주세요."/>
                </InputWrap>


                <Delete onClick={() => setIsDangerModal(true)}>회원탈퇴</Delete>

                <RegisterBtn onClick={RegisterClick}>
                    <RegisterText>저장</RegisterText>
                </RegisterBtn>
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
const SignUpInput = styled.input`
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