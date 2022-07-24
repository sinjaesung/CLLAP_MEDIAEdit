import { useEffect,useState } from "react";

//css
import styled from "styled-components"

// component
import MainInfo from '../../component/main/MainInfo';
import Challenge from '../../component/main/Challenge';
import Creator from '../../component/main/Creator';
import RightNow from '../../component/main/RightNow';


export default function MainPage() {
   
   //const [state,setState]=useState({});
   //const [userdata,setuserdata] = useState(30);'

   useEffect(()=>{
    //console.log('페이지 로드 시점 실행!!!:::');

    document.addEventListener("message",async (event) =>{
        let test_data=JSON.parse(event.data);
        //alert(event.data);
        
        let type=test_data['type'];
        
        if(type=='logout'){
            //alert("로그아웃 요청이 있던경우 rn으로부터의메시지");
            window.location.href="https://teamspark.kr/";
            //window.location.href="http://192.168.25.20:3000/";
        }else if(type=='emaillogin'){
            //alert("이메일로그인 요청이있던경우 rn으로부터의메시지");
            window.location.href="https://teamspark.kr/";
            //window.location.href="http://192.168.25.20:3000/";
        }else if(type=='userOut'){
            //alert("회원탈퇴요청");
            window.location.href="https://teamspark.kr/";
            //window.location.href="http://192.168.25.20:3000/";
        }
       
        /*setStandbydata({
            music: ,
            musictransitiontype: "opencv"
        })*/
    });
   },[]);

    return (
        <Container>
            {/*
            <button onClick={()=>{
                window.ReactNativeWebView.postMessage(
                    "POST MESSAGE FROM WEB TO MOBILE","*"
                );
            }}>
                send mesage to react native(mobile)
            </button>
             <video src={state.msg}></video>*/}
            <MainInfo/>
            <SectionWrap>
                <Challenge/>
                <Creator/>
                <RightNow/>
            </SectionWrap>
        </Container>
    );
}

const Container = styled.div`
    width: 100%; min-height: 100vh;
    background: #DACFE0;
    /* iOS only */
    @supports (-webkit-touch-callout: none) { min-height: -webkit-fill-available; }
`
const SectionWrap = styled.div`
    background: #F4F4FC;
    margin-top: calc(100vw*(20/428));
    padding-bottom: calc(100vw*(100/428));
    border-radius: calc(100vw*(25/428)) calc(100vw*(25/428)) 0 0;
    box-shadow: 0 0 calc(100vw*(10/428)) 0 rgba(0, 0, 0, 0.16);
`