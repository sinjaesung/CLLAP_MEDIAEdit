'use strict';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View, Image, FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import CheckBtn from '../img/checkBtn.png';

export default function CaptureGalleryItem({item, onPressEvent,onClickActive,videoList}){

    let isCheck = videoList.filter(e => e.node.image.uri == item.node.image.uri).length > 0;
    
    function onClickCheckBox(){
      onClickActive(item,isCheck);
    }

    function onLongPress(){
      onPressEvent(item.node.image.uri);
    }

    return (
      <TouchableOpacity 
        style={styles.images} 
        onPress={onClickCheckBox}
        onLongPress={onLongPress}
        onClickCheckBox={onClickCheckBox}
      >
        <Image  style={styles.image} source={{ uri: item.node.image.uri }}/>
        {
          isCheck ? 
          <TouchableOpacity style={styles.checkBox}>
            <Image resizeMode={"stretch"} style={styles.deleteIcon} source={CheckBtn} ></Image>
          </TouchableOpacity>
          :
          null
        }
      </TouchableOpacity>
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const styles = EStyleSheet.create({
  images:{  width: "113rem", height: "113rem", margin:"2rem" },
  image:{
    borderRadius:10 ,
    width:"100%",
    height:"100%",
  },
  checkBox:{
    position:"absolute",
    width:"25rem",
    height:"25rem",
    borderRadius:50,
    top:"7rem",
    right:"7rem",
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
});
