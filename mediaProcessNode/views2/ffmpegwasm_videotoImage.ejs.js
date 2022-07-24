<html>
  <head>
    <script src='public/ffmpegwasm.js'></script>
    <style>
      html, body {
        margin: 0;
        width: 100%;
        height: 100%
      }
      body {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <h3>Click start to transcode images to mp4 (x264) and play!</h3>
    <video id="output-video" controls></video><br/>
    <button id="start-btn">Start</button>
    <p id="message"></p>
    <a href="https://github.com/ffmpegjs/ffmpeg.js/tree/master/examples/assets/triangle">Data Set</a>
    <script>
      const { createFFmpeg, fetchFile } = FFmpeg;
      const ffmpeg = createFFmpeg({ log: true });

      const image2video = async () => {
        const message = document.getElementById('message');
        message.innerHTML = 'Loading ffmpeg-core.js';
        await ffmpeg.load();
        message.innerHTML = 'Loading data';
        ffmpeg.FS('writeFile', 'audio.ogg', await fetchFile('public/assets/triangle/audio.ogg'));
        for (let i = 0; i < 60; i += 1) {
          const num = `00${i}`.slice(-3);
          console.log('what for numsss:',num);
          ffmpeg.FS('writeFile', `tmp.${num}.png`, await fetchFile(`public/assets/triangle/tmp.${num}.png`));
        }
        message.innerHTML = 'Start transcoding';
        await ffmpeg.run('-framerate', '30', '-pattern_type', 'glob', '-i', '*.png', '-i', 'audio.ogg', '-c:a', 'copy', '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', 'out.mp4');
        const data = ffmpeg.FS('readFile', 'out.mp4');
        ffmpeg.FS('unlink', 'audio.ogg');
        for (let i = 0; i < 60; i += 1) {
          const num = `00${i}`.slice(-3);
          ffmpeg.FS('unlink', `tmp.${num}.png`);
        }
        console.log('처리된 데이터read output파일::',data,data.buffer);
        const video = document.getElementById('output-video');
        video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      }
      const elm = document.getElementById('start-btn');
      elm.addEventListener('click', image2video);
    </script>
  </body>
</html>