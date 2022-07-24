'use strict';
import React, { useState, useEffect} from 'react';
import { Dimensions, FlatList, Text, Image, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import gelleryIcon from './src/img/gelleryIcon.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import CaptureBar from './src/component/CaptureBar';
import CaptureTakeVideoList from './src/component/CaptureTakeVideoList';
import CaptureTop from './src/component/CaptureTop';
import CameraRoll from "@react-native-community/cameraroll";
import CaptureVideoModal from './src/component/CaptureVideoModal';
import CaptureGalleryItem from './src/component/CaptureGalleryItem';
import GalleryBottomVideoList from './src/component/GalleryBottomVideoList';
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


export default function ExampleApp({navigation}){

  console.log('갤러리 페이지 도달:',navigation);

  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [video, setVideo] = useState("");
  const [videoList, setVideoList] = useState([]);
  

  /*useEffect(async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Permission Explanation',
        message: 'ReactNativeForYou would like to access your photos!',
      },
    );

    CameraRoll.getPhotos({
      first: 10,
      assetType: 'Videos',
      
    })
    .then(res => {
      //setData(res.edges);
      setData(res.edges);
    })
    .catch((error) => {
       console.log(error);
    });*/

  useEffect(() => {
    (async()=>{
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
  
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission Explanation',
          message: 'ReactNativeForYou would like to access your photos!',
        },
      );
  
      CameraRoll.getPhotos({
        first: 20,
        assetType: 'Videos',
        
      })
      .then(res => {
        console.log("getPhotsss:",res);
        console.log("getPhotsss:",res);
        console.log("getPhotsss:",res);
        console.log("getPhotsss:",res);
        setData(res.edges);
      })
      .catch((error) => {
         console.log(error);
      });
    })();
  
  }, [])
  
 
  function onClickActive(item,isCheck){
    let list = videoList;
    let url = item;
    list = list.filter(e => e != url);
    if(!isCheck){
      list.push(url);
    }
    setVideoList([...list]);
  }

  function onPressEvent(item){
    setVideo(item); 
    setModalVisible(true);
  }
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
    for(var i =0;i<videoList.length;i++){
      await saveImage(videoList[i]);
    }
  }

    return (
      <View style={styles.container}>
          <View style={styles.headerContainer}>
            {/*<View style={styles.capture}></View>*/}
            <View>
            <Text style={styles.title} onPress={onGoBack} >뒤로</Text>
            </View>
            <View style={styles.capture}>
                <Text style={styles.title}>LIBRARY</Text>
            </View>
            <View style={styles.capture}></View>
          </View>
          <View style={styles.listContainer}>
            <FlatList
                data={data}
                numColumns={3}
                renderItem={({ item }) => {
                  return (
                    <CaptureGalleryItem 
                      item={item} 
                      videoList={videoList}
                      onPressEvent={onPressEvent} 
                      onClickActive={onClickActive}
                    />
                    
                  );
                }}
            />
          </View>
          <GalleryBottomVideoList videoList={videoList} onClickActive={onClickActive} onPressEvent={onPressEvent}></GalleryBottomVideoList>
          <CaptureVideoModal modalVisible={modalVisible} setModalVisible={setModalVisible} video={video}></CaptureVideoModal>
          {
            videoList.length > 0 ?
            <TouchableOpacity style={styles.submitContainer} onPress={submitFiles} />
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
    backgroundColor: '#DFB8D3',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderRadius:20,
    bottom:"20rem",
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%",
    height:"90rem",
    flexDirection: 'row'
  },
  listContainer:{
    width:"100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    width:"33%",
    height:"70rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    color: '#DFB8D3',
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
    bottom:"15%",
    right:"20rem",
    borderRadius : 50,
    backgroundColor: 'rgb(249, 105, 255)',
  }
});
