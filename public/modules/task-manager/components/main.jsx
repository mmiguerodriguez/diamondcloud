/**
 * Declare all variables as constants to prevent
 * linting warnings.
 */
const {
  DiamondAPI,
  React,
  ReactDOM,
  ReactRouter,
  classNames,
  $,
} = window;
const {
  Router,
  Route,
  IndexRoute,
  browserHistory
} = ReactRouter;

/**
 * ErrorComponent delay
 * (in miliseconds)
 */
const ERROR_DELAY = 5000;

/**
 * Starts the module with the following route.
 */
browserHistory.push('/tasks/show');

/**
 * Grabs all the data needed for the component to work
 * and passes it to the layout.
 */
class TaskManagerPage extends React.Component {
  constructor() {
    super();

    /**
     * States
     *
     * @param {Array} tasks
     *  All the tasks we need to show
     *  to the user.
     * @param {Object} coordinationBoard
     *  An object containing the _id
     *  of the coordination board.
     * @param {Object} currentBoard
     *  Current board object.
     * @param {Object} currentUser
     *  Current user object.
     * @param {Boolean} coordination
     *  A bool that says if the actual
     *  board is or not a
     *  coordination
     *  board.
     * @param {Boolean} loading
     *  A bool to check if the subscription
     *  is loading.
     * @param {Array} users
     *  An array of the team users.
     * @param {Array} boards
     *  An array of the team boards.
     */
    this.state = {
      tasks: [],
      coordinationBoard: {},
      currentBoard: {},
      currentUser: {},
      coordination: false,
      loading: true,
      users: [],
      boards: [],
    };
  }

  componentDidMount() {
    let self = this;
    let coordinationBoard, currentBoard, currentUser, coordination;

    DiamondAPI.get({
      collection: 'coordinationBoard',
      filter: {},
      callback(error, result) {
        if (error) {
          console.error(error);
        } else {
          coordinationBoard = result[0];
          currentBoard =  DiamondAPI.getCurrentBoard();
          currentUser = DiamondAPI.getCurrentUser();
          coordination = coordinationBoard._id === currentBoard._id;

          /**
           *  Set coordinationBoard, currentBoard, user and if
           *  it's a coordinationBoard, a boolean.
           */
          self.setState({
            coordinationBoard,
            currentBoard,
            currentUser,
            coordination,
          }, () => {
            /**
             * If it's a coordinationBoard then fetch all tasks,
             * even finished ones, except archived.
             * If not, fetch the ones that are from the
             * currentBoard and that are not finished.
             */
            let filter = coordination ? {
              archived: false,
            } : {
              boardId: currentBoard._id,
              status: 'not_finished',
            };

            /**
             * After grabbing all the data we needed, subscribe
             * to the tasks collection with the filter, and
             * setting the state on the callback.
             */
            const taskManagerHandle = DiamondAPI.subscribe({
              collection: 'tasks',
              filter,
              callback(error, result) {
                if (error) {
                  console.error(error);
                } else {
                  console.log('Subscribe callback', result ? result : []);
                  self.setState({
                    tasks: result ? result : [],
                    loading: false,
                  });
                }
              }
            });

            self.setState({
              boards: DiamondAPI.getBoards(),
              users: DiamondAPI.getUsers(),
            });
          });
        }
      }
    });
  }

  render() {
    if (this.state.loading || this.state.loading === undefined) {
      return (
        <div className='loading'>
          <div className='loader'></div>
        </div>
      );
    }

    return (
      <TaskManagerLayout {...this.state} {...this.props} />
    );
  }
}

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
        delay: delay ? delay : ERROR_DELAY,
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
      }
    };

    this.showError = this.showError.bind(this);
    this.hideError = this.hideError.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className='col-xs-12 task-manager'>
        <div
          role='button'
          className='col-xs-12 text-center board-list-title'
          onClick={() => this.setLocation('tasks/show')}>
            <b>Lista de tareas</b>
            <hr className='hr-fix' />
        </div>

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

/**
 * Renders the layout to create a task.
 */
