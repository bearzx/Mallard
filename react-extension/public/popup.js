navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        let video = document.querySelector('#video');
        video.srcObject = stream;
    })
    .catch(err => {
        console.log(err);
    });