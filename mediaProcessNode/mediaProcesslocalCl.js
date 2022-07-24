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

//const opencvfunctions1 = require('./OpencvFunctions/opencvfunction1');

//============ffmpeg in nodejs intiatlize includes====================================================
const ffmpegNode=require('./ffmpegNodeModule_serverCl');

const ffmpeg=require('ffmpeg');
const fluent_ffmpeg=require('fluent-ffmpeg');
const { FSx, GameLift } = require('aws-sdk');

//=================test executess...
//console.log('===>opencvfunctions1 load:',opencvfunctions1);

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

//added or modified server안정성 관련 스크립트 20220302..
let isDisableKeepAlive=false;
app.use(function(req,res,next){
    console.log('====APP USE HANDLERSINGSS:',next,isDisableKeepAlive);
    if(isDisableKeepAlive){
        res.set('Connection','close');
    }
    next();
});
const server = https.createServer(options, app).listen(port,function(){
    console.log('====>APP PROCESSER listen완료상태 구동완료,요청대기상태:',port,process);
    console.log(`application is listengingon port ${port}`);
    //process.send("ready");
});
process.on('SIGINT',function(){
    console.log('===>SIGNINT이벤트발생>>',server,server.close,process.exit);
    isDisableKeepAlive=true;
    server.close(function(){
        console.log('server closed!!!!기존연결유지하고, 추후에다른연결 해제 더이상받지않음(oldApps)');
        process.exit(0);
    })
})
//20220302 added. ends...

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

        //console.log('s3 parameters refer space:',s3_parameters);

        s3_client.upload(s3_parameters, async (err,data)=>{
            if(err){
                console.log('what errosss:',err);
                return false;
            }
            //업로드가 성공한 경우에만 도달>>경우에만 관련하여 카운팅처리 s3에 요청비디오 하나씩 올라가는구조로 변경
            //console.log('s3 전달 파일여부 성공여부',data);

            if(async_call_count+1 == Object.keys(uploadfile).length){
                if(upload_count == 1){
                    //ffmpegNode.singlemedia(`${dir}${filename}`,res,twosplit_file_response);
                    ffmpegNode.targetfiles_encoding(upload_files_,res,encodingfiles_response);
                }else{
                    ffmpegNode.targetfiles_encoding(upload_files_,res,encodingfiles_response);
                }

                let result = await standby_promise(); //업로드리스트-->>인코딩 n개리스트 반환때까지 기다린다.
                //console.log('promise process resultsss:',result);

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
        //console.log('=====>>ENCODINGFILES RESPONSE callback function ===========================>');

        //console.log('encodingfiles_response parameters',upload_files,filelist,plan_output_encoding_files_bufferData,plan_output_encoding_path_local);
        //console.log('encodingfiles_response parameters',plan_output_encoding_files_bufferData);

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
            //console.log('업로드 옵션 상태값:',bucket_params);
            s3_client.upload(bucket_params,(err,data)=>{
                if(err){
                    console.log('what errossss:',err);
                    return false;
                }
                //console.log('파일업로드 성공여부!!!:',data);

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
                                
                    //console.log('upload_originalEncodedlist listss:',upload_originalEncodedlist);

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
//USE API 1 : 비디오 업로드만 원본을 그대로 리턴사용(비디오컷팅된원본비디오, 및 컷팅된원본비디오의 프레임값)등 관련파일업로드
app.post('/api/videotake_uploads',(req,res,next)=>{
    let uploadfile=req.files;
    console.log('============================videotake_uploads API REQUEST START',uploadfile);

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

        //console.log('s3 parameters refer space:',s3_parameters);

        s3_client.upload(s3_parameters, async (err,data)=>{
            if(err){
                console.log('what errosss:',err);
                return false;
            }
            //업로드가 성공한 경우에만 도달>>경우에만 관련하여 카운팅처리 s3에 요청비디오 하나씩 올라가는구조로 변경
            //console.log('s3 전달 파일여부 성공여부',data);

            if(async_call_count+1 == Object.keys(uploadfile).length){
           
                return res.json({success:true, upload_originallist:upload_files,upload_originalist_string:upload_files.join(',')});      
            }
            async_call_count++;
        });
    }
   
    console.log('============================videotake_uploads API REQUEST lineEND',uploadfile);
   
});
//url 비디오정보 조회(duration,기타 메타정보도 추가예정)
app.post('/api/videoInfoGet',async(req,res,next)=>{
    let urlfile=req.body.urlfile;
    console.log('============================videoInfoGet API REQUEST START',urlfile);

    let result = await ffmpegNode.mediaInfoGet(urlfile);
    console.log('get video duraitonss:',result);
         
    console.log('============================videoInfoGet API REQUEST lineEND');

    return res.json({success:true, duration: result});      

});
//url 비디오의 썸네일프레임 조회(특정구간 프레임,가장첫프레임default) 조회
app.post('/api/videoFrameThumbnail',async(req,res,next)=>{
    let urlfile=req.body.urlfile;
    console.log('======================videoFrameThumbnail API REQUEST START:',urlfile);

    let result=await ffmpegNode.videoFrameThumbnail(urlfile);
    console.log('get video thumbanil resultsss:',result);//파일 결과tmp를 얻고 이를 업로드

    let s3_parameters=s3.uploadParams;
    let s3_client=s3.s3client;
 
    s3_parameters.Key = `clllap/${result}`;//업로드할 파일 구조 폴더명
    s3_parameters.Body = fs.createReadStream(`./tmp/${result}`);//buffered datas..

    console.log('s3 parameters refer space:',s3_parameters);

    s3_client.upload(s3_parameters, async (err,data)=>{
        if(err){
            console.log('what errosss:',err);
            return false;
        }
        console.log('s3 전달 파일여부 성공여부',data);
        
        if(fs.existsSync(`./tmp/${result}`)){
            fs.unlinkSync(`./tmp/${result}`);
        }

        return res.json({success:true, thumbnail:`${s3_origin_dns}clllap/${result}`});      
        
    });
    
});

//미리보기페이지에서 유저가 테이크편집한데로 나오게 하는 api
app.post('/api/videotakeEditsplit',async(req,res)=>{
    console.log('=-========>>api video split simpelsss exeuctuess:==================');

    //console.log('reqbodyss:',req.body,req.body.upload_list_data,req.body.take_video_process_info);

    let upload_list = req.body.upload_list_data.split(',');
    let take_video_cutprocess_info=  req.body.take_video_cutprocess_info;
    if(take_video_cutprocess_info && take_video_cutprocess_info!='undefined'){
        take_video_cutprocess_info = JSON.parse(take_video_cutprocess_info);
    }

    let request_id= makeid(20);//요청id값>>여기서부터가 요청시작으로 origin시작>>
    console.log('upload_list:',upload_list);
    console.log('take_video_cutprocess_info:',take_video_cutprocess_info);

    if(upload_list.length >=1){
        /*if(upload_list.length==1){
            take_video_process_info=[];//넘어오는게 아마 없기에 
            //console.log('업로드 리스트가 한개 였던경우!:',upload_list);
            upload_list=await single_uploadvideo_twosplit_process(upload_list[0]);//해당 한개의 원본 미디어를 반으로 쪼갠 두개의 s3 url list를 넘기고 그걸 그것들을 업로드 원본 타깃 origin시작으로써 취급한다.
            //console.log('업로드 자원 한개였던 경우 두개로 쪼갠 형태로써의 시작한다::',upload_list);
            console.log('uploadlist:',upload_list);
            let result=await ffmpegNode.mergedVideos(upload_list);

            //console.log('병합 영상 처리결과:',result);
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
                        //console.log('what erross:',err);
                        return res.status(403).json({success:false,message:'server error'});
                    }
                    //console.log('대상체 파일 업로드 성공:',data);

                    return res.json({success:true, data:`${s3_origin_dns}clllap/${result}`,edittake_video_list:upload_list});

                });
                if(fs.existsSync(`./tmp/${result}`)){
                    // fs.unlinkSync(`./tmp/${result}`);
                }
                                    
            }else{
                return res.status(403).json({success:false,message:'server error'});
            }
        }*/
        let data_gathering_store=[];

        function extract_file_callback(data_gathering,request_id,orderindex){
            console.log('extract file callback함수호출]]]]]]]');

            console.log('=======>>transfer parsmteers data_gathering,requestid,:',data_gathering,request_id,orderindex);

            let store={};
            store['orderindex'] = orderindex;
            store['data_gathering'] = data_gathering;

            data_gathering_store.push(store);
        }
        function promise_function_standby(){
            //console.log('promise_function_standby promise함수 호출>>>>>>');

            return new Promise((resolve,reject)=>{
                let callback_timeout=0;
                let callback_standby= setInterval(function(){
                    if(data_gathering_store.length == take_video_cutprocess_info.length){
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
        for(let s=0; s<take_video_cutprocess_info.length; s++){
            let item=take_video_cutprocess_info[s];
            if(item.takeindex!='blackempty'){
                let result=ffmpegNode.video_subpart_slice_normal2(s+1,item['remoteurl'],extract_file_callback,request_id,take_video_cutprocess_info[s]);
            }else{
                let result=ffmpegNode.video_subpart_slice_emptyvideomake(s+1,extract_file_callback,request_id,take_video_cutprocess_info[s]);
            }   
        }
        let data_gathering=await promise_function_standby();
        data_gathering.sort(function(a,b){
            return a.orderindex - b.orderindex;
        })
        console.log('retunr out set reutn :',data_gathering);
      

        let videotakelist=[];
        for(let j=0; j<data_gathering.length; j++){
            videotakelist.push('./tmp/'+data_gathering[j]['data_gathering'][`${j+1}_data`]);
        }
        console.log('videotakelist:',videotakelist);
        let result=await ffmpegNode.mergedVideos(videotakelist,request_id);

        console.log('병합 영상 처리결과:',result);

        if(result && result.success){
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
                        if(s3upload_async_cnt == take_video_cutprocess_info.length){
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
                let target=data_gathering[s]['data_gathering'][`${s+1}_data`];//변환전 원본대상체 업로드 파일들 삭제한다
                //let convert_upload_target=result.subpartdata[s];
                //console.log('====>>convert files upload files:',convert_upload_target);

                bucket_params['Key']= `clllap/${target}`;//encoding$_id_
                bucket_params['Body']= fs.createReadStream(`./tmp/${target}`);//front buffer datas이다.
                
                s3upload_planlist.push(`${s3_origin_dns}clllap/${target}`);
                //이 시점엔 분할 프레임파일들 다 쓰여진것임.
                s3_client.upload(bucket_params,(err,data)=>{
                    if(err){
                        //console.log('what erross:',err);
                    }
                    //console.log('대상체 파일 업로드 성공:',data);
                    
                    s3upload_async_cnt++;
                });
                if(fs.existsSync(`./tmp/${target}`)){
                    //fs.unlinkSync(`./tmp/${target}`);
                }
                /*if(fs.existsSync(`./tmp/${convert_upload_target['data']}`)){
                    //fs.unlinkSync(`./tmp/${convert_upload_target['data']}`);
                }*/
            }
            let upload_standby=await s3upload_standby();
            console.log('upload_stnadby업로드 대기완료:',upload_standby,s3upload_planlist); 
            if(upload_standby){
                bucket_params['Key']= `clllap/${result.data}`;//encoding$_id_
                bucket_params['Body']= fs.createReadStream(`./tmp/${result.data}`);//front buffer datas이다.

                //이 시점엔 분할 프레임파일들 다 쓰여진것임.
                s3_client.upload(bucket_params,(err,data)=>{
                    if(err){
                        console.log('what erross:',err);
                        return res.status(403).json({success:false,message:'server error'});
                    }
                    //console.log('대상체 파일 업로드 성공:',data);

                    //return res.json({success:true, data:`${s3_origin_dns}clllap/${result.data}`,edittake_video_list:s3upload_planlist,common_timebase:result.lastvideo_timebase});
                    return res.json({success:true, data:`${s3_origin_dns}clllap/${result.data}`,edittake_video_list:s3upload_planlist});
                });
                if(fs.existsSync(`./tmp/${result['data']}`)){
                    // fs.unlinkSync(`./tmp/${result['data']}`);
                }
            }    
        } 
    }
})

app.post('/api/transition_and_effect_process_ver3',async(req,res)=>{
    console.log('=======================>transition and effect process requetsss START===============');//데이터를 넘겨옵니다.

    console.log('req.bodyss:',req.body);

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
    //let common_timebase=parseFloat(req.body.common_timebase);
    let request_id= makeid(20);//요청id값>>여기서부터가 요청시작으로 origin시작>>
    
    let effect=req.body.effect?req.body.effect:'{"overlay3.gif":"3~6","HUE_colorshow":"18~22"}';//어떤이펙트였던건지 {particles3.mp4:4~7,contours:10~13}이런포맷임. 
    effect=JSON.parse(effect);
    //let upload_list = req.body.upload_list_data.split(',');
    //let take_video_process_info=  req.body.take_video_process_info;
    /*if(take_video_process_info && take_video_process_info!='undefined'){
        take_video_process_info = JSON.parse(take_video_process_info);
    }*/
    //effect=JSON.parse(effect);
    let effect_two_sort=[];
    for(let key in effect){
        effect_two_sort.push(key);
    }
    let filter;
    let filter_start;let filter_end;
    let filter_value;
    let overlay;
    let overlay_start;let overlay_end;
    let overlay_value;
    for(let j=0; j<effect_two_sort.length; j++){
        let local_item=effect_two_sort[j];
        if(local_item.indexOf(".gif")!=-1){
            overlay=local_item;
            overlay_value=local_item;
            overlay_start=effect[overlay_value].split('~')[0];
            overlay_end=effect[overlay_value].split('~')[1];
        }else{
            filter=local_item;
            filter_value=local_item;
            filter_start=effect[filter_value].split('~')[0];
            filter_end=effect[filter_value].split('~')[1];
        }
    }

    console.log('overlayvalue,filter_value:',overlay_value,overlay_start,overlay_end);
    console.log('overlayvalue,filter_value:',filter_value,filter_start,filter_end);

    //filter,overlay이펙트 트랜지션 처리파일에 기반으로 하여 적용>>>
    //n개 올린경우 이 결과의 트랜지션파일(무음성,audio스트림x)에 대해서 30초결과물>> 이펙트 적용(음악에 따른 이펙트적용)+ 마지막에 음악copy
    let overlay_referval;let select_filter;
   
    overlay_referval=commonvar[overlay_value];
    if(!overlay_referval){
        overlay_referval=commonvar["overlay2.gif"];
    }
    
    select_filter=commonvar[filter_value];
    if(!select_filter){
        select_filter=commonvar['COLOR_CYAN']
    }

    console.log('===>적용필터,오버레이:',select_filter,overlay_referval);

    let transition_result_data;
    if(edittake_videolist.length >=1){
        
        if(transition_type=='ffmpeg'){
         //let distinct;
         let adapt_ffmpeg_transition='fade';

         /*fade,fdadeblack,fadewhite,distance,wipeleft,wiperight,wipeup,wipedown,slideleft,slideright,slideup,slidedown,smoothleft,smoothright,smoothup,smoothdown,circlecrop,rectcrop,circleclose,circleopen,horzclose,horzopen,vertclose,vertopen,diagbl,diagbr,diagtl,diagtr,hlslice,hrslice,vuslice,vdslice,dissovle,pixelize,radial,hblur,wipetl,wipetr,wipebl,wipebr,squeezev,squeezeh
         */
         switch(music){
             case '108':
                 adapt_ffmpeg_transition='fadewhite';
             break;
             case '109':
                 adapt_ffmpeg_transition='distance';
             break;
             case '110':
                 adapt_ffmpeg_transition='slideright';
             break;
             case '111':
                 adapt_ffmpeg_transition='smoothup';
             break;
             case '112':
                 adapt_ffmpeg_transition='rectcrop';
             break;

             case '1':
                 adapt_ffmpeg_transition='horzclose';
             break;
             case '2':
                 adapt_ffmpeg_transition='vertopen';
             break;
             case '3':
                 adapt_ffmpeg_transition='diagtl';
             break;
             case '4':
                 adapt_ffmpeg_transition='hrslice';
             break;
             case '5':
                 adapt_ffmpeg_transition='vuslice';
             break;
             case '6':
                 adapt_ffmpeg_transition='pixelize';
             break;
             case '7':
                 adapt_ffmpeg_transition='wipebl';
             break;

         }
         let transition_standby_gatherings=[];
         //let betweenper_iswritecomplete=0;

         function edge_extract_callback(data_gathering,request_id,takeindex){
             console.log('==>edged exxtardct callbacksss:<take별>>:',data_gathering);
             transition_standby_gatherings.push(data_gathering);
         }
         for(let j=0; j<edittake_videolist.length; j++){
             let subpart_video=edittake_videolist[j];

             let result=ffmpegNode.video_img_extract_edgepart(j+1,subpart_video,edge_extract_callback,request_id);
         }
         let promise_standby_=function(){
             return new Promise((resolve,reject)=>{
                 let inner_standbycnt=0;
                 let inner_standby=setInterval(function(){
                     if(transition_standby_gatherings.length==edittake_videolist.length){
                         clearInterval(inner_standby);
                         resolve(true);
                     }
                     if(inner_standbycnt==1500){
                         clearInterval(inner_standby);
                         reject(new Error("callback timeout error"));
                     }
                     inner_standbycnt++;
                 },400);
             });
         }
         try{
             var transition_standbyres=await promise_standby_();

         }catch(error){
             console.log('error messagesss:',error);
             return res.status(403).json({success:false,message:'server timeout error'})
         }

         console.log('=====>트랜지션 준비데이터 준비완료여부:',transition_standbyres,transition_standby_gatherings);

         if(!transition_standbyres){
             return res.status(403).json({success:false,message:"server timeout error"});
         }
         if(transition_standbyres){
             //let betweenper_transitionfiles=[];
             let output_merged_transitions=[];

             transition_standby_gatherings.sort(function(a,b){
                 return a.takeindex-b.takeindex;
             });
             console.log('===>정렬후 take별 framedata gatheringsss:',transition_standby_gatherings);

             async function between_transitionprocess(transition_standby_gatherings){
                 //트랜지션 fucntions startss==================================================
                 //장면별 트랜지션처리>>직렬구조 반복문 기반 인댁스값이 uplodate_list.lenght-1이면 마지막테이크정보라는것이고,이떄는 다음take정보가 없는것무시. 이 연산을통해 생성될 각 테이크별 요청별테이크별 사이드트랜지션 frame들 새로write되는것들 이들 기억.
                 try{
                     if(edittake_videolist.length==1){

                        let nowtake_startframe_data=transition_standby_gatherings[0]['1_start_data'];
                        let nowtake_lastframe_data=transition_standby_gatherings[0]['1_end_data'];

                        let result= await ffmpegNode.makeTransition(request_id,adapt_ffmpeg_transition,nowtake_startframe_data,nowtake_lastframe_data,1);//동기적으로 기다린다.
                        console.log('===>처리된 결과 frame사이 between트랜지션 between별 처리파일영상:',result);

                        /*if(fs.existsSync(nowtake_startframe_data)){
                            fs.unlinkSync(nowtake_startframe_data);
                        }
                        if(fs.existsSync(nowtake_lastframe_data)){
                            fs.unlinkSync(nowtake_lastframe_data);
                        }*/
                        output_merged_transitions.push({
                            'index': -1,
                            'outputpath':result
                        })
                     }else{
                         for(let t=0; t<transition_standby_gatherings.length; t++){
                             if(t!=transition_standby_gatherings.length-1){

                                 let nowtake_lastframe_data=transition_standby_gatherings[t][`${t+1}_end_data`];
                                 let nexttake_firstframe_data=transition_standby_gatherings[t+1][`${t+1+1}_start_data`];
                                 
                                 //let nowtake_startframe_data=transition_standby_gatherings[t][`${t+1}_start_data`];
                                //let nexttake_lastframe_data=transition_standby_gatherings[t][`${t+1+1}_end_data`];

                                 let result=await ffmpegNode.makeTransition(request_id,adapt_ffmpeg_transition,nowtake_lastframe_data,nexttake_firstframe_data,t+1);
                                 console.log('====>>처리된 결과frame사이 between트랜지션 between별 처리파일영상:',result);

                                 /*if(fs.existsSync(nowtake_lastframe_data)){
                                     fs.unlinkSync(nowtake_lastframe_data);
                                 }
                                 if(fs.existsSync(nexttake_firstframe_data)){
                                     fs.unlinkSync(nexttake_firstframe_data);
                                 }*/

                                 output_merged_transitions.push({
                                     'index': t+1,
                                     'outputpath':result
                                 })
                             }
                         }
                     }
                 }catch(error){
                     console.log('ffmpeg erross server errosss:',error);
                 }
                 //테이크별 반복문>>테이크별로 takecount-1수만큼의or 원테이크일때는 1번의 between비디오생성(make형태,concat형) ec2 >tmp파일시스템상에 파일생성됨.
             }
             between_transitionprocess(transition_standby_gatherings);

            function final_standby_promise(result,res){
                return new Promise((resolve,reject)=>{
                    let standby_cnt=0;
                    let standby=setInterval(function(){
                        console.log('======>대기::',output_merged_transitions);
                        if(edittake_videolist.length>1?(output_merged_transitions.length==edittake_videolist.length-1):(output_merged_transitions.length==1)){
                            clearInterval(standby);

                            console.log('======>outputMerged_transtionss모두 수집완료,처리완료::',output_merged_transitions);
                            resolve(true);
                        }
                        if(standby_cnt==2000){
                            clearInterval(standby);

                            reject(new Error("timeout error"));
                        }
                        standby_cnt++;
                    },500);
                })
            }

            try{
                var final_standby_complete=await final_standby_promise();
            }catch(error){
                console.log('errorsss:',error);
                return res.status(403).json({success:false,message:"server timeout error"});
            }

            if(!final_standby_complete){
                return res.status(403).json({success:false,message:"server timeout error"});
            }
            if(final_standby_complete){
                console.log("====>마지막 대기 관련 준비데이터 비디오들::",edittake_videolist,output_merged_transitions);

                for(let t=0; t<transition_standby_gatherings.length; t++){
                    let takeindex=transition_standby_gatherings[t]['takeindex'];
                    let start_frame=transition_standby_gatherings[t][`${takeindex}_start_data`];
                    let end_frame=transition_standby_gatherings[t][`${takeindex}_end_data`];

                    if(fs.existsSync(start_frame)){
                        fs.unlinkSync(start_frame);
                    }
                    if(fs.existsSync(end_frame)){
                        fs.unlinkSync(end_frame);
                    }
                }
                let return_set=await ffmpegNode.originals_and_betweentransition_merged_(request_id,edittake_videolist,output_merged_transitions,res);

                console.log('return reulstsss:',return_set);

                transition_result_data=return_set.output;
            }
         }
            
        }/*else if(transition_type=='opencv'){

            let distinct;
            let adapt_opencv_transition;
            switch(music){
                case '108':
                    distinct='transition_cut_simple';
                    adapt_opencv_transition=opencvfunctions1['transition_cut_simple'];
                break;
                case '109':
                    distinct='transition_Rotation_leftsimple';
                    adapt_opencv_transition=opencvfunctions1['transition_Rotation_leftsimple'];
                break;
                case '110':
                    distinct='transition_Rotation_rightsimple';
                    adapt_opencv_transition=opencvfunctions1['transition_Rotation_rightsimple'];
                break;
                case '111':
                    distinct='transition_Rotation_leftsimple';
                    adapt_opencv_transition=opencvfunctions1['transition_Rotation_leftsimple'];
                break;
                case '112':
                    distinct='transition_Rotation_rightsimple';
                    adapt_opencv_transition=opencvfunctions1['transition_Rotation_rightsimple'];
                break;
                case '4':
                    distinct='transition_noise_simple';
                    adapt_opencv_transition=opencvfunctions1['transition_noise_simple'];
                break;
                case '5':
                    distinct='transition_noise_simple';
                    adapt_opencv_transition=opencvfunctions1['transition_noise_simple'];
                break;
                default :
                    distinct='transition_cut_simple';
                    adapt_opencv_transition=opencvfunctions1['transition_cut_simple'];
                break;
            }

            let transition_standby_gatherings=[];
            let betweenper_iswritecomplete=0;

            
            function edge_extract_callback(data_gathering,request_id,takeindex){
               // console.log('====>subpart video start,endpart split infor callback:',data_gathering,request_id,takeindex);

                //let startpart_data= data_gathering[`${takeindex}_startpart_data`];
                //let endpart_data=data_gathering[`${takeindex}_endpart_data`];

                //let start_data=data_gathering[`${takeindex}_start_data`];
                //let end_data=data_gathering[`${takeindex}_end_data`];

              
                
                transition_standby_gatherings.push(data_gathering);//테이크별 시작,끝 종료 data저장.
            }
            for(let j=0; j<edittake_videolist.length; j++){
                let subpart_video = edittake_videolist[j];
                //console.log('대상 tmp subpart비디오:',subpart_video);

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
                            reject(new Error("callback timeout error"));
                        }
                        inner_standbycnt++;
                    },400);
                });
            }
            try{
                var transition_standbyres=await promise_standby_();
            }catch(error){
                console.log('error emssager:',error);
                return res.status(403).json({success:false,message:'server timeout error'});
            }
           
            console.log('===>>트랜지션 준비데이터 준비완료여부:',transition_standbyres,transition_standby_gatherings);

            if(!transition_standbyres){
                return res.status(403).json({success:false,message:'server timeout Error'});
            }
            if(transition_standbyres){

                let betweenper_transitionfiles=[];
                let transitionframes_imgarrays=[];
                let output_merged_transitions=[];

               // console.log('data gatheringsss:',transition_standby_gatherings);

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
                        if(edittake_videolist.length==1){
                            let temp_store={};

                            temp_store['betweenindex'] = -1;
                            temp_store['betweenper_transitionframes']=[];
                            temp_store['betweenper_transitionframes_referFormat']=`${request_id}_between0_transitionframe`;
                            betweenper_transitionfiles.push(temp_store);

                            let nowtake_startframe_data=transition_standby_gatherings[0][`1_start_data`];
                            //let nowtake_startframe_datacopy=nowtake_startframe_data;
                            let nowtake_lastframe_data= transition_standby_gatherings[0][`1_end_data`];//0:1_end_data,1:2_start_data / 2:3_end_data,3:4_start_data 

                            let now_startframe;
                            let next_startframe;
                            if(fs.existsSync(nowtake_startframe_data)){
                                now_startframe=await loadImage(nowtake_startframe_data);
                            }
                            if(fs.existsSync(nowtake_lastframe_data)){
                                next_startframe=await loadImage(nowtake_lastframe_data);
                            }

                            let between_start_s = cv.imread(now_startframe);
                            let between_end_s = cv.imread(next_startframe);//사용될 영상 별 사이 관련 이미지>>
                            
                            
                            let transition=[];
                            
                            transition = adapt_opencv_transition(between_start_s,between_end_s);//처리된 트랜지션 이미지 배열 객체mat배열객체>>
                            between_start_s.delete();between_end_s.delete();
                            now_startframe=null;next_startframe=null;
                            // console.log('각 between별 트랜지션 처리완료]]]]]]',transition);
        
                            for(let inner=0; inner<transition.length; inner++){
                                let mat=transition[inner];
                                let writecanvas = createCanvas(mat.cols,mat.rows);
                                cv.imshow(writecanvas,mat);
        
                                let delete_plan_pathlocal=`./tmp/${request_id}_between0_transitionframe${inner+1}.png`;//각 처리될(이미지처리) 모두 처리가 된 이후 프레임하나별로 모두 s3바로 업로드,삭제 반복한다>>
                                transitionframes_imgarrays.push(delete_plan_pathlocal);
                                //console.log('write filess:',delete_plan_pathlocal);
                                (function(inner,writecanvas){
                                    console.log('===>각 처리 트랜지션 이미지파일개체 및 관련자원해제위함:',inner,writecanvas);

                                    fs.writeFile(`./tmp/${request_id}_between0_transitionframe${inner+1}.png`,writecanvas.toBuffer('image/png'),(err)=>{
                                        if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
                                        console.log('the file has been asaved!!!(EFFECT OPENCV)');
                                        
                                        betweenper_iswritecomplete++;
    
                                        console.log('opencvTransitioneffect적용 저장파일 후 writecanvas해제:(mat,transitionsss)',inner,writecanvas,mat,transition[inner]);
                                        writecanvas=null;
                                    });
                                    //mat.delete();
                                    transition[inner].delete();mat=null;transition[inner]=null;
                                })(inner,writecanvas);
                                                      
                            }

                        }else{
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
                                   // console.log('현재 take index및 관련하여 생성되는 프레임장면between periods:[[TRANSIJTION EFFECT]]',nowtake_lastframe_data, nexttake_firstframe_data);//now~next씩 하여 uploadcnt-1의 장면들 생성된다.
                                    //console.log('between별(TRANSITION)소스 시작~종료이미지:',nowtake_lastframe_data,nexttake_firstframe_data);
                                    
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
                                    
                                   // console.log('===now lastframess:',now_lastframe);
                                   // console.log('===>next firstframesss:',next_firstframe);
                
                                    //let between_start_s= cv.matFromImageData(now_lastframe.bitmap);
                                    //let between_end_s = cv.matFromImageData(next_firstframe.bitmap);//각 사이장면별 betweenstart,end bitmap array형태 console.log 은닉됨.
                                    let between_start_s = cv.imread(now_lastframe);
                                    let between_end_s = cv.imread(next_firstframe);//사용될 영상 별 사이 관련 이미지>>
                                    
                                    //console.log('===now lastframess:',between_start_s);
                                   // console.log('===>next firstframesss:',between_end_s);
                
                                    let transition=[];
                                  
                                    transition = adapt_opencv_transition(between_start_s,between_end_s);//처리된 트랜지션 이미지 배열 객체mat배열객체>>
                                    between_start_s.delete();between_end_s.delete();
                                    now_lastframe=null;next_firstframe=null;
                                   // console.log('각 between별 트랜지션 처리완료]]]]]]',transition);
                
                                    for(let inner=0; inner<transition.length; inner++){
                                        let mat=transition[inner];
                                        let writecanvas = createCanvas(mat.cols,mat.rows);
                                        cv.imshow(writecanvas,mat);
                
                                        let delete_plan_pathlocal=`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`;//각 처리될(이미지처리) 모두 처리가 된 이후 프레임하나별로 모두 s3바로 업로드,삭제 반복한다>>
                                        transitionframes_imgarrays.push(delete_plan_pathlocal);
                                        //console.log('write filess:',delete_plan_pathlocal);

                                        (function(inner,writecanvas){
                                            console.log('=====>각 처리 트랜지션 이미지파일개체 및 관련자원해제위함:',inner,writecanvas);

                                            fs.writeFile(`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`,writecanvas.toBuffer('image/png'),(err)=>{
                                                if(err) console.log('FILE WRITE ERROR(FILTER OVERLAY EFFECT):',err);
                                                console.log('the file has been asaved!!!(EFFECT OPENCV)');
                                                
                                                betweenper_iswritecomplete++;

                                                console.log('opencvTrnasitioneffect적용 저장파일후 writecanvas해제:(mat,transitonsss):',inner,writecanvas,mat,transition[inner]);
                                                writecanvas=null;
                                            });
                                           // fs.writeFileSync(`./tmp/${request_id}_between${t+1}_transitionframe${inner+1}.png`,writecanvas.toBuffer('image/png'));
                                           //mat.delete();
                                           transition[inner].delete();mat=null;transition[inner]=null;
                                        })(inner,writecanvas);
                                      
                                    }
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
                            if(edittake_videolist.length>1 ? (betweenper_iswritecomplete == (26*(transition_standby_gatherings.length-1))):(betweenper_iswritecomplete == 26) ){
                                clearInterval(inner_standby);
                               // console.log('트랜지션 프레임 이미지들 전체 준비완료:',betweenper_transitionfiles);
                                
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
                try{
                    var transition_standby_complete = await transitioneffect_standby_promise();

                }catch(error){
                    console.log('error sstimeoutss:',error);
                    return res.status(403).json({success:false,message:'server timeout error'});
                }
                console.log('transiton standby completess:',betweenper_transitionfiles,edittake_videolist);


                function inner_callback(result,res){
                    console.log('내부 콜백실행>>outputfile path<<transitionprocess filess>>받기::',result);//처리된 파일자체의 경로를 전달주고 이들끼리합친다.
            
                    let between_index=result.index;
                    let outputpath=result.outputpath;

                    output_merged_transitions.push({
                    'index' : between_index,
                    'outputpath': `./tmp/${outputpath}`   
                    });   
                  
                }     
                for(let b=0; b<betweenper_transitionfiles.length; b++){
                    let item=betweenper_transitionfiles[b];

                    ffmpegNode.between_transition_merged_(request_id,item['betweenper_transitionframes_referFormat'],inner_callback,res,b+1);
                }
               
                let final_standby_promise = function(){
                    return new Promise((resolve,reject)=>{
            
                        let standby_cnt=0;
                        let standby = setInterval(function(){
                            console.log('===>?대기::',output_merged_transitions);
                            if(edittake_videolist.length > 1 ? (output_merged_transitions.length == edittake_videolist.length-1) : (output_merged_transitions.length==1)){
                                //console.log('final 대기 종료:',output_merged_transitions);
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

                try{
                    var final_standby_complete=await final_standby_promise();
                }catch(error){
                    console.log('error:',error);
                    return res.status(403).json({success:false,message:'server timeout error'});
                }
                
                if(!final_standby_complete){
                    return res.status(403).json({success:false,message:'server timeout error'});
                }
                if(final_standby_complete){
                    console.log('마지막 대기 관련 준비데이터 비디오들:',edittake_videolist,output_merged_transitions);

                    for(let t=0; t<transition_standby_gatherings.length; t++){
                        let takeindex=transition_standby_gatherings[t]['takeindex'];
                        let start_frame=transition_standby_gatherings[t][`${takeindex}_start_data`];
                        let end_frame=transition_standby_gatherings[t][`${takeindex}_end_data`];
    
                        if(fs.existsSync(start_frame)){
                            fs.unlinkSync(start_frame);
                        }
                        if(fs.existsSync(end_frame)){
                            fs.unlinkSync(end_frame);
                        }
                    }

                    let return_set=await ffmpegNode.originals_and_betweentransition_merged_(request_id,edittake_videolist,output_merged_transitions,res);

                    console.log('return resultsss:',return_set);

                    //transition_result_data='./tmp/'+return_set.output;
                    transition_result_data=return_set.output;
                }
            }
        }*/
        //'./tmp/'+transition_result_data
        console.log('==>>트랜지션 처리 비디오 대상체:',transition_result_data);
        let return_setss=await ffmpegNode.videoblending(request_id,transition_result_data,overlay_referval,overlay_start,overlay_end);//어떤오버레이타입인지도.
        console.log('===>트랜지션 with blending effecdctss :',return_setss);
        return_setss=await ffmpegNode.videoEffecting(request_id,return_setss,select_filter,filter_start,filter_end);//어떤비디오효과인지.
        console.log('===>with blending effecdctss and effectss!! :',return_setss);


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

        if(return_setss !=''){
            //console.log('반영 병합 최종파일 response returnsss:',final_result);

            let s3_parameters=s3.uploadParams;
            
            s3_parameters.Key=`clllap/${return_setss}`;
            s3_parameters.Body = fs.createReadStream('./tmp/'+return_setss);

            //console.log('s3 paramterss refer spacess:',s3_parameters);
            let s3_client=s3.s3client;

            s3_client.upload(s3_parameters,async (err,data)=>{
                if(err){
                    console.log('what errosss:',err);
                    return false;
                }
                //console.log('s3 final전달 파일 여부 성공여부:',data);

                let result=await ffmpegNode.mergedAudio(return_setss,music_select,request_id);
               // console.log("==>> 영상 오디오 처리완료...>>:",result);

                let s3_parameters=s3.uploadParams;

                s3_parameters.Key=`clllap/${result[0]}`;
                s3_parameters.Body = fs.createReadStream(`./tmp/${result[0]}`);

                //console.log('s3 paramterss refer spacess:',s3_parameters);
    
                s3_client.upload(s3_parameters,(err,data)=>{
                    if(err){
                        //console.log('what errosss:',err);
                        
                        return res.status(403).json({success:false,message:'server ERROR'});
                    }
                    //console.log('s3 final전달 파일 여부 성공여부(AUDIO MIX):',data);
                    
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
console.log('==================>>NODEJS EXPRESS SERVER EXEUCTES ENDLINES================================================');



//================================================================================================================================================================================================================================================================================
//deprecated....
app.post('/api/transition_and_effect_process_after',async(req,res)=>{
    console.log('=======================>transition and effect process _after requetsss START===============');//데이터를 넘겨옵니다.

    console.log('req.bodyss:',req.body);

    let target_url=req.body.target_url;//타깃파일.
    let target_url2=req.body.target_url2;//트랜지션만있는.
    //let select_overlay= req.body.select_overlay;
    //let select_filter =req.body.select_filter;
    let music = req.body.music; //어떤 음원넣을건지.
    let effect=req.body.effect;//어떤이펙트였던건지 {particles3.mp4:4~7,contours:10~13}이런포맷임. 
    effect=JSON.parse(effect);
    //let upload_list = req.body.upload_list_data.split(',');
    //let take_video_process_info=  req.body.take_video_process_info;
    /*if(take_video_process_info && take_video_process_info!='undefined'){
        take_video_process_info = JSON.parse(take_video_process_info);
    }*/
    let request_id= makeid(20);//요청id값>>여기서부터가 요청시작으로 origin시작>>

    let transition_video_extract_datas= await ffmpegNode.video_img_extract_total(target_url,request_id);
    console.log('결과!!!:',transition_video_extract_datas);
    effect=JSON.parse(effect);
    let effect_two_sort=[];
    for(let key in effect){
        effect_two_sort.push(key);
    }
    let filter;
    let filter_start;let filter_end;
    let filter_value;
    let overlay;
    let overlay_start;let overlay_end;
    let overlay_value;
    for(let j=0; j<effect_two_sort.length; j++){
        let local_item=effect_two_sort[j];
        if(local_item.indexOf(".mp4")!=-1){
            overlay=local_item;
            overlay_value=local_item;
            overlay_start=effect[overlay_value].split('~')[0];
            overlay_end=effect[overlay_value].split('~')[1];
        }else{
            filter=local_item;
            filter_value=local_item;
            filter_start=effect[filter_value].split('~')[0];
            filter_end=effect[filter_value].split('~')[1];
        }
    }

    console.log('overlayvalue,filter_value:',overlay_value,overlay_start,overlay_end);
    console.log('overlayvalue,filter_value:',filter_value,filter_start,filter_end);

    //filter,overlay이펙트 트랜지션 처리파일에 기반으로 하여 적용>>>
    //n개 올린경우 이 결과의 트랜지션파일(무음성,audio스트림x)에 대해서 30초결과물>> 이펙트 적용(음악에 따른 이펙트적용)+ 마지막에 음악copy
    let overlay_referval;let select_filter;
    switch(overlay_value){
        case 'lensflaress6.mp4':
            //overlay_referval = commonvar.FIREWORKS16;
            overlay_referval = commonvar.LENSFLARE6;

        break;
        case 'lensflaress7.mp4':
            overlay_referval = commonvar.LENSFLARE7;
            //overlay_referval = commonvar.FIREWORKS16;
        break;
        case 'fireworks16.mp4':
            overlay_referval = commonvar.FIREWORKS16;
            //overlay_referval = commonvar.FIREWORKS16;
        break;
        case 'fireworks3.mp4':
            overlay_referval = commonvar.FIREWORKS3;
            //overlay_referval = commonvar.FIREWORKS16;
        break;
        case 'particles1.mp4':
            overlay_referval = commonvar.PARTICLES1;
            //overlay_referval = commonvar.FIREWORKS16;
        break;
        case 'particles3.mp4':
            overlay_referval = commonvar.PARTICLES3;
            //overlay_referval = commonvar.FIREWORKS16;
        break;
        case 'rain16.mp4':
            overlay_referval = commonvar.RAIN16;
        // overlay_referval = commonvar.FIREWORKS16;
        break;
        case 'rain18.mp4':
            overlay_referval = commonvar.RAIN18;
            //overlay_referval = commonvar.FIREWORKS16;
        break;
    }   
    switch(filter_value){
        case 'hsv':
            select_filter= 'hsv';
        break;
        case 'contours':
            select_filter= 'contours';
        break;
        case 'inRange':
            select_filter='inRange';
        break;
        case 'adaptiveThreshold':
            select_filter='adaptiveThreshold';
        break;
        case 'laplacian':
            select_filter='laplacian';
        break;
        
    }   

    console.log('===>적용필터,오버레이:',select_filter,overlay_referval);

    effectprocess(transition_video_extract_datas,request_id);
    let is_effect_complete=false;
    async function effectprocess(transition_video_extract_datas,request_id){
        //console.log('-====>>effectprocess[[EFFECT PROCESS FUNCTION executesss]]]',transition_video_extract_datas,request_id,transition_video_extract_datas['framefiles_nameformat']);

        //let total_frame_data= data_gathering[`${takeindex}_full_data_plans3`];//s3위치값입니다. 
        let total_frame_data=transition_video_extract_datas[`frame_full_data`];//ec2 tmp위치값입니다. nodejs -> s3 이미지 refer참조시 대량으로 참조하는경우에 경우에 따라서 tls,https,socket관련 이슈가 필연적 발생할수가 있어, 네트웤관련 문제 발생하여 로직구현에 영향을 미침.

        //let video_duration = total_frame_data.length / 26;//s값. 실행형태로 넘어온 테이크별 duration값>>>
        let video_duration = transition_video_extract_datas['video_duration'];
        let avg_frame_rate= transition_video_extract_datas['avg_frame_rate'];

        //필터 효과 지정될 랜덤구간 inex프레임범위 지정 statarts  filter 1 구간.
        /*let random_index1 =Math.floor(video_duration*Math.random());
        random_index1 +=1;  
        let random_start1 = random_index1 - 2 < 0?0:random_index1 - 2;
        let random_end1 = random_index1;//6  4~6 5~7  3 1~3 2 0~2 1 -1~1:0~1 */    
        let take_range_start1 = parseInt(avg_frame_rate * (filter_start)+1);
        let take_range_end1 = parseInt(avg_frame_rate * (filter_end));

        console.log('filter1반영구간::',take_range_start1,take_range_end1);

        //filter1 adapts...
        console.log('====>filter1 adapt start===========================>');
        for(let t=0; t<total_frame_data.length; t++){
            let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
            //console.log('adapt frames omdex',t+1,local_original_frame);
            let result;//프레임별(take) 범위의 forloop 범위의 변수.

            if((take_range_start1 <= t+1 && t+1 <= take_range_end1)){
                //console.log('===>filter1 effect adapt',t+1,take_range_start1,take_range_end1)

                //let original_frame_source= await Jimp.read(local_original_frame);
                //let target_src= cv.matFromImageData(original_frame_source.bitmap);//원본 각 프레임이미지

                if(fs.existsSync(local_original_frame)){
                    let original_frame_source = await loadImage(local_original_frame);//tmp상의 관련 encodingframes요청 소켓사용??
                    let target_src = cv.imread(original_frame_source);//대상  ==>>원본 이미지 정보 매트릭스
                    //console.log('original_frames_sroucess!!!:',original_frame_source);
                    //console.log('targert_srcc!!!:',target_src)
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
        console.log('====>filter adapt end===========================>');
            
        //오버레이 효과 지정될 랜덤구간 index프레임범위 지정startss 3효과 구간
        /*let random_index3 = Math.floor(video_duration*Math.random());
        random_index3 += 1;
        let random_start3 = random_index3 -1 <0?0:random_index3 - 1;
        let random_end3 = random_index3;  */    
        let take_range_start3 = parseInt(avg_frame_rate*(overlay_start)+1);
        let take_range_end3= parseInt(avg_frame_rate*(overlay_end));

        console.log('overlay범위:',take_range_start3,take_range_end3);
        //console.log('overlay2범위:',random_start4,random_end4,take_range_start4,take_range_end4);

        console.log('====>overlay adapt startss===========================>');
        let overlay_index=20;
        for(let t=0; t<total_frame_data.length; t++){
            let local_original_frame= total_frame_data[t];// ec2경로값. 동일 http:프로토콜 자신localserver요청 
            //console.log('overlay adapt frames omdex',t+1,local_original_frame);

            if((take_range_start3 <= t+1 && t+1 <= take_range_end3)){
                //오버레이 범위에만 속했던 경우
                //console.log('===>>오버레이 속하는 경우:',t+1,take_range_start3,take_range_end3);
    
                if(fs.existsSync(local_original_frame)){
                    try{
                        //let original_frame_source= await Jimp.read(local_original_frame);//원본소스
                        let original_frame_source = await loadImage(local_original_frame);
                        let target_src = cv.imread(original_frame_source);

                        //console.log('original_frame_source:',original_frame_source);

                        //오버레이반영
                        let src_overlay=new cv.Mat();
                        //console.log('==>읽을 오버레이path:,origilnaframesource path:',local_original_frame,`${overlay_referval}${overlay_index+1}.png`);
                        //let src_overlayimage= await Jimp.read(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 범위 1~52범위 테이크별 관련 대상체를 remote읽는다.
                        let src_overlayimage = await loadImage(`${overlay_referval}${overlay_index+1}.png`);
                        //src_overlay = cv.matFromImageData(src_overlayimage.bitmap);//오버레이 대상 이미지의 metrix데이터입니다.
                        src_overlay = cv.imread(src_overlayimage);

                        let overlay_dst= new cv.Mat();
        
                        cv.addWeighted(target_src,1,src_overlay,1,0.0,overlay_dst,-1);//overlay_dst에 관련 메트릭스 효과 반영되며 이를 파일로 저장필요. 한개 오버레이이펙트효과

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
                    //console.log('트랜지션처리>>이펙트,필터 처리 모두완료}}>>>>');
                    //console.log('transition_video_extract_datas',transition_video_extract_datas);

                    clearInterval(final_standby);

                    let result= await ffmpegNode.video_frames_merged(request_id,transition_video_extract_datas);
                    
                    console.log('====+>>최종 비디오 출력파일::]]]]',result);

                    resolve(result);
                }

                if(final_standbycnt == 400){
                    clearInterval(final_standby);
                    reject(new Error('timeout error'));
                }

                final_standbycnt++;
            },1200);             
        });
    }
    try{
        var final_result=await final_standby(transition_video_extract_datas);
    }catch(error){
        console.log('error:',error);
        return res.status(403).json({success:false,message:'server timeout error'});
    }
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
        //console.log('반영 병합 최종파일 response returnsss:',final_result);

        let s3_parameters=s3.uploadParams;
        
        s3_parameters.Key=`clllap/${final_result}`;
        s3_parameters.Body = fs.createReadStream('./tmp/'+final_result);

        //console.log('s3 paramterss refer spacess:',s3_parameters);
        let s3_client=s3.s3client;

        s3_client.upload(s3_parameters,async (err,data)=>{
            if(err){
                console.log('what errosss:',err);
                return false;
            }
            //console.log('s3 final전달 파일 여부 성공여부:',data);

            let result=await ffmpegNode.mergedAudio(final_result,music_select,request_id);
            // console.log("==>> 영상 오디오 처리완료...>>:",result);

            let s3_parameters=s3.uploadParams;

            s3_parameters.Key=`clllap/${result[0]}`;
            s3_parameters.Body = fs.createReadStream(`./tmp/${result[0]}`);

            //console.log('s3 paramterss refer spacess:',s3_parameters);

            s3_client.upload(s3_parameters,(err,data)=>{
                if(err){
                    //console.log('what errosss:',err);
                    
                    return res.status(403).json({success:false,message:'server ERROR'});
                }
                //console.log('s3 final전달 파일 여부 성공여부(AUDIO MIX):',data);
                
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

});//media Process api functions ends===============================
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
                   // console.log('====>====>standbysss singlemeida to split ttwo videos standby outpuyts: complettesss :]]',singleupload_twosplit_iscomplete);

                    clearInterval(standbys);

                    //api final returns;;

                    upload_originalEncodedlist.push(singleupload_twosplit_iscomplete[0]['output_plan_s3path']);
                    upload_originalEncodedlist.push(singleupload_twosplit_iscomplete[1]['output_plan_s3path']);//singleupload two split video files

                   // console.log('=======================미디어 분할 관련 프로미스 호출>>> FINAL RETURNS=======>>,',upload_originalEncodedlist);

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
