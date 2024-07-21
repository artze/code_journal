---
title: Access Cameara with MediaDevices API
description: Access camera feature with Browswer MediaDevices API
tags: ['javascript', 'browser api']
timestamp: 1549085421000
---

## Access Cameara with MediaDevices API

A snippet to show how we can access camera to capture an image with MediaDevices API:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cam test</title>
  </head>
  <body>
    <video autoplay></video>
    <button id="capture-btn">Capture</button>
    <canvas style="display:none;"></canvas>
    <img src="" />
    <script>
      const video = document.querySelector('video');
      const captureBtn = document.querySelector('#capture-btn');
      const canvas = document.querySelector('canvas');
      const img = document.querySelector('img');

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
      });

      captureBtn.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // Other browsers will fall back to image/png
        img.src = canvas.toDataURL('image/webp');
      });
    </script>
  </body>
</html>
```

What’s happening here?

- The video tag receives video stream from the camera instead of a source video URL. autoplay attribute is needed, otherwise the video display will be frozen on the first frame.
- `navigator.mediaDevices.getUserMedia` is where the camera is accessed. The parameters could include audio: true if you want to access audio. After accessing camera successfully, the video feed streams video data into the video element
- To capture a screenshot, the canvas is used to draw the image, which then gets displayed within the img element.

### Switching Cameras

A crude implementation of switching cameras (back vs front in mobile):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cam test</title>
  </head>
  <body>
    <video autoplay></video>
    <button id="capture-btn">Capture</button>
    <button id="change-cam-btn">Change camera</button>
    <canvas style="display:none;"></canvas>
    <img src="" />
    <script>
      const video = document.querySelector('video');
      const captureBtn = document.querySelector('#capture-btn');
      const changeCamBtn = document.querySelector('#change-cam-btn');
      const canvas = document.querySelector('canvas');
      const img = document.querySelector('img');

      let deviceIdArr = [];
      let index = 0;
      let constraints = {
        video: {
          deviceId: {
            exact: '',
          },
        },
      };
      let videoStream;

      function displayVideoFeed() {
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          videoStream = stream;
          video.srcObject = stream;
        });
      }

      function stopAllVideoTracks() {
        if (videoStream && videoStream.getVideoTracks().length > 0) {
          videoStream.getVideoTracks().forEach((track) => {
            track.stop();
          });
        }
      }

      function incrementIndex() {
        index++;
        if (index >= deviceIdArr.length) {
          index = 0;
        }
      }

      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput',
        );
        deviceIdArr = videoDevices.map((device) => device.deviceId);
        constraints.video.deviceId.exact = deviceIdArr[index];
        displayVideoFeed();
      });

      changeCamBtn.addEventListener('click', () => {
        incrementIndex();
        constraints.video.deviceId.exact = deviceIdArr[index];
        stopAllVideoTracks();
        displayVideoFeed();
      });

      captureBtn.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // Other browsers will fall back to image/png
        img.src = canvas.toDataURL('image/webp');
      });
    </script>
  </body>
</html>
```
