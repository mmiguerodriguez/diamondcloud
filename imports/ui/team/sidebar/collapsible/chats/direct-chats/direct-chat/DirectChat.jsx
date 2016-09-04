import React from 'react';

export default class DirectChat extends React.Component {
  render() {
    return (
      <div className='row row-fixed-margin' onClick={ this.props.getMessages.bind(null, { directChatId: this.props.directChat._id }) }>
        <div className='col-xs-2 img-fixed-margin fixed-padding'>
          <img className='img-circle' src='http://image.flaticon.com/icons/svg/60/60541.svg' width='22px' />
        </div>
        <div className={ this.props.notifications > 0 ? 'col-xs-8' : 'col-xs-10' }>
          <h4 className='truncate'>{ this.props.user }</h4>
        </div>
        {
          this.props.notifications > 0 ? (
            <div className='col-xs-2 img-fixed-margin'>
              <div className='messages-badge img-circle'>{ this.props.notifications }</div>
            </div>
          ) : ( null )
        }
      </div>
    );
  }
}

DirectChat.propTypes = {
  directChat: React.PropTypes.object.isRequired,
  user: React.PropTypes.string.isRequired,
  notifications: React.PropTypes.number.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
