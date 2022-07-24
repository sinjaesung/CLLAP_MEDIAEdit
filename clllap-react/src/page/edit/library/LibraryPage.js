import { useState,useEffect } from "react";
import { Link,useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import LibraryImg1 from "../../../img/img/challenge_img1.jpg"
import LibraryImg2 from "../../../img/img/challenge_img2.jpg"
import LibraryImg3 from "../../../img/img/challenge_img3.jpg"

// component
import LibraryInfo from '../../../component/edit/library/LibraryInfo';
import LibraryList from '../../../component/edit/library/LibraryList';

import serverController from '../../../server/serverController';

import { useSelector } from 'react-redux';

export default function LibraryPage() {
    const history=useHistory();
    const userData = useSelector(store => store.userData.userData);

    /*if( !(userData.user_id && userData.username)){
        alert("로그인 후 이용해주세요.");
        history.push('/login');
    }*/
    
    const [tabIndex, setTabIndex] = useState(0)

    //임의 로그인 유저memid의 업로드&인코딩 촬영 비디오파일들 리스트를 불러와야합니다.
    const [librarylist,setlibrarylist] = useState([]);
    const [librarybloblist,setlibrarybloblist] = useState([]);//업로드 라이브러리비디오 bloburlist
    const [chklist,setchklist] = useState([]);
    const libraryList = [
       
        {src: LibraryImg3, time: '00:00'},
        {src: LibraryImg1, time: '00:00'},
        {src: LibraryImg2, time: '00:00'},
        {src: LibraryImg3, time: '00:00'},
        {src: LibraryImg1, time: '00:00'},
        {src: LibraryImg2, time: '00:00'},
        {src: LibraryImg3, time: '00:00'},
        {src: LibraryImg1, time: '00:00'},
        {src: LibraryImg2, time: '00:00'},
        {src: LibraryImg3, time: '00:00'},
        {src: LibraryImg1, time: '00:00'},
        {src: LibraryImg2, time: '00:00'},
        {src: LibraryImg3, time: '00:00'},
        {src: LibraryImg1, time: '00:00'},
        {src: LibraryImg2, time: '00:00'},
        {src: LibraryImg3, time: '00:00'}
    ]

    const chkList = [
        {src: LibraryImg1, time: '00:00'},
      
    ]

    async function src_load(){
        //let result_data=['https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/EZRrgAqzfAFYYu1CcNkF_encoded2.mp4','https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/EZRrgAqzfAFYYu1CcNkF_encoded2.mp4'];
        //let result_data=[`https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/J6sZgojcSq4cbfJrEUGb_encoded1.mp4`,`https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/J6sZgojcSq4cbfJrEUGb_encoded2.mp4`,`https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/2RPJza8qnla3yLWQ7d57_encoded1.mp4`,`https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/2RPJza8qnla3yLWQ7d57_encoded2.mp4`,`https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/encodingvideoqGPDrmyILZ5sMypIRluB_encoded1.mp4`];

        let result=await serverController.connectFetchController(`media/userper_list`,'GET',null);
        if(result){
            console.log('관련 결과 resultsss:',result);

            let result_data= result.media_list;
            setlibrarylist(result_data);

            /*let update_object=[];
            let load_cnt=0;

            if(result_data){
                for(let r=0; r<result_data.length; r++){

                    (function(index){
                        console.log('===>실행:::',index);
                        let remote_url = result_data[index]['media_source_path'];
                        console.log('remote_url:',remote_url);
                        let xml_request=new XMLHttpRequest();
                        xml_request.open('GET',remote_url,true);
                        xml_request.responseType='blob';
                        xml_request.onreadystatechange = async function(oEvent){
                            console.log('upload video files remote url loaded xml reuqet sreadystaess:',xml_request.readyState,index,result_data[index]);
            
                            if(xml_request.readyState===xml_request.DONE){
                                if(xml_request.status===200){
                                    let resss=xml_request.response;
                                    console.log('ressss:',resss);
                                    let blob=new Blob([xml_request.response],{type:'video/mp4'});
                                    let url=URL.createObjectURL(blob);
                                      
                                    let video_element=document.createElement('VIDEO');
                                    video_element.src= url;
                                    video_element.load();
                                    
                                    video_element.onloadeddata= function(event){
                                        console.log('타깃비디오 모드 로드시점에 실행:',event.target,event.target.duration);
            
                                        let duration=Math.round(parseFloat(event.target.duration));
            
                                        let uploadvideo_store={};
                                        uploadvideo_store['blobsrc'] = url;
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
            
            function load_standby (){
                return new Promise((resolve,reject)=>{

                    let standby_cnt=0;
                    let stanby_interval=setInterval(function(){

                        if(result_data && (load_cnt == result_data.length)){
                            clearInterval(stanby_interval);
                            resolve(true);
                        }
                        if(standby_cnt==1500){
                            clearInterval(stanby_interval);
                            reject(false);
                        }
                        standby_cnt++;
                    },150);

                });
            }
            let standby_result=await load_standby();
            if(standby_result){
                console.log('====>대기완료=======');
                setlibrarybloblist(update_object);
            }*/
        }
        
    }

    useEffect(()=>{
        console.log('=>>라이브러리 페이지 도달시점 실행::: 유저별 인코딩(비디오)업로드 비디오를 불러와야합니다.');
        src_load();
    },[]);
    useEffect(()=>{
        console.log('chklist변화:',chklist);
    },[chklist]);
    useEffect(()=>{
        console.log('librarylist:',librarylist);
    },[librarylist]);
    
    return (
        <Container>
            <LibraryInfo title={'Library'} tabIndex={tabIndex} setTabIndex={setTabIndex}/>
            <LibraryList srcload={src_load}check={true} librarybloblist={librarybloblist} librarylist={librarylist} setchklist={setchklist} chklist={chklist}/>
        </Container>
    );
}

const Container = styled.div`
    width: 100%; min-height: 100vh;
    background: #DACFE0;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`