import React from 'react';
import { browserHistory } from 'react-router';

class PresentationPage extends React.Component {
  render() {
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
          <i
            className="drive-navbar-btn presentate"
            onClick={() => { browserHistory.push(`/document/${this.props.params.id}`) }}
          >
            Volver a edición
          </i>
        </div>
        <iframe
          src={`https://docs.google.com/presentation/d/${this.props.params.id}/preview`}
          style={
            {
              width: '100%',
              height: 'calc(100% - 42px)'
            }
          }
        />
      </div>
    );
  }
}

export default PresentationPage;
