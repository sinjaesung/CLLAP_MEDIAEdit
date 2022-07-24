/*FFMPEG OR FMMPEG FLUENT라이브러리를 통한 1.영상병합,2.영상찢기(이미지로분배),3.이미지끼리 이어붙여 영상생성*/
const ffmpeg=require('ffmpeg');
const fluent_ffmpeg=require('fluent-ffmpeg');
const request=require('request');
const { fstat } = require('fs');
const { isFunction } = require('util');
const fs=require('fs');
const commonvar=require('./config/commonVar.js');

//상수
const spawn=require('child_process').spawn;
const { PassThrough, Duplex } = require('stream');
//const concatmp4filetmpPath='tmp/';
//const concatmp4filepath='./process/files/concat/';
//const dir='./process/files/';

const s3_origin_dns=`https://clllap.s3.ap-northeast-2.amazonaws.com/`;

const STREAM_IMPORT = require('stream');


//ffmpeg or opencv트랜지션 타입 편집비디오원본들 ,사이 트랜지션들 병합 관련 액션.임의 비디오들끼리의 조건형식의 병합
exports.originals_and_betweentransition_merged_ = function(request_id,subpart_videos,output_merged_transitions,res){

    return new Promise((resolve,reject)=>{
        console.log('merged target videosss:',request_id,subpart_videos,output_merged_transitions);

        let index_asc_transitionslist=output_merged_transitions.sort(function(a,b){return a.index - b.index});
        //console.log('index순 오름차순 정렬처리된 관련된 리스트내역 해당 장면between1~n순서대로 정렬이되야만한다.',index_asc_transitionslist);
        //let index_asc_effectvideotakelist=output_effect_videotakes.sort(function(a,b){return a.index - b.index});
       // console.log('index순 오름차순 정렬처리된 관련된 리스트내역 해당 정렬관련::',index_asc_effectvideotakelist);

        //let index_asc_effectvideotakelist=upload_list.split(',');
        var merged_data='';
        if(subpart_videos.length>1){
            for(let o=0; o<subpart_videos.length; o++){
            
                if(o==0){
                    let target_path = subpart_videos[0];
                    //target_path = target_path.replace('./process/files/','');
                    merged_data += ('file '+target_path+'\n');//내용물 한개를 쓴다.
                }else{
                    //1-1 2-1 3-1 4-1 형태위치의 output_meged_transiton내용 같이 쓴다.
                    let target_prev_transitionpath= index_asc_transitionslist[o-1]['outputpath'];
                    let target_path = subpart_videos[o];
                    //target_prev_transitionpath = target_prev_transitionpath.replace('./process/files/','');
                    //target_path = target_path.replace('./process/files/','');
    
                    merged_data += ('file '+target_prev_transitionpath+'\n');
                    merged_data += ('file '+target_path+'\n');
                }
            }
        }else if(subpart_videos.length==1){
           
            let target_prev_transitionpath= index_asc_transitionslist[0]['outputpath'];
            let target_path = subpart_videos[0];
            //target_path = target_path.replace('./process/files/','');
        
            merged_data += ('file '+target_path+'\n');
            merged_data += ('file '+target_prev_transitionpath+'\n');

        }
        
        console.log('===>>모두 쓴 meregd_datasss==================>>',merged_data);

        // var ffmpeg_local_native =spawn("ffmpeg",[]);
        var history_file=`${request_id}_merged_history.txt`;
        fs.open(history_file,'w',function(err,fd){
            if(err) throw err;
            console.log('file open completetessss');

            fs.writeFile(history_file,merged_data, 'utf8', function(error){
               // console.log('대상 파일 쓰기 완료!!파일을 모두 쓴후에 리스트화 한 후에 그 리스트된 순서대로 해서 합쳐야만한다.',error,merged_data);
                
                //대상 쓴 파일(방금 쓰기가 완료된 파일에 대해서 관련 처리를 한다. 파일속의 관련 집합대상들을 합칠뿐임.)
                //var ffmpeg_local_native = spawn("ffmpeg",["-f","concat","-i",history_file,"-c","copy",`${concatmp4filepath}${request_id}_opencv_transition_merged.mp4`]);
                //var ffmpeg_local_native = spawn("ffmpeg",["-f","concat","-safe",'0',"-protocol_whitelist","file,http,https,tcp,tls","-i",history_file,"-c","copy",'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./tmp/${request_id}_transitionAdaptVideos.mp4`]);
                var ffmpeg_local_native = spawn("ffmpeg",["-f","concat","-safe","0","-protocol_whitelist","file,http,https,tcp,tls","-i",history_file,`./tmp/${request_id}_transitionAdaptVideos.mp4`]);

                var output_complete = false;

                ffmpeg_local_native.stderr.on("data",function(data){
                    console.log(data.toString());
                });
                ffmpeg_local_native.stderr.on("end",function(){
                    console.log("transition vidoes merged files process finalss all merged");

                    output_complete=true;

                });
                ffmpeg_local_native.stderr.on("exit",function(){
                    console.log('child porecess exited');
                });
                ffmpeg_local_native.stderr.on("close",function(){
                    console.log('....closing itiemss! byess');
                });

                let standby_count=0;
                let standby = setInterval(function(){
                    if(output_complete){
                        //모두 병합이 다되었을때.. 관련하여 마친다.
                        if(fs.existsSync(history_file)){
                            fs.unlinkSync(history_file);
                        }
                        clearInterval(standby);
                        //callback(`${request_id}_opencv_transition_merged.mp4`,buffer_data_final,res,delete_planning_s3upload_total_frames,delete_planning_s3upload_total_frames2,music,request_id);
                        resolve({'output':`${request_id}_transitionAdaptVideos.mp4`,'res':res,'request_id':request_id});
                    }

                    if(standby_count==2000){
                        clearInterval(standby);
                        reject(new Error('timeout error'));
                    }
                    standby_count++;
                },400);
            });
        });
    });   
}
//최종적 처리된 frames들 임의 프레임이미지들 그룹병합합니다.
exports.video_frames_merged= async function(request_id,framedata){
    return new Promise((resolve,reject)=>{
        //console.log('merged videotake upload videos effect processing(async function)::',request_id,framedata);

        let framefiles_nameformat=framedata['framefiles_nameformat'];
        let deleted_framefilesdata=framedata['frame_full_data'];
        //var ffmpeg_local_native=spawn("ffmpeg",["-r",takevideoper_avgframerate,"-f","image2","-s","1280x720","-i",`./process/files/${request_id}_${take_distinct}_partimg_process%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./process/files/${request_id}_${take_distinct}_effectoutput.mp4`]);
        //var ffmpeg_local_native =spawn("ffmpeg",["-r",'26','-f','image2','-s','1280x720','-i',`${s3_origin_dns}clllap/${take_distinct}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','-f','mp4','-movflags','frag_keyframe','pipe:1']);
        //var ffmpeg_local_native = spawn("ffmpeg",['-f','image2','-i',`./tmp/${framefiles_nameformat}%d.png`,'-vcodec','libx264','-crf','25',`./tmp/${framefiles_nameformat}output.mp4`]);
        //var ffmpeg_local_native= spawn("ffmpeg",['-f','image2','-i',`./tmp/${framefiles_nameformat}%d.png`,'-r','26','-c:v','libvpx','-crf','10','-b:v','1M',`./tmp/${framefiles_nameformat}output.webm`]);
        //var ffmpeg_local_native=spawn("ffmpeg",['-f','image2','-i',`./tmp/${framefiles_nameformat}%d.png`,'-r','26','-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./tmp/${framefiles_nameformat}output.mp4`]);
        var ffmpeg_local_native=spawn("ffmpeg",['-f','image2','-i',`./tmp/${framefiles_nameformat}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./tmp/${framefiles_nameformat}output.mp4`]);

        var output_complete=false;
        ffmpeg_local_native.stderr.on("data",function(data){
            //console.log("ffmpeg progress exeucted staas:",data.toString());
        });
    
        ffmpeg_local_native.stderr.on('end',function(){
           // console.log('effect opencv merged file process successfully');

            output_complete=true;

            for(let del=0; del<deleted_framefilesdata.length; del++){
                let del_target=deleted_framefilesdata[del];

                console.log('del target삭제:',del_target);
                if(fs.existsSync(del_target)){
                    fs.unlinkSync(del_target);
                }
            }
        });
        ffmpeg_local_native.stderr.on('exit',function(){
           // console.log('child process exited');
        });
        ffmpeg_local_native.stderr.on("close",function(){
           // console.log('....closing time!! byess');
        });

        let secure_cnt=0;
        let standby= setInterval(function(){
            if(output_complete){
                clearInterval(standby);
               // callback({index:take_order_index,outputpath:`${take_distinct}_effectoutput.mp4`,buffer_data:buffer_data},res);
               resolve(`${framefiles_nameformat}output.mp4`);//대상체를 리턴한다.
            }

            if(secure_cnt==5000){
                clearInterval(standby);
                reject(new Error("timeout erreorsss"));
            }
            ++secure_cnt;

        },500);
    });
}

//임의 트랜지션frames이미지들에 대한 그룹병합진행>>트랜지션효과영상파일
exports.between_transition_merged_ = async function(request_id,between_distinct,callback,res,betweenindex){

    console.log('merged between transition vidoess(async functionss): PRMOISE FUNCTIONS:',request_id,between_distinct,betweenindex);

    let between_order_index=betweenindex;

    //var ffmpeg_local_native = spawn("ffmpeg",["-r",26,"-f","image2","-s","1280x720",'-i',`./process/files/${request_id}_blend_transitionImg_${between_distinct}_%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./process/files/${request_id}_${between_distinct}_transitionoutput.mp4`]);
    //var ffmpeg_local_native = spawn("ffmpeg",["-r",26,"-f","image2","-s","1280x720",'-i',`${between_distinct}_%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./process/files/${request_id}_${between_distinct}_transitionoutput.mp4`]);
    
    //var ffmpeg_local_native = spawn("ffmpeg",["-r","26","-f","image2","-i",`./tmp/${between_distinct}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','-video_track_timescale',common_timebase,`./tmp/${between_distinct}_transitionoutput.mp4`]);
    //var ffmpeg_local_native = spawn("ffmpeg",["-r","26","-f","image2","-i",`./tmp/${between_distinct}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./tmp/${between_distinct}_transitionoutput.mp4`]);
    var ffmpeg_local_native = spawn("ffmpeg",["-r","26","-f","image2","-i",`./tmp/${between_distinct}%d.png`,`./tmp/${between_distinct}_transitionoutput.mp4`]);

    var output_complete=false;

    ffmpeg_local_native.stderr.on("data",function(data){
        console.log('data progrress executess:',data.toString());
    });

    ffmpeg_local_native.stderr.on('end',function(){
        console.log('transition between_transition_merged_ file process successfully');
        
        output_complete = true;

    });
    ffmpeg_local_native.stderr.on('exit',function(){
       console.log('child procdes exited');
    });
    ffmpeg_local_native.stderr.on('close',function(){
        console.log("...closing time! byess");
    });

    let secure_cnt=0;
    let standby=setInterval(function(){
        //console.log('===>>대기호출',data_gathering,standby);
        //console.log('업로드수_======>>',upload_count);

        if(output_complete){
            clearInterval(standby);
            callback({index:between_order_index, outputpath:`${between_distinct}_transitionoutput.mp4`},res);

            //resolve({index:between_order_index, outputpath:`./tmp/${between_distinct}_transitionoutput.mp4`,res: res});
        }       
        if(secure_cnt==4000){
            clearInterval(standby);

        }
        secure_cnt++;
    },500);
}
//ffmpeg transitionss 생성.
exports.makeTransition = async function(request_id,adapt_ffmpeg_transition,frame_start,frame_end,index){

    return new Promise((resolve,reject)=>{
        console.log('ffmpeg make transtions PRMOISE FUNCTIONS:',request_id,adapt_ffmpeg_transition,frame_start,frame_end,index);

        //var ffmpeg_local_native = spawn("ffmpeg",["-r",26,"-f","image2","-s","1280x720",'-i',`./process/files/${request_id}_blend_transitionImg_${between_distinct}_%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./process/files/${request_id}_${between_distinct}_transitionoutput.mp4`]);
        //var ffmpeg_local_native = spawn("ffmpeg",["-r",26,"-f","image2","-s","1280x720",'-i',`${between_distinct}_%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./process/files/${request_id}_${between_distinct}_transitionoutput.mp4`]);
        
        //var ffmpeg_local_native = spawn("ffmpeg",["-r","26","-f","image2","-i",`./tmp/${between_distinct}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','-video_track_timescale',common_timebase,`./tmp/${between_distinct}_transitionoutput.mp4`]);
        //var ffmpeg_local_native = spawn("ffmpeg",["-r","26","-f","image2","-i",`./tmp/${between_distinct}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./tmp/${between_distinct}_transitionoutput.mp4`]);

        var ffmpeg_local_native=spawn("ffmpeg",['-loop','1','-t','1','-i',frame_start,'-loop','1','-t','1','-i',frame_end,'-filter_complex',`[0][1]xfade=transition=${adapt_ffmpeg_transition}:duration=1:offset=0.1,format=yuv420p`,'-r','26',`./tmp/${request_id}_between${index}_transitionoutput.mp4`]);

        // var ffmpeg_local_native = spawn("ffmpeg",["-r","26","-f","image2","-i",`./tmp/${between_distinct}%d.png`,`./tmp/${between_distinct}_transitionoutput.mp4`]);

        var output_complete=false;

        ffmpeg_local_native.stderr.on("data",function(data){
            console.log('data progrress executess:',data.toString());
        });

        ffmpeg_local_native.stderr.on('end',function(){
            console.log('transition between_transition_merged_ file process successfully');
            
            output_complete = true;

            resolve(`./tmp/${request_id}_between${index}_transitionoutput.mp4`);
        });
        ffmpeg_local_native.stderr.on('exit',function(){
            console.log('child procdes exited');
        });
        ffmpeg_local_native.stderr.on('close',function(){
            console.log("...closing time! byess");
        });
    });
    
}

