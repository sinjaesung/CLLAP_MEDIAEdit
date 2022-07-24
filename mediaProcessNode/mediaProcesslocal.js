///===============================nodejs commonsss 공통변수, 함수 ============================
const commonvar=require('./config/commonVar.js');
const s3=require('./config/s3.config.js');

const s3_origin_dns= `https://clllap.s3.ap-northeast-2.amazonaws.com/`;
//const dir=`./process/files/`;
const dir_tmp=`./tmp/`;
const dir=`${s3_origin_dns}clllap/`;//clllap폴더.
//const musicdir=`D:/FFMPEG/program/service/process/musicupload/`;음원은 제공하는형태..

const tmpdir=`${s3_origin_dns}tmp/`;

function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//==============================================nodejs api basic settingss
const app = require('express')();
const express = require('express');
const https = require('https');
const path = require("path");

const port=8080;

const cors=require('cors');
app.use(cors());

const fs=require('fs');
const fileUpload=require('express-fileupload');

const options = {
    key: fs.readFileSync(__dirname + '/keystore1/www.teamspark.kr_20211201E889F.key.pem'),
    cert: fs.readFileSync(__dirname + '/keystore1/www.teamspark.kr_20211201E889F.crt.pem'),
    ca: fs.readFileSync(__dirname + '/keystore1/www.teamspark.kr_20211201E889F.ca-bundle.pem')
};

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
app.use(fileUpload());

//============OPENCV IN NODEJS INITALIZE =====================================================>>>>
const util = require('util');
const TextEncoder = new util.TextEncoder();

const {Canvas,createCanvas,Image,ImageData,loadImage } =require('canvas');
const {JSDOM} = require('jsdom');

const opencvfunctions1 = require('./OpencvFunctions/opencvfunction1');

//============ffmpeg in nodejs intiatlize includes====================================================
const ffmpegNode=require('./ffmpegNodeModule_server');

const ffmpeg=require('ffmpeg');
const fluent_ffmpeg=require('fluent-ffmpeg');

//=================test executess...
console.log('===>opencvfunctions1 load:',opencvfunctions1);
console.log('=====>opencv.js is can used?!:',cv);
console.log('===>tdgdg:', opencvfunctions1['transition_cut']);

//console.log('===>testssss:',opencvfunctions1['transition_cut']);
//let test=commonvar.OPENCVTRANSITION['108_opencv'];
//console.log('coomonvar:',typeof commonvar.OPENCVTRANSITION['108_opencv'],opencvfunctions1[`${test}`]);

/*app.use((req,res,next)=>{
    //res.setHeader('Cross-Origin-Opener-Policy','same-origin');
    //res.setHeader('Cross-Origin-Embedder-Policy','require-corp');
    //res.setHeader('Access-Control-Allow-Origin','*');

   // res.setHeader('Access-Control-Allow-Origin', '*');
  //res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //res.setHeader('Cross-origin-Embedder-Policy', 'require-corp');
 // res.setHeader('Cross-origin-Opener-Policy','localhost');

    next();
});*/

//============================>>express app api resources ejs utilss and resourcess EJS TEST
app.use('/resource',express.static('resource'));
app.use('/resource_fireworks',express.static('resource/fireworks'));
app.use('/resource_lensflare',express.static('resource/Lensflare'));
app.use('/resource_particles',express.static('resource/Particles'));
app.use('/resource_Rain',express.static('resource/Rain'));
app.use('/resource_Smoke',express.static('resource/Smoke'));

app.use('/public',express.static('public'));
app.use('/processfiles',express.static('process/files/concat'));
app.use('/tmp',express.static('tmp'));

app.set('view engine','ejs');
app.set('views','views2');

//=======================================nodejs api list (TEST APIS )
app.get('/',(req,res)=>{
    console.log('get / api request');
    res.render('index');//ejs index render TEST용
});
app.get('/openv_transition',(req,res)=>{
    res.render('opencv_study'); // opencv_transiton ejs render TEST용
});
//EJS CLIENNT VIDEOeDIT TEST EJS
app.get('/videoEdit_new',(req,res)=>{
    res.render('videoEdit_new');
});
//OPENCV CLIENT EJS TEST
app.get('/videoTest',(req,res)=>{
    res.render('VideoTest');
});
app.get('/videoEdit',(req,res)=>{
    res.render('videoEdit_');
});
//FFMPEG CLIETN EJS TESTS....
app.get('/ffmpegwasm_videotoImage',(req,res)=>{
    res.render('ffmpegwasm_videotoImage');
});
app.get('/ffmpegasm_test',(req,res)=>{
    res.render('ffmpegasm_videoCrop');
});
app.get('/ffmpegasm_transitionTest',(req,res)=>{
    res.render('ffmpegasm_transitionTest');
});
//RTC MEDIA CAPTURE TEST... EJS
app.get('/mediacapture',(req,res)=>{
    res.render('mediaCapture');
});

//================================express app start!!========================================
/*app.listen(port, ()=>{
    console.log('[[[==================================MEDIAPROCESS SERVER STARTSS================================]]]]',port);
});*/

const server = https.createServer(options, app).listen(port);
//=======================================================



//=======================EXPRESS NODEJS SERVER API LIST USESSS========================================>>
//사용자 비디오 업로드>>(라이브러리 업로드한영상:길이는 다양함,영상길이가 40~50초보다도 길시에 인코딩에 오래걸리기에 어느정도 제한을둔다.)
//USE API 1 : 비디오 업로드, 인코딩 API / 콜백함수 한개 존재
app.post('/api/videotake_uploads_and_encoding',(req,res,next)=>{
    let uploadfile=req.files;
    console.log('============================videotake_uploads_and_encoding API REQUEST START',uploadfile);

    let upload_files=[];let async_call_count=0;let upload_files_=[];
    let upload_count = Object.keys(uploadfile).length;//파일 업로드수가 1개인경우와 그렇지 않은경우로 나눈다.
    //한개가 아니라면 표준로직을 따르고 , 한개라면 먼저 분할후에 처리하는 형태로 좀 다르게
    let s3_parameters=s3.uploadParams;
    let s3_client=s3.s3client;

    for(let key in uploadfile){
        let file_item= uploadfile[key];

        let filename=makeid(20) + file_item['name'];
        console.log('save file namesss:',filename);

        upload_files.push(`${dir}originalvideo${filename}`);
        upload_files_.push(`${dir}originalvideo${filename}`);
      
        s3_parameters.Key = `clllap/originalvideo${filename}`;//업로드할 파일 구조 폴더명
        s3_parameters.Body = file_item['data'];//buffered datas..

        console.log('s3 parameters refer space:',s3_parameters);

        s3_client.upload(s3_parameters, async (err,data)=>{
            if(err){
                console.log('what errosss:',err);
                return false;
            }
            //업로드가 성공한 경우에만 도달>>경우에만 관련하여 카운팅처리 s3에 요청비디오 하나씩 올라가는구조로 변경
            console.log('s3 전달 파일여부 성공여부',data);

            if(async_call_count+1 == Object.keys(uploadfile).length){
                if(upload_count == 1){
                    //ffmpegNode.singlemedia(`${dir}${filename}`,res,twosplit_file_response);
                    ffmpegNode.targetfiles_encoding(upload_files_,res,encodingfiles_response);
                }else{
                    ffmpegNode.targetfiles_encoding(upload_files_,res,encodingfiles_response);
                }

                let result = await standby_promise(); //업로드리스트-->>인코딩 n개리스트 반환때까지 기다린다.
                console.log('promise process resultsss:',result);

                return res.json(result);
            }
            async_call_count++;
        });
    }
    console.log('============================videotake_uploads_and_encoding API REQUEST lineEND',uploadfile);

    let s3_upload_success_count=0;//4개 올렸었다고하면 원본네개를 각각 인코딩 성공처리된 출력결과 버퍼,스트림데이터를 가져와서 돌리면서 그 데이터를 각 비동기방식 업로드모두 처리완료후에 버퍼를 s3로 파일로써 업로드 모두 성공했다고하면 성공할시마다 관련 카운트 증가.
    //rest api 비디어업로드&인코딩 api콜백함수 최종 업로드된,인코딩처리된 리스트(원본리스트+인코딩리스트) 리턴합니다.(to client or another request server)
    //인코딩업로드를 n개 한 경우이다. 표준적 경우이다.
    let upload_originalEncodedlist = [];//유저가 촬영or 업로드한 원본에 대해서 인코딩처리한 리스트입니다.

    function encodingfiles_response(upload_files,filelist,plan_output_encoding_files_bufferData,plan_output_encoding_path_local,res){
        console.log('=====>>ENCODINGFILES RESPONSE callback function ===========================>');

        console.log('encodingfiles_response parameters',upload_files,filelist,plan_output_encoding_files_bufferData,plan_output_encoding_path_local);
        console.log('encodingfiles_response parameters',plan_output_encoding_files_bufferData);

        let bucket_params={
            Bucket:'clllap',
            Key:'clllap/',
            Body:null,
            ACL:'public-read'
        }
        let s3_client=s3.s3client;

        for(let j=0; j<filelist.length; j++){
            let fileitem=filelist[j];//s3경로를 참조하는 형태로써.
            //fileitem = fileitem.replace('./process/files/','processbefore/');//aws s3 dns url/clllap/ 대상들
            upload_originalEncodedlist.push(fileitem);//processbefore/assssss,...이런식으로 저장하여 
        }

        for(let p=0; p<plan_output_encoding_files_bufferData.length; p++){
            bucket_params.Key= plan_output_encoding_path_local[p];//cllap/uplaod할 파일명 형태의 path로 key형태로 아직 업로드전임 스트림데이터를pipe데이터를 업로드처리하는
            bucket_params.Body = plan_output_encoding_files_bufferData[p][0];//이건 버퍼개체를 지정한다.
            //bucket_params.Body = plan_output_encoding_files_bufferData[p][1];//이건 스트림객체

            //let s3res=await s3client.upload(bucket_params).promise();//스트림저장객체 -->>>버킷 s3업로드 처리한다.>>>해당 조건으로 해서 업로드처리된다. 스트림데이터 업로드 url string format
            //console.log('s3 upload resultsss:',s3res);
            console.log('업로드 옵션 상태값:',bucket_params);
            s3_client.upload(bucket_params,(err,data)=>{
                if(err){
                    console.log('what errossss:',err);
                    return false;
                }
                console.log('파일업로드 성공여부!!!:',data);

                s3_upload_success_count++;//버퍼데이터 -> s3 파일로써 업로드 성공한 카운트 비동기형태로 카운팅합니다.
            });
        } 
    }

    let standby_promise = function(){
        return new Promise((resolve,reject)=>{
            console.log('====>promise대기함수;:::::]]]');

            //대기합니다. 
            let standby_cnt=0;
            let standby = setInterval(function(){
                if(upload_count == s3_upload_success_count ){
                    //업로드카운트수와 각 파일별 인코딩완료했다는 내역별 남긴것의 카운트여부 같으면 모두 인코딩완료됐다는것임>>버퍼데이터를 바로 s3로 전송,ec2에는 쌓이면 안됌!
                    console.log('업로드한 리스트들에 대해서 모두 인코딩버퍼데이터 -> s3 업로드 완료된 시점에 실행>>');
                    clearInterval(standby);
                                
                    console.log('upload_originalEncodedlist listss:',upload_originalEncodedlist);

                    //return res.json({success:true,upload_originalEncodedlist:upload_originalEncodedlist,upload_originallist:upload_files});
                    //n개의 원본영상, n개의 원본인코딩리스트가 java rest api에 리턴되며, 어떤 요청세션or memid유저에서 요청한건지 관련 디비insert내역 남긴다.
                    resolve({success:true,upload_originalEncodedlist_string:upload_originalEncodedlist.join(','),upload_originalEncodedlist:upload_originalEncodedlist,upload_originallist:upload_files});
                }

                if(standby_cnt==3000){
                    clearInterval(standby);
                   // return res.status(403).json({success:false,message:'timeout errorss'});
                   reject(new Error("standby timeout error"));
                }
                ++standby_cnt;
            },200); 
        });
    }    
});

