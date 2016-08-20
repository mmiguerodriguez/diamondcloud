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
