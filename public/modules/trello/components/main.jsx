/**
 * Declare all variables as constants to prevent
 * linting warnings
 */
const { DiamondAPI, React, ReactDOM, ReactRouter, classNames } = window;
const { Router, Route, IndexRoute, browserHistory } = ReactRouter;

/**
 * Starts the module with the following route
 */
browserHistory.push('/tasks/show');

/**
 * Grabs all the data needed for the component to work
 * and passes it to the layout
 */
class TaskManagerPage extends React.Component {
  constructor() {
    super();

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

          // Set coordinationBoard, currentBoard, user and if it's a
          // coordinationBoard boolean
          self.setState({
            coordinationBoard,
            currentBoard,
            currentUser,
            coordination,
          }, () => {
            // If it's a coordinationBoard then fetch all tasks, even finished
            // ones, except archived
            // If not, fetch the ones that are from the currentBoard and
            // that are not finished
            let filter = coordination ? {
              archived: false,
            } : {
              boardId: currentBoard._id,
              status: 'not_finished',
            };

            const trelloHandle = DiamondAPI.subscribe({
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
              ...DiamondAPI.getTeamData(),
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

    this.state = { taskTitle: '', selectedBoardId: undefined };
    
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
            handleChange: this.handleChange
          })
        }

      </div>
    );
  }
}

/**
 * Renders the layout to create a task
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
        if (Number.isInteger(dueDate)) {
          if (position >= 0) {
            DiamondAPI.insert({
              collection: 'tasks',
              obj: {
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
            console.error('There was error inserting task position', position);
          }
        } else {
          console.error('There was an error inserting task dueDate', self.state.dueDate);
        }
      } else {
        console.error('There was an error inserting task boardId', self.state.boardId);
      }
    } else {
      console.error('There was an error inserting task title', self.state.title);
    }
  }
  /**
   * Gets the biggest task position so it inserts the task
   * position as the biggest + 1.
   * 
   * @returns {Number} (biggestTaskPosition + 1)
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
  
  renderOptions() {
    return this.props.boards.map((board) => {
      return (
        <option
          key={board._id}
          value={board._id}>
          {board.name }
        </option>
      );
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
  
  constructor(props){
    super(props);

    this.state = {
      title: this.props.taskTitle,
      dueDate: '',
      boardId: this.props.selectedBoardId || this.props.boards[0]._id,
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
          <h4>Crear una tarea</h4>
        </div>
        <div className='col-xs-12 create-task-inputs'>
          <div className='form-group'>
            <label className='control-label' htmlFor='create-task-title'>Título</label>
            <input
              id='create-task-title'
              className='form-control'
              value={this.state.title }
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
              type='date'
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
 * Renders all the boards the team has
 */
class BoardsList extends React.Component {
  renderBoards() {
    return this.props.boards.map((board) => {
      let tasks = [];

      // If there are tasks then push task to array if it is from
      // the actual board
      if (this.props.tasks !== undefined) {
        this.props.tasks.forEach((task) => {
          if (task.boardId === board._id) {
            tasks.push(task);
          }
        });
      }

      // If it isn't a coordination board then render only
      // one board tasks
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
            />
          );
        } else {
          return;
        }
      }

      // If it is a coordination board then it will return the
      // information we want
      return (
        <Board
          key={board._id}
          board={board}
          tasks={tasks}
          coordination={this.props.coordination}
          setLocation={this.props.setLocation}
          currentUser={this.props.currentUser}
          handleChange={this.props.handleChange}
        />
      );
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
 * Renders an unique board with its tasks
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
        />
      </div>
    );
  }
}