//한개의 미디어를 두부분으로 쪼개는 함수>> 두개의 미디어로 쪼갠 그것들을 넘깁니다. (원테이크케이스인경우에 사용)
function single_uploadvideo_twosplit_process(remote_target_url){

    return new Promise((resolve, reject)=>{
        console.log('미디어 분할 관련 프로미스 호출>>>');
        let remote_src= remote_target_url;//해당 대상 url s3상에 있던것을 분할해야한다.

        //ffmpegNode.singlemedia_split(remote_src, depency_callback);//대상 원본영상 한개를 두부분으로 완벽히 쪼갠다. 프레임정지되지 않게끔 쪼개야한다.
        ffmpegNode.singlemedia_split2(remote_src, depency_callback);//대상 원본영상 한개를 두부분으로 완벽히 쪼갠다. 프레임정지되지 않게끔 쪼개야한다.

        function depency_callback(two_split_iscomplete){
            console.log('내부 의존성 콜백함수:',two_split_iscomplete);

            let frontslicevideo=two_split_iscomplete['front_cut_data'];
            let backslicevideo=two_split_iscomplete['back_cut_data'];

            //두 분할된 프레임이어붙인 버퍼video only 데이터 업로드처리.

            let s3_client=s3.s3client;
            let bucket_params={
                Bucket:'clllap',
                Key:'clllap/',
                Body:null,
                ACL:'public-read'
            }

            bucket_params['Key']= `clllap/${frontslicevideo}`;//encoding$_id_
            bucket_params['Body']= fs.createReadStream(`./tmp/${frontslicevideo}`);//front buffer datas이다.

            //이 시점엔 분할 프레임파일들 다 쓰여진것임.
            s3_client.upload(bucket_params,(err,data)=>{
                if(err){
                    console.log('what erross:',err);
                    return false;
                }
                console.log('대상체 frontslice파일 업로드 성공:',data);

                singleupload_twosplit_iscomplete[0]={
                    'output_plan_s3path' : `${s3_origin_dns}clllap/${frontslicevideo}`,
                    'frontslicecomplete' : true
                };
            });

            let bucket_params2={
                Bucket:'clllap',
                Key:'clllap/',
                Body:null,
                ACL:'public-read'
            }
            bucket_params2['Key'] = `clllap/${backslicevideo}`;//encoding$_id_
            bucket_params2['Body'] = fs.createReadStream(`./tmp/${backslicevideo}`);//back buffer datas뒷 부분 잘린 버퍼데이터.

            s3_client.upload(bucket_params2,(err,data)=>{
                if(err){
                    console.log('what erorrss:',err);
                    return false;
                }
                console.log('대상체 backslice파일 업로드 성공:',data);

                singleupload_twosplit_iscomplete[1]={
                    'output_plan_s3path' : `${s3_origin_dns}clllap/${backslicevideo}`,
                    'backslicecomplete' : true
                };
            });
        }

        let singleupload_twosplit_iscomplete=[];//임의의 한개의 미디어에 대해서 분할처리하는것 성공하는지 관련여부. 분할처리된것들에 대해서 meregde한 출력 분할 비디오파일업로드완료
        let upload_originalEncodedlist=[];

        let standbycnt=0;
        let standbys=setInterval(function(){

            if(singleupload_twosplit_iscomplete[0] && singleupload_twosplit_iscomplete[1]){
                if(singleupload_twosplit_iscomplete[0]['frontslicecomplete']==true && singleupload_twosplit_iscomplete[1]['backslicecomplete']==true){
                    //console.log('====>standbysss singlemeida to split ttwo videos standby outpuyts:',singleupload_twosplit_iscomplete);
                    console.log('====>====>standbysss singlemeida to split ttwo videos standby outpuyts: complettesss :]]',singleupload_twosplit_iscomplete);

                    clearInterval(standbys);

                    //api final returns;;

                    upload_originalEncodedlist.push(singleupload_twosplit_iscomplete[0]['output_plan_s3path']);
                    upload_originalEncodedlist.push(singleupload_twosplit_iscomplete[1]['output_plan_s3path']);//singleupload two split video files

                    console.log('=======================미디어 분할 관련 프로미스 호출>>> FINAL RETURNS=======>>,',upload_originalEncodedlist);

                    //upload_originalEncodedlist(n개의 임의요청에 대한 원본인코딩파일리스트(s3 string path배열) two split list or normal list, upload_originalENCODEDLIST_REFER;(원본인코딩영상데이터), upload_originallist:인코딩x원본영상업로드리스트.

                    //return upload_originalEncodedlist;
                    resolve(upload_originalEncodedlist);

                }                      
            }

            if(standbycnt==3000){
                clearInterval(inner_standbys);

                reject(new Error('timeout error'));
            }
            standbycnt++;
        },150);  
    })  
}
//미리보기페이지에서 유저가 테이크편집한데로 나오게 하는 api
app.post('/api/videotakeEditsplit',async(req,res)=>{
    console.log('=-========>>api video split simpelsss exeuctuess:==================');

    console.log('reqbodyss:',req.body,req.body.upload_list_data,req.body.take_video_process_info);

    let upload_list = req.body.upload_list_data.split(',');
    let take_video_process_info=  req.body.take_video_process_info;
    if(take_video_process_info && take_video_process_info!='undefined'){
        take_video_process_info = JSON.parse(take_video_process_info);
    }

    let request_id= makeid(20);//요청id값>>여기서부터가 요청시작으로 origin시작>>
    console.log('upload_list:',upload_list);

    if(upload_list.length >=1){
        if(upload_list.length==1){
            take_video_process_info=[];//넘어오는게 아마 없기에 
            console.log('업로드 리스트가 한개 였던경우!:',upload_list);
            upload_list=await single_uploadvideo_twosplit_process(upload_list[0]);//해당 한개의 원본 미디어를 반으로 쪼갠 두개의 s3 url list를 넘기고 그걸 그것들을 업로드 원본 타깃 origin시작으로써 취급한다.
            console.log('업로드 자원 한개였던 경우 두개로 쪼갠 형태로써의 시작한다::',upload_list);

            let result=await ffmpegNode.mergedVideos(upload_list);

            console.log('병합 영상 처리결과:',result);
            if(result){
                let s3_client=s3.s3client;
                let bucket_params={
                    Bucket:'clllap',
                    Key:'clllap/',
                    Body:null,
                    ACL:'public-read'
                }
               
                bucket_params['Key']= `clllap/${result}`;//encoding$_id_
                bucket_params['Body']= fs.createReadStream(`./tmp/${result}`);//front buffer datas이다.

                //이 시점엔 분할 프레임파일들 다 쓰여진것임.
                s3_client.upload(bucket_params,(err,data)=>{
                    if(err){
                        console.log('what erross:',err);
                        return res.status(403).json({success:false,message:'server error'});
                    }
                    console.log('대상체 파일 업로드 성공:',data);

                    return res.json({success:true, data:`${s3_origin_dns}clllap/${result}`,edittake_video_list:upload_list});

                });
                if(fs.existsSync(`./tmp/${result}`)){
                    // fs.unlinkSync(`./tmp/${result}`);
                }
                                    
            }else{
                return res.status(403).json({success:false,message:'server error'});
            }
        }else{
            let data_gathering_store=[];

            function extract_file_callback(data_gathering,request_id,takeindex){
                console.log('extract file callback함수호출]]]]]]]');

                 console.log('=======>>transfer parsmteers data_gathering,requestid,:',data_gathering,request_id,takeindex);

                 let store={};
                 store['takeindex'] = takeindex;
                 store['data_gathering'] = data_gathering;

                 data_gathering_store.push(store);
            }
            function promise_function_standby(){
                console.log('promise_function_standby promise함수 호출>>>>>>');

                return new Promise((resolve,reject)=>{
                    let callback_timeout=0;
                    let callback_standby= setInterval(function(){
                        if(data_gathering_store.length == upload_list.length){
                            clearInterval(callback_standby);

                            resolve(data_gathering_store);
                        }
                        if(callback_timeout==1000){
                            clearInterval(callback_standby);
                            reject(new Error("callback timeout error"));
                        }
                        callback_timeout++;
                    },120)
                })
            }
            for(let s=0; s<upload_list.length; s++){
                let upload_target=upload_list[s];
                let result=ffmpegNode.video_subpart_slice_normal2(s+1,upload_target,extract_file_callback,request_id,take_video_process_info[s]);
            }
            let data_gathering=await promise_function_standby();
            data_gathering.sort(function(a,b){
                return a.takeindex - b.takeindex;
            })
            console.log('retunr out set reutn :',data_gathering);

            let videotakelist=[];
            for(let j=0; j<data_gathering.length; j++){
                videotakelist.push('./tmp/'+data_gathering[j]['data_gathering'][`${j+1}_data`]);
            }
            let result=await ffmpegNode.mergedVideos(videotakelist);

            console.log('병합 영상 처리결과:',result);
    
            if(result){
                let s3_client=s3.s3client;
                let bucket_params={
                    Bucket:'clllap',
                    Key:'clllap/',
                    Body:null,
                    ACL:'public-read'
                }
                let s3upload_async_cnt=0;
                let s3upload_planlist=[];
                function s3upload_standby(){
                    return new Promise((resolve,reject)=>{
                        let callback_timeout=0;
                        let callback_standby=setInterval(function(){
                            if(s3upload_async_cnt == upload_list.length){
                                clearInterval(callback_timeout);

                                resolve(true)
                            }
                            if(callback_timeout==1000){
                                clearInterval(callback_standby);
                                reject(new Error('callback timeout error'));
                            }
                            callback_timeout++;
                        },120);
                    });
                }
                for(let s=0; s<data_gathering.length; s++){
                    let target=data_gathering[s]['data_gathering'][`${s+1}_data`];

                    bucket_params['Key']= `clllap/${target}`;//encoding$_id_
                    bucket_params['Body']= fs.createReadStream(`./tmp/${target}`);//front buffer datas이다.
        
                    s3upload_planlist.push(`${s3_origin_dns}clllap/${target}`);
                    //이 시점엔 분할 프레임파일들 다 쓰여진것임.
                    s3_client.upload(bucket_params,(err,data)=>{
                        if(err){
                            console.log('what erross:',err);
                        }
                        console.log('대상체 파일 업로드 성공:',data);
                        
                        s3upload_async_cnt++;
                    });
                    if(fs.existsSync(`./tmp/${target}`)){
                        //fs.unlinkSync(`./tmp/${target}`);
                    }
                }
                let upload_standby=await s3upload_standby();
                console.log('upload_stnadby업로드 대기완료:',upload_standby,s3upload_planlist); 
                if(upload_standby){
                    bucket_params['Key']= `clllap/${result}`;//encoding$_id_
                    bucket_params['Body']= fs.createReadStream(`./tmp/${result}`);//front buffer datas이다.

                    //이 시점엔 분할 프레임파일들 다 쓰여진것임.
                    s3_client.upload(bucket_params,(err,data)=>{
                        if(err){
                            console.log('what erross:',err);
                            return res.status(403).json({success:false,message:'server error'});
                        }
                        console.log('대상체 파일 업로드 성공:',data);

                        return res.json({success:true, data:`${s3_origin_dns}clllap/${result}`,edittake_video_list:s3upload_planlist});

                    });
                    if(fs.existsSync(`./tmp/${result}`)){
                       // fs.unlinkSync(`./tmp/${result}`);
                    }
                }    
            }
        }
    }
})
//===================USE API3 TRANSITIOON_AND effeect_process 처리함수 api========================================================<<영상처리,비디오제작,자동편집>>
//임의 업로드 비디오들에 대해서 편집하여 자른 각 테이크별 비디오로 병합을 하고 그들끼리 트랜지션이랑 해서 합친영상을 만들고(video파일만) ffmpeg트랜지션
//거기에 opencv이펙트 적용을 추후에 하는 형태로 순서변경
app.post('/api/transition_and_effect_process_ver2',async(req,res)=>{
    console.log('=======================>transition and effect process requetsss START===============');//데이터를 넘겨옵니다.

    console.log('req.bodyss:',req.body.edittake_video_list);

    //let select_overlay= req.body.select_overlay;
    //let select_filter =req.body.select_filter;
    let music = req.body.music; 
    //let upload_list = req.body.upload_list_data.split(',');
    //let take_video_process_info=  req.body.take_video_process_info;
    /*if(take_video_process_info && take_video_process_info!='undefined'){
        take_video_process_info = JSON.parse(take_video_process_info);
    }*/
    let transition_type=req.body.transition_type;//ffmpeg,opencv(music에 따라 결정)

    let request_id= makeid(20);//요청id값>>여기서부터가 요청시작으로 origin시작>>

    let transition_result_data;
    if(upload_list.length >=1){
        if(upload_list.length==1){
            take_video_process_info=[];//넘어오는게 아마 없기에 
            console.log('업로드 리스트가 한개 였던경우!:',upload_list);
            upload_list=await single_uploadvideo_twosplit_process(upload_list[0]);//해당 한개의 원본 미디어를 반으로 쪼갠 두개의 s3 url list를 넘기고 그걸 그것들을 업로드 원본 타깃 origin시작으로써 취급한다.
            console.log('업로드 자원 한개였던 경우 두개로 쪼갠 형태로써의 시작한다::',upload_list);

            let await_async_function = function(){
                let first_complete=false;
                let two_complete=false;
                return new Promise((resolve,reject)=>{
                    //first split video info get
                    fluent_ffmpeg.ffprobe(upload_list[0],function(err,metadata){
                    
                        if(err){
                            console.log('first split video metadata not foundsss....'+err);
                        }else{
                            console.log('first split video ssmeat datasss:',metadata,metadata.format);
                            
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

                            take_video_process_info[0]={
                                'startpos' : 0,
                                'duration' : original_duration,
                                'endpos' : 0 + original_duration
                            }
                            first_complete=true;
                        }
                    });
                    //second split video into get
                    fluent_ffmpeg.ffprobe(upload_list[1],function(err,metadata){
                    
                        if(err){
                            console.log('second split video metadata not foundsss....'+err);
                        }else{
                            console.log('second split video ssmeat datasss:',metadata,metadata.format);
                            
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

                            take_video_process_info[1]={
                                'startpos' : 0,
                                'duration' : original_duration,
                                'endpos' : 0 + original_duration
                            }
                            two_complete=true;
                        }
                    });  
                    
                    let standby_intervalcnt=0;
                    let standby_interval=setInterval(function(){
                        if(two_complete==true && first_complete==true){
                            clearInterval(standby_interval);
                            resolve(true);
                        }

                        if(standby_intervalcnt == 2000){
                            clearInterval(standby_interval);
                            reject(new Error('timeout error'));
                        }
                        standby_intervalcnt++;
                    },150);
                });
            };
            let standby_=await await_async_function();
            console.log('========>업로드 비디오 한개->two split videos setting takevideoprocessinfosss:',standby_,take_video_process_info);

        }
      

        if(transition_type=='ffmpeg'){

            let data_gathering_store=[];//promise함수 참조 배열(외부배열)
            //promise콜백 외부 대기함수>>

            function extract_file_callback(data_gathering,res,request_id,takeindex){
                console.log('extract_file_callback 함수 호출]]]]]]]]]:');

                console.log('=====>transfer paramterss data_gathering,res,requestid,takeindex:',data_gathering,request_id,takeindex);

                let store={};
                store['takeindex'] = takeindex;
                store['data_gathering'] = data_gathering;//1_fulldata,${takeindex}_subpartvideo_data,1_full,takeindex등.

                //data_gathering_store[takeindex-1]=store;
                data_gathering_store.push(store);
            }
            function promise_function_standby(){
                console.log('promise_function_standby promise함수 호출]]]]]]]]]:');

                return new Promise((resolve,reject)=>{
                    
                    let callback_timeout=0;
                    let callback_standby = setInterval(function(){

                        if(data_gathering_store.length == upload_list.length){
                            console.log('callback 조건 충족 업로드테이크수 == 관련 subpart gatheringdata 충족수:',upload_list.length, data_gathering_store.length);

                            clearInterval(callback_standby);
                            resolve(data_gathering_store);
                        }
                        if(callback_timeout == 1000){
                            clearInterval(callback_standby);
                            reject(new Error("callback timeout error"));
                        }
                        callback_timeout++;
                    },120);
                })
            }
            for(let s=0; s<upload_list.length; s++){
                let upload_target=upload_list[s];
                let result= ffmpegNode.video_subpart_slice_normal(s+1, upload_target, extract_file_callback,res,request_id,take_video_process_info[s]);
            }
            let data_gathering = await promise_function_standby();
            data_gathering.sort(function(a,b){
                return a.takeindex - b.takeindex;
            });
            //let return_set=await transition_and_effect_start(req.body.upload_list_data,req.body.take_video_process_info,res);
            console.log('return out set return setsss: Data gathering((efffect_process_ver2)]]]',data_gathering);

            //이후에 이 나온 subpart분할된 비디오들(여러개일경우 필연적, 단일일경우 그대로 씀. 트랜지션ffmpeg-concat,ffmpeg transitin과정자체가 생략) 을 병합(트랜지션)처리 로직flow반영
            //그 병합된 결과물이 나올때까지 프로그램 실행대기>>>(원테이크)인경우 원본을 그대로 씀>>
            //===>>프로그램 실행 흐름 대기>>>=============================================================================

            let target_videos=[];
            for(let j=0; j<data_gathering.length; j++){
                let subpart_video = data_gathering[j];
                let takeindex=subpart_video['takeindex'];
                let data_gathering_item=subpart_video['data_gathering'][`${takeindex}_subpartvideo_data`];//관련 대상 경로값을 일단 리턴해준다. tmp대상체를 바로 리턴해준다.
                console.log('대상 tmp subpart비디오:',data_gathering_item);
                target_videos.push(data_gathering_item);
            }
            console.log('대상 target videosss:',target_videos);

            
            ffmpegNode.transition_merged2(request_id,target_videos,res,allTake_transitionmerged_callback,music);

            let s3_client=s3.s3client;
            let bucket_params={
                Bucket:'clllap',
                Key:'clllap/',
                Body:null,
                ACL:'public-read'
            }
            let is_transition_completed=false;
            let get_transitionmerged_pathdata='';


            function allTake_transitionmerged_callback(make_tmp_filepath,output_identityid,res){
                console.log(`전체 n개 테이크영상(인코딩처리) 같은 tbn,fps값 영상들끼리 기본적으로 트랜지션병합[xfade 지원 기본트랜지션리스트내에서 사용가능]`,make_tmp_filepath,output_identityid);

                //해당 영상 tmp대상을 ss3 에 업로드하고나면 성공하면 관련 성공여부
                let delete_plan_pathlocalsource= fs.createReadStream(make_tmp_filepath);
                let purefilename= make_tmp_filepath.split('/')[2];
                bucket_params['Key'] = `clllap/${purefilename}`;//순수 처리파일이름으로 하여 업로드처리>>>이름대로 하여 업로드처리>> 트랜지션파일들의 경우 새로 써지는것
                bucket_params['Body'] = delete_plan_pathlocalsource;

                s3_client.upload(bucket_params,(err,data)=>{
                    if(err){
                        console.log('what errosss:',err);
                    }
                    console.log('=====>>>>>s3 file uplaod trasnfer전달성공여부:ㅣ',data);

                    //get_transitionmerged_pathdata = `${s3_origin_dns}clllap/${purefilename}`;
                    get_transitionmerged_pathdata=`./tmp/${purefilename}`;
                    is_transition_completed=true;

                });
                        
            }
            let transition_process_standbypromise = function(){
                console.log('takevideo들 트랜지션 병합 관련 처리 대기 관련 프로미스함수호출::]]]]');

                return new Promise((resolve,reject)=>{

                    let inner_standbycnt=0;
                    let inner_standby= setInterval(function(){

                        if(is_transition_completed==true && get_transitionmerged_pathdata!=''){
                            console.log('===>관련 트랜지션 처리결과 관련 :',is_transition_completed,get_transitionmerged_pathdata);
                            clearInterval(inner_standby);
                            resolve(get_transitionmerged_pathdata);
                        }
                        if(inner_standbycnt==2000){
                            clearInterval(inner_standby);

                            reject(new Error('transition promise timeout error'));
                        }
                        inner_standbycnt++;
                    },150); 
                });
            }
            transition_result_data = await transition_process_standbypromise();
        }else if(transition_type=='opencv'){

            let distinct;
            let adapt_opencv_transition;
            switch(music){
                case '108':
                    distinct='transition_cut_';
                    adapt_opencv_transition=opencvfunctions1['transition_cut'];
                break;
                case '109':
                    distinct='transition_Rotation_left';
                    adapt_opencv_transition=opencvfunctions1['transition_Rotation_left'];
                break;
                case '110':
                    distinct='transition_Rotation_right';
                    adapt_opencv_transition=opencvfunctions1['transition_Rotation_right'];
                break;
                case '111':
                    distinct='transition_glitch_';
                    adapt_opencv_transition=opencvfunctions1['transition_glitch_'];
                break;
                case '112':
                    distinct='transition_flat_diagonal_';
                    adapt_opencv_transition=opencvfunctions1['transition_flat_diagonal_'];
                break;
                
            }

            let data_gathering_store=[];//promise함수 참조 배열(외부배열)
            //promise콜백 외부 대기함수>>
            let subpart_videos=[];

            function extract_file_callback(data_gathering,res,request_id,takeindex){
                console.log('extract_file_callback 함수 호출]]]]]]]]]:');

                console.log('=====>transfer paramterss data_gathering,res,requestid,takeindex:',data_gathering,request_id,takeindex);

                let store={};
                store['takeindex'] = takeindex;
                store['data_gathering'] = data_gathering;//1_fulldata,${takeindex}_subpartvideo_data,1_full,takeindex등.

                subpart_videos[takeindex-1]=data_gathering[`${takeindex}_subpartvideo_data`];

                data_gathering_store.push(store);
            }
            function promise_function_standby(){
                console.log('promise_function_standby promise함수 호출]]]]]]]]]:');

                return new Promise((resolve,reject)=>{
                    
                    let callback_timeout=0;
                    let callback_standby = setInterval(function(){

                        if(data_gathering_store.length == upload_list.length){
                            console.log('callback 조건 충족 업로드테이크수 == 관련 subpart gatheringdata 충족수:',upload_list.length, data_gathering_store.length);

                            clearInterval(callback_standby);
                            resolve(data_gathering_store);
                        }
                        if(callback_timeout == 1000){
                            clearInterval(callback_standby);
                            reject(new Error("callback timeout error"));
                        }
                        callback_timeout++;
                    },120);
                })
            }
            for(let s=0; s<upload_list.length; s++){
                let upload_target=upload_list[s];
                let result= ffmpegNode.video_subpart_slice_normal(s+1, upload_target, extract_file_callback,res,request_id,take_video_process_info[s]);
            }
            let data_gathering = await promise_function_standby();
            
            //let return_set=await transition_and_effect_start(req.body.upload_list_data,req.body.take_video_process_info,res);
            console.log('return out set return setsss: Data gathering((efffect_process_ver2)]]]',data_gathering);

            //이후에 이 나온 subpart분할된 비디오들(여러개일경우 필연적, 단일일경우 그대로 씀. 트랜지션ffmpeg-concat,ffmpeg transitin과정자체가 생략) 을 병합(트랜지션)처리 로직flow반영
            //그 병합된 결과물이 나올때까지 프로그램 실행대기>>>(원테이크)인경우 원본을 그대로 씀>>
            //===>>프로그램 실행 흐름 대기>>>=============================================================================  

            let transition_standby_gatherings=[];
            let betweenper_iswritecomplete=0;

            function edge_extract_callback(data_gathering,request_id,takeindex){
                console.log('====>subpart video start,endpart split infor callback:',data_gathering,request_id,takeindex);

                let startpart_data= data_gathering[`${takeindex}_startpart_data`];
                let endpart_data=data_gathering[`${takeindex}_endpart_data`];

                let start_data=data_gathering[`${takeindex}_start_data`];
                let end_data=data_gathering[`${takeindex}_end_data`];

                for(let del=0; del<startpart_data.length; del++){
                    let del_targetpath=startpart_data[del];
                    if(del!=0 && del_targetpath!=start_data){
                        if(fs.existsSync(del_targetpath)){
                            fs.unlinkSync(del_targetpath);
                        }
                    }
                }
                for(let del=0; del<endpart_data.length; del++){
                    let del_targetpath=endpart_data[del];
                    if(del!=25 && del_targetpath!=end_data){
                        if(fs.existsSync(del_targetpath)){
                            fs.unlinkSync(del_targetpath);
                        }
                    }
                }
                
                transition_standby_gatherings.push(data_gathering);//테이크별 시작,끝 종료 data저장.
            }
            for(let j=0; j<data_gathering.length; j++){
                let subpart_video = data_gathering[j];
                let takeindex=subpart_video['takeindex'];
                let data_gathering_item=subpart_video['data_gathering'][`${takeindex}_subpartvideo_data`];//관련 대상 경로값을 일단 리턴해준다. tmp대상체를 바로 리턴해준다.
                console.log('대상 tmp subpart비디오:',data_gathering_item);

                let result=ffmpegNode.video_img_extract_edgepart(takeindex,data_gathering_item,edge_extract_callback,request_id);
            }


            let promise_standby_=function(){
                return new Promise((resolve,reject)=>{
                    let inner_standbycnt=0;
                    let inner_standby = setInterval(function(){
                        if(transition_standby_gatherings.length== upload_list.length){
                            clearInterval(inner_standby);
                            resolve(true);
                        }
                        if(inner_standbycnt ==1500){
                            clearInterval(inner_standby);
                            reject(false);
                        }
                        inner_standbycnt++;
                    },400);
                });
            }

            let transition_standbyres=await promise_standby_();
            console.log('===>>트랜지션 준비데이터 준비완료여부:',transition_standbyres,transition_standby_gatherings);

            if(transition_standbyres){

                let betweenper_transitionfiles=[];
                let transitionframes_imgarrays=[];
                let output_merged_transitions=[];

                console.log('data gatheringsss:',transition_standby_gatherings);

                transition_standby_gatherings.sort(function(a,b){
                    return a.takeindex - b.takeindex;
                });
                console.log('정렬후의 data_gatheringsss:',transition_standby_gatherings);

                   
                async function between_transitionprocess(transition_standby_gatherings){
                    //트랜지션 functions start============================================>>>>
                    //장면별 트랜지션 처리>>직렬구조 반복문기반  인댁스값이 upload_list.length-1 이면 마지막 테이크정보라는것이고 이때는 다음take정보가 없기에 무시.
                    //이 연산을 통해 생성될 각 테이크별 요청별 테이크별 사이트랜지션 frame들 새로 write되는것들이고 이들을 기억해둔다. 이 리스트들을 추후에 삭제하면서 s3로 전송해야할것임>>
                    //let takeper_between_transitionframes_planwrite=[];//이들은 추후에 삭제되어야함.>>전체 모인후에 바로 s3로 업로드되면서 삭제되어야함.
                    try{
                        for(let t=0; t<transition_standby_gatherings.length; t++){
                            //let takeindex= takeper_startendframe_data[t]['takeindex'];
                            if(t != transition_standby_gatherings.length-1){
                                let temp_store={};
                                
                                temp_store['betweenindex'] = t+1;//between1,2,3,..이런식저장.
                                temp_store['betweenper_transitionframes']=[];
                                temp_store['betweenper_transitionframes_referFormat'] = `${request_id}_between${t+1}_transitionframe`;//reqid_between1,2,3_transitionframe%d.png형태로 betwen별 참조를 위한 자료구조>>
                                betweenper_transitionfiles.push(temp_store);
            
                                //마지막 인댁스take가 아닌경우에만 관련 하여 저장처리>>
                                let nowtake_lastframe_data= transition_standby_gatherings[t][`${t+1}_end_data`];//0:1_end_data,1:2_start_data / 2:3_end_data,3:4_start_data 
                                let nexttake_firstframe_data = transition_standby_gatherings[t+1][`${t+1+1}_start_data`];
                                console.log('현재 take index및 관련하여 생성되는 프레임장면between periods:[[TRANSIJTION EFFECT]]',nowtake_lastframe_data, nexttake_firstframe_data);//now~next씩 하여 uploadcnt-1의 장면들 생성된다.
                                console.log('between별(TRANSITION)소스 시작~종료이미지:',nowtake_lastframe_data,nexttake_firstframe_data);
                                
                                //let now_lastframe=await Jimp.read(nowtake_lastframe_data);//테이크별 nowlast,nextfirst 프레임이미지url을 다 사용하고 나선 제거한다 ec2
                                //let next_firstframe = await Jimp.read(nexttake_firstframe_data);
                                let now_lastframe;
                                let next_firstframe
                                if(fs.existsSync(nowtake_lastframe_data)){
                                    now_lastframe = await loadImage(nowtake_lastframe_data);
                                }
                                if(fs.existsSync(nexttake_firstframe_data)){
                                    next_firstframe = await loadImage(nexttake_firstframe_data);
                                }
                                
                                console.log('===now lastframess:',now_lastframe);
                                console.log('===>next firstframesss:',next_firstframe);
            
                                //let between_start_s= cv.matFromImageData(now_lastframe.bitmap);
                                //let between_end_s = cv.matFromImageData(next_firstframe.bitmap);//각 사이장면별 betweenstart,end bitmap array형태 console.log 은닉됨.
                                let between_start_s = cv.imread(now_lastframe);
                                let between_end_s = cv.imread(next_firstframe);//사용될 영상 별 사이 관련 이미지>>
                                
                                console.log('===now lastframess:',between_start_s);
                                console.log('===>next firstframesss:',between_end_s);
            
                                let transition=[];

                               
                                transition = adapt_opencv_transition(between_start_s,between_end_s);//처리된 트랜지션 이미지 배열 객체mat배열객체>>
                                between_start_s.delete();between_end_s.delete();
                                console.log('각 between별 트랜지션 처리완료]]]]]]',transition);
            
                                for(let inner=0; inner<transition.length; inner++){
                                    let mat=transition[inner];
                                    let writecanvas = createCanvas(mat.cols,mat.rows);
                                    cv.imshow(writecanvas,mat);
            
                                    let delete_plan_pathlocal=`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`;//각 처리될(이미지처리) 모두 처리가 된 이후 프레임하나별로 모두 s3바로 업로드,삭제 반복한다>>
                                    transitionframes_imgarrays.push(delete_plan_pathlocal);
                                    console.log('write filess:',delete_plan_pathlocal);
                                    fs.writeFile(`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`,writecanvas.toBuffer('image/png'),(err)=>{
                                        if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
                                        console.log('the file has been asaved!!!(EFFECT OPENCV)');
                                        
                                        betweenper_iswritecomplete++;
                                    })
                                   // fs.writeFileSync(`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`,writecanvas.toBuffer('image/png'));
                                }
                            }
                        }
            
                    }catch(error){
                        console.log('OPENCV ERROSSSSRRSSS:',error);
                    }
                    //테이크별 반복문>> 테이크별로 모두 처리가 될시에 이미지처리하고 ec2 > tmp 파일시스템상에 파일을 쓰고 난뒤에 관련
                    //트랜지션 functions endsss===============================>>> 직렬구조이기에 관련 처리끝난것.    
                };  
                
                between_transitionprocess(transition_standby_gatherings);

                let transitioneffect_standby_promise=function(){
                    return new Promise((resolve,reject)=>{
                        let inner_standbycnt=0;
                        let inner_standby = setInterval(function(){
                            if(betweenper_iswritecomplete == (52*(transition_standby_gatherings.length-1))){
                                clearInterval(inner_standby);
                                console.log('트랜지션 프레임 이미지들 전체 준비완료:',betweenper_transitionfiles);
                                
                                resolve(true);
                            }
                            if(inner_standbycnt==2000){
                                clearInterval(inner_standby);

                                reject(new Error('timeout error'));
                            }
                            inner_standbycnt++;
                        },500);
                    });
                }

                let transition_standby_complete = await transitioneffect_standby_promise();
                console.log('transiton standby completess:',betweenper_transitionfiles,upload_list);


                function inner_callback(result,res){
                    console.log('내부 콜백실행>>outputfile path받기::',result);//처리된 파일자체의 경로를 전달주고 이들끼리합친다.
            
                    output_merged_transitions.push(result);//각 병합파일(트랜지션between)별 업로드 성공때마다 그 파일에 대한 pallning정보배열에 넣음.            
                }     
                for(let b=0; b<betweenper_transitionfiles.length; b++){
                    let item=betweenper_transitionfiles[b];

                    ffmpegNode.between_transition_merged_(request_id,item['betweenper_transitionframes_referFormat'],inner_callback,res,b+1);
                }
               
                let final_standby_promise = function(){
                    return new Promise((resolve,reject)=>{
            
                        let standby_cnt=0;
                        let standby = setInterval(function(){
            
                            if(output_merged_transitions.length == upload_list.length-1){
                                console.log('final 대기 종료:',output_merged_transitions);
                                clearInterval(standby);
            
                                console.log('삭제할 생성 트랜지션 framesss:',transitionframes_imgarrays);
                                for(let del=0; del<transitionframes_imgarrays.length; del++){
                                    let del_target=transitionframes_imgarrays[del];
                                    if(fs.existsSync(del_target)){
                                        fs.unlinkSync(del_target);
                                    }
                                }

                                resolve(true);
                            }
                            if(standby_cnt == 2000){
                                clearInterval(standby);
            
                                reject(new Error('timeout error'));
                            }
                            standby_cnt++;
                        },500);
                    });
                }

                let final_standby_complete=await final_standby_promise();
                if(final_standby_complete){
                    console.log('마지막 대기 관련 준비데이터 비디오들:',upload_list,output_merged_transitions,subpart_videos);

                    let return_set=await ffmpegNode.originals_and_betweentransition_merged_(request_id,subpart_videos,output_merged_transitions,res);

                    console.log('return resultsss:',return_set);

                    transition_result_data='./tmp/'+return_set.output;

                }

            }
        }
           
        console.log('==>>트랜지션 처리 비디오 대상체:',transition_result_data);
        
        let transition_video_extract_datas= await ffmpegNode.video_img_extract_total(transition_result_data,request_id);
        console.log('결과!!!:',transition_video_extract_datas);

        //filter,overlay이펙트 트랜지션 처리파일에 기반으로 하여 적용>>>
        //n개 올린경우 이 결과의 트랜지션파일(무음성,audio스트림x)에 대해서 30초결과물>> 이펙트 적용(음악에 따른 이펙트적용)+ 마지막에 음악copy
        let overlay_referval;
        switch(music){
            case '1':
                overlay_referval = commonvar.FIREWORKS16;
                select_filter= 'gray';
            break;
            case '2':
                overlay_referval = commonvar.FIREWORKS3;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter= 'canny';
            break;
            case '3':
                overlay_referval = commonvar.LENSFLARE6;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='threshold';
            break;
            case '4':
                overlay_referval = commonvar.LENSFLARE7;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='calcHist';
            break;
            case '5':
                overlay_referval = commonvar.PARTICLES1;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='erosion';
            break;
            case '6':
                overlay_referval = commonvar.PARTICLES3;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='dilation';
            break;
            case '7':
                overlay_referval = commonvar.RAIN16;
            // overlay_referval = commonvar.FIREWORKS16;
                select_filter='morphology';
            break;
            case '108':
                overlay_referval = commonvar.RAIN18;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='canny';
            break;
            case '109':
                overlay_referval = commonvar.SMOKE4;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='erosion';
            break;
            case '110':
                overlay_referval = commonvar.RAIN16;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='threshold';
            break;
            case '111':
                overlay_referval = commonvar.PARTICLES3;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='calcHist';
            break;
            case '112':
                overlay_referval = commonvar.PARTICLES1;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='threshold';
            break;
        }   

        effectprocess(transition_video_extract_datas,request_id);
        let is_effect_complete=false;
        async function effectprocess(transition_video_extract_datas,request_id){
            console.log('-====>>effectprocess[[EFFECT PROCESS FUNCTION executesss]]]',transition_video_extract_datas,request_id,transition_video_extract_datas['framefiles_nameformat']);

            //let total_frame_data= data_gathering[`${takeindex}_full_data_plans3`];//s3위치값입니다. 
            let total_frame_data=transition_video_extract_datas[`frame_full_data`];//ec2 tmp위치값입니다. nodejs -> s3 이미지 refer참조시 대량으로 참조하는경우에 경우에 따라서 tls,https,socket관련 이슈가 필연적 발생할수가 있어, 네트웤관련 문제 발생하여 로직구현에 영향을 미침.

            let video_duration = total_frame_data.length / 26;//s값. 실행형태로 넘어온 테이크별 duration값>>>

            //필터 효과 지정될 랜덤구간 inex프레임범위 지정 statarts  filter 1 구간.
            let random_index1 =Math.floor(video_duration*Math.random());
            random_index1 +=1;  
            let random_start1 = random_index1 - 2 < 0?0:random_index1 - 2;
            let random_end1 = random_index1;//6  4~6 5~7  3 1~3 2 0~2 1 -1~1:0~1      
            let take_range_start1 = 26 * (random_start1)+1;
            let take_range_end1 = 26 * (random_end1);

            //필터 효과 지정될 랜덤구간 index프레임범위 지정startss  2효과 구간
            let random_index2 = Math.floor(video_duration*Math.random());
            random_index2 += 1;
            let random_start2 = random_index2 -2 <0?0:random_index2 - 2;
            let random_end2 = random_index2;      
            let take_range_start2 = 26*(random_start2)+1;
            let take_range_end2 = 26*(random_end2);


            console.log('filter1반영구간::',take_range_start1,take_range_end1);
            console.log('filter2반영구간::',take_range_start2,take_range_end2);

            //filter1 adapts...
            console.log('====>filter1 adapt start===========================>');
            for(let t=0; t<total_frame_data.length; t++){
                let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
                console.log('adapt frames omdex',t+1,local_original_frame);
                let result;//프레임별(take) 범위의 forloop 범위의 변수.

                if((take_range_start1 <= t+1 && t+1 <= take_range_end1)){
                    //필터범위, 오버레이 모든 범위에 속하는 중첩의 경우
                    console.log('===>filter1 effect adapt',t+1,take_range_start1,take_range_end1)

                    //let original_frame_source= await Jimp.read(local_original_frame);
                    //let target_src= cv.matFromImageData(original_frame_source.bitmap);//원본 각 프레임이미지

                    if(fs.existsSync(local_original_frame)){
                        let original_frame_source = await loadImage(local_original_frame);//tmp상의 관련 encodingframes요청 소켓사용??
                        let target_src = cv.imread(original_frame_source);//대상  ==>>원본 이미지 정보 매트릭스
                        console.log('original_frames_sroucess!!!:',original_frame_source);
                        console.log('targert_srcc!!!:',target_src)
                        try{
                            switch(select_filter){
                                case 'passThrough' : result = opencvfunctions1.passThrough(target_src); break;
                                case 'gray' : result = opencvfunctions1.gray(target_src); break;
                                case 'hsv': result = opencvfunctions1.hsv(target_src);break;
                                case 'canny':result = opencvfunctions1.canny(target_src); break;
                                case 'inRange': result = opencvfunctions1.inRange(target_src); break;
                                case 'threshold':result = opencvfunctions1.threshold(target_src); break;
                                case 'adaptiveThreshold': result= opencvfunctions1.adaptiveThreshold(target_src); break;
                                case 'gaussianBlur': result= opencvfunctions1.gaussianBlur(target_src); break;
                                //case 'bilateralFilter': result = opencvfunctions1.bilateralFilter(target_src); break;
                                //case 'medianBlur': result= opencvfunctions1.medianBlur(target_src); break;
                                case 'sobel' : result=opencvfunctions1.sobel(target_src); break;
                                case 'scharr': result = opencvfunctions1.scharr(target_src);break;
                                case 'laplacian': result= opencvfunctions1.laplacian(target_src);break;
                                case 'calcHist': result=opencvfunctions1.calcHist(target_src);break;
                                case 'equalizeHist': result=opencvfunctions1.equalizeHist(target_src);break;
                                //case 'backprojection': result=opencvfunctions1.backprojection(target_src);break;
                                case 'erosion':result=opencvfunctions1.erosion(target_src);break;
                                case 'dilation':result=opencvfunctions1.dilation(target_src);break;
                                case 'morphology':result=opencvfunctions1.morphology(target_src);break;
                                case 'contours' : result=opencvfunctions1.contours(target_src);break;
                                default : result =opencvfunctions1.passThrough(target_src);
                            }
                                    
                            let writecanvas = createCanvas(result.cols,result.rows);
                            cv.imshow(writecanvas,result);
                            
                            result.delete();
                            
                            /*fs.writeFile(local_original_frame,writecanvas.toBuffer('image/png'),(err)=>{
                            if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);

                            })*/
                            fs.writeFileSync(local_original_frame,writecanvas.toBuffer("image/png"));           
                        
                        }catch (err) {
                            console.log('CV ERRORSSS:', err);
                        }     
                    }                             
                }
            }
            console.log('====>filter1 adapt end===========================>');
            console.log('====>filter2 adapt startss===========================>');
            for(let t=0; t<total_frame_data.length; t++){
                let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
                console.log('filter2 adapt frames omdex',t+1,local_original_frame);
                let result;//프레임별(take) 범위의 forloop 범위의 변수.

                if((take_range_start2<= t+1 && t+1 <= take_range_end2)){
                    console.log('===>filter2 effect adapt',t+1,take_range_start2,take_range_end2)

                    //let target_src= cv.matFromImageData(original_frame_source.bitmap);//원본 각 프레임이미지
                    if(fs.existsSync(local_original_frame)){
                        let original_frame_source = await loadImage(local_original_frame);//tmp상의 관련 encodingframes요청 소켓사용??
                        let target_src = cv.imread(original_frame_source);//대상  ==>>원본 이미지 정보 매트릭스
                        console.log('original_frames_sroucess!!!:',original_frame_source);
                        try{
                            switch(select_filter){
                                case 'passThrough' : result = opencvfunctions1.passThrough(target_src); break;
                                case 'gray' : result = opencvfunctions1.gray(target_src); break;
                                case 'hsv': result = opencvfunctions1.hsv(target_src);break;
                                case 'canny':result = opencvfunctions1.canny(target_src); break;
                                case 'inRange': result = opencvfunctions1.inRange(target_src); break;
                                case 'threshold':result = opencvfunctions1.threshold(target_src); break;
                                case 'adaptiveThreshold': result= opencvfunctions1.adaptiveThreshold(target_src); break;
                                case 'gaussianBlur': result= opencvfunctions1.gaussianBlur(target_src); break;
                                //case 'bilateralFilter': result = opencvfunctions1.bilateralFilter(target_src); break;
                                //case 'medianBlur': result= opencvfunctions1.medianBlur(target_src); break;
                                case 'sobel' : result=opencvfunctions1.sobel(target_src); break;
                                case 'scharr': result = opencvfunctions1.scharr(target_src);break;
                                case 'laplacian': result= opencvfunctions1.laplacian(target_src);break;
                                case 'calcHist': result=opencvfunctions1.calcHist(target_src);break;
                                case 'equalizeHist': result=opencvfunctions1.equalizeHist(target_src);break;
                                //case 'backprojection': result=opencvfunctions1.backprojection(target_src);break;
                                case 'erosion':result=opencvfunctions1.erosion(target_src);break;
                                case 'dilation':result=opencvfunctions1.dilation(target_src);break;
                                case 'morphology':result=opencvfunctions1.morphology(target_src);break;
                                case 'contours' : result=opencvfunctions1.contours(target_src);break;
                                default : result =opencvfunctions1.passThrough(target_src);
                            }
                                    
                            let writecanvas = createCanvas(result.cols,result.rows);
                            cv.imshow(writecanvas,result);
                            
                            result.delete();
                            
                            /*fs.writeFile(local_original_frame,writecanvas.toBuffer('image/png'),(err)=>{
                                if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);

                            })*/
                            fs.writeFileSync(local_original_frame,writecanvas.toBuffer('image/png'));           
                        
                        }catch (err) {
                            console.log('CV ERRORSSS:', err);
                        }    
                    }
                                              
                }
            }
            console.log('====>filter2 adapt endss===========================>');

            //오버레이 효과 지정될 랜덤구간 index프레임범위 지정startss 3효과 구간
            let random_index3 = Math.floor(video_duration*Math.random());
            random_index3 += 1;
            let random_start3 = random_index3 -1 <0?0:random_index3 - 1;
            let random_end3 = random_index3;      
            let take_range_start3 = 26*(random_start3)+1;
            let take_range_end3= 26*(random_end3);

            let random_index4 = Math.floor(video_duration*Math.random());
            random_index4 += 1;
            let random_start4 = random_index4 -1 <0?0:random_index4 - 1;
            let random_end4 = random_index4;      
            let take_range_start4 = 26*(random_start4)+1;
            let take_range_end4= 26*(random_end4);

            console.log('overlay범위:',random_start3,random_end3,take_range_start3,take_range_end3);
            console.log('overlay2범위:',random_start4,random_end4,take_range_start4,take_range_end4);

            console.log('====>overlay adapt startss===========================>');
            let overlay_index=20;
            for(let t=0; t<total_frame_data.length; t++){
                let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
                console.log('overlay adapt frames omdex',t+1,local_original_frame);

                if((take_range_start3 <= t+1 && t+1 <= take_range_end3)){
                    //오버레이 범위에만 속했던 경우
                    console.log('===>>오버레이 속하는 경우:',t+1,take_range_start3,take_range_end3);
        
                    if(fs.existsSync(local_original_frame)){
                        try{
                            //let original_frame_source= await Jimp.read(local_original_frame);//원본소스
                            let original_frame_source = await loadImage(local_original_frame);
                            let target_src = cv.imread(original_frame_source);
    
                            console.log('original_frame_source:',original_frame_source);
    
                            //오버레이반영
                            let src_overlay=new cv.Mat();
                            console.log('==>읽을 오버레이path:,origilnaframesource path:',local_original_frame,`${overlay_referval}${overlay_index+1}.png`);
                            //let src_overlayimage= await Jimp.read(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 범위 1~52범위 테이크별 관련 대상체를 remote읽는다.
                            let src_overlayimage = await loadImage(`${overlay_referval}${overlay_index+1}.png`);
                            //src_overlay = cv.matFromImageData(src_overlayimage.bitmap);//오버레이 대상 이미지의 metrix데이터입니다.
                            src_overlay = cv.imread(src_overlayimage);
    
                            let overlay_dst= new cv.Mat();
            
                            cv.addWeighted(target_src,1,src_overlay,0.72,0.0,overlay_dst,-1);//overlay_dst에 관련 메트릭스 효과 반영되며 이를 파일로 저장필요. 한개 오버레이이펙트효과
    
                            let writecanvas = createCanvas(overlay_dst.cols,overlay_dst.rows);
                            cv.imshow(writecanvas,overlay_dst);
    
                            target_src.delete();src_overlay.delete(); overlay_dst.delete();
                                
                            overlay_index++;
    
                            /*fs.writeFile(local_original_frame,writecanvas.toBuffer('image/png'),(err)=>{
                                if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
    
                            });*/
                            fs.writeFileSync(local_original_frame,writecanvas.toBuffer('image/png'));
                    
                        }catch (err) {
                            console.log('OPENCV ERORSSS TM CCVVVSS:',err);
                        }  
                    }                         
                }
            }
            overlay_index=35;
            for(let t=0; t<total_frame_data.length; t++){
                let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
                console.log('overlay adapt frames omdex',t+1,local_original_frame);

                if((take_range_start4 <= t+1 && t+1 <= take_range_end4)){
                    //오버레이 범위에만 속했던 경우
                    console.log('===>>오버레이 속하는 경우:',t+1,take_range_start4,take_range_end4);
        
                    if(fs.existsSync(local_original_frame)){
                        try{
                            //let original_frame_source= await Jimp.read(local_original_frame);//원본소스
                            let original_frame_source = await loadImage(local_original_frame);
                            let target_src = cv.imread(original_frame_source);
    
                            console.log('original_frame_source:',original_frame_source);
    
                            //오버레이반영
                            let src_overlay=new cv.Mat();
                            console.log('==>읽을 오버레이path:,origilnaframesource path:',local_original_frame,`${overlay_referval}${overlay_index+1}.png`);
                            //let src_overlayimage= await Jimp.read(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 범위 1~52범위 테이크별 관련 대상체를 remote읽는다.
                            let src_overlayimage = await loadImage(`${overlay_referval}${overlay_index+1}.png`);
                            //src_overlay = cv.matFromImageData(src_overlayimage.bitmap);//오버레이 대상 이미지의 metrix데이터입니다.
                            src_overlay = cv.imread(src_overlayimage);
    
                            let overlay_dst= new cv.Mat();
            
                            cv.addWeighted(target_src,1,src_overlay,0.72,0.0,overlay_dst,-1);//overlay_dst에 관련 메트릭스 효과 반영되며 이를 파일로 저장필요. 한개 오버레이이펙트효과
    
                            let writecanvas = createCanvas(overlay_dst.cols,overlay_dst.rows);
                            cv.imshow(writecanvas,overlay_dst);
    
                            target_src.delete();src_overlay.delete(); overlay_dst.delete();
                                
                            overlay_index++;
    
                            /*fs.writeFile(local_original_frame,writecanvas.toBuffer('image/png'),(err)=>{
                                if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
    
                            });*/
                            fs.writeFileSync(local_original_frame,writecanvas.toBuffer('image/png'));
                    
                        }catch (err) {
                            console.log('OPENCV ERORSSS TM CCVVVSS:',err);
                        }     
                    }                     
                }
            }
            console.log('====>overlay adapt endss===========================>');        

            is_effect_complete=true;
        }

        let final_standby = function(transition_video_extract_datas){
            return new Promise((resolve,reject)=>{

                let final_standbycnt=0;
                let final_standby = setInterval(async function(){
                    if(is_effect_complete == true){
                        console.log('트랜지션처리>>이펙트,필터 처리 모두완료}}>>>>');
                        console.log('transition_video_extract_datas',transition_video_extract_datas);

                        clearInterval(final_standby);

                        let result= await ffmpegNode.video_frames_merged(request_id,transition_video_extract_datas);
                        
                        console.log('====+>>최종 비디오 출력파일::]]]]',result);

                        resolve(result);
                    }

                    if(final_standbycnt == 400){
                        clearInterval(final_standby);
                        reject(false);
                    }

                    final_standbycnt++;
                },1200);             
            });
        }
        let final_result=await final_standby(transition_video_extract_datas);
        console.log('final reusltss;]]]]]:',final_result);

        console.log('=====>>최종 파일 출력(오디오병합mix):',request_id);
        let music_select;
        switch(music){
            case '1':
                music_select = commonvar.MUSIC1;
            break;
            case '2':
                //overlay_referval = commonvar.FIREWORKS3;
                music_select = commonvar.MUSIC2;
            break;
            case '3':
                //overlay_referval = commonvar.LENSFLARE6;
                music_select = commonvar.MUSIC3;
            break;
            case '4':
                //overlay_referval = commonvar.LENSFLARE7;
                music_select = commonvar.MUSIC4;
            break;
            case '5':
                //overlay_referval = commonvar.PARTICLES1;
                music_select = commonvar.MUSIC5;
            break;
            case '6':
                //overlay_referval = commonvar.PARTICLES3;
                music_select = commonvar.MUSIC6;
            break;
            case '7':
                //overlay_referval = commonvar.RAIN16;
                music_select = commonvar.MUSIC7;
            break;
            case '108':
                //overlay_referval = commonvar.RAIN18;
                music_select = commonvar.MUSIC8;
            break;
            case '109':
                //overlay_referval = commonvar.SMOKE4;
                music_select = commonvar.MUSIC9;
            break;
            case '110':
                //overlay_referval = commonvar.SMOKE6;
                music_select = commonvar.MUSIC10;
            break;
            case '111':
                //overlay_referval = commonvar.SMOKE6;
                music_select = commonvar.MUSIC11;
            break;
            case '112':
                //overlay_referval = commonvar.SMOKE6;
                music_select = commonvar.MUSIC12;
            break;
        }

        if(final_result !=''){
            console.log('반영 병합 최종파일 response returnsss:',final_result);

            let s3_parameters=s3.uploadParams;
            
            s3_parameters.Key=`clllap/${final_result}`;
            s3_parameters.Body = fs.createReadStream('./tmp/'+final_result);

            console.log('s3 paramterss refer spacess:',s3_parameters);
            let s3_client=s3.s3client;

            s3_client.upload(s3_parameters,async (err,data)=>{
                if(err){
                    console.log('what errosss:',err);
                    return false;
                }
                console.log('s3 final전달 파일 여부 성공여부:',data);

                let result=await ffmpegNode.mergedAudio(final_result,music_select,request_id);
                console.log("==>> 영상 오디오 처리완료...>>:",result);

                let s3_parameters=s3.uploadParams;

                s3_parameters.Key=`clllap/${result[0]}`;
                s3_parameters.Body = fs.createReadStream(`./tmp/${result[0]}`);

                console.log('s3 paramterss refer spacess:',s3_parameters);
    
                s3_client.upload(s3_parameters,(err,data)=>{
                    if(err){
                        console.log('what errosss:',err);
                        
                        return res.status(403).json({success:false,message:'server ERROR'});
                    }
                    console.log('s3 final전달 파일 여부 성공여부(AUDIO MIX):',data);
                    
                    //fs.unlink(`./tmp/${outputfile_name}`,(err=>{ if(err)console.log('Error:',err);}));//해당 위치에 대상체 삭제한다.

                    console.log('=======================>transition and effect process requetsss FINAL RETURN ===============');

                    //video_result:순수 비디오스트림output, video_result_final:비디오스트림+오디오스트림 최종출력물 s3path리턴합니다.
                    return res.json({success:true,video_result:`${s3_origin_dns}clllap/${result[1]}`,video_result_final:`${s3_origin_dns}clllap/${result[0]}`});
                });
            });

        }else{
            return res.status(403).json({success:false, message:'server ERROR'});
        }
 
        console.log('=======================>transition and effect process requetsss ENDLINES===============');

    }

});//media Process api functions ends===============================
app.post('/api/transition_and_effect_process_ver3',async(req,res)=>{
    console.log('=======================>transition and effect process requetsss START===============');//데이터를 넘겨옵니다.

    console.log('req.bodyss:',req.body.edittake_videolist);

    let edittake_videolist=req.body.edittake_videolist;
    edittake_videolist=edittake_videolist.split(',');
    //let select_overlay= req.body.select_overlay;
    //let select_filter =req.body.select_filter;
    let music = req.body.music; 
    //let upload_list = req.body.upload_list_data.split(',');
    //let take_video_process_info=  req.body.take_video_process_info;
    /*if(take_video_process_info && take_video_process_info!='undefined'){
        take_video_process_info = JSON.parse(take_video_process_info);
    }*/
    let transition_type=req.body.transition_type;//ffmpeg,opencv(music에 따라 결정)

    let request_id= makeid(20);//요청id값>>여기서부터가 요청시작으로 origin시작>>

    let transition_result_data;
    if(edittake_videolist.length >=1){
        
        if(transition_type=='ffmpeg'){
            
            ffmpegNode.transition_merged2(request_id,edittake_videolist,res,allTake_transitionmerged_callback,music);

            let s3_client=s3.s3client;
            let bucket_params={
                Bucket:'clllap',
                Key:'clllap/',
                Body:null,
                ACL:'public-read'
            }
            let is_transition_completed=false;
            let get_transitionmerged_pathdata='';

            function allTake_transitionmerged_callback(make_tmp_filepath,output_identityid,res){
                console.log(`전체 n개 테이크영상(인코딩처리) 같은 tbn,fps값 영상들끼리 기본적으로 트랜지션병합[xfade 지원 기본트랜지션리스트내에서 사용가능]`,make_tmp_filepath,output_identityid);

                //해당 영상 tmp대상을 ss3 에 업로드하고나면 성공하면 관련 성공여부
                let delete_plan_pathlocalsource= fs.createReadStream(make_tmp_filepath);
                let purefilename= make_tmp_filepath.split('/')[2];
                bucket_params['Key'] = `clllap/${purefilename}`;//순수 처리파일이름으로 하여 업로드처리>>>이름대로 하여 업로드처리>> 트랜지션파일들의 경우 새로 써지는것
                bucket_params['Body'] = delete_plan_pathlocalsource;

                s3_client.upload(bucket_params,(err,data)=>{
                    if(err){
                        console.log('what errosss:',err);
                    }
                    console.log('=====>>>>>s3 file uplaod trasnfer전달성공여부:ㅣ',data);

                    //get_transitionmerged_pathdata = `${s3_origin_dns}clllap/${purefilename}`;
                    get_transitionmerged_pathdata=`./tmp/${purefilename}`;
                    is_transition_completed=true;

                });                
            }
            let transition_process_standbypromise = function(){
                console.log('takevideo들 트랜지션 병합 관련 처리 대기 관련 프로미스함수호출::]]]]');

                return new Promise((resolve,reject)=>{

                    let inner_standbycnt=0;
                    let inner_standby= setInterval(function(){

                        if(is_transition_completed==true && get_transitionmerged_pathdata!=''){
                            console.log('===>관련 트랜지션 처리결과 관련 :',is_transition_completed,get_transitionmerged_pathdata);
                            clearInterval(inner_standby);
                            resolve(get_transitionmerged_pathdata);
                        }
                        if(inner_standbycnt==2000){
                            clearInterval(inner_standby);

                            reject(new Error('transition promise timeout error'));
                        }
                        inner_standbycnt++;
                    },150); 
                });
            }
            transition_result_data = await transition_process_standbypromise();
        }else if(transition_type=='opencv'){

            let distinct;
            let adapt_opencv_transition;
            switch(music){
                case '108':
                    distinct='transition_cut_';
                    adapt_opencv_transition=opencvfunctions1['transition_cut'];
                break;
                case '109':
                    distinct='transition_Rotation_left';
                    adapt_opencv_transition=opencvfunctions1['transition_Rotation_left'];
                break;
                case '110':
                    distinct='transition_Rotation_right';
                    adapt_opencv_transition=opencvfunctions1['transition_Rotation_right'];
                break;
                case '111':
                    distinct='transition_glitch_';
                    adapt_opencv_transition=opencvfunctions1['transition_glitch_'];
                break;
                case '112':
                    distinct='transition_flat_diagonal_';
                    adapt_opencv_transition=opencvfunctions1['transition_flat_diagonal_'];
                break;
                
            }

            let transition_standby_gatherings=[];
            let betweenper_iswritecomplete=0;

            function edge_extract_callback(data_gathering,request_id,takeindex){
                console.log('====>subpart video start,endpart split infor callback:',data_gathering,request_id,takeindex);

                let startpart_data= data_gathering[`${takeindex}_startpart_data`];
                let endpart_data=data_gathering[`${takeindex}_endpart_data`];

                let start_data=data_gathering[`${takeindex}_start_data`];
                let end_data=data_gathering[`${takeindex}_end_data`];

                for(let del=0; del<startpart_data.length; del++){
                    let del_targetpath=startpart_data[del];
                    if(del!=0 && del_targetpath!=start_data){
                        if(fs.existsSync(del_targetpath)){
                            fs.unlinkSync(del_targetpath);
                        }
                    }
                }
                for(let del=0; del<endpart_data.length; del++){
                    let del_targetpath=endpart_data[del];
                    if(del!=25 && del_targetpath!=end_data){
                        if(fs.existsSync(del_targetpath)){
                            fs.unlinkSync(del_targetpath);
                        }
                    }
                }
                
                transition_standby_gatherings.push(data_gathering);//테이크별 시작,끝 종료 data저장.
            }
            for(let j=0; j<edittake_videolist.length; j++){
                let subpart_video = edittake_videolist[j];
                console.log('대상 tmp subpart비디오:',subpart_video);

                let result=ffmpegNode.video_img_extract_edgepart(j+1,subpart_video,edge_extract_callback,request_id);
            }


            let promise_standby_=function(){
                return new Promise((resolve,reject)=>{
                    let inner_standbycnt=0;
                    let inner_standby = setInterval(function(){
                        if(transition_standby_gatherings.length== edittake_videolist.length){
                            clearInterval(inner_standby);
                            resolve(true);
                        }
                        if(inner_standbycnt ==1500){
                            clearInterval(inner_standby);
                            reject(false);
                        }
                        inner_standbycnt++;
                    },400);
                });
            }

            let transition_standbyres=await promise_standby_();
            console.log('===>>트랜지션 준비데이터 준비완료여부:',transition_standbyres,transition_standby_gatherings);

            if(transition_standbyres){

                let betweenper_transitionfiles=[];
                let transitionframes_imgarrays=[];
                let output_merged_transitions=[];

                console.log('data gatheringsss:',transition_standby_gatherings);

                transition_standby_gatherings.sort(function(a,b){
                    return a.takeindex - b.takeindex;
                });
                console.log('정렬후의 data_gatheringsss:',transition_standby_gatherings);

                   
                async function between_transitionprocess(transition_standby_gatherings){
                    //트랜지션 functions start============================================>>>>
                    //장면별 트랜지션 처리>>직렬구조 반복문기반  인댁스값이 upload_list.length-1 이면 마지막 테이크정보라는것이고 이때는 다음take정보가 없기에 무시.
                    //이 연산을 통해 생성될 각 테이크별 요청별 테이크별 사이트랜지션 frame들 새로 write되는것들이고 이들을 기억해둔다. 이 리스트들을 추후에 삭제하면서 s3로 전송해야할것임>>
                    //let takeper_between_transitionframes_planwrite=[];//이들은 추후에 삭제되어야함.>>전체 모인후에 바로 s3로 업로드되면서 삭제되어야함.
                    try{
                        for(let t=0; t<transition_standby_gatherings.length; t++){
                            //let takeindex= takeper_startendframe_data[t]['takeindex'];
                            if(t != transition_standby_gatherings.length-1){
                                let temp_store={};
                                
                                temp_store['betweenindex'] = t+1;//between1,2,3,..이런식저장.
                                temp_store['betweenper_transitionframes']=[];
                                temp_store['betweenper_transitionframes_referFormat'] = `${request_id}_between${t+1}_transitionframe`;//reqid_between1,2,3_transitionframe%d.png형태로 betwen별 참조를 위한 자료구조>>
                                betweenper_transitionfiles.push(temp_store);
            
                                //마지막 인댁스take가 아닌경우에만 관련 하여 저장처리>>
                                let nowtake_lastframe_data= transition_standby_gatherings[t][`${t+1}_end_data`];//0:1_end_data,1:2_start_data / 2:3_end_data,3:4_start_data 
                                let nexttake_firstframe_data = transition_standby_gatherings[t+1][`${t+1+1}_start_data`];
                                console.log('현재 take index및 관련하여 생성되는 프레임장면between periods:[[TRANSIJTION EFFECT]]',nowtake_lastframe_data, nexttake_firstframe_data);//now~next씩 하여 uploadcnt-1의 장면들 생성된다.
                                console.log('between별(TRANSITION)소스 시작~종료이미지:',nowtake_lastframe_data,nexttake_firstframe_data);
                                
                                //let now_lastframe=await Jimp.read(nowtake_lastframe_data);//테이크별 nowlast,nextfirst 프레임이미지url을 다 사용하고 나선 제거한다 ec2
                                //let next_firstframe = await Jimp.read(nexttake_firstframe_data);
                                let now_lastframe;
                                let next_firstframe
                                if(fs.existsSync(nowtake_lastframe_data)){
                                    now_lastframe = await loadImage(nowtake_lastframe_data);
                                }
                                if(fs.existsSync(nexttake_firstframe_data)){
                                    next_firstframe = await loadImage(nexttake_firstframe_data);
                                }
                                
                                console.log('===now lastframess:',now_lastframe);
                                console.log('===>next firstframesss:',next_firstframe);
            
                                //let between_start_s= cv.matFromImageData(now_lastframe.bitmap);
                                //let between_end_s = cv.matFromImageData(next_firstframe.bitmap);//각 사이장면별 betweenstart,end bitmap array형태 console.log 은닉됨.
                                let between_start_s = cv.imread(now_lastframe);
                                let between_end_s = cv.imread(next_firstframe);//사용될 영상 별 사이 관련 이미지>>
                                
                                console.log('===now lastframess:',between_start_s);
                                console.log('===>next firstframesss:',between_end_s);
            
                                let transition=[];
                              
                                transition = adapt_opencv_transition(between_start_s,between_end_s);//처리된 트랜지션 이미지 배열 객체mat배열객체>>
                                between_start_s.delete();between_end_s.delete();
                                console.log('각 between별 트랜지션 처리완료]]]]]]',transition);
            
                                for(let inner=0; inner<transition.length; inner++){
                                    let mat=transition[inner];
                                    let writecanvas = createCanvas(mat.cols,mat.rows);
                                    cv.imshow(writecanvas,mat);
            
                                    let delete_plan_pathlocal=`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`;//각 처리될(이미지처리) 모두 처리가 된 이후 프레임하나별로 모두 s3바로 업로드,삭제 반복한다>>
                                    transitionframes_imgarrays.push(delete_plan_pathlocal);
                                    console.log('write filess:',delete_plan_pathlocal);
                                    fs.writeFile(`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`,writecanvas.toBuffer('image/png'),(err)=>{
                                        if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
                                        console.log('the file has been asaved!!!(EFFECT OPENCV)');
                                        
                                        betweenper_iswritecomplete++;
                                    })
                                   // fs.writeFileSync(`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`,writecanvas.toBuffer('image/png'));
                                }
                            }
                        }
            
                    }catch(error){
                        console.log('OPENCV ERROSSSSRRSSS:',error);
                    }
                    //테이크별 반복문>> 테이크별로 모두 처리가 될시에 이미지처리하고 ec2 > tmp 파일시스템상에 파일을 쓰고 난뒤에 관련
                    //트랜지션 functions endsss===============================>>> 직렬구조이기에 관련 처리끝난것.    
                };  
                
                between_transitionprocess(transition_standby_gatherings);

                let transitioneffect_standby_promise=function(){
                    return new Promise((resolve,reject)=>{
                        let inner_standbycnt=0;
                        let inner_standby = setInterval(function(){
                            if(betweenper_iswritecomplete == (52*(transition_standby_gatherings.length-1))){
                                clearInterval(inner_standby);
                                console.log('트랜지션 프레임 이미지들 전체 준비완료:',betweenper_transitionfiles);
                                
                                resolve(true);
                            }
                            if(inner_standbycnt==2000){
                                clearInterval(inner_standby);

                                reject(new Error('timeout error'));
                            }
                            inner_standbycnt++;
                        },500);
                    });
                }

                let transition_standby_complete = await transitioneffect_standby_promise();
                console.log('transiton standby completess:',betweenper_transitionfiles,edittake_videolist);


                function inner_callback(result,res){
                    console.log('내부 콜백실행>>outputfile path받기::',result);//처리된 파일자체의 경로를 전달주고 이들끼리합친다.
            
                    output_merged_transitions.push(result);//각 병합파일(트랜지션between)별 업로드 성공때마다 그 파일에 대한 pallning정보배열에 넣음.            
                }     
                for(let b=0; b<betweenper_transitionfiles.length; b++){
                    let item=betweenper_transitionfiles[b];

                    ffmpegNode.between_transition_merged_(request_id,item['betweenper_transitionframes_referFormat'],inner_callback,res,b+1);
                }
               
                let final_standby_promise = function(){
                    return new Promise((resolve,reject)=>{
            
                        let standby_cnt=0;
                        let standby = setInterval(function(){
            
                            if(output_merged_transitions.length == edittake_videolist.length-1){
                                console.log('final 대기 종료:',output_merged_transitions);
                                clearInterval(standby);
            
                                console.log('삭제할 생성 트랜지션 framesss:',transitionframes_imgarrays);
                                for(let del=0; del<transitionframes_imgarrays.length; del++){
                                    let del_target=transitionframes_imgarrays[del];
                                    if(fs.existsSync(del_target)){
                                        fs.unlinkSync(del_target);
                                    }
                                }

                                resolve(true);
                            }
                            if(standby_cnt == 2000){
                                clearInterval(standby);
            
                                reject(new Error('timeout error'));
                            }
                            standby_cnt++;
                        },500);
                    });
                }

                let final_standby_complete=await final_standby_promise();
                if(final_standby_complete){
                    console.log('마지막 대기 관련 준비데이터 비디오들:',edittake_videolist,output_merged_transitions);

                    let return_set=await ffmpegNode.originals_and_betweentransition_merged_(request_id,edittake_videolist,output_merged_transitions,res);

                    console.log('return resultsss:',return_set);

                    transition_result_data='./tmp/'+return_set.output;

                }

            }
        }
           
        console.log('==>>트랜지션 처리 비디오 대상체:',transition_result_data);
        
        let transition_video_extract_datas= await ffmpegNode.video_img_extract_total(transition_result_data,request_id);
        console.log('결과!!!:',transition_video_extract_datas);
        
        //filter,overlay이펙트 트랜지션 처리파일에 기반으로 하여 적용>>>
        //n개 올린경우 이 결과의 트랜지션파일(무음성,audio스트림x)에 대해서 30초결과물>> 이펙트 적용(음악에 따른 이펙트적용)+ 마지막에 음악copy
        let overlay_referval;
        switch(music){
            case '1':
                overlay_referval = commonvar.FIREWORKS16;
                select_filter= 'gray';
            break;
            case '2':
                overlay_referval = commonvar.FIREWORKS3;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter= 'canny';
            break;
            case '3':
                overlay_referval = commonvar.LENSFLARE6;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='threshold';
            break;
            case '4':
                overlay_referval = commonvar.LENSFLARE7;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='calcHist';
            break;
            case '5':
                overlay_referval = commonvar.PARTICLES1;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='erosion';
            break;
            case '6':
                overlay_referval = commonvar.PARTICLES3;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='dilation';
            break;
            case '7':
                overlay_referval = commonvar.RAIN16;
            // overlay_referval = commonvar.FIREWORKS16;
                select_filter='morphology';
            break;
            case '108':
                overlay_referval = commonvar.RAIN18;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='canny';
            break;
            case '109':
                overlay_referval = commonvar.SMOKE4;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='erosion';
            break;
            case '110':
                overlay_referval = commonvar.RAIN16;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='threshold';
            break;
            case '111':
                overlay_referval = commonvar.PARTICLES3;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='calcHist';
            break;
            case '112':
                overlay_referval = commonvar.PARTICLES1;
                //overlay_referval = commonvar.FIREWORKS16;
                select_filter='threshold';
            break;
        }   

        effectprocess(transition_video_extract_datas,request_id);
        let is_effect_complete=false;
        async function effectprocess(transition_video_extract_datas,request_id){
            console.log('-====>>effectprocess[[EFFECT PROCESS FUNCTION executesss]]]',transition_video_extract_datas,request_id,transition_video_extract_datas['framefiles_nameformat']);

            //let total_frame_data= data_gathering[`${takeindex}_full_data_plans3`];//s3위치값입니다. 
            let total_frame_data=transition_video_extract_datas[`frame_full_data`];//ec2 tmp위치값입니다. nodejs -> s3 이미지 refer참조시 대량으로 참조하는경우에 경우에 따라서 tls,https,socket관련 이슈가 필연적 발생할수가 있어, 네트웤관련 문제 발생하여 로직구현에 영향을 미침.

            let video_duration = total_frame_data.length / 26;//s값. 실행형태로 넘어온 테이크별 duration값>>>

            //필터 효과 지정될 랜덤구간 inex프레임범위 지정 statarts  filter 1 구간.
            let random_index1 =Math.floor(video_duration*Math.random());
            random_index1 +=1;  
            let random_start1 = random_index1 - 2 < 0?0:random_index1 - 2;
            let random_end1 = random_index1;//6  4~6 5~7  3 1~3 2 0~2 1 -1~1:0~1      
            let take_range_start1 = 26 * (random_start1)+1;
            let take_range_end1 = 26 * (random_end1);

            //필터 효과 지정될 랜덤구간 index프레임범위 지정startss  2효과 구간
            let random_index2 = Math.floor(video_duration*Math.random());
            random_index2 += 1;
            let random_start2 = random_index2 -2 <0?0:random_index2 - 2;
            let random_end2 = random_index2;      
            let take_range_start2 = 26*(random_start2)+1;
            let take_range_end2 = 26*(random_end2);


            console.log('filter1반영구간::',take_range_start1,take_range_end1);
            console.log('filter2반영구간::',take_range_start2,take_range_end2);

            //filter1 adapts...
            console.log('====>filter1 adapt start===========================>');
            for(let t=0; t<total_frame_data.length; t++){
                let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
                console.log('adapt frames omdex',t+1,local_original_frame);
                let result;//프레임별(take) 범위의 forloop 범위의 변수.

                if((take_range_start1 <= t+1 && t+1 <= take_range_end1)){
                    //필터범위, 오버레이 모든 범위에 속하는 중첩의 경우
                    console.log('===>filter1 effect adapt',t+1,take_range_start1,take_range_end1)

                    //let original_frame_source= await Jimp.read(local_original_frame);
                    //let target_src= cv.matFromImageData(original_frame_source.bitmap);//원본 각 프레임이미지

                    if(fs.existsSync(local_original_frame)){
                        let original_frame_source = await loadImage(local_original_frame);//tmp상의 관련 encodingframes요청 소켓사용??
                        let target_src = cv.imread(original_frame_source);//대상  ==>>원본 이미지 정보 매트릭스
                        console.log('original_frames_sroucess!!!:',original_frame_source);
                        console.log('targert_srcc!!!:',target_src)
                        try{
                            switch(select_filter){
                                case 'passThrough' : result = opencvfunctions1.passThrough(target_src); break;
                                case 'gray' : result = opencvfunctions1.gray(target_src); break;
                                case 'hsv': result = opencvfunctions1.hsv(target_src);break;
                                case 'canny':result = opencvfunctions1.canny(target_src); break;
                                case 'inRange': result = opencvfunctions1.inRange(target_src); break;
                                case 'threshold':result = opencvfunctions1.threshold(target_src); break;
                                case 'adaptiveThreshold': result= opencvfunctions1.adaptiveThreshold(target_src); break;
                                case 'gaussianBlur': result= opencvfunctions1.gaussianBlur(target_src); break;
                                //case 'bilateralFilter': result = opencvfunctions1.bilateralFilter(target_src); break;
                                //case 'medianBlur': result= opencvfunctions1.medianBlur(target_src); break;
                                case 'sobel' : result=opencvfunctions1.sobel(target_src); break;
                                case 'scharr': result = opencvfunctions1.scharr(target_src);break;
                                case 'laplacian': result= opencvfunctions1.laplacian(target_src);break;
                                case 'calcHist': result=opencvfunctions1.calcHist(target_src);break;
                                case 'equalizeHist': result=opencvfunctions1.equalizeHist(target_src);break;
                                //case 'backprojection': result=opencvfunctions1.backprojection(target_src);break;
                                case 'erosion':result=opencvfunctions1.erosion(target_src);break;
                                case 'dilation':result=opencvfunctions1.dilation(target_src);break;
                                case 'morphology':result=opencvfunctions1.morphology(target_src);break;
                                case 'contours' : result=opencvfunctions1.contours(target_src);break;
                                default : result =opencvfunctions1.passThrough(target_src);
                            }
                                    
                            let writecanvas = createCanvas(result.cols,result.rows);
                            cv.imshow(writecanvas,result);
                            
                            result.delete();
                            
                            /*fs.writeFile(local_original_frame,writecanvas.toBuffer('image/png'),(err)=>{
                            if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);

                            })*/
                            fs.writeFileSync(local_original_frame,writecanvas.toBuffer("image/png"));           
                        
                        }catch (err) {
                            console.log('CV ERRORSSS:', err);
                        }     
                    }                             
                }
            }
            console.log('====>filter1 adapt end===========================>');
            console.log('====>filter2 adapt startss===========================>');
            for(let t=0; t<total_frame_data.length; t++){
                let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
                console.log('filter2 adapt frames omdex',t+1,local_original_frame);
                let result;//프레임별(take) 범위의 forloop 범위의 변수.

                if((take_range_start2<= t+1 && t+1 <= take_range_end2)){
                    console.log('===>filter2 effect adapt',t+1,take_range_start2,take_range_end2)

                    //let target_src= cv.matFromImageData(original_frame_source.bitmap);//원본 각 프레임이미지
                    if(fs.existsSync(local_original_frame)){
                        let original_frame_source = await loadImage(local_original_frame);//tmp상의 관련 encodingframes요청 소켓사용??
                        let target_src = cv.imread(original_frame_source);//대상  ==>>원본 이미지 정보 매트릭스
                        console.log('original_frames_sroucess!!!:',original_frame_source);
                        try{
                            switch(select_filter){
                                case 'passThrough' : result = opencvfunctions1.passThrough(target_src); break;
                                case 'gray' : result = opencvfunctions1.gray(target_src); break;
                                case 'hsv': result = opencvfunctions1.hsv(target_src);break;
                                case 'canny':result = opencvfunctions1.canny(target_src); break;
                                case 'inRange': result = opencvfunctions1.inRange(target_src); break;
                                case 'threshold':result = opencvfunctions1.threshold(target_src); break;
                                case 'adaptiveThreshold': result= opencvfunctions1.adaptiveThreshold(target_src); break;
                                case 'gaussianBlur': result= opencvfunctions1.gaussianBlur(target_src); break;
                                //case 'bilateralFilter': result = opencvfunctions1.bilateralFilter(target_src); break;
                                //case 'medianBlur': result= opencvfunctions1.medianBlur(target_src); break;
                                case 'sobel' : result=opencvfunctions1.sobel(target_src); break;
                                case 'scharr': result = opencvfunctions1.scharr(target_src);break;
                                case 'laplacian': result= opencvfunctions1.laplacian(target_src);break;
                                case 'calcHist': result=opencvfunctions1.calcHist(target_src);break;
                                case 'equalizeHist': result=opencvfunctions1.equalizeHist(target_src);break;
                                //case 'backprojection': result=opencvfunctions1.backprojection(target_src);break;
                                case 'erosion':result=opencvfunctions1.erosion(target_src);break;
                                case 'dilation':result=opencvfunctions1.dilation(target_src);break;
                                case 'morphology':result=opencvfunctions1.morphology(target_src);break;
                                case 'contours' : result=opencvfunctions1.contours(target_src);break;
                                default : result =opencvfunctions1.passThrough(target_src);
                            }
                                    
                            let writecanvas = createCanvas(result.cols,result.rows);
                            cv.imshow(writecanvas,result);
                            
                            result.delete();
                            
                            /*fs.writeFile(local_original_frame,writecanvas.toBuffer('image/png'),(err)=>{
                                if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);

                            })*/
                            fs.writeFileSync(local_original_frame,writecanvas.toBuffer('image/png'));           
                        
                        }catch (err) {
                            console.log('CV ERRORSSS:', err);
                        }    
                    }
                                              
                }
            }
            console.log('====>filter2 adapt endss===========================>');

            //오버레이 효과 지정될 랜덤구간 index프레임범위 지정startss 3효과 구간
            let random_index3 = Math.floor(video_duration*Math.random());
            random_index3 += 1;
            let random_start3 = random_index3 -1 <0?0:random_index3 - 1;
            let random_end3 = random_index3;      
            let take_range_start3 = 26*(random_start3)+1;
            let take_range_end3= 26*(random_end3);

            let random_index4 = Math.floor(video_duration*Math.random());
            random_index4 += 1;
            let random_start4 = random_index4 -1 <0?0:random_index4 - 1;
            let random_end4 = random_index4;      
            let take_range_start4 = 26*(random_start4)+1;
            let take_range_end4= 26*(random_end4);

            console.log('overlay범위:',random_start3,random_end3,take_range_start3,take_range_end3);
            console.log('overlay2범위:',random_start4,random_end4,take_range_start4,take_range_end4);

            console.log('====>overlay adapt startss===========================>');
            let overlay_index=20;
            for(let t=0; t<total_frame_data.length; t++){
                let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
                console.log('overlay adapt frames omdex',t+1,local_original_frame);

                if((take_range_start3 <= t+1 && t+1 <= take_range_end3)){
                    //오버레이 범위에만 속했던 경우
                    console.log('===>>오버레이 속하는 경우:',t+1,take_range_start3,take_range_end3);
        
                    if(fs.existsSync(local_original_frame)){
                        try{
                            //let original_frame_source= await Jimp.read(local_original_frame);//원본소스
                            let original_frame_source = await loadImage(local_original_frame);
                            let target_src = cv.imread(original_frame_source);
    
                            console.log('original_frame_source:',original_frame_source);
    
                            //오버레이반영
                            let src_overlay=new cv.Mat();
                            console.log('==>읽을 오버레이path:,origilnaframesource path:',local_original_frame,`${overlay_referval}${overlay_index+1}.png`);
                            //let src_overlayimage= await Jimp.read(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 범위 1~52범위 테이크별 관련 대상체를 remote읽는다.
                            let src_overlayimage = await loadImage(`${overlay_referval}${overlay_index+1}.png`);
                            //src_overlay = cv.matFromImageData(src_overlayimage.bitmap);//오버레이 대상 이미지의 metrix데이터입니다.
                            src_overlay = cv.imread(src_overlayimage);
    
                            let overlay_dst= new cv.Mat();
            
                            cv.addWeighted(target_src,1,src_overlay,0.72,0.0,overlay_dst,-1);//overlay_dst에 관련 메트릭스 효과 반영되며 이를 파일로 저장필요. 한개 오버레이이펙트효과
    
                            let writecanvas = createCanvas(overlay_dst.cols,overlay_dst.rows);
                            cv.imshow(writecanvas,overlay_dst);
    
                            target_src.delete();src_overlay.delete(); overlay_dst.delete();
                                
                            overlay_index++;
    
                            /*fs.writeFile(local_original_frame,writecanvas.toBuffer('image/png'),(err)=>{
                                if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
    
                            });*/
                            fs.writeFileSync(local_original_frame,writecanvas.toBuffer('image/png'));
                    
                        }catch (err) {
                            console.log('OPENCV ERORSSS TM CCVVVSS:',err);
                        }  
                    }                         
                }
            }
            overlay_index=35;
            for(let t=0; t<total_frame_data.length; t++){
                let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
                console.log('overlay adapt frames omdex',t+1,local_original_frame);

                if((take_range_start4 <= t+1 && t+1 <= take_range_end4)){
                    //오버레이 범위에만 속했던 경우
                    console.log('===>>오버레이 속하는 경우:',t+1,take_range_start4,take_range_end4);
        
                    if(fs.existsSync(local_original_frame)){
                        try{
                            //let original_frame_source= await Jimp.read(local_original_frame);//원본소스
                            let original_frame_source = await loadImage(local_original_frame);
                            let target_src = cv.imread(original_frame_source);
    
                            console.log('original_frame_source:',original_frame_source);
    
                            //오버레이반영
                            let src_overlay=new cv.Mat();
                            console.log('==>읽을 오버레이path:,origilnaframesource path:',local_original_frame,`${overlay_referval}${overlay_index+1}.png`);
                            //let src_overlayimage= await Jimp.read(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 범위 1~52범위 테이크별 관련 대상체를 remote읽는다.
                            let src_overlayimage = await loadImage(`${overlay_referval}${overlay_index+1}.png`);
                            //src_overlay = cv.matFromImageData(src_overlayimage.bitmap);//오버레이 대상 이미지의 metrix데이터입니다.
                            src_overlay = cv.imread(src_overlayimage);
    
                            let overlay_dst= new cv.Mat();
            
                            cv.addWeighted(target_src,1,src_overlay,0.72,0.0,overlay_dst,-1);//overlay_dst에 관련 메트릭스 효과 반영되며 이를 파일로 저장필요. 한개 오버레이이펙트효과
    
                            let writecanvas = createCanvas(overlay_dst.cols,overlay_dst.rows);
                            cv.imshow(writecanvas,overlay_dst);
    
                            target_src.delete();src_overlay.delete(); overlay_dst.delete();
                                
                            overlay_index++;
    
                            /*fs.writeFile(local_original_frame,writecanvas.toBuffer('image/png'),(err)=>{
                                if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
    
                            });*/
                            fs.writeFileSync(local_original_frame,writecanvas.toBuffer('image/png'));
                    
                        }catch (err) {
                            console.log('OPENCV ERORSSS TM CCVVVSS:',err);
                        }     
                    }                     
                }
            }
            console.log('====>overlay adapt endss===========================>');        

            is_effect_complete=true;
        }

        let final_standby = function(transition_video_extract_datas){
            return new Promise((resolve,reject)=>{

                let final_standbycnt=0;
                let final_standby = setInterval(async function(){
                    if(is_effect_complete == true){
                        console.log('트랜지션처리>>이펙트,필터 처리 모두완료}}>>>>');
                        console.log('transition_video_extract_datas',transition_video_extract_datas);

                        clearInterval(final_standby);

                        let result= await ffmpegNode.video_frames_merged(request_id,transition_video_extract_datas);
                        
                        console.log('====+>>최종 비디오 출력파일::]]]]',result);

                        resolve(result);
                    }

                    if(final_standbycnt == 400){
                        clearInterval(final_standby);
                        reject(false);
                    }

                    final_standbycnt++;
                },1200);             
            });
        }
        let final_result=await final_standby(transition_video_extract_datas);
        console.log('final reusltss;]]]]]:',final_result);

        console.log('=====>>최종 파일 출력(오디오병합mix):',request_id);
        let music_select;
        switch(music){
            case '1':
                music_select = commonvar.MUSIC1;
            break;
            case '2':
                //overlay_referval = commonvar.FIREWORKS3;
                music_select = commonvar.MUSIC2;
            break;
            case '3':
                //overlay_referval = commonvar.LENSFLARE6;
                music_select = commonvar.MUSIC3;
            break;
            case '4':
                //overlay_referval = commonvar.LENSFLARE7;
                music_select = commonvar.MUSIC4;
            break;
            case '5':
                //overlay_referval = commonvar.PARTICLES1;
                music_select = commonvar.MUSIC5;
            break;
            case '6':
                //overlay_referval = commonvar.PARTICLES3;
                music_select = commonvar.MUSIC6;
            break;
            case '7':
                //overlay_referval = commonvar.RAIN16;
                music_select = commonvar.MUSIC7;
            break;
            case '108':
                //overlay_referval = commonvar.RAIN18;
                music_select = commonvar.MUSIC8;
            break;
            case '109':
                //overlay_referval = commonvar.SMOKE4;
                music_select = commonvar.MUSIC9;
            break;
            case '110':
                //overlay_referval = commonvar.SMOKE6;
                music_select = commonvar.MUSIC10;
            break;
            case '111':
                //overlay_referval = commonvar.SMOKE6;
                music_select = commonvar.MUSIC11;
            break;
            case '112':
                //overlay_referval = commonvar.SMOKE6;
                music_select = commonvar.MUSIC12;
            break;
        }

        if(final_result !=''){
            console.log('반영 병합 최종파일 response returnsss:',final_result);

            let s3_parameters=s3.uploadParams;
            
            s3_parameters.Key=`clllap/${final_result}`;
            s3_parameters.Body = fs.createReadStream('./tmp/'+final_result);

            console.log('s3 paramterss refer spacess:',s3_parameters);
            let s3_client=s3.s3client;

            s3_client.upload(s3_parameters,async (err,data)=>{
                if(err){
                    console.log('what errosss:',err);
                    return false;
                }
                console.log('s3 final전달 파일 여부 성공여부:',data);

                let result=await ffmpegNode.mergedAudio(final_result,music_select,request_id);
                console.log("==>> 영상 오디오 처리완료...>>:",result);

                let s3_parameters=s3.uploadParams;

                s3_parameters.Key=`clllap/${result[0]}`;
                s3_parameters.Body = fs.createReadStream(`./tmp/${result[0]}`);

                console.log('s3 paramterss refer spacess:',s3_parameters);
    
                s3_client.upload(s3_parameters,(err,data)=>{
                    if(err){
                        console.log('what errosss:',err);
                        
                        return res.status(403).json({success:false,message:'server ERROR'});
                    }
                    console.log('s3 final전달 파일 여부 성공여부(AUDIO MIX):',data);
                    
                    //fs.unlink(`./tmp/${outputfile_name}`,(err=>{ if(err)console.log('Error:',err);}));//해당 위치에 대상체 삭제한다.

                    console.log('=======================>transition and effect process requetsss FINAL RETURN ===============');

                    //video_result:순수 비디오스트림output, video_result_final:비디오스트림+오디오스트림 최종출력물 s3path리턴합니다.
                    return res.json({success:true,video_result:`${s3_origin_dns}clllap/${result[1]}`,video_result_final:`${s3_origin_dns}clllap/${result[0]}`});
                });
            });

        }else{
            return res.status(403).json({success:false, message:'server ERROR'});
        }
 
        console.log('=======================>transition and effect process requetsss ENDLINES===============');

    }

});//media Process api functions ends===============================












