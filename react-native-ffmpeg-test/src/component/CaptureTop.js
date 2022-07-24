'use strict';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import cameraSwitchIcon from '../img/cameraSwitchIcon.png';
import pointLeft from '../img/pointLeft.png';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';

const options = {
  title: 'Select video',
  mediaType: 'video',
  path:'video',
  quality: 1,
  duration: 30
};

export default function CaptureTop({onGoBack,setIsFront}){

  const [recordState, setRecordState] = useState(false);
  const [maxCount, setMaxCount] = useState(1);
  const [takeFileList, setTakeFileList] = useState([]);
  const navigation = useNavigation();

  const onSwitchCamera = async () =>{
    setIsFront(e => e == 1 ? 0 : 1);
    //IsFront = !IsFront;
  }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onGoBack} style={styles.leftContainer}>
                <Image source={pointLeft} style={styles.leftButton}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSwitchCamera} style={styles.rightContainer}>
                <Image source={cameraSwitchIcon} style={styles.galleryButton}/>
            </TouchableOpacity>
        </View>
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const styles = EStyleSheet.create({
  container: {
    position:"absolute",
    top:"10rem",
    width:"100%", 
    flexDirection: 'row', 
    justifyContent: 'center',
  },
  leftContainer: {
    marginLeft:"20rem",
    marginRight:"auto"
  },
  rightContainer: {
    marginRight:"20rem",
    marginLeft:"auto"
  },
  galleryButton: {
    borderRadius: 5,
  },
  leftButton: {
    top:"12rem",
    width:"16rem",
    height:"16rem",
  },
});
