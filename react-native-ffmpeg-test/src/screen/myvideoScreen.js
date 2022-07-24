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
      console.log('webview로부터 전달받은 데이터<<mypage>>rn',event.nativeEvent.data);
      let data = JSON.parse(event.nativeEvent.data);
      let data_data=JSON.parse(data.data);
      if(data.type == "pageMove"){
        navigation.navigate(
          data.target,
          {
              effect:data_data.effect,
              video:data_data.video
          }
        )
      }/*else if(data.type == "CAMERA" || data.type == "GALLERY" ){
          //이메일로그인완성하여 웹뷰상에서메인이동후에 메인컴포넌트상에 요소 리덕스정보로 넘어온 userid요청이 온경우.
        navigation.navigate(
          data.type,
          {
            user_id:data.userId
          })
      }else if(data.type=='mypage'){
          navigation.navigate(
              data.type
          )
      }else if(data.type=='logout'){
          //webviewRef.postMessage(JSON.stringify({type:'logout'}));
          navigation.navigate(
            data.target,
            {
              type:'logout'
            }
          )
      }else if(data.type=='userOut'){
          navigation.navigate(
            data.target,
            {
              type:'userOut'
            }
          )
      }*/
   }

    return ( 
        <WebView 
            source={{ uri: `http://192.168.25.40:3000/myLibrary` }}
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

