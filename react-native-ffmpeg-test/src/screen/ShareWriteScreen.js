import React, { useRef, useState,useEffect} from 'react';
import { Dimensions, BackHandler, Text, View, PermissionsAndroid, Platform, Linking } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native'
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';

import {ProgressModal} from "../progress_modal";

import RNKakaoTest from 'react-native-kakao-test';

export default function SaveScreen({navigation,route}){
    console.log('shareWritescreen 페이지도달::',navigation,route);
    //http://172.28.8.5:3000/edit/preview

    let video_result_final=route.params && route.params.video_result_final;//localPath,duration만 받습니다.(섬네일은 얻을방법이 제한됨)
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
      
        if(video){
            console.log('WEBVIEW에게 관련 필요한 데이터전달충족:<<s3 완료시점에 웹뷰보내기>>',video);
            console.log('webviewRef및 postmessag존재??:',webviewRef);

            webviewRef.current.postMessage(JSON.stringify({"video_result_final":video}))
        }
    };

    useEffect(()=>{
        setVideo(video_result_final);
    },[]);

    useEffect(async()=>{
    },[video]);
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
        if(data.type == "Rn_nextMove" ){
          navigation.navigate(
            "ShareWrite",
            {
              video_result_final:data.nextParam
            })
        }else if(data.type=='RN_RootMove'){
          navigation.navigate(
              "WebviewScreen",
          )
        }else if(data.type=='kakao_share'){
            console.log("===>webView카카오공유share하기 클릭액션발생 관련native액션발동");

            RNKakaoTest.link((result)=>{console.log('==>kakaoLink native link method call Resultsss:',result)});
        }
     }

     //deprecated..not used not use webviewlinking 
     const onShouldStartLoadWithRequest=(event)=>{
         console.log("React Native onShouldStartLoadwithReustss호출요청:",event.url);
        if(
         event.url.startsWith('http://') ||
         event.url.startsWith('https://') || 
         event.url.startsWith('about:blank')
        ){
            let SendIntentAndroid=require("react-native-send-intent");
            SendIntentAndroid.openAppWithUri(event.url)
            .then(isOpened=>{
                console.log('===>SendIntentAndroiss opencrhomintentsss:',isOpened);
                if(!isOpened){alert("앱 실행이 실패했습니다.");}
            })
            .catch(err=>{
                console.log("errosss shoulds tartlaodwithReustss:",err);
            });
            
            return false;
        }
        if(Platform.OS ==='android'){
            const SendIntentAndroid=require("react-native-send-intent");
            //SendIntentAndroid.openChromeIntent(event.url)
            SendIntentAndroid.openAppWithUri(event.url)
            .then(isOpened=>{
                console.log('===>SendIntentAndoridsss openChormmeIntentsss:',isOpened);
                if(!isOpened){alert("앱 실행이 실패했습니다.");}
            })
            .catch(err=>{
                console.log("errorsss shoudlstartloadwithRequestss:",err);
            });

            return false;
        }else{
            Linking.openURL(event.url)
            .catch(err=>{
                alert("앱 실행이 실패했습니다. 설치가 되어있지않은 경우 설치하기 버튼을눌러주세요");
            });
            return false;
        }
     };
    return ( 
        <>
        <ProgressModal
            visible={false}
            ref={progrssmodal}/>
       
        <WebView 
            onShouldStartLoadWithRequest={event=>{
                console.log('sharewrite페이지 관련 requestLoadUrlss요청발생');
                return onShouldStartLoadWithRequest(event);
            }}
            originWhitelist={['http://*','https://*','intent:kakaolink:*']}
            source={{ uri: `http://192.168.25.40:3000/share/write` }}
            ref={webviewRef}
            onLoadEnd={handleEndLoading}
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

