import React from 'react';

import Board from './board/Board.jsx';

export default class BoardsLayout extends React.Component {
  render() {
    return (
      <div>
        <h3>Boards</h3>
        { this.renderBoards() }
      </div>
    );
  }

  renderBoards() {
    let arr = [];

    this.props.boards.map((board) => {
      arr.push(
        <Board
          key={ board._id }
          board={ board }
          getMessages={ this.props.getMessages } />
      );
    });

    return arr;
  }
}

BoardsLayout.propTypes = {
  boards: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
