import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div className='board-container'>
        <div className='sub-header'>
          <div className="col-xs-6">
            <h4 className="title col-xs-4">{ this.props.board.name }</h4>
            <h4 className="members col-xs-8">Miembros:</h4>
          </div>
          <div className="col-xs-6">
            <span>
              <img  src="/img/sidebar/messages.svg" 
                    className="message-icon"
                    width="28px" 
                    onClick={ this.props.getMessages.bind(null, { boardId: this.props.board._id }) }/>
            </span>
          </div>
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
