// Grab elements, create settings, etc.
const video = document.getElementById('video');

// Create a webcam capture
// navigator.mediaDevices.getUserMedia({ video: true })
//   .then((stream) => {
//     video.srcObject = stream;
//     video.play();
//   })

// var stream = stream.captureStream();
video.play();

// Initialize the Image Classifier method with MobileNet passing the video as the
// second argument and the getClassification function as the third
ml5.imageClassifier('MobileNet', video).then(classifier => loop(classifier));

loop = (classifier) => {
  classifier.predict()
    .then(results => {
      _$('#bla').innerText = results[0].className;
      if (!_video_.paused) {
        loop(classifier) // Call again to create a loop
      }
    })
}

const loop = (classifier) => {
  classifier.predict()
    .then(results => {
      result.innerText = results[0].className;
      probability.innerText = results[0].probability.toFixed(4);
      loop(classifier) // Call again to create a loop
    })
};