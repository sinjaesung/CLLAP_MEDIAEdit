'use strict';
import React, { useState ,useEffect} from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import style from 'react-native-beautiful-video-recorder/lib/RecordingButton/style';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AnimatedGaugeProgress, GaugeProgress } from 'react-native-simple-gauge';

const options = {
  title: 'Select video',
  mediaType: 'video',
  path:'video',
  quality: 1,
  duration: 30
};

export default function CaptureTakeButton({recordState,submitEvent,stopEvent,isMax}){

  //const [recordState, setRecordState] = useState(false);
  const [timerCount, setTimer] = useState(10)
  
  const size = 150;
  const width = 15;
  const cropDegree = 0;
  const textOffset = width;
  const textWidth = styles.capture.width

  useEffect(() => {
      // let interval = setInterval(() => {
      //   setTimer(lastTimerCount => {
      //       if(lastTimerCount >= 100){
      //         clearInterval(interval)
      //         setTimer(0);
      //       }
      //       else
      //         return lastTimerCount + 1
      //   })
      // }, 100) //each count lasts for a second
      // //cleanup the interval on complete
      // return () => clearInterval(interval)
  }, []);

  const onSubmit = async()=>{
    if(isMax){
      alert("최대 Take 수를 확인해주세요");
      return false;
    }
    //setRecordState(true);
    submitEvent();
  }
  const onStop = ()=>{
    //setRecordState(false);
    stopEvent();
  }
  console.log(timerCount)

    return (
      <TouchableOpacity onPress={() => recordState ? onStop() : onSubmit()} style={styles.container}>
        <TouchableOpacity onPress={() => recordState ? onStop() : onSubmit()} style={styles.capture}>
          <Text style={{ fontSize: 10 }}> { recordState ? "STOP" : "START" }</Text>
          {/* <AnimatedGaugeProgress
            style={styles.center}
            size={textWidth}
            width={5}
            fill={100}
            rotation={265}
            cropDegree={cropDegree}
          /> */}
        </TouchableOpacity>
    </TouchableOpacity>
      
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const styles = EStyleSheet.create({
  container: {
    borderWidth:2,
    borderRadius: 200,
    borderColor:'rgba(255, 255, 255, 0.6)',
    padding: 20,
    width:"80rem",
    height:"80rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 200,
    padding: 18,
    width:"65rem",
    height:"65rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position :"absolute",
    borderRadius: 200,
    padding: 18,
    width:"65rem",
    height:"65rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
