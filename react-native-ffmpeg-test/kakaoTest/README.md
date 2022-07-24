
# react-native-kakao-test

## Getting started

`$ npm install react-native-kakao-test --save`

### Mostly automatic installation

`$ react-native link react-native-kakao-test`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-kakao-test` and add `RNKakaoTest.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNKakaoTest.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNKakaoTestPackage;` to the imports at the top of the file
  - Add `new RNKakaoTestPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-kakao-test'
  	project(':react-native-kakao-test').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-kakao-test/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-kakao-test')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNKakaoTest.sln` in `node_modules/react-native-kakao-test/windows/RNKakaoTest.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Kakao.Test.RNKakaoTest;` to the usings at the top of the file
  - Add `new RNKakaoTestPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNKakaoTest from 'react-native-kakao-test';

// TODO: What to do with the module?
RNKakaoTest;
```
  