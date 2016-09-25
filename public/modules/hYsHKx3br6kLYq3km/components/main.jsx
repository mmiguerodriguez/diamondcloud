const DiamondAPI = window.DiamondAPI;
const React = window.React;
const ReactDOM = window.ReactDOM;

class TrelloPage extends React.Component {
  constructor() {
    super();

    this.state = {
      tasks: undefined,
      coordinationBoard: undefined,
      loading: undefined,
      users: undefined,
      boards: undefined,
    };
  }
  render() {
    if(this.state.loading || this.state.loading === undefined) {
      return ( <div>cargando...</div> );
    }

    return (
      <TrelloLayout { ...this.state } />
    );
  }
  componentDidMount() {
    let self = this;

    DiamondAPI.get({
      collection: 'coordinationBoard',
      filter: {},
      callback(error, result) {
        self.setState({
          coordinationBoard: result,
        });
      }
    });

    const trelloHandle = DiamondAPI.subscribe({
      request: {
        collection: 'tasks',
      },
      callback(error, result) {
        console.log('subscribe callback', result.tasks);
        self.setState({
          tasks: result.tasks
        });
      }
    });

    self.setState({
      loading: trelloHandle.ready(),
      ...DiamondAPI.getTeamData(),
    });
  }
}
class TrelloLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: '',
    };
  }
  render() {
    return (
      <div className="col-xs-12 task-manager">
        <div
          className='col-xs-6 text-center'
          onClick={ this.setLocation.bind(this, 'create_task') }>Crear tarea
        </div>
        <div
          className='col-xs-6 text-center'
          onClick={ this.setLocation.bind(this, 'task_list') }>Lista de tareas
        </div>
        {
          this.state.location === 'task_list' ? (
            <TaskList tasks={ this.props.tasks } />
          ) : ( null )
        }
        {
          this.state.location === 'create_task' ? (
            <CreateTask boards={ this.props.boards } />
          ) : ( null )
        }
      </div>
    );
  }
  setLocation(location) {
    this.setState({
      location,
    });
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
          <div className="form-group">
            <label className="control-label" htmlFor="create-task-title">Título</label>
            <input
              id='create-task-title'
              className="form-control"
              value={ this.state.title }
              onChange={ this.handleChange.bind(this, 'title') }
              type='text'
              placeholder='Ingresá el título' />
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="create-task-duedate">Fecha de vencimiento</label>
            <input
              id='create-task-duedate'
              className='form-control'
              value={ this.state.dueDate }
              onChange={ this.handleChange.bind(this, 'dueDate') }
              type='text'
              placeholder='Ingresá la fecha de vencimiento' />
          </div>
          <div className='form-group'>
            <label className="control-label" htmlFor="create-task-board">Board</label>
            <select
              id='create-task-board'
              className='form-control'
              onChange={ this.handleChange.bind(this, 'boardId') }>
              { this.renderOptions() }
            </select>
          </div>
          <button
            onClick={ this.createTask }
            type="submit"
            className="btn btn-primary">Crear tarea</button>
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
        dueDate: self.state.dueDate,
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

class TaskList extends React.Component {
  render() {
    return (
      <div>
        <h4 className="task-manager-title">Tareas</h4>
        <hr className="hr-fix" />
        { this.renderTasks() }
      </div>
    );
  }
  renderTasks() {
    if(this.props.tasks === undefined) {
      return (
        <div>No hay tareas de este board</div>
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
      <div className="col-xs-12 task">
        <h5 className="task-title col-xs-6">{ this.props.task.title }</h5>
        <div className="col-xs-6">
          <p className="col-xs-12 btn truncate">Marcar como haciendo</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <TrelloPage />,
  document.getElementById('render-target')
);
