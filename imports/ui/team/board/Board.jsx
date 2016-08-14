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
              <img className='img-circle shared-people'
                   src='//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOtt-yFL9aGQYz1k-cA0Am2Po4dKzi76pA/s96-c-mo/photo.jpg'
                   width='32px' />
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
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
