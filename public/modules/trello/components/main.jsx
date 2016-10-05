const { DiamondAPI, React, ReactDOM, ReactRouter, classNames } = window;
const { Router, Route, IndexRoute, browserHistory } = ReactRouter;

// Start with '/' route
browserHistory.push('/tasks/show');

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
  render() {
    if (this.state.loading || this.state.loading === undefined) {
      return (
        <div className='loading'>
          <div className='loader'></div>
        </div>
      );
    }

    return (
      <TaskManagerLayout { ...this.state } { ...this.props } />
    );
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
}
class TaskManagerLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { task_title: '', selected_board_id: undefined };
  }
  render() {
    return (
      <div className='col-xs-12 task-manager'>
        <div
          role='button'
          className='col-xs-12 text-center board-list-title'
          onClick={ this.setLocation.bind(this, 'tasks/show') }>
            <b>Lista de tareas</b>
            <hr className='hr-fix' />
        </div>

        {
          React.cloneElement(this.props.children, {
            ...this.props,
            ...this.state,
            setLocation: this.setLocation,
            handleChange: this.handleChange.bind(this)
          })
        }

      </div>
    );
  }

  setLocation(location) {
    browserHistory.push(location);
  }
  handleChange(index, boardId, event) {
    this.setState({
      [index]: event.target.value,
      selected_board_id: boardId,
    });
  }
}

class CreateTask extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      title: this.props.task_title,
      dueDate: '',
      boardId: this.props.selected_board_id || this.props.boards[0]._id,
    };

    this.createTask = this.createTask.bind(this);
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
              value={ this.state.title }
              onChange={ this.props.handleChange.bind(null, 'task_title', undefined) }
              type='text'
              placeholder='Ingresá el título' />
          </div>
          <div className='form-group'>
            <label className='control-label' htmlFor='create-task-duedate'>Fecha de vencimiento</label>
            <input 
              id='create-task-duedate'
              className='form-control'
              type='date'
              placeholder='Ingresá la fecha de vencimiento'
              onChange={ this.handleChange.bind(this, 'dueDate') } />
          </div>
          <div className='form-group'>
            <label className='control-label' htmlFor='create-task-board'>Board</label>
            <select
              id='create-task-board'
              className='form-control'
              value={ this.state.boardId }
              onChange={ this.handleChange.bind(this, 'boardId') }>
              { this.renderOptions() }
            </select>
          </div>
          <button
            onClick={ this.createTask }
            type='submit'
            className='btn btn-primary'>Crear tarea</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    $('#create-task-title').focus();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.task_title !== this.props.task_title) {
      this.setState({
        title: nextProps.task_title,
      });
    }
  }

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
          key={ board._id }
          value={ board._id }>
          { board.name }
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
}

