import { useState,useEffect } from "react";

//css
import styled from "styled-components"

//img
import iconPlay from "../../../img/icon/icon_play_btn.svg"

// component
import SaveVideo from '../../../component/camera/SaveVideo';
import LodingModal from '../../../component/modal/LodingModal';

//servercontroller
import serverController2 from '../../../server/serverController2';

export default function SavePage() {
    //console.log('===>SavePagess page도달:',location);
    //let standbydata=location.state && location.state.nextParameter; //datas,datastore,lloPc-0ount

    const [lodingModal, setLodingModal] = useState(false)

    /*async function load_script(){
        let remote_url_list=standbydata.remote_url_list;
        let take_video_process_info=standbydata.take_video_process_info;
        let music=standbydata.music;
        console.log('take_video_process_info',take_video_process_info);

        let request_id;

        let formdata=new FormData();
        console.log(remote_url_list.join(','),music);
        formdata.append('upload_list_data',remote_url_list.join(',')); 
        formdata.append('select_overlay',1);//쓰이지 않음.
        formdata.append('take_video_process_info',JSON.stringify(take_video_process_info));//원테이크인경우 수정편집정보가 undefined
        formdata.append('music',music);

        let res=await serverController2.connectFetchController('transition_and_effect_start','POST',formdata);
        if(res){
            console.log('처리결과:',res);

            request_id= res.request_id;

            let data_gathering=JSON.stringify(res.data_gathering);
            //request_id, data_gathering이것들도 추가로 addon보내줌.저장.

            standbydata['data_gathering'] = data_gathering;
            standbydata['request_id'] = request_id;

            console.log('====>>처리결과 확인 및 standvbydata addonsss:',standbydata);

            setstandbydataState(standbydata);
        }
    }*/
    //const [test_refer_data,setTest_refer_data]=useState([]);
    const [standbydata,setStandbydata] = useState();
    //const [CV,setCV] = useState({});
    useEffect(() => {
        console.log('savePage도달시점 onload시점:',global.cv);
       // setCV(global.cv);
        document.addEventListener("message",async(event)=>{
            let test_data=JSON.parse(event.data);
            alert(event.data);

            setStandbydata(test_data);//nextdatas,effect,overlayvideo
            
        })
    },[]);
    useEffect(()=>{
        console.log('==savePage반영 standbydatasss:',standbydata);
    },[])

    return (
        <>
            <SaveVideo setLodingModal={setLodingModal} standbydata={standbydata}/>
            {
                lodingModal &&
                <LodingModal/>
            }
        </>
    );
}
