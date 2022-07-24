import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {ffprint, today} from './util';
import {RNFFmpeg,RNFFmpegConfig,RNFFprobe} from 'react-native-ffmpeg';

import {
    setEnvironmentVariable,
    setFontconfigConfigurationPath,
    setFontDirectory
} from './react-native-ffmpeg-api-wrapper';

export default class VideoUtil {
    static get ASSET_1() {
        return "pyramid.jpg";
    }

    static get ASSET_2() {
        return "colosseum.jpg";
    }

    static get ASSET_3() {
        return "tajmahal.jpg";
    }

    static get SUBTITLE_ASSET() {
        return "subtitle.srt";
    }

    static get FONT_ASSET_1() {
        return "doppioone_regular.ttf";
    }

    static get FONT_ASSET_2() {
        return "truenorg.otf";
    }

    static async registerAppFont() {
        let fontNameMapping = new Map();
        fontNameMapping["MyFontName"] = "Doppio One";
        setFontDirectory(RNFS.CachesDirectoryPath, fontNameMapping);
        setFontconfigConfigurationPath(RNFS.CachesDirectoryPath);
        setEnvironmentVariable("FFREPORT", "file=" +
            RNFS.CachesDirectoryPath + "/" + today() + "-ffreport.txt");
    }

    static async prepareAssets() {
        await VideoUtil.assetToFile(VideoUtil.ASSET_1);
        await VideoUtil.assetToFile(VideoUtil.ASSET_2);
        await VideoUtil.assetToFile(VideoUtil.ASSET_3);
        await VideoUtil.assetToFile(VideoUtil.SUBTITLE_ASSET);
        await VideoUtil.assetToFile(VideoUtil.FONT_ASSET_1);
        await VideoUtil.assetToFile(VideoUtil.FONT_ASSET_2);
    }

    static async assetToFile(assetName) {
        let fullTemporaryPath = VideoUtil.assetPath(assetName);

        if (Platform.OS === 'android') {
            await RNFS.copyFileAssets(assetName, fullTemporaryPath)//캐시저장소(임시저장소)에 있는것을 rnProject 안드로이드의 assets폴더(외부저장소:공용)에 카피저장한다. 
                .then(_ => ffprint(`Asset ${assetName} saved to file at ${fullTemporaryPath}.`))
                .catch((err) => {
                    ffprint(`Failed to save asset ${assetName} to file at ${fullTemporaryPath}, err message: ${err.message}, err code: ${err.code}`);
                });
        } else {
            ffprint(`Asset ${assetName} loaded as file at ${fullTemporaryPath}.`);
        }

        return fullTemporaryPath;
    }

    static deleteFile(videoFile) {
        console.log('video_utilsasss delteFiless:',videoFile);
        return RNFS.unlink(videoFile).catch(_ => _);//물리적 파일삭제가 아니라, 파일을 메모리상에서 연결해제로 보인다.
    }

    static assetPath(assetName) {
        if (Platform.OS === 'ios') {
            return VideoUtil.iosAssetPath(assetName);//mainBundlePath/aseetName
        } else {
            console.log('androidasssetPathss:',VideoUtil.androidAssetPath(assetName));
            return VideoUtil.androidAssetPath(assetName);//rnfs.CahceDIrectoyPath/aseetname
        }
    }

    static androidAssetPath(assetName) {
        return `${RNFS.CachesDirectoryPath}/${assetName}`;
    }

    static iosAssetPath(assetName) {
        return `${RNFS.MainBundlePath}/${assetName}`;
    }

    static generateEncodeVideoScript(image1Path, image2Path, image3Path, videoFilePath, videoCodec, customOptions) {
        return "-hide_banner -y -loop 1 -i '" + image1Path + "'   " +
            "-loop 1 -i   \"" + image2Path + "\" " +
            "-loop 1 -i  \"" + image3Path + "\" " +
            "-filter_complex " +
            "\"[0:v]setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1,split=2[stream1out1][stream1out2];" +
            "[1:v]setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1,split=2[stream2out1][stream2out2];" +
            "[2:v]setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1,split=2[stream3out1][stream3out2];" +
            "[stream1out1]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=3,select=lte(n\\,90)[stream1overlaid];" +
            "[stream1out2]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=1,select=lte(n\\,30)[stream1ending];" +
            "[stream2out1]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=2,select=lte(n\\,60)[stream2overlaid];" +
            "[stream2out2]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=1,select=lte(n\\,30),split=2[stream2starting][stream2ending];" +
            "[stream3out1]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=2,select=lte(n\\,60)[stream3overlaid];" +
            "[stream3out2]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=1,select=lte(n\\,30)[stream3starting];" +
            "[stream2starting][stream1ending]blend=all_expr=\'if(gte(X,(W/2)*T/1)*lte(X,W-(W/2)*T/1),B,A)\':shortest=1[stream2blended];" +
            "[stream3starting][stream2ending]blend=all_expr=\'if(gte(X,(W/2)*T/1)*lte(X,W-(W/2)*T/1),B,A)\':shortest=1[stream3blended];" +
            "[stream1overlaid][stream2blended][stream2overlaid][stream3blended][stream3overlaid]concat=n=5:v=1:a=0,scale=w=640:h=424,format=yuv420p[video]\"" +
            " -map  [video] -vsync 2 -async 1   " + customOptions + "-c:v   " + videoCodec.toLowerCase() + "  -r 30  " + videoFilePath + " ";
    }

