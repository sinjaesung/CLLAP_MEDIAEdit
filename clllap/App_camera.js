'use strict';
import React, { useState, useEffect} from 'react';
import { Dimensions, TouchableOpacity, Text, View, PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import gelleryIcon from './src/img/gelleryIcon.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import CaptureBar from './src/component/CaptureBar';
import CaptureTakeVideoList from './src/component/CaptureTakeVideoList';
import CaptureTop from './src/component/CaptureTop';
import CameraRoll from '@react-native-community/cameraroll';
// import Video from 'react-native-video';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);


export default function ExampleApp(){

  const [isHide, setIsHide] = useState(false);
  const [isFront, setIsFront] = useState(0);
  const [takeFileList, setTakeFileList] = useState([]);

  useEffect(async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  }, [])

  async function saveImage(uri){
    let results= await CameraRoll.saveToCameraRoll(uri);

    let formData=new FormData();
    if(uri){
      formData.append("videotake1",{
        name:"vidoetakesss.mp4",
        uri: uri,
        type:'video/mp4'
      })
    }

    var base_url="https://teamspark.kr:8080/api/videotake_uploads";
    
    try{
      fetch(base_url,{
        method:'POST',
        headers:{
          'Content-Type':'multipart/form-data'
        },
        body:formData
      })
      .then(response=>{
        console.log('response responssss:',response);
        return response.json()
      })
      .then(async(res)=>{
        console.log('json resultsss:',res);
      })
      .catch(error=>{
        console.log('errosss:',error);
      })
    }catch(error){
      console.log('errorsss inccurr:',error);
    }
  }
  
  async function submitFiles(){
    for(var i =0;i<takeFileList.length;i++){
      await saveImage(takeFileList[i]);
    }
  }
  
    return ( 
      <View style={styles.container}> 
        <RNCamera
          style={styles.preview}
          type={isFront}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View>
                <CaptureBar 
                  camera={camera} 
                  takeFileList={takeFileList} 
                  setTakeFileList={setTakeFileList} 
                  isHide={isHide} 
                  setIsHide={setIsHide}
                />
                <CaptureTakeVideoList 
                  takeFileList={takeFileList} 
                  setTakeFileList={setTakeFileList} 
                  isHide={isHide}
                />
              </View>
            );
          }}
        </RNCamera>
         <CaptureTop setIsFront={setIsFront}/>
         <TouchableOpacity style={styles.submitContainer} onPress={submitFiles}>
         </TouchableOpacity>
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
    paddingBottom:"50rem",
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
  },
  submitContainer:{
    position:"absolute",
    width:"55rem",
    height:"55rem",
    bottom:"5%",
    right:"20rem",
    borderRadius : 50,
    backgroundColor: 'rgb(249, 105, 255)',
  }
});
