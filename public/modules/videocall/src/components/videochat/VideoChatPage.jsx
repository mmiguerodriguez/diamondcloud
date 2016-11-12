import React           from 'react';

import VideoChatLayout from './VideoChatLayout';
import ErrorMessage    from '../error-message/ErrorMessage';

const ERROR_DELAY = 5000;

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
        body: 'Error en la cámara/micrófono',
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

export default VideoChatPage;