    static generateShakingVideoScript(image1Path, image2Path, image3Path, videoFilePath) {
        return "-hide_banner -y -loop 1 -i \"" +
            image1Path +
            "\" " +
            "-loop 1 -i '" +
            image2Path +
            "' " +
            "-loop 1 -i " +
            image3Path +
            " " +
            "-f lavfi -i color=black:s=640x427 " +
            "-filter_complex \"" +
            "[0:v]setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1[stream1out];" +
            "[1:v]setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1[stream2out];" +
            "[2:v]setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1[stream3out];" +
            "[stream1out]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=3[stream1overlaid];" +
            "[stream2out]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=3[stream2overlaid];" +
            "[stream3out]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=3[stream3overlaid];" +
            "[3:v][stream1overlaid]overlay=x=\'2*mod(n,4)\':y=\'2*mod(n,2)\',trim=duration=3[stream1shaking];" +
            "[3:v][stream2overlaid]overlay=x=\'2*mod(n,4)\':y=\'2*mod(n,2)\',trim=duration=3[stream2shaking];" +
            "[3:v][stream3overlaid]overlay=x=\'2*mod(n,4)\':y=\'2*mod(n,2)\',trim=duration=3[stream3shaking];" +
            "[stream1shaking][stream2shaking][stream3shaking]concat=n=3:v=1:a=0,scale=w=640:h=424,format=yuv420p[video]\"" +
            " -map [video] -vsync 2 -async 1 -c:v mpeg4 -r 30 " +
            videoFilePath;
    }

    static generateCreateVideoWithPipesScript(image1Pipe, image2Pipe, image3Pipe, videoFilePath) {
        console.log('HMMM genearteCreateVideoWithPIiPOESs scripts:',image1Pipe,image2Pipe,image3Pipe);
        return "-hide_banner -y -i \"" +
            image1Pipe +
            "\" " +
            "-i '" +
            image2Pipe +
            "' " +
            "-i " +
            image3Pipe +
            " " +
            "-filter_complex \"" +
            "[0:v]loop=loop=-1:size=1:start=0,setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1,split=2[stream1out1][stream1out2];" +
            "[1:v]loop=loop=-1:size=1:start=0,setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1,split=2[stream2out1][stream2out2];" +
            "[2:v]loop=loop=-1:size=1:start=0,setpts=PTS-STARTPTS,scale=w=\'if(gte(iw/ih,640/427),min(iw,640),-1)\':h=\'if(gte(iw/ih,640/427),-1,min(ih,427))\',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=sar=1/1,split=2[stream3out1][stream3out2];" +
            "[stream1out1]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=3,select=lte(n\\,90)[stream1overlaid];" +
            "[stream1out2]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=1,select=lte(n\\,30)[stream1ending];" +
            "[stream2out1]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=2,select=lte(n\\,60)[stream2overlaid];" +
            "[stream2out2]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=1,select=lte(n\\,30),split=2[stream2starting][stream2ending];" +
            "[stream3out1]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=2,select=lte(n\\,60)[stream3overlaid];" +
            "[stream3out2]pad=width=640:height=427:x=(640-iw)/2:y=(427-ih)/2:color=#00000000,trim=duration=1,select=lte(n\\,30)[stream3starting];" +
            "[stream2starting][stream1ending]blend=all_expr=\'if(gte(X,(W/2)*T/1)*lte(X,W-(W/2)*T/1),B,A)\':shortest=1[stream2blended];" +
            "[stream3starting][stream2ending]blend=all_expr=\'if(gte(X,(W/2)*T/1)*lte(X,W-(W/2)*T/1),B,A)\':shortest=1[stream3blended];" +
            "[stream1overlaid][stream2blended][stream2overlaid][stream3blended][stream3overlaid]concat=n=5:v=1:a=0,scale=w=640:h=424,format=yuv420p[video]\"" +
            " -map [video] -vsync 2 -async 1 -c:v mpeg4 -r 30 " +
            videoFilePath;
    }

