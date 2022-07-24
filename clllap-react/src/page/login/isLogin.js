import { useEffect } from "react";
import { Link,useHistory } from "react-router-dom";

//로그인 여부를 판단합니다.

import serverController from '../../server/serverController';

export default async function islogin() {
 
    console.log('로그인 여부 판단 관련 컴포넌트::실행]]]]]]]');
    
    return new Promise((resolve,reject)=>{
        try{
            let res= serverController.connectFetchController("user/islogin","GET",null,function(res) {
                console.log('islogin ressss??:',res);
        
                if(!res.result){
                    reject(false);
                }else{
                    resolve(true);
                }
            }, function(err) {
                console.log("ERRORRR:",err);
                reject(false);
            });
        }catch(error){
            console.log('catch errors:',error);
            reject(false);
        }
        
    })
    
}
