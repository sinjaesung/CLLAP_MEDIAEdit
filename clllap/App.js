'use strict';

import React, { useState, useEffect} from 'react';
import { Dimensions, FlatList, Text, Image, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import EStyleSheet from 'react-native-extended-stylesheet';
import CameraScreen from './src/screen/CameraScreen';
import GalleryScreen from './src/screen/GalleryScreen';
import WebviewScreen from './src/screen/WebviewScreen';
import TestScreen from './src/screen/TestScreen';
import MusicSelectScreen from './src/screen/MusicSelectScreen';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"  screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Home" component={WebviewScreen} />
        <Stack.Screen name="CAMERA" component={CameraScreen} />
        <Stack.Screen name="TEST" component={TestScreen} />
        <Stack.Screen name="GALLERY" component={GalleryScreen} />
        <Stack.Screen name="MUSICSELECT" component={MusicSelectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
