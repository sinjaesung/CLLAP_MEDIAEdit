import React, { useEffect, useRef, useState} from 'react';
import { Dimensions, BackHandler, Text, View, PermissionsAndroid } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native'
import WebView from 'react-native-webview';


export default function MusicSelect({navigation,route}){

    console.log('MUSIC SELECT페이지도달 전달데이터:',route);
    let takeFileList=route.params && route.params.takeFileList;//localPath,duration만 받습니다.(섬네일은 얻을방법이 제한됨)
    let mem_id=route.params && route.params.mem_id;
    let webviewRef=useRef();

    const [takefilelist,settakefilelist]=useState([]);
    const [reqUserid,setreqUserid] = useState(30);

    const handleSetRef = _ref => {
      webviewRef = _ref;
    };
    /*const handleEndLoading= e=>{
      console.log("MUSIC SELECT WEBVIEW handleEndLoading");

      if(takefilelist && takefilelist.length>=1){
        console.log('WEBVIEW에게 관련 필요 데이터 전달충족:',takefilelist);
        webviewRef.postMessage(JSON.stringify({"test_data":takefilelist}));
      }else if(s3upload_url_datagatherings && s3upload_url_datagatherings.length>=1){
        console.log('WEBVIEW에게 관련 필요 데이터 전달충족:',takefilelist);
        webviewRef.postMessage(JSON.stringify({"test_data":takefilelist}));
      }
    };*/
    function onMessage(event){
      console.log('webview로부터 전달받은 데이터(선택음악):다음진행버튼 클릭',event.nativeEvent.data);
      let receive_data=JSON.parse(event.nativeEvent.data);
      if(receive_data.type === "SELECT_MUSIC"){
        console.log('getDatasss:(webview전달데이터 선택음악)::',receive_data);

        navigation.navigate(
          "TakeEditScreen",
          {
            mem_id : reqUserid,
            select_music: receive_data['data'],
            select_effect:receive_data['effect'],
            select_transition: receive_data['musictransitiontype'],
            takefilelist: takefilelist
          }
        )
      }
    }
    

    useEffect(()=>{
      settakefilelist(takeFileList);
      setreqUserid(mem_id);
    },[]);
    useEffect(()=>{
      console.log('user_memidss:',reqUserid);
      console.log('takefilelist get]]]] debugss:',takefilelist);//선택 로컬파일들에 대한 정보(길이값등)
    },[takefilelist,reqUserid]);
    
    return ( 
        <WebView 
            source={{ /*uri: `http://172.28.5.10:3000`*/uri:`http://192.168.25.40:3000/edit/music` }}
            ref={handleSetRef}
            originWhitelist={['*']}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            javaScriptEnabled={true}
            onMessage={event => onMessage(event)}
            injectedJavaScript={""}
            scalesPageToFit={true}
            mixedContentMode="compatibility"
        />
    );

}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

