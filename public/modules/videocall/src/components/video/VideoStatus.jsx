import React from 'react';

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

export default VideoStatus;