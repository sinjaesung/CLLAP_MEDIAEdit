'use strict';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View, Image, FlatList } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import gelleryIcon from '../img/gelleryIcon.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from "react-native-modal";
import CaptureVideoModal from './CaptureVideoModal';
// import Video from 'react-native-video';


const options = {
  title: 'Select video',
  mediaType: 'video',
  path:'video',
  quality: 1,
  duration: 30
};


export default function CaptureTakeVideoList({takeFileList,isHide}){

  const [modalVisible, setModalVisible] = useState(false);
  const [video, setVideo] = useState(false);

  function openModal(item){
    setVideo(item.uri);
    setModalVisible(true);
  }

  function renderItem(item){
    return (
      <TouchableOpacity style={styles.takeItem} onPress={()=>{openModal(item)}}>
            <Image
                style={styles.item}
                source={{ uri: item.uri }}
            />
    </TouchableOpacity>
    );
  }


  if(!isHide)
    return null;

    return (
        <View style={styles.container}>
            <CaptureVideoModal modalVisible={modalVisible} setModalVisible={setModalVisible} video={video}></CaptureVideoModal>
            <FlatList
              style={styles.inner}
              data={takeFileList}
              renderItem={({item})=> { return renderItem(item) }}
              scrollEnabled={true}
              horizontal={true}
            ></FlatList>
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
  },
  inner: {
    width:"330rem",
    flexDirection: 'row', 
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height:"60rem", 
    marginBottom:"20rem"
  },
  takeItem: {
    width:"80rem",
    height:"50rem", 
    margin:"5rem",
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  item: {
    width:"80rem",
    height:"50rem", 
  },
});
