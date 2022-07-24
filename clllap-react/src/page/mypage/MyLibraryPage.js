import { useState,useEffect } from "react";

//css
import styled from "styled-components"

//img
import LibraryImg1 from "../../img/img/challenge_img1.jpg"
import LibraryImg2 from "../../img/img/challenge_img2.jpg"
import LibraryImg3 from "../../img/img/challenge_img3.jpg"

// component
import LibraryInfo from '../../component/edit/library/LibraryInfo';
import LibraryList from '../../component/edit/library/LibraryList';
import VideoModal from '../../component/modal/VideoModal';

import serverController from '../../server/serverController';

export default function LibraryPage() {
    const [tabIndex, setTabIndex] = useState(0)
    const [videoModalState, setVideoModalState] = useState(false);

    const [librarylist,setlibrarylist] =useState([
        
    ]);
    const [chklist,setchklist] = useState([]);

    async function src_load(){
        //let result=await serverController.connectFetchController(`media?makevideo`,'GET',null);
        let result=await serverController.connectFetchController(`media/userper_list`,'GET',null);
        //let result=await serverController.connectFetchController(`media/userper_listTotal`,'GET',null);
        if(result){
            console.log('관련 결과 resultsss:',result);

            let result_data= result.media_list;

            setlibrarylist(result_data);
        
        } 
    }

    useEffect(()=>{
        console.log('=>>라이브러리 페이지 도달시점 실행::: 유저별 인코딩(비디오)업로드 비디오를 불러와야합니다.');
        src_load();
    },[]);

    return (
        <Container>
            <LibraryInfo title={'마이 비디오'} tabIndex={tabIndex} setTabIndex={setTabIndex}/>
            <LibraryList check={false} setchklist={setchklist} chklist={chklist}librarylist={librarylist} setVideoModalState={setVideoModalState}/>
            {
                /*videoModalState &&
                <VideoModal setVideoModalState={setVideoModalState}/>*/
            }
        </Container>
    );
}

const Container = styled.div`
    width: 100%; min-height: 100vh;
    background: #DACFE0;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`