//======================================================================================================
//======================================================================================
//deprecated dummyss apis......... 사용되지 않을 api 

//이펙트처리(opencv,ffmpeg)처리 위한 초기 테이크비디오별 전체프레임데이터 추출 api
//USE FUNCTION CUSTOM 2 : 이펙트처리위한 기본 프레임데이터 준비 API / 내부 콜백함수 API자체에서 결과리턴. 이걸 추후에 호출하는 형태로 좀 순서를 로직순서를 바꾼다.
function transition_and_effect_start(upload_list,take_video_process_infoparam,res){

    return new Promise(async(resolve,reject)=>{
        console.log('===>PRMIJSE TRANSITTON END EFFECT START EXEUCTEUSS');
        let request_id=makeid(20);//해당 요청 transitoion effect start관련 requestid지정한다>

        let upload_lists= upload_list;//업로드한 리스트
        upload_lists = upload_list.split(',');

        console.log('upload_list whatsss:',upload_list);

        let take_video_process_infos;

        if(upload_lists.length==1){
            console.log('uploadlssgss:',upload_lists[0]);

            //upload_lists = await single_uploadvideo_twosplit_process(upload_lists[0]);//대상 타깃 s3 url한개를 보내고, 그 대상을 두개 미디어로 쪼갠 결과 리턴.
        
           // console.log('반환되어진 upload_listss:one->two split videos',upload_lists);
            
            //takevideoprocessinfo의 경우 두개쪼개진 비디도의 전체 프레임으로 쪼갠다. 0~duration길이만큼 전체구간 프레임으로 쪼갠다.
            //쪼개진 front,back부분 비디오 정보 조회합니다.
            
            function inner_promise_mediaInfoGet(upload_list){
                return new Promise((resolve,reject)=>{
                    console.log('===미디어 정보 조회 프로미스호출>>>');

                    let isstandbycomplete=[];
                    let take_video_process_info=[];

                    fluent_ffmpeg.ffprobe(upload_list[0],function(err,metadata){
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
            
                            original_duration = parseInt(metadata.format.duration); //대상 split영상 길이값.  
                            take_video_process_info[0]={};
                            take_video_process_info[0]['startpos'] = 0;
                            take_video_process_info[0]['endpos'] = 0 + original_duration;
                            take_video_process_info[0]['duration'] = original_duration;//각 1테이크별 전체 구간0~duration길이값(프로그램 지정값)
                            
                            isstandbycomplete.push(1);
                        }
                    });
                    /*fluent_ffmpeg.ffprobe(upload_list[1],function(err,metadata){
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
            
                            original_duration = parseInt(metadata.format.duration); //대상 split영상 길이값.      
                            take_video_process_info[1]={};  
                            take_video_process_info[1]['startpos'] = 0;
                            take_video_process_info[1]['endpos'] = 0 + original_duration;
                            take_video_process_info[1]['duration'] = original_duration;//각 2테이크별 전체 구간0~duration길이값(프로그램 지정값)
                            
                            isstandbycomplete.push(1);
                        }
                    });*/
                    let inner_standbycnt=0;
                    let inner_standby = setInterval(function(){

                        if(isstandbycomplete[0]==1 /*&& isstandbycomplete[1]==1*/){
                            clearInterval(inner_standby);
                            console.log('===>프로미스 익명함수 내부 대기 함수 리턴resolvess:',take_video_process_info);
                            resolve(take_video_process_info);
                        }
                        if(inner_standbycnt == 3000){
                            clearInterval(inner_standby);
                            reject(new Error("promise timeout Erorr"));
                        }
                        inner_standbycnt++;
                    },150);
                });
            }
            take_video_process_infos = await inner_promise_mediaInfoGet(upload_lists);

        }else{
            take_video_process_infos = take_video_process_infoparam;//테이크별 편집처리정보>>json배열객채-)>배열로 변환
            take_video_process_infos= JSON.parse(take_video_process_infos);
            console.log('take_vieo_process_infosss:',take_video_process_infos);//클라이언트에서 넘어온 정보> 편집한 테이크별 구간 위치값.
            
        }

        console.log('====>>>USESSS  takevieo processinfo:',take_video_process_infos);

        //s3 upload관련
        let s3_client= s3.s3client;
        let bucket_params={
            Bucket:'clllap',
            Key:'clllap',
            Body:null,
            ACL:'public-read'
        };
        console.log('=>>s3_client.upload ',s3,s3_client.upload);
    
        let takeper_datagathering=[];
        //테이크별 비디오프레임 분할하여 얻어진 데이터를 전달해주는 origin시작 함수>>
        //let planned_delete_list=[];

        function extract_file_callback(data_gathering,res,request_id,takeindex){
            //해당 함수는 테이크별 편집구간 전체프레임에서 랜덤한 1개씩의 구간에 필터,오버레이효과 반영합니다.(opencv.wasm)
            console.log('[[[FFMPEG VIEO_IMNG_EXTRACT FUNCTIONS CALLBACK]]:: resultss send results:',data_gathering,request_id,takeindex);//요청>takeindex>gatheringdata등 정보 관련처리>>

            let full_data= data_gathering[`${takeindex}_full_data`];
            let full_data_upload = data_gathering[`${takeindex}_full_data_upload`];
            let start_data= data_gathering[`${takeindex}_start_data`];
            let end_data = data_gathering[`${takeindex}_end_data`];

           // let async_count=0; let cond_count=full_data.length + 1 +1;

            takeper_datagathering.push(data_gathering);

        }
        
        //origin_request >> 테이크별 편집구간 프레임전체분할 및 관련 데이터 준비 요청>>
        console.log('adapt upload listsss:',upload_lists);
        for(let s=0; s<upload_lists.length; s++){
            console.log('업로드 비디오 및 테이크별 편집처리정보:',upload_lists[s],take_video_process_infos[s]);
            let upload_target=upload_lists[s];
            let take_video_process_info_target=take_video_process_infos[s];
            let takeindex= s+1;//1,2,3,4...
            let result = await ffmpegNode.video_img_extract(takeindex,upload_target,extract_file_callback,res,request_id,take_video_process_info_target);
        }

        //api 추출결과 리턴 클라이언트 리턴 이부분까지만 부분 끊어서 처리>>
        let standbying_cnt=0;
        let standbying = setInterval(function(){
            //console.log('===>>클라이언트 리턴 관련 대기:::]]]',upload_list.length, takeper_datagathering.length)
            if(upload_lists.length == takeper_datagathering.length){
                console.log('===>테이크별 추출 관련 정보(s3 업로드 로직) 리턴 및 과부하방지: 한번에 할시에 과부하정도와 버그 정도는 그만큼 비례해서 커짐. 사용자 많아질수록 감당이 안됨.');
                clearInterval(standbying);

                //file_delete_callback();
                console.log('==================================transition_and_effect_start END! functions===================================');
                //return res.json({success:true, data_gathering: takeper_datagathering, request_id:request_id});
                resolve({success:true, data_gathering:takeper_datagathering, request_id:request_id});
            }

            if(standbying_cnt == 2000){
                clearInterval(standbying);
                // return res.status(403).json({success:false,message:'server timeout error'});
                reject(new Error("promise timeout error"));
            }
            standbying_cnt++;
        },300);
        console.log('==================================transition_and_effect_start END LINE functions===================================');
    });
}

