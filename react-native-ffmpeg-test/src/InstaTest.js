import React,{
    AppRegistry,
    Component
} from 'react-native';

//var CustomInstagramShare = require("react-native-instagram-share-android");

export default class InstagramShareApp extends Component{
    /*shareWithInstagram(){
        let mediaPath='path';
        CustomInstagramShare.shareWithInstagram(mediaPath,function(result){
            alert(result);
        })
    }*/

    render() {
        return (
            <View style={{flex : 1,justifyContent : 'center'}}>
            <TouchableHighlight onPress={() => /*this.shareWithInstagram()*/console.log('hahaha')} style={{backgroundColor : 'black',borderRadius : 5,margin : 5,height : 50,alignItems : 'center',justifyContent : 'center'}}>

                <Text style={{color : 'white'}}>Share With Instagram</Text>

            </TouchableHighlight>
            </View>
        );
    }
}