//특정 영상의 시작,끝부분의 일부 1초구간부분만 추출하여 데이터 콜백함수
exports.video_img_extract_edgepart = async function(takeindex,upload_target,edge_extract_callback,request_id){

    //임의 서버상의 비디오의 각 양 시작,끝부분 1초씩 부분만을 추출.
    //console.log('extracnt file_callback whatss: request_id>>>>',takeindex,upload_target,request_id);

   //if(upload_list.length >= 2){
    var data_gathering={};
    var isstartpart=false;
    var isendpart=false;

    let extract_framefilenames_format= `${request_id}_take${takeindex}startpartframe`;
    let extract_framefilenames_format2= `${request_id}_take${takeindex}endpartframe`;

    if(upload_target!=''){
       // console.log('===>>>전달 take 영상 관련 extractn처리 >============',upload_target);
        //var pure_filename=upload_list[0].split('/')[3].split('.')[0];  requestid_encode

        var takevideo_imgdata=[];//관련프레임데이터. ec2 path위치값들>>이것들을 기억하고있다가 테이크별로하여 모두완수시에 s3로 일괄업로드처리위함, 또한 원본대상들은 후에 삭제>
        var takevideo_imgdata2=[];
        fluent_ffmpeg.ffprobe(upload_target,function(err,metadata){
            
            if(err){
                console.log('metadata not foundsss....'+err);
            }else{
                //console.log('ssmeat datasss:',metadata,metadata.format);
                
                let streams=metadata.streams;
                let avg_frame_rate;//평균프레임률
                let original_duration;//원본영상의 고유 길이값.
                for(let s=0; s<streams.length; s++){
                    if(streams[0].codec_type=='video'){
                        let left= parseInt(streams[0].avg_frame_rate.split('/')[0]);
                        let right= parseInt(streams[0].avg_frame_rate.split('/')[1]);
                        avg_frame_rate=parseInt(left / right);
                        
                    }
                }

                original_duration = parseInt(metadata.format.duration);           
            
                //var ffmpeg_local_native2 = spawn("ffmpeg",['-ss',`0`,'-t',`1`,'-i',upload_target,'-r',`${avg_frame_rate}`,'-f','image2',`./tmp/${extract_framefilenames_format}%d.png`]);   
                var ffmpeg_local_native2 = spawn("ffmpeg",['-i',upload_target,'-ss','0','-to','1','-vf',"select=eq(n\\,0)",`./tmp/${extract_framefilenames_format}.png`]);              
                ffmpeg_local_native2.stderr.on("data",function(data){
                    console.log(data.toString());
                });
                ffmpeg_local_native2.stderr.on("end",function(){
                    console.log('file process successfully',extract_framefilenames_format);
                    /*for(let j=0; j<26; j++){
                        takevideo_imgdata.push(`./tmp/${extract_framefilenames_format}${j+1}.png`);//전체 추출된 이미지들을 저장한다.>>

                    }*/
                    //console.log('처리된 vieo_imgdatasss full:',takevideo_imgdata);

                    //data_gathering[`${takeindex}_startpart_data`]= takevideo_imgdata;
                    data_gathering[`${takeindex}_start_data`] = `./tmp/${extract_framefilenames_format}.png`;

                    data_gathering[`takeindex`] = takeindex;//gathering객체는 각 테이크비디오의 시작,끝프레임path,전체프레임path배열,몇 테이크비디오index인지 여부등의정보 저장

                    isstartpart=true;
                });
                ffmpeg_local_native2.stderr.on("exit",function(){
                   // console.log('child process exited');
                });
                ffmpeg_local_native2.stderr.on('close',function(){
                    //console.log('...closing times.! byes');
                });


                //var ffmpeg_local_native = spawn("ffmpeg",['-ss',`${original_duration-1}`,'-t',`1`,'-i',upload_target,'-r',`${avg_frame_rate}`,'-f','image2',`./tmp/${extract_framefilenames_format2}%d.png`]);  
                var ffmpeg_local_native= spawn("ffmpeg",['-sseof','-1','-i',upload_target,'-update','1','-q:v','1',`./tmp/${extract_framefilenames_format2}.png`]);               
                ffmpeg_local_native.stderr.on("data",function(data){
                   // console.log(data.toString());
                });
                ffmpeg_local_native.stderr.on("end",function(){
                    console.log('file process successfully',extract_framefilenames_format2);
                    /*for(let j=0; j<26; j++){
                        takevideo_imgdata2.push(`./tmp/${extract_framefilenames_format2}${j+1}.png`);

                    }*/
                    //console.log('처리된 vieo_imgdatasss full:',takevideo_imgdata2);

                    //data_gathering[`${takeindex}_endpart_data`]= takevideo_imgdata2;
                    data_gathering[`${takeindex}_end_data`] = `./tmp/${extract_framefilenames_format2}.png`;

                    data_gathering[`takeindex`] = takeindex;//gathering객체는 각 테이크비디오의 시작,끝프레임path,전체프레임path배열,몇 테이크비디오index인지 여부등의정보 저장

                    isendpart=true;
                });
                ffmpeg_local_native2.stderr.on("exit",function(){
                    //console.log('child process exited');
                });
                ffmpeg_local_native2.stderr.on('close',function(){
                    //console.log('...closing times.! byes');
                });
            }
        });
        
    }
    
    let standby_securecnt=0;
    let standby=setInterval(function(){
        //console.log('===>>(VIDEO_IMG_EXTRACT))function >>> 대기호출',takeindex,data_gathering,standby,iscomplete);
        if( isstartpart==true && isendpart==true){
            //수집이 완료된경우
            //console.log('===>>(VIDEO_IMG_EXTRACT))영상take 데이터 모두 분할 및 ffmpeg처리 저장:',takeindex,data_gathering);
            clearInterval(standby);

            edge_extract_callback(data_gathering,request_id,takeindex);
            return data_gathering;
        }
            
        if(standby_securecnt == 4000){
            clearInterval(standby);
        }
        standby_securecnt++;
    },500);  
}

exports.mediaInfoGet = async function(urlfile){
    return new Promise((resolve,reject)=>{

        console.log('mediaInfoGetsss:',urlfile);
        
        fluent_ffmpeg.ffprobe(urlfile,function(err,metadata){
            if(err){
                console.log('metadata not foundsss....'+err);
                reject(new Error('timeout error'));

            }else{
                // console.log('ssmeat datasss:',metadata,metadata.format);
    
                let original_duration = parseFloat(metadata.format.duration);           
                //original_duration = Math.ceil(metadata.format.duration);올림여슈연산처리.

                resolve(original_duration);

            }    
        });
    });
}
exports.videoFrameThumbnail = async function(urlfile){
    return new Promise((resolve,reject)=>{

        let iscomplete=false;

        console.log('videoFrameTHumbnail getss:',urlfile);
        let makefilename=makeid(20);
        var ffmpeg_local_native = spawn("ffmpeg",["-i",urlfile,'-ss','0','-to','1','-vf',"select=eq(n\\,0)",`./tmp/${makefilename}_videoframe.png`]);
        ffmpeg_local_native.stderr.on("data",function(data){
            console.log('data tostinrg.:',data.toString());
        });
        ffmpeg_local_native.stderr.on("end",function(){
            console.log("file process successfuly:",makefilename);
            iscomplete=true;
        });
        ffmpeg_local_native.stderr.on("exit",function(){
            console.log('child process exited');
        });
        ffmpeg_local_native.stderr.on('close',function(){
            console.log('...closing times.! byes');
        });


        let standby_securecnt=0;
        let standby=setInterval(function(){
            //console.log('===>>(VIDEO_IMG_EXTRACT))function >>> 대기호출',takeindex,data_gathering,standby,iscomplete);
            if( iscomplete==true){
                //수집이 완료된경우
                //console.log('===>>(VIDEO_IMG_EXTRACT))영상take 데이터 모두 분할 및 ffmpeg처리 저장:',data_gathering);
                clearInterval(standby);
    
                //extract_file_callback(data_gathering,res,request_id,takeindex);
                resolve(`${makefilename}_videoframe.png`);
            }
                
            if(standby_securecnt == 5000){
                clearInterval(standby);

                reject(new Error('timeout error'));
            }
            standby_securecnt++;
        },500);  
    });
}


exports.videoblending= function(request_id,target_file,overlay_referval,overlay_start,overlay_end){
    return new Promise((resolve,reject)=>{
        console.log('target_filel vdieo fielsss:',target_file,request_id,overlay_referval,overlay_start,overlay_end);

        if(target_file){

            let outputfile_name=`${request_id}_transition_withblending.mp4`;
            
            fluent_ffmpeg.ffprobe(`./tmp/${target_file}`,function(err,metadata){
                if(err){
                    console.log('metadata not foundsss....'+err);
                }else{
                   // console.log('ssmeat datasss:',metadata,metadata.format);
                    
                    let streams=metadata.streams;
                    let avg_frame_rate;//평균프레임률
                    let original_duration;//원본영상의 고유 길이값.
                    for(let s=0; s<streams.length; s++){
                        if(streams[0].codec_type=='video'){
                            let left= parseInt(streams[0].avg_frame_rate.split('/')[0]);
                            let right= parseInt(streams[0].avg_frame_rate.split('/')[1]);
                           // avg_frame_rate=parseInt(left / right);
                            avg_frame_rate=parseFloat(left / right);
                        }
                    }
    
                    original_duration = parseFloat(metadata.format.duration);           
                    let total_have_frames= Math.ceil(avg_frame_rate * original_duration);
                    console.log('gif오버레이타겟팅 메인비디오 보유프레임량,및 avg fps값:',avg_frame_rate,original_duration,total_have_frames);
                                
                    //var ffmpeg_local_native = spawn("ffmpeg",['-i',`./tmp/${target_file}`,'-i',overlay_referval,'-filter_complex',`[0:v][1:v]blend=all_mode=overlay:enable='between(t,${overlay_start},${overlay_end})'`,'-an',`./tmp/${outputfile_name}`]);//해당 tmp위치에 해당 파일ec2에 생성된다.
                    //let ffmpeg_local_native= spawn("ffmpeg",['-i',`./tmp/${outputvideo}`,'-i',music_select,'-c','copy','-c:v',
                    var ffmpeg_local_native = spawn("ffmpeg",['-i',`./tmp/${target_file}`,'-ignore_loop','0','-i',overlay_referval,'-filter_complex',`[1:v]format=rgba,colorchannelmixer=aa=0.4[overlay];[0][overlay]overlay=0:0:enable='between(t,${overlay_start},${overlay_end})'`,'-frames:v',total_have_frames,`./tmp/${outputfile_name}`]);
                         
                    ffmpeg_local_native.stdout.on('data',function(data){
                    // console.log('ffmegp stdoutss tstraemoutput pioep datasss:',data);
        
                       // output_buffer_array_local.push(data);
                    });
                    ffmpeg_local_native.stderr.on('data',function(data){
                     console.log('data process progressivess:',data.toString());
                    });
                    ffmpeg_local_native.stderr.on('end',function(){
                        //console.log('audio mreged completed!!');//각 내역별로 완료되었다고 기록이 될뿐이고 이게 완료시마다 뭔가 기록을 남긴다.
        
                        //관련 버퍼로 모두 변환하는 작업이 끝났기에 다 되었다고도 할수있다.그걸 아직 s3로 업로드가 안된것일뿐.ec2가 아닌 s3에 저장
                        //console.log('output buffer araraysss:',output_buffer_array_local);
                        //let buffer_result = Buffer.concat(output_buffer_array_local);
        
                        //console.log('buffer reulstsss:',buffer_result,buffer_result.constructor);
                        //console.log(buffer_result);
                        //console.dir(buffer_result);
        
                        //callback(outputfile_name,outputvideo);
                        resolve(outputfile_name);
                    });
                }
            });

        }                     
    });  
}
exports.videoEffecting= function(request_id,target_file,select_filter,filter_start,filter_end){
    return new Promise((resolve,reject)=>{
        console.log('target_filel vdieo fielsss:<<FFMPEG FILTERSSS>>>',target_file,request_id,select_filter,filter_start,filter_end);

        if(target_file){

            let outputfile_name=`${request_id}_transition_withblending_effectings.mp4`;
            
            //var ffmpeg_local_native = spawn("ffmpeg",['-i',`./tmp/${target_file}`,'-filter_complex',`colorbalance=rh=0.8:gh=0.8:rs=0.8:gs=0.8:enable='between(t,${filter_start},${filter_end})'`,`-vcodec`,'libx264','-pix_fmt','yuv420p',`./tmp/${outputfile_name}`]);//해당 tmp위치에 해당 파일ec2에 생성된다.
            console.log("ffmpeg process effect stringsss:",select_filter+`:enable='between(t,${filter_start},${filter_end})'`);
            var ffmpeg_local_native=spawn("ffmpeg",['-i',`./tmp/${target_file}`,'-filter_complex',select_filter+`:enable='between(t,${filter_start},${filter_end})'`,'-vcodec','libx264','-pix_fmt','yuv420p',`./tmp/${outputfile_name}`]);
            //let ffmpeg_local_native= spawn("ffmpeg",['-i',`./tmp/${outputvideo}`,'-i',music_select,'-c','copy','-c:v',
                 
            ffmpeg_local_native.stdout.on('data',function(data){
            // console.log('ffmegp stdoutss tstraemoutput pioep datasss:',data);

               // output_buffer_array_local.push(data);
            });
            ffmpeg_local_native.stderr.on('data',function(data){
             console.log('data process progressivess:',data.toString());
            });
            ffmpeg_local_native.stderr.on('end',function(){
                //console.log('audio mreged completed!!');//각 내역별로 완료되었다고 기록이 될뿐이고 이게 완료시마다 뭔가 기록을 남긴다.

                //관련 버퍼로 모두 변환하는 작업이 끝났기에 다 되었다고도 할수있다.그걸 아직 s3로 업로드가 안된것일뿐.ec2가 아닌 s3에 저장
                //console.log('output buffer araraysss:',output_buffer_array_local);
                //let buffer_result = Buffer.concat(output_buffer_array_local);

                //console.log('buffer reulstsss:',buffer_result,buffer_result.constructor);
                //console.log(buffer_result);
                //console.dir(buffer_result);

                //callback(outputfile_name,outputvideo);
                resolve(outputfile_name);
            });
        }                     
    });  
}
//비디오 오디오 copy
exports.mergedAudio= function(outputvideo,music_select,request_id){
    return new Promise((resolve,reject)=>{
        //console.log('merged original vdieo fielsss:',request_id,outputvideo,music_select);

        if(outputvideo){

            let output_buffer_array_local=[];
            let outputfile_name=`${request_id}_finalOutput.mp4`;
            fluent_ffmpeg.ffprobe(`./tmp/${outputvideo}`,function(err,metadata){
                if(err){
                    console.log('metadata not foundsss....'+err);
              
                    reject(new Error("server timeout error"));
                    
                }else{
                    console.log('ssmeat datasss:',metadata,metadata.format);
                    
                    let streams=metadata.streams;
                    let avg_frame_rate;//평균프레임률
                    let original_duration;//원본영상의 고유 길이값.
                    for(let s=0; s<streams.length; s++){
                        if(streams[0].codec_type=='video'){
                            let left= parseInt(streams[0].avg_frame_rate.split('/')[0]);
                            let right= parseInt(streams[0].avg_frame_rate.split('/')[1]);
                            avg_frame_rate=parseFloat(left / right);
                            
                        }
                    }
    
                    original_duration = parseFloat(metadata.format.duration);      
                    
                    if(original_duration >=30){
                        //let ffmpeg_local_native = spawn("ffmpeg",['-i',`${s3_origin_dns}clllap/${outputvideo}`,'-i',music_select,'-acodec','copy','-vcodec','copy','-f','mp4','-movflags','-frag_keyframe','pipe:1']);
                        var ffmpeg_local_native = spawn("ffmpeg",['-i',`./tmp/${outputvideo}`,'-i',music_select,'-c','copy','-shortest',`./tmp/${outputfile_name}`]);//해당 tmp위치에 해당 파일ec2에 생성된다.
                        //let ffmpeg_local_native= spawn("ffmpeg",['-i',`./tmp/${outputvideo}`,'-i',music_select,'-c','copy','-c:v','libvpx','-crf','10',`./tmp/${outputfile_name}`]);
                    }else if(original_duration < 30){
                        //let ffmpeg_local_native = spawn("ffmpeg",['-i',`${s3_origin_dns}clllap/${outputvideo}`,'-i',music_select,'-acodec','copy','-vcodec','copy','-f','mp4','-movflags','-frag_keyframe','pipe:1']);
                        var ffmpeg_local_native = spawn("ffmpeg",['-i',`./tmp/${outputvideo}`,'-i',music_select,'-c','copy','-shortest',`./tmp/${outputfile_name}`]);//해당 tmp위치에 해당 파일ec2에 생성된다.
                        //let ffmpeg_local_native= spawn("ffmpeg",['-i',`./tmp/${outputvideo}`,'-i',music_select,'-c','copy','-c:v','libvpx','-crf','10',`./tmp/${outputfile_name}`]);
                    }
                 
                    ffmpeg_local_native.stdout.on('data',function(data){
                    // console.log('ffmegp stdoutss tstraemoutput pioep datasss:',data);

                        output_buffer_array_local.push(data);
                    });
                    ffmpeg_local_native.stderr.on('data',function(data){
                    // console.log('data process progressivess:',data.toString());
                    });
                    ffmpeg_local_native.stderr.on('end',function(){
                        //console.log('audio mreged completed!!');//각 내역별로 완료되었다고 기록이 될뿐이고 이게 완료시마다 뭔가 기록을 남긴다.

                        //관련 버퍼로 모두 변환하는 작업이 끝났기에 다 되었다고도 할수있다.그걸 아직 s3로 업로드가 안된것일뿐.ec2가 아닌 s3에 저장
                        //console.log('output buffer araraysss:',output_buffer_array_local);
                        let buffer_result = Buffer.concat(output_buffer_array_local);

                        //console.log('buffer reulstsss:',buffer_result,buffer_result.constructor);
                        console.log(buffer_result);
                        console.dir(buffer_result);

                        //callback(outputfile_name,outputvideo);
                        resolve([outputfile_name,outputvideo]);
                    });
                }            
            });         
        }
            
    });  
}
//범용 함수
function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
//=====================================..