//not usedss.. referense use
app.post('/api/uploadlist_transitionAdapt',(req,res,next)=>{
    //let uploadfile=req.files;//다중 파일들..>> n개의 비디오파일들..>>
    let uploadfile= req.body.upload_list_data.split(',');
    console.log('upload post requestss:',uploadfile);

    let upload_files=[];let async_call_count=0;
    upload_files=uploadfile;
    //let musicfile=req.files.music;
    //let musicfilename=makeid(20) + musicfile.name;

    /*musicfile.mv(`${musicdir}${musicfilename}`,function(err){
        console.log('음원파일 단일한개 업로드 처리>>');
        if(err){
            console.log('one errrosss:',err);
        }
    });*/

    //let upload_cnt=Object.keys(uploadfile).length;
    let upload_cnt=uploadfile.length;

    let request_id= makeid(20);

    let data_gatheringss=[];
    function extract_file_callback(data_gathering,res,request_id,takeindex){
        //해당 함수는 테이크별 편집구간 전체프레임에서 랜덤한 1개씩의 구간에 필터,오버레이효과 반영합니다.(opencv.wasm)
        console.log('[[[FFMPEG VIEO_IMNG_EXTRACT FUNCTIONS CALLBACK]]:: resultss send results:',data_gathering,request_id,takeindex);//요청>takeindex>gatheringdata등 정보 관련처리>>

        let full_data= data_gathering[`${takeindex}_full_data`];
        let full_data_upload = data_gathering[`${takeindex}_full_data_upload`];
        let start_data= data_gathering[`${takeindex}_start_data`];
        let end_data = data_gathering[`${takeindex}_end_data`];

        data_gatheringss.push(data_gathering);
        //n번 호출되며 테이크별로 분할하는것 과정자체는 병렬처리형태임>>처리된결과데이터마다 저장한다.

        for(let del=0; del<data_gathering[`${takeindex}_full_data`].length; del++){
            let del_target=data_gathering[`${takeindex}_full_data`][del];
            console.log('del targetss;',del_target);
            if(fs.existsSync(del_target)){
                fs.unlinkSync(del_target);
            }
        }
    }
    
    let promise_standby = function(){
        return new Promise((resolve,reject)=>{

            let inner_standbycnt=0;
            let inner_standby=setInterval(function(){

                if(data_gatheringss.length == upload_cnt){
                    clearInterval(inner_standby);
                    resolve('ok');
                }
                if(inner_standbycnt == 1500){
                    clearInterval(inner_standby);
                    reject(new Error('reponse timeout error'));
                }
                inner_standbycnt++;
            },200);
        });
    }
    let standbycnt=0;
    let standby = setInterval(function(){
        if(true){
            clearInterval(standby);

            console.log('업로드 대상 모두 업로드완료:',upload_files);

            for(let j=0; j<upload_files.length; j++){
                //test1,test2순서라고 가정한다. 그 순서라고 한다고 할시에 정보.
              
                let result= ffmpegNode.video_img_extract_total(j+1,upload_files[j],extract_file_callback,res,request_id);
            }

            (async function(){
                let result = await promise_standby();
                console.log('return resultss:',result);

                if(result=='ok'){
                    console.log('datagatheringss:',data_gatheringss);

                    data_gatheringss.sort(function(a,b){
                        return a.takeindex - b.takeindex;
                    });
                    console.log('==>정렬후의 data_gatheringss',data_gatheringss);

                    between_transitionprocess();

                    let transition_standby_complete=await transitioneffect_standby_promise();
                    console.log('transition_standby_complete::',betweenper_transitionfiles,transition_standby_complete,upload_files);//대기합니다!

                    for(let b=0; b<betweenper_transitionfiles.length; b++){
                        let item=betweenper_transitionfiles[b];

                        ffmpegNode.between_transition_merged_(request_id,item['betweenper_transitionframes_referFormat'],inner_callback,res,b+1);
                    }

                    let final_standby_complete=await final_standby_promise();
                    if(final_standby_complete){

                        console.log('마지막 대기 관련 준비데이터 비디오들:',upload_files,output_merged_transitions);

                        let return_set=await ffmpegNode.originals_and_betweentransition_merged_(request_id,upload_files,output_merged_transitions,res);

                        console.log('return resultsss:',return_set);

                        return res.json({success:true, data: return_set.output});
                    }
                }
            })();

        }
        if(standbycnt==1500){
            clearInterval(standby);
        }
        standbycnt++;
    },200);

    let transitioneffect_standby_promise = function(){
        return new Promise((resolve,reject)=>{

            let inner_standbycnt=0;
            let inner_standby= setInterval(function(){

                if(betweenper_iswritecomplete == (52*(data_gatheringss.length -1))){
                    clearInterval(inner_standby);
                    console.log('트랜지션프레임 이미지들 전체 준비완료:',betweenper_transitionfiles);

                    resolve('complete');
                }
                if(inner_standbycnt==2000){
                    clearInterval(inner_standby);

                    reject(new Error('erros returns'));
                }
                inner_standbycnt++;
            },500);
        });
    }
    let betweenper_transitionfiles=[];
    let betweenper_iswritecomplete=0;

    async function between_transitionprocess(){
        //트랜지션 functions start============================================>>>>
        //장면별 트랜지션 처리>>직렬구조 반복문기반  인댁스값이 upload_list.length-1 이면 마지막 테이크정보라는것이고 이때는 다음take정보가 없기에 무시.
        //이 연산을 통해 생성될 각 테이크별 요청별 테이크별 사이트랜지션 frame들 새로 write되는것들이고 이들을 기억해둔다. 이 리스트들을 추후에 삭제하면서 s3로 전송해야할것임>>
        //let takeper_between_transitionframes_planwrite=[];//이들은 추후에 삭제되어야함.>>전체 모인후에 바로 s3로 업로드되면서 삭제되어야함.
        try{
            for(let t=0; t<data_gatheringss.length; t++){
                //let takeindex= takeper_startendframe_data[t]['takeindex'];
                if(t != data_gatheringss.length-1){
                    let temp_store={};
                    
                    temp_store['betweenindex'] = t+1;//between1,2,3,..이런식저장.
                    temp_store['betweenper_transitionframes']=[];
                    temp_store['betweenper_transitionframes_referFormat'] = `${request_id}_between${t+1}_transitionframe`;//reqid_between1,2,3_transitionframe%d.png형태로 betwen별 참조를 위한 자료구조>>
                    betweenper_transitionfiles.push(temp_store);

                    //마지막 인댁스take가 아닌경우에만 관련 하여 저장처리>>
                    let nowtake_lastframe_data= data_gatheringss[t][`${t+1}_end_data`];//0:1_end_data,1:2_start_data / 2:3_end_data,3:4_start_data 
                    let nexttake_firstframe_data = data_gatheringss[t+1][`${t+1+1}_start_data`];
                    console.log('현재 take index및 관련하여 생성되는 프레임장면between periods:[[TRANSIJTION EFFECT]]',nowtake_lastframe_data, nexttake_firstframe_data);//now~next씩 하여 uploadcnt-1의 장면들 생성된다.
                    console.log('between별(TRANSITION)소스 시작~종료이미지:',nowtake_lastframe_data,nexttake_firstframe_data);
                    
                    //트랜지션 처리관련
                    let alpha=1;let beta;
                    
                    //let now_lastframe=await Jimp.read(nowtake_lastframe_data);//테이크별 nowlast,nextfirst 프레임이미지url을 다 사용하고 나선 제거한다 ec2
                    //let next_firstframe = await Jimp.read(nexttake_firstframe_data);
                    let now_lastframe = await loadImage('./tmp/'+nowtake_lastframe_data);
                    let next_firstframe = await loadImage('./tmp/'+nexttake_firstframe_data);
                    
                    console.log('===now lastframess:',now_lastframe);
                    console.log('===>next firstframesss:',next_firstframe);

                    //let between_start_s= cv.matFromImageData(now_lastframe.bitmap);
                    //let between_end_s = cv.matFromImageData(next_firstframe.bitmap);//각 사이장면별 betweenstart,end bitmap array형태 console.log 은닉됨.
                    let between_start_s = cv.imread(now_lastframe);
                    let between_end_s = cv.imread(next_firstframe);//사용될 영상 별 사이 관련 이미지>>
                    
                    console.log('===now lastframess:',between_start_s);
                    console.log('===>next firstframesss:',between_end_s);

                    let transition=[];
                    transition = transition_cut_(between_start_s,between_end_s);//처리된 트랜지션 이미지 배열 객체mat배열객체>>
                    between_start_s.delete();between_end_s.delete();
                    console.log('각 between별 트랜지션 처리완료]]]]]]',transition);

                    for(let inner=0; inner<transition.length; inner++){
                        let mat=transition[inner];
                        let writecanvas = createCanvas(mat.cols,mat.rows);
                        cv.imshow(writecanvas,mat);

                        let delete_plan_pathlocal=`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`;//각 처리될(이미지처리) 모두 처리가 된 이후 프레임하나별로 모두 s3바로 업로드,삭제 반복한다>>
                        console.log('write filess:',delete_plan_pathlocal);
                        fs.writeFile(`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`,writecanvas.toBuffer('image/png'),(err)=>{
                            if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
                            console.log('the file has been asaved!!!(EFFECT OPENCV)');
                            
                            betweenper_iswritecomplete++;
                         })
                    }
                }
            }

        }catch(error){
            console.log('OPENCV ERROSSSSRRSSS:',error);
        }
        //테이크별 반복문>> 테이크별로 모두 처리가 될시에 이미지처리하고 ec2 > tmp 파일시스템상에 파일을 쓰고 난뒤에 관련
        //트랜지션 functions endsss===============================>>> 직렬구조이기에 관련 처리끝난것.    
    };  

    let output_merged_transitions=[];
    function inner_callback(result,res){
        console.log('내부 콜백실행>>outputfile path받기::',result);//처리된 파일자체의 경로를 전달주고 이들끼리합친다.

        output_merged_transitions.push(result);//각 병합파일(트랜지션between)별 업로드 성공때마다 그 파일에 대한 pallning정보배열에 넣음.            
    }

    let final_standby_promise = function(){
        return new Promise((resolve,reject)=>{

            let standby_cnt=0;
            let standby = setInterval(function(){

                if(output_merged_transitions.length == upload_files.length-1){
                    console.log('final 대기 종료:',output_merged_transitions);
                    clearInterval(standby);

                    resolve(true);
                }
                if(standby_cnt == 2000){
                    clearInterval(standby);

                    reject(new Error('timeout error'));
                }
                standby_cnt++;
            },500);
        });
    }
});



