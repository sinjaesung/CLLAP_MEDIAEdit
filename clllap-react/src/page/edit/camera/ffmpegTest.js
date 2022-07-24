import React ,{useState} from 'react';

function Ffmpeg(){
    const [videoSrc,setVideosrc] = useState('');
   
    let workerPath="https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js";

    const processInWebWorker= ()=>{
        var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
            type: 'application/javascript'
        }));
        let worker=new Worker(blob);
        URL.revokeObjectURL(blob);
        return worker;
    }
    let worker;

    const filechange =(event)=>{
        console.log('파일변화:',event.target.files);
        let file=event.target.files[0];
        var reader =new FileReader();
        reader.onload=function(e){
            let blob=new Blob([new Uint8Array(e.target.result)],{type:file.type});
            console.log('file to blob:',blob);
            let result=e.target.result;

            execute_action(result);
        };
        reader.readAsArrayBuffer(event.target.files[0]);
    }
    const execute_action = (videoblob)=>{
        if(!worker){
            worker=processInWebWorker();
        }

        worker.onmessage=function(event){
            let message=event.data;
            if(message.type==='ready'){
                console.log('ready');
                postMessage();
            }else if(message.type==='stdout'){
                console.log('mesasgeDatsss:',message.data);
            }else if(message.type==='done'){
                console.log("json string ",JSON.stringify(message));

                let result=message.data[0];
                console.log('JSON DASS:',JSON.stringify(result));

                let blob=new File([result.data],"test.mp4",{
                    type:'video/mp4'
                });
                console.log('complete datass:',JSON.stringify(blob));

                postBlob(blob);
            }
        };
        let postMessage=function(){

            worker.postMessage({
                type:"command",
               // arguments:'-i video.mp4 -c:v mpeg4 -b:v 6400k -strict experimental outputss.mp4'.split(' '),
               arguments:'-i video.mp4 -r 26 -c:v mpeg4 -strict experimental testfile.mp4'.split(' '),
                files:[
                    {
                        data:new Uint8Array(videoblob),
                        name:'video.mp4'
                    }
                ]
            })
        }
    }
    function postBlob(blob){
        console.log('file blob:',blob,URL.createObjectURL(blob));
        var video= document.createElement('video');
        video.controls=true;

        //let source=document.createElement('source');
        //source.src=URL.createObjectURL(blob);
        //source.type='video/mp4;codecs=mpeg4';
        //video.appendChild(source);
        video.src=URL.createObjectURL(blob);
        video.download='play mp4 in vlc alyer';
        document.getElementById('videoarea').appendChild(video);
        //video.play();
    }
    return(
        <div>
            <p/>
            <div id='videoarea'></div>
            <input type='file' onChange={filechange}/>
            <div id='inner'></div>
        </div>
    )
}
export default Ffmpeg;