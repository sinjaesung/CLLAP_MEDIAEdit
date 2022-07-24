import React, { useState, useEffect} from 'react';
import { Dimensions, FlatList, Text, Image, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import CameraRoll from "@react-native-community/cameraroll";
import CaptureVideoModal from '../component/CaptureVideoModal';
import CaptureGalleryItem from '../component/CaptureGalleryItem';
import GalleryBottomVideoList from '../component/GalleryBottomVideoList';
import NextIcon from '../img/nextBtn.png';
import LoaderIcon from '../img/loader.png';

//import RNFetchBlob from 'rn-fetch-blob'


export default function GalleryScreen({navigation,route}){


  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [videos, setVideos] = useState("");
  const [videoList, setVideoList] = useState([]);
  const [reqUserid,setreqUserid] = useState(30);//요청userid값
  //const [loadVideo,setLoadVideo] = useState("");
  //const [durationlist, setdurationlist] = useState([]);

  useEffect(() => {
     checkPermissions(); 
     setreqUserid(route.params['user_id'])
  }, [])
  useEffect(()=>{
    console.log('===>userid를 통해서 전달값0여부 판단으로 로그인여부 판단:',reqUserid);

  },[reqUserid]);

  
  async function checkPermissions(){
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

    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Videos',
      
    })
    .then(res => {
      //setData(res.edges);
      setData(res.edges);
    })
    .catch((error) => {
       console.log(error);
    });
  }
 
  function onClickActive(item,isCheck){
    let list = videoList;
    let url = item;
    list = list.filter(e => e != url);
    if(!isCheck){
      list.push(url);
    }
    console.log('적용리스트:',list);
    
    if(list.length <6){
      setVideoList([...list]);
    }
  }

  useEffect(()=>{
    console.log('videoList data listss:',videoList);
  },[videoList])

  /*const onLoadVideo = async (video) =>{

    console.log('onLoadVivdeosss galleryPage:',video,loadVideo);
    let temp_store={
      uri:loadVideo,
      duration:video.duration
    };
    //let prevdurationlist=[...durationlist];
    //prevdurationlist.push(temp_store);

    saveImage(temp_store);

   // setdurationlist(prevdurationlist);
    //setTakeFileList(list => { list.push({uri:loadVideo,duration:video.duration}); return [...list]; });
    
  }*/
 
  function onPressEvent(item){
    setVideos(item); 
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
  
  /*useEffect(()=>{
    console.log('galleryScreen duraation Listss:',durationlist);
  },[durationlist])*/

  async function submitFiles(){
    var s3upload_url_datagatherings=[];

    if(reqUserid==0){
      alert("로그인후 이용해주세요");
      navigation.navigate("Home");
      return false;
    }

    if(videoList.length==0){
      alert("촬영or영상 선택이 필요합니다.");
      return false;
    }
    for(var i =0;i<videoList.length;i++){
      console.log('videoList saveImage executesss:',videoList[i]);

      saveImage(videoList[i],s3upload_url_datagatherings);
    }

    async function standby(){
      console.log('[[[[[[submitFiles대기함수 standby호출]]]]]]');
      return new Promise((resolve,reject)=>{
        let standby_cnt=0;
        let standby_interval=setInterval(function(){
          if(videoList.length === s3upload_url_datagatherings.length){
            console.log('submifiles standby대기함수 종료!!]]]]]');
            clearInterval(standby_interval);
            resolve(true);
          }
          if(standby_cnt==6000){
            clearInterval(standby_interval);
            console.log('timeout Errrossssss incurrrr ineterval');
            reject(new Error("timeout error"));
          }
          standby_cnt++;
          
        },500);
      });
    }
    try{
      let standby_result=await standby();
      console.log('adapt s3upload_url_datagatheringsss: 페이지이동!!!>>> APP MUSICs',s3upload_url_datagatherings,videoList.length, s3upload_url_datagatherings.length);

      if(standby_result){
        navigation.navigate(
          "MUSICSELECT",
          {
            s3upload_url_datagatherings: s3upload_url_datagatherings
          })
      }
    }catch(error){
      console.log('ERROR NICCURRS:',error);
      if(durationlist.length>=1){
        navigate.navigate(
          "MUSICSELECT",
          {
            s3upload_url_datagatherings: s3upload_url_datagatherings
          }
        )
      }
    }
  }

    return (
      <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.capture}></View>
            <View style={styles.capture}>
                <Text style={styles.title}>LIBRARY</Text>
            </View>
            <View style={styles.capture}></View>
          </View>
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
          <CaptureVideoModal modalVisible={modalVisible} setModalVisible={setModalVisible} videos={videos}></CaptureVideoModal>
          {
            videoList.length > 0 ?
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
    backgroundColor: '#DFB8D3',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderRadius:20,
    bottom:"20rem",
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%",
    height:"90rem",
    flexDirection: 'row'
  },
  listContainer:{
    width:"100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    width:"33%",
    height:"70rem",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    color: '#DFB8D3',
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
