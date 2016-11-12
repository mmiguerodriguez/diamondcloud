import React     from 'react';

import UserVideo from '../user-video/UserVideo';
import Video     from '../video/Video';

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

export default VideoChatLayout;