import React, { useRef, useState,useEffect} from 'react';
import { Dimensions, BackHandler, Text, View, PermissionsAndroid } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native'
import WebView from 'react-native-webview';


export default function WebviewScreen(){
  
    let webviewRef=useRef();

    const handleSetRef = _ref => {
      webviewRef = _ref;
    };
    const handleEndLoading= e=>{
      console.log("handleEndLoading");
     // webviewRef.postMessage("FROM APPCONTAINER message");
    };

    const navigation = useNavigation();

    function  onMessage( event ){
      console.log('webview로부터 전달받은 데이터:',event.nativeEvent.data);
      let data = JSON.parse(event.nativeEvent.data);
      if(data.type == "pageMove"){
        navigation.navigate(
          data.target,//signupComplete
        )
      }
   }

    return ( 
        <WebView 
            source={{ uri: `http://192.168.25.40:3000/signup` }}
            ref={handleSetRef}
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
    );
}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

