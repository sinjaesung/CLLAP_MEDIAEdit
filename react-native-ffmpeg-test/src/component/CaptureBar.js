'use strict';
import React, { useState, useRef,useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import gelleryIcon from '../img/gelleryIcon.png';

import dropUpPoint from '../img/dropUpPoint.png';
import dropDownPoint from '../img/dropDownPoint.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import CaptureTakeCheckBar from './CaptureTakeCheckBar';
import CaptureTakeButton from './CaptureTakeButton';
//import Webview from 'react-native-webview'
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

//import RNFetchBlob from 'rn-fetch-blob';
//import  {NativeModules} from 'react-native';
//const RNFetchBlob = NativeModules.RNFetchBlob;

import CameraRoll from '@react-native-community/cameraroll';


const options = {
  title: 'Select video',
  mediaType: 'video',
  path:'image',
  quality: 1,
  duration: 30,
  includeBase64: true
};

export default function CaptureBar({recordStop_callback, setTimerValue,timervalue,camera,isHide, setIsHide,takeFileList, setTakeFileList,maxCount, setMaxCount}){

    const [recordState, setRecordState] = useState(false);
    const [loadVideo, setLoadVideo] = useState("");
    let webview = useRef();


    const [cropdegree,setcropdegree] = useState(0);
  const [timerCount, setTimer] = useState(0)

  useEffect(()=>{
    console.log('timerCountss:',timerCount);
    setcropdegree(12*timerCount);
  },[timerCount])
 

    const onSubmit = async(timer_value)=>{
      console.log('onSubmit 관련 추적 lastests설정 timeervalue값:',timer_value);
      if(camera){

        setRecordState(true);
        const {uri,codec='mp4'} = await camera.recordAsync({
          maxDuration: 30,
          //quality:RNCamera.Constants.VideoQuality['720p'],
          quality:RNCamera.Constants.VideoQuality['720p'],
          //videoBitrate:0.25*1000*1000
          //videoBitRate: 0.1*1000*500,
          videoBitRate: 0.1*100*100,
          //maxFileSize : 12*1024*1024
        });
        console.log('녹화종료 get await recordASAYNC:',uri);//가상 앱 cache uri형태이나,프로토콜은 file:////로ffmpeg에서접근가능하므로 변환없이그대로사용가능함.

        //console.log('====>녹화종료시에명시적으로 clearIntervalss:',timervalue);
        //if(timervalue){
         // clearInterval(timervalue);
       // }
       console.log('====][]]]]]>>녹화강제종료시점에 관련 실행 콜백함수]]]]]::timer_valuess>>>',timer_value);
       if(timer_value){
         clearInterval(timer_value);
       }
        
       setTimer(0);
        setRecordState(false);
        setLoadVideo(uri);

        //let results= await CameraRoll.save(uri);
        console.log('what is RNFS:',RNFS,RNFS.PicturesDirectoryPath,RNFS.CachesDirectoryPath,RNFS.TemporaryDirectoryPath);
        //console.log('what is base64:',btoa());
        /*let albumPath=`${RNFS.PicturesDirectoryPath}/CLLAP`;
        let filename=`${new Date().getTime()}.mp4`;
        let filePathInCache=`${RNFS.CachesDirectoryPath}/${filename}`;
        let filePathInAlbum=`${albumPath}/${filename}`;

        RNFS.mkdir(albumPath)
        .then(()=>{
          console.log('폴더생성 성공:');
          RNFS.writeFile(filePathInCache,uri,'base64').then(()=>RNFS.copyFile(filePathInCache,filePathInAlbum))
          .then(()=>RNFS.scanFile(filePathInAlbum))
          .then(()=>{
            console.log('FILES AVES successfuly');
          })
        }).catch((error)=>{
          console.log('colud not crate dir:',error);
        });*/

        let results= await CameraRoll.save(uri);

        console.log('[[onSubmit영상녹화완료때만 저장]]:: cameraRoll await resultsss?:',results);

        //let results= await CameraRoll.saveToCameraRoll(uri);
        //console.log('file save resultsss:',results);

        /*let formData=new FormData();
        if(results){
          console.log('uri hsmsmss:',results);
          formData.append("user_id",30);
          formData.append("videotake",{
            name:"vidoetakesss.mp4",
            uri: results,
            type:'video/mp4'
          });
          
        }
        var base_url="https://teamspark.kr:8087/media/regist";
        //var base_url="http://localhost:8080/api/videotake_uploads";
        console.log('base yurlss reuqestss:',base_url);
        
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
      }*/
    }
  }

  const onStop = ()=>{
    console.log('====>녹화종료::',timervalue);//timervalue참조가능.
    setRecordState(false);
    camera.stopRecording();
    if(timervalue){
      clearInterval(timervalue);
    }//뭔가 정지하고,종료하는 연산엔 무조건 timervalue를 비운다.
    
  }

  const openGallery = async () =>{
    if(takeFileList.length >= maxCount){
      alert("최대 Take 수를 확인해주세요");
      return false;
    }
    const result = await launchImageLibrary(options);

    console.log('opengALLERY galleysss<<CAMERA PAGE gallery access image picker list>>',result);
    result.assets.map((value)=>{
      //한개의 파일씩만 열면 호출되며, 한개씩만 처리flow -> 
      console.log('openGallery result assetssss:',value.uri);

      RNFS.stat(value.uri).then(res=>{
        console.log('RNFS STAT fileInformation resultss:',res);
        console.log('res isDirecdtoery:',res.isDirectory());
        console.log("res originalFilePath:",res.originalFilepath);
        console.log("res isFiless:",res.isFile());

        //setLoadVideo(value.uri);android케이스에서의 content://가상uri를 실제 originalUrl형태로한해서바꾼다. content://타입등은 지원안함(ffmpeg접근)
        setLoadVideo('file://'+res.originalFilepath);
      }).catch(err=>{
        console.log('readFile errorsss:',err);
      })
      //setTakeFileList(list => { list.push(value.uri); return [...list]; });
    });

    /*let formData=new FormData();
    if(result){
      formData.append("user_id",30);
      formData.append('videotake',{
        name:'sddggeegeggege.mp4',
        uri: result.assets[0].uri,
        type:'video/mp4'
      });
    }
    var base_url="https://teamspark.kr:8087/media/regist";
    //var base_url="https://teamspark.kr:8087/media/regist";
    fetch(base_url,{
      method:'POST',
      headers:{
        'Content-Type':'multipart/form-data'
      },
      body:formData
    })
    .then(response=>{
      console.log('resnose ponsess:',response);
      return response.json()
    })
    .then(async(res)=>{
      console.log('json resultss:',res);
    })
    .catch(error=>{
      console.log('errosss:',error);
    })*/
  }

  const updateMaxCount = (plusNum) =>{
   setMaxCount(e => e + plusNum > 5 ? 5 : e + plusNum < 1 ? 1 : e + plusNum);
  // maxCount= maxCount + plusNum > 5 ? 5 : maxCount + plusNum < 1 ? 1 : maxCount + plusNum
  }

  const onLoadVideo = async (video) =>{
    console.log('cameraPage onLoadVideosss:',video);
    if(video.duration < 4){
      alert("최소 영상 길이는 4초입니다.");
      return;
    }
    
    setTakeFileList(list => { list.push({uri:loadVideo,duration:video.duration}); return [...list]; });
    //takeFileList = takeFileList.push({uri:loadVideo,duration:video.duration});
    setLoadVideo("");
    
  }

    return (
        <View style={styles.container}> 
            <View style={styles.centerContainer}>
              {
                loadVideo ?
                <Video
                  source={{ uri: loadVideo }}
                  paused = {true}
                  onLoad={onLoadVideo}
                />
                :
                null
              }
            
                <TouchableOpacity onPress={openGallery} style={styles.galleryContainer}>
                    <Image source={gelleryIcon} style={styles.galleryButton}/>
                </TouchableOpacity>
                <CaptureTakeButton 
                cropdegree={cropdegree}
                setTimer={setTimer}
                setTimerValue={setTimerValue}
                timervalue={timervalue}
                camera={camera}
                    recordState={recordState}
                    submitEvent={onSubmit}
                    stopEvent={onStop}
                    isMax={takeFileList.length >= maxCount}
                />
                <View style={styles.takeContainer}>
                    <View style={styles.center}>
                        <Text>TAKE</Text>
                    </View>
                    <View style={styles.center}>
                        <TouchableOpacity onPress={() => updateMaxCount(-1)} style={styles.center}>
                        <Text style={{ fontSize: 20 }}> -  </Text>
                        </TouchableOpacity>
                        <View style={styles.center}>
                            <Text>{takeFileList.length}</Text>
                            <Text>/</Text>
                            <Text>{maxCount}</Text>
                        </View>
                        <TouchableOpacity onPress={() => updateMaxCount(1)} style={styles.center}>
                        <Text style={{ fontSize: 20 }}> + </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => setIsHide(b=>!b)} style={styles.hideContainer}>
                <Image source={isHide ? dropDownPoint : dropUpPoint } style={styles.galleryButton}/>
            </TouchableOpacity>
            <View style={styles.center}>
                <CaptureTakeCheckBar takeFileList={takeFileList}/>
            </View>
        </View>
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const styles = EStyleSheet.create({
  container: {
    width:"100%",
    paddingLeft:"20rem",
    paddingRight:"20rem",
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:"20rem",
  },
  video:{
    width:500,
    height:500,
  },
  centerContainer :{
    width:"100%",
    justifyContent: "flex-start",
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hideContainer:{
    margin:"10rem",
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 200,
    padding: 20,
    width:"70rem",
    height:"70rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryContainer: {
    borderRadius: 5,
    width:"80rem",
    alignSelf: 'center',
    marginRight:"auto"
  },
  takeContainer: {
    borderRadius: 5,
    backgroundColor: '#efefef',
    width:"80rem",
    height:"50rem",
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft:"auto"
  },
  galleryButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center:{
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});
