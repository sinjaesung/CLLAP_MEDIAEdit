import React, { useEffect, useRef, useState} from 'react';
import { Dimensions, BackHandler, Text, View, PermissionsAndroid } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native'
import WebView from 'react-native-webview';


export default function MusicSelect({navigation,route}){

    console.log('MUSIC SELECT페이지도달 전달데이터:',route);
    let s3upload_url_datagatherings=route.params && route.params.s3upload_url_datagatherings;
    let webviewRef=useRef();

    const [s3uploadurl_datagatherings,sets3uploadurl_datagatherings]=useState([]);

    const handleSetRef = _ref => {
      webviewRef = _ref;
    };
    const handleEndLoading= e=>{
      console.log("MUSIC SELECT WEBVIEW handleEndLoading");

      if(s3uploadurl_datagatherings && s3uploadurl_datagatherings.length>=1){
        console.log('WEBVIEW에게 관련 필요 데이터 전달충족:',JSON.stringify({"s3_url_data":s3uploadurl_datagatherings}));
        webviewRef.postMessage(JSON.stringify({"s3_url_data":s3uploadurl_datagatherings}));
      }else if(s3upload_url_datagatherings && s3upload_url_datagatherings.length>=1){
        console.log('WEBVIEW에게 관련 필요 데이터 전달충족:',JSON.stringify({"s3_url_data":s3upload_url_datagatherings}));
        webviewRef.postMessage(JSON.stringify({"s3_url_data":s3upload_url_datagatherings}));
      }
    };

    useEffect(()=>{
      sets3uploadurl_datagatherings(s3upload_url_datagatherings);
    },[]);
    useEffect(()=>{
      console.log('s3uploadurl_datagatherings get]]]] debugss:',s3uploadurl_datagatherings);
    },[s3uploadurl_datagatherings])
    
    return ( 
        <WebView 
            source={{ /*uri: `http://172.28.5.10:3000`*/uri:`https://teamspark.kr/edit/music` }}
            ref={handleSetRef}
            onLoadEnd={handleEndLoading}
            originWhitelist={['*']}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            javaScriptEnabled={true}
            injectedJavaScript={""}
            scalesPageToFit={true}
            mixedContentMode="compatibility"
        />
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