class CreateTask extends React.Component {
  /**
   * Creates a task checking before if the input data is
   * correct.
   */
  createTask() {
    let self = this;

    let position = self.getBiggestTaskPosition();
    let dueDate = Number(self.state.dueDate);

    if (self.state.title.length > 0 && self.state.title !== '') {
      if (self.state.boardId !== '') {
        if (Number.isInteger(dueDate) && dueDate !== 0) {
          if (Number(dueDate) > new Date().getTime()) {
            if (position >= 0) {
              DiamondAPI.insert({
                collection: 'tasks',
                object: {
                  title: self.state.title,
                  boardId: self.state.boardId,
                  durations: [],
                  dueDate,
                  position,
                  status: 'not_finished',
                  archived: false,
                },
                isGlobal: true,
                callback(error, result) {
                  if (error) {
                    console.error(error);
                  } else {
                    console.log('Inserted task correctly');
                    browserHistory.push('/tasks/show');
                  }
                }
              });
            } else {
              console.error('There was an error inserting task position', position);
              self.props.showError({
                body: 'La posición de la tarea es inválida',
              });
            }
          } else {
            console.error('There was an error instering task dueDate', self.state.dueDate);
            self.props.showError({
              body: 'La fecha de la tarea es inválida',
            });
          }
        } else {
          console.error('There was an error inserting task dueDate', self.state.dueDate);
          self.props.showError({
            body: 'La fecha de la tarea es inválida',
          });
        }
      } else {
        console.error('There was an error inserting task boardId', self.state.boardId);
        self.props.showError({
          body: 'El board asociado a la tarea es inválido',
        });
      }
    } else {
      console.error('There was an error inserting task title', self.state.title);
      self.props.showError({
        body: 'El título de la tarea es inválido',
      });
    }
  }
  /**
   * Gets the biggest task position so it inserts the task
   * position as the biggest + 1.
   *
   * @returns {Number} biggestTaskPosition
   */
  getBiggestTaskPosition() {
    let positions = [];

    this.props.tasks.forEach((task) => {
      if (task.boardId === this.state.boardId) {
        positions.push(task.position);
      }
    });

    if (positions.length > 0) {
      return Math.max(...positions) + 1;
    } else {
      return 0;
    }
  }
  /**
   * Renders the <option> elements of the boards, except
   * for the coordination board.
   */
  renderOptions() {
    return this.props.boards.map((board) => {
      if (board._id !== this.props.coordinationBoard._id) {
        return (
          <option
            key={board._id}
            value={board._id}>
            {board.name}
          </option>
        );
      }
    });
  }

  handleChange(index, event) {
    let value = event.target.value;

    if (index === 'dueDate') {
      value = new Date(value).getTime();
    }

    this.setState({
      [index]: value,
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      title: this.props.taskTitle,
      boardId: this.props.selectedBoardId || this.props.boards[0]._id,
      dueDate: '',
    };

    this.createTask = this.createTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    $('#create-task-title').focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.taskTitle !== this.props.taskTitle) {
      this.setState({
        title: nextProps.taskTitle,
      });
    }
  }

  render() {
    return (
      <div className='row create-task-form'>
        <div className='col-xs-12'>
          <div
            className='go-back'
            onClick={() => this.props.setLocation('tasks/show')}>
          </div>
          <h4 className='visible-xs-inline-block'>Crear una tarea</h4>
        </div>
        <div className='col-xs-12 create-task-inputs'>
          <div className='form-group'>
            <label className='control-label' htmlFor='create-task-title'>Título</label>
            <input
              id='create-task-title'
              className='form-control'
              value={this.state.title}
              onChange={this.props.handleChange.bind(null, 'taskTitle', undefined)}
              type='text'
              placeholder='Ingresá el título'
            />
          </div>
          <div className='form-group'>
            <label className='control-label' htmlFor='create-task-duedate'>Fecha de vencimiento</label>
            <input
              id='create-task-duedate'
              className='form-control'
              type='datetime-local'
              placeholder='Ingresá la fecha de vencimiento'
              onChange={(e) => this.handleChange('dueDate', e)}
            />
          </div>
          <div className='form-group'>
            <label className='control-label' htmlFor='create-task-board'>Board</label>
            <select
              id='create-task-board'
              className='form-control'
              value={this.state.boardId}
              onChange={(e) => this.handleChange('boardId', e)}>
              {this.renderOptions()}
            </select>
          </div>
          <button
            onClick={this.createTask}
            type='submit'
            className='btn btn-primary'>Crear tarea</button>
        </div>
      </div>
    );
  }
}

/**
 * Renders all the boards the team has.
 */
