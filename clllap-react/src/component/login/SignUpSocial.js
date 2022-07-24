//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";
import serverController from '../../server/serverController';

//css
import styled from "styled-components"

//img
import IconArrow from "../../img/icon/icon_select_arrow.svg"
import IconLogo from "../../img/icon/icon_logo_color.svg"

import PolicyModal from '../../component/modal/PolicyModal';

import PolicyString from '../common/policy_string';

export default function SignUpSocial() {

    //value
    const [nickname,setNickname] = useState('');
    const [gender,setGender] = useState('');
    const [age,setAge] = useState('');
    const [country,setCountry] = useState('');
    const [area,setArea] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [authenticate, setAuthenticate] = useState('');
    const [phoneCheckNum, setPhoneCheckNum] = useState("");

    const [termsMore,setTermsMore] = useState(false);
    const [allCheck,setAllCheck] = useState(false);
    const [termCheck,setTermCheck] = useState(false);
    const [privacyCheck,setPrivacyCheck] = useState(false);
    const [infoCheck,setInfoCheck] = useState(false);
    const [isPhoneCheck, setIsPhoneCheck] = useState(false);


    const [modalOn,setmodalOn] = useState(false);
    const [modalContent,setmodalContent] = useState("");

    //register 허락안하는 글귀 띄우기 
    const [preventRegister, setPreventRegister]= useState(false);

    const [isTermCheck, setIsTermCheck] = useState(false);

    //toggling
    const [ toggle4, setToggle4]= useState(false);

    const history = useHistory();

    const initError = () => {
        setPreventRegister(false);
    }

    const RegisterClick = () => {

        initError();
    
        if(!isPhoneCheck){
            alert("전화번호 인증을 해주세요.")
            return;
        }

        if(!termCheck || !privacyCheck){
            setIsTermCheck(true);
            return;
        }


        if(nickname&&phoneNum&&gender&&age&&country&&area){
            
            let formData = new FormData();
            formData.append("user_nickname",nickname);
            formData.append("user_phone",phoneNum);
            formData.append("user_gender", gender);
            formData.append("user_age", age);
            formData.append("user_country", country);
            formData.append("user_region", area);
    
            serverController.connectFetchController(`user/regist-social`, 'POST', formData, function(res) {
                if (res.result===1) {
                    history.push('/');
                }else{
                    setPreventRegister(true);
                }
            }, function(err) {console.log(err);})

        }
    }

    const termAllCheck = () => {
        if(allCheck){
            setAllCheck(false);
            setTermCheck(false);
            setPrivacyCheck(false);
            setInfoCheck(false);
        }else{
            setAllCheck(true);
            setTermCheck(true);
            setPrivacyCheck(true);
            setInfoCheck(true);
        }
    }

    // 핸드폰 인증 클릭
    const authentication = ()=>{
        alert("인증번호가 발송되었습니다.")
        let formData = new FormData();
        formData.append("user_phone",phoneNum);
        serverController.connectFetchController(`sms`, 'POST', formData, function(res) {
            console.log('res');
            console.log(res);
            if (res.result===1 ) {
                setPhoneCheckNum(res.identify_num)
            }else{
                alert("다시 시도해주세요")
            }
        }, function(err) {console.log(err);})
    }

    // 인증번호 확인 버튼 클릭
    const onClickPhoneCheck = () => {
        if(phoneCheckNum!='' && phoneCheckNum == authenticate){
            alert("인증되었습니다.")
            setIsPhoneCheck(true);
        }else{
            setIsPhoneCheck(false);
            alert("인증번호가 일치하지 않습니다.")
        }
    }

    useEffect(()=>{
        if(termCheck && privacyCheck && infoCheck){
            setAllCheck(true)
        }else{
            setAllCheck(false)
        }
    },[termCheck,privacyCheck,infoCheck])


    useEffect(() => {
        serverController.connectFetchController(`user/info`, 'GET', null, function(res) {
            console.log(res);
        }, function(err) {console.log(err);})
    }, [])

    const policymodal_confirm=()=>{
        setmodalOn(false);
    }


    return (
        <Container>
            <SignUpWrap>
                <LogoWrap>
                    <LogoImg src={IconLogo} alt="" />
                    <Title>Clllap register</Title>
                </LogoWrap>

                <SignUpList >
                    <InputWrap>
                        <SignUpInput errorOn={toggle4} type="text" placeholder="닉네임을 입력해주세요." onChange={(e)=>{setNickname(e.target.value)}}/>
                    </InputWrap>

                    <PhoneWrap>
                        <InputPhoneWrap>
                            <SignUpInput errorOn={false} value={phoneNum} onChange={e => setPhoneNum(e.target.value)} placeholder="전화번호를 입력해주세요."/>
                        </InputPhoneWrap>
                        <BtnWrap onClick={authentication}>
                            <BtnText>인증</BtnText>
                        </BtnWrap>
                    </PhoneWrap>

                    <PhoneWrap>
                        <InputPhoneWrap>
                            <SignUpInput errorOn={false} value={authenticate} onChange={e => setAuthenticate(e.target.value)} placeholder="인증번호를 입력해주세요."/>
                        </InputPhoneWrap>
                        <BtnWrap onClick={onClickPhoneCheck}>
                            <BtnText>확인</BtnText>
                        </BtnWrap>
                    </PhoneWrap>



                    <InputWrap>
                        <SignUpSelect name="" id="" on={gender !== 0} onChange={(e)=>{setGender(e.target.value)}}>
                            <option value={0} selected disabled hidden>성별을 선택해주세요.</option>
                            <option value={"여성"}>여성</option>
                            <option value={"남성"}>남성</option>
                        </SignUpSelect>
                    </InputWrap>
                    <InputWrap>
                        <SignUpSelect name="" id="" on={age !== 0} onChange={(e)=>{setAge(e.target.value)}}>
                            <option value={0} selected disabled hidden>연령대를 선택해주세요.</option>
                            <option value={"10-20대"}>10-20대</option>
                            <option value={"20-30대"}>20-30대</option>
                            <option value={"30-40대"}>30-40대</option>
                            <option value={"50대 이상"}>50대 이상</option>
                        </SignUpSelect>
                    </InputWrap>
                    <InputWrap>
                        <SignUpSelect name="" id="" on={country !== 0} onChange={(e)=>{setCountry(e.target.value)}}>
                            <option value={0} selected disabled hidden>국가를 선택해주세요.</option>
                            <option value={"대한민국"}>대한민국</option>
                            <option value={"미국"}>미국</option>
                            <option value={"일본"}>일본</option>
                            <option value={"중국"}>중국</option>
                            <option value={"영국"}>영국</option>
                        </SignUpSelect>
                    </InputWrap>
                    <InputWrap>
                        <SignUpSelect name="" id="" on={area !== 0} onChange={(e)=>{setArea(e.target.value)}}>
                            <option value={0} selected disabled hidden>지역을 선택해주세요.</option>
                            <option value={"서울"}>서울</option>
                            <option value={"경기도"}>경기도</option>
                            <option value={"인천"}>인천</option>
                            <option value={"부산"}>부산</option>
                        </SignUpSelect>
                    </InputWrap>

                    <TermsWrap>
                        <TermsBox on={termsMore}>
                            <Checks>
                                <ChkBox type="checkbox" name="" id="chk" on={termsMore} checked={allCheck}/>
                                <ChkBoxLabel htmlFor="chk" on={termsMore} onClick={()=>{termAllCheck()}}/>
                                <CheckText on={termsMore}>모든 약관에 동의 합니다.</CheckText>
                            </Checks>
                            <MoreBtn on={termsMore} onClick={()=>{setTermsMore(!termsMore)}}>{termsMore ? '접기' : '펼쳐보기'}</MoreBtn>
                            {
                                termsMore &&
                                <MoreWrap>
                                    <TermsSubBox>
                                        <Checks>
                                            <ChkBox type="checkbox" name="" id="chk1" on={termsMore} checked={termCheck}/>
                                            <ChkBoxLabel htmlFor="chk1" on={termsMore} onClick={()=>{setTermCheck(!termCheck)}}/>
                                            <CheckText on={termsMore}>이용약관</CheckText>
                                        </Checks>
                                        <MoreBtn on={termsMore}onClick={()=>{
                                            setmodalContent(PolicyString[1]);
                                            setmodalOn(true)
                                        }}
                                        >[보기]</MoreBtn>
                                    </TermsSubBox>
                                    <TermsSubBox>
                                        <Checks>
                                            <ChkBox type="checkbox" name="" id="chk2" on={termsMore} checked={privacyCheck}/>
                                            <ChkBoxLabel htmlFor="chk2" on={termsMore} onClick={()=>{setPrivacyCheck(!privacyCheck)}}/>
                                            <CheckText on={termsMore}>개인정보 처리 방침</CheckText>
                                        </Checks>
                                        <MoreBtn on={termsMore}onClick={()=>{
                                            setmodalContent(PolicyString[0])
                                            setmodalOn(true)
                                        
                                        }}>[보기]</MoreBtn>
                                    </TermsSubBox>
                                    {/*<TermsSubBox>
                                        <Checks>
                                            <ChkBox type="checkbox" name="" id="chk3" on={termsMore} checked={infoCheck}/>
                                            <ChkBoxLabel htmlFor="chk3" on={termsMore} onClick={()=>{setInfoCheck(!infoCheck)}}/>
                                            <CheckText on={termsMore}>마케팅 관련 이메일 수신 동의</CheckText>
                                        </Checks>
                                        <MoreBtn on={termsMore}>[보기]</MoreBtn>
                                    </TermsSubBox>*/}
                                </MoreWrap>
                            }
                        </TermsBox>
                    </TermsWrap>
                </SignUpList>
                {preventRegister && <ErrorText>입력하신 정보가 올바르지 않습니다. 다시 입력해주세요.</ErrorText>}
                {isTermCheck && <ErrorText>약관 동의를 하셔야 가입하실 수 있습니다.</ErrorText>}
                <RegisterBtn onClick={()=>{RegisterClick()}}>
                    <RegisterText>Register now</RegisterText>
                </RegisterBtn>

                {
                    modalOn && 
                    <PolicyModal message={modalContent} confirmClick={policymodal_confirm}/>
                }
            </SignUpWrap>
        </Container>
    );
}

