const { DiamondAPI, React, ReactDOM, ReactRouter } = window;
const { Router, Route, IndexRoute, browserHistory } = ReactRouter;

// Start with '/' route
browserHistory.push('/');

class TrelloPage extends React.Component {
  constructor() {
    super();

    this.state = {
      tasks: undefined,
      coordinationBoard: undefined,
      currentBoard: undefined,
      coordination: undefined,
      loading: undefined,
      users: undefined,
      boards: undefined,
    };
  }
  render() {
    if(this.state.loading || this.state.loading === undefined) {
      return ( <div>Cargando...</div> );
    }

    return (
      <TrelloLayout { ...this.state } { ...this.props } />
    );
  }
  componentDidMount() {
    let self = this;
    let coordinationBoard, currentBoard;

    DiamondAPI.get({
      collection: 'coordinationBoard',
      filter: {},
      callback(error, result) {
        coordinationBoard = result[0];
        currentBoard =  DiamondAPI.getCurrentBoard();

        self.setState({
          coordinationBoard,
          currentBoard,
          coordination: coordinationBoard._id === currentBoard._id,
        }, () => {
          const trelloHandle = DiamondAPI.subscribe({
            request: {
              collection: 'tasks',
            },
            filter: {},
            callback(error, result) {
              console.log('subscribe callback', result.tasks);
              self.setState({
                tasks: result.tasks,
              });
            }
          });

          self.setState({
            loading: trelloHandle.ready(),
            ...DiamondAPI.getTeamData(),
          });
        });
      }
    });
  }
}
class TrelloLayout extends React.Component {
  render() {
    return (
      <div className='col-xs-12 task-manager'>
        {
          this.props.coordination ? (
            <div
              className='col-xs-6 text-center'
              onClick={ this.setLocation.bind(this, 'tasks/create') }>Crear tarea
            </div>
          ) : ( null )
        }
        <div
          className={ (this.props.coordination ? 'col-xs-6' : 'col-xs-12') + ' ' + 'text-center' }
          onClick={ this.setLocation.bind(this, 'tasks/show') }>Lista de tareas
        </div>

        {
          React.cloneElement(this.props.children, { ...this.props })
        }

      </div>
    );
  }
  setLocation(location) {
    browserHistory.push(location);
  }
}

class Information extends React.Component {
  render() {
    return (
      <div>
        <p>
          {
            this.props.coordination ? (
              'Mirá la información de los creativos o crea una tarea haciendo click en los botones'
            ) : ( 'Mira tu lista de tareas haciendo click en el botón' )
          }
        </p>
      </div>
    );
  }
}

class CreateTask extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      title: '',
      dueDate: '',
      boardId: this.props.boards[0]._id,
    };

    this.createTask = this.createTask.bind(this);
  }
  render() {
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <h4>Crear una tarea</h4>
        </div>
        <div className='col-xs-12'>
          <div className='form-group'>
            <label className='control-label' htmlFor='create-task-title'>Título</label>
            <input
              id='create-task-title'
              className='form-control'
              value={ this.state.title }
              onChange={ this.handleChange.bind(this, 'title') }
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
  renderOptions() {
    return this.props.boards.map((board) => {
      return (
        <option key={ board._id } value={ board._id }>{ board.name }</option>
      );
    });
  }
  createTask() {
    let self = this;

    DiamondAPI.insert({
      collection: 'tasks',
      obj: {
        title: self.state.title,
        boardId: self.state.boardId,
        dueDate: Number(self.state.dueDate),
        duration: [],
        status: 'not_doing',
        position: 0,
      },
      isGlobal: true,
      callback(error, result) {
        console.log('insert task result', error, result);
      }
    });
  }
  handleChange(index, event) {
    this.setState({
      [index]: event.target.value
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

      if(this.props.tasks !== undefined) {
        this.props.tasks.forEach((task) => {
          if(task.boardId === board._id) {
            tasks.push(task);
          };
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
              tasks={ tasks } />
          );
        } else {
          return;
        }
      }

      return (
        <Board
          key={ board._id }
          board={ board }
          tasks={ tasks } />
      );
    });
  }
}
class Board extends React.Component {
  render() {
    console.log(this.props.tasks);
    return (
      <div className='col-xs-6 board'>
        <p className='text-center'>
          <b>{ this.props.board.name }</b>
        </p>
        <TasksList tasks={ this.props.tasks } />
      </div>
    );
  }
}
class TasksList extends React.Component {
  render() {
    return (
      <div className='col-xs-12 tasks-list'>
        { this.renderTasks() }
      </div>
    );
  }
  renderTasks() {
    if(this.props.tasks.length === 0) {
      return (
        <div>No hay tareas asignadas a este board</div>
      );
    }

    return this.props.tasks.map((task) => {
      return (
        <Task
          key={ task._id }
          task={ task } />
      );
    });
  }
}
class Task extends React.Component {
  render() {
    return (
      <div className='col-xs-12 task'>
        <h5 className='task-title col-xs-12'>{ this.props.task.title }</h5>
        <div className='col-xs-12'>
          {
            this.props.task.status === 'not_doing' ? (
              <p className='col-xs-12 btn truncate' onClick={ this.updateTask.bind(this, 'doing') }>Marcar como haciendo</p>
            ) : ( null )
          }
          {
            this.props.task.status === 'doing' ? (
              <p className='col-xs-12 btn truncate' onClick={ this.updateTask.bind(this, 'done') }>Marcar como finalizada</p>
            ) : ( null )
          }
        </div>
      </div>
    );
  }
  updateTask(status) {
    let self = this;

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
    });
  }
}

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ TrelloPage }>
      <IndexRoute component={ Information } />

      <Route path='/tasks/show' component={ BoardsList } />
      <Route path='/tasks/create' component={ CreateTask } />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
