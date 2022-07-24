const express=require('express');
const fs=require('fs');
const fileUpload=require('express-fileupload');
const app=express();
const port=3001;

//const ffmpeg=require('./ffmpegControl');
const ffmpegNode=require('./ffmpegNodeModule');
const formidable = require('formidable');

app.use(express.json({
    limit : "50mb",
    parameterLimit : 100000,
    extended:false
}));
app.use(express.urlencoded({
    extended:false,
    limit:"50mb",
    parameterLimit : 100000
}));

app.use((req,res,next)=>{
    res.setHeader('Cross-Origin-Opener-Policy','same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy','require-corp');
    next();
});

//var publicpath=path.resolve(__dirname,'public');
//var useruploadpath=path.resolve(__dirname,'process/files/concat/');

app.use('/resource',express.static('resource'));
app.use('/public',express.static('public'));
app.use('/processfiles',express.static('process/files/concat'));
app.use('/tmp',express.static('tmp'));
app.use('/processbefore',express.static('process/files'));
app.use(fileUpload());

app.set('view engine','ejs');
app.set('views','views2');

app.get('/',(req,res)=>{
    res.render('index')
});
app.get('/openv_transition',(req,res)=>{
    res.render('opencv_study');
});
app.get('/opencvstudy',(req,res)=>{
    res.render('opencvstudy');
});
app.get('/opencvstudy2',(req,res)=>{
    res.render('opencvstudy2');
});
app.get('/videoEdit',(req,res)=>{
    res.render('videoEdit');
});
app.get('/videoTest',(req,res)=>{
    res.render('VideoTest');
});
app.listen(port, ()=>{
    console.log('server starttsss');
});

const dir=`./process/files/`;
//const musicdir=`D:/FFMPEG/program/service/process/musicupload/`;음원은 제공하는형태..

const tmpdir=`${dir}tmp/`;
const concatdir=`${dir}concat/`;

function extract_file_callback(data,res,upload_count,upload_list){
    console.log('resultss send results:',data,upload_list);
    //return res.send(data);
    return res.json({success:true, data: data, upload_count:upload_count, upload_list:upload_list});
}


