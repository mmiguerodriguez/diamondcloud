const { DiamondAPI, Peer, navigator } = window;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

if(getUserMedia) {
  getUserMedia = getUserMedia.bind(navigator);
}

var user = DiamondAPI.getCurrentUser();
var users = DiamondAPI.getTeamData().users;

var peer = new Peer(user._id, {
  config: {
    iceServers: [
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun1.l.google.com:19302' },
      { url: 'stun:stun2.l.google.com:19302' },
      { url: 'stun:stun3.l.google.com:19302' },
      { url: 'stun:stun4.l.google.com:19302' },
    ],
  },
  host: '/',
  port: location.port || (location.protocol === 'https:' ? 443 : 80),
  key: 'i3rtqyq8fwimgqfr',
});

function connectToUser() {
  let id = prompt('pone tu fucking id')
  getUserMedia({ video: true, audio: true }, (stream) => {
    console.log(stream, id);
    
    let call = peer.call(id, stream);
    
    console.log(call, peer.call);
    
    call.on('stream', (remoteStream) => {
      console.log('calling', remoteStream);
    });
  }, (error) => {
    console.log('Failed to get local stream', error);
  });
}

peer.on('call', (call) => {
  console.log('call received');
  
  getUserMedia({ video: true, audio: true }, (stream) => {
    call.answer(stream); 
    console.log('answered');
    call.on('stream', (remoteStream) => {
      console.log('answer', remoteStream);
    });
  }, (error) => {
    console.log('Failed to get local stream', error);
  });
});

peer.on('error', (err) => {
  console.log('there was an error', err);
});