    //영상분할 테스트스크립트
    static generateTestScript(filepath,videoFilePath){
        console.log('hmmm generateTestscritpss:',filepath,videoFilePath);
        return "-hide_banner -y -i \"" +
        filepath +
        "\" " +
        " "+
        "-ss 0 " +
        "-to 5 " +
        "-vf \"negate\"" +
        " -vsync 2 -async 1 -c:v mpeg4 -r 30 " +
        videoFilePath;
    }
    //비디오컷분할
    static video_subpart_slice_normal2(takeindex,filepath,take_video_cutprocess_info,cachetempPath){
        console.log('generateSplicescriptsss executes:',filepath,cachetempPath);
        let commands=[];

        //var iscomplete=false;
        //var data_gathering={};
    
        if(filepath!=''){
            //let edited_endpos=take_video_cutprocess_info['endpos'];
            //let edited_startpos=take_video_cutprocess_info['startpos'];
            let edited_endpos=take_video_cutprocess_info['video_real_timeline_endpos'];//실제비디오자를끝
            let edited_startpos=take_video_cutprocess_info['video_real_timeline_startpos'];//실제비디오자를시작

            //commands=['-ss',`${edited_startpos}`,'-to',`${edited_endpos}`,'-i',filepath,'-r','26','-an',`${cachetempPath}`];
            //commands=['-ss',`0`,'-to','5','-i','file:///storage/emulated/0/DCIM/Camera/20190825_172852.mp4','-r','26','-an','-y','/data/user/0/com.arthenica.reactnative.ffmpeg.test/cache/video_subpart.mp4'];
            //console.log('==>>처리(video_subpart_slice_normal2) ffmpeg인자목록:',commands);

            /*videocodecsss
            libx264,libopenh264,libx265,libxvid,libvpx,libvpx-vp9,libaom-av1,libkvazaar,libtheora
            */
            return `-y -ss ${edited_startpos} `+
            ` -to ${edited_endpos} `+
            ` -i ${filepath} `+
            ` -vf \"scale=720x1280,setdar=9/16\" `+
            ` -r 26 `+
            //` -c:v mpeg4 `+
            ` -c:v libx264 `+
            ` -preset ultrafast `+
            ` -crf 26 ` + 
            `-an `+
            cachetempPath;       
        }
    }
    //empty비디오제작
    static video_subpart_slice_emptyvideomake(takeindex,take_video_cutprocess_info,cachetempPath){
        console.log('generate videoSubpartslice emptyvideo make executess:',takeindex,cachetempPath);

        //let commands=[];

        //var iscomplete=false;
        //let data_gathering={};

        let edited_endpos = take_video_cutprocess_info['endpos'];
        let edited_startpos= take_video_cutprocess_info['startpos'];

        let make_duration=edited_endpos - edited_startpos;

        //commands=['-f','lavfi','-i','color=c=black:s=720x1280:r=26/1','-c:v','h264','-t',make_duration,`${cachetempPath}`];
        //commands=['-f','lavfi','-i','color=c=black:s=720x1280:r=26/1','-c:v','h264','-t','1','-y','/data/user/0/com.arthenica.reactnative.ffmpeg.test/cache/blank_video.mp4'];
        //console.log('===>>처리(video_subpart_slice_emptyvideoamke) ffmpeg인자목록:',commands);

        return `-y -f lavfi `+
        ` -i color=c=black:s=720x1280:r=26/1`+
        ` -c:v libx264 `+
        ` -preset ultrafast `+
        ` -crf 40 ` + 
        //` -c:v mpeg4 `+
        ` -t ${make_duration} `+
        cachetempPath;
    }
    static make_emptysimplevideo(cachetempPath){
        let make_duration=1;

        return `-y -f lavfi `+
        ` -i color=c=black:s=720x1280:r=26/1`+
        ` -t ${make_duration} `+
        cachetempPath
    }
    //영상끼리병합
    static mergedVideos(target_files,mergedVideoPath){
        return new Promise(async(resolve,reject)=>{
            console.log("mergted target videosss:",target_files);

            var merged_data='';

            for(let o=0; o<target_files.length; o++){
                merged_data +=('file '+target_files[o]+'\n');
            }
            console.log('<<영상병합>>쓸파일 데이터:',merged_data);
            let writeFilePath=RNFS.CachesDirectoryPath + "/" + today() + "-ffMergeVideos.txt";
           // deleteFile(writeFilePath);
            RNFS.unlink(writeFilePath).catch(_ => _);
            console.log('writeFilePathsss:',writeFilePath);

            RNFS.writeFile(writeFilePath,merged_data,'utf8').then((res)=>{
                console.log('파일쓰기 결과 mergedHistory txt:',res);

                resolve( `-y -f concat `+
                ` -safe 0 `+
                ` -protocol_whitelist \"file,http,https,tcp,tls" `+
                ` -i ${writeFilePath} `+
                //` -c copy `+
                // ` -vcodec h264 `+
                //` -crf 25 `+
                //` -pix_fmt yuv420p `+
                mergedVideoPath);
            }).catch((err)=>{
                console.log('fileWrite errosss:',err.message);
                reject(new Error(err));
            });
           
        })
    }
    //섬네일얻기(첫프레임)스크립트
    static generateThumbnailScript(filepath,videoFilePath){
        console.log('hmmmm genearteThumbnailScriptsss:',filepath,videoFilePath);
        /*return "-y -i \"" +
        filepath +
        "\" "+
        " "+
        " -frames 1 "+
        " -q:v 1 "+
        //"-ss 0 "+
        //"-to 1 "+
        //"-vf \"" +
        " -vf thumbnail=1 "+
        //"select=eq(n\\,0)\" "+
        //"-frames:v 1 "+
        videoFilePath;*/
        return "-y -i \""+
        filepath+
        "\" "+
        " "+
        " -s 720x1280 "+
        " -vframes 1 "+
        videoFilePath
    }

}
