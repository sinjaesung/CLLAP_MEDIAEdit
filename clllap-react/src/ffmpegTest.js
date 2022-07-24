import React, { Component } from "react";
import FFMPEG from "react-ffmpeg";

class ffmpegTest extends Component {
   
  async onFileChange(e) {
    const file = e.target.files[0];
    await FFMPEG.process(
      file,
      
      function (e) {
        const video = e.result;
        console.log(video);
      }.bind(this)
    );
  }

  render() {
    return (
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={this.onFileChange}
      />
    );
  }
}

export default ffmpegTest;