exports.video_subpart_slice_normal2 = async function(takeindex,upload_target,extract_file_callback,request_id,take_video_cutprocess_info){
    console.log('target filess split modulsss:',takeindex,upload_target,extract_file_callback,take_video_cutprocess_info);

    var data_gathering={};
    var iscomplete=false;

    if(upload_target!=''){
        //console.log('======>>전달 take영상관련 extract처리 및 병합처리>>:',upload_target);

        let edited_endpos = take_video_cutprocess_info['endpos'];
        let edited_startpos = take_video_cutprocess_info['startpos'];

        var ffmpeg_local_native = spawn("ffmpeg",['-ss',`${edited_startpos}`,'-to',`${edited_endpos}`,'-i',upload_target,'-r','26','-an',`./tmp/${request_id}_${takeindex}_subpart.mp4`]);//분할하여 자른뒤 재인코딩처리(이래야 손실적음) 오디오 제거처리.오디오별로 다를시에 관련 오류발생.                  
        ffmpeg_local_native.stderr.on("data",function(data){
            //console.log(data.toString());
        });
        ffmpeg_local_native.stderr.on("end",function(){
            //console.log('file process successfully');

            data_gathering[`${takeindex}_data`]= `${request_id}_${takeindex}_subpart.mp4`;
            data_gathering[`orderindex`] = takeindex;//gathering객체는 각 테이크비디오의 시작,끝프레임path,전체프레임path배열,몇 테이크비디오index인지 여부등의정보 저장

            iscomplete=true;
        });
        ffmpeg_local_native.stderr.on("exit",function(){
           // console.log('child process exited');
        });
        ffmpeg_local_native.stderr.on('close',function(){
            //console.log('...closing times.! byes');
        });
    }

    let standbycnt=0;
    let standby = setInterval(function(){

        if(iscomplete == true){
            console.log('VIDEO IMG EXTARCCT -> TO MERGED subpart video make ffmpeg 처리완료:',takeindex,data_gathering);
            clearInterval(standby);

            extract_file_callback(data_gathering,request_id,takeindex);
            return data_gathering;
        }

        if(standbycnt == 4000){
            clearInterval(standby);
        }

        standbycnt++;
    },500);
}
exports.video_subpart_slice_emptyvideomake = async function(takeindex,extract_file_callback,request_id,take_video_cutprocess_info){
    console.log('target filess split modulsss(black empty spaces vidoes makes',takeindex,extract_file_callback,take_video_cutprocess_info);

    var data_gathering={};
    var iscomplete=false;

    //console.log('======>>전달 take영상관련 extract처리 및 병합처리>>:',upload_target);

    let edited_endpos = take_video_cutprocess_info['endpos'];
    let edited_startpos = take_video_cutprocess_info['startpos'];

    let make_duration=edited_endpos - edited_startpos;

    //var ffmpeg_local_native = spawn("ffmpeg",['-ss',`${edited_startpos}`,'-to',`${edited_endpos}`,'-i',upload_target,`./tmp/${request_id}${takeindex}_subpart.mp4`]);//분할하여 자른뒤 재인코딩처리(이래야 손실적음)   
    var ffmpeg_local_native= spawn("ffmpeg",['-f','lavfi','-i','color=c=black:s=720x1280:r=26/1','-c:v','h264','-t',make_duration,`./tmp/${request_id}${takeindex}_subpart_emptyblackscreen.mp4`]);  

    ffmpeg_local_native.stderr.on("data",function(data){
        //console.log(data.toString());
    });
    ffmpeg_local_native.stderr.on("end",function(){
        //console.log('file process successfully');

        data_gathering[`${takeindex}_data`]= `${request_id}${takeindex}_subpart_emptyblackscreen.mp4`;
        data_gathering[`orderindex`] = takeindex;//gathering객체는 각 테이크비디오의 시작,끝프레임path,전체프레임path배열,몇 테이크비디오index인지 여부등의정보 저장

        iscomplete=true;
    });
    ffmpeg_local_native.stderr.on("exit",function(){
        // console.log('child process exited');
    });
    ffmpeg_local_native.stderr.on('close',function(){
        //console.log('...closing times.! byes');
    });
    
    let standbycnt=0;
    let standby = setInterval(function(){

        if(iscomplete == true){
            console.log('VIDEO IMG EXTARCCT -> TO MERGED subpart video make ffmpeg 처리완료:',takeindex,data_gathering);
            clearInterval(standby);

            extract_file_callback(data_gathering,request_id,takeindex);
            return data_gathering;
        }

        if(standbycnt == 4000){
            clearInterval(standby);
        }

        standbycnt++;
    },500);
}
//==============================================================================================================================





















//======================deprecated functionss....

//다수개의 전달되어 넘어온 업로드 비디오이미지들끼리 병합합니다.(영상붙이기) spawn versionss*/
exports.originals_and_betweentransition_merged = function(request_id,output_effect_videotakes,output_merged_transitions,callback,res,delete_planning_s3upload_total_frames,delete_planning_s3upload_total_frames2,music){
    console.log('merged target videosss:',request_id,output_effect_videotakes,output_merged_transitions);

    let index_asc_transitionslist=output_merged_transitions.sort(function(a,b){return a.index - b.index});
    console.log('index순 오름차순 정렬처리된 관련된 리스트내역 해당 장면between1~n순서대로 정렬이되야만한다.',index_asc_transitionslist);
    let index_asc_effectvideotakelist=output_effect_videotakes.sort(function(a,b){return a.index - b.index});
    console.log('index순 오름차순 정렬처리된 관련된 리스트내역 해당 정렬관련::',index_asc_effectvideotakelist);

    //let index_asc_effectvideotakelist=upload_list.split(',');
    var merged_data='';
    for(let o=0; o<index_asc_effectvideotakelist.length; o++){
        
        if(o==0){
            let target_path = index_asc_effectvideotakelist[0]['outputpath'];
            //target_path = target_path.replace('./process/files/','');
            merged_data += ('file '+s3_origin_dns+'clllap/'+target_path+'\n');//내용물 한개를 쓴다.
        }else{
            //1-1 2-1 3-1 4-1 형태위치의 output_meged_transiton내용 같이 쓴다.
            let target_prev_transitionpath= index_asc_transitionslist[o-1]['outputpath'];
            let target_path = index_asc_effectvideotakelist[o]['outputpath'];
            //target_prev_transitionpath = target_prev_transitionpath.replace('./process/files/','');
            //target_path = target_path.replace('./process/files/','');

            merged_data += ('file '+s3_origin_dns+'clllap/'+target_prev_transitionpath+'\n');
            merged_data += ('file '+s3_origin_dns+'clllap/'+target_path+'\n');
        }
    }
    console.log('===>>모두 쓴 meregd_datasss==================>>',merged_data);

   // var ffmpeg_local_native =spawn("ffmpeg",[]);
   var history_file=`./${request_id}_merged_history.txt`;
   fs.open(history_file,'w',function(err,fd){
       if(err) throw err;
       console.log('file open completetessss');

       fs.writeFile(history_file,merged_data, 'utf8', function(error){
          console.log('대상 파일 쓰기 완료!!파일을 모두 쓴후에 리스트화 한 후에 그 리스트된 순서대로 해서 합쳐야만한다.',error,merged_data);
          
          //대상 쓴 파일(방금 쓰기가 완료된 파일에 대해서 관련 처리를 한다. 파일속의 관련 집합대상들을 합칠뿐임.)
          //var ffmpeg_local_native = spawn("ffmpeg",["-f","concat","-i",history_file,"-c","copy",`${concatmp4filepath}${request_id}_opencv_transition_merged.mp4`]);
          var ffmpeg_local_native = spawn("ffmpeg",["-f","concat","-safe",'0',"-protocol_whitelist","file,http,https,tcp,tls","-i",history_file,"-c","copy",'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','-f','mp4','-movflags','frag_keyframe','pipe:1']);

          var output_complete = false;
          var output_buffer_array=[];

          let buffer_data_final;
          ffmpeg_local_native.stderr.on("data",function(data){
              console.log(data.toString());
          });
          ffmpeg_local_native.stdout.on("data",function(data){
              output_buffer_array.push(data);
          })
          ffmpeg_local_native.stderr.on("end",function(){
              console.log("transition opencv merged files process finalss all merged");

              output_complete=true;

              console.log('output straemssss:',output_buffer_array);

              let buffer_result=Buffer.concat(output_buffer_array);
              console.log('buffer reulstsss:',buffer_result);
              console.dir(buffer_result);

              buffer_data_final=buffer_result;
          });
          ffmpeg_local_native.stderr.on("exit",function(){
              console.log('child porecess exited');
          });
          ffmpeg_local_native.stderr.on("close",function(){
              console.log('....closing itiemss! byess');
          });

          let standby = setInterval(function(){
            if(output_complete){
                //모두 병합이 다되었을때.. 관련하여 마친다.
                clearInterval(standby);
                callback(`${request_id}_opencv_transition_merged.mp4`,buffer_data_final,res,delete_planning_s3upload_total_frames,delete_planning_s3upload_total_frames2,music,request_id);
            }
          },20);
       });
    });
}

//비디오(단일) 이미지로 추출(프레임률에 따른 이미지 분배)
exports.initVedioFile=function(targetFile,savedPath,callback){
    try{
        new ffmpeg(targetFile,(err,video)=>{
            if(!err){
                let img_option={
                    ...options,
                    number: video.metadata.duration.seconds//파일의 초.듀레이션
                }
                video.fnExtractFrameToJPG(savedPath,img_option,(error,files)=>{
                    if(callback){
                        callback(video.metadata,files,error)
                    }else{
                        throw 'callback function is null'
                    }
                })
            }else{
                console.log('Erorrsss:',err);
            }
        })
    }catch(e){
        console.log(e.code);
        console.log(e.msg);
    }
}
//분배된 이미지끼리 이어붙여 영상으로 병합 및 저장.
exports.buildVedioFile= function(element,targetmp4file,tmpPath,newPath,callback){
    new ffmpeg(targetmp4file, (err,video)=>{
        if(!err){
            let filenames=[];
            element.forEach(arg=>{
                filenames.push(makeid(20)+'.mp4')
            })
            let index=0;
            function looper(){
                return new Promise( (succ,fail)=>{
                    if(index==element.length) return succ()
                    try{
                        video
                        .setVideoStartTime(element[index][0] !=0 ? element[index][0]-1 : 0)
                        .setVideoDuration(element[index].length != 1 ? element[index].length - 1 : 1)
                        .save(tmpPath + filenames[index], (error,file)=>{
                            if(!error){
                                console.log('changed timess:',index);
                            }else{
                                console.log('changed tiemsss:',error);
                            }
                            index = index+1;
                            succ(looper());
                        })
                    }catch(error){
                        fail(error);
                    }
                })
            }
            looper().finally( () => {
                console.log('end');

                const concatmp4filetmpPath= tmpPath;
                const concatmp4filePath = newPath + makeid(20) + '.mp4';
                console.log(concatmp4filetmpPath);
                console.log(concatmp4filePath);
                let mergedVideo = fluent_ffmpeg()

                filenames.forEach(element => {
                    mergedVideo = mergedVideo.addInput(tmpPath + element)
                })

                mergedVideo.mergeToFile(concatmp4filePath,concatmp4filetmpPath)
                .on('error',function(err){
                    if(callback) callback(null)
                })
                .on('end',function(){
                    if(callback) callback(concatmp4filePath)
                })
            })
        }
    })
}


