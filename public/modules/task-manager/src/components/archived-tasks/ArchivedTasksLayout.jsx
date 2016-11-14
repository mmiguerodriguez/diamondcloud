import React from 'react';

import isCoordination from '../helpers/isCoordination';
import TasksList from '../tasks-list/TasksList';

class ArchivedTasksLayout extends React.Component {
  render() {
    return (
      <TasksList
        board={{ name: 'Tareas archivadas' }}
        tasks={this.props.tasks}
        coordination={isCoordination(DiamondAPI.getCurrentBoard())}
        archivedView={true}
        currentUser={DiamondAPI.getCurrentUser()}
        handleChange={() => true}
        showError={this.props.showError}
        hideError={this.props.hideError}
        location={this.props.location}
      />
    );
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });
  }
}

ArchivedTasksLayout.propTypes = {
  tasks: React.PropTypes.array.isRequired,
};

export default ArchivedTasksLayout;
