import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';
import VideoUtil from './video-util';
import {
    enableLogCallback,
    enableStatisticsCallback,
    executeFFmpegAsync,
    resetStatistics
} from './react-native-ffmpeg-api-wrapper';
import {Picker} from '@react-native-picker/picker';
import {styles} from './style';
import {showPopup, Toast} from "./popup";
import {VIDEO_TEST_TOOLTIP_TEXT} from "./tooltip";
import {ProgressModal} from "./progress_modal";
import Video from 'react-native-video';
import {ffprint} from './util';
import Test from "./test-api";

export default class VideoTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCodec: 'mpeg4',
            statistics: undefined
        };

        this.popupReference = React.createRef();
        this.progressModalReference = React.createRef();
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', (_) => {
            this.pause();
            this.setActive();
        });
    }

    setActive() {
        ffprint("Video Tab Activated");
        enableLogCallback(this.logCallback);
        enableStatisticsCallback(this.statisticsCallback);
        showPopup(this.popupReference, VIDEO_TEST_TOOLTIP_TEXT);
    }

    logCallback = (log) => {
        ffprint(log.message);
    }

    statisticsCallback = (statistics) => {
        console.log('video tab element statistics callback whatsss???:',statistics);
        this.setState({statistics: statistics});
        this.updateProgressDialog();
    }

    encodeVideo = () => {
        ffprint("Testing post execution commands before starting the new encoding.<<videoTab element>");
        Test.testPostExecutionCommands();

        let image1Path = VideoUtil.assetPath(VideoUtil.ASSET_1);
        let image2Path = VideoUtil.assetPath(VideoUtil.ASSET_2);
        let image3Path = VideoUtil.assetPath(VideoUtil.ASSET_3);
        let videoFile = this.getVideoFile();//caches directory path(virutual가상)

        // IF VIDEO IS PLAYING STOP PLAYBACK
        this.pause();

        VideoUtil.deleteFile(videoFile);

        let videoCodec = this.getSelectedVideoCodec();

        ffprint(`Testing VIDEO encoding with '${videoCodec}' codec`);

        this.hideProgressDialog();
        this.showProgressDialog();

        let ffmpegCommand = VideoUtil.generateEncodeVideoScript(image1Path, image2Path, image3Path, videoFile, videoCodec, this.getCustomOptions());

        console.log('GET FFMPEGCOMMEONTADSSz:',ffmpegCommand);
        executeFFmpegAsync(ffmpegCommand, completedExecution => {
                this.hideProgressDialog();
                if (completedExecution.returnCode === 0) {
                    ffprint("Encode completed successfully; playing video.");
                    this.playVideo();
                } else {
                    ffprint(`Encode failed with rc=${completedExecution.returnCode}.`);
                    showPopup(this.popupReference, "Encode failed. Please check log for the details.");
                }
            }
        ).then(executionId => ffprint(`Async FFmpeg process started with arguments \'${ffmpegCommand}\' and executionId ${executionId}.`));
    }

    playVideo() {
        let player = this.player;
        if (player !== undefined) {
            player.seek(0);
        }
        this.setState({paused: false});
    }

    pause() {
        this.setState({paused: true});
    }

    getSelectedVideoCodec() {
        let videoCodec = this.state.selectedCodec;

        // VIDEO CODEC MENU HAS BASIC NAMES, FFMPEG NEEDS LONGER LIBRARY NAMES.
        // APPLYING NECESSARY TRANSFORMATION HERE
        switch (videoCodec) {
            case "x264":
                videoCodec = "libx264";
                break;
            case "openh264":
                videoCodec = "libopenh264";
                break;
            case "x265":
                videoCodec = "libx265";
                break;
            case "xvid":
                videoCodec = "libxvid";
                break;
            case "vp8":
                videoCodec = "libvpx";
                break;
            case "vp9":
                videoCodec = "libvpx-vp9";
                break;
            case "aom":
                videoCodec = "libaom-av1";
                break;
            case "kvazaar":
                videoCodec = "libkvazaar";
                break;
            case "theora":
                videoCodec = "libtheora";
                break;
        }

        return videoCodec;
    }

    getVideoFile() {
        let videoCodec = this.state.selectedCodec;

        let extension;
        switch (videoCodec) {
            case "vp8":
            case "vp9":
                extension = "webm";
                break;
            case "aom":
                extension = "mkv";
                break;
            case "theora":
                extension = "ogv";
                break;
            case "hap":
                extension = "mov";
                break;
            default:
                // mpeg4, x264, x265, xvid, kvazaar
                extension = "mp4";
                break;
        }

        return `${RNFS.CachesDirectoryPath}/video.${extension}`;
    }

    getCustomOptions() {
        let videoCodec = this.state.selectedCodec;

        switch (videoCodec) {
            case "x265":
                return "-crf 28 -preset fast ";
            case "vp8":
                return "-b:v 1M -crf 10 ";
            case "vp9":
                return "-b:v 2M ";
            case "aom":
                return "-crf 30 -strict experimental ";
            case "theora":
                return "-qscale:v 7 ";
            case "hap":
                return "-format hap_q ";
            default:
                // kvazaar, mpeg4, x264, xvid
                return "";
        }
    }

    showProgressDialog() {
        // CLEAN STATISTICS
        this.setState({statistics: undefined});
        resetStatistics();
        this.progressModalReference.current.show(`Encoding video`);
    }

    updateProgressDialog() {
        let statistics = this.state.statistics;
        if (statistics === undefined) {
            return;
        }
        console.log('update statistics basis updateProgressiDialog:',statistics);

        let timeInMilliseconds = statistics.time;
        if (timeInMilliseconds > 0) {
            let totalVideoDuration = 9000;
            let completePercentage = Math.round((timeInMilliseconds * 100) / totalVideoDuration);
            this.progressModalReference.current.update(`Encoding video % ${completePercentage}`);
        }
    }

    hideProgressDialog() {
        this.progressModalReference.current.hide();
    }

    onPlayError = (err) => {
        ffprint('Play error: ' + JSON.stringify(err));
    }

    render() {
        return (
            <View style={styles.screenStyle}>
                <View style={styles.headerViewStyle}>
                    <Text
                        style={styles.headerTextStyle}>
                        ReactNativeFFmpegTest
                    </Text>
                </View>
                <View>
                    <Picker
                        selectedValue={this.state.selectedCodec}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({selectedCodec: itemValue})
                        }>
                        <Picker.Item label="mpeg4" value="mpeg4"/>
                        <Picker.Item label="x264" value="x264"/>
                        <Picker.Item label="openh264" value="openh264"/>
                        <Picker.Item label="x265" value="x265"/>
                        <Picker.Item label="xvid" value="xvid"/>
                        <Picker.Item label="vp8" value="vp8"/>
                        <Picker.Item label="vp9" value="vp9"/>
                        <Picker.Item label="aom" value="aom"/>
                        <Picker.Item label="kvazaar" value="kvazaar"/>
                        <Picker.Item label="theora" value="theora"/>
                        <Picker.Item label="hap" value="hap"/>
                    </Picker>
                </View>
                <View style={styles.buttonViewStyle}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={this.encodeVideo}>
                        <Text style={styles.buttonTextStyle}>CREATE</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref={this.popupReference} position="center"/>
                <ProgressModal
                    visible={false}
                    ref={this.progressModalReference}/>
                <Video
                    source={{uri: this.getVideoFile()}}
                    ref={(ref) => {
                        this.player = ref
                    }}
                    hideShutterView={true}
                    paused={this.state.paused}
                     //onError={this.state.onPlayError}
                    resizeMode={"stretch"}
                    style={styles.videoPlayerViewStyle}/>
            </View>
        );
    }

}
