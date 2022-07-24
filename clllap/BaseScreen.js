'use strict';
import React, { useState, useEffect,useRef} from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import gelleryIcon from './src/img/gelleryIcon.png';
import EStyleSheet from 'react-native-extended-stylesheet';

import Webview from 'react-native-webview'

export default function BaseScreen({navigation}){
    console.log('BASE WEBVIEW PAGE :',navigation);
    let webviewRef=useRef();

    const handleSetRef = _ref => {
      webviewRef = _ref;
    };
    const handleEndLoading= e=>{
      console.log("handleEndLoading");
      webviewRef.postMessage("로딩완료시 webview로 정보 보내는곳");
    };
    const clientMessage= e=>{
      console.log('클라이언트 메시지확인',e,e.nativeEvent.data);
      let data_decode=JSON.parse(e.nativeEvent.data);
      console.log('data decode usess:',data_decode);
  
      if(data_decode.category==='pageMove'){
        switch(data_decode.type){
          case 'cameraLink':
            navigation.navigate("Camera");
          break;
  
          case 'mylibraryLink':
            navigation.navigate("Gallery");
          break;
  
        }
      }
    }
    return (
      <View style={styles.container}>
          <Webview
            onLoadEnd={handleEndLoading}
            ref={handleSetRef}
            onMessage={clientMessage}
            source={{uri : "http://192.168.25.13:3000"}}
          />
      </View>
    );
}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 200,
    padding: 20,
    width:"70rem",
    height:"70rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  galleryContainer: {
    flex: 0,
    borderRadius: 5,
    alignSelf: 'center',
    margin: 20,
  },
  galleryButton: {
    borderRadius: 5,
  },
  takeContainer: {
    borderRadius: 5,
    backgroundColor: '#efefef',
    width:"80rem",
    height:"50rem",
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 0,
    margin: 20,
    alignSelf: 'center',
  },
  center:{
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});
