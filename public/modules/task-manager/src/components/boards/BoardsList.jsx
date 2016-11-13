import React          from 'react';

import isCoordination from '../helpers/isCoordination';
import Board          from './board/Board';

/**
 * Renders all the boards the team has.
 */
class BoardsList extends React.Component {
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });
  }

  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });
  }

  renderBoards() {
    return this.props.boards.map((board) => {
      let tasks = [];

      /**
       * If there are tasks then push task to array
       * if it is from the actual board.
       */
      if (this.props.tasks !== undefined) {
        this.props.tasks.forEach((task) => {
          if (task.boardId === board._id) {
            tasks.push(task);
          }
        });
      }

      /**
       * If it isn't a coordination board then we
       * render only one board tasks.
       */
      if (!this.props.coordination) {
        if (board._id === this.props.currentBoard._id) {
          return (
            <Board
              key={board._id}
              board={board}
              tasks={tasks}
              coordination={this.props.coordination}
              setLocation={this.props.setLocation}
              currentUser={this.props.currentUser}
              showError={this.props.showError}
              hideError={this.props.hideError}
              location={this.props.location}
            />
          );
        } else {
          return;
        }
      }

      /**
       * If it is a coordination board then it will
       * return all the boards except for the
       * coordination one.
       */
      if (!isCoordination(board)) {
        return (
          <Board
            key={board._id}
            board={board}
            tasks={tasks}
            coordination={this.props.coordination}
            setLocation={this.props.setLocation}
            currentUser={this.props.currentUser}
            handleChange={this.props.handleChange}
            showError={this.props.showError}
            hideError={this.props.hideError}
            location={this.props.location}
          />
        );
      } else {
        return;
      }
    });
  }

  render() {
    return (
      <div className='col-xs-12 board-list'>
        {this.renderBoards()}
      </div>
    );
  }
}

export default BoardsList;
