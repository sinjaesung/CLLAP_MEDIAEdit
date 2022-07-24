// hooks.js
import { useState, useEffect } from "react";
import { __RouterContext } from "react-router";

function CommonUtil() {
    //const [status, setStatus] = useState(src ? "loading" : "idle");
    //const [CV,setCV] = useState({});

    console.log('CommonUtil executsesss:');

    var return_function = function(){

        let second_to_timeformat = (seconds)=>{
            console.log('입력 초:',seconds);
            
            //17000초 17000/60 => 

            let seconds_divide_minutesScale= Math.floor(seconds/60);// 17000- 283*60
            let seconds_leaves = seconds%60;

            if(seconds_divide_minutesScale < 10){
                seconds_divide_minutesScale ='0'+seconds_divide_minutesScale;
            }
            if(seconds_leaves < 10){
                seconds_leaves ='0'+seconds_leaves;
            }

            console.log('===>분:초형태 format:',seconds_divide_minutesScale,seconds_leaves);

            return seconds_divide_minutesScale+':'+seconds_leaves;
        } 
        var array_same_compare = function(a, b){
            var i = 0, j;
            if(typeof a == "object" && a){
                if(Array.isArray(a)){
                    if(!Array.isArray(b) || a.length != b.length) return false;
                    for(j = a.length ; i < j ; i++) if(!array_same_compare(a[i], b[i])) return false;
                    return true;
                }else{
                    for(j in b) if(b.hasOwnProperty(j)) i++;
                    for(j in a) if(a.hasOwnProperty(j)){
                        if(!array_same_compare(a[j], b[j])) return false;
                        i--;
                    }
                    return !i;
                }
            }
            return a === b;
        };

        return {'second_to_timeformat':second_to_timeformat,'array_same_compare':array_same_compare}
    }
    
    return return_function;
}

export { CommonUtil };