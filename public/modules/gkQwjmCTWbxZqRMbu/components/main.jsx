const {
  DiamondAPI,
  React,
  ReactDOM,
  ReactRouter,
  SimpleWebRTC,
  classNames,
  URL,
} = window;
const {
  Router,
  Route,
  IndexRoute,
  browserHistory,
} = ReactRouter;

browserHistory.push('/');

class VideoChatPage extends React.Component {
  constructor() {
    super();
    
    this.state = {
      localVideoId: 'user-video',
      readyToCall: false,
      connected: false,
      videos: [],
      peers: [],
      webrtc: {},
    };
    
    this.connect = this.connect.bind(this);
  }
  render() {
    return (
      <div>
        <UserVideo
          id={ this.state.localVideoId } 
          width={ 250 }
          height={ 250 }
          webrtc={ this.state.webrtc }
          connected={ this.state.connected } />
        {
          this.state.connected ? (
            <div>
              <UsersList 
                peers={ this.state.peers } />
              <RemoteVideos 
                videos={ this.state.videos } />
            </div>
          ) : ( 
            <button 
              className='btn btn-primary'
              onClick={ this.connect }>Join board room
            </button>
          )
        }
      </div>
    );
  }
  componentWillMount() {
    let self = this;
    
    let webrtc = new SimpleWebRTC({
      localVideoEl: self.state.localVideoId,
      remoteVideosEl: '',
      autoRequestMedia: true,
      detectSpeakingEvents: true,
      nick: DiamondAPI.getCurrentUser().profile.name,
    });
    
    self.setState({
      webrtc,
    });
  }
  componentDidMount() {
    let self = this;
    let webrtc = self.state.webrtc;
    
    const VIDEO_WIDTH = 250, 
          VIDEO_HEIGHT = 250,
          VIDEO_START = 'playing',
          AUDIO_START = 'unmuted';
    
    // RTC ready event
    webrtc.on('readyToCall', () => {
      self.setState({
        readyToCall: true,
      });
    });
    
    // Remote peer created event
    webrtc.on('createdPeer', (peer) => {
      // Created peer on room
    });
    
    // New/Removed videos events
    webrtc.on('videoAdded', (video, peer) => {
      let { videos, peers } = self.state;
      
      videos.push({
        id: peer.id,
        domId: webrtc.getDomId(peer),
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        video: VIDEO_START,
        audio: AUDIO_START,
        peer,
      });
      
      peers.push(peer);
      
      self.setState({
        videos,
        peers,
      });
    });
    webrtc.on('videoRemoved', (video, peer) => {
      let { videos, peers } = self.state;
      let videoDomId =  webrtc.getDomId(peer);
      
      videos.forEach((video, index) => {
        if (video.domId === videoDomId) {
          videos.splice(index, 1);
        }
      });
      
      peers.forEach((_peer, index) => {
        if (_peer.id === peer.id) {
          peers.splice(index, 1);
        }
      });
      
      self.setState({
        videos,
        peers,
      });
    });
    
    // Access to media stream events
    webrtc.on('localStream', (stream) => {
      console.log('Access to media stream', stream);
    });
    webrtc.on('localMediaError', (error) => {
      console.log('Failed access to media stream', error);
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
    webrtc.on('volumeChange', (volume, threshold) => {
      // console.log('Local volume change', volume, threshold);
    });
    webrtc.on('remoteVolumeChange', (peer, volume) => {
      // console.log('Remote volume change', peer, volume);
    });
    
    // Audio mute/unmute events
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
    
    // Failure events
    webrtc.on('iceFailed', (peer) => {
      // Local p2p/ice failure
      let pc = peer.pc;
      console.log('Had local relay candidate', pc.hadLocalRelayCandidate);
      console.log('Had remote relay candidate', pc.hadRemoteRelayCandidate);
    });
    webrtc.on('connectivityError', (peer) => {
      // Remote p2p/ice failure
      let pc = peer.pc;
      console.log('Had local relay candidate', pc.hadLocalRelayCandidate);
      console.log('Had remote relay candidate', pc.hadRemoteRelayCandidate);
    });
  }
  connect() {
    if (this.state.readyToCall) {
      let board = DiamondAPI.getCurrentBoard();
      
      this.state.webrtc.joinRoom(board._id);
      this.setState({
        connected: true,
      });
    }
  }
}

class UsersList extends React.Component {
  render() {
    return (
      <div>
        <h4>Lista de usuarios</h4>
        <div>
          <p>Vos</p>
          { this.renderPeers() }
        </div>
      </div>
    );
  }
  renderPeers() {
    return this.props.peers.map((peer) => {
      return (
        <p>{ peer.nick }</p>
      );
    });
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
        <video
          id={ this.props.id }
          width={ this.props.width }>
        </video>
        { 
          this.props.connected ? (
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
            </div>
          ) : ( null )
        }

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
        <Video 
          key={ video.id }
          { ...video } />
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

UsersList.propTypes = { 
  peers: React.PropTypes.object.isRequired,
};
UserVideo.propTypes = { 
  id: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  webrtc: React.PropTypes.object.isRequired,
  connected: React.PropTypes.boolean.isRequired,
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