//FFMPEG TRANSITIONSS1 FFMPEG-CONCAT!!
exports.transition_merged= async function(target_files,res,callback){
    console.log('merged transiton vidoess(async functions)::',target_files,callback);

    //ffmpeg-concat의 인자 자체가 다수 비디오들이고 이들끼리 기본값 합치면서 사이사이 트랜지션(opengl효과) 넣는다.
    let output_identityid=makeid(20)+'_withTransitions';
    let make_concatfilename=`${concatmp4filepath}${output_identityid}.mp4`;
    console.log('make transiton concatfilessnames:',make_concatfilename);

    //async function multiple vidoes merged and transitons
    var result = await concat({
        output: make_concatfilename,
        videos: target_files,
        transitions: [
            {
                name : 'squaresWire',
                duration: 3000
            }
        ]
    });

    console.log('what reusltsss??;',result);//undefined not resultss!!!..파일시스템상에서 해당 새로 생성되는 식별자의 파일이 이미 존재하며 파일이 크게 존재할경우!
    //await실행흐름 기다리는것이다>>>기다리고 처리가 다 된 이후에 callback호출개념 비동기를 고려한 설계였으나, 동기흐름에서도 작동엔 문제는 없음>
    callback(make_concatfilename,output_identityid,res);
}

//비디오 올린것들(넘어온 비디오들개체)에 대해서 각 테이크별 전체이미지분할+양끝단 부분만 부분분할 한 결과등을 처리api
exports.video_img_extract = async function(takeindex,upload_target,extract_file_callback,res,request_id,take_video_process_info){
    //임의 서버상의 비디오를 전체 프레임분할합니다. ffmpeg
    console.log('extracnt file_callback whatss: request_id>>>>',upload_target,extract_file_callback,request_id);
    console.log('REQUEST ID::]]]::',request_id,takeindex);

   //if(upload_list.length >= 2){
    var data_gathering={};
    var iscomplete=false;//각 테이크별 함수요청에서의 ffmpeg분할 처리작업이 모두 완수여부.
    if(upload_target!=''){
        console.log('===>>>전달 take 영상 관련 extractn처리 >============',upload_target);
        //var pure_filename=upload_list[0].split('/')[3].split('.')[0];  requestid_encode
        var takevideo_imgdata=[];//전체프레임데이터. ec2 path위치값들>>이것들을 기억하고있다가 테이크별로하여 모두완수시에 s3로 일괄업로드처리위함, 또한 원본대상들은 후에 삭제>
        var takevideo_imgdata_upload=[];
        var takevideo_imgdata_plans3=[];
        fluent_ffmpeg.ffprobe(upload_target,function(err,metadata){
            let extract_framefilenames_format= `take${takeindex}encoded_frame`;
            if(err){
                console.log('metadata not foundsss....'+err);
            }else{
                console.log('ssmeat datasss:',metadata,metadata.format);
                
                let streams=metadata.streams;
                let avg_frame_rate;//평균프레임률
                let original_duration;//원본영상의 고유 길이값.
                for(let s=0; s<streams.length; s++){
                    if(streams[0].codec_type=='video'){
                        let left= parseInt(streams[0].avg_frame_rate.split('/')[0]);
                        let right= parseInt(streams[0].avg_frame_rate.split('/')[1]);
                        avg_frame_rate=parseInt(left / right);
                        
                    }
                }

                original_duration = parseInt(metadata.format.duration);           
                let edited_duration = take_video_process_info['duration'];//넘어온 관련된 객체정보
                let edited_startpos = take_video_process_info['startpos'];//시작지점~-t duration자른 길이만큼의 길이값으로 구간만큼만 자르면 된다. 그러면 avgfps * duration길이만큼의 프레임이미지들 테이크요청비디오별로 생성되게된다. 이게 일단 ec2에 저장되고 ->이걸 이미지처리될때마다 s3업로드하며,성공시마다 삭제.

                let total_created_images_full= avg_frame_rate * edited_duration;//초당 프레임률 평균값.초당 보여지는 비디오수를 n초간 할시에. 
                console.log('대상 비디오의 프레임률 구한다(평균avgfps,편집길이값,생성이미지수)',avg_frame_rate,edited_startpos,edited_duration,total_created_images_full);
            
                var ffmpeg_local_native2 = spawn("ffmpeg",['-ss',`${edited_startpos}`,'-t',`${edited_duration}`,'-i',upload_target,'-r',`${avg_frame_rate}`,'-f','image2',`./tmp/${request_id}_${extract_framefilenames_format}%d.png`]);//requestid_take1encoded_frame1,2,3,4,5형태 포맷으로 생성될것임.>>                    
                ffmpeg_local_native2.stderr.on("data",function(data){
                    console.log(data.toString());
                });
                ffmpeg_local_native2.stderr.on("end",function(){
                    console.log('file process successfully',extract_framefilenames_format);
                    for(let j=0; j<total_created_images_full; j++){
                        takevideo_imgdata.push(`./tmp/${request_id}_${extract_framefilenames_format}${j+1}.png`);//전체 추출된 이미지들을 저장한다.>>
                        takevideo_imgdata_upload.push(`clllap/${request_id}_${extract_framefilenames_format}${j+1}.png`);
                        takevideo_imgdata_plans3.push(`${s3_origin_dns}clllap/${request_id}_${extract_framefilenames_format}${j+1}.png`);

                    }
                    console.log('처리된 vieo_imgdatasss full:',takevideo_imgdata,takevideo_imgdata_upload,takevideo_imgdata_plans3);

                    if(fs.existsSync(takevideo_imgdata[0],`./tmp/${request_id}_${extract_framefilenames_format}1copy.png`)){
                        var copy_start_data= fs.copyFileSync(takevideo_imgdata[0],`./tmp/${request_id}_${extract_framefilenames_format}1copy.png`);
                    }
                    if(fs.existsSync(takevideo_imgdata[total_created_images_full-1],`./tmp/${request_id}_${extract_framefilenames_format}${total_created_images_full}copy.png`)){
                        var copy_end_data= fs.copyFileSync(takevideo_imgdata[total_created_images_full-1],`./tmp/${request_id}_${extract_framefilenames_format}${total_created_images_full}copy.png`);
                    }
                    data_gathering[`${takeindex}_full_data`]= takevideo_imgdata;
                    data_gathering[`${takeindex}_full_data_upload`]= takevideo_imgdata_upload;
                    data_gathering[`${takeindex}_full_data_plans3`] = takevideo_imgdata_plans3;//업로드처리될 path값.
                    data_gathering[`${takeindex}_full`]=true;
                    //data_gathering[`${takeindex}_start_data`]= takevideo_imgdata[0];
                    //data_gathering[`${takeindex}_end_data`] = takevideo_imgdata[total_created_images_full-1];
                    data_gathering[`${takeindex}_start_data`] = `${request_id}_${extract_framefilenames_format}1copy.png`;
                    data_gathering[`${takeindex}_end_data`] = `${request_id}_${extract_framefilenames_format}${total_created_images_full}copy.png`;

                    data_gathering[`takeindex`] = takeindex;//gathering객체는 각 테이크비디오의 시작,끝프레임path,전체프레임path배열,몇 테이크비디오index인지 여부등의정보 저장

                    iscomplete=true;
                });
                ffmpeg_local_native2.stderr.on("exit",function(){
                    console.log('child process exited');
                });
                ffmpeg_local_native2.stderr.on('close',function(){
                    console.log('...closing times.! byes');
                });
            }
        });
    }
    
    let standby_securecnt=0;
    let standby=setInterval(function(){
        //console.log('===>>(VIDEO_IMG_EXTRACT))function >>> 대기호출',takeindex,data_gathering,standby,iscomplete);
        if( iscomplete==true){
            //수집이 완료된경우
            console.log('===>>(VIDEO_IMG_EXTRACT))영상take 데이터 모두 분할 및 ffmpeg처리 저장:',takeindex,data_gathering);
            clearInterval(standby);

            extract_file_callback(data_gathering,res,request_id,takeindex);
            return data_gathering;
        }
            
        if(standby_securecnt == 5000){
            clearInterval(standby);
        }
        standby_securecnt++;
    },200);  
}

