import React, { useEffect ,useState} from 'react';
import {Text, TouchableOpacity, View,  PermissionsAndroid, Dimensions} from 'react-native';
import RNFS from 'react-native-fs';

import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import CameraRoll from "@react-native-community/cameraroll";

import EStyleSheet from 'react-native-extended-stylesheet';

export default function videoPlay() {

    const [data, setData] = useState([]);
    const [mergedplayer,setmergedplayer] = useState("");
    const [video,setvideo]=useState("");

    const [paused,setpaused]=useState(true);
    
    useEffect(async ()=>{
        console.log("videoTest페이지 로드 ===>"); 
        checkPermissions(); 
    },[]);
    useEffect(()=>{
        console.log('=====>albumvideo list datasss:',data);
        console.log('==>testsss===>',data[0]);

    },[data])
    async function checkPermissions(){
        console.log('gallerypage camera exteranl저장소 외부접근권한:');
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
    
        console.log('checkPermission:',result);
        CameraRoll.getPhotos({
          first: 60,
          assetType: 'Videos', 
          groupTypes: 'All',/*Album,Event,Faces,Library,PhotoStream,SavedPhotos*/
          groupName: 'Camera',//전체 그냥 구별없이 모든 비디오성 데이터는 다보여준다.(추후에 cllapApp에 의해 처리되는 기타 비디오파일들:비디오컷팅파일등은 아예 저장안되게할예정.디버깅위해서 저장되게끔 하게끔 하는것일뿐.)
          include : ['playableDuration']
        })
        .then(res => {
          //setData(res.edges);
          setData(res.edges);
        })
        .catch((error) => {
           console.log(error);
        });
    
        CameraRoll.getAlbums({
          assetType:'Videos'
        }).
        then(res=>{
          console.log('getAblumss datass:',res);
        })
        .catch((error)=>{
          console.log('getAlbusms errosss:',error);
        });
      }

      const videoLoadControl=(video)=>{
        console.log('======>>변경된uri관련비디오 로드:',video);
        setvideo(video);
        //로드가 된 순간에 관련한player를실행한다. 
        if (mergedplayer !==undefined){
        console.log('meregdPlayer존재 갱신:',mergedplayer);    
        }
      }

    function videoplayToggle(){
        console.log('비디오 mregdplayer상태 및 비디오 재생,정지여부 ',video,paused,mergedplayer);
        console.log('==>비디오 seek가능여부:',mergedplayer.seek);

        setpaused(!paused);
        if(mergedplayer.seek){
            mergedplayer.seek(24,0.5);

        }
    }
    function videoEnd(){
        console.log('==>비디오 end시에:',video);
        setpaused(true);
    }
    return(
        <View style={styles.container}>

               {/*} <Video 
                source={{uri:data[18]&&data[18].node.image.uri}}
                controls={false}
                ref={(ref)=>{
                    setmergedplayer(ref)
                }}
                muted={false}
                style={styles.videoPlayerViewStyle}
                paused={paused}
                resizeMode={"contain"}sinjae  
                onLoad={videoLoadControl}
                onEnd={videoEnd}
                repeat={false}
                onAnimatedValueUpdate={()=>{}}
            />*/}
            <TouchableOpacity onPress={videoplayToggle}>
            <VideoPlayer
                    video={{ uri: data[18]&&data[18].node.image.uri }}
                style={styles.videoPlayerViewStyle}
                ref={(ref)=>{
                    setmergedplayer(ref);
                }}
                />
            </TouchableOpacity>
        </View>
    )
}


const styles = EStyleSheet.create({
  container: {
    flex: 1, width:"100%",height:"100%",
    flexDirection: 'column',
    backgroundColor: '#D8CDDE',
  },
  fullScreen: {
    width:"100%",
    height:"100%",
    backgroundColor:"#000"
  },
  headerContainer: {
    backgroundColor: '#F4F4FC',
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%",
    height:"90rem",
    flexDirection: 'row',
    display:"flex",bottom:"10rem",
    borderRadius:"20rem"
  },
  headercenter: {
    width:"33%",
    height:"70rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerleft: {
    width:"33%",paddingLeft:"20rem",
    height:"70rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    display:"flex",flexDirection:"row"
  },
  headerright: {
    width:"33%",paddingRight:"24rem",
    height:"70rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    display:"flex",flexDirection:"row"
  },
  galleryButton:{
  },
  leftButton:{
  },
  title:{
    color: '#000',fontWeight:"bold",fontSize:19
  },
  
  headerContainer2:{
    backgroundColor:"#F4F4FC",height:"60rem",
    borderRadius:"20rem",alignItems:"center",
    justifyContent:"flex-start",
    width:"100%",flexDirection:"row",display:"flex",
    bottom:"20rem", paddingLeft:"30rem",paddingRight:"30rem"
  },
  galleryMenu:{
    minWidth:"60rem",backgroundColor:"#F7F7FF",alignItems:"center",justifyContent:"center",
    height:"30rem",borderRadius:"15rem",marginLeft:"3rem",marginRight:"3rem",
    paddingLeft:"15rem",paddingRight:"15rem",
    fontWeight:"bold",color:"#A38DCC",
  },
  galleryMenuTxt:{
   
    fontWeight:"bold",color:"#A38DCC"
  },
  galleryMenuActive:{
    minWidth:"60rem",backgroundColor:"#A38DCC",alignItems:"center",justifyContent:"center",
    height:"30rem",borderRadius:"15rem",marginLeft:"3rem",marginRight:"3rem",
    paddingLeft:"15rem",paddingRight:"15rem",
    fontWeight:"bold",color:"white",
  },
  galleryMenuTxtActive:{
   
    fontWeight:"bold",color:"white"
  },
  listContainer:{
    width:"100%",paddingBottom:"140rem",
    alignItems: 'center',
    justifyContent: 'center',
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
    bottom:"18%",
    right:"20rem",
    borderRadius : 50,
  },
  NextButton:{
    width:"55rem",height:"55rem"
  },
  videoPlayerViewStyle: {
      backgroundColor: '#ECF0F1',
      borderColor: '#B9C3C7',
      borderRadius: 5,
      borderWidth: 1,
      height: "600rem",
      width: "100%",
      marginVertical: 20,
      marginHorizontal: 20
  },
});