//use api3 callback1(order1) callback function
function effect_transition_sources_ffmpegAfterProcess(request_id,takeper_processframes,betweenper_transitionframes_data,res,music){

    console.log('ffmpeg처리 globe함수실행 이펙트,트랜지션소스등 후 처리진행>>:',request_id,takeper_processframes,betweenper_transitionframes_data);

    let takeper_uploadcnt=takeper_processframes.length;
    let betweenper_betweencnt=betweenper_transitionframes_data.length;

    let output_merged_transitions=[];
    let output_effect_videotakes=[];

    let s3_client= s3.s3client;
    let bucket_params={
        Bucket:'clllap',
        Key:'clllap',
        Body:null,
        ACL:'public-read'
    };

    function inner_callback(result,res){
        console.log('===>내부 콜백실행>>outputfile path받기:',result);

        try{
            bucket_params.Body=result.buffer_data;
            bucket_params.Key=`clllap/${result.outputpath}`;

            s3_client.upload(bucket_params,function(err,data){
                if(err){
                    return res.status(403).json({success:false,message:`server error ${err}`});
                }
                console.log('====>file ouploda stream or make ufferdaa base filemake upload succfeusll:',data);

                output_merged_transitions.push(result);//버퍼 쓰여진 output pipe데이터s3업로드 완료시마다 준비완료count+

            });
        }catch(err){
            console.log('buffer careate datae s3upload errosr:',err);
        }
    }
    function inner_callback2(result,res){
        console.log('===>내부콜백실행2> outputfile path받기 관련:',result);

        try{
            bucket_params.Body=result.buffer_data;
            bucket_params.Key=`clllap/${result.outputpath}`;

            s3_client.upload(bucket_params,function(err,data){
                if(err){
                    return res.status(403).json({success:false,message:`server error ${err}`});
                }
                console.log('=-===>>file oupload streamor make upfferdata base filemake upload sucefull:',data);

                output_effect_videotakes.push(result);
            })
        }catch(err){
            console.log('buffer careate datae s3upload errosr:',err);
        }
    }
    for(let s=0; s<betweenper_betweencnt; s++){
        console.log('===>>between당 관련 정보',betweenper_transitionframes_data[s]['betweenper_transitionframes_referFormat']);
        ffmpegNode.between_transition_merged(request_id,betweenper_transitionframes_data[s]['betweenper_transitionframes_referFormat'],inner_callback,res,betweenper_transitionframes_data[s]['betweenindex']);
    }

    for(let s=0; s<takeper_uploadcnt; s++){
        console.log('=======>>takeper당 관련 정보::',takeper_processframes[s]['planned_processframes_data_referFormat']);
        ffmpegNode.videotake_effect_merged(request_id,takeper_processframes[s]['planned_processframes_data_referFormat'],inner_callback2,res,26,takeper_processframes[s]['takeindex']);
    }

    let standby_cnt=0;
    let standby=setInterval(function(){
        if(output_merged_transitions.length == betweenper_betweencnt && output_effect_videotakes.length == takeper_uploadcnt){
            console.log('inner stnady output erqeust iflescompletds!!!!![[[모든 합병파일 준비완료]]]]:',output_merged_transitions, output_effect_videotakes);

            clearInterval(standby);

            ffmpegNode.originals_and_betweentransition_merged(request_id,output_effect_videotakes,output_merged_transitions,opencv_transition_response,res,takeper_processframes,betweenper_transitionframes_data,music);
        }

        if(standby_cnt==3000){
            clearInterval(standby);

            return res.status(403).json({success:false,message:'server timeout error'});
        }
        standby_cnt++;
    },500)
}



