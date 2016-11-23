import React from 'react';
import { browserHistory } from 'react-router';

class FileViewerLayout extends React.Component {
  render() {
    if (this.props.loading) {
      return (
        <div className="loading">
          <div className="loader"></div>
        </div>
      );
    }
    let url = `https://drive.google.com/open?id=${this.props.id}`;
    return (
      <div>
        <div className='drive-navbar'>
          <i
            className="go-back"
            onClick={ () => { browserHistory.push('/folder') } }
          />
          <p
            className='file-name truncate'
            title={this.props.fileName}
          >{this.props.fileName}</p>
          {
            (this.props.fileType === 'application/vnd.google-apps.presentation') ?
            (<i
              className="drive-navbar-btn presentate"
              onClick={() => { browserHistory.push(`/presentation/${this.props.id}`) }}
            >
              Iniciar presentación
            </i>) :
            (null)
          }
        </div>
        {
          (this.props.fileType.indexOf('image') !== -1 || this.props.fileType.indexOf('video') !== -1) ?
          (
          <div className="content-container">
            <div className="image-container">
              <div className="photo" />
              <p className="image-text">
                Para poder acceder a la imagen/video hace click <a href={url} target="_blank">acá</a>
              </p>
          </div>
        </div>
          ) : (
            <iframe
              src={url}
              style={
                {
                  width: '100%',
                  height: 'calc(100% - 42px)'
                }
              }
            />
          )
        }
      </div>
    );
  }
}

FileViewerLayout.propTypes = {
  id: React.PropTypes.string.isRequired,
  fileType: React.PropTypes.string.isRequired,
  loading: React.PropTypes.string.isRequired,
  fileName: React.PropTypes.string.isRequired,
};

export default FileViewerLayout;
