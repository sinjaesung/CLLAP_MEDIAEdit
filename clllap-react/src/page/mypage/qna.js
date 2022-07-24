//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

// img
import IconArrow from "../../img/icon/icon_arrow_back.svg"
import IconMore from "../../img/icon/icon_plus_background.svg"

// component
import QnaLayout from "./QnaLayout"

// server
import serverController from '../../server/serverController';


export default function Qna() {
    const [qnaList, setQnaList] = useState([]);
    const history = useHistory();

    useEffect(()=>{
        serverController.connectFetchController(`question/list`, 'GET', null, function(res) {
            if (res.result == 1) {
                setQnaList([...res.question_list]);
            }
        }, function(err) {console.log(err);})
    },[])


    return (
        <Container>

            <TitleWrap>
                <BackBtn src={IconArrow} alt="뒤로가기" onClick={() => history.push("/setting")}/>
                <Title>문의하기</Title>
                <div></div>
            </TitleWrap>

            <ContentGrid>
                <ContentInner>
                    {
                        qnaList.length !== 0 ?
                        qnaList.map((value,index)=>{
                            return(
                                <QnaLayout key={index + 'qna list'} value={value}/>
                            )
                        })
                        :
                        <Notext>문의 내역이 존재하지 않습니다.</Notext>
                    }
                </ContentInner>
                <MoreWrap to={`/qna/write`}>
                    <MoreImg src={IconMore} alt="" />
                </MoreWrap>
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
const ContentGrid = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: calc(100vw*(30/428));
    padding: 0 calc(100vw*(28/428));
`
const ContentInner = styled.div`
    width: 100%;
    border-top: 1px solid #C0B9CE;
`
const MoreWrap = styled(Link)`
    width: calc(100vw*(38/428)); height: calc(100vw*(38/428));
    margin: calc(100vw*(50/428)) auto calc(100vw*(30/428));
    cursor: pointer;
`
const MoreImg = styled.img`
    width: 100%; height: 100%;
`
const Notext = styled.p`
    font-size: calc(100vw*(15/428));
    text-align: center;
    color: #C0B9CE;
    padding: calc(100vw*(260/428)) 0 0;
`