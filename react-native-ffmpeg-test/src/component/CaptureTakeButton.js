'use strict';
import React, { useState ,useEffect} from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
//import style from 'react-native-beautiful-video-recorder/lib/RecordingButton/style';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AnimatedGaugeProgress, GaugeProgress } from 'react-native-simple-gauge';

const options = {
  title: 'Select video',
  mediaType: 'video',
  path:'video',
  quality: 1,
  duration: 30
};

export default function CaptureTakeButton({camera,  cropdegree,setTimer,setTimerValue,timervalue,recordState,submitEvent,stopEvent,isMax}){

  //const [recordState, setRecordState] = useState(false);
 
  const size = 150;
  const width = 15;
  //const cropDegree = 0;
  const textOffset = width;
  const textWidth = styles.capture.width

  useEffect(() => {
      //console.log('===>>compontnt관련 페이지 mount되는 로드시점때 실행,해당 컴포넌트가 언마운트사라질때 호출되는것 capture하는것을 cleanup콜백함수라',timervalue);
       /*let interval = setInterval(() => {
         setTimer(lastTimerCount => {
             if(lastTimerCount >= 30){
               clearInterval(interval)
               setTimer(0);
               return 0;
             }
             else
               return lastTimerCount + 1
         })
       }, 1000) //each count lasts for a second*/
       //cleanup the interval on complete
      
  }, []);
 

  const onSubmit = async()=>{

    if(isMax){
      alert("최대 Take 수를 확인해주세요");
      return false;
    }
    //setRecordState(true);

    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
          if(lastTimerCount >= 30){
            clearInterval(interval)
            setTimer(0);
            return 0;
          }
          else
            return lastTimerCount + 1
      })
    }, 1000) //each count lasts for a second
    setTimerValue(interval);

    submitEvent(interval);


    //cleanup the interval on complete
    //return () => clearInterval(interval)
  }
  const onStop = ()=>{
    //setRecordState(false);
    stopEvent();

    console.log('stopEventssss:',timervalue);

    if(timervalue){
      clearInterval(timervalue);//interval종료!!!
    }
    setTimer(0);
  }
  //console.log(timerCount)

    return (
      <TouchableOpacity onPress={() => recordState ? onStop() : onSubmit()} style={styles.container}>
        <TouchableOpacity onPress={() => recordState ? onStop() : onSubmit()} style={styles.capture}>
          <Text style={{ fontSize: 10,color:'white' }}> { recordState ? "STOP" : "START" }</Text>
           <AnimatedGaugeProgress
            style={styles.center}
            size={textWidth}
            width={10}
            fill={100}
            tintColor={'#27be99'}
            rotation={0}
            cropDegree={cropdegree}
          /> 
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
    //backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor:'rgba(255,255,255,0.3)',
    borderRadius: 200,
    padding: 18, color:'white',
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
