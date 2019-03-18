navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        let video = document.querySelector('#video');
        video.srcObject = stream;
    })
    .catch(err => {
        console.log(err);
    });

document.addEventListener('DOMContentLoaded', (e) => {
    bla();
    let video = document.querySelector('#video');
    let mask = document.querySelector('#mask');
    mask.width = video.offsetWidth;
    mask.height = video.offsetHeight;
    mask.style.left = video.offsetLeft;
    mask.style.top = video.offsetTop;
    let context = mask.getContext('2d');
    context.translate(mask.width, 0);
    context.scale(-1, 1);
});

// window.onload = function() {
//     bla();
// };

async function bla() {
    const MODEL_URL = 'https://www.bearzx.com/pgxz3/weights/';
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    track();
}

async function startTracking() {
    setInterval(track, 3000);
}

async function track() {
    // chrome.tabs.query({ active: true }, function(tabs) {
    //     for (let tab of tabs) {
    //         console.log(tab);
    //     }
    // });

    let video = document.querySelector('#video');
    let mask = document.querySelector('#mask');
    let fullFaceDescriptions = await faceapi.detectSingleFace(video);
    // let detectionArray = fullFaceDescriptions.map(fd => fd.box);
    let direction;
    if (fullFaceDescriptions) {
        let faceBox = fullFaceDescriptions.box;
        let midx = faceBox._x + faceBox._width / 2;
        let midy = faceBox._y + faceBox._height / 2;
        if (1.0 * Math.abs(midx - video.width / 2) / video.width < 0.1) {
            // up or down
            // console.log('up or down');
            if (midy > (video.height / 2)) {
                // console.log('down');
                direction = 'down';
            } else {
                // console.log('up');
                direction = 'up';
            }
        } else {
            // left or right
            // console.log('left or right');
            if (midx > (video.width / 2)) {
                console.log('left');
                direction = 'left';
            } else {
                console.log('right');
                direction = 'right';
            }
        }
        // chrome.tabs.sendMessage(1476, { type: 'direction', direction: direction });
        chrome.runtime.sendMessage({ action: 'direction', direction: direction });
    }
    // mask.getContext('2d').clearRect(0, 0, mask.width, mask.height);
    // faceapi.drawDetection(mask, detectionArray);
}