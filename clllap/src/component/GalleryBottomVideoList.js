'use strict';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View, Image, FlatList } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import gelleryIcon from '../img/gelleryIcon.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from "react-native-modal";
import CaptureVideoModal from './CaptureVideoModal';
import style from 'react-native-beautiful-video-recorder/lib/RecordingButton/style';
// import Video from 'react-native-video';
import CheckBtn from '../img/checkBtn.png';


export default function GalleryBottomVideoList({onClickActive,onPressEvent, videoList}){


  function deleteEvent(item){
    onClickActive(item,true);
  }

  function openModal(item){
    onPressEvent(item);
  }

  function renderItem(item){
    return (
      <TouchableOpacity style={styles.takeItem} onLongPress={()=>{openModal(item)}} >
            <Image
                style={styles.item}
                source={{ uri: item }}
            />
            <TouchableOpacity style={styles.deleteContainer} onPress={()=>{deleteEvent(item)}}>
                <Image resizeMode={"stretch"} style={styles.deleteIcon} source={CheckBtn} ></Image>
            </TouchableOpacity>
      </TouchableOpacity>
    );
  }

    return (
      videoList.length != 0 ?
        <View style={styles.container}>
            <Text style={styles.titleLabel}>영상을 길게눌러 재생해 보실 수 있습니다.</Text>
            <FlatList
              style={styles.inner}
              data={videoList}
              renderItem={({item})=> { return renderItem(item) }}
              scrollEnabled={true}
              horizontal={true}
            ></FlatList>
        </View>
        :
        null
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const styles = EStyleSheet.create({
  container: {
    position :"absolute",
    bottom:0,
    width:"100%",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
    backgroundColor: 'white',
    height:"120rem", 
    padding:"15rem",
  },
  inner: {
    width:"100%",
    borderRadius:20,
    flexDirection: 'row', 
    backgroundColor: 'white',
    height:"100rem", 
    padding:"5rem",
  },
  titleLabel: {
    width:"100%",
    textAlign:"center",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
    color:"#DFB9FF",
    bottom:"5rem",
  },
  deleteContainer:{
    position:"absolute",
    width:"20rem",
    height:"20rem",
    borderRadius:50,
    top:"10rem",
    right:"-5rem",
  },
  deleteIcon:{
    width:"100%",
    height:"100%",
    borderRadius:50,
  },
  takeItem: {
    width:"60rem",
    height:"60rem", 
    margin:"5rem",
    bottom:"4rem",
  },
  item: {
    width:"60rem",
    height:"60rem", 
    borderRadius:10,
  },
});
