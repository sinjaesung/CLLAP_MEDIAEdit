
import React, { useState, useEffect} from 'react';
import { Dimensions, TouchableOpacity, Text, View, PermissionsAndroid,Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import EStyleSheet from 'react-native-extended-stylesheet';
//import RNFetchBlob from 'rn-fetch-blob';
import CaptureBar from '../component/CaptureBar';
import CaptureTakeVideoList from '../component/CaptureTakeVideoList';
import CaptureTop from '../component/CaptureTop';
// import Video from 'react-native-video';

import NextIcon from '../img/nextBtn.png';
import LoaderIcon from '../img/loader.png';
//import RNFetchBlob from 'rn-fetch-blob'
import style from 'react-native-beautiful-video-recorder/lib/RecordingButton/style';
//import  {NativeModules} from 'react-native';
//const RNFetchBlob = NativeModules.RNFetchBlob;

export default function CameraScreen({navigation,route}){
  
  const [isHide, setIsHide] = useState(false);
  const [isFront, setIsFront] = useState(0);
  const [takeFileList, setTakeFileList] = useState([]);
  const [reqUserid,setreqUserid] = useState(30);//요청userid값
  const [maxCount, setMaxCount] = useState(1);

  useEffect( () => {
    initPermission();
    setreqUserid(route.params['user_id']);
  }, [])


  async function initPermission(){
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  }

  async function saveImage(takeFile,s3upload_url_datagatherings){
    
    if(takeFile.uri){
      console.log('upload local file Urls!!:',takeFile,takeFile.uri);

      
      //방법1
      /*let formData=new FormData();
      formData.append("user_id",30);
      formData.append("videotake",{
        name:"vidoetakesss.mp4",
        uri: uri,
        type:'video/mp4'
      });*/

      
      //방법2
      let formData=[];
      formData.push({
        //name:'user_id',data:String(30)
        name:"user_id",data:String(reqUserid)
      });
      formData.push({
        name:'videotake', filename:'videotakesss.mp4', data:String(RNFetchBlob.wrap(takeFile.uri))
      })

      //var base_url="https://teamspark.kr:8080/api/videotake_uploads";
      var base_url ="https://teamspark.kr:8087/media/regist";
      //var base_url="https://teamspark.kr:8080/api/videotake_uploads_and_encoding";
      try{
     
        //방법1
        /*let response=await fetch(base_url,{
          method:'POST',
          headers:{
            'Content-Type':'multipart/form-data'
          },
          body:formData
        });
        console.log('await responsess:',response);
        let response_json=await response.json();
        console.log('json resultsss upload resultsss:',response_json);

        if(response_json.result){
          s3upload_url_datagatherings.push(response_json.result)
        }*/
        
        //방법2
        RNFetchBlob.fetch('POST',base_url,{
          Authorization: 'Bearer access-token',
          otherHeader:'foo',
          'Content-Type':'multipart/form-data'
        },formData)
        .then(async(resp)=>{
          let get_data=JSON.parse(resp.data)['result'];

          //thumbnail요청
          let req_url2="https://teamspark.kr:8080/api/videoFrameThumbnail";
          let response2=await fetch(req_url2,{
            method:"POST",
            headers:{
              Accept:"application/json",
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              urlfile : get_data
            })
          });
        
          let response_json2 = await response2.json();
          let get_thumbnail= response_json2.thumbnail;

          s3upload_url_datagatherings.push({
           url: get_data , duration: takeFile.duration, clientsrc: get_thumbnail
          });

        })
        .catch((err)=>{
          console.log('errrosss:',err);
        })

      }catch(error){
        console.log('errorsss inccurr:',error);
      }
    }

  }

 
  async function submitFiles(){
    var s3upload_url_datagatherings=[];

    if(reqUserid==0){
      alert("로그인후 이용해주세요");
      navigation.navigate("Home");
      return false;
    }
    if(takeFileList.length==0){
      alert("촬영or영상 선택이 필요합니다.");
      return false;
    }
    for(var i=0;i<takeFileList.length;i++){
      saveImage(takeFileList[i],s3upload_url_datagatherings);
    }

    async function standby(){
      return new Promise((resolve,reject)=>{
        let standby_cnt=0;
        let standby_interval=setInterval(function(){
          if(takeFileList.length === s3upload_url_datagatherings.length){
            clearInterval(standby_interval);
            resolve(true);
          }
          if(standby_cnt==6000){
            clearInterval(standby_interval);
            reject(new Error("timeout error"));
          }
          standby_cnt++;
          
        },800);
      });
    }
    try{
      let standby_result=await standby();

      if(standby_result){
        navigation.navigate(
          "MUSICSELECT",
          {
            s3upload_url_datagatherings: s3upload_url_datagatherings
          })
      }
    }catch(error){
      if(s3upload_url_datagatherings.length>=1){
        navigation.navigate(
          "MUSICSELECT",
          {
            s3upload_url_datagatherings: s3upload_url_datagatherings
          }
        )
      }
    }
  }

  
    return ( 
      <View style={styles.container}> 
        <RNCamera
          style={styles.preview}
          type={isFront}
          captureAudio={false}
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
                  maxCount={maxCount}
                  setMaxCount={setMaxCount}
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
         {
           maxCount == takeFileList.length ? 
           <TouchableOpacity style={styles.submitContainer} onPress={submitFiles}>
              <Image resizeMode={"stretch"} source={NextIcon} style={styles.galleryButton} />
           </TouchableOpacity>
           :
           null
         }
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
  },
  NextButton:{
    width:"55rem",height:"55rem"
  }
});