exports.between_transition_merged = async function(request_id,between_distinct,callback,res,betweenindex){
    console.log('merged between transition vidoess(async functionss)::',request_id,between_distinct,callback,betweenindex);

    let between_order_index=betweenindex;

    //var ffmpeg_local_native = spawn("ffmpeg",["-r",26,"-f","image2","-s","1280x720",'-i',`./process/files/${request_id}_blend_transitionImg_${between_distinct}_%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./process/files/${request_id}_${between_distinct}_transitionoutput.mp4`]);
    //var ffmpeg_local_native = spawn("ffmpeg",["-r",26,"-f","image2","-s","1280x720",'-i',`${between_distinct}_%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./process/files/${request_id}_${between_distinct}_transitionoutput.mp4`]);
    
    var ffmpeg_local_native = spawn("ffmpeg",["-r","26","-f","image2","-s","1280x720","-i",`${s3_origin_dns}clllap/${between_distinct}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','-f','mp4','-movflags','frag_keyframe','pipe:1']);

    var output_complete=false;
    var output_buffer_array=[];

    let buffer_data;
    ffmpeg_local_native.stderr.on("data",function(data){
        console.log('data progrress executess:',data.toString());
    });
    ffmpeg_local_native.stdout.on('data',function(data){
        output_buffer_array.push(data);
    });
    ffmpeg_local_native.stderr.on('end',function(){
        console.log('transition opencv merged file process successfully');
        
        output_complete = true;

        console.log('outpput_ statmemtnsss:',output_buffer_array);
        let buffer_result=Buffer.concat(output_buffer_array);
        console.log('buffer_resultsss:',buffer_result);
        console.dir(buffer_result);

        buffer_data=buffer_result;
    });
    ffmpeg_local_native.stderr.on('exit',function(){
        console.log('child procdes exited');
    });
    ffmpeg_local_native.stderr.on('close',function(){
        console.log("...closing time! byess");
    });

    let secure_cnt=0;
    let standby=setInterval(function(){
        //console.log('===>>대기호출',data_gathering,standby);
        //console.log('업로드수_======>>',upload_count);

        if(output_complete){
            clearInterval(standby);
            callback({index:between_order_index, outputpath:`${between_distinct}_transitionoutput.mp4`,buffer_data:buffer_data},res);
        }       
        if(secure_cnt==2000){
            clearInterval(standby);
        }
        secure_cnt++;
    },500);
}

exports.videotake_effect_merged= async function(request_id,take_distinct,callback,res,avgfps,takeindex){
    console.log('merged videotake upload videos effect processing(async function)::',request_id,take_distinct,callback,takeindex);
    console.log('요청비디오테이크,이펙트 적용::>>>',request_id,take_distinct);

    let take_order_index=takeindex;

    let output_buffer_array=[];

    //var ffmpeg_local_native=spawn("ffmpeg",["-r",takevideoper_avgframerate,"-f","image2","-s","1280x720","-i",`./process/files/${request_id}_${take_distinct}_partimg_process%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./process/files/${request_id}_${take_distinct}_effectoutput.mp4`]);
    var ffmpeg_local_native =spawn("ffmpeg",["-r",'26','-f','image2','-s','1280x720','-i',`${s3_origin_dns}clllap/${take_distinct}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','-f','mp4','-movflags','frag_keyframe','pipe:1']);

    var output_complete=false;
    let buffer_data;
    ffmpeg_local_native.stderr.on("data",function(data){
        console.log("ffmpeg progress exeucted staas:",data.toString());
    });
    ffmpeg_local_native.stdout.on('data',function(data){
        output_buffer_array.push(data);
    })
    ffmpeg_local_native.stderr.on('end',function(){
        console.log('effect opencv merged file process successfully');

        output_complete=true;

        let buffer_result=Buffer.concat(output_buffer_array);
        console.log('buffer resulsss:',buffer_result);
        console.dir(buffer_result);

        buffer_data=buffer_result;
    });
    ffmpeg_local_native.stderr.on('exit',function(){
        console.log('child process exited');
    });
    ffmpeg_local_native.stderr.on("close",function(){
        console.log('....closing time!! byess');
    });

    let secure_cnt=0;
    let standby= setInterval(function(){
        if(output_complete){
            clearInterval(standby);
            callback({index:take_order_index,outputpath:`${take_distinct}_effectoutput.mp4`,buffer_data:buffer_data},res);
        }

        if(secure_cnt==2000){
            clearInterval(standby);
        }
        ++secure_cnt;

    },200);
}
//FFMPEG 트랜지션 처리>>
exports.transition_merged2 = async function(request_id,target_files,res,callback,music){
    //console.log('merged tarnsiton anotrer versonss:',request_id,target_files,callback,music);

    //ff관련처리>>이후에 
    let output_identityid=request_id+'videos_withTransition';
    let make_tmp_filepath=`./tmp/${output_identityid}.mp4`;
    //console.log('make_tmp_filepath vertwo concatfilenamess:',make_tmp_filepath);

    let music_per_transition=commonvar.TRANSITON_EFFECT[`${music}_transition`];
    //console.log('=====...>>>MUSIC PER TRANSITIONSS:',music,music_per_transition);

    //async functio nmultiope lvideos merged ad rainstionss
    if(target_files.length>=2){
        if(target_files.length==1){
            console.log('====>>ffmpeg트랜지션처리 비디오 한개만올린경우는 그대로fs파일저장만 하고 추출내보내기');

            let ffmpeg_local_encoding=spawn("ffmpeg",['-i',target_files[0],'-map','0','-c:v','copy',make_tmp_filepath]);

            ffmpeg_local_encoding.stderr.on("data",function(data){
                console.log('ffmpeg transition adaptingsss:',data.toString());
            });
            ffmpeg_local_encoding.stderr.on("end",function(){
                callback(make_tmp_filepath,output_identityid,res);
            });
        }else{
            let standby_videos=[];
            function promise_standby(){
                return new Promise((resolve,reject)=>{
                    console.log(`promise대기함수 호출>>>>>>;;;[]]]]]]]`);

                    let inner_standbycnt=0;
                    let inner_standby=setInterval(function(){
                        if(standby_videos.length==target_files.length){
                            console.log('FFMPEG TRANSTION MERGED비디오 데이터준비완료:',standby_videos);

                            clearInterval(inner_standby);

                            resolve(standby_videos);
                        }
                        if(inner_standbycnt==2000){
                            clearInterval(inner_standby);
                            reject(new Error("Promise function timeout erross"));
                        }
                        inner_standbycnt++;
                    },400);
                })
            }
            for(let t=0; t<target_files.length; t++){
                (function(t){
                    let target_item=target_files[t];
                    console.log('target filess 정보 얻기<<ffmpeg transitonss>>:',t,target_item);
                    fluent_ffmpeg.ffprobe(target_item,function(err,metadata){
                        if(err){
                            console.log("metadata not foundsss:",err);
                        }else{
                            let duration=metadata.format.duration;
                            duration=parseInt(duration);

                            standby_videos[t]={
                                //'takeindex':t+1,
                                'duration':duration
                            }
                        }
                    });
                })(t);
            }
            let return_set=await promise_standby();
            console.log('FFMPEG TRANSTION RETURN SETSS standby endings:',return_set);
            let endpos_information_array=[];
            let endpos_accum=0;
            let next_last_duration;
            let ffmpeg_transition_command_inputs=[];
            let ffmpeg_transition_command_filtercomplex="";
            let ffmpeg_transition_command_filtercomplex2="";
            //let ffmpeg_transition_commands=[];
            for(let s=0; s<standby_videos.length;s++){
                let standby_video=standby_videos[s];
                if(s==0){
                    let adapt_duration;
                    if(standby_video.duration<=1){
                        adapt_duration=0.1;
                    }else{
                        adapt_duration=1;
                    }
                    let adapt_duration2;
                    if(standby_videos[s+1].duration<=1){
                        adapt_duration2=0.1;
                    }else{
                        adapt_duration2=1;
                    }
                    endpos_information_array[s]=standby_video.duration;//첫 비디오의 길이전체.0~14 14로지정.

                    endpos_accum+= endpos_accum + (standby_video.duration);//0+14(본인의 길이) 0+1=1

                    console.log('endpos_acucsom:',endpos_accum);
                    ffmpeg_transition_command_inputs.push("-i");
                    ffmpeg_transition_command_inputs.push(target_files[s]);
                    ffmpeg_transition_command_filtercomplex+=`[${s}]settb=AVTB[${s}:v];`;
                    ffmpeg_transition_command_filtercomplex2+=`[${s}:v][${s+1}:v]xfade=transition=${music_per_transition}:duration=${adapt_duration}:offset=${parseFloat(endpos_accum-adapt_duration).toFixed(1)}[v${s+1}];`


                    next_last_duration=adapt_duration;
                }else if(s<=standby_videos.length-1){
                    /*let adapt_duration;
                    if(standby_videos[s-1].duration<=1){
                        adapt_duration=0.1;
                    }else{
                        adapt_duration=1;
                    }*/
                   
                    ffmpeg_transition_command_inputs.push("-i");
                    ffmpeg_transition_command_inputs.push(target_files[s]);

                    ffmpeg_transition_command_filtercomplex+=`[${s}]settb=AVTB[${s}:v];`;
                    let adapt_duration2;

                    if(s<=standby_videos.length-2){
                   
                        if(standby_videos[s+1] && standby_videos[s+1].duration<=1){
                            adapt_duration2=0.1;
                        }else{
                            adapt_duration2=1;
                        }
                        endpos_accum= parseFloat(endpos_accum + (standby_video.duration -next_last_duration)).toFixed(1);//(0+14)+(14-1) + (20-1) + (15-1) 
                        endpos_accum= parseFloat(endpos_accum);
                        endpos_information_array[s]= endpos_accum;

                        console.log('endpos_acucsom:',endpos_accum);

                        if(s<standby_videos.length-2){
                            ffmpeg_transition_command_filtercomplex2+=`[v${s}][${s+1}:v]xfade=transition=${music_per_transition}:duration=${adapt_duration2}:offset=${parseFloat(endpos_accum-adapt_duration2).toFixed(1)}[v${s+1}];`;
                        }else if(s==standby_videos.length-2){
                            ffmpeg_transition_command_filtercomplex2+=`[v${s}][${s+1}:v]xfade=transition=${music_per_transition}:duration=${adapt_duration2}:offset=${parseFloat(endpos_accum-adapt_duration2).toFixed(1)},format=yuv420p[video]`;
                        }                 
                    }
                    next_last_duration=adapt_duration2;
                }
            }
            console.log('적용할 endpos information transtiioning infossss',endpos_information_array);
            console.log('ffmpeg_transtion_command_inputss:',ffmpeg_transition_command_inputs);
            console.log("ffmpeg_transtiino_command_filtercomplex::",ffmpeg_transition_command_filtercomplex);
            console.log("ffmpeg_tarnstiiono_command_filtercomplex2::",ffmpeg_transition_command_filtercomplex2);

            ffmpeg_transition_command_inputs.push("-filter_complex");
            ffmpeg_transition_command_inputs.push(`${ffmpeg_transition_command_filtercomplex} ${ffmpeg_transition_command_filtercomplex2}`);
            ffmpeg_transition_command_inputs.push('-map');ffmpeg_transition_command_inputs.push('[video]');
            ffmpeg_transition_command_inputs.push(make_tmp_filepath);
            console.log('final adapt ffmpeg트랜지션 처리 명령줄:',ffmpeg_transition_command_inputs);


            var ffmpeg_transition_native=spawn("ffmpeg",ffmpeg_transition_command_inputs);

            ffmpeg_transition_native.stderr.on("data",function(data){
                console.log('ffmpeg transition adaptingsss:',data.toString());
            });
            ffmpeg_transition_native.stderr.on("end",function(){
                callback(make_tmp_filepath,output_identityid,res);
            });
        }
        
    }
    /*else if(target_files.length==3){

        let standby_videos=[];
        function promise_standby(){
            return new Promise((resolve,reject)=>{
    
                //console.log('promise 대기함수 호출>>>>;]]]]]]');

                let inner_standbycnt=0;
                let inner_standby=setInterval(function(){
                    
                    if(standby_videos.length == target_files.length){
                        //console.log('관련 데이터 비디오데이터 준비완료:',standby_videos);

                        clearInterval(inner_standby);

                        resolve(standby_videos);
                    }
                    if(inner_standbycnt == 2000){
                        clearInterval(inner_standby);

                        reject(new Error('promise function timeout error'));
                    }
                    inner_standbycnt++;
                },150);
            })
        }

        //var ffmpeg_globe_native = spawn('ffmpeg',['-i',target_files[0],'-i',target_files[1],'-i',target_files[2],'-filter_complex','[0][1:v]xfade=transition=fade:duration=4:offset=12[vfade1];[vfade1][2:v]xfade=transition=hblur:duration=4:offset=26,format=yuv420p[video]','-vcodec','libx264','-map','[video]',make_concatfilename]);
        let first_target=target_files[0];
        let second_target=target_files[1];
        let third_target=target_files[2];

        fluent_ffmpeg.ffprobe(first_target,function(err,metadata){
            if(err){
                console.log('meatadadt not foundsss:'+err);
            }
            else{
                console.log('ssmematat datass:',metadata,metadata.format);
                let duration = metadata.format.duration;
                duration = parseInt(duration);

                //console.log('관련 영상 길이값:',duration);

                standby_videos[0]={
                    'takeindex' : 1,
                    'duration' : duration
                };
            }
        });
        fluent_ffmpeg.ffprobe(second_target,function(err,metadata){
            if(err){
                console.log('meatadadt not foundsss:'+err);
            }
            else{
                console.log('ssmematat datass:',metadata,metadata.format);
                let duration = metadata.format.duration;
                duration = parseInt(duration);

                //console.log('관련 영상 길이값:',duration);

                standby_videos[1]={
                    'takeindex' : 2,
                    'duration' : duration
                };
            }
        });
        fluent_ffmpeg.ffprobe(third_target,function(err,metadata){
            if(err){
                console.log('meatadadt not foundsss:'+err);
            }
            else{
                console.log('ssmematat datass:',metadata,metadata.format);
                let duration = metadata.format.duration;
                duration = parseInt(duration);

               // console.log('관련 영상 길이값:',duration);

                standby_videos[2]={
                    'takeindex' : 3,
                    'duration' : duration
                };
            }
        });

        let return_set = await promise_standby();//standby_videos test
       // console.log('return setsss:',return_set);

        let firstfile_endpos=standby_videos[0].duration;//14s였다면
        let first_second_merged_endpos=firstfile_endpos + standby_videos[1].duration - 2;//14+14-2=>26

        var ffmpeg_transition_native= spawn("ffmpeg",['-i',target_files[0],'-i',target_files[1],'-i',target_files[2],'-filter_complex',`[0]settb=AVTB[0:v]; [1]settb=AVTB[1:v]; [2]settb=AVTB[2:v]; [0:v][1:v]xfade=transition=${music_per_transition}:duration=2:offset=${firstfile_endpos-2}[v1]; [v1][2:v]xfade=transition=${music_per_transition}:duration=2:offset=${first_second_merged_endpos-2},format=yuv420p[video]`,'-map','[video]',`${make_tmp_filepath}`]);

        ffmpeg_transition_native.stderr.on("data",function(data){
            console.log("FFMPEG transitons prpocess",data.toString());
        });
        ffmpeg_transition_native.stderr.on("end",function(){
            //console.log('three files merged tarnsitio suceesful yprtocess success!!');

            callback(make_tmp_filepath,output_identityid,res);
        });
    }else if(target_files.length==2){
        //var ffmpeg_globe_native = spawn('ffmpeg',['-i',target_files[0],'-i',target_files[1],'-filter_complex','[0][1:v]xfade=transition=fade:duration=4:offset=12,format=yuv420p[video]','-vcodec','libx264','-map','[video]',make_concatfilename]);
        let first_target=target_files[0];
        fluent_ffmpeg.ffprobe(first_target,function(err,metadata){
            if(err){
                console.log('metadata not foundsss..'+err);
            }else{
                //console.log('sssmeata datass:',metadata,metadata.format);
                let duration = metadata.format.duration;//대상 영상길이(초)
                duration = parseInt(duration);
                //console.log('관련 영상의 길이값!!:',duration);
    
                let ffmpeg_local_=spawn('ffmpeg',['-i',target_files[0],'-i',target_files[1],'-filter_complex',`[0][1:v]xfade=transition=${music_per_transition}:duration=2:offset=${duration-2},format=yuv420p[video]`,'-vcodec','libx264','-map','[video]',make_tmp_filepath]);
    
                ffmpeg_local_.stderr.on('data',function(data){
                   //console.log(data.toString());
                });
                ffmpeg_local_.stderr.on('end',function(){
                    console.log('two files merged trainsiton successfully procsss two split');

                    callback(make_tmp_filepath,output_identityid,res);
                })             
            }
        });
    }else if(target_files.length==4){

        let standby_videos=[];
        function promise_standby(){
            return new Promise((resolve,reject)=>{
    
                //console.log('promise 대기함수 호출>>>>;]]]]]]');

                let inner_standbycnt=0;
                let inner_standby=setInterval(function(){
                    
                    if(standby_videos.length == target_files.length){
                        //console.log('관련 데이터 비디오데이터 준비완료:',standby_videos);

                        clearInterval(inner_standby);

                        resolve(standby_videos);
                    }
                    if(inner_standbycnt == 2000){
                        clearInterval(inner_standby);

                        reject(new Error('promise function timeout error'));
                    }
                    inner_standbycnt++;
                },150);
            })
        }

        //var ffmpeg_globe_native = spawn('ffmpeg',['-i',target_files[0],'-i',target_files[1],'-i',target_files[2],'-filter_complex','[0][1:v]xfade=transition=fade:duration=4:offset=12[vfade1];[vfade1][2:v]xfade=transition=hblur:duration=4:offset=26,format=yuv420p[video]','-vcodec','libx264','-map','[video]',make_concatfilename]);
        let first_target=target_files[0];
        let second_target=target_files[1];
        let third_target=target_files[2];
        let four_target=target_files[3];

        fluent_ffmpeg.ffprobe(first_target,function(err,metadata){
            if(err){
                console.log('meatadadt not foundsss:'+err);
            }
            else{
                console.log('ssmematat datass:',metadata,metadata.format);
                let duration = metadata.format.duration;
                duration = parseInt(duration);

                //console.log('관련 영상 길이값:',duration);

                standby_videos[0]={
                    'takeindex' : 1,
                    'duration' : duration
                };
            }
        });
        fluent_ffmpeg.ffprobe(second_target,function(err,metadata){
            if(err){
                console.log('meatadadt not foundsss:'+err);
            }
            else{
                console.log('ssmematat datass:',metadata,metadata.format);
                let duration = metadata.format.duration;
                duration = parseInt(duration);

                //console.log('관련 영상 길이값:',duration);

                standby_videos[1]={
                    'takeindex' : 2,
                    'duration' : duration
                };
            }
        });
        fluent_ffmpeg.ffprobe(third_target,function(err,metadata){
            if(err){
                console.log('meatadadt not foundsss:'+err);
            }
            else{
                console.log('ssmematat datass:',metadata,metadata.format);
                let duration = metadata.format.duration;
                duration = parseInt(duration);

                //console.log('관련 영상 길이값:',duration);

                standby_videos[2]={
                    'takeindex' : 3,
                    'duration' : duration
                };
            }
        });
        fluent_ffmpeg.ffprobe(four_target,function(err,metadata){
            if(err){
                console.log('meatadadt not foundsss:'+err);
            }
            else{
                console.log('ssmematat datass:',metadata,metadata.format);
                let duration = metadata.format.duration;
                duration = parseInt(duration);

                //console.log('관련 영상 길이값:',duration);

                standby_videos[3]={
                    'takeindex' : 4,
                    'duration' : duration
                };
            }
        });

        let return_set = await promise_standby();//standby_videos test
        //console.log('return setsss:',return_set);

        let firstfile_endpos=standby_videos[0].duration;//14s였다면
        let first_second_merged_endpos=firstfile_endpos + standby_videos[1].duration - 2;//14+14-2=>26
        let second_third_merged_endpos=first_second_merged_endpos + standby_videos[2].duration - 2;//26+14-2=38

        var ffmpeg_transition_native= spawn("ffmpeg",['-i',target_files[0],'-i',target_files[1],'-i',target_files[2],'-i',target_files[3],'-filter_complex',`[0]settb=AVTB[0:v]; [1]settb=AVTB[1:v]; [2]settb=AVTB[2:v]; [3]settb=AVTB[3:v]; [0:v][1:v]xfade=transition=${music_per_transition}:duration=2:offset=${firstfile_endpos-2}[v1]; [v1][2:v]xfade=transition=${music_per_transition}:duration=2:offset=${first_second_merged_endpos-2}[v2]; [v2][3:v]xfade=transition=${music_per_transition}:duration=2:offset=${second_third_merged_endpos-2},format=yuv420p[video]`,'-map','[video]',`${make_tmp_filepath}`]);

        ffmpeg_transition_native.stderr.on("data",function(data){
            //console.log(data.toString());
        });
        ffmpeg_transition_native.stderr.on("end",function(){
            //console.log('fourth  files merged tarnsitio suceesful yprtocess success!!');

            callback(make_tmp_filepath,output_identityid,res);
        });
    }*/
}
//임의 list에 대한 인코딩진행>>
exports.targetfiles_encoding = async function(upload_files,res,callback){
    //console.log('targetfiles _encodingss:',upload_files,callback);

    let plan_output_encoding_iscomplete=[];
    let plan_output_encoding_path=[];
    let rel_id=makeid(20);//upload이후의 requewstid fixed transfer
    let upload_count=upload_files.length;

    //let passthroughstream_array=[];
    let plan_output_encoding_path_local=[];
    let plan_output_encoding_files_bufferData=[];//파일별 버퍼데이터.

    //for(let f=0; f<upload_files.length; f++){

    if(upload_files[0]){
        let encoding_filename = rel_id+'_encoded1';//첫번째 업로드 관련 파일

        plan_output_encoding_path.push(`${s3_origin_dns}clllap/encodingvideo${encoding_filename}.mp4`);//계획된 이름 업로드파일명
        plan_output_encoding_path_local.push(`clllap/encodingvideo${encoding_filename}.mp4`);//로컬형대로 key값형태로 지정.
        //console.log('uplodate_filess:',upload_files[0]);

        //각 업로드 파일이고, 각 파일별 모든 프레임별?버퍼총합 저장해야한다.
        let output_buffer_array_local=[];//버퍼 저장(첫번째 업로드파일을 인코딩처리한 ffmpeg영상데이터에 대한 버퍼전용임.)
        let duplex = STREAM_IMPORT.Duplex;//버퍼->rw스트림지원객체 스트림정보

        //let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[f],'-r','26',`${s3_origin_dns}${encoding_filename}.mp4`]);//반복문내에서 매번 생성된 지역변수형태의 전달값이며 ffmpeg spawn형태에 대한 핸들러,end등 등록한다>>
        let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[0],'-r','26','-f','mp4','-movflags','frag_keyframe','pipe:1']);
        ffmpeg_local_encoding.stdout.on("data",function(data){
            //console.log('ffmpeg stdoutss straem output pioe1 Datass:',data);

            output_buffer_array_local.push(data);
        })
        ffmpeg_local_encoding.stderr.on('data',function(data){
            //console.log('data process progressivess:',data.toString());
        });
        ffmpeg_local_encoding.stderr.on('end',function(){
           // console.log('uploaded files multiple encoding completed!!');//각 내역별로 완료되었다고 기록이 될뿐이고 이게 완료시마다 뭔가 기록을 남긴다.
            plan_output_encoding_iscomplete.push(1);//n건 업로드했다면 n건만큼 인코딩했었다고 기록이 1,1,1,1,1,1,남을뿐임. 그걸로 판단(요청별)

            //관련 버퍼로 모두 변환하는 작업이 끝났기에 다 되었다고도 할수있다.그걸 아직 s3로 업로드가 안된것일뿐.ec2가 아닌 s3에 저장
           // console.log('output buffer araraysss:',output_buffer_array_local);
            let buffer_result = Buffer.concat(output_buffer_array_local);

            //console.log('buffer reulstsss:',buffer_result,buffer_result.constructor);
            //console.log(buffer_result);
            //console.dir(buffer_result);

            let stream_locals=new duplex();
            stream_locals.push(buffer_result);
            stream_locals.push(null);
            //console.log('===>>buffer to duplex streamss data!!:',stream_locals);
            plan_output_encoding_files_bufferData[0]=[];
            plan_output_encoding_files_bufferData[0][0]=buffer_result;
            plan_output_encoding_files_bufferData[0][1]=stream_locals;
        });
    }
    if(upload_files[1]){
        let encoding_filename = rel_id+'_encoded2';//2번째 업로드 관련 파일

        plan_output_encoding_path.push(`${s3_origin_dns}clllap/encodingvideo${encoding_filename}.mp4`);//계획된 이름 업로드파일명
        plan_output_encoding_path_local.push(`clllap/encodingvideo${encoding_filename}.mp4`);//로컬형대로 key값형태로 지정.
        //console.log('uplodate_filess:',upload_files[1]);

        //각 업로드 파일이고, 각 파일별 모든 프레임별?버퍼총합 저장해야한다.
        let output_buffer_array_local=[];//버퍼 저장(첫번째 업로드파일을 인코딩처리한 ffmpeg영상데이터에 대한 버퍼전용임.)
        let duplex = STREAM_IMPORT.Duplex;//버퍼->rw스트림지원객체 스트림정보

        //let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[f],'-r','26',`${s3_origin_dns}${encoding_filename}.mp4`]);//반복문내에서 매번 생성된 지역변수형태의 전달값이며 ffmpeg spawn형태에 대한 핸들러,end등 등록한다>>
        let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[1],'-r','26','-f','mp4','-movflags','frag_keyframe','pipe:1']);
        ffmpeg_local_encoding.stdout.on("data",function(data){
            //console.log('ffmpeg stdoutss straem output pioe1 Datass:',data);

            output_buffer_array_local.push(data);
        })
        ffmpeg_local_encoding.stderr.on('data',function(data){
            //console.log('data process progressivess:',data.toString());
        });
        ffmpeg_local_encoding.stderr.on('end',function(){
           // console.log('uploaded files multiple encoding completed!!');//각 내역별로 완료되었다고 기록이 될뿐이고 이게 완료시마다 뭔가 기록을 남긴다.
            plan_output_encoding_iscomplete.push(1);//n건 업로드했다면 n건만큼 인코딩했었다고 기록이 1,1,1,1,1,1,남을뿐임. 그걸로 판단(요청별)

            //관련 버퍼로 모두 변환하는 작업이 끝났기에 다 되었다고도 할수있다.그걸 아직 s3로 업로드가 안된것일뿐.ec2가 아닌 s3에 저장
           // console.log('output buffer araraysss:',output_buffer_array_local);
            let buffer_result = Buffer.concat(output_buffer_array_local);

           // console.log('buffer reulstsss:',buffer_result,buffer_result.constructor);
           // console.log(buffer_result);
            //console.dir(buffer_result);

            let stream_locals=new duplex();
            stream_locals.push(buffer_result);
            stream_locals.push(null);
            //console.log('===>>buffer to duplex streamss data!!:',stream_locals);

            plan_output_encoding_files_bufferData[1]=[];
            plan_output_encoding_files_bufferData[1][0]=buffer_result;
            plan_output_encoding_files_bufferData[1][1]=stream_locals;
        });
    }
    if(upload_files[2]){
        let encoding_filename = rel_id+'_encoded3';//3번째 업로드 관련 파일

        plan_output_encoding_path.push(`${s3_origin_dns}clllap/encodingvideo${encoding_filename}.mp4`);//계획된 이름 업로드파일명
        plan_output_encoding_path_local.push(`clllap/encodingvideo${encoding_filename}.mp4`);//로컬형대로 key값형태로 지정.
        console.log('uplodate_filess:',upload_files[2]);

        //각 업로드 파일이고, 각 파일별 모든 프레임별?버퍼총합 저장해야한다.
        let output_buffer_array_local=[];//버퍼 저장(첫번째 업로드파일을 인코딩처리한 ffmpeg영상데이터에 대한 버퍼전용임.)
        let duplex = STREAM_IMPORT.Duplex;//버퍼->rw스트림지원객체 스트림정보

        //let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[f],'-r','26',`${s3_origin_dns}${encoding_filename}.mp4`]);//반복문내에서 매번 생성된 지역변수형태의 전달값이며 ffmpeg spawn형태에 대한 핸들러,end등 등록한다>>
        let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[2],'-r','26','-f','mp4','-movflags','frag_keyframe','pipe:1']);
        ffmpeg_local_encoding.stdout.on("data",function(data){
           // console.log('ffmpeg stdoutss straem output pioe1 Datass:',data);

            output_buffer_array_local.push(data);
        })
        ffmpeg_local_encoding.stderr.on('data',function(data){
            //console.log('data process progressivess:',data.toString());
        });
        ffmpeg_local_encoding.stderr.on('end',function(){
            //console.log('uploaded files multiple encoding completed!!');//각 내역별로 완료되었다고 기록이 될뿐이고 이게 완료시마다 뭔가 기록을 남긴다.
            plan_output_encoding_iscomplete.push(1);//n건 업로드했다면 n건만큼 인코딩했었다고 기록이 1,1,1,1,1,1,남을뿐임. 그걸로 판단(요청별)

            //관련 버퍼로 모두 변환하는 작업이 끝났기에 다 되었다고도 할수있다.그걸 아직 s3로 업로드가 안된것일뿐.ec2가 아닌 s3에 저장
           // console.log('output buffer araraysss:',output_buffer_array_local);
            let buffer_result = Buffer.concat(output_buffer_array_local);

           // console.log('buffer reulstsss:',buffer_result,buffer_result.constructor);
           // console.log(buffer_result);
           // console.dir(buffer_result);

            let stream_locals=new duplex();
            stream_locals.push(buffer_result);
            stream_locals.push(null);
            //console.log('===>>buffer to duplex streamss data!!:',stream_locals);

            plan_output_encoding_files_bufferData[2]=[];
            plan_output_encoding_files_bufferData[2][0]=buffer_result;
            plan_output_encoding_files_bufferData[2][1]=stream_locals;
        });
    }
    if(upload_files[3]){
        let encoding_filename = rel_id+'_encoded4';//4번째 업로드 관련 파일

        plan_output_encoding_path.push(`${s3_origin_dns}clllap/encodingvideo${encoding_filename}.mp4`);//계획된 이름 업로드파일명
        plan_output_encoding_path_local.push(`clllap/encodingvideo${encoding_filename}.mp4`);//로컬형대로 key값형태로 지정.
       // console.log('uplodate_filess:',upload_files[3]);

        //각 업로드 파일이고, 각 파일별 모든 프레임별?버퍼총합 저장해야한다.
        let output_buffer_array_local=[];//버퍼 저장(첫번째 업로드파일을 인코딩처리한 ffmpeg영상데이터에 대한 버퍼전용임.)
        let duplex = STREAM_IMPORT.Duplex;//버퍼->rw스트림지원객체 스트림정보

        //let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[f],'-r','26',`${s3_origin_dns}${encoding_filename}.mp4`]);//반복문내에서 매번 생성된 지역변수형태의 전달값이며 ffmpeg spawn형태에 대한 핸들러,end등 등록한다>>
        let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[3],'-r','26','-f','mp4','-movflags','frag_keyframe','pipe:1']);
        ffmpeg_local_encoding.stdout.on("data",function(data){
            //console.log('ffmpeg stdoutss straem output pioe1 Datass:',data);

            output_buffer_array_local.push(data);
        })
        ffmpeg_local_encoding.stderr.on('data',function(data){
            //console.log('data process progressivess:',data.toString());
        });
        ffmpeg_local_encoding.stderr.on('end',function(){
           // console.log('uploaded files multiple encoding completed!!');//각 내역별로 완료되었다고 기록이 될뿐이고 이게 완료시마다 뭔가 기록을 남긴다.
            plan_output_encoding_iscomplete.push(1);//n건 업로드했다면 n건만큼 인코딩했었다고 기록이 1,1,1,1,1,1,남을뿐임. 그걸로 판단(요청별)

            //관련 버퍼로 모두 변환하는 작업이 끝났기에 다 되었다고도 할수있다.그걸 아직 s3로 업로드가 안된것일뿐.ec2가 아닌 s3에 저장
           // console.log('output buffer araraysss:',output_buffer_array_local);
            let buffer_result = Buffer.concat(output_buffer_array_local);

            console.log('buffer reulstsss:',buffer_result,buffer_result.constructor);
            console.log(buffer_result);
            console.dir(buffer_result);

            let stream_locals=new duplex();
            stream_locals.push(buffer_result);
            stream_locals.push(null);
            //console.log('===>>buffer to duplex streamss data!!:',stream_locals);

            plan_output_encoding_files_bufferData[3]=[];
            plan_output_encoding_files_bufferData[3][0]=buffer_result;
            plan_output_encoding_files_bufferData[3][1]=stream_locals;
        });
    }
    if(upload_files[4]){
        let encoding_filename = rel_id+'_encoded5';//첫번째 업로드 관련 파일

        plan_output_encoding_path.push(`${s3_origin_dns}clllap/encodingvideo${encoding_filename}.mp4`);//계획된 이름 업로드파일명
        plan_output_encoding_path_local.push(`clllap/encodingvideo${encoding_filename}.mp4`);//로컬형대로 key값형태로 지정.
       // console.log('uplodate_filess:',upload_files[4]);

        //각 업로드 파일이고, 각 파일별 모든 프레임별?버퍼총합 저장해야한다.
        let output_buffer_array_local=[];//버퍼 저장(첫번째 업로드파일을 인코딩처리한 ffmpeg영상데이터에 대한 버퍼전용임.)
        let duplex = STREAM_IMPORT.Duplex;//버퍼->rw스트림지원객체 스트림정보

        //let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[f],'-r','26',`${s3_origin_dns}${encoding_filename}.mp4`]);//반복문내에서 매번 생성된 지역변수형태의 전달값이며 ffmpeg spawn형태에 대한 핸들러,end등 등록한다>>
        let ffmpeg_local_encoding=spawn("ffmpeg",['-i',upload_files[4],'-r','26','-f','mp4','-movflags','frag_keyframe','pipe:1']);
        ffmpeg_local_encoding.stdout.on("data",function(data){
            //console.log('ffmpeg stdoutss straem output pioe1 Datass:',data);

            output_buffer_array_local.push(data);
        })
        ffmpeg_local_encoding.stderr.on('data',function(data){
           // console.log('data process progressivess:',data.toString());
        });
        ffmpeg_local_encoding.stderr.on('end',function(){
           // console.log('uploaded files multiple encoding completed!!');//각 내역별로 완료되었다고 기록이 될뿐이고 이게 완료시마다 뭔가 기록을 남긴다.
            plan_output_encoding_iscomplete.push(1);//n건 업로드했다면 n건만큼 인코딩했었다고 기록이 1,1,1,1,1,1,남을뿐임. 그걸로 판단(요청별)

            //관련 버퍼로 모두 변환하는 작업이 끝났기에 다 되었다고도 할수있다.그걸 아직 s3로 업로드가 안된것일뿐.ec2가 아닌 s3에 저장
            //console.log('output buffer araraysss:',output_buffer_array_local);
            let buffer_result = Buffer.concat(output_buffer_array_local);

            //console.log('buffer reulstsss:',buffer_result,buffer_result.constructor);
            //console.log(buffer_result);
            console.dir(buffer_result);

            let stream_locals=new duplex();
            stream_locals.push(buffer_result);
            stream_locals.push(null);
            //console.log('===>>buffer to duplex streamss data!!:',stream_locals);

            plan_output_encoding_files_bufferData[4]=[];
            plan_output_encoding_files_bufferData[4][0]=buffer_result;
            plan_output_encoding_files_bufferData[4][1]=stream_locals;
        });
    }  
    //}

    let standby = setInterval(function(){
        if(plan_output_encoding_iscomplete.length == upload_count ){
            //업로드카운트수와 각 파일별 인코딩완료했다는 내역별 남긴것의 카운트여부 같으면 모두 인코딩완료됐다는것임>>
            //console.log('업로드한 리스트들에 대해서 모두 인코딩완료된 시점에 실행>>',upload_files,plan_output_encoding_iscomplete);
           // console.log('==>>모든 업로드별 비디오 인코딩완료시점때마다 완료시점때에는 그 완료알림이 처리된 인코딩비디오의 스트림저장값?:',plan_output_encoding_files_bufferData,plan_output_encoding_path_local);
            clearInterval(standby);

            callback(upload_files,plan_output_encoding_path,plan_output_encoding_files_bufferData,plan_output_encoding_path_local,res);
            //upload_files:원본파일업로드파일(인코딩전),plan_output_encodingpath(s3업로드 인코딩파일패스),plan_output_encoding_files_bufferData:(인코딩파일들 테이크별 버퍼데이터)/plan_output_encoding_path_lcaol(업로드할형태의url)  실질적 필요는 uplaod_files,plan_output_encoding_path
        }
    },20);
}
//전체 비디오 프레임 분할 프로미스함수(트랜지션처리영상->>전체분할프레임 추가적인 이미지처리>>)>>
/*exports.video_img_extract_total = async function(transition_result_data,request_id){
    return new Promise((resolve,reject)=>{
        //임의 서버상의 비디오를 전체 프레임분할합니다. ffmpeg
        //console.log('extracnt file_callback whatss: request_id>>>>',transition_result_data,request_id);

        var data_gathering={};
        var iscomplete=false;//ffmpeg분할 처리작업이 모두 완수여부.
        if(transition_result_data!=''){
            //console.log('===>>>전달 take 영상 관련 extractn처리 >============',transition_result_data);
            //var pure_filename=upload_list[0].split('/')[3].split('.')[0];  requestid_encode
            var takevideo_imgdata=[];//전체프레임데이터. ec2 path위치값들>>이것들을 기억하고있다가 테이크별로하여 모두완수시에 s3로 일괄업로드처리위함, 또한 원본대상들은 후에 삭제>
            //var takevideo_imgdata_upload=[];
            // var takevideo_imgdata_plans3=[];
            fluent_ffmpeg.ffprobe(transition_result_data,function(err,metadata){
                let extract_framefilenames_format= `${request_id}_videoframe`;
                if(err){
                    console.log('metadata not foundsss....'+err);
                }else{
                   // console.log('ssmeat datasss:',metadata,metadata.format);
                    
                    let streams=metadata.streams;
                    let avg_frame_rate;//평균프레임률
                    let original_duration;//원본영상의 고유 길이값.
                    for(let s=0; s<streams.length; s++){
                        if(streams[0].codec_type=='video'){
                            let left= parseInt(streams[0].avg_frame_rate.split('/')[0]);
                            let right= parseInt(streams[0].avg_frame_rate.split('/')[1]);
                           // avg_frame_rate=parseInt(left / right);
                            avg_frame_rate=parseFloat(left / right);
                        }
                    }
    
                    original_duration = parseFloat(metadata.format.duration);           
                    //original_duration = Math.ceil(metadata.format.duration);올림여슈연산처리.
                    let total_created_images_full= Math.ceil(avg_frame_rate * original_duration);//초당 프레임률 평균값.초당 보여지는 비디오수를 n초간 할시에. 
                
                    var ffmpeg_local_native2 = spawn("ffmpeg",['-ss',`0`,'-i',transition_result_data,'-r',`${avg_frame_rate}`,'-f','image2',`./tmp/${extract_framefilenames_format}%d.png`]);//requestid_take1encoded_frame1,2,3,4,5형태 포맷으로 생성될것임.>>                    
                    ffmpeg_local_native2.stderr.on("data",function(data){
                       // console.log(data.toString());
                    });
                    ffmpeg_local_native2.stderr.on("end",function(){
                       // console.log('file process successfully',extract_framefilenames_format);
                        for(let j=0; j<total_created_images_full; j++){
                            takevideo_imgdata.push(`./tmp/${extract_framefilenames_format}${j+1}.png`);//전체 추출된 이미지들을 저장한다.>>
                            //takevideo_imgdata_upload.push(`clllap/${request_id}_${extract_framefilenames_format}${j+1}.png`);
                            //takevideo_imgdata_plans3.push(`${s3_origin_dns}clllap/${request_id}_${extract_framefilenames_format}${j+1}.png`);
    
                        }
                        //console.log('처리된 vieo_imgdatasss full:',takevideo_imgdata);
    
                        if(fs.existsSync(takevideo_imgdata[0],`./tmp/${request_id}_${extract_framefilenames_format}1copy.png`)){
                            var copy_start_data= fs.copyFileSync(takevideo_imgdata[0],`./tmp/${request_id}_${extract_framefilenames_format}1copy.png`);
                        }
                        if(fs.existsSync(takevideo_imgdata[total_created_images_full-1],`./tmp/${request_id}_${extract_framefilenames_format}${total_created_images_full}copy.png`)){
                            var copy_end_data= fs.copyFileSync(takevideo_imgdata[total_created_images_full-1],`./tmp/${request_id}_${extract_framefilenames_format}${total_created_images_full}copy.png`);
                        }
                        data_gathering[`frame_full_data`]= takevideo_imgdata;
                        data_gathering['video_duration']= original_duration;
                        data_gathering['avg_frame_rate']=avg_frame_rate;
                        //data_gathering[`${takeindex}_full_data_upload`]= takevideo_imgdata_upload;
                        //data_gathering[`${takeindex}_full_data_plans3`] = takevideo_imgdata_plans3;//업로드처리될 path값.
                        data_gathering[`frame_full`]=true;
                        data_gathering['framefiles_nameformat'] = extract_framefilenames_format;
                        //data_gathering[`${takeindex}_start_data`]= takevideo_imgdata[0];
                        //data_gathering[`${takeindex}_end_data`] = takevideo_imgdata[total_created_images_full-1];
                        //data_gathering[`${takeindex}_start_data`] = `${request_id}_${extract_framefilenames_format}1copy.png`;
                        //data_gathering[`${takeindex}_end_data`] = `${request_id}_${extract_framefilenames_format}${total_created_images_full}copy.png`;
    
                        // data_gathering[`takeindex`] = takeindex;//gathering객체는 각 테이크비디오의 시작,끝프레임path,전체프레임path배열,몇 테이크비디오index인지 여부등의정보 저장
    
                        iscomplete=true;
                    });
                    ffmpeg_local_native2.stderr.on("exit",function(){
                        console.log('child process exited');
                    });
                    ffmpeg_local_native2.stderr.on('close',function(){
                        console.log('...closing times.! byes');
                    });
                }
            });
        }
        
        let standby_securecnt=0;
        let standby=setInterval(function(){
            //console.log('===>>(VIDEO_IMG_EXTRACT))function >>> 대기호출',takeindex,data_gathering,standby,iscomplete);
            if( iscomplete==true){
                //수집이 완료된경우
                //console.log('===>>(VIDEO_IMG_EXTRACT))영상take 데이터 모두 분할 및 ffmpeg처리 저장:',data_gathering);
                clearInterval(standby);
    
                //extract_file_callback(data_gathering,res,request_id,takeindex);
                resolve(data_gathering);
            }
                
            if(standby_securecnt == 5000){
                clearInterval(standby);

                reject(new Error('timeout error'));
            }
            standby_securecnt++;
        },200);  
    });
}*/

