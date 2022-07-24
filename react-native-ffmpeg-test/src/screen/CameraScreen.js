
import React, { useState, useEffect,useRef} from 'react';
import { Dimensions, TouchableOpacity, Text, View, PermissionsAndroid,Image,BackHandler } from 'react-native';
import { RNCamera } from 'react-native-camera';
import EStyleSheet from 'react-native-extended-stylesheet';
import CaptureBar from '../component/CaptureBar';
import CaptureTakeVideoList from '../component/CaptureTakeVideoList';
import CaptureTop from '../component/CaptureTop';
// import Video from 'react-native-video';

import CameraRoll from "@react-native-community/cameraroll";
import RNFS from 'react-native-fs';

import NextIcon from '../img/nextBtn.png';
import LoaderIcon from '../img/loader.png';
import { showPopup } from '../popup';
//import style from 'react-native-beautiful-video-recorder/lib/RecordingButton/style';
//import  {NativeModules} from 'react-native';

import {
  enableLogCallback,
  enableStatisticsCallback,
  executeFFmpeg,
  executeFFmpegAsync,
  executeFFprobe,
  executeFFprobeWithArguments,
  getMediaInformation,
  getLogLevel
} from '../react-native-ffmpeg-api-wrapper';
import {ffprint} from '../util';
import VideoUtil from '../video-util';
import Test from '../test-api';

