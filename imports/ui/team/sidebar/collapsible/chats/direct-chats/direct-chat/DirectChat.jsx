import { Meteor } from 'meteor/meteor';
import React from 'react';

export default class DirectChat extends React.Component {
  render() {
    console.log('DirectChat -> render -> directChat', this.props.directChat);
    return (
      <div className='row row-fixed-margin' onClick={ this.props.getMessages.bind(null, { directChatId: this.props.directChat._id }) }>
        <div className='col-xs-2 img-fixed-margin fixed-padding'>
          <img className='img-circle' src='http://image.flaticon.com/icons/svg/60/60541.svg' width='22px' />
        </div>
        <div className='col-xs-8'>
          <h4 className='truncate'>{ this.props.directChat.users[1]._id }</h4>
        </div>
        <div className='col-xs-2 img-fixed-margin'>
          <div className='messages-badge img-circle'></div>
        </div>
      </div>
    );
  }
}

DirectChat.propTypes = {
  directChat: React.PropTypes.object.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