//use api3 execute callback2 콜백2함수 테이크별 합쳐진 ffmpeg합쳐진 영상들 output video영상 최종적 결과에 대한 리턴 및 후처리
function opencv_transition_response(outputfile,buffer_data_final,res,delete_planning_s3upload_total_frames,delete_planning_s3upload_total_frames2,music,request_id){
   
    console.log('=====>>최종 파일 출력(오디오병합mix):',request_id);
    let music_select;
    switch(music){
        case '1':
            music_select = commonvar.MUSIC1;
        break;
        case '2':
            //overlay_referval = commonvar.FIREWORKS3;
            music_select = commonvar.MUSIC2;
        break;
        case '3':
            //overlay_referval = commonvar.LENSFLARE6;
            music_select = commonvar.MUSIC3;
        break;
        case '4':
            //overlay_referval = commonvar.LENSFLARE7;
            music_select = commonvar.MUSIC4;
        break;
        case '5':
            //overlay_referval = commonvar.PARTICLES1;
            music_select = commonvar.MUSIC5;
        break;
        case '6':
            //overlay_referval = commonvar.PARTICLES3;
            music_select = commonvar.MUSIC6;
        break;
        case '7':
            //overlay_referval = commonvar.RAIN16;
            music_select = commonvar.MUSIC7;
        break;
        case '108':
            //overlay_referval = commonvar.RAIN18;
            music_select = commonvar.MUSIC8;
        break;
        case '109':
            //overlay_referval = commonvar.SMOKE4;
            music_select = commonvar.MUSIC9;
        break;
        case '110':
            //overlay_referval = commonvar.SMOKE6;
            music_select = commonvar.MUSIC10;
        break;
        case '111':
            //overlay_referval = commonvar.SMOKE6;
            music_select = commonvar.MUSIC11;
        break;
        case '112':
            //overlay_referval = commonvar.SMOKE6;
            music_select = commonvar.MUSIC12;
        break;
    }

    if(outputfile !=''){
        console.log('트랜지션 반영 병합 최종파일 response returnsss:',outputfile,buffer_data_final);
        console.log('트랜지션 병합한것 s3최종처리후에 발생한 s3모든 tmp,png대상파일들 모두 삭제!:',delete_planning_s3upload_total_frames,delete_planning_s3upload_total_frames2);

        let planned_delete_framedata=[];
        for(let s=0; s<delete_planning_s3upload_total_frames.length; s++){
            let item= delete_planning_s3upload_total_frames[s];
            for(let j=0; j<item['planned_processframes_data'].length; j++){
                planned_delete_framedata.push(item['planned_processframes_data'][j]);
            }
        }
        let planned_delete_framedata2=[];
        for(let s=0; s<delete_planning_s3upload_total_frames2.length; s++){
            let item= delete_planning_s3upload_total_frames2[s];
            for(let j=0; j<item['betweenper_transitionframes'].length; j++){
                planned_delete_framedata2.push(item['betweenper_transitionframes'][j]);
            }
        }

        let s3_parameters=s3.uploadParams;
        let s3_client=s3.s3client;

        s3_parameters.Key=`clllap/${outputfile}`;
        s3_parameters.Body = buffer_data_final;

        console.log('s3 paramterss refer spacess:',s3_parameters);

        s3_client.upload(s3_parameters,(err,data)=>{
            if(err){
                console.log('what errosss:',err);
                return false;
            }
            console.log('s3 final전달 파일 여부 성공여부:',data);

            let s3_delete_parameters={Bucket:'clllap',Key:'clllap'};
            for(let del=0; del<planned_delete_framedata.length; del++){
                let del_key_target=planned_delete_framedata[del];
                console.log('===>>처리후 삭제 후처리:',del_key_target);
                s3_delete_parameters['Key'] = del_key_target;

                s3_client.deleteObject(s3_delete_parameters,function(err,data){
                    if(err) console.log(err,err.stack);
                    else console.log('deletesss!!!:',data);
                });
            }
            for(let del=0; del<planned_delete_framedata2.length; del++){
                let del_key_target=planned_delete_framedata2[del];
                console.log('===>>처리후 삭제 후처리:',del_key_target);
                s3_delete_parameters['Key'] = del_key_target;

                s3_client.deleteObject(s3_delete_parameters,function(err,data){
                    if(err) console.log(err,err.stack);
                    else console.log('deletesss!!!:',data);
                });
            }
            ffmpegNode.mergedAudio(outputfile,music_select,request_id,inner_callback);
        });

        function inner_callback(outputfile_name,outputvideo){
            console.log('====>[[FINAL]]]]] inner 콜백함수 호출::',outputfile_name,outputvideo);

            let s3_parameters=s3.uploadParams;
            let s3_client=s3.s3client;

            s3_parameters.Key=`clllap/${outputfile_name}`;
            s3_parameters.Body = fs.createReadStream(`./tmp/${outputfile_name}`);

            console.log('s3 paramterss refer spacess:',s3_parameters);
 
            s3_client.upload(s3_parameters,(err,data)=>{
                if(err){
                    console.log('what errosss:',err);
                    
                    return res.status(403).json({success:false,message:'server ERROR'});
                }
                console.log('s3 final전달 파일 여부 성공여부(AUDIO MIX):',data);
                
                fs.unlink(`./tmp/${outputfile_name}`,(err=>{ if(err)console.log('Error:',err);}));//해당 위치에 대상체 삭제한다.

                console.log('=======================>transition and effect process requetsss FINAL RETURN ===============');

                //video_result:순수 비디오스트림output, video_result_final:비디오스트림+오디오스트림 최종출력물 s3path리턴합니다.
                return res.json({success:true,video_result:`${s3_origin_dns}clllap/${outputvideo}`,video_result_final:`${s3_origin_dns}clllap/${outputfile_name}`});
            });
        }
    }else{
        return res.status(403).json({success:false, message:'server ERROR'});
    }
}

