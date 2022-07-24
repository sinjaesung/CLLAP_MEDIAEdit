import React, { useRef, useState,useEffect} from 'react';
import { Dimensions, BackHandler, Text, View, PermissionsAndroid } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native'
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';

import {ProgressModal} from "../progress_modal";

export default function PreviewProcessScreen({navigation,route}){
    console.log('PreviewProcessScreen 페이지도달::',navigation,route);
    //http://172.28.8.5:3000/edit/preview

    let selectmusics= route.params && route.params.select_music;
    let selecteffects= route.params && route.params.select_effect;
    let select_transition=route.params&& route.params.select_transition;
    let cuttakelists=route.params && route.params.cuttakelist;//localPath,duration만 받습니다.(섬네일은 얻을방법이 제한됨)
    let mem_id=route.params && route.params.mem_id;
    const webviewRef=useRef();

    const [selectmusic,setSelectmusic]= useState(0);
    const [selecteffect,setSelecteffect] = useState("");
    const [selecttransition,setSelecttransition] = useState("");
    const [cuttakelist,setCuttakelist]= useState([]);
    const [memid,setmemid] = useState(30);
    const [s3uploadList,setS3uploadList] = useState([]);
    const [webviewisload,setwebviewisload] =useState(false);

    /*const handleSetRef = _ref => {
      webviewRef = _ref;
    };*/
    const handleEndLoading= async(e)=>{
      console.log("handleEndLoading(Webview Loaded)");
      //webviewRef.postMessage("FROM APPCONTAINER message");
      console.log('webview로딩 시점에 s3_upload_list확인된경우:',s3uploadList);
      setwebviewisload(true);
      
        if(s3uploadList && s3uploadList.length>=1){
            console.log('WEBVIEW에게 관련 필요한 데이터전달충족:<<s3모두 완료시점에 웹뷰보내기>>',selectmusic,selecteffect,s3uploadList,memid,selecttransition);
            console.log('webviewRef및 postmessag존재??:',webviewRef);

            webviewRef.current.postMessage(JSON.stringify({"music":selectmusic, "effect":selecteffect,"takeedit_video_list":s3uploadList,"memid":memid,"selecttransition":selecttransition}))
        }
    };

    useEffect(()=>{
        setSelectmusic(selectmusics);
        setSelecteffect(selecteffects);
        setSelecttransition(select_transition)
        setCuttakelist(cuttakelists);
        setmemid(mem_id);
    },[]);

    useEffect(async()=>{

        showProgressDialog();
        console.log('확인된 데이터:',selectmusic,cuttakelist,memid,selecteffect,selecttransition);

        //let file_list=[];
        let upload_url="https://teamspark.kr:8087/media/regist";

        let s3_upload_list=[];
        if(cuttakelist.length>=1 && cuttakelists.length>=1){
            for(let c=0; c<cuttakelist.length; c++){
                let store={};
                store['name']=`videotake`;
                store['filename']=`videotakesss${c+1}.mp4`;//임의지정네임. 잘려진 분할컷팅비디오파일.
                store['filepath']=cuttakelist[c]['filepath'];
                store['filetype']='video/mp4';
    
                //file_list.push(store);
                let files=[];
                files[0]=store;
    
                console.log('업로드대상 파일리스트(로컬파일)-==>>s3 uplaodss',files);
                (function(c){
                    console.log('===>>업로드요청한 순서대로 파일리스트가 담겨야한다:',c);
                    RNFS.uploadFiles({
                        toUrl: upload_url,
                        files: files,
                        method:'POST',
                        headers:{
                            'Accept':'application/json'
                        },
                        fields:{
                            'user_id' : String(memid)
                        }
                    }).promise.then((response)=>{
                        if(response.statusCode==200){
                            console.log('file upload reusltsss:',response,response.json);
                            let response_body=response.body;
                            response_body=JSON.parse(response_body);
                            console.log('response_bodyss:',response_body);
                            let body_result=response_body.result;
                            console.log('body uploadreulstss:',body_result);
                            console.log('===>요청파일업로드완료,cutTakelist c참조index값:',c,cuttakelist[c]);
                           // s3_upload_list.push(body_result);
                           s3_upload_list[c]=body_result;
                        }else{
                            console.log('server errosss:');
                        }
                    }).catch((err)=>{
                        console.log('upload errosss:',err);
                    })
                })(c);
                
            }
            
            function promise_function_standby(){
                return new Promise((resolve,reject)=>{
                    let callback_timeout=0;
                    let callback_standby= setInterval(function(){
                        //console.log("===>s3 uploadlistss<uploadlist standby>>:<<isWebview loaded>>",s3_upload_list,webviewisload);
                        if((s3_upload_list.length == cuttakelists.length)){
                            let valid_cnt=0;
                            for(let s=0; s<s3_upload_list.length; s++){
                                if(s3_upload_list[s]&&s3_upload_list[s]!=""){
                                    valid_cnt++;
                                }
                            }
                            if(valid_cnt == cuttakelists.length){
                                clearInterval(callback_standby);
    
                                resolve(true);
                            }
                           
                        }
                        if(callback_timeout==8000){
                            clearInterval(callback_standby);
                            reject(new Error("callback timeout error"));
                        }
                        callback_timeout++
                    },500);
                })
            }
            try{
                let result=await promise_function_standby();
                hideProgressDialog();
                console.log('standby uplaod resultsss: ',result);
                if(result){
                    console.log('UPLOAD SUCCESSS ALL드',s3_upload_list);
    
                    setS3uploadList(s3_upload_list);
                    console.log('webviewRef존재:>>업로드완료후 보낼준비 웹뷰로',webviewRef);
                    if(s3_upload_list && s3_upload_list.length>=1){
                        console.log('WEBVIEW에게 관련 필요한 데이터전달충족:<<s3모두 완료시점에 웹뷰보내기>>',selectmusic,memid,selecteffect,selecttransition,s3_upload_list);
                        console.log('webviewRef및 postmessag존재??:',webviewRef);
    
                        webviewRef.current.postMessage(JSON.stringify({"music":selectmusic,"effect":selecteffect, "takeedit_video_list":s3_upload_list,"memid":memid,"selecttransition":selecttransition}))
                    }
                }
            }catch(error){
                console.log(' errosss incurriosss:',error);
            }
        }
        
    //},[selectmusic,cuttakelist,selecteffect,selecttransition]);
    },[cuttakelist]);

    useEffect(()=>{
        console.log('webview isload',webviewisload);
    },[webviewisload])

    //처리모달관련
    let progrssmodal=useRef();
    const hideProgressDialog=()=>{
        progrssmodal.current.hide();
    };
    const showProgressDialog=()=> {
    // CLEAN STATISTICS
        progrssmodal.current.show(`Upload processing...`);
    }

    function  onMessage( event ){
      console.log('webview로부터 전달받은 데이터:',event.nativeEvent.data);
      let data = JSON.parse(event.nativeEvent.data);
      //if(data.type == "CAMERA" || data.type == "GALLERY" ){
        navigation.navigate(
          "SAVE",
          {
            nextdatas:data.nextParam,//effect,videoresult,music등등.
           // effect:data.nextParam_addon[0],
            //overlayvideo: data.nextParam_addon[1]
          })
      //}
   }

    return ( 
        <>
        <ProgressModal
            visible={false}
            ref={progrssmodal}/>
       
        <WebView 
            source={{ uri: `http://192.168.25.40:3000/preview` }}
            ref={webviewRef}
            onLoadEnd={handleEndLoading}
            originWhitelist={['*']}
            onMessage={event => onMessage(event)}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            javaScriptEnabled={true}
            injectedJavaScript={""}
            scalesPageToFit={true}
            mixedContentMode="compatibility"
         />
         </>
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

