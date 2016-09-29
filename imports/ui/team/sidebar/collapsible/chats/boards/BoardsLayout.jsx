import React from 'react';

import Board from './board/Board.jsx';

export default class BoardsLayout extends React.Component {
  render() {
    return (
      <div className='container-fluid'>
        <h5>
          <b>Boards</b>
        </h5>
        <hr className='hr-fixed-color' />
        <div>
          { this.renderBoards() }
        </div>
      </div>
    );
  }
  renderBoards() {
    return this.props.boards.map((board) => {
      return (
        <Board
          key={ board._id }
          board={ board }
          notifications={ board.getNotifications() }
          addChat={ this.props.addChat } />
      );
    });
  }
}

BoardsLayout.propTypes = {
  boards: React.PropTypes.array.isRequired,
  addChat: React.PropTypes.func.isRequired,
};
