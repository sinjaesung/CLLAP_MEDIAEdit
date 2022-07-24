//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

//css
import 'swiper/swiper-bundle.css';
import styled from "styled-components"

//img
import CreatorImg1 from "../../img/img/creator_img1.jpg"
import CreatorImg2 from "../../img/img/creator_img2.jpg"
import CreatorImg3 from "../../img/img/creator_img3.jpg"

//server
import serverController from "../../server/serverController";

export default function Creator() {
    const [filterIndex, setFilterIndex] = useState(0)

    const [creatorList , setCreaterList] = useState([
        {src: CreatorImg1, title: 'Tanya_143'},
        {src: CreatorImg2, title: 'sean_Kong'},
        {src: CreatorImg3, title: 'david_sugg'}
    ]);
  
    useEffect(() => {
        serverController.connectFetchController(`user/list?category=${filterIndex==0?"popular":"recent"}`, 'GET', null, function(res) {
            console.log(res);
            if(res.result == 1){

                console.log('res userlist:',res.user_list);
                setCreaterList([...res.user_list])
                // 이미지 없음
                // 작가 없음
            }
        }, function(err) {console.log(err);})
    }, [filterIndex])


    return (
        <Container>
            <TitleWrap>
                <Title>Creator</Title>
                <FilterList>
                    <Filter on={filterIndex == 0} onClick={()=>{setFilterIndex(0)}}>인기순</Filter>
                    <Line>|</Line>
                    <Filter  on={filterIndex == 1} onClick={()=>{setFilterIndex(1)}}>최신순</Filter>
                </FilterList>
            </TitleWrap>
            <CreatorSlide className="CreatorSlide">
                {
                    creatorList.length > 0 ?
                    <Swiper
                        spaceBetween={8}
                        slidesPerView={2.6}
                        pagination={{ clickable: true }}
                    >
                        {
                            creatorList.map((value,index)=>{
                                console.log('value niciknames:',value.user_nickname);
                                return (
                                    value.user_nickname && 
                                    <SwiperSlide key={index + "CreatorList"}>
                                        <CreatorBox>
                                            <CreatorImgWrap>
                                                <CreatorImg src={CreatorImg2} alt="Creator image" />
                                            </CreatorImgWrap>
                                            <CreatorTitleWrap>
                                                <CreatorTitle>{value.user_nickname}</CreatorTitle>
                                            </CreatorTitleWrap>
                                        </CreatorBox>
                                    </SwiperSlide>
                                    
                                )
                            })
                        }
                    </Swiper>
                    :
                    null
                }
            </CreatorSlide>
        </Container>
    );
}



const Container = styled.div`
    width: 100%;
    margin-top: calc(100vw*(25/428));
`
const TitleWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: calc(100vw*(22/428)) calc(100vw*(26/428));
`
const Title = styled.h3`
    font-size: calc(100vw*(18/428));
    font-weight: bold;
    color: #39394A;
    text-transform: uppercase;
`
const FilterList = styled.div`
    display: flex;
    align-items: center;
`
const Filter = styled.p`
    font-size: calc(100vw*(14/428));
    font-weight: bold;
    cursor: pointer;
    ${({on})=>{
        return on ?
        `color: #39394A;`
        :
        `color: #B1B1BA;`
    }}
`
const Line = styled.span`
    font-size: calc(100vw*(12/428));
    color: #C9C1EA;
    margin: 0 calc(100vw*(8/428));
`
const CreatorSlide = styled.div`
    width: 100%;
`
const CreatorBox = styled.div`
    width: 100%;
    padding: calc(100vw*(7/428));
`
const CreatorImgWrap = styled.div`
    position: relative;
    width: 100%;
    padding: calc(100vw*(5/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #F2F2FC;
    border-radius: 50%;
    cursor: pointer;
    &:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: 50%; box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}
`
const CreatorImg = styled.img`
    width: 100%;
    border-radius: 50%;
`
const CreatorTitleWrap = styled.div`
    width: 100%;
    padding: calc(100vw*(16/428)) calc(100vw*(10/428)) 0;
`
const CreatorTitle = styled.p`
    font-size: calc(100vw*(16/428));
    font-weight: bold; text-align:center;
    color: #000;
`
const CreatorText = styled.p`
    font-size: calc(100vw*(12/428));
    font-weight: bold;
    color: #A2A2A2;
    margin-top: calc(100vw*(6/428));
`