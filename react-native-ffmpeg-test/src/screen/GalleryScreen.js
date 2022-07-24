import React, { useState, useEffect,useRef} from 'react';
import { Dimensions, FlatList, Text, Image, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import CameraRoll from "@react-native-community/cameraroll";
import CaptureVideoModal from '../component/CaptureVideoModal';
import CaptureGalleryItem from '../component/CaptureGalleryItem';
import GalleryBottomVideoList from '../component/GalleryBottomVideoList';
import NextIcon from '../img/nextBtn.png';
import LoaderIcon from '../img/loader.png';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';

import NextIcon_ from '../img/icon_arrow_next.png';
import PrevIcon_ from '../img/icon_arrow_back.png';
import cameraIcon from '../img/icon_camera.png';

import {
  enableLogCallback,
  enableStatisticsCallback,
  executeFFmpeg,
  executeFFmpegAsync,
  executeFFprobe,
  getLogLevel
} from '../react-native-ffmpeg-api-wrapper';
import {ffprint} from '../util';
import VideoUtil from '../video-util';

//import RNFetchBlob from 'rn-fetch-blob'
import Test from '../test-api';
import { showPopup,hidePopup,Toast } from '../popup';
import {ProgressModal} from "../progress_modal";

export default function GalleryScreen({navigation,route}){

  //모달관련
  let popupReference=useRef();
  let progressmodal=useRef();
  const hideProgressDialog=()=>{
    progressmodal.current.hide();
  };
  const showProgressDialog=()=> {
     // CLEAN STATISTICS
     progressmodal.current.show(`normal Processing`);
  }

  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [video, setVideo] = useState("");
  const [videoList, setVideoList] = useState([]);
  const [player,setplayer] = useState("");
  const [paused,setpaused] = useState(false);
  

  const [gallerymenu,setGallerymenu] = useState(0);
  const menuSelect=(index)=>{
    setGallerymenu(index);
  }
  useEffect(()=>{
    console.log("galleryMenus선택::",gallerymenu);
  },[gallerymenu]);

  const [reqUserid,setreqUserid] = useState(30);//요청userid값

  const onGoBack = async () =>{

    navigation.goBack();
 }

  const logCallback=(log)=>{
    console.log('FFMPEG GALLERYSCREEN LOGSSS:',log);
  }
  useEffect(() => {
    console.log('galleryScreen 페이지  도달::',navigation,route);
    navigation.addListener("focus",(_)=>{
      console.log('galleryScreen페이지로드 focusingsss:');
      setActive();
    });
    setreqUserid(route.params.user_id!=0?route.params.user_id:30);
  },[])

  useEffect(()=>{
    console.log('페이지 초기로드 갤러리데이터들<외부저장소>>',data);
  },[data]);
  useEffect(()=>{
    console.log('(gallery_select)videoList data listss:',videoList);
  },[videoList]);
 

  const setActive=()=>{
    ffprint("GALELRY TAB actiavtedd");

    checkPermissions(); 
    // setreqUserid(route.params['user_id'])
    enableLogCallback(logCallback);
    enableStatisticsCallback(undefined);

    //showPopup(popupReference,"GALLERY PAGE TAB");
  }
   
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
      //groupName: 'Camera',//전체 그냥 구별없이 모든 비디오성 데이터는 다보여준다.(추후에 cllapApp에 의해 처리되는 기타 비디오파일들:비디오컷팅파일등은 아예 저장안되게할예정.디버깅위해서 저장되게끔 하게끔 하는것일뿐.)
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
 
  function onClickActive(item,isCheck){
    let list = videoList;
    let url = item.node.image.uri;
    console.log('선택대상체:',item);
    list = list.filter(e => e.node.image.uri != url);
    if(!isCheck){
      list.push(item);
    }
    console.log('적용리스트:',list);
    
    if(list.length <6){
      setVideoList([...list]);
    }
  }


  function onPressEvent(item){
    console.log('LongPress Event 실행:',item);
    setVideo(item); //node.image.uri
    setModalVisible(true);
  }
 
 
  async function saveImage(uri,s3upload_url_datagatherings){
    console.log('SAVE IMAGE REQUEST URISS:',uri);
    //let results= await CameraRoll.save(uri);

    //방법1
    /*
    let formData=new FormData();
    if(uri){
      console.log('URI requestsss:',uri);
      formData.append("user_id",30);
      formData.append("videotake",{
        name:"vidoetakesss.mp4",
        uri: uri,
        type:'video/mp4'
      })
    }*/

    let blob_data=String(RNFetchBlob.wrap(uri));
    //방법2
    let formData=[];
    formData.push({
      //name:'user_id',data:String(30)
      name:"user_id",data:String(reqUserid)
    });
    formData.push({
      name:'videotake', filename:'videotakesss.mp4', data:blob_data
    })

    //var base_url="https://teamspark.kr:8080/api/videotake_uploads";
    var base_url="https://teamspark.kr:8087/media/regist";
    console.log('base URLSS REQUESTSS:',base_url);

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
      console.log('json resultss upload reulstsss:',response_json);

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
        console.log('resusltsss:',resp,typeof(resp));
        console.log('resultss object:',JSON.parse(resp.data));
        let get_data=JSON.parse(resp.data)['result'];
        console.log('==>media/regist 업로드요청결과파일:',get_data);
        //let prev_durationlist=[...durationlist];
        //prev_durationlist.push({
         // url: get_data,
         // duration: temp_store.duration
        //})
        //s3upload_url_datagatherings.push(get_data);
        //setdurationlist(prev_durationlist);
        
        //duration요청
        let req_url="https://teamspark.kr:8080/api/videoInfoGet";
        let response1=await fetch(req_url,{
          method:'POST',
          headers:{
            Accept: 'application/json',
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            urlfile: get_data
          })
        });
        console.log('await responsess:',response1);
        let response_json1=await response1.json();
        console.log('await response1 resultss:(duration정보)',response_json1,response_json1.duration);
        let get_duration=response_json1.duration;

        //thumbnail요청
        let req_url2="https://teamspark.kr:8080/api/videoFrameThumbnail";
        let response2=await fetch(req_url2,{
          method:"POST",
          headers:{
            Accept:"application/json",
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            urlfile: get_data
          })
        });
        console.log('await responsess2:',response2);
        let response_json2=await response2.json();
        console.log('await response2 resultsss::(thumbnail)',response_json2,response_json2.thumbnail);
        let get_thumbnail=response_json2.thumbnail;

        s3upload_url_datagatherings.push({
          url: get_data, duration: get_duration, clientsrc: get_thumbnail
        });
      })
      .catch((err)=>{
        console.log('errrosss:',err);
      })
    }catch(error){
      console.log('errorsss inccurr:',error);
    }
  }
  
  async function submitFiles(){

    if(reqUserid==0){
      alert("로그인후 이용해주세요");
      navigation.navigate("Home");
      return false;
    }
    if(videoList.length==0){
      alert("촬영or영상 선택이 필요합니다.");
      return false;
    }

    console.log('GALLERY PAGE SUBMITFILESS<<gallery>> 선택파일들:',videoList);
    let takefileList=[];
    for(let i=0; i<videoList.length; i++){
      takefileList.push({
        uri : videoList[i].node.image.uri,
        duration : videoList[i].node.image.playableDuration
      })
    }
    try{

      console.log('>>음악선택페이지로 넘길 선택테이크비디오(duration)포함정보:',takefileList);

      //if(standby_result){
        navigation.navigate(
          "MUSICSELECT",
          {
            mem_id : reqUserid,//어떤 로그인유저가 자신갤러리 어떤 테이크비디오목록들 한건지.추적
            takeFileList: takefileList
          })
      //}
    }catch(error){
      console.log('ERROR NICCURRS:',error);
      if(takefileList.length>=1){
        navigate.navigate(
          "MUSICSELECT",
          {
            mem_id : reqUserid,//어떤 로그인유저가 자신갤러리 어떤 테이크비디오목록들 한건지.추적
            takeFileList: takefileList
          }
        )
      }
    }
  }

    return (
      <>
      <View style={styles.container}>             
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.headerleft} onPress={onGoBack}>
              <Image source={PrevIcon_} style={styles.leftButton}/>
            </TouchableOpacity>
            <View style={styles.headercenter}>
                <Text style={styles.title}>LIBRARY</Text>
            </View>
            <TouchableOpacity style={styles.headerright}>
              <Image source={cameraIcon} style={styles.galleryButton}/>
            </TouchableOpacity>
          </View>
          {/*<View style={styles.headerContainer2}>
            <TouchableOpacity style={gallerymenu==0?styles.galleryMenuActive:styles.galleryMenu} onPress={()=>menuSelect(0)}>
              <Text style={gallerymenu==0?styles.galleryMenuTxtActive:styles.galleryMenuTxt}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={gallerymenu==1?styles.galleryMenuActive:styles.galleryMenu}onPress={()=>menuSelect(1)}>
              <Text style={gallerymenu==1?styles.galleryMenuTxtActive:styles.galleryMenuTxt}>VIDEO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={gallerymenu==2?styles.galleryMenuActive:styles.galleryMenu}onPress={()=>menuSelect(2)}>
              <Text style={gallerymenu==2?styles.galleryMenuTxtActive:styles.galleryMenuTxt}>PICTURE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={gallerymenu==3?styles.galleryMenuActive:styles.galleryMenu}onPress={()=>menuSelect(3)}>
              <Text style={gallerymenu==3?styles.galleryMenuTxtActive:styles.galleryMenuTxt}>GIF</Text>
            </TouchableOpacity>
           </View>*/}

          <View style={styles.listContainer}>
            <FlatList
                data={data}
                numColumns={3}
                renderItem={({ item }) => {
                  return (
                    <CaptureGalleryItem 
                      item={item} 
                      videoList={videoList}
                      onPressEvent={onPressEvent} 
                      onClickActive={onClickActive}
                    />                   
                  );
                }}
            />
          </View>
          <GalleryBottomVideoList videoList={videoList} onClickActive={onClickActive} onPressEvent={onPressEvent}></GalleryBottomVideoList>
          <CaptureVideoModal modalVisible={modalVisible} setModalVisible={setModalVisible} video={video}></CaptureVideoModal>
          {
            videoList.length > 0 ?
            <TouchableOpacity style={styles.submitContainer} onPress={submitFiles}>
              <Image resizeMode={"stretch"} source={NextIcon} style={styles.galleryButton} />
            </TouchableOpacity>
            :
            null
          }

          <Toast ref={popupReference} position="center"/>
          <ProgressModal
              visible={false}
              ref={progressmodal}/>
        </View>
        {/*<View style={styles.container}>
          <TouchableOpacity onLongPress={onPressEvent2} style={styles.videoPlayerViewStyle}>
          <Video
              source={{uri: getVideoFile()}}
              ref={(ref) => {
                  setplayer(ref)
              }}
              hideShutterView={true}
              paused={paused}
              // onError={this.onPlayError}
              resizeMode={"stretch"}
              style={styles.videoPlayerViewStyle}/>
            </TouchableOpacity>
        </View>*/}
      </>
    );
}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#D8CDDE',
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
