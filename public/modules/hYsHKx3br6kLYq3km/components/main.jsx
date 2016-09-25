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
    };
  }
  render() {
    if(this.state.loading && this.state.loading === undefined) {
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
        console.log('coordinationBoard', result);
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
        console.log('subscribe callback result', result);
        self.setState({
          tasks: result.tasks
        });
      }
    });
    
    self.setState({
      loading: trelloHandle.ready(),
    });
  }
}

class TrelloLayout extends React.Component {
  render() {
    console.log('layout', this.props);
    return (
      <div className="col-xs-12 task-manager">
        <p className="task-manager-title">
          <b>Tareas</b>
        </p>
        <hr className="hr-fix" />
        { this.renderTasks() }
        <div onClick={ this.createTask }>Crear task</div>
      </div>
    );
  }
  renderTasks() {
    console.log('renderTasks', this.props.tasks);
    return this.props.tasks === undefined ? [] : this.props.tasks.map((task) => {
      return (
        <div className="col-xs-12 task" key={ task._id } >
          <h5 className="task-title col-xs-6">{ task.title }</h5>
          <div className="col-xs-6">
            <p className="col-xs-12 btn truncate">Marcar como haciendo</p>
          </div>
        </div>
      );
    });
  }
  createTask() {
    DiamondAPI.insert({
      collection: 'tasks',
      obj: {
        title: 'test',
        boardId: 'boardId',
        dueDate: new Date().getTime(),
        duration: [],
        status: '',
        position: 0,
      },
      isGlobal: true,
      callback(error, result) {
        console.log('insert task result', error, result);
      }
    });
  }
}

ReactDOM.render(
  <TrelloPage />,
  document.getElementById('render-target')
);