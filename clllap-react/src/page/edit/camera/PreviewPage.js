import { useState,useEffect ,useRef} from "react";

//css
import styled from "styled-components"

//img
import iconPlay from "../../../img/icon/icon_play_btn.svg"

// component
import CameraDefault from '../../../component/camera/CameraDefault';
import LodingModal from '../../../component/modal/LodingModal';

import serverController from '../../../server/serverController';

import { useSelector } from 'react-redux';

export default function PreviewPage() {

    const [nextpossible,setnextpossible] = useState(false);
    const [videosrc,setvideosrc] = useState("https://clllap.s3.ap-northeast-2.amazonaws.com/clllap/Gfj5lYCMX53gFAyhUp5D_finalOutput.mp4");

    const [standbydatas,setStandbydatas]=useState({});
    const [nextdatas,setNextdatas] = useState({});//처리된 트랜지션,음악,병합 관련 파일.
    const [lodingModal, setLodingModal] = useState(false);
    const [alreadyReceive,setalreadyReceive]=useState(false);

    const userData = useSelector(store => store.userData.userData);
    
    //let standbydata=location.state.nextParameter; //datas,datastore,lloPc-0ount

    const [test_refer_data,setTest_refer_data]=useState([]);
    useEffect(() => {
        //console.log('===페이지 로드시점 확인됨:',global.cv);
        document.addEventListener("message",async(event)=>{
            let test_data=JSON.parse(event.data);
           // alert(event.data);

            setStandbydatas(test_data);
           // setalreadyReceive(true);
        })

    },[]);
    useEffect(async()=>{
        console.log('stadnbydatasss:',standbydatas);

        //alert(JSON.stringify(standbydatas)+",alreadyRecivess:"+alreadyReceive);

        if(alreadyReceive){
            return false;//이미 서버에 요청 한번했다면 true상태일터이고, 이때는 더이상 보내지않음.한번만보냄.
        }

        //return false;

        //alert('stnadbysatsss'+JSON.stringify(standbydatas));
        //alert('effectDatsss:'+JSON.stringify(standbydatas['effect']));
        let music=standbydatas['music'];
        let effect=standbydatas['effect'];
        let musictransitiontype=standbydatas['selecttransition'];
        //let musictransitiontype='opencv';
        var takeedit_video_list=standbydatas['takeedit_video_list'];
        var memid=standbydatas['memid'];
        //let common_timebase=standbydatas['common_timebase'];//takeedit videolist 비디오들의 통일화된 일관화된 timebase값
       // setTest_refer_data(takeedit_video_list);
        
        if(music && musictransitiontype && takeedit_video_list && takeedit_video_list.length>=1){
            setalreadyReceive(true);

            let formdata=new FormData();
           // formdata.append('user_id',userData.user_id ? userData.user_id : 30);
            formdata.append("user_id",memid);
            formdata.append('edittake_videolist',takeedit_video_list&& takeedit_video_list.join(','));
            formdata.append('music',music);
            formdata.append('select_overlay',1);
            formdata.append('select_filter','canny');
            formdata.append('transition_type',musictransitiontype);
            formdata.append('effect',effect);
            setLodingModal(true);

            //formdata.append("common_timebase",common_timebase);

            let iscompleted=false;
            let res= serverController.connectFetchController('media/videomake','POST',formdata,function(res){
                if(res){
                    setalreadyReceive(true)
                    
                    console.log('====>>처리결과::',res);
    
                    setLodingModal(false);
                    
                    setvideosrc(res.video_result_final);
                    let next_data={
    
                    };
                    next_data['video_result_final']=res.video_result_final;
                    next_data['video_result']=res.video_result;
                    next_data['effect']=effect;//json문자열을 보낸다.어떤이펙트부여할건지.
                    next_data['music']=music;
                    next_data['result']=res.result;//처리media_id값으로 추정.
                    setNextdatas(next_data);
                    setnextpossible(true);
                    iscompleted=true;
                }
            });
            let standby_cnt=0;
            let effectprocess_standby=setInterval(function(){

                if(standby_cnt==70){
                    //70초가 넘었는데도 반응없다면!

                    if(iscompleted==false){
                        setLodingModal(false);
                        alert('처리에 지연이 있는것같습니다. 이전페이지로 복귀후 다시 시도해주세요');
                    }

                    //alert("70초 특정시간 경과amount시에 interval자원해제!");
                    clearInterval(effectprocess_standby);
                    return false;
                }
                standby_cnt++;

            },1000);//1초
        }
        //alert(standbydatas['effect']);
    },[standbydatas]);
    useEffect(()=>{
        //alert("VIDEO REUSLTS FINALSSS:"+videosrc);
    },[videosrc])
    
    return (
        <>
            <CameraDefault title={'Preview'} prev={true} next={'/edit/save'} nextParameter={nextdatas} nextPossible={nextpossible} camera={false}>
                <VideoWrap on={!LodingModal}>
                    <VideoPreview src={videosrc} crossOrigin={"true"} controls ></VideoPreview >
                   
                </VideoWrap>
                
            </CameraDefault>
            {
                lodingModal &&
                <LodingModal/>
            }
        </>
    );
}

const VideoWrap = styled.div`
    width:100%;height:100%;position:relative;
`
const LogTest = styled.div`
    width:100%;height:auto;overflow:hidden;text-overflow:wrap;white-space:normal;word-break:break-word;
`
const VideoPreview = styled.video`
    width: 100%;height:100%;position:absolute;left:0;top:0;

`
