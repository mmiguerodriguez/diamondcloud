import React from 'react';

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
                <div
                  className='btn btn-danger pause'
                  title="Apagar video"
    
                  role="button"
                  onClick={this.pause}
                />
              ) : (
                <div
                  className='btn btn-success play'
                  title="Prender video"
    
                  role="button"
                  onClick={this.resume}
                />
              )
            }
            {
              this.state.audio === 'unmuted' ? (
                <div
                  className='btn btn-danger mute'
                  title="Silenciar"
    
                  role="button"
                  onClick={this.mute}
                />
              ) : (
                <div
                  className='btn btn-success unmute'
                  title="Activar microfono"
                  role="button"
                  onClick={this.unmute}
                />
              )
            }
            </div>
          ) : ( null )
        }

      </div>
    );
  }
}

export default UserVideo;