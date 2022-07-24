import React, { useRef, useState,useEffect} from 'react';
import { Dimensions, BackHandler, Text, View, PermissionsAndroid } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native'
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';

import {ProgressModal} from "../progress_modal";

export default function SaveScreen({navigation,route}){
    console.log('shareScreen 페이지도달::',navigation,route);
    //http://172.28.8.5:3000/edit/preview

    let nextdatas=route.params && route.params.nextdatas;//localPath,duration만 받습니다.(섬네일은 얻을방법이 제한됨)

    const webviewRef=useRef();

    //const [selectmusic,setSelectmusic]= useState(0);
   // const [cuttakelist,setCuttakelist]= useState([]);
    //const [memid,setmemid] = useState(30);
    //const [s3uploadList,setS3uploadList] = useState([]);
    const [webviewisload,setwebviewisload] =useState(false);
    const [video,setVideo] = useState("");

    /*const handleSetRef = _ref => {
      webviewRef = _ref;
    };*/
    const handleEndLoading= async(e)=>{
      console.log("handleEndLoading(Webview Loaded)");
      //webviewRef.postMessage("FROM APPCONTAINER message");
      setwebviewisload(true);
      
        console.log('WEBVIEW에게 관련 필요한 데이터전달충족:<<s3 완료시점에 웹뷰보내기>>',video);
        console.log('webviewRef및 postmessag존재??:',webviewRef,nextdatas);

        webviewRef.current.postMessage(JSON.stringify({"video_result_final":nextdatas['video_result_final']}))
    
    };

    useEffect(()=>{
        //setVideo(nextdatas['video_result_final']);
    },[]);

    //useEffect(async()=>{
    //},[video]);
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
      if(data.type == "RN_nextMove" ){
        navigation.navigate(
          "ShareWrite",
          {
            video_result_final:data.nextParam
          })
      }else if(data.type=='RN_RootMove'){
        navigation.navigate(
            "WebviewScreen",
        )
      }
   }

    return ( 
        <>
        <ProgressModal
            visible={false}
            ref={progrssmodal}/>
       
        <WebView 
            source={{ uri: `http://192.168.25.40:3000/share` }}
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