/**
 * Renders the task list from a board
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
                id="usr"
                className="form-control"
                onChange={this.props.handleChange.bind(null, 'taskTitle', this.props.board._id)}
                onKeyDown={this.handleKeyDown}
                placeholder="Agregue una nueva tarea"
                type="text"
              />
            </div>
          ) : ( null )
        }
      </div>
    );
  }
}

/**
 * Renders an unique task
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
          } else {
            console.log('Archived task correctly');
          }
        }
      });
    }
  }
  /**
   * Sets the task status as the passed parameter.
   * @params {String} status
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

              self.setState({
                task_title: self.props.task.title,
              });
            } else {
              console.log('Updated task status correctly');
            }
          }
        });
      });
    }
  }
  /**
   * Gets the last task update for the user.
   * The duration in which user startTime 
   * exists and endTime is undefined.
   * 
   * @returns {Number} (new Date().getTime())
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
    return Math.max(...startTimes);
  }
  /**
   * Gets the last endTime index of the user from the
   * durations array.
   * 
   * It searches through all the durations from the
   * taks and gives the index of the duration of
   * the user that has endTime: undefined.
   * 
   * @returns {Number} (new Date().getTime())
   * todo: Deprecate this.
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

  startTimer(callback) {
    let intervalId = setInterval(this.prettyDate.bind(this), 1000);
    this.setState({
      intervalId,
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  stopTimer(callback) {
    clearInterval(this.state.intervalId);
    this.setState({
      intervalId: false,
      count: '00:00:00',
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
   * @returns {String} (01:17:52)
   */
  prettyDate() {
    let start = this.getLastTaskUpdate();
    let end = new Date().getTime();

    let difference_ms = end - start;
    difference_ms = difference_ms / 1000;

    let seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;

    let minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;

    let hours = Math.floor(difference_ms % 24);
    let days = Math.floor(difference_ms / 24);

    seconds = seconds > 9 ? "" + seconds: "0" + seconds;
    minutes = minutes > 9 ? "" + minutes: "0" + minutes;
    hours = hours > 9 ? "" + hours: "0" + hours;

    let count = hours + ':' + minutes + ':' + seconds;

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
   * @params {Function} callback Sets the title of the
   *                             task in the db as
   *                             the way the
   *                             coordinator wanted.
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

    this.state = {
      count: '00:00:00',
      intervalId: false,
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
      'col-xs-10': !this.state.editing,
    });
    const onClick = this.props.coordination ? this.openTask : () => {};

    return (
      <div className='col-xs-12 task'>
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
                  onClick={onClick}
                  className='task-title col-xs-12'>
                  {this.state.task_title}
                </h5>
                {
                  !this.props.coordination && this.props.doing ? (
                    <p className='col-xs-10 time-active'>Tiempo activo: {this.state.count}</p>
                  ) : ( null )
                }
                <p className='col-xs-10 expiration'>Vencimiento: {new Date(this.props.task.dueDate).toLocaleDateString()}</p>
              </div>
            )
          }
        </div>
        {
          this.props.coordination && this.props.task.status === 'finished' ? (
            <div
              className='col-xs-2 archive-task'
              title='Archivar tarea'
              role='button'
              onClick={this.archiveTask}
            />
          ) : ( null )
        }
        {
          this.props.coordination && !this.state.editing && this.props.task.status === 'not_finished' ? (
            <div
              className='col-xs-2 edit-task'
              title='Editar tarea'
              role='button'
              onClick={this.startEditing}
            />
          ) : ( null )
        }
        {
          !this.props.coordination && this.props.doing ? (
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
          ) : ( null )
        }
        {
          !this.props.coordination && !this.props.doing && this.props.task.status === 'not_finished' ? (
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
          ) : ( null )
        }
      </div>
    );
  }
}

/**
 * Renders information from the task
 */
class TaskInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = { task: {}, board: {} };
  }

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
      <div>
        <div>
          <h4>Información de la tarea</h4>
        </div>
        <div>Tarea: {this.state.task.title}</div>
        <div>Fecha de vencimiento: {new Date(this.state.task.dueDate).toLocaleDateString()}</div>
        <div>Estado: {this.state.task.status === 'finished' ? 'Finalizada' : 'No finalizada'}</div>
        <div>Board: {this.state.board.name}</div>
        
        <UserTaskInformation 
          durations={this.state.task.durations}
          users={this.props.users}
        />
      </div>
    );
  }
}

/**
 * Renders users information from the task
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

      this.props.durations.forEach((duration) => {
        if (duration.userId === user._id) {
          if (duration.endTime) {
            time += duration.endTime - duration.startTime;
          }
        }
      });
      
      time = time !== 0 ? this.prettyDate(time) + ' horas' : 'No trabajó';
      
      return (
        <div>
          <p>{user.profile.name}</p>
          <p>{time}</p>
        </div>
      );
    });
  }
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>{this.renderUsers()}</div>
    );
  }
}

/**
 * Router setup 
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
