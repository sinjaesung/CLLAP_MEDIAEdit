import React, { useRef, useState} from 'react';
import { Dimensions, BackHandler, Text, View, PermissionsAndroid } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native'
import WebView from 'react-native-webview';


export default function TestScreen(){
    const navigation = useNavigation();

    function  onMessage( event ){
      let data = JSON.parse(event.nativeEvent.data);
      if(data.type == "CAMERA" || data.type == "GALLERY" ){
        navigation.navigate(data.type)
      }
  }

    return ( 
        <WebView 
            source={{ /*uri: `http://172.28.5.10:3000`*/uri:`http://192.168.25.13:3000` }}
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

