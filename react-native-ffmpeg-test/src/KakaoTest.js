import React,{Component} from 'react';
import {StyleSheet,Text,View,TouchableWithoutFeedback} from 'react-native';

import RNKakaoTest from 'react-native-kakao-test';
import KakaoShareLink from 'react-native-kakao-share-link';

export default class KakaoTest extends React.Component{
    
    render(){
        return(
            <View style={styles.container}>
                
                <TouchableWithoutFeedback onPress={()=>{
                    RNKakaoTest.link((result)=>console.log('kkakakaollink request resultss:',result));
                }}>
                    <View style={styles.button}>
                        <Text style={styles.content}>카톡공유하기테스트</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={async()=>{
                   try{
                       const response=await KakaoShareLink.sendFeed({
                           content:{
                               title:'title',
                               imageUrl:'http://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg',
                               link:{
                                   webUrl:'https://tree9odic.tistory.com/59',
                                   mobileWebUrl:'https://tree9odic.tistory.com/59',
                               },
                               description:'description test'
                           },
                           social:{
                               commentCount:0,
                               likeCount:0
                           },
                           buttons:[
                            {
                               title: '자세히보기',
                               link:{
                                   androidExecutionParams:[{key:'key1',value:'value1'}],
                                   iosExecutionParams:[
                                       { key:'key1',value:'value1'},
                                       { key:'key2',value:'value2'}
                                   ]
                               }
                            }
                           ]
                       });
                       console.log('feddsend kakaoshare sendFeed reusltss:',response);
                   }catch(e){
                       console.error(e);
                       console.error(e.message);
                   }
                }}>
                    <View style={styles.button}>
                        <Text style={styles.content}>카톡공유하기테스트2</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fef01b',
    },
    button: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: '#556677',
      borderRadius: 5,
    },
    content: {
      fontSize: 24,
      color: 'white',
    }
  });