class BoardsList extends React.Component {
  render() {
    return (
      <div className='col-xs-12 board-list'>
        { this.renderBoards() }
      </div>
    );
  }
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
              key={ board._id }
              board={ board }
              tasks={ tasks }
              coordination={ this.props.coordination }
              setLocation={ this.props.setLocation }
              currentUser={ this.props.currentUser } />
          );
        } else {
          return;
        }
      }

      // If it is a coordination board then it will return the
      // information we want
      return (
        <Board
          key={ board._id }
          board={ board }
          tasks={ tasks }
          coordination={ this.props.coordination }
          setLocation={ this.props.setLocation }
          currentUser={ this.props.currentUser }
          handleChange={ this.props.handleChange } />
      );
    });
  }
}
class Board extends React.Component {
  render() {
    return (
      <div className='board'>
        <TasksList
          board={ this.props.board }
          tasks={ this.props.tasks }
          coordination={ this.props.coordination }
          setLocation={ this.props.setLocation }
          currentUser={ this.props.currentUser }
          handleChange={ this.props.handleChange }/>
      </div>
    );
  }
}
class TasksList extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  render() {
    return (
      <div className='col-xs-12 tasks-list'>
        <p className='text-center'>
          <b>{ this.props.board.name }</b>
        </p>
        { this.renderTasks() }
        {
          this.props.coordination ? (
            <div className="form-group">
              <input
                id="usr"
                className="form-control"
                onChange={ this.props.handleChange.bind(null, 'task_title', this.props.board._id) }
                onKeyDown={ this.handleKeyDown }
                placeholder="Agregue una nueva tarea"
                type="text" />
            </div>
          ) : ( null )
        }
      </div>
    );
  }

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
          key={ task._id }
          task={ task }
          doing={ doing }
          coordination={ this.props.coordination }
          currentUser={ this.props.currentUser } />
      );
    });
  }
  handleKeyDown(event) {
    if (event.which === 13) {
      this.props.setLocation('tasks/create');
    }
  }
}
class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: this.prettyDate(),
      intervalId: false,
      task_title: this.props.task.title,
      editing: false,
    };

    this.startTask = this.startTask.bind(this);
    this.finishTask = this.finishTask.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.archiveTask = this.archiveTask.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.openTask = this.openTask.bind(this);
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
      <div
        className='col-xs-12 task'
        onClick={ onClick }
        role={ role }>

        <div className={ containerClass }>
          {
            this.state.editing ? (
              <input
                className='form-control edit-task-input'
                type='text'
                value={ this.state.task_title }
                onChange={ this.handleChange.bind(this, 'task_title') }
                onKeyDown={ this.handleKeyDown } />
            ) : (
              <div>
                <h5 className='task-title col-xs-12'>{ this.props.task.title }</h5>
                {
                  !this.props.coordination && this.props.doing ? (
                    <p className='col-xs-10 time-active'>Tiempo activo: { this.state.count }</p>
                  ) : ( null )
                }
                <p className='col-xs-10 expiration'>Vencimiento: { new Date(this.props.task.dueDate).toLocaleDateString() }</p>
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
              onClick={ this.archiveTask }></div>
          ) : ( null )
        }
        {
          this.props.coordination && !this.state.editing && this.props.task.status === 'not_finished' ? (
            <div
              className='col-xs-2 edit-task'
              title='Editar tarea'
              role='button'
              onClick={ this.startEditing }></div>
          ) : ( null )
        }
        {
          !this.props.coordination && this.props.doing ? (
            <div>
              <div className='record'>
                <img
                  src='/modules/trello/img/record.svg'
                  width='25px' />
              </div>
              <div
                className='done'
                title='Marcar como finalizado'
                role='button'
                onClick={ this.setTaskStatus.bind(this, 'finished') }>
                  <img
                    src='/modules/trello/img/finished-task.svg'
                    width='25px' />
              </div>
              <div
                className='pause'
                title='Marcar como pausado'
                role='button'
                onClick={ this.finishTask }>
                  <img
                    src='/modules/trello/img/pause-button.svg'
                    width='15px' />
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
                onClick={ this.setTaskStatus.bind(this, 'finished') }>
                  <img
                    src='/modules/trello/img/finished-task.svg'
                    width='25px' />
              </div>
              <div
                className='play'
                title='Marcar como haciendo'
                role='button'
                onClick={ this.startTask }>
                  <img
                    src='/modules/trello/img/play-arrow.svg'
                    width='15px' />
              </div>
            </div>
          ) : ( null )
        }
      </div>
    );
  }
  componentWillMount() {
    if (this.props.doing) {
      this.startInterval();
    }
  }
  componentWillUnmount() {
    if (this.state.intervalId) {
      this.stopInterval();
    }
  }

  openTask() {
    if (this.props.coordination) {
      browserHistory.push('/tasks/' + this.props.task._id);
    }
  }
  startTask() {
    let self = this;

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
        } else {
          console.log('Started task correctly', result);
          self.startInterval();
        }
      }
    });
  }
  finishTask() {
    let self = this;

    let index = this.getLastTaskEndTimeIndex();

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
          [`durations.${ index }.endTime`]: new Date().getTime(),
        },
      },
      callback(error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log('Paused task correctly', result);
          self.stopInterval();
        }
      }
    });
  }
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
            } else {
              console.log('Updated task status correctly');
            }
          }
        });
      });
    }
  }
  getLastTaskUpdate() {
    let startTimes = this.props.task.durations.map((duration) => {
      if (duration.userId === this.props.currentUser._id) {
        if (duration.endTime === undefined) {
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
  getLastTaskEndTimeIndex() {
    let i;

    this.props.task.durations.forEach((duration, index) => {
      if (!duration.endTime && duration.userId === this.props.currentUser._id) {
        i = index;
      }
    });

    return i;
  }

  startInterval() {
    let intervalId = setInterval(this.prettyDate.bind(this), 1000);
    this.setState({
      intervalId,
    });
  }
  stopInterval() {
    clearInterval(this.state.intervalId);
    this.setState({
      intervalId: false,
    });
  }
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

  startEditing() {
    this.setState({
      editing: true,
    });
  }
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
}

class TaskInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { task: {}, board: {} };
  }
  render() {
    return (
      <div>
        <div>
          <h4>Información de la tarea</h4>
        </div>
        <div>Tarea: { this.state.task.title }</div>
        <div>Fecha de vencimiento: { new Date(this.state.task.dueDate).toLocaleDateString() }</div>
        <div>Estado: { this.state.task.status === 'finished' ? 'Finalizada' : 'No finalizada' }</div>
        <div>Board: { this.state.board.name }</div>
      </div>
    );
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
        // todo: Add duration information for each user ?
        /*
          task.durations.forEach((_duration) => {
            if (_duration.startTime && _duration.endTime) {
              let duration = _duration.endTime - _duration.startTime;


            }
          });
        */
        this.setState({
          task,
          board,
        });
      }
    });
  }
}

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ TaskManagerPage }>
      <Route path='/tasks/show' component={ BoardsList } />
      <Route path='/tasks/create' component={ CreateTask } />
      <Route path='/tasks/:taskId' component={ TaskInfo } />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
