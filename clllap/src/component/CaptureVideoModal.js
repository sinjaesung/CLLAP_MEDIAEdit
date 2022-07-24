'use strict';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View, Image, FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from "react-native-modal";
import Video from 'react-native-video';

export default function CaptureVideoModal({modalVisible,setModalVisible,videos}){

    return (
        <View style={styles.container}>
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onBackButtonPress={()=>{setModalVisible(!modalVisible);}}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <Video
                    style={styles.video}
                    source={{
                        uri: videos,
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping={true}
                />
                <View style={styles.modalView}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
  centeredView: {
    width:"100%",
    flexDirection: 'row', 
    backgroundColor:"#efefef",
    borderRadius:5,
    padding:"10rem",
  },
  video:{
    width:"100%",
    height:"300rem",
  },
  modalView: {
    position:"absolute",
    left:"90%",
    marginLeft:"auto",
    width:"50rem",
    height:"50rem", 
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize:"20rem",
  },
});
