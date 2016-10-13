/**
 * Declare all variables as constants to prevent
 * linting warnings.
 */
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

/**
 * Start the module with the following route.
 */
browserHistory.push('/');

/**
 * Grabs all the data for the component to work.
 * User profile data and board id.
 */
class VideoChatPage extends React.Component {
  constructor() {
    super();

    this.state = {
      localVideoId: 'user-video',
      readyToCall: false,
      videos: [],
      peers: [],
      webrtc: {},
    };
  }

  componentWillMount() {
    let self = this;

    let webrtc = new SimpleWebRTC({
      localVideoEl: self.state.localVideoId,
      remoteVideosEl: '',
      autoRequestMedia: true,
      detectSpeakingEvents: true,
      nick: DiamondAPI.getCurrentUser().profile.name,
      url: 'https://diamondcloud.tk:8888',
      secure: true,
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

  render() {
    return (
      <VideoChatLayout { ...this.state } />
    );
  }
}

/**
 * Layout for the VideoChat
 * @renders UserVideo
 *          RemoteVideos
 */
class VideoChatLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      maximizedVideo: this.props.localVideoId,
    };

    this.connect = this.connect.bind(this);

    this.changeMaximizedVideo = this.changeMaximizedVideo.bind(this);
  }

  renderVideos() {
    return this.props.videos.map((video) => {
      return (
        <Video
          key={video.id }
          position={
            (this.state.maximizedVideo === video.id) ?
              ('maximized-video') :
              ('minimized-video')
          }
          onClick={this.changeMaximizedVideo}
          webrtc={this.props.webrtc}
          { ...video } />
      );
    });
  }

  connect() {
    if (this.props.readyToCall) {
      let board = DiamondAPI.getCurrentBoard();

      this.props.webrtc.joinRoom(board._id);
      this.setState({
        connected: true,
      });
    }
  }

  render() {
    return (
      <div>
        <UserVideo
          id={this.props.localVideoId}
          position={
            (this.state.maximizedVideo === this.props.localVideoId) ?
              ('maximized-video') :
              ('minimized-video')
          }
          onClick={this.changeMaximizedVideo}
          webrtc={this.props.webrtc}
          connected={this.state.connected} />
        {
          this.state.connected ? (
            <div>
              {this.renderVideos()}
            </div>
          ) : (
            <div className='join-background'>
              <button
                className='btn btn-primary join'
                onClick={this.connect}>
              </button>
            </div>
          )
        }
      </div>
    );
  }

  changeMaximizedVideo(id) {
    this.setState({
      maximizedVideo: id,
    });
  }
}

/**
 * UserVideo layout, renders the user video with
 * 100% width and height.
 */
class UserVideo extends React.Component {
  pause() {
    this.props.webrtc.pauseVideo();
    this.setState({
      video: 'paused',
    });
  }

  resume() {
    this.props.webrtc.resumeVideo();
    this.setState({
      video: 'playing',
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
      <div className={
        (this.props.position === 'maximized-video') ?
          'user-video-container' : 'minimized-video-container'
      } >
        <video
          id={this.props.id}
          className={this.props.position}
          onClick={this.props.onClick.bind(null, this.props.id)}>
        </video>
        {
          this.props.connected ? (
            <div className='user-video-btn'>
            {
              this.state.video === 'playing' ? (
                <button
                  className='btn btn-danger pause'
                  onClick={this.pause}>
                </button>
              ) : (
                <button
                  className='btn btn-success play'
                  onClick={this.resume}>
                </button>
              )
            }
            {
              this.state.audio === 'unmuted' ? (
                <button
                  className='btn btn-danger mute'
                  onClick={this.mute}>
                </button>
              ) : (
                <button
                  className='btn btn-success unmute'
                  onClick={this.unmute}>
                </button>
              )
            }
            </div>
          ) : ( null )
        }

      </div>
    );
  }
}

/**
 * Video layout, used for the rendering of remote
 * videos.
 */
class Video extends React.Component {
  mute() {
    this.video.volume = 0;
    console.log('Muted...', this.video.volume, this.state.startVolume);
  }

  unmute() {
    this.video.volume = this.state.startVolume;
  }

  constructor(props) {
    super(props);

    this.state = { startVolume: null };

    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
  }

  componentDidMount() {
    this.setState({
      startVolume: this.video.volume,
    });
  }

  render() {
    return (
      <div className={(this.props.position === 'minimized-video') ?
        'minimized-video-container' : null
      }>
        <div className='minimized-user-data'>
          <p className='nick'>{this.props.peer.nick}</p>
          <VideoStatus
            peer={this.props.peer}
            webrtc={this.props.webrtc} />
        </div>
        <video
          id={this.props.domId}
          className={this.props.position}
          onClick={this.props.onClick.bind(null, this.props.id)}
          src={URL.createObjectURL(this.props.peer.stream)}
          ref={(e) => this.video = e}
          onContextMenu={() => { return false; }}
          autoPlay>
        </video>
        {
        //<button className='btn btn-primary' onClick={this.mute}>Mute user</button>
        //<button className='btn btn-primary' onClick={this.unmute}>Unmute user</button>
        }
      </div>
    );
  }
}

/**
 * Shows the status of a remote video.
 * If the remote video is muted
 * or paused, it shows icons.
 *
 * This is made in a separate component to prevent image
 * flickering.
 */
class VideoStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = { audio: 'unmuted', video: 'playing' };
  }

  componentDidMount() {
    let self = this;

    self.props.webrtc.on('mute', (data) => {
      self.props.webrtc.getPeers(data.id).forEach((peer) => {
        if (peer.id === self.props.peer.id) {
          self.setState({
            [data.name]: data.name === 'audio' ? 'muted' : 'paused',
          });
        }
      });
    });
    self.props.webrtc.on('unmute', (data) => {
      self.props.webrtc.getPeers(data.id).forEach((peer) => {
        if (peer.id === self.props.peer.id) {
          self.setState({
            [data.name]: data.name === 'audio' ? 'unmuted' : 'playing',
          });
        }
      });
    });
  }

  render() {
    return (
      <div>
        {
          this.state.audio === 'muted' ? (
            <p>
              <i className="material-icons">mic_off</i>
            </p>
          ) : (null)
        }
        {
          this.state.video === 'paused' ? (
            <p>
              <i className="material-icons">videocam_off</i>
            </p>
          ) : (null)
        }
      </div>
    );
  }
}

/**
 * Router setup.
 */
ReactDOM.render(
  <Router history={browserHistory }>
    <Route path='/' component={VideoChatPage }>
      <IndexRoute component={VideoChatPage } />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
