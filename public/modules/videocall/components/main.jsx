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

const ERROR_DELAY = 5000;

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
      error: {
        body: '',
        delay: ERROR_DELAY,
        showing: false,
      },
    };

    this.error = this.error.bind(this);
  }

  componentWillMount() {
    const self = this;

    const webrtc = new SimpleWebRTC({
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
    const self = this;

    const webrtc = self.state.webrtc;
    const VIDEO_START = 'playing';
    const AUDIO_START = 'unmuted';

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
      const { videos, peers } = self.state;

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
      const { videos, peers } = self.state;
      const videoDomId = webrtc.getDomId(peer);

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

    });
    webrtc.on('localMediaError', (error) => {
      self.error({
        type: 'show',
        body: 'Hubo un error al acceder a la cámara/micrófono',
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

    // Failure events
    webrtc.on('iceFailed', (peer) => {
      // Local p2p/ice failure
      const pc = peer.pc;
      self.error({
        type: 'show',
        body: 'Hubo un error con la conexión local',
      });
    });
    webrtc.on('connectivityError', (peer) => {
      // Remote p2p/ice failure
      const pc = peer.pc;
      self.error({
        type: 'show',
        body: 'Hubo un error con la conexión remota',
      });
    });
  }

  error({ type = 'show', body = 'Ha ocurrido un error', delay = ERROR_DELAY }) {
    if (type === 'hide') {
      this.setState({
        error: {
          body: '',
          delay: ERROR_DELAY,
          showing: false,
        },
      });
    } else if (type === 'show') {
      this.setState({
        error: {
          body,
          delay: delay || ERROR_DELAY,
          showing: true,
        },
      });
    }
  }

  render() {
    return (
      <div>
        <VideoChatLayout
          error={this.error}
          {...this.state}
        />
        {
          this.state.error.showing ? (
            <ErrorMessage
              error={this.error}
              {...this.state.error}
            />
          ) : (null)
        }
      </div>
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

  connect() {
    if (this.props.readyToCall) {
      const board = DiamondAPI.getCurrentBoard();

      this.props.webrtc.joinRoom(board._id);

      this.setState({
        connected: true,
      });
    }
  }

  changeMaximizedVideo(id) {
    this.setState({
      maximizedVideo: id,
    });
  }

  renderVideos() {
    return this.props.videos.map((video) => {
      return (
        <Video
          key={video.id}
          position={
            (this.state.maximizedVideo === video.id) ?
              ('maximized-video') :
              ('minimized-video')
          }
          onClick={this.changeMaximizedVideo}
          webrtc={this.props.webrtc}
          {...video}
        />
      );
    });
  }

  render() {
    const remoteVideos = this.renderVideos();
    return (
      <div>
        <UserVideo
          id={this.props.localVideoId}
          position={
            (this.state.maximizedVideo === this.props.localVideoId) || (remoteVideos.length === 0)  ?
              ('maximized-video') : ('minimized-video')
          }
          onClick={this.changeMaximizedVideo}
          webrtc={this.props.webrtc}
          connected={this.state.connected}
        />
        {
          this.state.connected ? (
            <div>
              {remoteVideos}
            </div>
          ) : (
            <div className="join-background">
              <button
                className="btn btn-primary join"
                onClick={this.connect}
              />
            </div>
          )
        }
      </div>
    );
  }
}

/**
 * UserVideo layout, renders the user video with
 * 100% width and height.
 */
class UserVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { video: 'playing', audio: 'unmuted' };

    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
  }

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

  mute() {
    this.video.volume = 0;
    console.log('Muted...', this.video.volume, this.state.startVolume);
  }

  unmute() {
    this.video.volume = this.state.startVolume;
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
 * Renders error messages to tell user something
 * is wrong with their inputs, etc.
 */
class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    setTimeout(this.close.bind(null), this.props.delay);
  }

  close() {
    const self = this;

    $('.error-message').removeClass('show-error');
    $('.error-message').addClass('hide-error', () => {
      setTimeout(self.props.error.bind(null, { type: 'hide' }), 700);
    });
  }

  render() {
    return (
      <div className="error-message show-error">
        <div className="error-body">{this.props.body}</div>
        <div className="error-close" onClick={this.close}>Cerrar</div>
      </div>
    );
  }
}

/**
 * Router setup.
 */
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={VideoChatPage}>
      <IndexRoute component={VideoChatPage} />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
