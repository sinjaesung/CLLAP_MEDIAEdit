//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components";

import IconArrow from "../../img/icon/icon_arrow_back.svg"

import Icon_plus from "../../img/icon/icon_plus_background.svg"

import serverController from '../../server/serverController';

export default function LinkInfo() {
    const history = useHistory();

    const [firstRender, setFirstRender] = useState(true);
    const [dataArr, setDataArr] = useState([
        {type:"Facebook", link:"", active:0},
        {type:"Instagram", link:"", active:0},
        {type:"Kakaotalk", link:"", active:0},
        {type:"Twitter", link:"", active:0},
        {type:"기타", link:"", active:0},
    ])

    useEffect(() => {
        serverController.connectFetchController(`link`, 'GET', null, function(res) {
            if(res.result == 1){
                const data = res.link;
                let newArr = [
                    {type:"Facebook", link:data.link_fb, active:data.link_fb_active},
                    {type:"Instagram", link:data.link_insta, active:data.link_insta_active},
                    {type:"Kakaotalk", link:data.link_kakao, active:data.link_kakao_active},
                    {type:"Twitter", link:data.link_twitter, active:data.link_twitter_active},
                ];

                if(data.link_etc){
                    console.log(123);
                    let etcObjToArr = data.link_etc.split(",");
                    let etcAvtiveObjToArr = data.link_etc_active.split(",");
    
                    etcObjToArr.map((item, index) => {
                        newArr.push({
                            type:"기타",
                            link:item,
                            active:Number(etcAvtiveObjToArr[index])
                        })
                    })
                }else{
                    newArr.push({type:"기타", link:"", active:Number(data.link_etc_active)})
                }

                setDataArr([...newArr])
            }
        }, function(err) {console.log(err);})
    }, [])

    const onClickPlus = () => {
        let newArr = dataArr;
        newArr.push({type:"기타", link:"", active:0});
        setDataArr([...newArr])
    }

    // 링크 변경
    const onChangeLink = (e, index) => {
        let newArr = dataArr;
        newArr[index].link = e.target.value;
        setDataArr([...newArr])
    }

    // 링크 토글
    const onChangeCkBox = (isActive, type, index) => {
        let newArr = dataArr;
        newArr[index].active = isActive;
        setDataArr([...newArr]);
    }

    useEffect(() => {
        if(firstRender){
            setFirstRender(false);
            return;
        }
        let formData = new FormData();
        formData.append("link_fb", dataArr[0].link || "");
        formData.append("link_insta", dataArr[1].link || "");
        formData.append("link_kakao", dataArr[2].link || "");
        formData.append("link_twitter", dataArr[3].link || "");

        formData.append("link_fb_active", dataArr[0].active);
        formData.append("link_insta_active", dataArr[1].active);
        formData.append("link_kakao_active", dataArr[2].active);
        formData.append("link_twitter_active", dataArr[3].active);

        let etcArr = "";
        let etcActiveArr = "";
        dataArr.map(item => {
            if(item.type == "기타"){
                if(etcArr == ""){
                    etcArr = item.link;
                    etcActiveArr = String(item.active);
                }else{
                    etcArr = etcArr + "," + item.link;
                    etcActiveArr = etcActiveArr + "," + String(item.active);
                }
            }
        })
        
        formData.append("link_etc", etcArr || "");
        formData.append("link_etc_active", etcActiveArr || "");

        console.log(dataArr);
        console.log(etcArr)
        console.log(etcActiveArr)
        
        serverController.connectFetchController(`link/set`, 'POST', formData, function(res) {
        }, function(err) {console.log(err);})
    }, [dataArr])

    // 링크 변경 (서버통신)
    // const onBlurInput = (text, type) => {
    //     let formData = new FormData();
    //     formData.append("link_fb", dataArr[0].link || "");
    //     formData.append("link_insta", dataArr[1].link || "");
    //     formData.append("link_kakao", dataArr[2].link || "");
    //     formData.append("link_twitter", dataArr[3].link || "");

    //     formData.append("link_fb_active", dataArr[0].active);
    //     formData.append("link_insta_active", dataArr[1].active);
    //     formData.append("link_kakao_active", dataArr[2].active);
    //     formData.append("link_twitter_active", dataArr[3].active);

    //     let etcArr = "";
    //     let etcActiveArr = "";
    //     dataArr.map(item => {
    //         if(item.type == "기타"){
    //             if(etcArr == ""){
    //                 etcArr = item.link;
    //                 etcActiveArr = String(item.active);
    //             }else{
    //                 etcArr = etcArr + "," + item.link;
    //                 etcActiveArr = etcActiveArr + "," + String(item.active);
    //             }
    //         }
    //     })
    //     formData.append("link_etc", etcArr || "");
    //     serverController.connectFetchController(`link/set`, 'POST', formData, function(res) {
    //     }, function(err) {console.log(err);})
    // }







    return (
        <Container>

            <TitleWrap>
                <BackBtn src={IconArrow} alt="뒤로가기" onClick={() => history.goBack()}/>
                <Title>LINK INFO</Title>
                <div></div>
            </TitleWrap>

            <ContentGrid>
                {
                    dataArr.map((item, index) => {
                        return(
                            <URLContent>
                                <URLTitle key={index}>{item.type}</URLTitle>
                                <InputSwitch>
                                    <InputWrap>
                                        <SignUpInput value={item.link} onChange={e => onChangeLink(e, index)} errorOn={false} type="text" placeholder="SNS URL을 입력해주세요."/>
                                        {/* <SignUpInput value={item.link} onChange={e => onChangeLink(e, index)} onBlur={e => onBlurInput(e.target.value, item.type)} errorOn={false} type="text" placeholder="SNS URL을 입력해주세요."/> */}
                                    </InputWrap>
                                    <Switch>
                                        <SwitchInput type="checkbox" checked={item.active} onChange={e => onChangeCkBox(e.target.checked?1:0, item.type, index)}/>
                                        <SwitchSlider></SwitchSlider>
                                    </Switch>
                                </InputSwitch>
                            </URLContent>
                        )
                    })
                }
                <PlusIcon src={Icon_plus} onClick={onClickPlus}/>
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
`
const URLContent = styled.div`
    margin-top: calc(100vw*(21/428));
`
const URLTitle = styled.div`
    color: #A38DCC;
    font-size: calc(100vw*(15/428));
    font-weight: bold;
    margin-bottom: calc(100vw*(14/428));
`
const InputSwitch = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
`
const InputWrap = styled.div`
    position: relative;
    width: calc(100vw*(291/428));
    border-radius: calc(100vw*(27/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #f7f7ff;
    padding: calc(100vw*(4/428));
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
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


// checkbox
const Switch = styled.label`
    margin-left: calc(100vw*(22/428));
    position: relative;
    display: inline-block;
    width: calc(100vw*(57/428)); height: calc(100vw*(34/428));
    padding: calc(100vw*(4/428)) calc(100vw*(5/428));
    border-radius: calc(100vw*(34/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    background: #F7F7FF;
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(25/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.1);}
`
const SwitchInput = styled.input`
    opacity: 0;
    width: 0; height: 0;
    &:checked + span {
        background-color: #F7F7FF;
        border: 1px solid #9F8EC8;
    }
    &:checked + span::before {
        content: "";
        color: #ed2939;
        background-color: #A38DCC;
        text-indent: calc(100vw*(-25/428));
        transform: translateX(calc(100vw*(18/428)));
    }
`
const SwitchSlider = styled.span`
    position: absolute; top: calc(100vw*(4/428)); left: calc(100vw*(5/428)); right: 0; bottom: 0;
    width: calc(100vw*(42/428)); height: calc(100vw*(22/428));
    border: 1px solid #9F8EC8;
    border-radius: calc(100vw*(34/428));
    transition: .4s;
    &::before {
        content: "";
        color: #000;
        font-size: calc(100vw*(15/428)); font-weight: bold;
        text-indent: calc(100vw*(24/428));
        position: absolute; left: calc(100vw*(3/428)); bottom: calc(100vw*(2/428));
        width: calc(100vw*(16/428)); height: calc(100vw*(16/428));
        background-color: #D6CDD9; 
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
        box-sizing: border-box;
        box-shadow: inset 0 0 calc(100vw*(3/428)) 0 rgba(87, 62, 62, 0.2);
    }
`
const PlusIcon = styled.img`
    margin-top: calc(100vw*(60/428));
    width: calc(100vw*(37/428)); height: calc(100vw*(37/428));
`