const Bell =styled.div`
width:100%;

`
const Container = styled.div`
    width: 100%; min-height: 100vh;
    background: #F4F4FC;
    padding: calc(100vw*(35/428)) calc(100vw*(24/428)) calc(100vw*(65/428));
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`
const SignUpWrap = styled.div`
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
const SignUpList = styled.div`
    width: 100%; 
    margin-top: calc(100vw*(18/428));
    margin-bottom: calc(100vw*(100/428));
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
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%; pointer-events: none;
        border-radius: calc(100vw*(27/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
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
const AuthenticateInput = styled.input`
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
const TermsWrap = styled(InputWrap)`
    width: 100%;
    padding: calc(100vw*(4/428));
    background: #F7F7FF;
`
const TermsBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%; min-height: calc(100vw*(46/428));
    border-radius: calc(100vw*(27/428));
    padding: calc(100vw*(20/428)) calc(100vw*(25/428));
    ${({on})=>{
        return on ?
        `background: #A38DCC; box-shadow: inset calc(100vw*(6/428)) calc(100vw*(6/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);`
        :
        `background: #F4F4FC;`
    }}
`
const TermsSubBox = styled(TermsBox)`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%; min-height: auto; height: calc(100vw*(30/428));
    padding: 0;
    box-shadow: none;
    background: #A38DCC;
