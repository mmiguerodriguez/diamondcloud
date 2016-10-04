const { SimpleWebRTC } = window;

var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
});

// called when a peer is created
webrtc.on('createdPeer', function (peer) {
    console.log('createdPeer', peer);
});

// a peer video has been added
webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    var remotes = document.getElementById('remotes');
    
    if (remotes) {
    var container = document.createElement('div');
      container.className = 'videoContainer';
      container.id = 'container_' + webrtc.getDomId(peer);
      container.appendChild(video);
  
      // suppress contextmenu
      video.oncontextmenu = function () { return false; };
  
      remotes.appendChild(container);
    }
});

// a peer video was removed
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementById('remotes');
    var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
        remotes.removeChild(el);
    }
});

webrtc.joinRoom('c');