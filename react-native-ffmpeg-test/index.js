import { AppRegistry } from 'react-native';
import Main from './src/RootScreen';
//import Main from'./src/main';
//import KakaoTest from './src/KakaoTest';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Main);
