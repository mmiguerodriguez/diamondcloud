const { DiamondAPI, SimplePeer, navigator } = window;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

if (getUserMedia) {
  getUserMedia = getUserMedia.bind(navigator);
}

var user = DiamondAPI.getCurrentUser();
var users = DiamondAPI.getTeamData().users;

function initiate(initiator) {
  getUserMedia({ video: true, audio: true }, (stream) => {
    console.log('My stream (initialization)', stream);

    let video = document.getElementById('my-video');
    video.src = window.URL.createObjectURL(stream);

    var peer = new SimplePeer({
      initiator,
      stream,
      trickle: false,
    });

    peer.on('signal', (data) => {
      console.log('signal', data);
      document.getElementById('yourId').value = JSON.stringify(data);
    });

    document.getElementById('connect').addEventListener('click', function () {
      let otherId = JSON.parse(document.getElementById('otherId').value);
      peer.signal(otherId);
    });

    document.getElementById('send').addEventListener('click', function () {
      let message = document.getElementById('yourMessage').value;
      peer.send(message);

      console.log('Sent message', message);
    });

    peer.on('data', (data) => {
      console.log('Received data', data);
      document.getElementById('messages').textContent += data + '\n';
    });

    peer.on('stream', (stream) => {
      console.log('Streaming received', stream);
      let video = document.getElementById('their-video');
      video.src = window.URL.createObjectURL(stream);
    });

  }, (error) => {
    console.log(error);
  });
}
