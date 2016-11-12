import React from 'react';

import Board from './board/Board.jsx';

export default class BoardsLayout extends React.Component {
  renderBoards() {
    const boards = [];
    const isDirector =
      this.props.team.userIsCertainHierarchy(Meteor.user().email(), 'director creativo') ||
      this.props.team.userIsCertainHierarchy(Meteor.user().email(), 'director de cuentas');

    this.props.boards.forEach((board) => {
      const _board = (
        <Board
          key={board._id}
          board={board}
          notifications={board.getNotifications()}
          addChat={this.props.addChat}
        />
      );

      if (isDirector) {
        if ((board.type === 'creativos' && board.visibleForDirectors) || (board.type !== 'creativos' && board.type !== 'medios')) {
          boards.push(_board);
        }
      } else {
        boards.push(_board);
      }
    });
    
    return boards;
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
