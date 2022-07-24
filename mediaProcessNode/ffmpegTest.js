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


/*
ffmpeg blending overlay effectsss  basics======================================== 
all_mode=addition,and,average,bleach,burn,darken,difference,divide,dodge,exclusion,extremity,freeze,geometric,glow,grainextract,grainmerge,hardlight,hardmix,hardoverlay,harmonic,heat,interpolate,lighten,linearlight,multiply,multiply128,negation,overlay,or,phoenix,pinlight,reflect,screen,softdifference,softlight,stain,subtract,vividlight,xor

ffmpeg -i xxxx.mp4 -i orgiila.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_mode='multiply'[out]" -map "[out]" output

ffmpeg -i input.mp4 -vf "eq=contrast=250.0:enable='between(t,5,15)'" output.mp4 필터효과 특정시간지정

ffmpeg -i xxxx.mp4 -i orgiila.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_expr='A*(X/W)+B*(1-X/W)':enable='between(t,3,6)'"hmmmmmmout

ffmpeg -i xxxx.mp4 -i orgiila.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_expr='A*(X/W)+B*(1-X/W)':enable='between(t,3,6)'"hmmmmmmout

ffmpeg -i xxxx.mp4 -i orgiila.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_expr='if(eq(mod(X,2),mod(Y,2)),A,B)':enable='between(t,3,6)'"hmmmmmmout

ffmpeg -i xxxx.mp4 -i orgiila.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_expr='if(gte(N*SW+X,W),A,B)':enable='between(t,3,6)'" hmmmmmmout

ffmpeg -i xxxx.mp4 -i orgiila.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_expr='if(gte(N*SW+X,W),A,B)':enable='between(t,3,6)'" hmmmmmmout

ffmpeg -i testvideoinput.mp4 -i overlayvideo.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_expr='if(gte(Y-N*SH,0),A,B):all_mode=overlay':enable='between(t,3,6)'" hmmmmmmout

ffmpeg -i testvideoinput.mp4 -i overlayvideo.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_mode=overlay:all_expr='if(gte(Y-N*SH,0),A,B)':enable='between(t,3,6)'" hmmmmmmout

ffmpeg -i testvideoinput.mp4 -i overlayvideo.jmp4 -filter_complex "[1:v][0:v]scale2ref[ckout][vid];[vid][ckout]blend=all_mode=overlay:all_expr='if(gte(T*SH*40+Y,H)*gte((T*40+SW+X)*W/H,W),A,B)':enable='between(t,3,6)'" hmmmmmmout

ffmpeg -y -i avis.mp4 -i bgmovie.mp4 \
    -filter_complex "
[0:v][1:v]blend=all_mode=average
" out.mp4

ffmpeg -y -i testinput.mp4 -i overlaytss.mp4 -filter_complex "[0:v][1:v]blend=all_mode=average:all_expr='if(gt(X,Y*(W/H)),A,B)':enable='between(t,3,7)'" out.mp4

**usess
ffmpeg -i testvideo.mp4 -ignore_loop 0 -i test.gif -filter_complex "[1:v]format=rgba,colorchannelmixer=aa=0.4[overlay];[0][overlay]overlay=0:0:enable=`between(t,${start},${end})`" -frames:v mainvideototalframes(average fps*duration) output.mp4 메인비디오의 최종적프레임량수만큼에 해당하는 (메인비디오초량)만큼의 gif overlay필터를 만듬.그중 원하는 구간(s)만 viewing함.

=============filter effect start================================

컬러필터
 ffmpeg -i testvid2.mp4 -vf "colorbalance=rh=0.6:rs=0.6:enable='between(t,4,8)'" out red강조
 ffmpeg -i testvid2.mp4 -vf "colorbalance=bh=0.6:bs=0.6:enable='between(t,4,8)'" out  blue강조
ffmpeg -i testvid2.mp4 -vf "colorbalance=gh=0.6:gs=0.6:enable='between(t,4,8)'" out green강조

 ffmpeg -i testvid2.mp4 -vf "colorbalance=rh=0.6:gh=0.6:rs=0.6:gs=0.6:enable='between(t,4,8)'" out 노란색강조
 ffmpeg -i testvid2.mp4 -vf "colorbalance=rs=0.5:bs=0.8:rh=0.5:bh=0.8:enable='between(t,4,8)'" out 푸른보라계열강조
 ffmpeg -i testvid2.mp4 -vf "colorbalance=rh=0.8:bh=0.5:rs=0.8:bs=0.5:enable='between(t,4,8)'" out 붉은보라계열강조
  ffmpeg -i testvid2.mp4 -vf "colorbalance=rh=0.6:bh=0.6:rs=0.6:bs=0.6:enable='between(t,4,8)'" out 핑크or균형잡힌 붉은파랑계열강조
   ffmpeg -i testvid2.mp4 -vf "colorbalance=rh=0.4:bh=0.7:rs=0.4:bs=0.7:enable='between(t,4,8)'" out 보라계열강조
   ffmpeg -i testvid2.mp4 -vf "colorbalance=gh=0.8:bh=0.5:gs=0.8:bs=0.5:enable='between(t,4,8)'" out 청녹계열 
   ffmpeg -i testvid2.mp4 -vf "colorbalance=gh=0.5:bh=0.8:gs=0.5:bs=0.8:enable='between(t,4,8)'" out cyan계열
   ffmpeg -i testvid2.mp4 -vf "colorbalance=gh=0.3:bh=0.3:gs=0.3:bs=0.3:enable='between(t,4,8)'" out 옅녹푸른 
   ffmpeg -i testvid2.mp4 -vf "colorbalance=gh=0.3:bh=0.6:gs=0.3:bs=0.6:enable='between(t,4,8)'" out 푸른추가
   ffmpeg -i testvid2.mp4 -vf "colorbalance=rh=0.7:gh=0.7:bh=0.7:rs=0.7:gs=0.7:bs=0.7:enable='between(t,4,8)'" 더발게 흰색 out 

   컨볼루션
   ffmpeg -i testvid.mp4 -vf convolution="0 1 0 1 -4 1 0 1 0:0 1 0 1 -4 1 0 1 0:0 1 0 1 -4 1 0 1 0:0 1 0 1 -4 1 0 1 0:5:5:5:1:0:128:128:128"  라플라시안
   ffmpeg -i testvid.mp4 -vf convolution="0 0 0 -1 1 0 0 0 0:0 0 0 -1 1 0 0 0 0:0 0 0 -1 1 0 0 0 0:0 0 0 -1 1 0 0 0 0:5:1:1:1:0:128:128:128"  edge enchance
   ffmpeg -i testvid.mp4 -vf convolution="0 1 0 1 -4 1 0 1 0:0 1 0 1 -4 1 0 1 0:0 1 0 1 -4 1 0 1 0:0 1 0 1 -4 1 0 1 0:5:5:5:1:0:128:128:128"  edge detect
   ffmpeg -i testvid.mp4 -vf convolution="-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2" emboss

   커브
   ffmpeg -i testvid.mp4 -vf "curves=r='0/0.11 .42/.51 1/0.95':g='0/0 0.50/0.48 1/1':b='0/0.22 .49/.44 1/0.8':enable='between(t,3,6)'" output vintage effects
ffmpeg -i testvid.mp4 -vf "curves=preset=color_negative:enable='between(t,3,6)'" output  color_negative
ffmpeg -i testvid.mp4 -vf "curves=preset=cross_process:enable='between(t,3,6)'" output crossprocess

  그리드드로우
  colorFffmpegcolorss: AliceBlue,AntiqueWhite,Aqua,Aquamarine,Azure,Beige,Bisque,Black,BlanchedAlmond,Blue,BlueViolet,Brown,BurlyWood,CadetBlue,Chartreuse,Chocolate,Coral,CornflowerBlue,cornsilk,Crimson,Cyan,DarkBlue,DarkCyan,DarkGoldenRod,DarkGray,DarkGreen,DarkKhaki,DarkMagenta,DarkOliveGreen,Darkorange,DarkOrchild,DarkRed,DarkSalmon,DarkSeaGreen,DarkSlateBlue,DarkSlateGray,DarkTurquoise,DarkViolet,DeepPink,DeepSkyBlue,DimGray,DodgerBlue,FireBrick,FloralWhite,ForestGreen,Fuchsia,Gainsbore,GhostWhite,Gold,GoldenRod,Gray,GreenYellow,HoneyDew,HotPink,IndianRed,Indigo,Ivory,Khaki,Lavender,LavenderBlush,LawnGreen,LemonChiffon,LightBlue,LightCoral,LightCyan,LightGoldenRodYellow,LightGreen,LightGrey,LightPink,LightSalmon,LightSeaGreen,PaleVioletRed,PapayaWhip,RoyalBlue
  
  ffmpeg -i testvid.mp4 -vf "drawgrid=width=100:height=100:thickenss=3:color=red@0.6:enable='between(t,3,6)'"" output

  GEQ>>>
  ffmpeg -i testvide.mp4 -filter_complex "geq=r='X/W*r(X,Y)':g='(1-X/W)*g(X,Y)':b='(H-Y)/H*b(X,Y)':enable='between(t,3,6)'" output  rgbDynamics

  HUE>>
  ffmpeg -i testvideo.mp4 -filter_complex "hue='H=2*PI*t: s=sin(2*PI*t)+1':enable='between(t,3,6)'" output"

  pseudocolor>>
  magma,inferno,plasma,viridis,turbo,cividis,range1,range2,shadows,highlights,solar,nominal,preferred,total

  ffmpeg -i testvideo.mp4 -filter_complex pseudocolor=preset='magma' output

  roatate>>>>
  ffmpeg -i testvideo.mp4 -filter_complex rotate=PI/3+2*PI*t/3:enable='between(t,3,6)' output
  ffmpeg -i testvideo.mp4 -filter_complex rotate=2.86*sin(2*PI/3*t):enable='between(t,3,6)' output

  trippy>>>
  ffmpeg-i testvideo.mp4 -filter_complex lagfun:enable='between(t,3,6)' output
*/
   // var ffmpeg_local_native = spawn("ffmpeg",["-y","-ss","1","-to","5","-i","a2.mp4","-vf","scale=720x1280","-r","26","-c:v","mpeg4","-an","tessttssssss.mp4"]);

   //fmpeg transition tests...
   /*
    ffmpeg -loop 1 -t 1 -i png -loop 1 -t 1 -i png -filter_complex "[0][1]xfade=transition=fade:duration=1:offset=0.1,format=yuv420p" output
    fade,fdadeblack,fadewhite,distance,wipeleft,wiperight,wipeup,wipedown,slideleft,slideright,slideup,slidedown,smoothleft,smoothright,smoothup,smoothdown,circlecrop,rectcrop,circleclose,circleopen,horzclose,horzopen,vertclose,vertopen,diagbl,diagbr,diagtl,diagtr,hlslice,hrslice,vuslice,vdslice,dissovle,pixelize,radial,hblur,wipetl,wipetr,wipebl,wipebr,squeezev,squeezeh
   */
   //var ffmpeg_local_native=spawn("ffmpeg",['-y','-i','testvid2.mp4','-i','particles3.mp4','-filter_complex',"[0:v][1:v]blend=all_mode=overlay:all_expr='if(gte(Y-N*SH,0),A,B)':enable='between(t,3,7)'",'blendoutput.mp4'])
   //var ffmpeg_local_native=spawn("ffmpeg",['-i','input','-vf',`colorbalance=rh=0.8:gh=0.8:rs=0.8:gs=0.8:enable='between(t,,)'`,'effect']);

   //var ffmpeg_local_native=spawn("ffmpeg",['-loop','1','-t','1','-i','take1end.png','-loop','1','-t','1','-i','take2start.png','-filter_complex',"[0][1]xfade=transition=fade:duration=1:offset=0.1,format=yuv420p",'-r','26','transitionTest.mp4']);
    //var ffmpeg_local_native=spawn("ffmpeg",['-i','testvid2.mp4','-ignore_loop','0','-i','./resource/overlay3.gif','-filter_complex',`[1:v]format=rgba,colorchannelmixer=aa=0.4[overlay];[0][overlay]overlay=0:0:enable='between(t,9,13)'`,'-frames:v',884,'videoOverlays.mp4']);
    var ffmpeg_local_native=spawn("ffmpeg",['-y','-i','videoOverlays.mp4','-filter_complex',`rotate=6.86*sin(2*PI/3*t)`,'rotateTest.mp4']);

    var output_complete = false;

    ffmpeg_local_native.stderr.on("data",function(data){
        console.log(data.toString());
    });
    ffmpeg_local_native.stderr.on("end",function(){
        console.log(" vidoes process files process finalss all merged");

        output_complete=true;

    });
    ffmpeg_local_native.stderr.on("exit",function(){
        console.log('child porecess exited');
    });
    ffmpeg_local_native.stderr.on("close",function(){
        console.log('....closing itiemss! byess');
    });
  

