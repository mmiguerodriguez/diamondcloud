import React from 'react';
import classNames from 'classNames';

import TasksList from '../../tasks-list/TasksList';

/**
 * Renders an unique board with its tasks.
 */
class Board extends React.Component {
  render() {
    const classes = classNames({
      'no-coordination-board': !this.props.coordination,
      'board-fixed': this.props.coordination,
    });

    let tasks = this.props.tasks.filter(task => !task.archived);
    tasks = this.props.coordination ? (
      tasks
    ) : (
      tasks.filter(task =>
        task.status === 'not_finished' || task.status === 'queued'
      )
    );

    return (
      <div className={classes}>
        <TasksList
          tasks={tasks}
          board={this.props.board}
          coordination={this.props.coordination}
          setLocation={this.props.setLocation}
          currentUser={this.props.currentUser}
          handleChange={this.props.handleChange}
          showError={this.props.showError}
          hideError={this.props.hideError}
          location={this.props.location}
        />
      </div>
    );
  }
}

export default Board;
