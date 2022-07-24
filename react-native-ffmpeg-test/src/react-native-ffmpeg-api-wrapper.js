import React from 'react';
import {RNFFmpeg, RNFFmpegConfig, RNFFprobe} from 'react-native-ffmpeg';
import {ffprint} from './util';

export async function executeFFmpeg(command) {//major use
    return await RNFFmpeg.execute(command)
}

export function executeFFmpegWithArguments(commandArguments) {
    RNFFmpeg.executeWithArguments(commandArguments).then(rc => ffprint(`FFmpeg process exited with rc ${rc}`));
}

export async function executeFFmpegAsync(command, callback) {//major use
    return await RNFFmpeg.executeAsync(command, callback);
}

export function executeFFmpegAsyncWithArguments(commandArguments, callback) {
    RNFFmpeg.executeAsyncWithArguments(commandArguments, callback).then(executionId => ffprint(`FFmpeg process started with executionId ${executionId}.`));
}

export function executeFFmpegCancel() {//ffmpeg executeQueue canceling(all task)
    RNFFmpeg.cancel();
}

export function executeFFmpegCancelExecution(executionId) {//ffmpeg executeQueue speicfy id canceling
    RNFFmpeg.cancelExecution(executionId);
}

export function getLastCommandOutput() {//uses(마지막최근 명령출력)
    return RNFFmpegConfig.getLastCommandOutput();
}

export function getLogLevel() {//uses
    return RNFFmpegConfig.getLogLevel();
}

export function setLogLevel(logLevel) {//uses
    return RNFFmpegConfig.setLogLevel(logLevel);
}

export function enableLogCallback(logCallback) {//log sees callback
    RNFFmpegConfig.enableLogCallback(logCallback);
}

export function enableStatisticsCallback(statisticsCallback) {//statisccallabkc usess
    RNFFmpegConfig.enableStatisticsCallback(statisticsCallback);
}

export function listExecutions() {//병행 tasklist 리스팅(실행목록) 실행목록체를 실행하는게아니라 보여줄뿐임.
    RNFFmpeg.listExecutions().then(executionList => {
        executionList.forEach(execution => {
            ffprint(`Execution id is ${execution.executionId}`);
            ffprint(`Execution start time is ` + new Date(execution.startTime));
            ffprint(`Execution command is ${execution.command}`);
        });
    });
}

export async function executeFFprobe(command) {//uses major
    console.log('Executeffprobess:',command);
    RNFFprobe.execute(command).then(result=>console.log(`FFprobe process exited with rc=${result}.`));
   // RNFFprobe.executeAsync(command,callback);
    return await RNFFprobe.execute(command);
}

export function executeFFprobeWithArguments(commandArguments) {
    console.log('ExecutesFfmpegProbe arguemtnss:',commandArguments);
    RNFFprobe.executeWithArguments(commandArguments).then(rc => ffprint(`FFprobe process exited with rc ${rc}`));
}

export function resetStatistics() {
    RNFFmpegConfig.resetStatistics();
}

export function parseArguments(command) {//commands array return
    return RNFFmpeg.parseArguments(command);
}

export function getFFmpegVersion() {//util
    return RNFFmpegConfig.getFFmpegVersion();
}

export function getPlatform() {//util
    return RNFFmpegConfig.getPlatform();
}

export function getPackageName() {
    return RNFFmpegConfig.getPackageName();
}

export function getExternalLibraries() {//utiluse
    return RNFFmpegConfig.getExternalLibraries();
}

export function getLastReturnCode() {//extra 최근리턴코드값
    return RNFFmpegConfig.getLastReturnCode();
}

export function getLastReceivedStatistics() {
    return RNFFmpegConfig.getLastReceivedStatistics();
}

export function setFontDirectory(path, mapping) {
    RNFFmpegConfig.setFontDirectory(path, mapping);
}

export function setFontconfigConfigurationPath(path) {
    RNFFmpegConfig.setFontconfigConfigurationPath(path);
}

export function setEnvironmentVariable(name, value) {
    RNFFmpegConfig.setEnvironmentVariable(name, value);
}

export function getMediaInformation(path) {//filepath에대한 미디어정보usess
    console.log('path 조회:',path);
    RNFFprobe.getMediaInformation(path).then(information=>{
        console.log('ffProbe reulstsss:',JSON.stringify(information));
    })
    return RNFFprobe.getMediaInformation(path);
}

export function registerNewFFmpegPipe() {//media pipeline new create
    return RNFFmpegConfig.registerNewFFmpegPipe();
}

export function writeToPipe(inputPath, pipePath) {//input media data insert to pipePath data~~
    return RNFFmpegConfig.writeToPipe(inputPath, pipePath);
}
