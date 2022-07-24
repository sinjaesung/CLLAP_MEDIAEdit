'use strict';

import React, { useState, useEffect} from 'react';
import { Dimensions, FlatList, Text, Image, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import EStyleSheet from 'react-native-extended-stylesheet';
import CameraScreen from './screen/CameraScreen';
import GalleryScreen from './screen/GalleryScreen';
import WebviewScreen from './screen/WebviewScreen';
import TestScreen from './screen/TestScreen';
import MusicSelectScreen from './screen/MusicSelectScreen';
import TakeEditScreen from './screen/TakeEditScreen';
import PreviewProcessScreen from './screen/PreviewProcessScreen';
import SaveScreen from './screen/SaveScreen';
import ShareScreen from './screen/ShareScreen';
import ShareWriteScreen from './screen/ShareWriteScreen';
import loginScreen from './screen/loginScreen';
import emailLoginScreen from './screen/emailLoginScreen';
import findidScreen from './screen/findidScreen';
import findpasswordScreen from './screen/findpasswordScreen';
import signupScreen from './screen/signupScreen';
import signupCompleteScreen from './screen/signupCompleteScreen';

import mypageScreen from './screen/mypageScreen';
import myvideoScreen from './screen/myvideoScreen';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WebviewScreen"  screenOptions={{ headerShown: false }} >
        <Stack.Screen name="WebviewScreen" component={WebviewScreen} />
        <Stack.Screen name="CAMERA" component={CameraScreen} />
        <Stack.Screen name="TEST" component={TestScreen} />
        <Stack.Screen name="GALLERY" component={GalleryScreen} />
        <Stack.Screen name="MUSICSELECT" component={MusicSelectScreen} />
        <Stack.Screen name="TakeEditScreen" component={TakeEditScreen}/>
        <Stack.Screen name="PreviewProcessScreen" component={PreviewProcessScreen}/>
        <Stack.Screen name="SAVE" component={SaveScreen}/>
        <Stack.Screen name="Share" component={ShareScreen}/>
        <Stack.Screen name="ShareWrite" component={ShareWriteScreen}/>

        <Stack.Screen name='login' component={loginScreen}/>
        <Stack.Screen name='emailLogin' component={emailLoginScreen}/>
        <Stack.Screen name='findid' component={findidScreen}/>
        <Stack.Screen name='findpassword' component={findpasswordScreen}/>
        <Stack.Screen name='signup' component={signupScreen}/>
        <Stack.Screen name='signupComplete' component={signupCompleteScreen}/>

        <Stack.Screen name='mypage' component={mypageScreen}/>
        <Stack.Screen name='myvideoScreen' component={myvideoScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });