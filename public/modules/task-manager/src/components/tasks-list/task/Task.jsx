import React from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classNames';

/**
 * Renders an unique task.
 */
class Task extends React.Component {
  /**
   * Opens a task information.
   * Routes to -> /task/taskId.
   */
  openTask() {
    if (this.props.coordination) {
      browserHistory.push('/tasks/' + this.props.task._id);
    }
  }
  /**
   * Starts a task, inserts the userId and startTime
   * to the durations array and starts the timer
   * interval.
   */
  startTask() {
    const self = this;

    $(`#play-task-${this.props.task._id}`).tooltip('hide');

    self.startTimer(() => {
      DiamondAPI.update({
        collection: 'tasks',
        filter: {
          _id: self.props.task._id,
        },
        updateQuery: {
          $push: {
            durations: {
              userId: self.props.currentUser._id,
              startTime: new Date().getTime(),
              endTime: undefined,
            },
          },
        },
        callback(error, result) {
          if (error) {
            self.props.showError({
              body: 'Ocurrió un error interno al iniciar la tarea',
            });

            self.stopTimer();
          } else {
            self.props.showError({
              body: 'Tarea iniciada',
            });
          }
        }
      });
    });
  }
  /**
   * Stops the task for the user setting his last
   * task endTime to the actual date and stops
   * the timer.
   */
  stopTask() {
    const self = this;

    $(`#pause-task-${this.props.task._id}`).tooltip('hide');

    self.stopTimer(() => {
      const index = self.getLastTaskEndTimeIndex();

      if (index === undefined) {
        self.startTimer();
        return;
      }

      DiamondAPI.update({
        collection: 'tasks',
        filter: {
          _id: self.props.task._id,
        },
        updateQuery: {
          $set: {
            [`durations.${index}.endTime`]: new Date().getTime(),
          },
        },
        callback(error, result) {
          if (error) {
            self.props.showError({
              body: 'Error al pausar una tarea',
            });

            self.startTimer();
          } else {
            self.props.showError({
              body: 'Tarea pausada',
            });
          }
        }
      });
    });
  }
  /**
   * Archives the tasks, sets archived: true.
   * This command can be used only from the
   * coordination board.
   */
  archiveTask() {
    const self = this;

    if (self.props.coordination) {
      $(`#archive-task-${self.props.task._id}`).tooltip('destroy');

      DiamondAPI.update({
        collection: 'tasks',
        filter: {
          _id: self.props.task._id,
        },
        updateQuery: {
          $set: {
            archived: true,
          },
        },
        callback(error, result) {
          if (error) {
            console.error(error);

            self.props.showError({
              body: 'Error al archivar una tarea',
            });
          } else {
            self.props.showError({
              body: 'Tarea archivada',
            });
          }
        }
      });
    }
  }
  /**
   * Dearchives the task, sets archived: false.
   * This command can be used only from the
   * coordination board.
   */
  dearchiveTask() {
    const self = this;

    if (self.props.coordination) {
      $(`#dearchive-task-${self.props.task._id}`).tooltip('hide');

      DiamondAPI.update({
        collection: 'tasks',
        filter: {
          _id: self.props.task._id,
        },
        updateQuery: {
          $set: {
            archived: false,
          },
        },
        callback(error, result) {
          if (error) {
            console.error(error);

            self.props.showError({
              body: 'Error al desarchivar una tarea',
            });
          } else {
            self.props.showError({
              body: 'Tarea desarchivada',
            });
          }
        }
      });
    }
  }
  /**
   * Sets the task status as the passed parameter.
   * @param {String} status
   */
  setTaskStatus(status) {
    const self = this;
    /**
     * Used to stop all the durations from the users
     * that have started the task.
     * TODO: Fix issue when there is an error
     * updating and set the durations as
     * undefined again.
     */
    let updateQuery;

    if (status === 'finished') {
      const durations = [];
      const date = new Date().getTime();

      this.props.task.durations.forEach((duration) => {
        const _duration = duration;
        if (!_duration.endTime) {
          _duration.endTime = date;
        }

        durations.push(_duration);
      });

      updateQuery = {
        $set: {
          durations,
          status,
        },
      };

      $(`#finish-task-${self.props.task._id}`).tooltip('destroy');
    } else if (status === 'not_finished') {
      if (this.state.rejecting) {
        this.setState({
          rejecting: false,
        });
      }

      updateQuery = {
        $set: {
          status,
        },
      };

      $(`#accept-task-${self.props.task._id}`).tooltip('destroy');
      $(`#reject-task-${self.props.task._id}`).tooltip('destroy');
    } else if (status === 'rejected') {
      updateQuery = {
        $set: {
          status,
          rejectMessage: self.state.rejectDescription,
        },
      };

      $(`#accept-task-${self.props.task._id}`).tooltip('destroy');
      $(`#reject-task-${self.props.task._id}`).tooltip('destroy');
    } else if (status === 'queued') {
      updateQuery = {
        $set: {
          status,
          rejectMessage: '',
        },
      };

      $(`#restore-task-${self.props.task._id}`).tooltip('destroy');
    }

    DiamondAPI.update({
      collection: 'tasks',
      filter: {
        _id: self.props.task._id,
      },
      updateQuery,
      callback(error, result) {
        if (error) {
          self.props.showError({
            body: 'Error al actualizar el estado de la tarea',
          });
        } else {
          self.props.showError({
            body: 'Estado de la tarea actualizado',
          });
        }
      }
    });
  }
  /**
   * Sets the task title according to the task_title
   * state variable.
   */
  setTaskTitle() {
    const self = this;

    if (self.props.coordination) {
      if (self.state.task_title !== '') {
        self.stopEditing(() => {
          DiamondAPI.update({
            collection: 'tasks',
            filter: {
              _id: self.props.task._id,
            },
            updateQuery: {
              $set: {
                title: self.state.task_title,
              },
            },
            callback(error, result) {
              if (error) {
                self.props.showError({
                  body: 'Error al actualizar el título de la tarea',
                });

                self.setState({
                  task_title: self.props.task.title,
                });
              }
            }
          });
        });
      } else {
        this.props.showError({
          body: 'El título de la tarea es inválido',
        });
      }
    }
  }
  /**
   * Gets the last task update for the user.
   * The duration in which user startTime
   * exists and endTime is undefined.
   *
   * If the task was never started by the
   * user, it returns a 'never_started'
   * flag.
   *
   * @returns {Number} Date
   */
  getLastTaskUpdate() {
    let startTimes = this.props.task.durations.map((duration) => {
      if (duration.userId === this.props.currentUser._id) {
        if (duration.endTime === undefined || typeof duration.endTime === 'undefined') {
          return duration.startTime;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });

    if (startTimes.length > 0) {
      return Math.max(...startTimes);
    } else {
      return 'never_started';
    }
  }
  /**
   * Gets the last endTime index of the user from the
   * durations array.
   *
   * It searches through all the durations from the
   * taks and gives the index of the duration of
   * the user that has endTime: undefined.
   *
   * @returns {Number} Date
   * TODO: Deprecate this.
   */
  getLastTaskEndTimeIndex() {
    let i;

    this.props.task.durations.forEach((duration, index) => {
      if (!duration.endTime && duration.userId === this.props.currentUser._id) {
        i = index;
      }
    });

    return i;
  }
  /**
   * Starts the timer and sets the interval and
   * doing state.
   *
   * @param {Function} callback
   *  Function to be called after the state
   *  is set, usually to start the task.
   */
  startTimer(callback) {
    let intervalId = setInterval(this.prettyDate.bind(this), 1000);

    this.setState({
      intervalId,
      doing: true,
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
  /**
   * Stops the timer, clears the interval
   * and sets the state as not doing,
   * no interval and count.
   *
   * @param {Function} callback
   *  Function to be called after the state
   *  is set, usually to stop the task.
   */
  stopTimer(callback) {
    clearInterval(this.state.intervalId);

    this.setState({
      intervalId: false,
      count: '00:00:00',
      doing: false,
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
  /**
   * Creates a nice format for the time the user has
   * been doing a task.
   *
   * @returns {String} count
   */
  prettyDate() {
    let start = this.getLastTaskUpdate();
    let end = new Date().getTime();

    let count = '';
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;

    if (start !== 'never_started' && start !== 0) {
      let difference_ms = end - start;
      difference_ms = difference_ms / 1000;

      seconds = Math.floor(difference_ms % 60);
      difference_ms = difference_ms / 60;

      minutes = Math.floor(difference_ms % 60);
      difference_ms = difference_ms / 60;

      hours = Math.floor(difference_ms % 24);
      days = Math.floor(difference_ms / 24);
    }

    seconds = seconds > 9 ? "" + seconds: "0" + seconds;
    minutes = minutes > 9 ? "" + minutes: "0" + minutes;
    hours = hours > 9 ? "" + hours: "0" + hours;

    count = hours + ':' + minutes + ':' + seconds;

    this.setState({
      count,
    });
  }
  /**
   * Changes state so the coordinator can start editing
   * the task title.
   */
  startEditing() {
    $(`#edit-task-${this.props.task._id}`).tooltip('hide');

    this.setState({
      editing: true,
    }, () => {
      $(`#edit-task-input-${this.props.task._id}`).focus();
    });
  }
  /**
   * Changes state so the coordination stops editing
   * the task title.
   * @param {Function} callback
   *   Sets the title of the task in the db as
   *   the way the coordinator wanted.
   */
  stopEditing(callback) {
    this.setState({
      editing: false,
    }, () => {
      callback();
    });
  }
  /**
   * Creates a draggable for the task element
   */
  createDraggable() {
    $(this.task).draggable({
      revert: function (event, ui) {
        const $drag = $(this);
        const $board = $drag.parent();
        const $dragStartBoard = $drag.data().parent;

        return $board.is($dragStartBoard);
      },
      start: function (event, ui) {
        $(this)
          .css('z-index', '1')
          .data('parent', $(this).parent());
      }
    });
  }

  handleChange(index, event) {
    if (index === 'edit_task') {
      if (this.props.coordination) {
        this.setState({
          [index]: event.target.value,
        });
      }
    } else {
      this.setState({
        [index]: event.target.value,
      });
    }
  }

  handleKeyDown(index, event) {
    if (event.which === 13) {
      if (index === 'edit_task') {
        if (this.props.coordination) {
            this.setTaskTitle();
        }
      } else if (index === 'reject_task') {
        this.setTaskStatus('rejected');
      }
    } else if (event.which === 27) {
      if (index === 'reject_task') {
        this.setState({
          rejecting: false,
        }, () => {
          $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
          });
        });
      }
    }
  }

  constructor(props) {
    super(props);

    /**
     * States
     *
     * @param {String} count
     *  The time in hh:mm:ss the user has been doing the task,
     *  defaults '00:00:00'.
     * @param {Any} intervalId
     *  The intervalId the setInterval uses. Used for
     *  internal work with the user timer.
     * @param {Boolean} doing
     *  Double-check if user is actually doing task for
     *  faster rendering.
     * @param {String} task_title
     *  Used for editing a task title.
     * @param {Boolean} editing
     *  Used to check if user is editing the task title.
     */
    this.state = {
      doing: this.props.doing,
      task_title: this.props.task.title,

      task_types: [],

      editing: false,
      rejecting: false,
      rejectDescription: '',
      showRejection: false,
      showDescription: true,

      intervalId: false,
      count: '00:00:00',
    };

    this.startTask = this.startTask.bind(this);
    this.stopTask = this.stopTask.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.archiveTask = this.archiveTask.bind(this);
    this.dearchiveTask = this.dearchiveTask.bind(this);
    this.setTaskStatus = this.setTaskStatus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.openTask = this.openTask.bind(this);
  }

  componentWillMount() {
    if (!this.props.coordination) {
      if (this.props.doing) {
        this.startTimer();
      }
    }
  }

  componentDidMount() {
    if (this.props.coordination) {
      if (this.props.task.status === 'rejected' && !this.props.task.archived) {
        this.createDraggable();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.task.title !== this.state.task_title) {
      this.setState({
        task_title: nextProps.task.title,
      });
    }

    if (this.props.coordination) {
      if (nextProps.task.status !== this.props.task.status) {
        if (nextProps.task.status === 'rejected' && !nextProps.task.archived) {
          this.createDraggable();
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props.coordination) {
      $(`#archive-task-${this.props.task._id}`).tooltip('destroy');
      $(`#edit-task-${this.props.task._id}`).tooltip('destroy');
      $(`#accept-task-${this.props.task._id}`).tooltip('destroy');
      $(`#reject-task-${this.props.task._id}`).tooltip('destroy');
      $(`#restore-task-${this.props.task._id}`).tooltip('destroy');
    } else {
      $(`#play-task-${this.props.task._id}`).tooltip('destroy');
      $(`#pause-task-${this.props.task._id}`).tooltip('destroy');
      $(`#finish-task-${this.props.task._id}`).tooltip('destroy');
    }

    if (this.state.intervalId) {
      this.stopTimer();
    }
  }

  render() {
    const self = this;

    const isCoordination = this.props.coordination;
    const isDoing = this.state.doing;
    const isEditing = this.state.editing;
    const isQueued = this.props.task.status === 'queued';
    const isFinished = this.props.task.status === 'finished';
    const isRejected = this.props.task.status === 'rejected';
    const isRejecting = this.state.rejecting;
    const isArchived = this.props.task.archived === true;
    const showDescription = this.state.showDescription;

    const role = classNames('button');
    const containerClass = classNames({
      'col-xs-12': isEditing || (!isCoordination && !isFinished),
      'col-xs-8': !isEditing && isCoordination,
      'fixed-title': !isCoordination || !isEditing,
    });
    const archiveClass = classNames({
      'col-xs-2': isCoordination && !isEditing,
      'col-xs-2 icon-fixed': isCoordination && !isEditing && !isFinished && !isRejected,
    }, 'archive-task');
    const dearchiveClass = classNames({
      'col-xs-2 icon-fixed': this.props.coordination && this.props.task.archived,
    }, 'unarchive-task');
    const editClass = classNames({
      'col-xs-2': isCoordination && !isEditing && isFinished,
      'col-xs-2 icon-fixed': isCoordination && !isEditing && !isFinished,
    }, 'edit-task');
    const descriptionClass = classNames({
      'open-description': showDescription,
      'hide-description': !showDescription,
    }, 'col-xs-10 description');
    const clickHandle = isCoordination ? this.openTask : () => {
      self.setState({
        showDescription: !this.state.showDescription,
      });
    };

    return (
      <div
        ref={c => this.task = c }
        className='col-xs-12 task'
        data-task-id={this.props.task._id}
        data-task-board-id={this.props.board._id}
      >
        <div>
          <div className={containerClass}>
            {
              /**
               * Input or task information depending if user is
               * editing or not a task
               */
              isEditing ? (
                <input
                  id={`edit-task-input-${this.props.task._id}`}
                  className='form-control edit-task-input'
                  type='text'
                  value={this.state.task_title}
                  onChange={(e) => this.handleChange('task_title', e)}
                  onKeyDown={(e) => this.handleKeyDown('edit_task', e)}
                />
              ) : (
                <div>
                  <h5
                    role={role}
                    onClick={clickHandle}
                    className='task-title col-xs-12'>
                    {this.state.task_title}
                  </h5>
                  {
                    /**
                     * Task description
                     */
                    !isCoordination ? (
                      <p className={descriptionClass}><b>Descripción:</b> {this.props.task.description}</p>
                    ) : (null)
                  }
                  {
                    /**
                     * User task count
                     */
                    !isCoordination && isDoing ? (
                      <p className='col-xs-12 time-active'><b>Tiempo activo:</b> {this.state.count}</p>
                    ) : (null)
                  }
                </div>
              )
            }
          </div>

          {
            /**
             * Edit task button
             */
            isCoordination && !isEditing &&
            !isFinished && !isRejected && !isArchived ? (
              <div
                id={`edit-task-${this.props.task._id}`}
                className={editClass}
                title='Editar tarea'
                data-toggle="tooltip"
                data-placement="bottom"
                role='button'
                onClick={this.startEditing}
              />
            ) : (null)
          }

          {
            /**
             * Archive a task button
             */
            isCoordination && !isEditing && !isArchived ? (
              <div
                id={`archive-task-${this.props.task._id}`}
                className={archiveClass}
                title="Archivar tarea"
                data-toggle="tooltip"
                data-placement="bottom"
                role="button"
                onClick={this.archiveTask}
              />
            ) : (null)
          }

          {
            /**
             * Restore a task button
             */
            isCoordination && !isEditing && (isFinished || isRejected) && !isArchived ? (
              <div
                id={`restore-task-${this.props.task._id}`}
                className="col-xs-2 restore-task"
                title="Restaurar tarea"
                data-toggle="tooltip"
                data-placement="bottom"
                role="button"
                onClick={() => this.setTaskStatus('queued')}
              />
            ) : (null)
          }

          {
            /**
             * Dearchive task button
             */
            isCoordination && isArchived ? (
              <div
                id={`dearchive-task-${this.props.task._id}`}
                className={dearchiveClass}
                title='Desarchivar tarea'
                data-toggle="tooltip"
                data-placement="bottom"
                role='button'
                onClick={this.dearchiveTask}
              />
            ) : (null)
          }

          {
            /**
             * Task finished icon
             */
            isCoordination && !isEditing && isFinished ? (
              <div className="finished-task" />
            ) : (null)
          }

          {
            /**
             * Task rejected icon
             */
            isCoordination && !isEditing && isRejected ? (
              <div className="rejected-task" />
            ) : (null)
          }

          {
            /**
             * Rejected task message for coordinators
             */
            isCoordination && isRejected ? (
              <div className="col-xs-12">
                <p className="rejected-message"><b>Mensaje de rechazo:</b> {this.props.task.rejectMessage}</p>
              </div>
            ) : (null)
          }

          {
            /**
             * Pause button when a task is being done by a
             * normal user
             */
            !isCoordination && isDoing && !isQueued ? (
              <div>
                <div className="record" />
                <div
                  id={`pause-task-${this.props.task._id}`}
                  className="pause"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Marcar como pausado"
                  role="button"
                  onClick={this.stopTask}
                />
              </div>
            ) : (null)
          }

          {
            /**
             * Start button when a task isn't being done
             * by a normal user and wants to start it
             */
            !isCoordination && !isDoing && !isQueued ? (
              <div
                id={`play-task-${this.props.task._id}`}
                className="play"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Marcar como haciendo"
                role="button"
                onClick={this.startTask}
              />
            ) : (null)
          }

          {
            /**
             * Finish a task button
             */
            !isCoordination && !isFinished && !isQueued ? (
              <div>
                <div
                  id={`finish-task-${this.props.task._id}`}
                  className="done"
                  title="Marcar como finalizado"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  role="button"
                  onClick={() => this.setTaskStatus('finished')}
                />
              </div>
            ) : (null)
          }

          {
            /**
             * Accept and reject task buttons for users
             * to decide or not if they want to do
             * that task
             */
            !isCoordination && isQueued && !isRejecting ? (
              <div>
                <div
                  id={`accept-task-${this.props.task._id}`}
                  className="accept"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Aceptar tarea"
                  role="button"
                  onClick={() => this.setTaskStatus('not_finished')}
                />
                <div
                  id={`reject-task-${this.props.task._id}`}
                  className="reject"
                  title="Rechazar tarea"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  role="button"
                  onClick={() => {
                    const self = this;

                    $(`#reject-task-${this.props.task._id}`).tooltip('hide');

                    setTimeout(() => {
                      self.setState({
                        rejecting: !isRejecting
                      }, () => {
                        $(`#reject-task-reason-${self.props.task._id}`).focus();
                      });
                    }, 200);
                  }}
                />
              </div>
            ) : (null)
          }

          {
            /**
             * Rejection message
             */
            !isCoordination && isRejecting ? (
              <div className="col-xs-12 reject-message">
                <b>Razón de rechazo:</b>
                <input
                  id={`reject-task-reason-${this.props.task._id}`}
                  className="form-control"
                  type="text"
                  value={this.state.rejectDescription}
                  onChange={(e) => this.handleChange('rejectDescription', e)}
                  onKeyDown={(e) => this.handleKeyDown('reject_task', e)}
                />
              </div>
            ) : (null)
          }

          {
            /**
             * Task term dates
             */
            !isEditing && !isRejecting ? (
              <div className="col-xs-12">
                <p className="col-xs-12 expiration-date">
                  <b>Plazo: </b>
                  {`${$.format.date(new Date(this.props.task.startDate), 'dd/MM/yy')} - ${$.format.date(new Date(this.props.task.dueDate), 'dd/MM/yy')}`}
                </p>
              </div>
            ) : (null)
          }
        </div>
      </div>
    );
  }
}

export default Task;
