
import React, { useState, useEffect,useRef} from 'react';
import { Dimensions, TouchableOpacity, Text, View, PermissionsAndroid,Image , ScrollView ,BackHandler,Alert} from 'react-native';
import { RNCamera } from 'react-native-camera';
import EStyleSheet, { clearCache, setStyleAttributePreprocessor } from 'react-native-extended-stylesheet';
//import RNFetchBlob from 'rn-fetch-blob';
// import Video from 'react-native-video';

import CameraRoll from "@react-native-community/cameraroll";
import RNFS from 'react-native-fs';

import NextIcon from '../img/nextBtn.png';
import NextSave from '../img/takeCutSave.png';

import LoaderIcon from '../img/loader.png';
import { showPopup } from '../popup';
//import style from 'react-native-beautiful-video-recorder/lib/RecordingButton/style';
//import  {NativeModules} from 'react-native';
//const RNFetchBlob = NativeModules.RNFetchBlob;
import Video, { FilterType } from 'react-native-video';

//ffmpeg Process
import {
  enableLogCallback,
  enableStatisticsCallback,
  executeFFmpeg,
  executeFFmpegAsync,
  executeFFprobe,
  getLogLevel,
  listExecutions
} from '../react-native-ffmpeg-api-wrapper';
import {ffprint,today} from '../util';
import VideoUtil from '../video-util';
import {ProgressModal} from "../progress_modal";

//import LodingModal from './';
//import {useSelector} from 'react-redux';
import WebView from 'react-native-webview';

