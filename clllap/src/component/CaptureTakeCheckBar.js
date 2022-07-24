'use strict';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import gelleryIcon from '../img/gelleryIcon.png';
import dropUpPoint from '../img/dropUpPoint.png';
import dropDownPoint from '../img/dropDownPoint.png';
import EStyleSheet from 'react-native-extended-stylesheet';


export default function CaptureTakeCheckBar({takeFileList}){

    return (
        <View  style={styles.container}>
        {
            takeFileList.map((value,index)=>{
              return (
                <View key={`takecheckbar=${index}`}style={index < 2 ? styles.fill : styles.unFill}></View>
              )
            })
        }
        </View>
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const styles = EStyleSheet.create({
  container: {
    justifyContent: "flex-start",
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    width:"15rem",
    height:"5rem",
    backgroundColor:"white",
    margin:"2rem"
  },
  unFill: {
    width:"15rem",
    height:"5rem",
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    margin:"2rem"
  },
});