export default function CameraScreen({navigation,route}){


  console.log('===>cameraScreenssss:',navigation,route);
  const [isHide, setIsHide] = useState(false);
  const [isFront, setIsFront] = useState(0);
  const [takeFileList, setTakeFileList] = useState([]);
 const [reqUserid,setreqUserid] = useState(30);//요청userid값
  const [maxCount, setMaxCount] = useState(1);

  const [timervalue,setTimerValue] = useState(false);
  //const [timer_kill,setTimer_kill] = useState("");
  useEffect(()=>{
    /*console.log('timervaluess:',timervalue);
    const backAction=()=>{
       
        console.log('===>>뒤로가기 명시적 실행>>',timervalue);
        if(timervalue){
          clearInterval(timervalue);//interval종료!!!       
        }
        //navigation.goBack();
        return false;//false면 뒤로가기개념,true이면 뒤로가기막음.
    }
    const backHandler=BackHandler.addEventListener("hardwareBackPress",backAction);
    //backAction관련
    console.log('TakedDit페이지로드시점 what backahnadlerss:',backHandler,backHandler.remove,BackHandler.exitApp);
    return ()=> backHandler.remove();*/

    console.log('timervaluess change시마다 그걸 스코프로하는 state갱신',timervalue);

    return () => {
      console.log('[[[[[[[[[[[[[[[[[[CameraScreen컴포넌트 unmount시점실행>>>]]]]]]]]]]]]]]]]]][[]]:',timervalue);
      if(timervalue){
       clearInterval(timervalue);
      }
      //stopEvent();
      //camera.stopRecording();
    }
  },[timervalue]);

  /*useEffect(()=>{
    console.log(';========>>timer_kill update갱신확인::]]]]',timer_kill);
  },[timer_kill])*/

  let popupReference = useRef();

  useEffect( () => {
    console.log("페이지로드시점(카메라라라라라):");
    setreqUserid(route.params.user_id!=0?route.params.user_id:30);

    navigation.addListener("focus",(_)=>{
      console.log('카메라페이지focusingss!!!:');
      setActive();
    });
    //setreqUserid(route.params['user_id']);
  }, []);

  useEffect(()=>{
    console.log('CAMERA SCREEN TAKEFILElISTSSS:',takeFileList);
  },[takeFileList]);
  const setActive=()=>{

    initPermission();

    ffprint("Camera tab acitaivetdd");
    enableLogCallback(logCallback);
    //enableLogCallback(undefined);
    enableStatisticsCallback(undefined);
    showPopup(popupReference,"CAMERA PAGE FOCUS ACTIVE");
  }
  const logCallback=(log)=>{
    console.log('FFMPEGLOG MESSAGE<<camera>>:',log);  
  }

  async function initPermission(){
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
    const result=await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title:"Permission Explanation",
        message:"ReactNativeForYou woludlike to accessyour photess!!"
      }
    );
    console.log('===>cameara페이지 gallery페이지처럼 유저외부갤러리저장소접근권한도요청함',result);
    console.log('====>>CAMERA SCREEN카메라페이지 권한요청 initPermisssion>>>>>',granted);
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
    console.log('===>nextBtn click submitFilesss(camera)');

    console.log('target filess:',takeFileList);//list video files first element test(video 촬영된것uri,또는 저장한것or피커얻은 content:타입형태 , content:는지원하지않는듯하다.)

    /*Test.testPostExecutionCommands();

    let videoFile=`${RNFS.CachesDirectoryPath}/video.mp4`;
    ffmpegCommand=VideoUtil.generateTestScript(videoList_test.uri,videoFile);
    ffprint("TESTING FMFPEG COMAMND SYSNTOLRY<<cameraScreen>>"+ffmpegCommand);

    executeFFmpegAsync(ffmpegCommand, async(completedExecution) => {
      // this.hideProgressDialog();
        if (completedExecution.returnCode === 0) {
            ffprint("Encode completed successfully; playing video.");
            let results= await CameraRoll.save(videoFile);
            console.log('ffmpeg encoding process outputfile to cameraRoll저장!',results);
            //playVideo();
        } else {
            ffprint(`Encode failed with rc=${completedExecution.returnCode}.`);
            //showPopup(this.popupReference, "Encode failed. Please check log for the details.");
        }
    });*/

    if(reqUserid==0){
      alert("로그인후 이용해주세요");
      navigation.navigate("WebviewScreen");
      return false;
    }
    if(takeFileList.length==0){
      alert("촬영or영상 선택이 필요합니다.");
      return false;
    }
    /*for(var i=0;i<takeFileList.length;i++){
      //saveImage(takeFileList[i],s3upload_url_datagatherings);
      /*let ffmpegCommand_duration=" " +
      "-show_streams " +
      "-print_format json " +
      "-v error " + 
      `\"${takeFileList[i]['uri']}\"`;*/
      //console.log('FFMPEGcomamnd_duraiton',ffmpegCommand_duration);

      //executeFFprobe(ffmpegCommand_duration);
      //executeFFprobeWithArguments(["-i",`${takeFileList[i]['uri']}`,"-v","error"]);
      //getMediaInformation(takeFileList[i]['uri']);
      //executeFFprobe(ffmpegCommand_duration);
      //console.log('what resultss:',result);
      /*.then((result)=>{
        ffprint(`FFmpeg process exited with rc ${result}`);
        if(result!==0){
          console.log("Command failed,Please check output for the detailss");
        }
      });
      let getImage=`${RNFS.CachesDirectoryPath}/videothumbnail${i+1}.png`;
      console.log('app cache getImage:',getImage);
      let FFmpegCommand=VideoUtil.generateThumbnailScript(takeFileList[i]['uri'],getImage);
      console.log('get thumbnail ffmpegcommandss:',FFmpegCommand);

      ffprint("TESTING FMFPEG COMAMND SYSNTOLRY<<cameraScreen>>"+FFmpegCommand);

      executeFFmpegAsync(FFmpegCommand, async(completedExecution) => {
        // this.hideProgressDialog();
          if (completedExecution.returnCode === 0) {
              ffprint("completed successfully;");
              let results= await CameraRoll.save(getImage);
              console.log('ffmpeg thumbnailget process outputfile to cameraRoll저장!',getImage,results);
              //playVideo();
          } else {
              ffprint(`Encode failed with rc=${completedExecution.returnCode}.`);
              //showPopup(this.popupReference, "Encode failed. Please check log for the details.");
          }
      });
    }*/

    /*async function standby(){
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
    }*/
    try{
      //let standby_result=await standby();

      //if(standby_result){
        navigation.navigate(
          "MUSICSELECT",
          {
            mem_id : reqUserid,//어떤 로그인유저가 자신갤러리 어떤 테이크비디오목록들 한건지.추적
            takeFileList: takeFileList
          })
      //}
    }catch(error){
      if(takeFileList.length>=1){
        navigation.navigate(
          "MUSICSELECT",
          {
            mem_id : reqUserid,//어떤 로그인유저가 자신갤러리 어떤 테이크비디오목록들 한건지.추적
            takeFileList: takeFileList
          }
        )
      }
    }
  }

  const onGoBack = async () =>{
    console.log("카메라페이지 앱 뒤로가기누른경우!!!:",timervalue);
    if(timervalue){
      clearInterval(timervalue);//interval종료!!!
    }
    navigation.goBack();
  }
  const recordStop_callback=async ()=>{
    console.log('===>>카메라테이크 페이지 녹화가 강제적or자연적 종료된경우에 콜백형태 후속호출함수:',timervalue);
    if(timervalue){
      clearInterval(timervalue);
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
            return (
              <View>
                <CaptureBar 
                setTimerValue={setTimerValue}
                timervalue={timervalue}
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
         <CaptureTop onGoBack={onGoBack} setIsFront={setIsFront}/>
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
