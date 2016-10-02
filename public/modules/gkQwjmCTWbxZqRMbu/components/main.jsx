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
          width={ '250px' } />
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
    
    webrtc.on('videoAdded', (video, peer) => {
      let videos = self.state.videos;
      videos.push({
        id: 'container_' + webrtc.getDomId(peer),
        peer,
      });
      
      self.setState({
        videos,
      });
    });
    webrtc.on('videoRemoved', (video, peer) => {
      let videos = self.state.videos;
      let videoId = 'container_' + webrtc.getDomId(peer);
      
      videos.forEach((video, index) => {
        if (video.id === videoId) {
          videos.splice(index, 1);
        }
      });
      
      self.setState({
        videos,
      });
    });
    
    // Join to the currentBoard room
    webrtc.joinRoom(currentBoard._id);
  }
}

class UserVideo extends React.Component {
  render() {
    return (
      <video
        id={ this.props.id }
        width={ this.props.width }>
      </video>
    );
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
  render() {
    return (
      <video
        id={ this.props.id }
        src={ URL.createObjectURL(this.props.peer.stream) }
        onContextMenu={ () => { return false; } }
        autoPlay>
      </video>
    );
  }
}

UserVideo.propTypes = { 
  id: React.PropTypes.string.isRequired,
  width: React.PropTypes.string.isRequired,
};
RemoteVideos.propTypes = {
  videos: React.PropTypes.array.isRequired
};
Video.propTypes = { 
  id: React.PropTypes.string.isRequired,
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
