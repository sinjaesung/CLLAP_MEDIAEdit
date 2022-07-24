//react
import { useEffect, useState, useRef } from "react";
import { Link,useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

//css
import 'swiper/swiper-bundle.css';
import styled from "styled-components"

//img
import ChallengeImg1 from "../../img/img/challenge_img1.jpg"
import ChallengeImg2 from "../../img/img/challenge_img2.jpg"
import ChallengeImg3 from "../../img/img/challenge_img3.jpg"

import serverController from "../../server/serverController";

export default function Challenge() {
    const [filterIndex, setFilterIndex] = useState(0)

    const [challengeList, setChallengeList] = useState([
        {src: ChallengeImg1, media_title: 'filter_1', text: 'Clara mae'},
        {src: ChallengeImg2, media_title: 'filter_1', text: 'Clara mae'},
        {src: ChallengeImg3, media_title: 'filter_1', text: 'Clara mae'}
    ]);

    useEffect(() => {
        serverController.connectFetchController(`media/list?category=${filterIndex==0?"popular":"recent"}`, 'GET', null, async function(res) {
            console.log(res);
            if(res.result == 1){

                let media_list=res.media_list;
                setChallengeList(media_list);

                /*let update_object=[];
                let load_cnt=0;

                if(media_list){
                    for(let r=0; r<media_list.length; r++){
                        (function(index){
                            let remote_url=media_list[index]['media_source_path'];
                            console.log('remote_url',remote_url);
                            let xml_request=new XMLHttpRequest();
                            xml_request.open('GET',remote_url,true);
                            xml_request.responseType='blob';
                            xml_request.onreadystatechange=async function(oEvent){
                                if(xml_request.readyState===xml_request.DONE){
                                    if(xml_request.status===200){
                                        let resss=xml_request.response;
                                        console.log('ressss:',resss);
                                        let blob=new Blob([xml_request.response],{type:'video/mp4'});
                                        let url=URL.createObjectURL(blob);

                                        let video_element=document.createElement('VIDEO');
                                        video_element.src=url;
                                        video_element.load();

                                        video_element.onloadeddata=function(event){
                                            let duration=Math.round(parseFloat(event.target.duration));

                                            let uploadvideo_store={};
                                            uploadvideo_store['remote_src']=media_list[index];
                                            uploadvideo_store['src'] = url;
                                            uploadvideo_store['object']=video_element;
                                            uploadvideo_store['time'] = duration;
                                            uploadvideo_store['id'] = load_cnt+1;
                                            update_object.push(uploadvideo_store);

                                            load_cnt++;
                                        }
                                    }
                                }
                            }
                            xml_request.send();
                        }(r));
                    }
                }
                function load_standby(){
                    return new Promise((resolve,reject)=>{
                        let standby_cnt=0;
                        let standby_interval=setInterval(function(){
                            if(media_list && (load_cnt==media_list.length)){
                                clearInterval(standby_interval);
                                resolve(true);
                            }
                            if(standby_cnt==1500){
                                clearInterval(standby_interval);
                                resolve(false);
                            }
                            standby_cnt++;
                        },100)
                    });
                }
                let standby_result=await load_standby();
                console.log('반영 update_object:',update_object);
               // setChallengeList([...res.media_list])
               setChallengeList(update_object);
                // 이미지 없음
                // 작가 없음*/
            }
        }, function(err) {console.log(err);})
    }, [filterIndex])

    return (
        <Container>
            <TitleWrap>
                <Title>Challenge</Title>
                <FilterList>
                    <Filter on={filterIndex == 0} onClick={()=>{setFilterIndex(0)}}>인기순</Filter>
                    <Line>|</Line>
                    <Filter  on={filterIndex == 1} onClick={()=>{setFilterIndex(1)}}>최신순</Filter>
                </FilterList>
            </TitleWrap>
            <ChallengeSlide className="ChallengeSlide">
                {
                    challengeList.length > 0 ?
                    <Swiper
                        slidesPerView={1.4}
                        pagination={{ clickable: true }}
                    >
                        {
                            challengeList.map((value,index)=>{
                                return (
                                    <SwiperSlide key={index + "challengeList"}>
                                        <ChallengeBox>
                                            <ChallengeImgWrap>
                                                <ChallengeVideo src={value.media_source_path}  autobuffer preload="auto"  controls></ChallengeVideo>
                                            </ChallengeImgWrap>
                                            <ChallengeTitleWrap>
                                                <ChallengeTitle>{value.media_title&&value.media_title}</ChallengeTitle>
                                                <ChallengeText>{value.user_nickname&&value.user_nickname}</ChallengeText>
                                            </ChallengeTitleWrap>
                                        </ChallengeBox>
                                    </SwiperSlide>
                                )
                            })
                        }
                    </Swiper>
                    :
                    null
                }
            </ChallengeSlide>
        </Container>
    );
}



const Container = styled.div`
    width: 100%;
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
const ChallengeSlide = styled.div`
    width: 100%;
`
const ChallengeBox = styled.div`
    width: 100%;
    height:auto;
    padding: calc(100vw*(7/428));
`
const ChallengeImgWrap = styled.div`
    position: relative;
    width: 100%;height: calc( calc(100vw*10/14) * 12 / 9);
    padding: 0 calc(100vw*(5/428));
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    box-shadow: calc(100vw*(-6/428)) calc(100vw*(-6/428)) calc(100vw*(10/428)) 0 #fff;
    background-color: #F2F2FC;
    border-radius: calc(100vw*(15/428));
    cursor: pointer;
    /*&:after {content: ''; position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%;
        border-radius: calc(100vw*(15/428)); box-shadow: calc(100vw*(3/428)) calc(100vw*(3/428)) calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.08);}*/
`
const ChallengeImg = styled.img`
    width: 100%; height:auto;
    border-radius: calc(100vw*(15/428));
`
const ChallengeVideo = styled.video`
    width: 100%;height:100%;
`

const ChallengeTitleWrap = styled.div`
    width: 100%;
    padding: calc(100vw*(16/428)) calc(100vw*(10/428)) 0;
`
const ChallengeTitle = styled.p`
    font-size: calc(100vw*(16/428));line-height:calc(100vw * (22/428));height:calc(100vw * (22/428));
    font-weight: bold; overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    color: #000;
`
const ChallengeText = styled.p`
    font-size: calc(100vw*(12/428));line-height:calc(100vw * (18 / 428));height:calc(100vw * (18 / 428));
    font-weight: bold; overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    color: #A2A2A2;
    margin-top: calc(100vw*(6/428));
`