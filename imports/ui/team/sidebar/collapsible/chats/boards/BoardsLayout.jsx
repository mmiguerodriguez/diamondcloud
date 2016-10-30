import React from 'react';

import Board from './board/Board.jsx';

export default class BoardsLayout extends React.Component {
  renderBoards() {
    return this.props.boards.map((board) => {
      return (
        <Board
          key={board._id}
          board={board}
          notifications={board.getNotifications()}
          addChat={this.props.addChat}
        />
      );
    });
  }

  render() {
    return (
      <div className='container-fluid'>
        <h5>
          <b>Pizarrones</b>
        </h5>
        <hr className='hr-fixed-color' />
        <div>
          {this.renderBoards()}
        </div>
      </div>
    );
  }
}

BoardsLayout.propTypes = {
  boards: React.PropTypes.array.isRequired,
  addChat: React.PropTypes.func.isRequired,
};
