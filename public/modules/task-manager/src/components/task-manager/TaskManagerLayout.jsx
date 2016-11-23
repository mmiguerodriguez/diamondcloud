import React              from 'react';
import { browserHistory } from 'react-router';
import classNames         from 'classNames';

import ErrorMessage       from '../error-message/ErrorMessage';

const ERROR_DELAY = 5000;

/**
 * Clones the actual route element (this.props.children)
 * to pass props to it and renders the routes.
 */
class TaskManagerLayout extends React.Component {
  /**
   * Sets the error state so we can show an error
   * correctly.
   * @param {Object} object
   *  @param {String} body
   *   Error message.
   *  @param {Number} delay
   *   The delay until the message is closed
   *  @param {Boolean} showing.
   *   State to check if the message is being
   *   shown or not.
   */
  showError({ body, delay }) {
    this.setState({
      error: {
        body,
        delay: delay || ERROR_DELAY,
        showing: true,
      },
    });
  }
  /**
   * Resets the error state to the default.
   */
  hideError() {
    this.setState({
      error: {
        body: '',
        delay: ERROR_DELAY,
        showing: false,
      },
    });
  }

  setLocation(location) {
    browserHistory.push(location);
  }

  handleChange(index, boardId, event) {
    this.setState({
      [index]: event.target.value,
      selectedBoardId: boardId,
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      taskTitle: '',
      selectedBoardId: undefined,
      error: {
        body: '',
        delay: ERROR_DELAY,
        showing: false,
      },
    };

    this.showError = this.showError.bind(this);
    this.hideError = this.hideError.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const isCoordination = this.props.coordination;
    const isUnarchiving = this.props.location.pathname.indexOf('archived') > -1;
    const isPanel = this.props.location.pathname.indexOf('panel') > -1;
    const hasArchivedTasks = this.props.tasks.filter(_task => _task.archived).length > 0;

    const classes = classNames({
      fixed: isPanel,
    }, 'view-archived-tasks');

    return (
      <div className="col-xs-12 task-manager">
        <div className="row board-list-title">
          {
            // Show back button for panel
            isPanel || isUnarchiving ? (
              <div
                className="go-back go-back-task"
                onClick={() => this.setLocation('tasks/show')}
              />
            ) : (null)
          }
          <div
            role="button"
            className="col-xs-12 text-center"
            onClick={() => this.setLocation('tasks/show')}
          >
            <b>Lista de tareas</b>

          </div>
          {
            // Show archived tasks button
            isCoordination && !isUnarchiving && hasArchivedTasks ?
              <div
                id="view-archived-tasks"
                className={classes}
                title="Ver tareas archivadas"
                data-toggle="tooltip"
                data-placement="bottom"
                role='button'
                onClick={(e) => {
                  $('#' + e.target.id).tooltip('hide');
                  this.setLocation('tasks/archived');
                }}
              /> : (null)
          }
          {
            // Show show-panel button
            isCoordination && !isPanel ? (
              <div
                id="show-panel"
                className="text-center panel-btn"
                title="Configurar tipos de tareas"
                data-toggle="tooltip"
                data-placement="bottom"
                role="button"
                onClick={(e) => {
                  $(`#${e.target.id}`).tooltip('hide');
                  this.setLocation('panel');
                }}
              />
            ) : (null)
          }
        </div>
        <hr className="hr-fix" />
        {
          React.cloneElement(this.props.children, {
            ...this.props,
            ...this.state,
            setLocation: this.setLocation,
            handleChange: this.handleChange,
            showError: this.showError,
            hideError: this.hideError,
          })
        }

        {
          this.state.error.showing ? (
            <ErrorMessage
              hideError={this.hideError}
              {...this.state.error}
            />
          ) : (null)
        }

      </div>
    );
  }
}

export default TaskManagerLayout;