app.post('/upload',(req,res,next)=>{
    let uploadfile=req.files.file;//다중 파일들..>> n개의 비디오파일들..>>
    console.log('upload post requestss:',uploadfile,uploadfile.length);

    let upload_files=[];let async_call_count=0;

    //let musicfile=req.files.music;
    //let musicfilename=makeid(20) + musicfile.name;

   /* musicfile.mv(`${musicdir}${musicfilename}`,function(err){
        console.log('음원파일 단일한개 업로드 처리>>');
        if(err){
            console.log('one errrosss:',err);
        }
    });*/
    for(var i=0; i<uploadfile.length; i++){
        console.log('올려진 개별파일별로 반복문 진행>>');
        //let savedPath=makeid(20);
        let filename=makeid(20)+ uploadfile[i]['name'];
        console.log('save file namess:',filename);

        upload_files.push(`${dir}${filename}`);
        uploadfile[i].mv(`${dir}${filename}`,function(err){
           console.log('바깥공간 uploadfiless참조::',async_call_count+1,upload_files,uploadfile.length);
            console.log('what errorrss:',err);
            if(err){
                console.log('one errsss:',err);
            }else{
                
                //if(!fs.existsSync(`${dir}${savedPath}`)) fs.mkdirSync(`${dir}${savedPath}`);
                if(!fs.existsSync(tmpdir)) fs.mkdirSync(tmpdir);
                if(!fs.existsSync(concatdir)) fs.mkdirSync(concatdir);
            }
            if(async_call_count+1==uploadfile.length){
                ffmpeg.mergedVideos(upload_files,res);
            }

            async_call_count++;
        })
    }

    console.log('target filesss:',upload_files);

    //ffmpeg.mergedVideos(upload_files);

    /*const filename=makeid(20) + req.files.file.name;
    uploadfile.mv(`${dir}${filename}`,function(err){
        console.log('what err:',err);
        if(err){
            return res.status(500).send(err);
        }else{
            let savedPath = makeid(20);

            if(!fs.existsSync(`${dir}${savedPath}`)) fs.mkdirSync(`${dir}${savedPath}`);
            if(!fs.existsSync(tmpdir)) fs.mkdirSync(tmpdir);
            if(!fs.existsSync(concatdir)) fs.mkdirSync(concatdir)

            ffmpeg.initVedioFile(`${dir}${filename}`,`${dir}${savedPath}`,(metadata,files,error)=>{
                metadata.savedPath=`files/${savedPath}`
                metadata.fileName=filename;
                res.json(metadata)
            })
            
        }
    })*/
});
app.post('/upload_ver',(req,res,next)=>{
    let req_body=req.body;
    let uploadfile=req.files;//다중 파일들..>> n개의 비디오파일들..>>
    console.log('upload post requestss:',req_body,uploadfile);
    let uploadfile_keys=Object.keys(uploadfile);//파일담은 업로드개체배열 객체를 keys들만해서 키값들만 저장한다.
    console.log('uploadilfe keysss:',uploadfile_keys);

    let upload_files=[];let async_call_count=0;
    let output_merged_transitions=[];//각 between전환별 트랜지션 합쳐진 영상output path들>>>
    let output_effect_videotakes=[];
    let output_file_count=0;
    //let musicfile=req.files.music;
    //let musicfilename=makeid(20) + musicfile.name;

   /* musicfile.mv(`${musicdir}${musicfilename}`,function(err){
        console.log('음원파일 단일한개 업로드 처리>>');
        if(err){
            console.log('one errrosss:',err);
        }
    });*/
    let async_call_count_=0; //비디오테이크분할이미지(원본+이펙트처리)관련 처리관련 변수

    let request_id = makeid(20);//요청자체의 id값>>>요청의id값 각 생성파일별makeid값은 아님.

    let between_count = req_body.upload_count-1;//테이크비디오들 숫자..
    let upload_list = req_body.upload_list;
    let videotake_partimg_totalcnt= req_body.videotake_partimg_totalcnt;
    let between_distinct_datas=[];//request_id에서 어떤 장면들이 나왔었는지 저장해두는..
    let valid_count=0;

    let take_video_datas=[];//request_id에서 어떤 테이크별 비디오분할이미지들이 업로드올라왔었는지...
    let valid_count_=0;//비디오태이크별 부분분할 장면이미지(프레임)들의 총 업로드수이다. 
    console.log('===>>videotake_partimg_totalcnt:',videotake_partimg_totalcnt);

    for(let outer=0; outer<between_count; outer++){
        let outer_index = outer+1;
        let between_distinct= `between${outer_index}`;
        for(let inner=1; inner<=26; inner++){

            let file_item=uploadfile[`between${outer_index}_${inner}`];

            let filename= request_id+'_' + (`between${outer_index}`) +'_'+ file_item['name'];//어떤 요청에서의 어떤장면(between)그룹상에 있는 해당 blend_transitionImg%d.png형태로 처리>>>

            //upload_files.push(`./process/files/${filename}`);
            uploadfile[`between${outer_index}_${inner}`].mv(`${dir}${filename}`,function(err){
                console.log('바깥공간 uploadfielss참조::',async_call_count+1,between_distinct,outer);
                console.log('what errosss:',err);
                if(err){
                    console.log('errowsss whatss:',err);
                }
                if(async_call_count+1 == 26){
                    console.log('async_count callcount60도달!!:',async_call_count+1,between_distinct,outer);
                    //열번을 다 돌아야비로서 한 장면에 해당하는(사이장면) 이미지들 모두 업로드된것!
                    valid_count++;
                    async_call_count=0;
                }else{
                    async_call_count++;
                }   
            });
        }
        between_distinct_datas.push(between_distinct);//between1,2,3,4....장면들을 넣는다.어떤 장면 그룹에 대해서(사이트랜지션)요청했었나

    }
    let upload_count=req_body.upload_count;//테이크자체의 수이다.테이크 비디오수.
    for(let outer=0; outer<upload_count; outer++){
        //외부 업로드 카운트 테이크의수이다. 각 테이크별로 넘어온 이미지 분할 데이터 전부(필터처리포함)된것을 테이크별로 받아서 합치기 필요함>>
        let outer_index= outer+1;
        let take_distinct=`takevideo${outer_index}`;

        let rel_match_keys=uploadfile_keys.filter(function(ele){
            if(ele.indexOf(take_distinct)!=-1){
                return ele;
            }
        });
        console.log("관련 매칭 rel_match_keytss:",rel_match_keys);//takevideo2_partimg_.....형태로 takevideo1,2,3,.....테이크별 비디오관련 name 객체키값들 넘어오는것들만 저장한다>>(업로드카운트 각 테이크별이다., 각테이크별 구분하기위해서 이 수치는 곧 각 테이크별 포함이미지수이기도하다.

        for(let inner=0; inner<rel_match_keys.length; inner++){
            let uploadfile_object_key=rel_match_keys[inner];

            let file_item=uploadfile[uploadfile_object_key];
            let filename=request_id+'_'+file_item['name'];//request_id _ 각 요청별 몇몇테이크별 테이크별 몇몇이미지업로드했었는지 관련하여

            uploadfile[uploadfile_object_key].mv(`${dir}${filename}`,function(err){
                console.log('바깥공간 uploadfiless참조::',async_call_count_+1,take_distinct,outer);
                console.log('what errosss:',err);
                if(err){
                    console.log("erross whatss:",err);
                }
                if(async_call_count_+1 == rel_match_keys.length){
                    //rel_matmch_keys 관련된 테이크별 업로드이미지들 테이크별 분할이미지 모두 올린것 개수만큼개수의 async_call_count를 모두 업로드한경우에 비로서 끝난다.
                    console.log('async_count_ callcount 테이크별 fullcount도달!!!:',async_call_count_+1,take_distinct,outer);
                    valid_count_++;
                    async_call_count_=0;
                }else{
                    async_call_count_++;
                }
            });
        }
        take_video_datas.push(take_distinct);//takevicdedo1,2,3,4,,...와 같이 테이크별 관련 데이터 넣는다.
    }
    /*for(let key in uploadfile){
        console.log('올려진 개별파일별로 반복문 진행>>');
        let file_item=uploadfile[key];

        let filename=makeid(20)+ file_item['name'];
        console.log('save file namess:',filename);

        upload_files.push(`./process/files/${filename}`);
        uploadfile[key].mv(`${dir}${filename}`,function(err){
           console.log('바깥공간 uploadfiless참조::',async_call_count+1,upload_files);
            console.log('what errorrss:',err);
            if(err){
                console.log('one errsss:',err);
            }else{
                
                //if(!fs.existsSync(`${dir}${savedPath}`)) fs.mkdirSync(`${dir}${savedPath}`);
                //if(!fs.existsSync(tmpdir)) fs.mkdirSync(tmpdir);
                //if(!fs.existsSync(concatdir)) fs.mkdirSync(concatdir);
            }
            if(async_call_count+1==Object.keys(uploadfile).length){
                console.log('target filesss hahahahah:::',upload_files);
                //ffmpeg.mergedVideos(upload_files,res);
                res.send(upload_files);
            }
github.com
            async_call_count++;
        })
    }

    console.log('target filesss:',upload_files);*/
    function inner_callback(result,res){
        console.log('내부 콜백실행>>outputfile path받기::',result);//처리된 파일자체의 경로를 전달주고 이들끼리합친다.

        output_merged_transitions.push(result);
    }

    function inner_callback2(result,res){
        console.log('내부 콜백실행>>outputfile path받기관련::',result);

        output_effect_videotakes.push(result);
    }

    let first_standby = setInterval(function(){
        if(valid_count == between_count && valid_count_ == videotake_partimg_totalcnt){
            console.log('최초 스탠바이 valid_count장면생성완료수!! + validcount(테이크별 이펙트처리포함 이미지업로드 대기여부)==>(필요이미지모두업로드대기완료)');
            clearInterval(first_standby);

            for(let s=0; s<between_distinct_datas.length; s++){
                ffmpegNode.between_transition_merged(request_id,between_distinct_datas[s],inner_callback,res);
            }//between1_request_id,추가적 관련 조합으로 업로드된 이미지들을 찾아서 그들끼리 병합하여 각 between이미지들만들어주는 결과물을 내부적 전달해줌.

            for(let h=0; h<take_video_datas.length; h++){
                ffmpegNode.videotake_effect_merged(request_id,take_video_datas[s],inner_callback2,res);
            }//takevideo1,2,3.,..... takevideo1_partimg_+propcess%d 관련 집합 이미지들 찾아서 그들끼리 병합하여 테이크별 처리된 영상 만들어주는 형태의 융통성 결과물api

            let second_standby = setInterval(function(){
                if(output_merged_transitions.length == between_count && output_effect_videotakes.length == upload_count){
                    //업로드수 4개라면 between merge transiton수 3개 만족 + output_effect_vidotakes 네개만족 모두 되어야한다.
                    console.log('inner stadnbby output request files completsss:',second_standby,output_merged_transitions, output_effect_videotakes);
                    clearInterval(second_standby);
                  
                    //ffmpegNode.originals_and_betweentransition_merged(request_id,upload_list,output_merged_transitions,opencv_transition_response,res);//비디오들끼리 병합한다>>>
                    ffmpegNode.originals_and_betweentransition_merged(request_id,output_effect_videotakes,output_merged_transitions,opencv_transition_response,res);
                }
            },20);
               
        }else{
            console.log('뭔가 문제가 있음 장면사이수랑,그만큼 돌린저장한 수가 다르다는것은 or 업로드테이크수와 완성된 이펙트적용된 테이크파일수 다름(아직대기)',between_distinct_datas,between_count,valid_count_, videotake_partimg_totalcnt,valid_count);
            console.log(valid_count,between_count);
            console.log(valid_count_,videotake_partimg_totalcnt);
        }  
    },20);
});

