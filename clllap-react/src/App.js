import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch ,Link} from "react-router-dom";


//login
import LoginPage from './page/login/LoginPage';
import EmailLoginPage from './page/login/EmailLoginPage';
import SignUpPage from './page/login/SignUpPage';
import SignUpCompletePage from './page/login/SignUpCompletePage';
import FindIdPage from './page/login/FindIdPage';
import FindPasswordPage from './page/login/FindPasswordPage';
import FindPwCompletePage from './page/login/FindPwCompletePage';

//main
import MainPage from './page/main/MainPage';

// camera
import CameraPage from './page/camera/CameraPage';
import CameraPageTest from './page/camera/CameraPageTest';

import CameraTest from './page/camera/CameraTest';

// edit
import LibraryPage from './page/edit/library/LibraryPage';
import MusicPage from './page/edit/music/MusicPage';
import EditTakePage from './page/edit/camera/EditTakePage';
import EditTakePage_ver2 from './page/edit/camera/EditTakePage_ver2';
import EditTakePage_ver2debug from './page/edit/camera/EditTakePage_ver2_debug';

import EditTakePage_ver2debug_ from './page/edit/camera/EditTakePage_ver2_debug_';
import EditTakePage_ver2_ from './page/edit/camera/EditTakePage_ver2_';

import EditTakePage_debug from './page/edit/camera/EditTakePage_debug';
import PreviewPage from './page/edit/camera/PreviewPage';
import SavePage from './page/edit/camera/SavePage';
import OpencvPage from './page/edit/camera/OpencvTest';

// share
import SharePage from './page/share/SharePage';
import WritePage from './page/share/WritePage';

// MyPage
import MyPage from './page/mypage/MyPage';
import MyInfo from './page/mypage/MyInfo';
import LinkInfo from './page/mypage/LinkInfo';
import SettingPage from './page/mypage/SettingPage';
import GuidePage from './page/mypage/GuidePage';
import MyLibraryPage from './page/mypage/MyLibraryPage';

import cv from './service/cv';
import Qna from './page/mypage/qna';
import QnaWrite from './page/mypage/QnaWrite';
import SignUpSocial from './component/login/SignUpSocial';

//test
import VideoShareTest from './page/share/VideoShareTest';
import ReactPlayer from './page/share/ReactPlayer';
import Ffmpegtest from './ffmpegTest';
import Videoplayer from './page/Videoplayer';

export default function App(){
  
  //const [CV,setCV]=useState("");

  useEffect(()=>{
    console.log('==>페이지 appjs로드시점:',global.cv);

    //setCV(global.cv);
    //localStorage.setItem("cv",global.cv);
  },[]);
 // useEffect(()=>{
   // console.log('updateing CVs:',CV);
 // },[CV])
  return (
        
        <Router>
            {/* login */}
            <Route exact path="/login" component={LoginPage}/>
            <Route exact path="/email/login" component={EmailLoginPage}/>
            <Route exact path="/signup" component={SignUpPage}/>
            <Route exact path="/signupSocial" component={SignUpSocial}/>
            <Route exact path="/signup/complete" component={SignUpCompletePage}/>
            <Route exact path="/find_id" component={FindIdPage}/>
            <Route exact path="/find_Password" component={FindPasswordPage}/>
            <Route exact path="/find_Password/complete" component={FindPwCompletePage}/>

            {/* main */}
            <Route exact path="/" component={MainPage}/>

            {/*Test*/}
            <Route exact path="/video" component={Videoplayer}/>

            {/* camera */}
            <Route exact path="/camera" component={CameraPage}/>
            <Route exact path="/cameraTest" component={CameraPageTest}/>
            <Route exact path="/cameratest" component={CameraTest}/>
            {/* edit */}
            <Route exact path="/edit/library" component={LibraryPage}/>
            <Route exact path="/edit/music" component={MusicPage}/>
            <Route exact path="/edit/take" component={EditTakePage}/>
            <Route exact path="/edit/takever2" component={EditTakePage_ver2}/>
            <Route exact path="/edit/takever2debug" component={EditTakePage_ver2debug}/>
            <Route exact path="/edit/takever2debug_" component={EditTakePage_ver2debug_}/>
            <Route exact path="/edit/takever2_" component={EditTakePage_ver2_}/>

            <Route exact path="/edit/take_debug" component={EditTakePage_debug}/>

            <Route exact path="/preview" component={PreviewPage}/>
            <Route exact path="/save" component={SavePage}/>
            <Route exact path="/opencv" component={OpencvPage}/>
            {/* share  */}
            <Route exact path="/share" component={SharePage}/>
            <Route exact path="/share/write" component={WritePage}/>

            {/* mypage  */}
            <Route exact path="/mypage" component={MyPage}/>
            <Route exact path="/myInfo" component={MyInfo}/>
            <Route exact path="/linkInfo" component={LinkInfo}/>
            <Route exact path="/setting" component={SettingPage}/>
            <Route exact path="/setting/guide" component={GuidePage}/>
            <Route exact path="/myLibrary" component={MyLibraryPage}/>

            <Route exact path="/qna" component={Qna}/>
            <Route exact path="/qna/write" component={QnaWrite}/>

            {/*Test */}
            <Route exact path="/videoshareTest" component={VideoShareTest}/>
            <Route exact path="/ReactPlayer" component={ReactPlayer}/>
            <Route exact path="/ffmpegTest" component={Ffmpegtest}/>

        </Router>

    );
}