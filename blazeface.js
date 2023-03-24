const video = document.querySelector('#webcam');
const canvas = document.querySelector('#outputCanvas');

const enableWebcamButton = document.querySelector('#enableWebcamButton');
const disableWebcamButton = document.querySelector('#disableWebcamButton');

var model = undefined;
var myVar;
var ctx = canvas.getContext('2d');

function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
  disableWebcamButton.addEventListener('click', disableCam);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}


function enableCam(event) {
	  /* disable this button once clicked.*/
	  event.target.disabled = true;
	  /* show the disable webcam button once clicked.*/
	  disableWebcamButton.disabled = false;

	  /* show the video and canvas elements */
	  document.querySelector("#liveView").style.display = "block";


	  // getUsermedia parameters to force video but not audio.
	  const constraints = {
		video: true
	  };
	  // Activate the webcam stream.
	  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		video.srcObject = stream;
		video.addEventListener('loadeddata', processFrame);

	  })
	  .catch(function(err){
		console.error('Error accessing media devices.', error);
	  });
  

};

function disableCam(event) {
	window.clearTimeout(myVar);
    event.target.disabled = true;
	enableWebcamButton.disabled = false;

    /* stop streaming */
    video.srcObject.getTracks().forEach(track => {
      track.stop();
    })
  
    /* clean up. some of these statements should be placed in processVid() */
    video.srcObject = null;
	video.removeEventListener('loadeddata', processFrame);
	
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector("#liveView").style.display = "none";
}



async function processFrame() {
      if(!enableWebcamButton.disabled) return ;
	
	  ctx.drawImage(video,0,0,video.width,video.height);
	  const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
	  const predictions =  await model.estimateFaces(video, returnTensors);
	  const flipHorizontal = true;
	  const annotateBoxes = true;

	  if (predictions.length > 0) {
		//console.log(predictions);
		for (let i = 0; i < predictions.length; i++) {
		  if (returnTensors) {
			predictions[i].topLeft = predictions[i].topLeft.arraySync();
			predictions[i].bottomRight = predictions[i].bottomRight.arraySync();
			if (annotateBoxes) {
			  predictions[i].landmarks = predictions[i].landmarks.arraySync();
			}
		  }

		  const start = predictions[i].topLeft;
		  const end = predictions[i].bottomRight;
		  const size = [end[0] - start[0], end[1] - start[1]];
		  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
		  ctx.fillRect(start[0], start[1], size[0], size[1]);

		  if (annotateBoxes) {
			const landmarks = predictions[i].landmarks;

			ctx.fillStyle = "blue";
			for (let j = 0; j < landmarks.length; j++) {
			  const x = landmarks[j][0];
			  const y = landmarks[j][1];
			  ctx.fillRect(x, y, 5, 5);
			}
		  }
		}

	  }
	  
	  if(!enableWebcamButton.disabled) ctx.clearRect(0, 0, canvas.width, canvas.height);
	  myVar = window.setTimeout(processFrame,100,video,ctx,video.width,video.height);
	
}

var model = undefined;

blazeface.load().then((loadedModel) => {
	  model = loadedModel;
	  /* now model is ready to use. */
	  document.querySelector("#status").innerHTML = "model is loaded.";
	  enableWebcamButton.disabled = false;
});