app.post('/api/transition_and_effect_process',async(req,res)=>{
    console.log('=======================>transition and effect process requetsss START===============');//데이터를 넘겨옵니다.

    console.log('req.bodyss:',req.body,req.body.upload_list_data,req.body.take_video_process_info);

    let select_overlay= req.body.select_overlay;
    let select_filter =req.body.select_filter;
    let music = req.body.music; 

    let return_set=await transition_and_effect_start(req.body.upload_list_data,req.body.take_video_process_info,res);
    console.log('return out set return setsss:',return_set);

    let data_gathering= return_set.data_gathering;//테이크별 관련정보 넘깁니다. 
    //let select_overlay=req.body.select_overlay;//선택한 오버레이>>값에 따른 
    //let select_filter=req.body.select_filter;//선택한 일단 필터값에 따른.
    let request_id=return_set.request_id;

    //select_overlay = '1';
    //select_filter = 'hsv';
    
    console.log('data_gatheringss:',data_gathering,request_id);//어떤 요청id가 어떤 데이터들처리된것에 대해서 요청하여 처리시작하는건지??
    //data_gathering= JSON.parse(data_gathering);

    let overlay_referval;
    switch(music){
        case '1':
            overlay_referval = commonvar.FIREWORKS16;
            select_filter= 'gray';
        break;
        case '2':
            overlay_referval = commonvar.FIREWORKS3;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter= 'canny';
        break;
        case '3':
            overlay_referval = commonvar.LENSFLARE6;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='threshold';
        break;
        case '4':
            overlay_referval = commonvar.LENSFLARE7;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='calcHist';
        break;
        case '5':
            overlay_referval = commonvar.PARTICLES1;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='erosion';
        break;
        case '6':
            overlay_referval = commonvar.PARTICLES3;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='dilation';
        break;
        case '7':
            overlay_referval = commonvar.RAIN16;
           // overlay_referval = commonvar.FIREWORKS16;
            select_filter='morphology';
        break;
        case '108':
            overlay_referval = commonvar.RAIN18;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='canny';
        break;
        case '109':
            overlay_referval = commonvar.SMOKE4;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='erosion';
        break;
        case '110':
            overlay_referval = commonvar.RAIN16;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='threshold';
        break;
        case '111':
            overlay_referval = commonvar.PARTICLES3;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='calcHist';
        break;
        case '112':
            overlay_referval = commonvar.PARTICLES1;
            //overlay_referval = commonvar.FIREWORKS16;
            select_filter='threshold';
        break;

    }

    //테이크별 프레임 이미지처리 결과데이터 관련 저장
    let takeper_processframes = [];//업로드수와 같아야함. 추후 참조데이터..>> datagahtering데이터 테이크수.>>>

    let takeper_total_processframescnt=0;//테이크별 전체 프레임이미지 카운트수.(최종판단부분에서 사용)
    let takeper_effectprocess_asyncnt=0;//이펙트처리후의 이미지 s3업로드 카운트(최종판단부분에서 사용)
    //테이크비디오별 분할관련 forloop관련 처리>> 각 테이크별 편집구간범위 전체프레임들이 전달되어오고, 그것들을 테이크별로 저장하는관련.

    //테이크별 최종적 전체적 생성된created이미지들 일괄삭제로직반영>>(effect)
    let takeper_effectprocess_plannedEc2Deleted=[];

    let s3_client= s3.s3client;
    let bucket_params={
        Bucket:'clllap',
        Key:'clllap',
        Body:null,
        ACL:'public-read'
    };

    //테이크별 이펙트,필터 효과 지정한 결과가 있고 s3상에 있는것을 direct로 읽어서 관련 이미지처리후에 처리되는것마다 s3버킷에서 기존 원본이미지를 삭제하고,처리이미지로 대체하는 형태로진행>> 이건 s3에 있는것이기에 문제가 없다면 그냥 전체 일괄삭제가 더 나을수도.
    async function takeper_effectprocess(data_gathering,res,request_id,takeindex){
        console.log('-====>>takeper_effectprocess[[EFFECT PROCESS FUNCTION executesss]]]',data_gathering,request_id,takeindex)

        //테이크별 고유한 자기만의 전체프레임을 바탕으로 테이크별 병렬적 이펙트반영 연산진행>>
        //let total_frame_data= data_gathering[`${takeindex}_full_data_plans3`];//s3위치값입니다. 
        let total_frame_data=data_gathering[`${takeindex}_full_data`];//ec2 tmp위치값입니다. nodejs -> s3 이미지 refer참조시 대량으로 참조하는경우에 경우에 따라서 tls,https,socket관련 이슈가 필연적 발생할수가 있어, 네트웤관련 문제 발생하여 로직구현에 영향을 미침.

        let takevideo_duration = total_frame_data.length / 26;//s값. 실행형태로 넘어온 테이크별 duration값>>>
        takeper_total_processframescnt += total_frame_data.length;//테이크별 총 전체프레임수를 모두 지정한다.

        //필터 효과 지정될 랜덤구간 inex프레임범위 지정 statarts
        let random_index =Math.floor(takevideo_duration*Math.random());//0~5내림수를 반환. 6초였다면 1~6
        random_index +=1;
        
        let random_start = random_index - 2 < 0?0:random_index - 2;
        let random_end = random_index;//6  4~6 5~7  3 1~3 2 0~2 1 -1~1:0~1
        
        let take_range_start = 26 * (random_start)+1;
        let take_range_end = 26 * (random_end);

        //오버레이 효과 지정될 랜덤구간 index프레임범위 지정startss
        let random_index2 = Math.floor(takevideo_duration*Math.random());
        random_index2 += 1;

        let random_start2 = random_index2 -2 <0?0:random_index2 - 2;
        let random_end2 = random_index2;
        
        let take_range_start2 = 26*(random_start2)+1;
        let take_range_end2 = 26*(random_end2);

        let takeper_effectframepath_data={};//추후 ffmpeg참조 데이터저장.
        takeper_effectframepath_data['takeindex'] = takeindex;
        takeper_effectframepath_data['planned_processframes_data'] = [];
        takeper_effectframepath_data['planned_processframes_data_referFormat'] = `${request_id}_take${takeindex}encoded_frame`; //reqid_take1encoded_frame%d형태의 원본프레임+이미지처리덮어씌워짐 데이터들 참조형태의 mreged ffmepg연산 참조용데이터.

        console.log('filter반영구간::',take_range_start,take_range_end);
        console.log('overlay반영구간:',take_range_start2,take_range_end2);

        console.log('filter,overlay반영구간::',take_range_start,take_range_end);
        console.log(take_range_start2,take_range_end2);

        //오버레이가 반영된 구간에 대해서만 indexing합니다.
        let overlay_index=0;

        //테이크비디오별 전체편집 프레임구간에 대해서 필터,오버레이 반영되어져 나온 출력output s3 대상들 경로들 저장해둠. ==>>
        for(let t=0; t<total_frame_data.length; t++){

            let local_original_frame= total_frame_data[t];//원본 url path s3경로 >> ec2경로값. 동일 http:프로토콜 자신localserver요청 
            console.log('take,t:',takeindex,t+1,local_original_frame);
            let result;//프레임별(take) 범위의 forloop 범위의 변수.

            if( (take_range_start <= t+1 && t+1 <= take_range_end) && (take_range_start2 <= t+1 && t+1 <= take_range_end2)){
                //필터범위, 오버레이 모든 범위에 속하는 중첩의 경우
                console.log(';;;;]]]]]]takeindex:',takeindex);
                console.log('===>>오버레이 적용범위가 필터적용범위와 중첩했던경우 겹치는 연산진행, 중첩이펙트 효과 진행::',take_range_start,take_range_end)
                console.log('===>>오버레이 적용범위가 필터적용범위와 중첩했던경우 겹치는 연산진행, 중첩이펙트 효과 진행::',take_range_start2,take_range_end2);

                console.log('await loadimage 읽을 원본 파일,및 오버레이파일 path:',local_original_frame,`${overlay_referval}${overlay_index+1}.png`);
                //let original_frame_source= await Jimp.read(local_original_frame);
                //let target_src= cv.matFromImageData(original_frame_source.bitmap);//원본 각 프레임이미지
                let original_frame_source = await loadImage(local_original_frame);//tmp상의 관련 encodingframes요청 소켓사용??
                let target_src = cv.imread(original_frame_source);//대상  ==>>원본 이미지 정보 매트릭스
                console.log('original_frames_sroucess!!!:',original_frame_source);
                console.log('targert_srcc!!!:',target_src)
                try{
                    switch(select_filter){
                        case 'passThrough' : result = opencvfunctions1.passThrough(target_src); break;
                        case 'gray' : result = opencvfunctions1.gray(target_src); break;
                        case 'hsv': result = opencvfunctions1.hsv(target_src);break;
                        case 'canny':result = opencvfunctions1.canny(target_src); break;
                        case 'inRange': result = opencvfunctions1.inRange(target_src); break;
                        case 'threshold':result = opencvfunctions1.threshold(target_src); break;
                        case 'adaptiveThreshold': result= opencvfunctions1.adaptiveThreshold(target_src); break;
                        case 'gaussianBlur': result= opencvfunctions1.gaussianBlur(target_src); break;
                        //case 'bilateralFilter': result = opencvfunctions1.bilateralFilter(target_src); break;
                        //case 'medianBlur': result= opencvfunctions1.medianBlur(target_src); break;
                        case 'sobel' : result=opencvfunctions1.sobel(target_src); break;
                        case 'scharr': result = opencvfunctions1.scharr(target_src);break;
                        case 'laplacian': result= opencvfunctions1.laplacian(target_src);break;
                        case 'calcHist': result=opencvfunctions1.calcHist(target_src);break;
                        case 'equalizeHist': result=opencvfunctions1.equalizeHist(target_src);break;
                        //case 'backprojection': result=opencvfunctions1.backprojection(target_src);break;
                        case 'erosion':result=opencvfunctions1.erosion(target_src);break;
                        case 'dilation':result=opencvfunctions1.dilation(target_src);break;
                        case 'morphology':result=opencvfunctions1.morphology(target_src);break;
                        case 'contours' : result=opencvfunctions1.contours(target_src);break;
                        default : result =opencvfunctions1.passThrough(target_src);
                    }
                              
                    let src_overlay=new cv.Mat();
                    //let src_overlayimage= await Jimp.read(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 범위 1~52범위 테이크별 관련 대상체를 remote읽는다.
                    let src_overlayimage = await loadImage(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 이미지 관련하여 읽는다.                  
                    //src_overlay = cv.matFromImageData(src_overlayimage.bitmap);//오버레이 대상 이미지의 metrix데이터입니다.
                    src_overlay = cv.imread(src_overlayimage);//new cv.mat 메트릭스 형태 반환 오버레이매트릭스

                    //console.log('::original_frame_source',original_frame_source.bitmap)
                    //console.log(':::src_overlayimage:',src_overlayimage.bitmap);

                    let overlay_dst= new cv.Mat();

                    cv.addWeighted(result,1,src_overlay,0.72,0.0,overlay_dst,-1);//overlay_dst에 관련 메트릭스 효과 반영되며 이를 파일로 저장필요. 한개 오버레이이펙트효과,필터효과 중첩반영된것임.
                    //1,2,3,4,5........중첩된 것들에 대해선 이미 동일파일명으로 덮어씌워질것이기에.앞에서 이미 insert되었다고할수있다.

                     //result필터반영효과 , 오버레이 중첩효과인 overlay_dst를 반영한다.
                     console.log('===>쓸 켄버스imagedata width,height:',overlay_dst.cols,overlay_dst.rows);
                     let writecanvas = createCanvas(overlay_dst.cols,overlay_dst.rows);
                     cv.imshow(writecanvas,overlay_dst);

                    /*new Jimp({
                        width: overlay_dst.cols,
                        height: overlay_dst.rows,
                        data: Buffer.from(overlay_dst.data)
                    }).write(`./tmp/${request_id}_takevideo${takeindex}_partimg_process${t+1}.png`);//requestid_takevideo1,2,3_partimg_process1,2,3,4,...이런형태임.*/
                   // writeFileSync(`./tmp/${request_id}_takevideo${takeindex}_partimg_process${t+1}.png`,writecanvas.toBuffer('image/png'));
                   
                    
                   result.delete();src_overlay.delete();overlay_dst.delete();
                    
                   overlay_index++;

                   let delete_plan_pathlocal=`./tmp/${request_id}_take${takeindex}encoded_frame${t+1}.png`;//effect_start에서 애초에 s3에 원본프레임이미지는 저장하진 않고, 원본영상만 저장할뿐이며, ec2(용량크게 해야함 그게 좋음)원본프레임이미지들을 처리될때마다 or 처리후에 일괄삭제 로직필요.

                   takeper_effectprocess_plannedEc2Deleted.push(delete_plan_pathlocal);//해당 생성파일명등을 기억해둠(requestid별) 
                   takeper_effectframepath_data['planned_processframes_data'].push(`clllap/${request_id}_take${takeindex}encoded_frame${t+1}.png`)//배열이며, 배열의 원소수는 각 테이크별 프로세싱이미지정보들집합이있다. 이것들이 업로드수만큼 다 저장해둔다.

                   fs.writeFile(`./tmp/${request_id}_take${takeindex}encoded_frame${t+1}.png`,writecanvas.toBuffer('image/png'),(err)=>{
                       if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
                       console.log('the file has been asaved!!!(EFFECT OPENCV)',takeper_effectprocess_asyncnt);

                       takeper_effectprocess_asyncnt++;//이미지처리되어 ec2상에 써진 횟수 개수량.
                    })
                   // writeFileSync(`./tmp/${request_id}_take${takeindex}encoded_frame${t+1}.png`,writecanvas.toBuffer('image/png'));
                    //여기서 또한 이미지처리되는대로 바로 삭제하면서 s3에 업로드 하는 형태로 업로드데이터path등 기억하게끔 한다..이게 용량폭증을 예방방법중 하나
                    //result.delete();  //target_src는 이펙트함수 내부에서 삭제처리합니다. 이 필터적용효과의 경우 밑에 중첩된 연산에서 사용될여지가 있기에 냅둔다.                   
                 
                }catch (err) {
                    console.log('CV ERRORSSS:', err);
                }
                             
            }else if( (take_range_start <= t+1 && t+1 <= take_range_end) && !(take_range_start2 <= t+1 && t+1 <= take_range_end2)){
                //필터범위에만 속했던 경우
                console.log('===::::][]]:takeindex:',takeindex);
                console.log('===>>필터범위에만 속하는 경우:',take_range_start,take_range_end); 

                console.log('====>origilna local jimp읽을::',local_original_frame);

                //let original_frame_source= await Jimp.read(local_original_frame);
                //let target_src= cv.matFromImageData(original_frame_source.bitmap);//원본 각 프레임이미지
                let original_frame_source = await loadImage(local_original_frame);//not remote ec2 local server imagess(원본프레임)

                let target_src = cv.imread(original_frame_source);
                
                console.log('===>originanl_frame_soruce:',original_frame_source);
                console.log('===>>targertsr-ccss:',target_src);

                try{
                    switch(select_filter){
                        case 'passThrough' : result = opencvfunctions1.passThrough(target_src); break;
                        case 'gray' : result = opencvfunctions1.gray(target_src); break;
                        case 'hsv': result = opencvfunctions1.hsv(target_src);break;
                        case 'canny':result = opencvfunctions1.canny(target_src); break;
                        case 'inRange': result = opencvfunctions1.inRange(target_src); break;
                        case 'threshold':result = opencvfunctions1.threshold(target_src); break;
                        case 'adaptiveThreshold': result= opencvfunctions1.adaptiveThreshold(target_src); break;
                        case 'gaussianBlur': result= opencvfunctions1.gaussianBlur(target_src); break;
                        //case 'bilateralFilter': result = opencvfunctions1.bilateralFilter(target_src); break;
                        //case 'medianBlur': result= opencvfunctions1.medianBlur(target_src); break;
                        case 'sobel' : result=opencvfunctions1.sobel(target_src); break;
                        case 'scharr': result = opencvfunctions1.scharr(target_src);break;
                        case 'laplacian': result= opencvfunctions1.laplacian(target_src);break;
                        case 'calcHist': result=opencvfunctions1.calcHist(target_src);break;
                        case 'equalizeHist': result=opencvfunctions1.equalizeHist(target_src);break;
                        //case 'backprojection': result=opencvfunctions1.backprojection(target_src);break;
                        case 'erosion':result=opencvfunctions1.erosion(target_src);break;
                        case 'dilation':result=opencvfunctions1.dilation(target_src);break;
                        case 'morphology':result=opencvfunctions1.morphology(target_src);break;
                        case 'contours' : result=opencvfunctions1.contours(target_src);break;
                        default : result =opencvfunctions1.passThrough(target_src);
                    }
                      
                    //result필터반영효과
                   /* new Jimp({
                        width: result.cols,
                        height: result.rows,
                        data: Buffer.from(result.data)
                    }).write(`./tmp/${request_id}_takevideo${takeindex}_partimg_process${t+1}.png`);//requestid_takevideo1,2,3_partimg_process1,2,3,4,...이런형태임.*/
                    let writecanvas = createCanvas(result.cols,result.rows);
                    cv.imshow(writecanvas,result);

                    result.delete();

                    takeper_effectframepath_data['planned_processframes_data'].push(`clllap/${request_id}_take${takeindex}encoded_frame${t+1}.png`)//배열이며, 배열의 원소수는 각 테이크별 프로세싱이미지정보들집합이있다. 이것들이 업로드수만큼 다 저장해둔다.
                    let delete_plan_pathlocal=`./tmp/${request_id}_take${takeindex}encoded_frame${t+1}.png`;//각 처리될(이미지처리) 모두 처리가 된 이후 프레임하나별로 모두 s3바로 업로드,삭제 반복한다>>
                    takeper_effectprocess_plannedEc2Deleted.push(delete_plan_pathlocal);
                    fs.writeFile(`./tmp/${request_id}_take${takeindex}encoded_frame${t+1}.png`,writecanvas.toBuffer('image/png'),(err)=>{
                        if(err) console.log('=====>file write error(filter overlay effect)::',err);
                        console.log('the file ahas een asvaed(EFFECT OPENCV)',takeper_effectprocess_asyncnt);

                        takeper_effectprocess_asyncnt++;//이펙트처리되어ec2상에 파일이 생성되면 처리+1 
                    });
                    
                }catch(err){
                    console.log('OPENCV.WASM ERROR====무슨 error인가??:=====',err);
                }
                                        
            }else if( !(take_range_start <= t+1 && t+1 <= take_range_end) && (take_range_start2 <= t+1 && t+1 <= take_range_end2)){
                //오버레이 범위에만 속했던 경우
                console.log(';;;;]]]takeindex:',takeindex);
                console.log('===>>오버레이범위에만 속하는 경우:',take_range_start2,take_range_end2);
      
                try{
                    //let original_frame_source= await Jimp.read(local_original_frame);//원본소스
                    //let target_src= cv.matFromImageData(original_frame_source.bitmap);//원본 각 프레임이미지
                    let original_frame_source = await loadImage(local_original_frame);
                    let target_src = cv.imread(original_frame_source);

                    console.log('original_frame_source:',original_frame_source);
                    console.log('target_srcccss:',target_src);
                    //오버레이반영
                    let src_overlay=new cv.Mat();
                    console.log('==>읽을 오버레이path:,origilnaframesource path:',local_original_frame,`${overlay_referval}${overlay_index+1}.png`);
                    //let src_overlayimage= await Jimp.read(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 범위 1~52범위 테이크별 관련 대상체를 remote읽는다.
                    let src_overlayimage = await loadImage(`${overlay_referval}${overlay_index+1}.png`);
                    //src_overlay = cv.matFromImageData(src_overlayimage.bitmap);//오버레이 대상 이미지의 metrix데이터입니다.
                    src_overlay = cv.imread(src_overlayimage);

                    let overlay_dst= new cv.Mat();
    
                    cv.addWeighted(target_src,1,src_overlay,0.72,0.0,overlay_dst,-1);//overlay_dst에 관련 메트릭스 효과 반영되며 이를 파일로 저장필요. 한개 오버레이이펙트효과

                    let writecanvas = createCanvas(overlay_dst.cols,overlay_dst.rows);
                    cv.imshow(writecanvas,overlay_dst);

                    //overlay only 반영효과
                    /*new Jimp({
                        width: overlay_dst.cols,
                        height: overlay_dst.rows,
                        data: Buffer.from(overlay_dst.data)
                    }).write(`./tmp/${request_id}_takevideo${takeindex}_partimg_process${t+1}.png`);//requestid_takevideo1,2,3_partimg_process1,2,3,4,...이런형태임.*/

                    target_src.delete();src_overlay.delete(); overlay_dst.delete();
                        
                    overlay_index++;

                    takeper_effectframepath_data['planned_processframes_data'].push(`clllap/${request_id}_take${takeindex}encoded_frame${t+1}.png`)//배열이며, 배열의 원소수는 각 테이크별 프로세싱이미지정보들집합이있다. 이것들이 업로드수만큼 다 저장해둔다.
                    let delete_plan_pathlocal=`./tmp/${request_id}_take${takeindex}encoded_frame${t+1}.png`;//각 처리될(이미지처리) 모두 처리가 된 이후 프레임하나별로 모두 s3바로 업로드,삭제 반복한다>>
                    takeper_effectprocess_plannedEc2Deleted.push(delete_plan_pathlocal);

                    fs.writeFile(`./tmp/${request_id}_take${takeindex}encoded_frame${t+1}.png`,writecanvas.toBuffer('image/png'),(err)=>{
                        if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
                       console.log('the file has been asaved!!!(EFFECT OPENCv',takeper_effectprocess_asyncnt);

                       takeper_effectprocess_asyncnt++;

                    });
              
                }catch (err) {
                    console.log('OPENCV ERORSSS TM CCVVVSS:',err);
                }
               
                
            } else{
                //이펙트 무적용
                
                console.log('이펙트 미적용구간:',takeindex,t+1,takeper_effectprocess_asyncnt);

                let delete_plan_pathlocal=`./tmp/${request_id}_take${takeindex}encoded_frame${t+1}.png`;
                takeper_effectprocess_plannedEc2Deleted.push(delete_plan_pathlocal);
                takeper_effectframepath_data['planned_processframes_data'].push(`clllap/${request_id}_take${takeindex}encoded_frame${t+1}.png`)//배열이며, 배열의 원소수는 각 테이크별 프로세싱이미지정보들집합이있다. 이것들이 업로드수만큼 다 저장해둔다.

                takeper_effectprocess_asyncnt++

                //takeper_between_transitionframes_planwrite[t].push(`${s3_origin_dns}clllap/${request_id}_between${t+1}_transitionframe${tran+1}.png`);//테이크 between사이별 nowend~nextstart조합으로 된 52장의 pllanedwed write frames 대상을 쓴다>>파일을 씀과 동시에 바로 s3로 이동처리하면서 삭제하는게 hdd용량폭증 막을수있음. s3>이동 대상 이것을 추후에 이펙트 처리된이것을 참조해서 ffmpeg영상 처리>
                              
                //let delete_plan_pathlocalsource= fs.createReadStream(delete_plan_pathlocal);//원본소스
                
                /*bucket_params['Bucket'] = 'clllap';
                bucket_params['ACL'] = 'public-read';
                bucket_params['Key']= `clllap/${request_id}_takevideo${takeindex}_partimg_process${t+1}.png`;//해당 key folder path로의 업로드 예정. clllap/해당 경로로 업로드계획이라는 형태로 처리>>
                bucket_params['Body'] = delete_plan_pathlocalsource;
                bucket_params['ContentType'] = 'image/png';

                console.log('upload optionsss:',bucket_params);
                s3_client.upload(bucket_params,(err,data)=>{
                    if(err){
                        console.log('what erorsss:',err);
                        return false;
                    }
                    console.log('s3 file tarnsfer전달 성공 여부:',data);

                    //성공했다면 바로 삭제
                    console.log('takeper 특정 처리프레임이미지',takeindex,t+1);
                    //fs.unlinkSync(delete_plan_pathlocal);//해당 path경로의 대상체 바로 삭제>

                    takeper_effectprocess_asyncnt++;//테이크별 이펙트처리한 전체프레임들(적용구간,미적용구간모두 해야함)관련 카운트.>

                });//처리된 이미지별로 바로 삭제하고, s3이동시킨다.*/
                    
            }       
        }
        takeper_processframes.push(takeper_effectframepath_data);  
    }

    let takeper_startendframe_data=[];//테이크별 시작,끝프레임정보를 저장하는 형태의 배열 이게 다 찼을때(테이크수)만큼 찼다는것이 곧 테이크사이별 between트랜지션 데이터준비됐다.

    for(let e=0; e<data_gathering.length; e++){
        let data_gathering_loca=data_gathering[e];
        let takeindex_loca = data_gathering_loca['takeindex'];

        //해당 함수는 테이크별 편집구간 전체프레임에서 랜덤한 1개씩의 구간에 필터,오버레이효과 반영합니다.(opencv.wasm)
        console.log('[[[FFMPEG VIEO_IMNG_EXTRACT FUNCTIONS CALLBACK]]:: resultss send results:',data_gathering_loca,request_id,takeindex_loca);//요청>takeindex>gatheringdata등 정보 관련처리>>

        let take_start_data = data_gathering_loca[`${takeindex_loca}_start_data`];
        let take_end_data = data_gathering_loca[`${takeindex_loca}_end_data`];
        takeper_startendframe_data.push({
            'takeindex' : takeindex_loca,
            'startframe_path' : take_start_data,
            'endframe_path' : take_end_data
        })

        takeper_effectprocess(data_gathering_loca,res,request_id,takeindex_loca);
    }
    takeper_startendframe_data.sort(function(a,b){
        return a.takeindex - b.takeindex;
    });
    console.log('====>정렬된 takeper_startendframe_data:',takeper_startendframe_data);
    between_transitionprocess();//일괄 테이크 직렬처리>>


   //트랜지션 처리 관련 flow =>>> 병렬적 처리(스탠바이 데이터 준비후)에 내부적 처리방식자체는 직렬방식 (다만, 트랜지션&이펙트,필터 두 카테고리의 처리는 병렬처리임)
    let betweenper_transitionframes_data=[];//사이장면당 트랜지션프레임 new write 이미지들.between사이장면별 트랜지션이미지들 후참조ffmpeg

    let between_transition_planned_uploadcnt= 52 * (data_gathering.length -1);//between장면수만큼개수.(최종판단)
    let between_transitioneffect_asyncnt=0; //betweencnt * 52 의 산술적 형태이며, 이 개수량만큼 준비가 되었는지여부 판단.(최종판단)

    //트랜지션 생성이미지들 전체 저장planned삭제후 처리위한 ec2 delted
    let between_transitioneffect_planEc2Deleted=[];

    async function between_transitionprocess(){
        //트랜지션 functions start============================================>>>>
        //장면별 트랜지션 처리>>직렬구조 반복문기반  인댁스값이 upload_list.length-1 이면 마지막 테이크정보라는것이고 이때는 다음take정보가 없기에 무시.
        //이 연산을 통해 생성될 각 테이크별 요청별 테이크별 사이트랜지션 frame들 새로 write되는것들이고 이들을 기억해둔다. 이 리스트들을 추후에 삭제하면서 s3로 전송해야할것임>>
        //let takeper_between_transitionframes_planwrite=[];//이들은 추후에 삭제되어야함.>>전체 모인후에 바로 s3로 업로드되면서 삭제되어야함.

        try{
            for(let t=0; t<takeper_startendframe_data.length; t++){
                //let takeindex= takeper_startendframe_data[t]['takeindex'];
                if(t != takeper_startendframe_data.length-1){
                    let temp_store={};
    
                    temp_store['betweenindex'] = t+1;//between1,2,3,..이런식저장.
                    temp_store['betweenper_transitionframes']=[];
                    temp_store['betweenper_transitionframes_referFormat'] = `${request_id}_between${t+1}_transitionframe`;//reqid_between1,2,3_transitionframe%d.png형태로 betwen별 참조를 위한 자료구조>>

                    //마지막 인댁스take가 아닌경우에만 관련 하여 저장처리>>
                    let nowtake_lastframe_data= './tmp/'+takeper_startendframe_data[t]['endframe_path'];//0:1_end_data,1:2_start_data / 2:3_end_data,3:4_start_data 
                    let nexttake_firstframe_data = './tmp/'+takeper_startendframe_data[t+1][`startframe_path`];
                    console.log('현재 take index및 관련하여 생성되는 프레임장면between periods:[[TRANSIJTION EFFECT]]',nowtake_lastframe_data, nexttake_firstframe_data);//now~next씩 하여 uploadcnt-1의 장면들 생성된다.
                    console.log('between별(TRANSITION)소스 시작~종료이미지:',nowtake_lastframe_data,nexttake_firstframe_data);
                    
                    //트랜지션 처리관련
                    let alpha=1;let beta;
                    
                    //let now_lastframe=await Jimp.read(nowtake_lastframe_data);//테이크별 nowlast,nextfirst 프레임이미지url을 다 사용하고 나선 제거한다 ec2
                    //let next_firstframe = await Jimp.read(nexttake_firstframe_data);
                    let now_lastframe = await loadImage(nowtake_lastframe_data);
                    let next_firstframe = await loadImage(nexttake_firstframe_data);
                    
                    console.log('===now lastframess:',now_lastframe);
                    console.log('===>next firstframesss:',next_firstframe);

                    //let between_start_s= cv.matFromImageData(now_lastframe.bitmap);
                    //let between_end_s = cv.matFromImageData(next_firstframe.bitmap);//각 사이장면별 betweenstart,end bitmap array형태 console.log 은닉됨.
                    let between_start_s = cv.imread(now_lastframe);
                    let between_end_s = cv.imread(next_firstframe);
    
                    //takeper_between_transitionframes_planwrite[t]=[];//take-1 별 between별 사실상 트랜지션write 프레임이미지들path참조 배열.
                    for(let tran=0; tran<52; tran++){
                        //장면별 전환시에 52장 이미지를 초당 26개씩 보여주는 것으로 일단fixed형태로 처리 2초장면비디오
                        let blend_dst = new cv.Mat();
                        let src1 = new cv.Mat();let src2= new cv.Mat();
                        src1 = between_start_s.clone();
                        src2 = between_end_s.clone();//복사한 mat정보>>
    
                        alpha -= (1/52); beta= 1 - alpha;
                        alpha = parseFloat(alpha.toFixed(2));
                        beta = parseFloat(beta.toFixed(2));
                        alpha = alpha <=0?0:alpha;
                        beta = beta>=1?1:beta;
                        console.log('alpha and beatass:',alpha,beta);
    
                        cv.addWeighted(src1,alpha,src2,beta,0.0,blend_dst,-1);
                        
                        /*new Jimp({
                            width:blend_dst.cols,
                            height:blend_dst.rows,
                            data:Buffer.from(blend_dst.data)
                        }).write(`./tmp/${request_id}_between${t+1}_transitionframe${tran+1}.png`);*/
                        let write_canvas = createCanvas(blend_dst.cols,blend_dst.rows);
                        cv.imshow(write_canvas,blend_dst);
    
                        src1.delete();src2.delete();blend_dst.delete();//파일을 썼다면 바로 메모리해제
                        
                        let delete_plan_pathlocal=`./tmp/${request_id}_between${t+1}_transitionframe${tran+1}.png`;//각 처리될(이미지처리) 모두 처리가 된 이후 프레임하나별로 모두 s3바로 업로드,삭제 반복한다>>
                        temp_store['betweenper_transitionframes'].push(`clllap/${request_id}_between${t+1}_transitionframe${tran+1}.png`);//s3업로드 예정 처리 between별 트랜지션 처리 이미지들
                        between_transitioneffect_planEc2Deleted.push(delete_plan_pathlocal);
                        fs.writeFile(`./tmp/${request_id}_between${t+1}_transitionframe${tran+1}.png`,write_canvas.toBuffer('image/png'),(err)=>{
                            if(err) console.log('FILE WRITE ERROR(transition EFFECT):',err);
                            console.log('the file has been asaved!!!(EFFECT OPENCV)');

                            between_transitioneffect_asyncnt++;
                        });
               
                    }
                    between_start_s.delete(); between_end_s.delete();
                    //fs.unlinkSync(nowtake_lastframe_data);
                    //fs.unlinkSync(nexttake_firstframe_data);
                    if(fs.existsSync(nowtake_lastframe_data)){
                        fs.unlinkSync(nowtake_lastframe_data);
                    }
                    if(fs.existsSync(nexttake_firstframe_data)){
                        fs.unlinkSync(nexttake_firstframe_data);
                    }
    
                    betweenper_transitionframes_data.push(temp_store);
                }
            }

        }catch(error){
            console.log('OPENCV ERROSSSSRRSSS:',error);
        }
        //테이크별 반복문>> 테이크별로 모두 처리가 될시에 이미지처리하고 ec2 > tmp 파일시스템상에 파일을 쓰고 난뒤에 관련
        //트랜지션 functions endsss===============================>>> 직렬구조이기에 관련 처리끝난것.    
    };  
           
 //최종 판단(트랜지션 이미지 전체s3 수집 + 테이크별 이펙트처리프레임이미지 전체s3 수집 여부 모두 충족여부)
    let final_standbycnt=0;
    let ec2_store_planned_deleteTargets=[];
    let final_standby = setInterval(function(){
        console.log('betweenper_tarnsitiofnarmes_data',between_transitioneffect_asyncnt,between_transition_planned_uploadcnt);
        console.log('takeper_processframess:',takeper_effectprocess_asyncnt,takeper_total_processframescnt);
        if(between_transitioneffect_asyncnt == between_transition_planned_uploadcnt  &&  takeper_effectprocess_asyncnt == takeper_total_processframescnt){
            console.log('s3===>트랜지션 처리 &이펙트 처리 이미지 모두 ec2저장 완료상태>>>::준비완료상태');
            console.log('betweenper_tarnsitiofnarmes_data',betweenper_transitionframes_data);
            console.log('takeper_processframess:',takeper_processframes);

            clearInterval(final_standby);

            console.log('===>여기서 삭제 관련 로직발현 ec2생성대상들 여기서 일괄삭제]]]]]:',between_transitioneffect_planEc2Deleted,takeper_effectprocess_plannedEc2Deleted);
            //어떤 reqid요청 세션이 어떤 정보들에 대해서 지금껏 요청이 이뤄진(테이크비디오인코딩당 처리프레임들정보s3정보들>> + between트랜지션프레임처리관련정보들)

            let between_transitioneffect_uploadasyncCnt=0;//트랜지션 처리이미지들 ec2 > s3로 모두 일괄업로드 작업완료시여부
            for(let b=0; b<between_transitioneffect_planEc2Deleted.length; b++){
                let delete_plan_pathlocal =between_transitioneffect_planEc2Deleted[b];
                if(fs.existsSync(delete_plan_pathlocal)){
                    console.log('대상 삭제 파일 존재할시에 삭제처리[[between TRANSITION processifless]',delete_plan_pathlocal);
                    let delete_plan_pathlocalsource= fs.createReadStream(delete_plan_pathlocal);
                    let purefilename= delete_plan_pathlocal.split('/')[2];
                    bucket_params['Key'] = `clllap/${purefilename}`;//순수 처리파일이름으로 하여 업로드처리>>>이름대로 하여 업로드처리>> 트랜지션파일들의 경우 새로 써지는것
                    bucket_params['Body'] = delete_plan_pathlocalsource;

                    s3_client.upload(bucket_params,(err,data)=>{
                        if(err){
                            console.log('what errosss:',err);
                        }
                        console.log('=====>>>>>s3 file uplaod trasnfer전달성공여부:ㅣ',data);

                        between_transitioneffect_uploadasyncCnt++;
                    });
                    /*fs.unlink(delete_plan_pathlocal,(err)=>{
                        console.log('delte errorss:',err);
                    });*/
                    ec2_store_planned_deleteTargets.push(delete_plan_pathlocal);
                        
                }
            }
            let takper_processframes_uploadasyncCnt=0;//이펙트처리이미지들 ec2 > s3로 모두  일괄업로드 작업완료여부
            for(let t=0; t<takeper_effectprocess_plannedEc2Deleted.length; t++){
                let delete_plan_pathlocal = takeper_effectprocess_plannedEc2Deleted[t];
                if(fs.existsSync(delete_plan_pathlocal)){
                    console.log('대상 삭제 파일존재할시에 삭제처리[videoeffect transition procoessfiless]]:',delete_plan_pathlocal);
                    let delete_plan_pathlocalsource=fs.createReadStream(delete_plan_pathlocal);
                    let purefilename=delete_plan_pathlocal.split('/')[2];
                    bucket_params['Key'] =`clllap/${purefilename}`;
                    bucket_params['Body'] = delete_plan_pathlocalsource;

                    s3_client.upload(bucket_params,(err,data)=>{
                        if(err){
                            console.log("what errosss:",err);
                        }
                        console.log('=====>s3 file upload trnafserrss전달성공여부:',data);
                        
                        takper_processframes_uploadasyncCnt++;
                    });
                    /*fs.unlink(delete_plan_pathlocal,(err)=>{
                        console.log('deltee eorrss:',err);
                    });*/
                    ec2_store_planned_deleteTargets.push(delete_plan_pathlocal);
                }
            }

            let second_standby_securecnt=0;
            let second_standby=setInterval(function(){
                console.log('===>betweentraisitoneffectuploadasynccnt, takeperProcessframesuplaodasyncCnt:',between_transitioneffect_uploadasyncCnt,between_transitioneffect_planEc2Deleted.length);
                console.log('====>takperProfcessfrmaeusploadsaynCnt:',takper_processframes_uploadasyncCnt,takeper_effectprocess_plannedEc2Deleted.length)

                if(between_transitioneffect_uploadasyncCnt == between_transitioneffect_planEc2Deleted.length && takeper_effectprocess_plannedEc2Deleted.length == takper_processframes_uploadasyncCnt){
                    console.log('======>>트랜지션,필터,이펙트등 ec2처리대상들 일괄삭제 및 s3업로드 작업 모두완료::]]]]');

                    clearInterval(second_standby);

                    for(let del=0; del<ec2_store_planned_deleteTargets.length; del++){
                        let del_target=ec2_store_planned_deleteTargets[del];
                        if(fs.existsSync(del_target)){
                            fs.unlink(del_target,(err)=>{
                                console.log('deltee eorrss:',err);
                            });
                        }                       
                    }
                    effect_transition_sources_ffmpegAfterProcess(request_id,takeper_processframes, betweenper_transitionframes_data, res,music);

                }

                if(second_standby_securecnt == 4000){
                    clearInterval(second_standby);
                    return res.status(403).json({success:false,message:'server timeout error'});
                }
                second_standby_securecnt++;
            },500);
        }

        if(final_standbycnt == 400){
            console.log('문제가 있음>>');
            clearInterval(final_standby);
            return res.status(403).json({success:false,message:'server timeout error'});
        }

        final_standbycnt++;

    },1200);

    console.log('=======================>transition and effect process requetsss ENDLINES===============');
});

//opencv.js(CLIENT)처리된것 서버 후처리(ffmpeg관련 로직) s3 uploading filewrites.. 
app.post('/upload_effectProcess2',(req,res,next)=>{
    let req_body=req.body;
    let uploadfile=req.files;//다중 파일들..>> n개의 비디오파일들..>>
    console.log('upload post requestss:',req_body,uploadfile);
    let uploadfile_keys=Object.keys(uploadfile);//파일담은 업로드개체배열 객체를 keys들만해서 키값들만 저장한다.
    console.log('uploadilfe keysss:',uploadfile_keys);

    let upload_files=[];
    let async_call_count=0;let async_call_count_=0; //비디오테이크분할이미지(원본+이펙트처리)관련 처리관련 변수

    let output_merged_transitions=[];//각 between전환별 트랜지션 합쳐진 영상output path들>>>
    let output_effect_videotakes=[];//각 테이크별 이펙트이미지들 모두 합쳐진 영상output path들>>planning datss.buffer->palinnignpath uploadss
    let output_file_count=0;
    //let musicfile=req.files.music;
    //let musicfilename=makeid(20) + musicfile.name;

   /* musicfile.mv(`${musicdir}${musicfilename}`,function(err){
        console.log('음원파일 단일한개 업로드 처리>>');
        if(err){
            console.log('one errrosss:',err);
        }
    });*/
    
    let request_id = req_body.request_id;//요청자체의 id값>>>요청의id값 각 생성파일별makeid값은 아님.

    let between_count = req_body.upload_count-1;//테이크비디오들 숫자..
    //let upload_list = req_body.upload_list;
    let videotake_partimg_totalcnt= req_body.videotake_partimg_totalcnt;
    let between_distinct_datas=[];//request_id에서 어떤 장면들이 나왔었는지 저장해두는..
    let valid_count=0; 
    let valid_count_=0;//비디오태이크별 부분분할 장면이미지(프레임)들의 총 업로드수이다. 
    //let takeper_noeffect_framerange=req_body.takeper_noeffect_framerange;//이펙트 미적용 대상 범위인댁스번호
    //let takeper_distinctfilename_data = req_body.takeper_distinctfilename_data;
    //let takevideoper_avgframerate_array=req_body.takevideoper_avgframerate_array.split(',');

    let take_video_datas=[];//request_id에서 어떤 테이크별 비디오분할이미지들이 업로드올라왔었는지...
    console.log('===>>videotake_partimg_totalcnt:',videotake_partimg_totalcnt);

    let s3_bucketoption=s3.uploadParams;//52*전환수(between수)만큼의 반복회수 총 프레임들 존재.이수만큼 업로드가 모두 이뤄져진 상태이후에 ffmpeg로 이들을 모두 하빔.
    //중요한것은 between별로 저장할 집합을 지정필요하다. 
    let s3_client=s3.s3client;

    let between_frames_totaluploadcnt=52*between_count; let async_s3_betweenuploadcnt=0;
    //let planning_s3upload_betweenper_frames=[];//between장면별 전체변환 프레임이미지들 이차원배열.
    let planning_s3upload_betweenper_frames_refer=[];
    let delete_planning_s3upload_total_frames=[];

    for(let outer=0; outer<between_count; outer++){
        let outer_index = outer+1;
        let between_distinct= `between${outer_index}`;

        planning_s3upload_betweenper_frames_refer[outer]=`clllap/${request_id}_blend_transitionImg_between${outer+1}_`;

        for(let inner=1; inner<=52; inner++){

            let file_item=uploadfile[`between${outer_index}_${inner}`];

            //let filename= request_id+'_' + (`between${outer_index}`) +'_'+ file_item['name'];//어떤 요청에서의 어떤장면(between)그룹상에 있는 해당 blend_transitionImg%d.png형태로 처리>>>
            let filename=file_item['name'];
            
            s3_bucketoption.Key = `clllap/${filename}`;
            s3_bucketoption.Body = file_item['data'];

            delete_planning_s3upload_total_frames.push(`clllap/${filename}`);

            console.log('s3 parametess ferfer spacss:',s3_bucketoption);

            s3_client.upload(s3_bucketoption,(err,data)=>{
                if(err){
                    console.log('what errosss:',err);
                    return false;
                }
                console.log('s3 fiel transfer전달 성공여부:',data);

                async_s3_betweenuploadcnt++;
            });
        }
        between_distinct_datas.push(between_distinct);//between1,2,3,4....장면들을 넣는다.어떤 장면 그룹에 대해서(사이트랜지션)요청했었나
    }
    
    //전체 필터,오버레이,미적용 테이크별비디오 전체프레임이미지 file넘어온것 s3 uploads
    let upload_count=req_body.upload_count;//테이크자체의 수이다.테이크 비디오수.
    let videotake_effectadapt_cnt=0;//비디오테이크 전체프레임수합계

    let planning_takeper_totalframes_refer=[];
    let async_s3_videototalframes_cnt=0;

    let delete_planning_s3upload_total_frames2=[];
    for(let outer=0; outer<upload_count; outer++){
        //외부 업로드 카운트 테이크의수이다. 각 테이크별로 넘어온 이미지 분할 데이터 전부(필터처리포함)된것을 테이크별로 받아서 합치기 필요함>>
        let outer_index= outer+1;
        let take_distinct=`takevideo${outer_index}`;

        let rel_match_keys=uploadfile_keys.filter(function(ele){
            if(ele.indexOf(take_distinct)!=-1){
                return ele;
            }
        });
        videotake_effectadapt_cnt += rel_match_keys.length;

        console.log("관련 매칭 rel_match_keytss:",rel_match_keys,videotake_effectadapt_cnt);//takevideo2_partimg_.....형태로 takevideo1,2,3,.....테이크별 비디오관련 name 객체키값들 넘어오는것들만 저장한다>>(업로드카운트 각 테이크별이다., 각테이크별 구분하기위해서 이 수치는 곧 각 테이크별 포함이미지수이기도하다.

        planning_takeper_totalframes_refer[outer]=`clllap/${request_id}_takevideo${outer+1}_partimg_process`;

        for(let inner=0; inner<rel_match_keys.length; inner++){
            let uploadfile_object_key=rel_match_keys[inner];

            let file_item=uploadfile[uploadfile_object_key];
            let filename=file_item['name'];//request_id _ 각 요청별 몇몇테이크별 테이크별 몇몇이미지업로드했었는지 관련하여

            /*uploadfile[uploadfile_object_key].mv(`${dir}${filename}`,function(err){
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
                async_call_count_++;
                valid_count_++;//valid_count는 테이크별 이펙트적용(필터or오버레이효과적용범위개수index)범위의 합계이다., 각 이미지별 모두 올라간경우에 증가시킵니다.
            });*/


            s3_bucketoption.Key=`clllap/${filename}`;
            s3_bucketoption.Body=file_item['data'];
            console.log('s3 paramterss refer spacess:',s3_bucketoption);

            delete_planning_s3upload_total_frames2.push(`clllap/${filename}`);

            s3_client.upload(s3_bucketoption,(err,data)=>{
                if(err){
                    console.log('what errosss:',err);
                    return false;
                }
                console.log('s3 file transfer success성공여부(videotAKE FRAMESS image):',data);

                async_s3_videototalframes_cnt++;
            });
        }
        take_video_datas.push(take_distinct);//takevicdedo1,2,3,4,,...와 같이 테이크별 관련 데이터 넣는다.
    }
    
    function inner_callback(result,res){
        console.log('내부 콜백실행>>outputfile path받기::',result);//처리된 파일자체의 경로를 전달주고 이들끼리합친다.

        let buffer_data=result.buffer_data;
        let outputpath=result.outputpath;
        s3_bucketoption.Key=outputpath;//clllap/~~~~~~형태. 키형태.
        s3_bucketoption.Body=buffer_data;

        console.log('s3 paramtersss refer psacess:',s3_bucketoption);
        s3_client.upload(s3_bucketoption,(err,data)=>{
            if(err){
                console.log('what errosss:',err);
                return false;
            }
            console.log('s3 file transfer success성공여부:',data);

            output_merged_transitions.push(result);//각 병합파일(트랜지션between)별 업로드 성공때마다 그 파일에 대한 pallning정보배열에 넣음.
        })
       
    }

    function inner_callback2(result,res){
        console.log('내부 콜백실행>>outputfile path받기관련::',result);

        let buffer_data=result.buffer_data;
        let outputpath=result.outputpath;
        s3_bucketoption.Key=outputpath;
        s3_bucketoption.Body=buffer_data;

        console.log('s3 parameterss refer spacess:',s3_bucketoption);
        s3_client.upload(s3_bucketoption,(err,data)=>{
            if(err){
                console.log('what errosss:',err);
                return false;
            }
            console.log('s3 file transfer success성공여부:',data);

            output_effect_videotakes.push(result);
        })
    }
    let first_standby_securecnt=0;
    let first_standby = setInterval(function(){
        if(async_s3_betweenuploadcnt == between_frames_totaluploadcnt && async_s3_videototalframes_cnt == videotake_effectadapt_cnt){
            console.log('필요이미지 모두 업로드 관련 작업 완료!');
            clearInterval(first_standby);

            for(let s=0; s<planning_s3upload_betweenper_frames_refer.length; s++){
                console.log('====>betweenvideo당:::',planning_s3upload_betweenper_frames_refer[s]);
                ffmpegNode.between_transition_merged(request_id,planning_s3upload_betweenper_frames_refer[s],inner_callback,res,between_distinct_datas[s]);
            }//between1_request_id,추가적 관련 조합으로 업로드된 이미지들을 찾아서 그들끼리 병합하여 각 between이미지들만들어주는 결과물을 내부적 전달해줌.

            for(let h=0; h<planning_takeper_totalframes_refer.length; h++){
                console.log('===>takevideo당 ::',planning_takeper_totalframes_refer[h]);
                ffmpegNode.videotake_effect_merged(request_id,planning_takeper_totalframes_refer[h],inner_callback2,res,take_video_datas[h]);
            }//takevideo1,2,3.,..... takevideo1_partimg_+propcess%d 관련 집합 이미지들 찾아서 그들끼리 병합하여 테이크별 처리된 영상 만들어주는 형태의 융통성 결과물api
            //여기서합칠떄 미적용이펙트 이미지들은 넘어오지 않는데, 이들은 테이크별 인댁스넘긴데이터를 이용해서>>테이크별로 찾아내서 처리가 필요함>>

            let second_standby_securecnt=0;
            let second_standby = setInterval(function(){
                if(output_merged_transitions.length == between_count && output_effect_videotakes.length == upload_count){
                    //업로드수 4개라면 between merge transiton수 3개 만족 + output_effect_vidotakes 네개만족 모두 되어야한다.
                    console.log('inner stadnbby output request files completsss:',second_standby,output_merged_transitions, output_effect_videotakes);
                    clearInterval(second_standby);
                  
                    //ffmpegNode.originals_and_betweentransition_merged(request_id,upload_list,output_merged_transitions,opencv_transition_response,res);//비디오들끼리 병합한다>>>
                    ffmpegNode.originals_and_betweentransition_merged(request_id,output_effect_videotakes,output_merged_transitions,opencv_transition_response,res,delete_planning_s3upload_total_frames,delete_planning_s3upload_total_frames2);
                }

                if(second_standby_securecnt==10000){
                    clearInterval(second_standby);
                }
                second_standby_securecnt++;
            },50);
               
        }else{
            console.log('뭔가 문제가 있음 장면사이수랑,그만큼 돌린저장한 수가 다르다는것은 or 업로드테이크수와 완성된 이펙트적용된 테이크파일수 다름(아직대기)',async_s3_betweenuploadcnt,between_frames_totaluploadcnt,async_s3_videototalframes_cnt, videotake_effectadapt_cnt, videotake_partimg_totalcnt);
            console.log(planning_takeper_totalframes_refer,planning_s3upload_betweenper_frames_refer);
        }  

        if(first_standby_securecnt==10000){
            clearInterval(first_standby);
        }
        first_standby_securecnt++;
    },50);
});

app.post('/video_move_and_splice_process',async(req,res,next)=>{
    console.log('video move and splice porcsss:',req.body);

    //let data=JSON.parse(req.body);
    //console.log('data',data);
    let upload_list=req.body.upload_list_data;
    let upload_list_use=req.body.upload_list_data_use;
    let edit_process_info = req.body.edit_process_info;
    edit_process_info= JSON.parse(edit_process_info);//배열로 나오게된다.>>

    //upload_list = upload_list.split(',');
    /*upload_list_use = upload_list_use.split(',');
    let adapt_upload_list=[];
    for(let s=0; s<upload_list_use.length; s++){
        let item=upload_list_use[s];
        //let item_folderpath = item.split('/')[0];
        //let item_purefilename_target=item.split('/')[1];
        //item_folderpath = item_folderpath.replace('processbefore','./process/files');
        //let make_conversion_name = item_folderpath +'/'+item_purefilename_target;
        adapt_upload_list.push(item);
    }*/
    console.log('adapt upload listsss:',upload_list);//원격지상 s3 url요소에 input을 참조하고 그걸 바탕으로 변형한 copy return을 스트림으로..스트림버퍼 파이프라인
    ffmpegNode.video_subpart_slice_normal(upload_list,edit_process_info,video_subpart_slice_result_callback,res);//해당 요청id에대한 구분을 위함.
});
function video_subpart_slice_result_callback(data,plan_output_processfiles_bufferData,res){
    console.log('resultss send results:',data,plan_output_processfiles_bufferData);//data는 업로드할 s3키값 정보path정보이다.

    let bucket_params={
        Bucket:'clllap',
        Key:'clllap',
        Body:null,
        ACL:'public-read'
    }

    let s3_client= s3.s3client;
    let s3_upload_success_count=0;//업로드 성공카운트.

    let client_load_data=[];

    for(let p=0; p<plan_output_processfiles_bufferData.length; p++){
        bucket_params.Key=data[p];//clllap/처리파일유니크명 형태의 키값. clllap 폴더 저장소상에 저장>버킷
        bucket_params.Body=plan_output_processfiles_bufferData[p][0];//버퍼메모리 객체정보 지정

        client_load_data.push(`${s3_origin_dns}${data[p]}`);
        console.log('인코딩비디오 splice ffmpeg처리 출력 버퍼 s3업로드 관련 옵션:',bucket_params);

        s3_client.upload(bucket_params,(err,data)=>{
            if(err){
                console.log('what errosss:',err);
                return false;
            }
            console.log('파일업로드 성공여부 관련 처리여부:',data);

            s3_upload_success_count++;//비동키 형태 성공시마다 카운트..4개처리된 파일에 대해서 성공한 업로드 카운트만큼 카운트..이 수는 업로드수등과 동일함.
        });
    }
    let standby = setInterval(function(){
        if(data.length == s3_upload_success_count){
            console.log('업로드한 리스트들에 대해서 모두 splice처리된것을 버퍼->s3 업로드완료된시점때 실행>>:',data,client_load_data);
            //업로드예정으로 했었던 path 폴더파일패스 등으로 업로드가 다 된것이기에 그를 넘기면 된다. 그것들을 참조가능하게끔.
            clearInterval(standby);

            return res.json({success:true, prcess_data:client_load_data, s3_now_url:s3_origin_dns})
        }
    },20);
    //return res.send(data);
    //return res.json({success:true, process_data: data});
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

console.log('==================>>NODEJS EXPRESS SERVER EXEUCTES ENDLINES================================================');