`
const MoreBtn = styled.p`
    position: relative;
    font-size: calc(100vw*(15/428));
    cursor: pointer;
    z-index: 10;
    ${({on})=>{
        return on ?
        `color: #fff;`
        :
        `color: #888888;`
    }}
`
const MoreWrap = styled.div`
    width: calc(100vw*(285/428));
    margin: calc(100vw*(14/428)) auto 0;
`
const RegisterBtn = styled(InputWrap)`
    border-radius: calc(100vw*(18/428));
    background-color: #e2e2eb;
    margin-bottom: 0;
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
const ErrorText = styled.p`
    width: 100%;
    font-size: calc(100vw*(16/428));
    text-align: center;
    color: #E22D2D;
    margin-bottom: calc(100vw*(20/428));
`
//checkbox
const CheckText = styled.div`
    font-size: calc(100vw*(15/428));
    padding-left: calc(100vw*(30/428));
    margin-bottom: calc(100vw*(2/428));
    ${({on})=>{
        return on ?
        `color: #fff;`
        :
        `color: #a38dcc;`
    }}
`
const Checks = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: calc(100vw*(21/428));
    margin-right: calc(100vw*(25/428));
    z-index: 10;
`
const ChkBox = styled.input`
    position: absolute;
    width: 1px; height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
    &:checked + label::after {
        content: '';
        position: absolute; top: 50%; left: calc(100vw*(5/428));
        transform: translateY(-50%);
        width: calc(100vw*(13/428)); height: calc(100vw*(13/428));
        border-radius: 50%;
        ${({on})=>{
            return on ?
            `background: #fff;`
            :
            `background: #a38dcc;`
        }}
    }
`
const ChkBoxLabel = styled.label`
    display: inline-block;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    &::before {
        content: '';
        position: absolute; top: 50%; left: 0;
        transform: translateY(-50%);
        width: calc(100vw*(21/428)); height: calc(100vw*(21/428));
        border-radius: 50%;
        ${({on})=>{
            return on ?
            `border: 1px solid #fff; background: #a38dcc;`
            :
            `border: 1px solid #a38dcc; background: #f4f4fc;`
        }}
    }
`