class BoardsList extends React.Component {
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
      if (board._id !== this.props.coordinationBoard._id) {
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

/**
 * Renders an unique board with its tasks.
 */
class Board extends React.Component {
  render() {
    return (
      <div className='board'>
        <TasksList
          board={this.props.board}
          tasks={this.props.tasks}
          coordination={this.props.coordination}
          setLocation={this.props.setLocation}
          currentUser={this.props.currentUser}
          handleChange={this.props.handleChange}
          showError={this.props.showError}
          hideError={this.props.hideError}
        />
      </div>
    );
  }
}

/**
 * Renders the task list from a board.
 */
class TasksList extends React.Component {
  renderTasks() {
    if (this.props.tasks.length === 0) {
      return (
        <div className='text-center'>No hay tareas asignadas a este board</div>
      );
    }

    return this.props.tasks.map((task) => {
      let doing = false;

      task.durations.forEach((duration) => {
        if (duration.userId === this.props.currentUser._id) {
          if (!duration.endTime) {
            doing = true;
          }
        }
      });

      return (
        <Task
          key={task._id}
          task={task}
          doing={doing}
          coordination={this.props.coordination}
          currentUser={this.props.currentUser}
          showError={this.props.showError}
          hideError={this.props.hideError}
        />
      );
    });
  }

  handleKeyDown(event) {
    if (event.which === 13) {
      this.props.setLocation('tasks/create');
    }
  }

  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  render() {
    return (
      <div className='col-xs-12 tasks-list'>
        <p className='text-center'>
          <b>{this.props.board.name}</b>
        </p>
        {this.renderTasks()}
        {
          this.props.coordination ? (
            <div className="form-group">
              <input
                id="task_title"
                className="form-control"
                onChange={this.props.handleChange.bind(null, 'taskTitle', this.props.board._id)}
                onKeyDown={this.handleKeyDown}
                placeholder="Agregue una nueva tarea"
                type="text"
              />
            </div>
          ) : (null)
        }
      </div>
    );
  }
}

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
    let self = this;

    self.startTimer(() => {
      DiamondAPI.update({
        collection: 'tasks',
        filter: {
          _id: self.props.task._id,
        },
        updateQuery: {
          $push: {
            durations: {
              $flags: {
                insertAsPlainObject: true,
              },
              userId: self.props.currentUser._id,
              startTime: new Date().getTime(),
              endTime: undefined,
            },
          },
        },
        callback(error, result) {
          if (error) {
            console.error(error);

            this.props.showError({
              body: 'Ocurrió un error interno al iniciar la tarea',
            });

            self.stopTimer();
          } else {
            console.log('Started task correctly', result);
          }
        }
      });
    });

  }
  /**
   * Finishes the task for the user setting his last
   * task endTime to the actual date and stops the
   * timer.
   */
  finishTask() {
    let self = this;

    self.stopTimer(() => {
      let index = self.getLastTaskEndTimeIndex();

      DiamondAPI.update({
        collection: 'tasks',
        filter: {
          _id: self.props.task._id,
          // This doesn't work
          'durations.userId': self.props.currentUser._id,
          'durations.startTime': self.getLastTaskUpdate(),
          'durations.endTime': undefined,
          // End this doesn't work
        },
        updateQuery: {
          $set: {
            [`durations.${index}.endTime`]: new Date().getTime(),
          },
        },
        callback(error, result) {
          if (error) {
            console.error(error);

            this.props.showError({
              body: 'Error al pausar una tarea',
            });

            self.startTimer();
          } else {
            console.log('Paused task correctly', result);
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
    let self = this;

    if (self.props.coordination) {
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

            this.props.showError({
              body: 'Error al archivar una tarea',
            });
          } else {
            console.log('Archived task correctly');
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
    let self = this;

    if (self.props.doing) {
      this.finishTask();
    }

    DiamondAPI.update({
      collection: 'tasks',
      filter: {
        _id: self.props.task._id,
      },
      updateQuery: {
        $set: {
          status,
        },
      },
      callback(error, result) {
        if (error) {
          console.error(error);

          this.props.showError({
            body: 'Error al actualizar el estado de la tarea',
          });
        } else {
          console.log('Updated task status correctly');
        }
      }
    });
  }
  /**
   * Sets the task title according to the task_title
   * state variable.
   */
  setTaskTitle() {
    let self = this;

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
                console.error(error);

                this.props.showError({
                  body: 'Error al actualizar el título de la tarea',
                });

                self.setState({
                  task_title: self.props.task.title,
                });
              } else {
                console.log('Updated task status correctly');
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

    let count = '',
        seconds = 0,
        minutes = 0,
        hours = 0,
        days = 0;

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
    this.setState({
      editing: true,
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

  handleChange(index, event) {
    if (this.props.coordination) {
      this.setState({
        [index]: event.target.value,
      });
    }
  }

  handleKeyDown() {
    if (this.props.coordination) {
      if (event.which === 13) {
        this.setTaskTitle();
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
      count: '00:00:00',
      intervalId: false,
      doing: this.props.doing,
      task_title: this.props.task.title,
      editing: false,
    };

    this.startTask = this.startTask.bind(this);
    this.finishTask = this.finishTask.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.archiveTask = this.archiveTask.bind(this);
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

  componentWillUnmount() {
    if (this.state.intervalId) {
      this.stopTimer();
    }
  }

  render() {
    const role = classNames({
      'button': this.props.coordination,
    });
    const containerClass = classNames({
      'col-xs-12': this.state.editing,
      'col-xs-10': !this.state.editing && this.props.task.status === 'finished',
      'col-xs-8': !this.state.editing && this.props.task.status === 'not_finished',
    });
    const archiveClass = classNames({
      'col-xs-2 archive-task': this.props.coordination && !this.state.editing,
      'col-xs-2 archive-task icon-fixed': this.props.coordination && !this.state.editing && this.props.task.status === 'not_finished',
    });
    const editClass = classNames({
      'col-xs-2 edit-task': this.props.coordination && !this.state.editing && this.props.task.status !== 'not_finished',
      'col-xs-2 edit-task icon-fixed': this.props.coordination && !this.state.editing && this.props.task.status === 'not_finished',
    });
    const clickHandle = this.props.coordination ? this.openTask : () => {};

    return (
      <div className='col-xs-12 task'>
        <div>
          <div className={containerClass}>
            {
              this.state.editing ? (
                <input
                  className='form-control edit-task-input'
                  type='text'
                  value={this.state.task_title}
                  onChange={(e) => this.handleChange('task_title', e)}
                  onKeyDown={this.handleKeyDown}
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
                    !this.props.coordination && (this.props.doing && this.state.doing) ? (
                      <p className='col-xs-12 time-active'>Tiempo activo: {this.state.count}</p>
                    ) : (null)
                  }
                </div>
              )
            }
          </div>

          {
            this.props.coordination && !this.state.editing && this.props.task.status === 'not_finished' ? (
              <div
                className={editClass}
                title='Editar tarea'
                role='button'
                onClick={this.startEditing}
              />
            ) : (null)
          }

          {
            this.props.coordination && !this.state.editing ? (
              <div
                className={archiveClass}
                title='Archivar tarea'
                role='button'
                onClick={this.archiveTask}
              />
            ) : (null)
          }

          {
            !this.props.coordination && (this.props.doing || this.state.doing) ? (
              <div>
                <div className='record'>
                  <img
                    src='/modules/trello/img/record.svg'
                    width='25px'
                  />
                </div>
                <div
                  className='done'
                  title='Marcar como finalizado'
                  role='button'
                  onClick={() => this.setTaskStatus('finished')}>
                    <img
                      src='/modules/trello/img/finished-task.svg'
                      width='25px'
                    />
                </div>
                <div
                  className='pause'
                  title='Marcar como pausado'
                  role='button'
                  onClick={this.finishTask}>
                    <img
                      src='/modules/trello/img/pause-button.svg'
                      width='15px'
                    />
                </div>
              </div>
            ) : (null)
          }

          {
            !this.props.coordination && (!this.props.doing || !this.state.doing) && this.props.task.status === 'not_finished' ? (
              <div>
                <div
                  className='done'
                  title='Marcar como finalizado'
                  role='button'
                  onClick={() => this.setTaskStatus('finished')}>
                    <img
                      src='/modules/trello/img/finished-task.svg'
                      width='25px'
                    />
                </div>
                <div
                  className='play'
                  title='Marcar como haciendo'
                  role='button'
                  onClick={this.startTask}>
                    <img
                      src='/modules/trello/img/play-arrow.svg'
                      width='15px'
                    />
                </div>
              </div>
            ) : (null)
          }

          {
            !this.state.editing ? (
              <div className='col-xs-12'>
                <p className='col-xs-12 expiration'>Vencimiento: {new Date(this.props.task.dueDate).toLocaleDateString()}</p>
              </div>
            ) : (null)
          }
        </div>
      </div>
    );
  }
}

/**
 * Renders information from the task.
 */
class TaskInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = { task: {}, board: {} };
  }

  /**
   * Sets the state for the task we are showing
   * information and the board of the task.
   */
  componentWillMount() {
    this.props.tasks.forEach((task) => {
      if (task._id === this.props.params.taskId) {
        let board;
        this.props.boards.forEach((_board) => {
          if (_board._id === task.boardId) {
            board = _board;
          }
        });

        this.setState({
          task,
          board,
        });
      }
    });
  }

  render() {
    return (
      <div className='task-info col-xs-12'>
        <div
          className='go-back'
          onClick={() => this.props.setLocation('tasks/show')}>
        </div>
        <h4 className='task-info-title'>Información de la tarea</h4>
        <div className='item'>
          <p>
            <b>Tarea:</b> {this.state.task.title}
          </p>
          <p>
            <b>Fecha de vencimiento:</b> {new Date(this.state.task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <b>Estado:</b> {this.state.task.status === 'finished' ? 'Finalizada' : 'No finalizada'}
          </p>
          <p>
            <b>Board:</b> {this.state.board.name}
          </p>
          <p>
            <b>Usuarios:</b>
          </p>
          <UserTaskInformation
            durations={this.state.task.durations}
            users={this.props.users}
          />
        </div>
      </div>
    );
  }
}

/**
 * Renders users information from the task.
 */
class UserTaskInformation extends React.Component {
  prettyDate(date) {
    let difference_ms = date;
    difference_ms = difference_ms / 1000;

    let seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;

    let minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;

    let hours = Math.floor(difference_ms % 24);

    seconds = seconds > 9 ? "" + seconds: "0" + seconds;
    minutes = minutes > 9 ? "" + minutes: "0" + minutes;
    hours = hours > 9 ? "" + hours: "0" + hours;

    return hours + ':' + minutes + ':' + seconds;
  }

  renderUsers() {
    return this.props.users.map((user) => {
      let time = 0;
      let working = false;

      this.props.durations.forEach((duration) => {
        if (duration.userId === user._id) {
          if (duration.endTime) {
            time += duration.endTime - duration.startTime;
          } else {
            working = true;
          }
        }
      });

      time = time !== 0 ? this.prettyDate(time) + ' hrs.' : 'No trabajó';

      return (
        <div className="panel panel-default">
          <div className="panel-heading fixed" role="tab" id={'heading_' + user._id}>
            <h4 className="panel-title">
              <a className='text-fixed' role="button" data-toggle="collapse" data-parent="#accordion" href={'#collapse_' + user._id} aria-expanded="false" aria-controls={'collapse_' + user._id}>
                {user.profile.name}
              </a>
            </h4>
          </div>
          <div id={'collapse_' + user._id} className="panel-collapse collapse" role="tabpanel" aria-labelledby={'heading_' + user._id}>
            <div className="panel-body text-fixed">
              Tiempo trabajado: {time} {working ? '|| Trabajando actualmente' : '' }
            </div>
          </div>
        </div>
      );
    });
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.collapse').collapse();
  }

  render() {
    return (
      <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
        {this.renderUsers()}
      </div>
    );
  }
}

/**
 * Renders error messages to tell user something
 * is wrong with their inputs, etc.
 */
class ErrorMessage extends React.Component {
  close() {
    let self = this;

    $('.error-message').removeClass('show-error');
    $('.error-message').addClass('hide-error', () => {
      setTimeout(self.props.hideError.bind(null), 700);
    });
  }

  constructor(props) {
    super(props);

    this.state = {};

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    setTimeout(this.close.bind(null), this.props.delay);
  }

  render() {
    return (
      <div className='error-message show-error'>
        <div className='error-body'>{this.props.body}</div>
        <div className='error-close' onClick={this.close}>Cerrar</div>
      </div>
    );
  }
}

/**
 * Router setup.
 */
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={TaskManagerPage}>
      <Route path='/tasks/show' component={BoardsList} />
      <Route path='/tasks/create' component={CreateTask} />
      <Route path='/tasks/:taskId' component={TaskInformation} />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
