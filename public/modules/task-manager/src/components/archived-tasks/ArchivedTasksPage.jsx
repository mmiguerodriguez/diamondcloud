import React from 'react';

import ArchivedTasksLayout from './ArchivedTasksLayout';

/**
 * Gets a list of archived tasks.
 * If the board is coordination or directors, shows all archived tasks
 * Otherwise, it shows archived tasks of the current board only.
 */
class ArchivedTasksPage extends React.Component {
  constructor() {
    super();

    /**
     * States
     *
     * @param {Array} tasks
     *  The archived tasks that are shown to the user.
     */
    this.state = {
      tasks: [],
      loading: true,
    };
  }

  componentDidMount() {
    //show only archived tasks
    const tasks = this.props.tasks.filter(task => task.archived);
    this.setState({
      tasks,
      loading: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    const tasks = nextProps.tasks.filter(task => task.archived);
    this.setState({
      tasks,
      loading: false,
    });
  }

  render() {
    if (this.state.loading || this.state.loading === undefined) {
      return (
        <div className="loading">
          <div className="loader" />
        </div>
      );
    }

    return (
      <ArchivedTasksLayout
        tasks={this.state.tasks}
        setLocation={this.props.setLocation}
        showError={this.props.showError}
        location={this.props.location}
      />
    );
  }
}

export default ArchivedTasksPage;