app.post('/upload_ver2',(req,res,next)=>{
    let uploadfile=req.files;
    console.log('upload filess reuqetsss:',uploadfile);

    let upload_files=[];let async_call_count=0;let upload_files_=[];
    let upload_count = Object.keys(uploadfile).length;//파일 업로드수가 1개인경우와 그렇지 않은경우로 나눈다.
    //한개가 아니라면 표준로직을 따르고 , 한개라면 먼저 분할후에 처리하는 형태로 좀 다르게
    for(let key in uploadfile){
        let file_item= uploadfile[key];

        let filename=makeid(20) + file_item['name'];
        console.log('save file namesss:',filename);

        upload_files.push(`processbefore/${filename}`);
        upload_files_.push(`${dir}${filename}`);
        uploadfile[key].mv(`${dir}${filename}`,function(err){
            console.log('바깥공간 uploadfiless참조::',async_call_count+1,upload_files);
            console.log('what errosss:',err);
            if(err){
                console.log('one errosss:',err);
            }else{

            }

            if(async_call_count+1 == Object.keys(uploadfile).length){
                if(upload_count == 1){
                    //업로드수가 한개였던경우에 대해서만 추가로 연산 전달
                    //두개이상였던 경우에는 그 리스트들을 그대로 전달하며, 한개였던 경우에는 그 한개를 서버에서 쪼갠후에 쪼갠 두파트를 전달하여 데이터전달.>>클라에서 처리버튼 실행시에 그 쪼개진것 두개를 보내는형태로>>> 
                    ffmpegNode.singlemedia_split(`${dir}${filename}`,res, twosplit_file_response);
                }else{
                    ffmpegNode.targetfiles_encoding(upload_files_,res, encodingfiles_response);

                    //return res.send(upload_files);//두개이상였던경우에는 그 결과들을 바로 전달>>
                }
                //console.log('target filess::',upload_files);
            }
            async_call_count++;
        });
    }
    //console.log('target filess:',upload_files);

});
function opencv_transition_response(outputfile,res){
    if(outputfile !=''){
        console.log('트랜지션 반영 병합 최종파일 response returnsss:',outputfile);

        return res.json({success:'success',video_result:`${outputfile}`});
    }else{
        return res.json({success:'fail'});
    }
}
function twosplit_file_response(front,back,res){
    console.log('twosplit process after callback:',front,back);

    let client_view=front.replace('./process/files/','processbefore/');
    let client_view2=back.replace('./process/files/','processbefore/');
    let upload_files=[client_view,client_view2];//각 front,back짤려진 대상 파일경로url path값이다>>
    console.log('upload filess whatsss hmm:',upload_files);

    return res.send(upload_files);

}
function encodingfiles_response(filelist,res){
    console.log('filelistss:',filelist);
    let adapt_client_list = [];
    for(let j=0; j<filelist.length; j++){
        let fileitem=filelist[j];
        fileitem = fileitem.replace('./process/files/','processbefore/');//인코딩된 각 결과값을 전달할수있게끔..
        adapt_client_list.push(fileitem);//processbefore/assssss,...이런식으로 저장하여 
    }
    console.log('adapt_client listss:',adapt_client_list);

    return res.send(adapt_client_list);
}
app.post('/testsss',async(req,res,next)=>{
    console.log('testsss apisss:',req.body);

    let upload_list=req.body.upload_list_data;
    upload_list = upload_list.split(',');
    let adapt_upload_list=[];
    for(let s=0; s<upload_list.length; s++){
        let item=upload_list[s];
        let item_folderpath=item.split('/')[0];
        let item_purefilename_target= item.split('/')[1];
        item_folderpath=item_folderpath.replace('processbefore','./process/files');
        let make_conversion_name = item_folderpath +'/'+item_purefilename_target;
        adapt_upload_list.push(make_conversion_name);
    }
    console.log('adapt upload listsss:',adapt_upload_list);
    let result = await ffmpegNode.video_img_extract(adapt_upload_list,extract_file_callback,res);
});
app.post('/video_move_and_splice_process',async(req,res,next)=>{
    console.log('video move and splice porcsss:',req.body);

    //let data=JSON.parse(req.body);
    //console.log('data',data);

    let upload_list=req.body.upload_list_data;
    let edit_process_info = req.body.edit_process_info;
    edit_process_info= JSON.parse(edit_process_info);//배열로 나오게된다.>>

    upload_list = upload_list.split(',');
    let adapt_upload_list=[];
    for(let s=0; s<upload_list.length; s++){
        let item=upload_list[s];
        let item_folderpath = item.split('/')[0];
        let item_purefilename_target=item.split('/')[1];
        item_folderpath = item_folderpath.replace('processbefore','./process/files');
        let make_conversion_name = item_folderpath +'/'+item_purefilename_target;
        adapt_upload_list.push(make_conversion_name);
    }
    console.log('adapt upload listsss:',adapt_upload_list);
    ffmpegNode.video_subpart_slice_normal(adapt_upload_list,edit_process_info,video_subpart_slice_result_callback,res);
});
function video_subpart_slice_result_callback(data,res){
    console.log('resultss send results:',data);
    //return res.send(data);
    return res.json({success:true, process_data: data});
}
//transition effected uploadss
app.post('/upload_transition',async(req,res,next)=>{
    let uploadfile=req.files.file;//다중 파일들..>> n개의 비디오파일들..>>
    console.log('upload post requestss: and req_body',uploadfile,uploadfile.length,req.body);

    let upload_files=[];let async_call_count=0;
    let transition_method=req.body.transition_method;
    //let musicfile=req.files.music;
    //let musicfilename=makeid(20) + musicfile.name;

   /* musicfile.mv(`${musicdir}${musicfilename}`,function(err){
        console.log('음원파일 단일한개 업로드 처리>>');
        if(err){
            console.log('one errrosss:',err);
        }
    });*/

    if(uploadfile.length>=2){
        for(var i=0; i<uploadfile.length; i++){
            console.log('올려진 개별파일별로 반복문 진행>>');
            //let savedPath=makeid(20);
            let filename=makeid(20)+ uploadfile[i]['name'];
            console.log('save file namess:',filename);
    
            upload_files.push(`./process/files/${filename}`);
            uploadfile[i].mv(`./process/files/${filename}`,function(err){
               console.log('바깥공간 uploadfiless참조::',async_call_count+1,upload_files,uploadfile.length);
                console.log('what errorrss:',err);
                if(err){
                    console.log('one errsss:',err);
                }else{
                    
                    //if(!fs.existsSync(`${dir}${savedPath}`)) fs.mkdirSync(`${dir}${savedPath}`);
                    //if(!fs.existsSync(tmpdir)) fs.mkdirSync(tmpdir);
                    //if(!fs.existsSync(concatdir)) fs.mkdirSync(concatdir);
                }
                if(async_call_count+1==uploadfile.length){
                    if(transition_method==0){
                        ffmpeg.transition_merged(upload_files,res,filefind_callback);//0->>전달 내부적 받아서 처리>>
                    }else{
                        ffmpegNode.transition_merged2(upload_files,res,filefind_callback);
                    }                    
                }   
                async_call_count++;
            })
        }
    }else{
        //업로드파일 한개인 경우에..파일을 찢어서 전달한다. 가운데 부분으로 쪼개서.
        console.log('업로드 파일이 한개였던 경우:',uploadfile);
        
        let filename= makeid(20)+uploadfile.name;
        console.log('save file namess:',filename);

        uploadfile.mv(`./process/files/${filename}`,async function(err){
            if(err){

            }
            await ffmpegNode.singlemedia_split(`./process/files/${filename}`,res,twosplit_file_transfer, transition_method);
           // console.log('업로드 파일 한개였을떄 쪼갠 결과 및 전달받은값::',result);
        })
       
    }
   
    console.log('target filesss:',upload_files);
});
function twosplit_file_transfer(front,back,res,transition_method){
    if(transition_method==1){
        ffmpegNode.transition_merged2([front,back],res,filefind_callback);
    }else{
        ffmpegNode.transition_merged([front,back],res,filefind_callback);
    }
    
}
function filefind_callback(make_concatfilename,output_identityid,res){
    console.log('콜백함수 실행체 실행>>>',make_concatfilename);
    
    var targetfile_find = function(){
        console.log('===>>targetfile finedss executesss=============',interval_id);

        //200번 함수호출이하인경우. execute permission
        if(secure_cnt <=200){
            fs.exists(make_concatfilename,function(exists){
        
                if(exists){
                    console.log('flies existss:',exists);
                    //파일은 있었으나 파일이 유효한 상태(보여주기에) 인 경우엔 반복흐름 멈춘다. 유효하지않은상태라면 return하진 않고 유효한상태가 될떄까지(200초or카운트)기다린다await
                    fs.stat(make_concatfilename, (err,status)=>{
                        if(err){
                            console.log("file doesnt't existsss");
                            return;
                        }
                        console.log(status);
                        if(status.size > 10 ){//100 일초마다 카운트 증가하기에 100이 된 시점은 1분40초 지난시점일것임.그때까지도 반복중이라면 그냥 관련 반복호출실행 멈춘다.
                            //관련 대상 파일 찾기 성공 or 100초경과했는데도 못찾았다면 오류로 가정하고 프로그램 실행종료
                            console.log('===>>finds target files ineterval stop!',interval_id);
                            clearInterval(interval_id);//반복을 멈추고 파일을 찾았다는것 자체가 완료라는 추상적 의미. 완료로 가정

                            return res.json({success:'success',video_result:`${output_identityid}.mp4`});
                        }
                    });
                }else{
                    //파일자체를 몾찾은경우 그 상황때 바로 결과 리턴하기보다 찾을때까지or유효한상태 찾을때까지 await한다.
                    console.log('flies not eixstss:',exists);
                }      
            });
        }else{
            //200초경과(200번호출)되었는데도 파일에 대해서 몾찾은경우
            console.log('200초 경과했는데도 파일에 대해서 몾찾거나 만족 대상파일 유효하지 않은경우!:',interval);
            clearInterval(interval_id);

            return res.json({success:'fail'});
        }
        
        secure_cnt++;
    }

    var secure_cnt=0;
    var interval_id = setInterval(targetfile_find,1000);//일초에한번씩 되는데 참조가 되나?
}

app.post('/reFile',(req,res,next)=>{
    let param={};
    if(req.body.list){
        param.list = JSON.parse(req.body.list);
        param.filename= `${dir}${req.body.fileName}`;
        param.savedPath=req.body.savedPath;
        console.log(param)
    }
    ffmpeg.buildVedioFile(param.list,param.filename,tmpdir,concatdir,resultFilepath=>{
        let result=resultFilepath.replace(concatdir, 'files/concat/')
        res.send(result);
    })
})

function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}