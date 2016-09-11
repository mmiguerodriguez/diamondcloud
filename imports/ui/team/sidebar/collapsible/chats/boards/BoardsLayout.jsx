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
      let notifications;
      board.users.map((user) => {
        if(user.email === Meteor.user().email()) {
          notifications = user.notifications;
        }
      });
      
      arr.push(
        <Board
          key={ board._id }
          board={ board }
          notifications={ notifications }
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
