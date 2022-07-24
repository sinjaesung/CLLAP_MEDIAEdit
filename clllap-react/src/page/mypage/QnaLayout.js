//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

// img
import IconQnaArrow from "../../img/icon/icon_select_arrow.svg"
import IconQnaArrowTop from "../../img/icon/icon_select_arrow_top.svg"
import IconComent from "../../img/icon/icon_an.svg"


export default function QnaLayout({value}) {
    const [qnaOpen, setQnaOpen] = useState(false);


    return (
        <QnaList onClick={()=>setQnaOpen(!qnaOpen)}>
            <QnaListBox>
                <QnaTitle>{value.question_title}</QnaTitle>
                <QnaImg src={qnaOpen ? IconQnaArrowTop : IconQnaArrow} alt="" />
            </QnaListBox>
            {
                qnaOpen&&
                <>
                    <QueWrap blank={qnaOpen}>
                        <Question>{value.question_content}</Question>
                    </QueWrap>
                    {
                        value.question_answered !== "n" ?
                        <QnaComent>
                            <ComIcon src={IconComent} alt="Coment" />
                            <Answer>{value.answered_content}</Answer>
                        </QnaComent>
                        :
                        null
                    }
                </>
            }
        </QnaList>
    );
}
// css
const QnaList = styled.div`
    width: 100%;
    padding: calc(100vw*(16/428)) 0;  
    border-bottom: 1px solid #DFD9F0;
`
const QnaListBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
`
const QnaTitle = styled.div`
    font-size: calc(100vw*(15/428));
`
const QnaImg = styled.img`
    width: calc(100vw*(9/428));
    margin-right: calc(100vw*(10/428));
`
const QueWrap = styled.div`
    width: 100%;
    background: #A38DCC;
    border-radius: calc(100vw*(20/428));
    margin-top: calc(100vw*(20/428));
    padding: calc(100vw*(15/428)) calc(100vw*(20/428));
    box-shadow: inset 0 calc(100vw*(3/428)) calc(100vw*(10/428)) rgba(1,1,1,0.12);
    
    ${({blank})=>{
        return blank ?
        ``
        :
        `margin-bottom: calc(100vw*(20/428));`
    }}
`
const Question = styled.p`
    font-size: calc(100vw*(15/428));
    color: #fff;
`
const QnaComent = styled.div`
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin: calc(100vw*(15/428)) 0 calc(100vw*(10/428));
`
const ComIcon = styled.img`
    width: calc(100vw*(12/428));
    margin-top: calc(100vw*(4/428));
    margin-left: calc(100vw*(20/428));
    margin-right: calc(100vw*(10/428));
`
const Answer = styled.p`
    width: calc(100% - calc(100vw*(42/428)));
    font-size: calc(100vw*(15/428));
    line-height: 1.3;
`