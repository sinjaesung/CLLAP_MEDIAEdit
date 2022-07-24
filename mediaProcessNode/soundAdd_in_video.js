const express=require('express');
const fs=require('fs');
const fileUpload=require('express-fileupload');
const app=express();
const port=3000;

const ffmpeg=require('./ffmpegControl');

console.log('what dir namesss??:',__dirname);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//var publicpath=path.resolve(__dirname,'public');
//var useruploadpath=path.resolve(__dirname,'process/files/concat/');

app.use('/public',express.static('public'));
app.use('/processfiles',express.static('process/files/concat'));
app.use(fileUpload());

app.set('view engine','ejs');
app.set('views','views2');

app.get('/',(req,res)=>{
    res.render('index2')
});

app.listen(port, ()=>{
    console.log('server starttsss music version soundaddVerson');
});

const dir=`D:/FFMPEG/program_/service/process/files/`;
//const musicdir=`D:/FFMPEG/program/service/process/musicupload/`;음원은 제공하는형태..

const tmpdir=`${dir}tmp/`;
const concatdir=`${dir}concat/`;

app.post('/upload',(req,res,next)=>{
    let uploadfile=req.files.file;//n개 합쳐진 영상과 임의의 대상파일과 음원(wav,mp3 파일끼리 합치는)
    let audio_select=req.body.audio_select;//1,2,3,.....
    console.log('upload post requestss:',uploadfile,uploadfile.length,audio_select);


    //let musicfile=req.files.music;
    //let musicfilename=makeid(20) + musicfile.name;

   /* musicfile.mv(`${musicdir}${musicfilename}`,function(err){
        console.log('음원파일 단일한개 업로드 처리>>');
        if(err){
            console.log('one errrosss:',err);
        }
    });*/
    //for(var i=0; i<uploadfile.length; i++){
    
    //let savedPath=makeid(20);
    let filename=makeid(20)+ uploadfile['name'];
    console.log('save file namess:',filename);

    uploadfile.mv(`${dir}${filename}`,function(err){
        console.log('what errorrss:',err);
        if(err){
            console.log('one errsss:',err);
        }else{
            
            //if(!fs.existsSync(`${dir}${savedPath}`)) fs.mkdirSync(`${dir}${savedPath}`);
            if(!fs.existsSync(tmpdir)) fs.mkdirSync(tmpdir);
            if(!fs.existsSync(concatdir)) fs.mkdirSync(concatdir);
        }
        ffmpeg.mergedAudio(`${dir}${filename}`,res,audio_select);//대상 업로드처리한 대상파일패스path값 전달>>
        
    })
    
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
})

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