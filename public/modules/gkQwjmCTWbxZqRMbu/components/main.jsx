const {
  DiamondAPI,
  React,
  ReactDOM,
  ReactRouter,
  SimpleWebRTC,
  classNames,
  navigator,
  URL,
} = window;
const {
  Router,
  Route,
  IndexRoute,
  browserHistory,
} = ReactRouter;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
if (getUserMedia) {
  getUserMedia = getUserMedia.bind(navigator);
}

browserHistory.push('/');

class VideoChatPage extends React.Component {
  constructor() {
    super();
    
    this.state = {
      localVideoId: 'user-video',
      videos: [],
      webrtc: {},
    };
  }
  render() {
    return (
      <div>
        <UserVideo 
          id={ this.state.localVideoId } 
          width={ 250 }
          height={ 250 }
          webrtc={ this.state.webrtc } />
        <RemoteVideos 
          videos={ this.state.videos } />
      </div>
    );
  }
  componentWillMount() {
    let self = this;
    
    let webrtc = new SimpleWebRTC({
      localVideoEl: self.state.localVideoId,
      remoteVideosEl: '',
      autoRequestMedia: true,
      nick: DiamondAPI.getCurrentUser().profile.name,
    });
    
    self.setState({
      webrtc,
    });
  }
  componentDidMount() {
    let self = this;
    let webrtc = self.state.webrtc;
    let currentBoard = DiamondAPI.getCurrentBoard();
    
    const VIDEO_WIDTH = 250, 
          VIDEO_HEIGHT = 250,
          VIDEO_START = 'playing',
          AUDIO_START = 'unmuted';
    
    // New/Removed videos events
    webrtc.on('videoAdded', (video, peer) => {
      let videos = self.state.videos;
      
      videos.push({
        id: peer.id,
        domId: webrtc.getDomId(peer),
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        video: VIDEO_START,
        audio: AUDIO_START,
        peer,
      });
      
      self.setState({
        videos,
      });
    });
    webrtc.on('videoRemoved', (video, peer) => {
      let videos = self.state.videos;
      let videoDomId =  webrtc.getDomId(peer);
      
      videos.forEach((video, index) => {
        if (video.domId === videoDomId) {
          videos.splice(index, 1);
        }
      });
      
      self.setState({
        videos,
      });
    });
    
    // Local video/audio events
    webrtc.on('videoOn', () => {
      // Local video just turned on
    });
    webrtc.on('videoOff', () => {
      // Local video just turned off
    });
    webrtc.on('audioOn', () => {
      // Local audio just turned on
    });
    webrtc.on('audioOff', () => {
      // Local audio just turned off
    });
    
    // Volume changes events
    webrtc.on('volumeChange', (volume, treshold) => {
      console.log('Local volume change', volume, treshold);
    });
    webrtc.on('remoteVolumeChange', (volume, treshold) => {
      console.log('Remote volume change', volume, treshold);
    });
    
    webrtc.on('mute', (data) => {
      webrtc.getPeers(data.id).forEach((peer) => {
        let videos = self.state.videos;
        
        videos.forEach((video, index) => {
          if (video.id === peer.id) {
            videos[index][data.name] = data.name === 'audio' ? 'muted' : 'paused';
          }
        });
        
        self.setState({
          videos,
        });
      });
    });
    webrtc.on('unmute', (data) => {
      webrtc.getPeers(data.id).forEach((peer) => {
        let videos = self.state.videos;
        
        videos.forEach((video, index) => {
          if (video.id === peer.id) {
            videos[index][data.name] = data.name === 'audio' ? 'unmuted' : 'playing';
          }
        });
        
        self.setState({
          videos,
        });
      });
    });
    
    // Joins to the currentBoard room
    webrtc.joinRoom(currentBoard._id);
  }
}

class UserVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { video: 'playing', audio: 'unmuted' };

    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
  }
  render() {
    return (
      <div>
        { 
          this.state.video === 'playing' ? (
            <button
              className='btn btn-danger'
              onClick={ this.pause }>Pause call
            </button> // Replace with lovely image, maybe put it inside user video
          ) : (
            <button
              className='btn btn-success'
              onClick={ this.resume }>Resume call
            </button> // Replace with lovely image, maybe put it inside user video
          )
        }
        {
          this.state.audio === 'unmuted' ? (
            <button
              className='btn btn-danger'
              onClick={ this.mute }>Mute audio
            </button> // Replace with lovely image, maybe put it inside user video
          ) : (
            <button
              className='btn btn-success'
              onClick={ this.unmute }>Unmute audio
            </button> // Replace with lovely image, maybe put it inside user video
          )
        }

        <video
          id={ this.props.id }
          width={ this.props.width }>
        </video>
      </div>
    );
  }
  pause() {
    this.props.webrtc.pauseVideo();
    this.setState({
      video: 'paused',
    }, () => {
      this.mute();
    });
  }
  resume() {
    this.props.webrtc.resumeVideo();
    this.setState({
      video: 'playing',
    }, () => {
      this.unmute();
    });
  }
  mute() {
    this.props.webrtc.mute();
    this.setState({
      audio: 'muted',
    });
  }
  unmute() {
    this.props.webrtc.unmute();
    this.setState({
      audio: 'unmuted',
    });
  }
}

class RemoteVideos extends React.Component {
  render() {
    return ( 
      <div>
        { this.renderVideos() }
      </div>
    );
  } 
  renderVideos() {
    return this.props.videos.map((video) => {
      return (
        <Video { ...video } />
      );
    });
  }
}
class Video extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { startVolume: null };
    
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
  }
  render() {
    return (
      <div style={{ border: '1px solid black' }}>
        <p>{ this.props.peer.nick }</p>
        {
          this.props.audio === 'muted' ? (
            <p>Muted</p> // Replace with lovely image
          ) : (
            <p>Unmuted</p> // Replace with lovely image
          )
        }
        {
          this.props.video === 'paused' ? (
            <p>Paused</p> // Replace with lovely image
          ) : (
            <p>Playing</p> // Replace with lovely image
          )
        }
        <video
          id={ this.props.domId }
          src={ URL.createObjectURL(this.props.peer.stream) }
          width={ this.props.width }
          height={ this.props.height }
          ref={ (e) => this.video = e }
          onContextMenu={ () => { return false; } }
          autoPlay>
        </video>
        <button className='btn btn-primary' onClick={ this.mute }>Mute user</button>
        <button className='btn btn-primary' onClick={ this.unmute }>Unmute user</button>
      </div>
    );
  }
  componentDidMount() {
    this.setState({
      startVolume: this.video.volume,
    });
  }
  mute() {
    this.video.volume = 0;
    console.log('Muted...', this.video.volume, this.state.startVolume);
  }
  unmute() {
    this.video.volume = this.state.startVolume;
  }
}

UserVideo.propTypes = { 
  id: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  webrtc: React.PropTypes.object.isRequired,
};
RemoteVideos.propTypes = {
  videos: React.PropTypes.array.isRequired
};
Video.propTypes = { 
  id: React.PropTypes.string.isRequired,
  audio: React.PropTypes.string.isRequired,
  video: React.PropTypes.string.isRequired,
  peer: React.PropTypes.object.isRequired,
};

// Render classes with router
ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ VideoChatPage }>
      <IndexRoute component={ VideoChatPage } />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
