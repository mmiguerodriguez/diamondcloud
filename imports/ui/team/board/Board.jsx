import { Meteor } from 'meteor/meteor';

import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div className='board-container'>
        <div className='sub-header'>
          <div className='sub-header-data'>
            <h4 className="title">{ this.props.board.name }</h4>
            <h4 className="members">
              Miembros: 
              { this.renderUsers() }
            </h4>
          </div>
          <span>
            <img  src="/img/sidebar/messages.svg" 
                  className="message-icon"
                  width="28px" 
                  onClick={ this.props.getMessages.bind(null, { boardId: this.props.board._id }) }/>
          </span>
        </div>
        <div>{ /* main board */ }</div>
      </div>
    );
  }
  
  renderUsers() {
    let arr = [];
    
    this.props.users.map((_user) => {
      let user = Meteor.users.findOne({ 'emails.address': _user.email });
      arr.push(
        <img  key={ user._id }
              className='img-circle shared-people'
              src={ user.profile.picture }
              alt={ user.profile.name }
              title={ user.profile.name }
              width='32px' />
      );
    });
    
    return arr;
  }
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
  users: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