export default function TakeEditScreen({navigation,route}){
  
  //console.log('===>TakeEditScreen:',navigation,route);
 
  const blackempty_cachevideo=`${RNFS.CachesDirectoryPath}/blank_videosample.mp4`;

  const [player,setplayer] = useState([undefined,undefined,undefined,undefined,undefined]);
  const [mergedplayer,setmergedplayer] = useState("");
  const [timelineSeek,setTimelineSeek] = useState("");
  const [secondsview,setSecondsview] = useState(0);

  const [abstractplayStatus_,setAbstractplayStatus_] = useState(false);
  const [GetTimeout,setGetTimeout] = useState("");
  const [playoutputUrl,setplayOutputUrl] = useState(`${RNFS.CachesDirectoryPath}/blank_videosample.mp4`);
  const [playstartpos,setplayStartpos] = useState(0);
  const [playtakeindex,setplayTakeIndex] = useState(0);

  const [take_video_cutprocess_info,setTake_video_cutprocess_info] = useState([]);//비디오자른리스트 정보.
  const [take_video_cutprocess_info_display,setTake_video_cutprocess_info_display]= useState([]);
  const [isdata,setIsData] = useState(false);//컷팅정보받은여부
  const [isvalid,setIsValid] = useState(false);//유효한데이터타임라인여부

  const [video,setVideo] = useState(`${RNFS.CachesDirectoryPath}/mergedPreview.mp4`);
  const [paused,setpaused] = useState(true);//display just play status
  const [modalVisible,setModalVisible] = useState(false);

  const [takeFileList, setTakeFileList] = useState([]);
  const [thumbnailList_client,setThumbnailList_client]=useState([]);
  // data/user/0/com.arthenica.reactnative.ffmpeg.test/cache/videothumbnail1.jpg
  const [previewThumbnail,setPreviewThumbnail] = useState("");
  //const [thumbnailmakecnt,setthumbnailmakecnt] = useState(0);//페이지로드후 takeFileList첫 갱신이후,이론상 n개의테이크파일개수만큼 앱캐시데이터에 파일별 섬네일get한 리스트를담는데, 이러한 요청이 한번만이뤄져야하는데, 불필요하게 2회이상요청되는것을 막기위함.

  const [selectmusic,setSelectmusic] = useState(0);
  const [selecteffect,setSelecteffect]= useState("");
  const [select_transition,setSelect_transition]=useState("");

  const [userid,setuserid] = useState(30);
  const [cutTakelist,setCutTakelist] = useState([]);//컷팅 변경 처리데이터(앱케시영상데이터 n개)리스트데이터
  //const [progressModalReference,setProgressModalReference] = useState(0);

 
  function openVideoFull(){
    console.log("modalVisible:",modalVisible);
    setModalVisible(!modalVisible);
  }
  function videoplayToggle(){
    console.log('videopalyTOGGLE상태비디오 컷정보:',take_video_cutprocess_info,take_video_cutprocess_info_display);
    if(!isvalid){
        alert("편집 타임라인을 확인해주세요.");
        return false;
    }
    if(take_video_cutprocess_info_display.length==0){
        alert("재생할 정보가 없습니다");
        return false;
    }
    if(abstractplayStatus_ == 1){
        console.log('정지버튼 누른경우에만 실행!:',timelineSeek);
        setAbstractplayStatus_(0);
        timelineSeek['setAbstractplayStatus'](0);

    }else{
        console.log('재생버튼 누른경우에만 실행!:',timelineSeek);
        setAbstractplayStatus_(1);
        timelineSeek['setAbstractplayStatus'](1);
        timelineSeek['timeline_seek']();//최초재생버튼을 누른경우 함수 최초호출때는 playRequest가넘어온다. 1로 넘어오고, 일단처음엔 abstractPlaystatus는 정지상태일가능성이높다.abstract값0,playRequest값도 0인것은 정지요청이이뤄지고난시점이다. abstarct값만0이고,palyRequest값은1인것은 정지이후재생버튼막누른경우로 함수실행한다. abstract값이1이고,playRequest가따로없는케이스는 재생중인경우
    }
  }
  function onPressEvent(){
    console.log('LongPress Event 실행:',video);
    //setVideo(item); 
    setModalVisible(true);
  }
  //처리파일 재생관련
  const playVideo=() =>{
    console.log('playVideo:',player);
      if (player !== undefined) {
          player.seek(0);
      }
      setpaused(false)
  }
  const videoEnd=()=>{
      console.log('=========videoEndssss:============');
  }
  const videoLoad=(video)=>{
      console.log('========videoLoadssss=============',video);
  }
  const videoLoadControl=(video)=>{
      console.log('======>>동적으로 change되는 재생상태(timeline구간)에 따른 재생미디어결정에 따른 해당 변경된uri관련비디오 로드:',video);

      console.log('===>>(변경)로드된 순간확인된 테이크강 파일/takeindex/타임라인startpos정보:',playoutputUrl,playtakeindex,playstartpos);
      console.log(`=======>>>playtakeindex플레이형태타입:`,playtakeindex);
      console.log(`=====>>playvideotarget url:`,playoutputUrl);
      console.log(`=====>playstartpos seek재생시작할 시간지점:`,playstartpos);
      //로드가 된 순간에 관련한player를실행한다. 
      if (mergedplayer !==undefined){
          //console.log('meregdPlayer존재 갱신:',mergedplayer);
        if(playoutputUrl!=""){
            console.log('=====>playstartpos 이동비디오url seeking:',mergedplayer,playstartpos,playoutputUrl);
            mergedplayer.seek(playstartpos);//해당위치로 이동하며, 해당관련비디오필드에 playoutputUrl로 이미 로드되어있고,로드되기전에 관련 타이머스크립트에서설정된state값설정이후->변경된state에 따른 비디오로드후에 실행되는것이기에, 관련playoutputUrl,playtakeindedx,playstatrpot다있음.
            setpaused(false);
            timelineSeek['setMergedplayer'](mergedplayer);
        }
    }
  }
  
 //처리모달관련
  let progrssmodal=useRef();
  const hideProgressDialog=()=>{
    progrssmodal.current.hide();
  };
   const showProgressDialog=(message)=> {
     // CLEAN STATISTICS
    // progrssmodal.current.show(`Cutting Processing`);
    progrssmodal.current.show(message);

   }
 
   //웹뷰관련
  let webviewRef=useRef();
  /*const handleSetRef = _ref=>{
      webviewRef =_ref;
  }*/
  const handleEndLoading= e=>{
      //초기 웹뷰 로드때에만 관련 필요데이터 전달한다.duration만 넘긴다.(takelist)
    console.log('TAKEeditScreen page loadingENd');
    if(takeFileList && takeFileList.length>=1){
       console.log('WEBVIE에게 관련 필요데이터전달충족:',takeFileList,selectmusic,userid,selecteffect);
       webviewRef.current.postMessage(JSON.stringify({"takefilelist":takeFileList})) 
    }
  }

  async function nextStep(){
    console.log('===>take_video_cutproess_infosss:',take_video_cutprocess_info);
    
    if(!isvalid){
        alert("편집 타임라인을 확인해주세요.");
        return false;
    }
    if(take_video_cutprocess_info.length==0 ){
        alert("처리할 정보가 없습니다");
        return false;
    }
    setAbstractplayStatus_(0);
    timelineSeek['setAbstractplayStatus'](0);//정지시키고이동!

    if(take_video_cutprocess_info.length>=1){
        takeEditVideo_ffmpeg(take_video_cutprocess_info);
    }
  }
  //ffmpeg처리관련
  async function concurrent_command(index,type,filepath,take_video_cutprocess_info,cachetempPath,data_gathering_store){
    console.log('각 명령실행:',index,type,filepath,take_video_cutprocess_info,cachetempPath);

    function extract_file_callback(data_gathering,request_id,orderindex){
        console.log('extract file callback함수호출]]]]]');

        console.log('=====>tarnsfer paremters data_gathering,requestid:',data_gathering,orderindex);
        let store={};
        store['orderindex'] = orderindex;
        store['data_gathering'] = data_gathering;

        data_gathering_store.push(store);
    }

    let ffmpegCommand;
    if(type == 'slice'){
        ffmpegCommand= VideoUtil.video_subpart_slice_normal2(index,filepath,take_video_cutprocess_info,cachetempPath);

        console.log('make ffmpegCommand<slice>>:',ffmpegCommand);
    }else if(type == 'make'){
        ffmpegCommand=VideoUtil.video_subpart_slice_emptyvideomake(index,take_video_cutprocess_info,cachetempPath);

        console.log('make ffmpegCommand<blankEmptymake>>:',ffmpegCommand);
    }

    if(ffmpegCommand!=''){
        executeFFmpegAsync(ffmpegCommand,async(completedExecution)=>{
            console.log('concurrent<media slices actionss>:',completedExecution);
            if(completedExecution.returnCode===255){
                ffprint(`ffmpeg proess endedwithcancelfor buttnwithexeuteiId ${completedExecution.executionId}[[명령실패,취소처리]]`);
                
            }else{
                //각 요청큐에대해서 명령성공실행완료한경우에 
                ffprint(`ffmpeg process ended with rc ${completedExecution.returnCode} for withexecuteidId ${completedExecution.executionId}[[명령성공]]`);

                console.log('extract file callback함수호출]]]]] output파일 저장 및재생',index,type,filepath,take_video_cutprocess_info);
                //let store={};
                //store['orderindex'] = index;
                //store['type'] = type;//처리된 영상의타입이다.
                let data_gathering={};
                data_gathering[`${index}_data`] = cachetempPath;
                data_gathering[`orderindex`] = index;
                data_gathering['type'] = type;
                //store['data_gathering'] = data_gathering;
                console.log('저장데이터:',data_gathering);
                data_gathering_store.push(data_gathering);

                //컷팅파일저장.
                /*let results= await CameraRoll.save(cachetempPath);
                console.log('file store resultsss:',results);
                RNFS.stat(results).then(res=>{
                    console.log('RNFS STAT fileInformation resultss:',res);
                    console.log('res isDirecdtoery:',res.isDirectory());
                    console.log("res originalFilePath:",res.originalFilepath);
                    console.log("res isFiless:",res.isFile());
            
                    //data_gathering[`${index}_data`] = res.originalFilepath;

                   // data_gathering_store.push(data_gathering);
                }).catch(err=>{
                    console.log('readFile errorsss:',err);
                })*/

            }
        }).then(executionId=>{
            ffprint(`Async ffmpeg process target with arguments ${ffmpegCommand} and executionId ${executionId}`);
    
            listExecutions();
        })
    }
  }
  async function takeEditVideo_ffmpeg(take_video_cutprocess_info){
    showProgressDialog("Cutting Processing");
    console.log('[[[[[[[[[[]]===>대상비디오리스트 편집처리시작:]]]]]]]]]]]]]]]]',take_video_cutprocess_info);

    console.log('ExternalCachesDirectoryPath:',RNFS.ExternalCachesDirectoryPath);
    console.log('DownloadDirectoryPath:',RNFS.DownloadDirectoryPath);
    console.log('DocuemntDirecotoryPath:',RNFS.DocumentDirectoryPath);
    console.log('ExternalStorageDirectoryPath:',RNFS.ExternalStorageDirectoryPath);

    if(take_video_cutprocess_info.length >=1){
        let data_gathering_store=[];

        /*function extract_file_callback(data_gathering,request_id,orderindex){
            console.log('extract file callback함수호출]]]]]');

            console.log('=====>tarnsfer paremters data_gathering,requestid:',data_gathering,orderindex);
            let store={};
            store['orderindex'] = orderindex;
            store['data_gathering'] = data_gathering;

            data_gathering_store.push(store);
        }*/
        
        for(let s=0; s<take_video_cutprocess_info.length; s++){
            let item=take_video_cutprocess_info[s];

            if(item.takeindex!='blackempty'){
                let cachetempPath=`${RNFS.CachesDirectoryPath}/video_subpart${s+1}.mp4`;

                concurrent_command(s+1,"slice",item['localfile'],take_video_cutprocess_info[s],cachetempPath,data_gathering_store);
                //let ffmpegCommand=VideoUtil.video_subpart_slice_normal2(s+1,item['localfile'],extract_file_callback,take_video_cutprocess_info[s],cachetempPath);//해당 각takeindex별 매칭 로컬파일path별 관련정보로하여 영상자르기
            }else{
                let cachetempPath=`${RNFS.CachesDirectoryPath}/blank_video${s+1}.mp4`;

                concurrent_command(s+1,"make",null,take_video_cutprocess_info[s],cachetempPath,data_gathering_store);
                //let ffmpegCommand=VideoUtil.video_subpart_slice_emptyvideomake(s+1,extract_file_callback,take_video_cutprocess_info[s],cachetempPath);//검은배경영상 생성
            }
            /*if(s==0){
                let cachetempPath=`${RNFS.CachesDirectoryPath}/video_subpart${s+1}.mp4`;

                let result=VideoUtil.video_subpart_slice_normal2(s+1,item['localfile'],extract_file_callback,take_video_cutprocess_info[s],cachetempPath);//해당 각takeindex별 매칭 로컬파일path별 관련정보로하여 영상자르기
            }*/
        }

        function promise_function_standby(){
            return new Promise((resolve,reject)=>{
                let callback_timeout=0;
                let callback_standby= setInterval(function(){
                    if(data_gathering_store.length == take_video_cutprocess_info.length){
                        clearInterval(callback_standby);

                        resolve(data_gathering_store);
                    }
                    if(callback_timeout==4000){
                        clearInterval(callback_standby);
                        reject(new Error("callback timeout error"));
                    }
                    callback_timeout++
                },500);
            })
        }
        let data_gathering=await promise_function_standby();
        hideProgressDialog();//한 사이클의 영상 처리완료>>>
        data_gathering.sort(function(a,b){
            return a.orderindex - b.orderindex;
        })
        console.log('return set outset reusultsss:',data_gathering);

        let cuttakelist=[];
        for(let j=0; j<data_gathering.length; j++){
            cuttakelist.push(
                {
                    'filepath':data_gathering[j][`${j+1}_data`],
                    'type': data_gathering[j]['type']
                });

            let filedata=data_gathering[j][`${j+1}_data`];
            console.log('process output filedata:',filedata);
            //let results= await CameraRoll.save(filedata);
            //console.log('file store resultsss:',results);
        }
        console.log('cuttakelist:',cuttakelist);//이게 처리가된 편집처리된 각 영상들임.

        if(cuttakelist[cuttakelist.length-1]['type']=='make'){
            console.log('====>>최종처리 전달 비디오리스트에서 마지막 take가 emtpy였던경우에 한해서 해당 대상을 지웁니다.');
            cuttakelist.splice(cuttakelist.length-1,1);
        }
        console.log('===>adapt cuttakelist finalsss:',cuttakelist);

        //return false;
        navigation.navigate(
            "PreviewProcessScreen",
            {
                mem_id: userid,
                //select_music: receive_data['data'],
                select_music: selectmusic,
                select_effect: selecteffect,
                select_transition : select_transition,
                cuttakelist: cuttakelist
             }
        )
        //setCutTakelist(cuttakelist);
    
        /*showProgressDialog();
        //ExternalStorageDirectoryPath CachesDirectoryPath
        //${RNFS.CachesDirectoryPath}/video_subpart${s+1}.mp4
        let mergedVideoPath=`${RNFS.CachesDirectoryPath}/mergedPreview.mp4`;

        let ffmpegCommand2=await VideoUtil.mergedVideos(cuttakelist,mergedVideoPath);
        console.log('[[[[[[병합영상 처리관련 스크립트 ffmegComamnd:]]]]]]',ffmpegCommand2);

        if(ffmpegCommand2!=''){
            executeFFmpegAsync(ffmpegCommand2,async(completedExecution)=>{
                console.log('<<media merged actionss>:',completedExecution);
                if(completedExecution.returnCode===255){
                    ffprint(`ffmpeg proess endedwithcancelfor hexeuteiId ${completedExecution.executionId}[[명령실패,취소처리]]`);
                    
                }else{
                    //각 요청큐에대해서 명령성공실행완료한경우에 
                    ffprint(`ffmpeg process ended with rc ${completedExecution.returnCode} for withexecuteidId ${completedExecution.executionId}[[명령성공]]`);
                    console.log('처리된앱 캐시 임시저장소 병합영상 파일:',mergedVideoPath);

                    setVideo(mergedVideoPath);
                    hideProgressDialog();//영상병합까지 모두 처리완료>>>

                    playVideo();
                    let results= await CameraRoll.save(mergedVideoPath);
                    console.log('file store resultsss:<<최종병합영상>>',results);

                }
            }).then(executionId=>{
                ffprint(`Async ffmpeg process target with arguments ${ffmpegCommand2} and executionId ${executionId}`);
        
                listExecutions();
            })
        }*/
    }
  }
  //웹뷰,리액네티브간 통신(리액트로부터의 편집통신데이터)수신
  function onMessage(event){
      console.log('webView로부터 전달받은 데이터(테이크편집페이지통신):',event.nativeEvent.data);
      let receive_data=JSON.parse(event.nativeEvent.data);
      
      if(receive_data.type=="EditTake_by_interaction" || receive_data.type=='EditTake_by_button'){
          var take_video_cutprocess_info=receive_data['data'];
          var take_video_cutprocess_infocopy=receive_data['data'];
          var isvalids=receive_data['isvalid'];

          if(take_video_cutprocess_info.length==0){
            setTake_video_cutprocess_info([]);
            setTake_video_cutprocess_info_display([]);
              return false;//처리할비디오없는경우
          }
          let takeindex_count=0;
          for(let f=0; f<take_video_cutprocess_info.length; f++){
              if(take_video_cutprocess_info[f].takeindex!='blackempty'){
                  takeindex_count++;
              }
          }
          if(takeindex_count==1&& takeFileList.length==1){
            take_video_cutprocess_info = take_video_cutprocess_info.filter(element=>element.takeindex!='blackempty');//순수takeindex비디오개체만남김(한개)
            take_video_cutprocess_infocopy=take_video_cutprocess_infocopy.filter(element=>element.takeindex!='blackempty');
          }

          console.log('take_VIDEO_CUTPROCESS_INFO:',take_video_cutprocess_info,take_video_cutprocess_infocopy);
          setTake_video_cutprocess_info(take_video_cutprocess_info);
          setTake_video_cutprocess_info_display(take_video_cutprocess_infocopy);
          setIsData(true); 
          setIsValid(isvalids);
      }else if(receive_data.type=='EditTake_by_playerSeek'){
        if(receive_data.data && ('seekpos' in receive_data.data)){
            console.log('===>playercontrol조작의 경우 웹뷰통신:',isvalid);

            if(!isvalid){
                alert("편집 타임라인을 확인해주세요.");
                return false;
            }
            if(take_video_cutprocess_info_display.length==0){
                alert("재생할 정보가 없습니다");
                return false;
            }
            setAbstractplayStatus_(0);
            timelineSeek['setAbstractplayStatus'](0);//잠시정지한다.정지하면서 기존 clearTimeout한다.

            setAbstractplayStatus_(1);
            timelineSeek['setSeconds'](receive_data.data.seekpos);
            timelineSeek['setAbstractplayStatus'](1);
            timelineSeek['timeline_seek']();
        }
        
      }
  }
  useEffect(()=>{
    console.log('takevideocutprocess info edited infosss<<Webview전달데이터 갱신>>>:',take_video_cutprocess_info, take_video_cutprocess_info_display);
    console.log('======>편집정보변경시마다 정보 재구성되는데, 이를 위해기존 timeout등 실행정보등 정지처리하여 기본적으로 정지상태로 강제정지돌입한다',timelineSeek);

    if(take_video_cutprocess_info){
        if(take_video_cutprocess_info[0]){
            let target_index=take_video_cutprocess_info[0]['takeindex'];
            if(target_index!='blackempty'){
                console.log('setThumbslisss ',thumbnailList_client[target_index-1]);
                setPreviewThumbnail("file://"+thumbnailList_client[target_index-1]);
            }else if(target_index=='blackempty'){
                console.log('set Dark thumbnsailsss:');
                setPreviewThumbnail("");
            }
        }
    }
    
    setAbstractplayStatus_(0);
    setSecondsview(0);
    //timelineSeek['setAbstractplayStatus'](0);
    if(timelineSeek && timelineSeek['setAbstractplayStatus']){
        timelineSeek['setAbstractplayStatus'](0);
    }

    var timeline_seek=(function closure_videoplay_return(take_video_cutprocess_info_display){
        console.log('===============<<<<Timeline editing 변화시점마다 한번 호출 closure_videoplay_returnss=================>>>>',take_video_cutprocess_info_display);
        let seconds=0;let abstractplaystatus=0;
        let lastest_timeoutRequest=null;//가장 마지막 최근의 setTimeout요청 요청Queue명령이다.1초뒤 실행될명령.
        let seek_origin=false;//기본값은false 기본재생, 탐색형태의 재생시작origin인 경우(한번)true한번.
        
        let lastest_videoUrl=`${RNFS.CachesDirectoryPath}/blank_videosample.mp4`;
        let mergedPlayer_closure;
        function setAbstractplayStatus(value){
            abstractplaystatus=value;//값 지정. 0:최초초기화, 0->1:최초재생실행요청, 1->0:정지요청
            console.log('===>재생/정지여부요청:',value);
            if(value==0){
                //console.log('====>정지요청',timeline_seek,clearTimeout(timeline_seek));
                //clearTimeout(timeline_seek);
                console.log('=====>>>정지요청:>>>>',timeline_seek,lastest_timeoutRequest,clearTimeout(lastest_timeoutRequest));
                clearTimeout(lastest_timeoutRequest);//해당 실행되려고하는요청을 취소하는개념이다.
                setpaused(true);
            }else if(value==1){
                console.log('===>미디어 재생요청');
                setpaused(false);
                setSecondsview(0);
            }
        }
        function setSeconds(value){
            seconds=value;

            console.log(`===>해당 ${value}seconds 부분으로 abstract player위치이동 실행>>`);
            setSecondsview(value); seek_origin=true;
        }
        function getSeconds(){
            return seconds;
        }
        function setMergedplayer(value){
            mergedPlayer_closure=value;

            console.log('===>closure전용 mergedplayer변수:',value);

        }

        function timeline_seek(){
            console.log('timeline_seek함수호출 클로저(상위) 부모 변수 참조 seconds변수값:',seconds,take_video_cutprocess_info_display);
            console.log('abstractplaystatus value referss:',abstractplaystatus);
            
            setSecondsview(seconds);
            webviewRef.current.postMessage(JSON.stringify({"playbarstatus":seconds})) 

            if(abstractplaystatus==0){
                console.log('=====>재생 비디오 정지요청상태로 확인,일련의어떤 명령도 처리하지않음<not 재귀호출>',abstractplaystatus);
            }
            else{
                console.log('=======>>>>timeline_seeking 관련 재생부 실행스크립트====>>>>>>>>>>>>>>>>>>>');
                console.log('===>미디어재생여부 재생중상태:',abstractplaystatus);
                let takeindex_count=0;
                for(let f=0; f<take_video_cutprocess_info_display.length; f++){
                    if(take_video_cutprocess_info_display[f].takeindex!='blackempty'){
                        takeindex_count++;
                    }
                }
                if(takeindex_count==1&& takeFileList.length==1){
                    //take_video_cutprocess_info = take_video_cutprocess_info.filter(element=>element.takeindex!='blackempty');//순수takeindex비디오개체만남김(한개)
                    //원테이크 하나를 다루는경우(원테이크)케이스의경우 블랙비디오는 다 없애고,임의적으로 그형태로 잘린것을 형상화 재생해야함.
                    if(take_video_cutprocess_info_display[0]){
                        let onetake_targetvideo_startpos=take_video_cutprocess_info_display[0]['startpos'];
                        let onetake_targetvideo_endpos = take_video_cutprocess_info_display[0]['endpos'];
                        let take_targetvideo_videostartpos= take_video_cutprocess_info_display[0]['video_real_timeline_startpos'];
                        let take_targetvideo_videoendpos= take_video_cutprocess_info_display[0]['video_real_timeline_endpos'];

                        let adapt_visible_targetvideo_timelinestart= onetake_targetvideo_startpos - onetake_targetvideo_startpos;//start-start
                        let adapt_visible_targetvideo_timelineend= onetake_targetvideo_endpos - onetake_targetvideo_startpos;//end-start
            
                        take_video_cutprocess_info_display[0]['timelinestart'] = adapt_visible_targetvideo_timelinestart;
                        take_video_cutprocess_info_display[0]['timelineend']= adapt_visible_targetvideo_timelineend;
                        if(take_targetvideo_videostartpos && take_targetvideo_videoendpos){
                            take_video_cutprocess_info_display[0]['video_real_timeline_startpos'] = take_targetvideo_videostartpos;
                            take_video_cutprocess_info_display[0]['video_real_timeline_endpos'] = take_targetvideo_videoendpos;
                        }                       
                    }                 
                }else{
                    for(let f=0; f<take_video_cutprocess_info_display.length; f++){
                        //해당 cutprocess_info_display정보그대로 유지하되,통일성유지를위해 timelinestart,end보여지는 properties만추가.
                        let take_targetvideo_startpos=take_video_cutprocess_info_display[f]['startpos'];//미디어의 실제적 시간pos위치가 곧 타임라인에서의 시각적 위치와 대응한다.
                        let take_targetvideo_endpos = take_video_cutprocess_info_display[f]['endpos'];
                        let take_targetvideo_videostartpos= take_video_cutprocess_info_display[f]['video_real_timeline_startpos'];
                        let take_targetvideo_videoendpos=take_video_cutprocess_info_display[f]['video_real_timeline_endpos'];
            
                        let adapt_visible_targetvideo_timelinestart= take_targetvideo_startpos;
                        let adapt_visible_targetvideo_timelineend= take_targetvideo_endpos;
            
                        take_video_cutprocess_info_display[f]['timelinestart'] = adapt_visible_targetvideo_timelinestart;
                        take_video_cutprocess_info_display[f]['timelineend'] = adapt_visible_targetvideo_timelineend;
                        if(take_targetvideo_videostartpos && take_targetvideo_videoendpos){
                            take_video_cutprocess_info_display[f]['video_real_timeline_startpos'] = take_targetvideo_videostartpos;
                            take_video_cutprocess_info_display[f]['video_real_timeline_endpos'] = take_targetvideo_videoendpos;
                        }
                    }
                }
        
                console.log('=======>>비디오 재생구간(타임라인0~30) 관련 실행진행==========================>>>>>',take_video_cutprocess_info_display);
                
                //최초 실행시점>>>>>
                //let time_cnt=0; let origin_timestamp=new Date().getTime();
                //console.log('origin====>timestamp값(밀리초):',origin_timestamp);
                
                //let timer_interval_execute=setInterval(function(){
                console.log(`${seconds}초 타임라인구간 / 해당초에서 확인되는 take_video_cutprocess_info_display`,take_video_cutprocess_info_display);
        
                let target_takeindex;//1,2,3,4,5테이크비디오여부 판단, emptyvideo는 따로 ui재생표현하지않습니다.
                let target_file;
        
                let target_takeindex_starts=undefined;//임의의 전환테이크지점의 각 시작부분인 상황때의 index,files값.
                let target_file_starts=undefined;
                let target_startpos_starts=undefined;//임의의 전환테이크지점의 그 테이크비디오의 시작startpos지점.
                let target_currentTimepos=undefined;//비디오seeking할떄 쓰일 관련의존성변수

                for(let i=0;i<take_video_cutprocess_info_display.length; i++){
                    let cutprocess_info = take_video_cutprocess_info_display[i];
                    if(cutprocess_info['takeindex']!='blackempty'){
                        //timeline_status='takevideo';
                        //if(cutprocess_info['startpos']<= seconds && seconds < cutprocess_info['endpos'] ){
                        if(cutprocess_info['timelinestart'] <= seconds && seconds < cutprocess_info['timelineend']){
                            target_takeindex = cutprocess_info['takeindex'];//테이크index값>>..
                            target_file = cutprocess_info['localfile'];
        
                            target_takeindex_starts = cutprocess_info['takeindex'];
        
                            if(!seek_origin){
                                if(seconds == cutprocess_info['timelinestart']){
                                    console.log('====>>일반적재생or최초 seeking이후 후속재생실행되는경우엔 전환지점마다실행');
                                    target_file_starts = cutprocess_info['localfile'];
                                    target_startpos_starts = cutprocess_info['video_real_timeline_startpos'];//비디오자르기 시작지점.
                                    target_currentTimepos= seconds - cutprocess_info['timelinestart'];//0,1,2,3,4....의값으로다양.
    
                                    console.log('==탐색할 비디오 시작지점,시작지점으로부터의 경과량:',target_startpos_starts,target_currentTimepos);
                                    console.log('===>탐색이동할 실제비디오 타임시간지점:',target_startpos_starts+target_currentTimepos);
    
                                   // setplayOutputUrl(target_file_starts+' '+seconds);
                                    setplayOutputUrl(target_file_starts);//비디오별 로컬url,기존 outputUrl과 다른값으로 판단된 경우에만 비디오source컴포넌트리랜더링하며, 관련된 함수 실행함. mergedplayer클로저변수 외부에서 변경.>>
                                    setplayTakeIndex(target_takeindex_starts);//not use
                                    
                                    setplayStartpos(parseFloat(target_startpos_starts));
                                    //일반적재생or 최초seeking이후에 재생실행되는경우엔 전환지점마다 정보갱신하여 play되게끔.
                                    lastest_videoUrl=target_file_starts;//"blacnkvideo"-> changevideo=>..
                                }
                            }else{
                               console.log('======>>최초 비디오 seeking으로 탐색하려했던경우=======>>그 지점값이 전환지점여부 상관없게끔 발생');

                               target_file_starts=cutprocess_info['localfile'];
                               target_startpos_starts=cutprocess_info['video_real_timeline_startpos'];
                               target_currentTimepos=seconds - cutprocess_info['timelinestart'];

                                console.log('====>탐색할 비디오시작지점,시작지점으로부터의경과량:',target_startpos_starts,target_currentTimepos);
                                console.log('====>탐색이동할 실제비디오 타임시간지점:',target_startpos_starts+target_currentTimepos);

                                //setplayOutputUrl(target_file_starts+' '+seconds);
                                console.log('===>비디오seeking의 경우 seeking하려는 비디오의 url과 기존prev localfileUrl의 동일여부판단:(현재,기존)',target_file_starts,lastest_videoUrl);
                                if(target_file_starts == lastest_videoUrl){
                                    console.log("===>기존 비디오url,바꾸려는 url이 동일한경우, 비디오 재로드하지않고, 바로 seeking한다. seeking은 비디오가 로드되어있는경우에만 작동함",mergedPlayer_closure&&mergedPlayer_closure.seek);
                                    console.log('=====>seeking하고자하는비디오가 기존비디오prev Url과 동일했던경우 비디오재로드필요없이 바로, seekingss',parseFloat(target_startpos_starts+target_currentTimepos));
                                    if(mergedPlayer_closure){
                                        mergedPlayer_closure.seek(parseFloat(target_startpos_starts+target_currentTimepos));
                                    }

                                    setplayTakeIndex(target_takeindex_starts);
                                    setplayStartpos(parseFloat(target_startpos_starts+target_currentTimepos));//비디오의 실제 시작startpos지점.타임라인점유 시간대가 아님. 일단 변경state해둠.

                                    lastest_videoUrl=target_file_starts;
                                }else{
                                    console.log("====>기존 비디오url,바꾸려는 url이 달랐던경우,비디오가 바뀐경우,재로드 필연적, 로드이후에 seeking되도록 flow처리해야만함",target_file_starts);
                                    setplayStartpos(parseFloat(target_startpos_starts+target_currentTimepos));//비디오의 실제 시작startpos지점.타임라인점유 시간대가 아님.

                                    setplayOutputUrl(target_file_starts);//바뀐 update비디오 재로드.외부에서 클로저변수에 state변수값 참조형저장.
                                    //로드 된 이후 state관련변수 or 로드핸들러함수에서 seeking하도록,비디오 새로로드후->seeking(새로로드핸들럼하수에서 playstartpos를 제대로 인식여부가 중요, 제대로 인식했었음..)
                                    setplayTakeIndex(target_takeindex_starts);

                                    lastest_videoUrl=target_file_starts;
                                }
                                
                            }                     
                        }
                    }    
                }
                console.log(`=====>현재구간의타입:${target_takeindex_starts},${!target_takeindex_starts}==============`);
                console.log(`======>해당 ${seconds}초와 관련된 cutprocessinfo구간:: target_takeindex:${target_takeindex} , targetfile:${target_file}`);
                console.log(`=====>해당 ${seconds}초에 전환시작된 cutprocessinfo구간 및 정보 target_takeindex_전환시작점:${target_takeindex_starts}, 전환시작되는 대상파일:${target_file_starts},전환시작되는 테이크비디오의 startpos시간지점(s):${target_startpos_starts}`);
        
                if(!target_takeindex_starts){
                    //blackemptyvideo였던경우임.
                    console.log('blackemptyvideo였던상황 추정:',target_takeindex_starts);
                    setplayOutputUrl(blackempty_cachevideo);//빈 비디오를 불러온다.
                    setplayTakeIndex(null);
                    setplayStartpos(0);

                    lastest_videoUrl=blackempty_cachevideo;
                }
                
                if(seconds == 30){
                    console.log('======>player timer 30번호출(abstract) 되어 결과초값이 30초 타임라인도달시에======>');
                    //clearInterval(timer_interval_execute);
                    setplayOutputUrl(blackempty_cachevideo);
                    setplayTakeIndex(null);
                    setplayStartpos(0);

                    lastest_videoUrl=blackempty_cachevideo;

                    abstractplaystatus=0;//정지상태로 돌입.>>
                    setAbstractplayStatus(0);//정지상태 돌입>>>
                    setAbstractplayStatus_(0);//정지상태 돌입>>>외부 state상태값 관련 변수.
                    seconds=0;
                    return false;
                }
            
                console.log("secondss증가:",seconds);
                seconds += 1;  seek_origin=false;//임의의 모든 재생액션실행이후엔 seek_origin은 적어도아닌시점.
                //setSecondsview(seconds);
                let TimeoutGet=setTimeout(timeline_seek,1000);//일초뒤 호출>>
                console.log('===>미디어재생 반복getTimeout:',TimeoutGet);
                setGetTimeout(TimeoutGet); lastest_timeoutRequest=TimeoutGet;

               // webviewRef.current.postMessage(JSON.stringify({"playbarstatus":seconds})) 
            }
        }
        return [timeline_seek,setAbstractplayStatus,getSeconds,setSeconds,setMergedplayer];
    }(take_video_cutprocess_info_display));
    console.log('gettime line seeksss:',timeline_seek);
    let store={
        timeline_seek : timeline_seek[0],
        setAbstractplayStatus : timeline_seek[1],
        getSeconds: timeline_seek[2],
        setSeconds: timeline_seek[3],
        setMergedplayer: timeline_seek[4]
    }
    setTimelineSeek(store);
  },[take_video_cutprocess_info,take_video_cutprocess_info_display])


  useEffect(async()=>{
    const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
        title: 'Permission Explanation',
        message: 'ReactNativeForYou would like to access your photos!',
    },
    );
    const results2=await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
        title: 'Permission Explanation',
        message: 'ReactNativeForYou would like to access your photos!',
    },
    );
    
    enableLogCallback(undefined);
    if(route && route.params){
        console.log("===>>페이지로드시점:",route.params,typeof(route.params));
        setTakeFileList(route.params['takefilelist']);
        setuserid(route.params['mem_id']);
        setSelectmusic(route.params['select_music']);
        setSelecteffect(route.params['select_effect']);
        setSelect_transition(route.params['select_transition']);
    }

    //로드시점에 앱 캐시데이터에 블랙비디오(일초) 짜리 한번만들어놓음.그것을 섬네일및 display용도로(빈구간)사용한다.
    let cachetempPath=`${RNFS.CachesDirectoryPath}/blank_videosample.mp4`;

    let ffmpegCommand=VideoUtil.make_emptysimplevideo(cachetempPath);

    if(ffmpegCommand!=''){
        executeFFmpegAsync(ffmpegCommand,async(completedExecution)=>{
            console.log('blackempty video make actionss>:',completedExecution);
            if(completedExecution.returnCode===255){
                ffprint(`ffmpeg proess endedwithcancelfor buttnwithexeuteiId ${completedExecution.executionId}[[명령실패,취소처리]]`);
                
            }else{
                //각 요청큐에대해서 명령성공실행완료한경우에 
                ffprint(`ffmpeg process ended with rc ${completedExecution.returnCode} for withexecuteidId ${completedExecution.executionId}[[명령성공]]`);         
            }
        }).then(executionId=>{
            ffprint(`Async ffmpeg process target with arguments ${ffmpegCommand} and executionId ${executionId}`);
    
            listExecutions();
        })
    }

  },[]);

  useEffect(async()=>{
    console.log('takeFlielist,selectmusic,userid:',takeFileList,selectmusic,userid,selecteffect,select_transition);
    console.log('takeFlielist',takeFileList[0]);

    let get_thumbnail_list=[];let thumbnail_standby_cnt=0;
    let get_external_thumbnailList=[];

    showProgressDialog("initial Processing");
    if(takeFileList){
        for(let j=0; j<takeFileList.length; j++){
            let takefile=takeFileList[j];

            if(takefile){
                (function(j,takefile){
                    console.log('thsmsmsmmsm takefhisl htss:',j,takefile);
                    if(takefile['uri']){
                        console.log('thsmsmsmmsm takefhisl htss:(uri)',takefile['uri']);
    
                        let getImage=`${RNFS.CachesDirectoryPath}/videothumbnail${j+1}.jpg`;
                        get_thumbnail_list[j]=getImage;
                        let ffmpegcommand=VideoUtil.generateThumbnailScript(takefile['uri'],getImage);
                        console.log('get thumbnail ffmpeg srcitsss:',ffmpegcommand);
                        if(ffmpegcommand!=''){
                            executeFFmpegAsync(ffmpegcommand,async(completedExecution)=>{
                                console.log(' video make thumbnailsss>:',completedExecution);
                                if(completedExecution.returnCode===255){
                                    ffprint(`ffmpeg proess endedwithcancelfor thumbanhilsss ${completedExecution.executionId}[[명령실패,취소처리]]`);
                                    
                                }else{
                                    ffprint(`ffmpeg process ended with rc thumbanhilsss${completedExecution.returnCode} for withexecuteidId ${completedExecution.executionId}[[명령성공]]`);    
                                    
                                    let results= await CameraRoll.save(getImage);
                                    console.log('file store resultsss: thumbnailssss j refersssss index??]]]]',j,results);

                                    RNFS.stat(results).then(res=>{
                                        console.log('RNFS STAT fileInformation resultss:',res);
                                        console.log('res isDirecdtoery:',res.isDirectory());
                                        console.log("res originalFilePath:<<<<J>>",j,results,res.originalFilepath);
                                        console.log("res isFiless:",res.isFile());
                                
                                        get_external_thumbnailList[j]=res.originalFilepath;;
                                        
                                    }).catch(err=>{
                                        console.log('readFile errorsss:',err);
                                    })
                                    thumbnail_standby_cnt++;
                                }
                            }).then(executionId=>{
                                ffprint(`Async ffmpeg process target with arguments ${ffmpegcommand} and executionId ${executionId}`);
                        
                                listExecutions();
                            })
                        }
                        
                    }
                })(j,takefile);
               
            }
        }

        //섬네일 얻기 대기.
        function promise_function_standby(){
            return new Promise((resolve,reject)=>{
                let callback_timeout=0;
                let callback_standby= setInterval(function(){
                    if(takeFileList.length == thumbnail_standby_cnt){
                        clearInterval(callback_standby);

                        resolve(true)
                    }
                    if(callback_timeout==5000){
                        clearInterval(callback_standby);
                        reject(new Error("callbacktimeout errosss"));
                    }
                    callback_timeout++;
                },500);
            });
        }
        //setthumbnailmakecnt(1);//0=>1 섬네일을 얻는것(n개 파일에대해)이미 요청해둔상태.
        console.log("===>섬네일얻기 대기:");
        let result=await promise_function_standby();

        if(result){
            console.log('====>>clients reactNative 테이크비디오별 섬네일얻기 성공, 이것들 서버s3 전송업로드>>>',get_thumbnail_list,get_external_thumbnailList);

            let upload_url="https://teamspark.kr:8087/media/regist";

            let s3_upload_list=[];
            if(get_thumbnail_list && get_thumbnail_list.length>=1){
                for(let c=0; c<get_thumbnail_list.length; c++){
                    let store={};
                    store['name']='videotake';
                    store['filename']=`videotakessthumbnail${c+1}.jpg`;
                    store['filepath']=get_thumbnail_list[c];
                    store['filetype']='image/jpg';

                    let files=[];
                    files[0]=store;

                    console.log('==>>업로드대상 파일섬네일리스트(로커파일)--====>',files);

                    (function(c){
                        console.log('====>업로드요청한 순서대로파일섬네일리스트가 담겨야한다:',c);
                        RNFS.uploadFiles({
                            toUrl:upload_url,
                            files: files,
                            method:"POST",
                            headers:{
                                'Accept':'application/json'
                            },
                            fields:{
                                'user_id': `${userid}`//어떤유저가 업로드하게된건지.
                            }
                        }).promise.then((response)=>{
                            if(response.statusCode==200){
                                console.log('fileupload resultsss:',response,response.json);
                                let response_body=response.body;
                                response_body=JSON.parse(response_body);
                                console.log('response bodysss:',response_body);
                                let body_result=response_body.result;
                                console.log('thumbnail body uplaodreulstss:',body_result);
                                console.log('-=====>요청파일 업로드완료,get thumbnailsllist c참조 index값:',c,get_thumbnail_list[c]);
                                s3_upload_list[c]=body_result;
                            }else{
                                console.log('server errossss:');
                            }
                        }).catch((err)=>{
                            console.log('upload erorsss:',err);
                        })
                    })(c);
                }
                function promise_function_standby_(){
                    return new Promise((resolve,reject)=>{
                        let callback_timeout=0;
                        let callback_standby= setInterval(function(){
                            //console.log("===>s3 uploadlistss<uploadlist standby>>:<<isWebview loaded>>",s3_upload_list,webviewisload);
                            if((s3_upload_list.length == get_thumbnail_list.length)){
                                let valid_cnt=0;
                                for(let s=0; s<s3_upload_list.length; s++){
                                    if(s3_upload_list[s]&&s3_upload_list[s]!=""){
                                        valid_cnt++;
                                    }
                                }
                                if(valid_cnt == get_thumbnail_list.length){
                                    clearInterval(callback_standby);
        
                                    resolve(true);
                                }
                               
                            }
                            if(callback_timeout==8000){
                                clearInterval(callback_standby);
                                reject(new Error("callback timeout error"));
                            }
                            callback_timeout++
                        },500);
                    })
                }
                try{
                    let result=await promise_function_standby_();
                    console.log('standby uplaods reultsss:',result);
                    hideProgressDialog();
                    if(result){
                        console.log('UPLOAD SUCCSSS ALSSS:',s3_upload_list);

                        if(s3_upload_list && s3_upload_list.length>=1){
                            console.log('WEBVIEW에게 전달한 관련필요 데이터전달충족(섬네일데이터):',s3_upload_list);

                            console.log('webviewRef및 postmessage존재??:',webviewRef);
                            setThumbnailList_client(get_external_thumbnailList);
                            //setThumbnailList_client(get_thumbnail_list);
                            webviewRef.current.postMessage(JSON.stringify({type:"thumbnailGet","thumbnaillist":s3_upload_list}));
                        }   
                    }
                }catch(error){
                    console.log(' errosss incurriosss:',error);
                }
            }

        }
    }
    
  },[takeFileList,userid]);
  useEffect(()=>{
    console.log('timelineSeeksss:',timelineSeek);

    const backAction=()=>{
       
        console.log('===>>뒤로가기 명시적 실행>>',timelineSeek);
        if(timelineSeek){
            setAbstractplayStatus_(0);
            timelineSeek['setAbstractplayStatus'](0);
        }
       
        //navigation.goBack();
        return false;//false면 뒤로가기개념,true이면 뒤로가기막음.
    }
    const backHandler=BackHandler.addEventListener("hardwareBackPress",backAction);
    //backAction관련
    console.log('TakedDit페이지로드시점 what backahnadlerss:',backHandler,backHandler.remove,BackHandler.exitApp);

    return ()=> backHandler.remove();
  },[timelineSeek]);
  useEffect(()=>{
      console.log('abstractplayStatus_:::',abstractplayStatus_);
  },[abstractplayStatus_]);
  useEffect(()=>{
    console.log('secondss viewsss:',secondsview);
  },[secondsview]);
  useEffect(()=>{
    console.log('player재생관련 GetTimeout조회디버깅:',GetTimeout);
  },[GetTimeout]);
  useEffect(()=>{
    console.log('playOutputUrlsss 변경관련 디버깅:',playoutputUrl);
  },[playoutputUrl]);
  useEffect(()=>{
      console.log('isValid값 변경여부:',isvalid);
  },[isvalid]);
  useEffect(()=>{
    console.log('thumbnailList_clientsss:',thumbnailList_client);
  },[thumbnailList_client]);
  useEffect(()=>{
    console.log('change previewThumbnailsss:',previewThumbnail);
  },[previewThumbnail])
 
    return ( 
        <View style={styles.container}>
            <Image source={{uri:previewThumbnail!=''?previewThumbnail:null}} style={styles.bgImage}></Image>
            
            {
                modalVisible &&
                <View style={styles.bgVideoModal}>
                    <TouchableOpacity
                        style={[styles.xbutton]}
                        onPress={() => {setModalVisible(!modalVisible)}}
                    >
                        <Text style={styles.textStyle}>X</Text>
                    </TouchableOpacity>
                    <Video
                        source={{uri: /*'file:///storage/emulated/0/DCIM/Camera/20220117_004025.mp4'*/ playoutputUrl}}
                        ref={(ref)=>{
                            //console.log('video refss:',ref);
                            setmergedplayer(ref)
                        }}
                        controls={false}
                        resizeMode="contain"

                        //filter={FilterType.FADE}
                        muted={true}
                        //pictureInPicture={true}
                        paused={paused}
                        repeat={false}
                        
                        style={styles.bgVideo}
                        
                        onEnd={videoEnd}
                        onLoad={videoLoadControl}
                    />
                </View>
            }
            
            <View style={styles.fixedTop}>
                {
                    isdata && 
                    <TouchableOpacity style={styles.Next} onPress={nextStep}>     
                    <Image  source={NextSave} ></Image>
                    </TouchableOpacity>            
                }
                 {/*<TouchableOpacity onPress={openVideoFull} style={styles.openVideoFull}>
                        <Image source={Arrow2}></Image>
                </TouchableOpacity>*/}
            </View>
            <View style={styles.videocontainer}>
                <TouchableOpacity onPress={videoplayToggle}>
                    <Video
                        source={{uri: /*'file:///storage/emulated/0/DCIM/Camera/20220117_004025.mp4'*/ playoutputUrl}}
                        ref={(ref)=>{
                            //console.log('video refss:',ref);
                            setmergedplayer(ref)
                        }}
                        controls={false}
                        resizeMode="contain"

                        //filter={FilterType.FADE}
                        muted={false}
                        //pictureInPicture={true}
                        paused={paused}
                        repeat={false}
                        
                        style={styles.videoPlayerViewStyle}
                        
                        onEnd={videoEnd}
                        onLoad={videoLoadControl}
                    />
                </TouchableOpacity>
                <View style={styles.controlMedia}>
                    {/*<View style={styles.playbar}></View>
                    <View style={styles.playViewball}></View>*/}
                    <Text style={styles.timebar}>{secondsview} / 30(s)</Text>
                </View>
            </View>
            
            <View style={styles.webviewcontainer}>
                <WebView
                    source={{uri:"http://192.168.25.40:3000/edit/takever2_"}}
                    ref={webviewRef}
                    originWhitelist={['*']}
                    onLoadEnd={handleEndLoading}
                    sharedCookiesEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    javaScriptEnabled={true}
                    onMessage={event => onMessage(event)}
                    injectedJavaScript={""}
                    scalesPageToFit={true}
                    mixedContentMode="compatibility"
                    style={{
                        backgroundColor:"transparent"
                    }}
                />
            </View>
            <ProgressModal
                visible={false}
                ref={progrssmodal}/>
        </View>
    );
}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const styles = EStyleSheet.create({

    textStyle: {
    fontSize:"30rem",color:"white"
    },
    xbutton:{
        width:"40rem",height:"40rem",position:"absolute",backgroundColor:"#fe1010",position:"absolute",left:"5%",top:"5%",zIndex:9
    },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    position:'relative'
  },
  bgImage:{
    width:'100%',height:"100%",position:"absolute",left:"0%",top:"0%",zIndex:0,backgroundColor:'#000'
  },
  bgVideo:{
    width:'100%',height:"100%",position:"absolute",left:"0%",top:"0%",zIndex:3
  },
  bgVideoModal:{
    width:'100%',height:"100%",position:"absolute",left:"0%",top:"0%",zIndex:80,backgroundColor:"#000"
  },
  videocontainer:{
    display:'flex',
    flexDirection:'column',
    /*backgroundColor:'white',*/
    position:'relative',zIndex:2,
    flex:3.0,
  },
  fixedTop:{
      position:"absolute",zIndex:8,
      top:"3%",left:"0%",width:"100%",height:"32rem",
  },
  Next:{
    position:"absolute",top:"0%",right:"0%",zIndex:8,
  },    
  controlMedia:{
    display:"flex",position:"absolute",bottom:"0%",left:"0%",zIndex:8,alignItems:"center",
    flexDirection:"row",flex:0.15,padding:"3rem", width:"100%",height:"28rem"
  },
  openVideoFull:{
    position:"absolute",top:"0%",left:"0%",zIndex:8,width:"60rem",height:"60rem",backgroundColor:"#00efef"
  },
  timebar:{
    color:"white",height:"16rem",position:"absolute",zIndex:5,right:"0%",bottom:"5%"
  },
  playbar:{
    backgroundColor:"rgba(125,50,160,1.0)",position:"absolute",bottom:"30%",left:"0%",zIndex:-1,
    width:"100%",height:"3rem"
  },
  playViewball:{
    backgroundColor:"white",width:"16rem",height:"16rem",borderRadius:"8rem",position:"absolute",bottom:"10%",left:"0%"
  },

  webviewcontainer:{
      display:'flex',
      flexDirection:'column',
      //backgroundColor:'white',
      position:'relative',zIndex:0,
      flex:2.6
  },
  takeItem:{
      width:"120rem",
      height:"220rem"
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

 

  buttonStyle:{
    position:"absolute",
    width:"64rem",
    height:"64rem",
    backgroundColor:'white',
    zIndex:8, justifyContent:"center",alignItems:"center"
  },
  buttonPlay:{
    width:"100%",height:"100%",resizeMode:"contain"
  },
  buttonPause:{
    width:"100%",height:"100%",resizeMode:"contain"
  },
 
  videoPlayerViewStyle: {
    /*backgroundColor: '#000',*/
    /*borderColor: '#000',
    borderRadius: 5,
    borderWidth: 1,*/
    height:"100%",
    width:"100%",
    
  },
});
