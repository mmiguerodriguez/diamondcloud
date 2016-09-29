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
      loading: undefined,
      users: [],
      boards: [],
    };
  }
  render() {
    if(this.state.loading || this.state.loading === undefined) {
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
        if(error) {
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
            let condition = coordination ? {
              $eq: [
                false,
                '$$element.archived',
              ],
            } : {
              $and: [
                {
                  $eq: [
                    currentBoard._id,
                    '$$element.boardId',
                  ],
                },
                {
                  $eq: [
                    'not_finished',
                    '$$element.status',
                  ]
                },
              ],
            };

            const trelloHandle = DiamondAPI.subscribe({
              request: {
                collection: 'tasks',
                condition,
              },
              callback(error, result) {
                if(error) {
                  console.error(error);
                } else {
                  console.log('Subscribe callback', result.tasks);
                  self.setState({
                    tasks: result.tasks,
                  });
                }
              }
            });

            self.setState({
              loading: trelloHandle.ready(),
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
              value={ this.state.dueDate }
              onChange={ this.handleChange.bind(this, 'dueDate') }
              type='text'
              placeholder='Ingresá la fecha de vencimiento' />
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
    // Focus title element
    $('#create-task-title').focus();
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.task_title !== this.props.task_title) {
      this.setState({
        title: nextProps.task_title,
      });
    }
  }

  createTask() {
    let self = this;

    let position = self.getBiggestTaskPosition() + 1;

    DiamondAPI.insert({
      collection: 'tasks',
      obj: {
        title: self.state.title,
        boardId: self.state.boardId,
        dueDate: Number(self.state.dueDate),
        durations: [],
        status: 'not_finished',
        position,
        archived: false,
      },
      isGlobal: true,
      callback(error, result) {
        if(error) {
          console.error(error);
        } else {
          console.log('Inserted task correctly');
        }
      }
    });
  }
  getBiggestTaskPosition() {
    let positions = [];

    this.props.tasks.forEach((task) => {
      if(task.boardId === this.state.boardId) {
        positions.push(task.position);
      }
    });

    return Math.max(...positions);
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
    this.setState({
      [index]: event.target.value,
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
      if(this.props.tasks !== undefined) {
        this.props.tasks.forEach((task) => {
          if(task.boardId === board._id) {
            tasks.push(task);
          }
        });
      }

      // If it isn't a coordination board then render only
      // one board tasks
      if(!this.props.coordination) {
        if(board._id === this.props.currentBoard._id) {
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
    if(this.props.tasks.length === 0) {
      return (
        <div className='text-center'>No hay tareas asignadas a este board</div>
      );
    }

    return this.props.tasks.map((task) => {

      let doing = false;
      task.durations.forEach((duration) => {
        if(duration.userId === this.props.currentUser._id) {
          if(!duration.endTime) {
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
    if(event.which === 13) {
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
  }
  render() {
    return (
      <div className='col-xs-12 task'>
        {
          this.state.editing ? (
            <div className='col-xs-12'>
              <input
                className='form-control edit-task-input'
                type='text'
                value={ this.state.task_title }
                onChange={ this.handleChange.bind(this, 'task_title') }
                onKeyDown={ this.handleKeyDown } />
            </div>
          ) : (
            <h5 className='task-title col-xs-10'>{ this.props.task.title }</h5>
          )
        }
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

        <p className='col-xs-10 expiration'>Vencimiento: { new Date(this.props.task.dueDate).toLocaleDateString() }</p>

        {
          !this.props.coordination && this.props.doing ? (
            <div>
              <div
                className='done'
                title='Marcar como finalizado'
                role='button'
                onClick={ this.updateTaskStatus.bind(this, 'finished') }>
                  <img
                    src='/modules/hYsHKx3br6kLYq3km/img/finished-task.svg'
                    width='25px' />
              </div>
              <div
                className='pause'
                title='Marcar como pausado'
                role='button'
                onClick={ this.finishTask }>
                  <img
                    src='/modules/hYsHKx3br6kLYq3km/img/pause-button.svg'
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
                onClick={ this.updateTaskStatus.bind(this, 'finished') }>
                  <img
                    src='/modules/hYsHKx3br6kLYq3km/img/finished-task.svg'
                    width='25px' />
              </div>
              <div
                className='play'
                title='Marcar como haciendo'
                role='button'
                onClick={ this.startTask }>
                  <img
                    src='/modules/hYsHKx3br6kLYq3km/img/play-arrow.svg'
                    width='15px' />
              </div>
            </div>
          ) : ( null )
        }
      </div>
    );
  }
  componentDidMount() {
    if(this.props.doing) {
      this.startInterval();
    }
  }
  componentWillUnmount() {
    if(this.state.intervalId) {
      this.stopInterval();
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
        if(error) {
          console.error(error);
        } else {
          console.log('Started task correctly', result);
        }
      }
    });
  }
  finishTask() {
    let self = this;

    DiamondAPI.update({
      collection: 'tasks',
      filter: {
        _id: self.props.task._id,
        'durations.userId': self.props.currentUser._id,
        'durations.startTime': self.getLastTaskUpdate(),
        'durations.endTime': undefined,
      },
      updateQuery: {
        $set: {
          'durations.0.endTime': new Date().getTime(),
        },
      },
      callback(error, result) {
        if(error) {
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

    if(self.props.coordination) {
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
          if(error) {
            console.error(error);
          } else {
            console.log('Archived task correctly');
          }
        }
      });
    }
  }
  updateTaskStatus(status) {
    let self = this;

    if(self.props.doing) {
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
        if(error) {
          console.error(error);
        } else {
          console.log('Updated task status correctly');
        }
      }
    });
  }
  updateTaskTitle() {
    let self = this;

    if(self.props.coordination) {
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
          if(error) {
            console.error(error);
          } else {
            console.log('Updated task status correctly');
            self.stopEditing();
          }
        }
      });
    }
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

    let count = days + (days === 1 ? 'día' : ' días ') + hours + ':' + minutes + ':' + seconds;

    this.setState({
      count,
    });
  }

  getLastTaskUpdate() {
    let startTimes = this.props.task.durations.map((duration) => {
      if(duration.userId === this.props.currentUser._id) {
        if(duration.endTime === undefined) {
          return duration.startTime;
        } else {
          return 0;
        }
      }
    });

    return Math.max(...startTimes);
  }

  startEditing() {
    this.setState({
      editing: true,
    });
  }
  stopEditing() {
    this.setState({
      editing: false,
    });
  }
  handleChange(index, event) {
    if(this.props.coordination) {
      this.setState({
        [index]: event.target.value,
      });
    }
  }
  handleKeyDown() {
    if(this.props.coordination) {
      if(event.which === 13) {
        this.updateTaskTitle();
      }
    }
  }
}

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ TaskManagerPage }>
      <Route path='/tasks/show' component={ BoardsList } />
      <Route path='/tasks/create' component={ CreateTask } />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
