import React       from 'react';

import VideoStatus from './VideoStatus';

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

export default Video;