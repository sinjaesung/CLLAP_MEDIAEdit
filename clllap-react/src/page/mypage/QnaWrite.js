//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

// img
import IconArrow from "../../img/icon/icon_arrow_back.svg"
import IconMore from "../../img/icon/icon_plus_background.svg"

// component
import DefaultModal from "../../component/modal/DefaultModal"

// server
import serverController from '../../server/serverController';

//islogin
import isLogin from "../login/isLogin";
   
export default function QnaWrite() {
    const [next,setNext] = useState(false);
    const [qnaTitle,setQnaTitle] = useState("");
    const [qnaText,setQnaText] = useState("");
    const [modal,setModal] = useState(false);

    const history = useHistory();

    /*console.log('isLogin:',isLogin());
    if(!isLogin()){
        alert("로그인 후 이용해주세요");
        history.push('/');
    }*/
    
    const QnaClick = () => {

        if(qnaTitle&&qnaText){
            let formData = new FormData();
            formData.append("question_title",qnaTitle);
            formData.append("question_content",qnaText);
    
            serverController.connectFetchController(`question/write`, 'POST', formData, function(res) {
                if (res.result == 1) {
                    setModal(true);
                }
            }, function(err) {console.log(err);})
        }else{
            alert('문의글을 작성해주세요.')
        }
    }

    const nextClick = () => {
        history.push('/qna');
    }


    return (
        <Container>

            <TitleWrap>
                <BackBtn src={IconArrow} alt="뒤로가기" onClick={() => history.goBack()}/>
                <Title>문의하기</Title>
                <div></div>
            </TitleWrap>

            <ContentGrid>
                <InputWrap>
                    <QnaInput type="text" placeholder="제목을 입력해주세요." value={qnaTitle} onChange={(e)=>{setQnaTitle(e.target.value)}}/>
                </InputWrap>
                <InputWrap>
                    <QnaTextArea placeholder="문의 내용을 입력해주세요." value={qnaText} onChange={(e)=>{setQnaText(e.target.value)}}/>
                </InputWrap>

                <RegisterBtn onClick={()=>{QnaClick()}}>
                    <RegisterText>Register now</RegisterText>
                </RegisterBtn>
            </ContentGrid>

            {
                modal&&
                <DefaultModal title={'문의 내용이 등록되었습니다.'} nextClick={nextClick}/>
            }

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
const ContentGrid = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: calc(100vw*(30/428));
    padding: 0 calc(100vw*(28/428));
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
const QnaInput = styled.input`
    width: 100%; height: calc(100vw*(46/428));
    font-size: calc(100vw*(16/428));
    text-align: center;
    color: #281755;
    border-radius: calc(100vw*(27/428));
    background-color: #f7f7ff;
    padding: 0 calc(100vw*(20/428));
    &::placeholder {color: #c0b9ce; font-size: calc(100vw*(15/428)); text-align: center;}
    ${({errorOn})=>{
        return errorOn ?
        `border: 1px solid #E24747; color: #E22D2D;`
        :
        `border: 1px solid #9f8ec8;`
    }}
`
const QnaTextArea = styled.textarea`
    width: 100%; height: 60vh;
    font-size: calc(100vw*(16/428));
    text-align: left;
    color: #281755;
    border-radius: calc(100vw*(27/428));
    background-color: #f7f7ff;
    padding: calc(100vw*(20/428));
    &::placeholder {color: #c0b9ce; font-size: calc(100vw*(15/428));}
    ${({errorOn})=>{
        return errorOn ?
        `border: 1px solid #E24747; color: #E22D2D;`
        :
        `border: 1px solid #9f8ec8;`
    }}
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