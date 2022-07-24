import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { Dimensions, FlatList, Text, Image, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CommandTab from './command-tab'
import EStyleSheet from 'react-native-extended-stylesheet';
import VideoTab from './video-tab'
import VideoUtil from "./video-util";
import Test from "./test-api";
import {setLogLevel} from "./react-native-ffmpeg-api-wrapper";
import {LogLevel} from "react-native-ffmpeg";
import HttpsTab from "./https-tab";
import AudioTab from "./audio-tab";
import SubtitleTab from "./subtitle-tab";
import VidStabTab from "./vid-stab-tab";
import ConcurrentExecutionTab from "./concurrent-execution-tab";
import PipeTab from "./pipe-tab";


import RootScreen from "./RootScreen";
import CameraScreen from './screen/CameraScreen';
import GalleryScreen from './screen/GalleryScreen';
import MusicSelectScreen from './screen/MusicSelectScreen';
import WebviewScreen from './screen/WebviewScreen';
import VideoTest from './videoTest';


//import TestScreen from './screen/TestScreen';
//import TakeEditScreen from './screen/TakeEditScreen';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
const Stack=createStackNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="COMMAND"
            lazy={false}
            tabBarPosition='bottom'
            tabBarOptions={{
                activeTintColor: 'dodgerblue',
                inactiveTintColor: 'gray',
                showIcon: false,
                scrollEnabled: true,
                labelStyle: {
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    flex: 1,
                    height: 20
                }
            }}>

            <Tab.Screen
                name="COMMAND"
                component={CommandTab}
                options={{
                    tabBarLabel: 'COMMAND'
                }}
            />
            <Tab.Screen
                name="VIDEO"
                component={VideoTab}
                options={{
                    tabBarLabel: 'VIDEO'
                }}
            />
            {/*<Tab.Screen
                name="HTTPS"
                component={HttpsTab}
                options={{
                    tabBarLabel: 'HTTPS'
                }}
            />
            <Tab.Screen
                name="AUDIO"
                component={AudioTab}
                options={{
                    tabBarLabel: 'AUDIO'
                }}
            />
            <Tab.Screen
                name="SUBTITLE"
                component={SubtitleTab}
                options={{
                    tabBarLabel: 'SUBTITLE'
                }}
            />
            <Tab.Screen
                name="VID.STAB"
                component={VidStabTab}
                options={{
                    tabBarLabel: 'VID.STAB'
                }}
            />*/}
            <Tab.Screen
                name="PIPE"
                component={PipeTab}
                options={{
                    tabBarLabel: 'PIPE'
                }}
            />
            <Tab.Screen
                name="CONCURRENT EXECUTION"
                component={ConcurrentExecutionTab}
                options={{
                    tabBarLabel: 'CONCURRENT EXECUTION'
                }}
            />
            <Tab.Screen
               name="VIDEOTEST"
               component={VideoTest}
               options={{
                   tabBarLabel:"VIDEOTEST"
               }}
            />
            {/*<Tab.Screen
                name="TakeEditScreen"
                component={TakeEditScreen}
                options={{
                    tabBarLabel: 'TakeEditScreen'
                }}
            />*/}
           
        </Tab.Navigator>
    );
}

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        Test.testCommonApiMethods();
        Test.testParseArguments();

        VideoUtil.prepareAssets().then(_ => _);
        VideoUtil.registerAppFont().then(_ => _);

        setLogLevel(LogLevel.AV_LOG_INFO);
    }

    render() {
        return (
            <NavigationContainer>
                {/*<Stack.Navigator initialRouteName="CAMERA" screenOptions={{headerShown:false}}>
                    <Stack.Screen name="Home" component={WebviewScreen} />
                    <Stack.Screen name="CAMERA" component={CameraScreen} />
                    <Stack.Screen name="TEST" component={TestScreen} />
                    <Stack.Screen name="GALLERY" component={GalleryScreen} />
                    <Stack.Screen name="MUSICSELECT" component={MusicSelectScreen} />
                </Stack.Navigator>*/}
                <BottomTabs/>
            </NavigationContainer>
        );
    }
}
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