//다수개의 전달되어 넘어온 업로드 비디오이미지들끼리 병합합니다.(영상붙이기)*/
exports.mergedVideos = function(target_files,request_id){

    return new Promise(async(resolve,reject)=>{
        console.log('merged target videosss:',request_id,target_files);
        
        //파일별 타임베이스값 마지막비디오 timebase값 기준으로 통일화.
        /*let timebase_forloop=0;
        let lastvideo_timebase=11988;
        let standby_function=function(){
            return new Promise((resolve,reject)=>{
                let interval_cnt=0;
                let interval_inner=setInterval(function(){
                    if(target_files.length == timebase_forloop){
                        clearInterval(interval_inner);
                        resolve(true);
                    }
                    if(interval_cnt==3000){
                        clearInterval(interval_inner);
                        resolve(false);
                    }
                    interval_cnt++;
                },500);
               
            });
        }
        for(let ss=0; ss<target_files.length; ss++){
            fluent_ffmpeg.ffprobe(target_files[ss],function(err,metadata){
                if(err){
                    console.log('metadata not foundsss..'+err);
                }else{
                    //console.log('전처리대상 split videosfiless datass:',metadata,metadata.format);
      
                    let streams=metadata.streams;

                    let time_base;

                    for(let s=0; s<streams.length; s++){
                        if(streams[0].codec_type=='video'){
                            time_base= parseInt(streams[0]['time_base'].split('/')[1]) / parseInt(streams[0]['time_base'].split('/')[0]);                            
                        }
                    }
                    console.log('time_base whatsss:',time_base);
                    console.log('+++>>>대상 비디오의 timebase값 치환:',time_base);

                    lastvideo_timebase=time_base;

                    timebase_forloop++;
                }
            }); 
        }
        let standby_result=await standby_function();
        console.log('==>>얻어낸 통일화 timebase값:',lastvideo_timebase);
        
        let convert_iscomplete=[];
        for(let tt=0; tt<target_files.length; tt++){
            let target=target_files[tt];

            let store={};
            store['orderindex']=tt+1;
            store['data']=`${request_id}_${tt+1}_subpartConvert.mp4`;
            convert_iscomplete.push(store);

            //var ffmpeg_local_native = spawn("ffmpeg",['-i',target,'-video_track_timescale',lastvideo_timebase,'-vcodec','copy',`./tmp/${request_id}_${tt+1}_subpartConvert.mp4`]);
            var ffmpeg_local_native = spawn("ffmpeg",['-i',target,'-video_track_timescale',lastvideo_timebase,'-vcodec','copy',`./tmp/${request_id}_${tt+1}_subpartConvert.mp4`]);
            
            ffmpeg_local_native.stderr.on("data",function(data){
                 console.log(data.toString());
            });
            ffmpeg_local_native.stderr.on("end",function(){
                console.log("vidoesconvert timebase files process finalss");

            });
            ffmpeg_local_native.stderr.on("exit",function(){
                console.log('child porecess exited');
            });
            ffmpeg_local_native.stderr.on("close",function(){
                 console.log('....closing itiemss! byess');
            });
        }
        let standby_function2=function(){
            return new Promise((resolve,reject)=>{
                let interval_cnt=0;
                let interval_inner=setInterval(function(){
                    if(target_files.length == convert_iscomplete.length){
                        clearInterval(interval_inner);
                        resolve(convert_iscomplete);
                    }
                    if(interval_cnt==3000){
                        clearInterval(interval_inner);
                        resolve(false);
                    }
                    interval_cnt++;
                },500);
               
            });
        }
        let standby_result2=await standby_function2();
        console.log('====>>비디오 병합 전 전처리작업완료(tbn통일화,fps는 다 다름)',standby_result2);

        standby_result2.sort(function(a,b){
            return a.orderindex - b.orderindex;
        })
        console.log('====>>비디오 병합 전 전처리작업완료(tbn통일화,fps는 다 다름)정렬orderindex순으로 정렬',standby_result2);*/

        var merged_data='';
        for(let o=0; o<target_files.length; o++){
            fluent_ffmpeg.ffprobe(target_files[o],function(err,metadata){
                if(err){
                    console.log('metadata not foundsss..'+err);
                }else{
                    //console.log('확인된 처리된 비디오별 메타정보:',metadata);
                }
            });
            
            let target_path = target_files[o];
            //target_path = target_path.replace('./process/files/','');
            merged_data += ('file '+target_path+'\n');//내용물 한개를 쓴다.
            
        }
         console.log('===>>모두 쓴 meregd_datasss==================>>',merged_data);

        // var ffmpeg_local_native =spawn("ffmpeg",[]);
        var history_file=`${request_id}_subpart_merged.txt`;
        fs.open(history_file,'w',function(err,fd){
            if(err) throw err;
            console.log('file open completetessss');

            fs.writeFile(history_file,merged_data, 'utf8', function(error){
               // console.log('대상 파일 쓰기 완료!!파일을 모두 쓴후에 리스트화 한 후에 그 리스트된 순서대로 해서 합쳐야만한다.',error,merged_data);
                
                //대상 쓴 파일(방금 쓰기가 완료된 파일에 대해서 관련 처리를 한다. 파일속의 관련 집합대상들을 합칠뿐임.)
                //var ffmpeg_local_native = spawn("ffmpeg",["-f","concat","-i",history_file,"-c","copy",`${concatmp4filepath}${request_id}_opencv_transition_merged.mp4`]);
                var ffmpeg_local_native = spawn("ffmpeg",["-f","concat","-safe",'0',"-protocol_whitelist","file,http,https,tcp,tls","-i",history_file,"-c","copy",'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./tmp/${request_id}_subpartMerged.mp4`]);

                var output_complete = false;

                ffmpeg_local_native.stderr.on("data",function(data){
                   // console.log(data.toString());
                });
                ffmpeg_local_native.stderr.on("end",function(){
                   // console.log("transition vidoes merged files process finalss all merged");

                    output_complete=true;

                    if(fs.existsSync(history_file)){
                        fs.unlinkSync(history_file);
                    }
                });
                ffmpeg_local_native.stderr.on("exit",function(){
                    //console.log('child porecess exited');
                });
                ffmpeg_local_native.stderr.on("close",function(){
                   // console.log('....closing itiemss! byess');
                });

                let standby_cnt=0;
                let standby = setInterval(function(){
                    if(output_complete){
                        //모두 병합이 다되었을때.. 관련하여 마친다.
                        clearInterval(standby);
                        //callback(`${request_id}_opencv_transition_merged.mp4`,buffer_data_final,res,delete_planning_s3upload_total_frames,delete_planning_s3upload_total_frames2,music,request_id);
                        resolve({success:true,data:`${request_id}_subpartMerged.mp4`, subpartdata:target_files});
                    }

                    if(standby_cnt==3000){
                        clearIntnerval(standby);
                        reject(new Error("server timeout error"));
                    }
                    standby_cnt++;
                },400);
            });
        });
    });   
}
//임의 비디오를 부분분할한 결과를 콜백
/*exports.video_subpart_slice_normal = async function(takeindex,upload_target,extract_file_callback,res,request_id,take_video_process_info){
    //console.log('target filess split modulsss:',takeindex,upload_target,extract_file_callback,take_video_process_info);

    var data_gathering={};
    var iscomplete=false;

    
    if(upload_target!=''){
        //console.log('======>>전달 take영상관련 extract처리 및 병합처리>>:',upload_target);

        let takevideo_imgdata=[];//자른 구간 프레임데이터. 추후 처리시에 콜백에서 삭제하기위한정보
        
        fluent_ffmpeg.ffprobe(upload_target,function(err,metadata){
            let extract_framefilenames_format=`take${takeindex}encoded_frame`;

            if(err){
                console.log(`metadata not fonudss...`+err);
            }else{
                //console.log('smmemt datsss:',metadata,metadata.format);

                let streams=metadata.streams;
                let avg_frame_rate;
                let original_duration;
                for(let i=0; i<streams.length; i++){
                    if(streams[0].codec_type=='video'){
                        let left=parseInt(streams[0].avg_frame_rate.split('/')[0]);
                        let right=parseInt(streams[0].avg_frame_rate.split('/')[1]);
                        avg_frame_rate=parseInt(left / right);
                       // console.log('left,right,avg:',left,right,avg_frame_rate);
                        
                    }
                }

                original_duration = parseInt(metadata.format.duration);
                let edited_duration = take_video_process_info['duration'];
                let edited_startpos = take_video_process_info['startpos'];

                let total_created_images_full = avg_frame_rate * edited_duration;
               // console.log('대상 비디오의 프레임률구한다 :',avg_frame_rate,edited_startpos,edited_duration,total_created_images_full);

                var ffmpeg_local_native2 = spawn("ffmpeg",['-ss',`${edited_startpos}`,'-t',`${edited_duration}`,'-i',upload_target,'-r',`${avg_frame_rate}`,'-f','image2',`./tmp/${request_id}_${extract_framefilenames_format}%d.png`]);//requestid_take1encoded_frame1,2,3,4,5형태 포맷으로 생성될것임.>>                    
                ffmpeg_local_native2.stderr.on("data",function(data){
                    console.log(data.toString());
                });
                ffmpeg_local_native2.stderr.on("end",function(){
                    console.log('file process successfully',extract_framefilenames_format);
                    for(let j=0; j<total_created_images_full; j++){
                        takevideo_imgdata.push(`./tmp/${request_id}_${extract_framefilenames_format}${j+1}.png`);//전체 추출된 이미지들을 저장한다.>>

                    }
                    //console.log('처리된 vieo_imgdatasss full:',takevideo_imgdata);

                    data_gathering[`${takeindex}_full_data`]= takevideo_imgdata;//삭제하기위한 생성데이터.
                    data_gathering[`${takeindex}_full`]=true;

                    data_gathering[`takeindex`] = takeindex;//gathering객체는 각 테이크비디오의 시작,끝프레임path,전체프레임path배열,몇 테이크비디오index인지 여부등의정보 저장


                    let ffmpeg_local_native = spawn("ffmpeg",['-r',`${avg_frame_rate}`,'-f','image2','-i',`./tmp/${request_id}_${extract_framefilenames_format}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p',`./tmp/${request_id}_${extract_framefilenames_format}_subpart.mp4`]);

                    ffmpeg_local_native.stderr.on('data',function(data){
                        console.log(data.toString());
                    });
                    ffmpeg_local_native.stderr.on('end',function(){
                        console.log('file process mereged succefully',extract_framefilenames_format);
                        
                        //파일프레임 병합완료되었으면 바로 관련 대상들 삭제하고 그 결과파일을.>>테이크별로 반환해야함.
                        let delete_frame_targets=data_gathering[`${takeindex}_full_data`];//해당 테이크 fulldata모두 삭제
                        for(let del=0; del<delete_frame_targets.length; del++){
                            let del_target=delete_frame_targets[del];

                            if(fs.existsSync(del_target)){
                                console.log('대상체 frame분할 파일존재 삭제:',del_target)
                                fs.unlinkSync(del_target);
                            }
                        }

                        data_gathering[`${takeindex}_subpartvideo_data`]=`./tmp/${request_id}_${extract_framefilenames_format}_subpart.mp4`;

                        iscomplete=true;   
                    })

                });
                ffmpeg_local_native2.stderr.on("exit",function(){
                   // console.log('child process exited');
                });
                ffmpeg_local_native2.stderr.on('close',function(){
                   // console.log('...closing times.! byes');
                });
            }
        })
    }

    let standbycnt=0;
    let standby = setInterval(function(){

        if(iscomplete == true){
           // console.log('VIDEO IMG EXTARCCT -> TO MERGED subpart video make ffmpeg 처리완료:',takeindex,data_gathering);
            clearInterval(standby);

            extract_file_callback(data_gathering,res,request_id,takeindex);
            return data_gathering;
        }

        if(standbycnt == 3000){
            clearInterval(standby);
        }

        standbycnt++;
    },150);
}
exports.singlemedia_split2 = async function(target_file,callback){
   // console.log('[[[[FFMPEG singlemeida split functisons2]]',target_file);

    let two_split_iscomplete={};
    fluent_ffmpeg.ffprobe(target_file,function(err,metadata){
        if(err){
            console.log('metadata not foundss:'+err);
        }else{
            //console.log('smsmsedata datass:',metadata,metadata.format);
            let duration=metadata.format.duration;
            duration=parseInt(duration);

            let rel_id=makeid(20);
            front_makefile=rel_id+'_front_slice';
            back_makefile=rel_id+'_back_slice';

            let ffmpeg_local= spawn("ffmpeg",['-ss','0','-t',`${duration / 2}`,'-i',target_file,`./tmp/${front_makefile}.mp4`]);
            let ffmpeg_local2 = spawn("ffmpeg",['-ss',`${duration / 2}`,'-i',target_file,`./tmp/${back_makefile}.mp4`]);

            ffmpeg_local.stderr.on('data',function(data){
                //console.log(data.toString());
            });
            ffmpeg_local.stderr.on('end',function(){
                //console.log('single file recived successfully procsss two split');
                two_split_iscomplete['front_cut']=true;
                two_split_iscomplete['front_cut_data']=`${front_makefile}.mp4`;
            })
            ffmpeg_local2.stderr.on('data',function(data){
                //console.log(data.toString());
            });
            ffmpeg_local2.stderr.on('end',function(){
                console.log('single file recived successfully procsss two split');
                two_split_iscomplete['back_cut']=true;
                two_split_iscomplete['back_cut_data']=`${back_makefile}.mp4`;
            });
        }
    });

    let standby_cnt=0;
    let standby = setInterval(function(){
        if(two_split_iscomplete['front_cut'] && two_split_iscomplete['back_cut']){
            //console.log('두부분으로 front,back모두 작업이 완료된 경우에 대기멈춘다, 관련 전달 실행>>',two_split_iscomplete);
            clearInterval(standby);
            
            //callback('./process/files/'+front_makefile+'.mp4','./process/files/'+back_makefile+'.mp4',res,transition_method?transition_method:null);    
            callback(two_split_iscomplete);//두부분으로 하여 쪼개졌을시에 대상 영상 하나에 대한 관련 정보 두부분쪼개진 정보.

        } 
        
        if(standby_cnt==3000){
            clearInterval(standby);
            return false;
        }
        standby_cnt++;
    },50);       
}
//한개의 미디어에 대해서(특정대상한개)에 대해서 두개로 분할한 결과를 콜백리턴합니다.
exports.singlemedia_split = async function(target_file,callback){
    //console.log('[[FFMPEG singlemedia_split functions ]]',target_file);

    let frontcut_framedata=[];
    let backcut_framedata=[];
    let two_split_iscomplete={

    };
    var front_makefile;
    var back_makefile;
    fluent_ffmpeg.ffprobe(target_file,function(err,metadata){
        if(err){
            console.log('metadata not foundsss..'+err);
        }else{
            //console.log('sssmeata datass:',metadata,metadata.format);
            let duration = metadata.format.duration;//대상 영상길이(초)
            duration = parseInt(duration);
            //console.log('관련 영상의 길이값!!:',duration);

            let rel_id=makeid(20);//한개 업로드 요청했었을당시의 클라이언트 requestid
            front_makefile=rel_id+'_front_slice';
            back_makefile=rel_id+'_back_slice';
            
            let created_images_half = 26 * (duration / 2);//해당 영상은 이미 이와 유사한 형태의 프레임이뤄져있다. 절반길이만큼의 프레임들만큼 생성된다.

            for(let j=0; j<created_images_half; j++){
                frontcut_framedata.push(`./tmp/${front_makefile}${j+1}.png`);
                backcut_framedata.push(`./tmp/${back_makefile}${j+1}.png`);
            }
            //let ffmpeg_local_=spawn('ffmpeg',['-i',`${s3_origin_dns}${encoding_filename}.mp4`,'-vcodec','copy','-t',parseInt(duration/2),'./process/files/'+front_makefile+'.mp4']);
            //let ffmpeg_local2 = spawn('ffmpeg',['-i',`${s3_origin_dns}${encoding_filename}.mp4`,'-vcodec','copy','-ss',parseInt(duration/2),'./process/files/'+back_makefile+'.mp4']);
            let ffmpeg_local= spawn("ffmpeg",['-ss','0','-t',`${duration / 2}`,'-i',target_file,'-r','26','-f','image2',`./tmp/${front_makefile}%d.png`]);
            let ffmpeg_local2 = spawn("ffmpeg",['-ss',`${duration / 2}`,'-i',target_file,'-r','26','-f','image2',`./tmp/${back_makefile}%d.png`]);

            ffmpeg_local.stderr.on('data',function(data){
                //console.log(data.toString());
            });
            ffmpeg_local.stderr.on('end',function(){
                //console.log('single file recived successfully procsss two split');
                two_split_iscomplete['front_cut']=true;
                two_split_iscomplete['front_cut_data'] = frontcut_framedata;
            })
            ffmpeg_local2.stderr.on('data',function(data){
                //console.log(data.toString());
            });
            ffmpeg_local2.stderr.on('end',function(){
               // console.log('single file recived successfully procsss two split');
                two_split_iscomplete['back_cut']=true;
                two_split_iscomplete['back_cut_data'] = backcut_framedata;
            });

            let standby_cnt=0;
            let standby = setInterval(function(){
                if(two_split_iscomplete['front_cut'] && two_split_iscomplete['back_cut']){
                   // console.log('두부분으로 front,back모두 작업이 완료된 경우에 대기멈춘다, 관련 전달 실행>>',two_split_iscomplete);
                    clearInterval(standby);
                    
                    //callback('./process/files/'+front_makefile+'.mp4','./process/files/'+back_makefile+'.mp4',res,transition_method?transition_method:null);    
                    //callback(two_split_iscomplete);//두부분으로 하여 쪼개졌을시에 대상 영상 하나에 대한 관련 정보 두부분쪼개진 정보.

                    let output_buffer_arrayfront=[];
                    let output_buffer_arrayback=[];//앞,뒤부분 관련 버퍼저장데이터
                    let is_complete_front=false;
                    let is_complete_back=false;

                    let output_buffer_datas=[];//front,back부분 출력 버퍼데이터 지정전달.

                    //front slice images to video pipe
                    let ffmpeg_local_ = spawn("ffmpeg",["-r",'26','-f','image2','-i',`./tmp/${front_makefile}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','-f','mp4','-movflags','frag_keyframe','pipe:1']);
                    ffmpeg_local_.stderr.on('data',function(data){
                       // console.log('ffmpeg porgress exuetcute swtatsts:',data.toString());
                    });
                    ffmpeg_local_.stdout.on('data',function(data){
                        output_buffer_arrayfront.push(data);
                    });
                    ffmpeg_local_.stderr.on('end',function(){
                       // console.log('split frames to merged completdss:',output_buffer_arrayfront);

                        is_complete_front=true;
                        let buffer_result = Buffer.concat(output_buffer_arrayfront);
                       // console.log('buffer reusltsss:',buffer_result);

                        output_buffer_datas.push(buffer_result);

                        //console.log('===>삭제할 frontcut데이터!:',two_split_iscomplete['front_cut_data']);
                    })
                    ffmpeg_local_.stderr.on('exit',function(){
                        //console.log('child process exited');
                    });
                    ffmpeg_local_.stderr.on('close',function(){
                        //console.log('...closing times byess:');
                    });


                    let ffmpeg_local_2 = spawn("ffmpeg",["-r",'26','-f','image2','-i',`./tmp/${back_makefile}%d.png`,'-vcodec','libx264','-crf','25','-pix_fmt','yuv420p','-f','mp4','-movflags','frag_keyframe','pipe:1']);
                    ffmpeg_local_2.stderr.on('data',function(data){
                        //console.log('ffmpeg porgress exuetcute swtatsts:',data.toString());
                    });
                    ffmpeg_local_2.stdout.on('data',function(data){
                        output_buffer_arrayback.push(data);
                    });
                    ffmpeg_local_2.stderr.on('end',function(){
                        console.log('split frames to merged completdss:',output_buffer_arrayback);

                        is_complete_back=true;
                        let buffer_result = Buffer.concat(output_buffer_arrayback);
                        //console.log('buffer reusltsss:',buffer_result);

                        output_buffer_datas.push(buffer_result);

                        //console.log('=====>삭제할 backcut데이터!!:',two_split_iscomplete['back_cut_data']);
                    })
                    ffmpeg_local_2.stderr.on('exit',function(){
                        //console.log('child process exited');
                    });
                    ffmpeg_local_2.stderr.on('close',function(){
                        //console.log('...closing times byess:');
                    })

                    let inner_standbycnt=0;
                    let inner_standby = setInterval(function(){
                        if(is_complete_front ==true && is_complete_back==true){
                            //console.log('===>내부 mediasplit splice관련 호출 종료:',is_complete_front,is_complete_back);
                            //console.log('====>>미디어를 쪼개어서 쪼갠 분할 프레임front,back부분프레임끼리 합쳐 만든 front,back video filess:',output_buffer_datas);

                            clearInterval(inner_standby);

                            callback(output_buffer_datas,two_split_iscomplete);
                        }

                        if(inner_standbycnt == 3000){
                            clearInterval(inner_standby);
                            return false;
                        }
                        inner_standbycnt++;
                    },150);
                } 
                
                if(standby_cnt==3000){
                    clearInterval(standby);
                    return false;
                }
                standby_cnt++;
            },50);       
          
        }
    });  
}*/