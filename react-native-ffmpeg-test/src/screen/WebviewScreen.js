import React, { useRef, useState,useEffect} from 'react';
import { Dimensions, BackHandler, Text, View, PermissionsAndroid } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native'
import WebView from 'react-native-webview';


export default function WebviewScreen({route}){
  
    console.log('웹뷰메인페이지 도달>>',route);
    let webviewRef=useRef();

    const handleSetRef = _ref => {
      webviewRef = _ref;
    };
    const handleEndLoading= e=>{
      console.log("handleEndLoading");//로그인하고넘어온 경우라면 값이있고, 그렇지 않으면 유효하지않은값일것임.
    };

    const navigation = useNavigation();

    function  onMessage( event ){
      console.log('webview로부터 전달받은 데이터<<main WebviewScdreen>>>:',event.nativeEvent.data);
      let data = JSON.parse(event.nativeEvent.data);
      if(data.type == "CAMERA" || data.type == "GALLERY" ){
        navigation.navigate(
          data.type,
          {
            user_id:data.userId
          })
      }else if(data.type=="login" || data.type=='mypage'){
        //메인로그인관련
        navigation.navigate(
          data.type
        )
      }else if(data.type=='logout'){
          webviewRef.postMessage(JSON.stringify({type:'logout'}));

      }else if(data.type=='ShareWrite'){
        navigation.navigate(
          data.type
        )
      }
   }

   //const [userdata,setUserdata]=useState("");
   /*if(route){
     if(route.params){
       if(route.params['type']=='emailLogin'){
         webviewRef.postMessage(JSON.stringify({type:'emaillogin'}));
       }
     }
   }*/
   useEffect(()=>{
    console.log('로드시점확인 웹뷰(메인)페이지 route정보:',route);
    if(route){
      if(route.params){
        //setUserdata(route.params.userdata?route.params.userdata:null);
        if(route.params['type']=='emailLogin'){
          webviewRef.postMessage(JSON.stringify({type:'emaillogin'}))
        }else if(route.params['type']=='userOut'){
          webviewRef.postMessage(JSON.stringify({type:"userOut"}))
        }else if(route.params['type']=='logout'){
          webviewRef.postMessage(JSON.stringify({type:'logout'}));
        }
      }
    }
   },[route])
   /*useEffect(()=>{
    console.log('===>전달 userdata정보>>>(webview main))::',userdata);

    webviewRef.postMessage(JSON.stringify(userdata?userdata:{}));
   },[userdata])*/

    return ( 
        <WebView 
            source={{ uri: `http://192.168.25.40:3000` }}
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

