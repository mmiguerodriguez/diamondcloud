const { DiamondAPI, SimplePeer, navigator } = window;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

if(getUserMedia) {
  getUserMedia = getUserMedia.bind(navigator);
}

var user = DiamondAPI.getCurrentUser();
var users = DiamondAPI.getTeamData().users;

// get video/voice stream
getUserMedia({ video: true, audio: true }, gotMedia, function () {});

function gotMedia (stream) {
  var peer1 = new SimplePeer({ initiator: true, stream: stream });
  var peer2 = new SimplePeer({ initiator: false });

  peer1.on('signal', function (data) {
    peer2.signal(data);
  });

  peer2.on('signal', function (data) {
    peer1.signal(data);
  });

  peer2.on('stream', function (stream) {
    // got remote video stream, now let's show it in a video tag
    var video = document.querySelector('#their-video');
    video.src = window.URL.createObjectURL(stream);
  });
}
