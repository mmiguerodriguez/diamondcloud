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
  browserHistory,
} = ReactRouter;

/**
 * ErrorComponent delay
 * (in miliseconds)
 */
const ERROR_DELAY = 5000;

/**
 * Checks if a board is a coordination board
 * by checking its type.
 *
 * @param {Object} board
 * @returns {Boolean} isCoordination
 */
const isCoordination = (board) => {
  if (
    board.type === 'coordinadores' ||
    board.type === 'directores creativos' ||
    board.type === 'directores de cuentas'
  ) {
    return true;
  }

  return false;
};

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
      currentBoard: {},
      currentUser: {},
      coordination: false,
      loading: true,
      users: [],
      boards: [],
    };
  }

  componentDidMount() {
    const self = this;
    
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });

    const currentBoard = DiamondAPI.getCurrentBoard();
    const currentUser = DiamondAPI.getCurrentUser();
    let coordination;

    if (isCoordination(currentBoard)) {
      coordination = true;
    } else {
      coordination = false;
    }

    /**
     * Set currentBoard, user and if it's a
     * coordination board type, a boolean.
     */
    self.setState({
      currentBoard,
      currentUser,
      coordination,
    }, () => {
      /**
       * If it's a cordination board type then fetch all tasks,
       * even finished ones, except archived.
       * If not, fetch the ones that are from the
       * currentBoard and that are not finished
       * or queued.
       */
      const filter = coordination ? {
        archived: false,
      } : {
        archived: false,
        status: {
          $in: ['queued', 'not_finished'],
        },
        boardId: currentBoard._id,
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
            self.setState({
              tasks: result || [],
              loading: false,
            });
          }
        },
      });
      self.setState({
        boards: DiamondAPI.getBoards().fetch(),
        users: DiamondAPI.getUsers(),
      });
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

    const taskTitleClass = classNames({
      'col-xs-12': !isCoordination,
      'col-xs-6': isCoordination,
    }, 'text-center board-list-title');

    console.log(this.props.location.pathname);

    return (
      <div className="col-xs-12 task-manager">
        <div
          role="button"
          className={taskTitleClass}
          onClick={() => this.setLocation('tasks/show')}>
          <b>Lista de tareas</b>
        </div>
        {
          isCoordination ? (
            <div
              role="button"
              className="col-xs-6 text-center board-list-title"
              onClick={() => this.setLocation('/panel')}>
              <b>Panel</b>
            </div>
          ) : (null)
        }

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

/**
 * Renders the layout to create a task.
 */
class CreateTask extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.taskTitle,
      boardId: this.props.selectedBoardId || this.props.boards[0]._id,
      description: '',
      type: '',
      startDate: new Date().getTime() + (1000 * 60 * 60),

      task_types: [],
    };

    this.createTask = this.createTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  /**
   * Creates a task checking before if the input data is
   * correct.
   */
  createTask() {
    const self = this;

    const position = self.getBiggestTaskPosition();
    
    const type = Number(self.state.type);
    const miliseconds = type * 24 * 60 * 60 * 1000;
    const startDate = Number(self.state.startDate);
    const dueDate = Number(startDate + miliseconds);

    if (self.state.title.length <= 0 || self.state.title === '') {
      self.props.showError({
        body: 'El título de la tarea es inválido',
      });
      return;
    }
    
    if (type === '' || !Number.isInteger(type)) {
      self.props.showError({
        body: 'El tipo de tarea es inválido'
      });
      return;
    }

    if (self.state.boardId === '') {
      self.props.showError({
        body: 'El pizarrón asociado a la tarea es inválido',
      });
      return;
    }

    if (!Number.isInteger(startDate) || startDate === 0 || startDate < new Date().getTime()) {
      self.props.showError({
        body: 'La fecha de inicio de la tarea es inválida',
      });
      return;
    }

    if (startDate > dueDate) {
      self.props.showError({
        body: 'La fecha de inicio de la tarea es antes que la de finalización',
      });
      return;
    }

    if (position < 0) {
      self.props.showError({
        body: 'La posición de la tarea es inválida',
      });
      return;
    }

    DiamondAPI.insert({
      collection: 'tasks',
      object: {
        title: self.state.title,
        description: self.state.description || 'No hay descripción',
        durations: [],
        startDate,
        dueDate,
        position,
        status: 'queued',
        archived: false,
        boardId: self.state.boardId,
      },
      isGlobal: true,
      callback(error, result) {
        if (error) {
          console.error(error);
        } else {
          browserHistory.push('/tasks/show');
        }
      },
    });
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
    }

    return 0;
  }
  /**
   * Renders the <option> elements of the boards, except
   * for the coordination board.
   */
  renderOptions() {
    return this.props.boards.map((board) => {
      if (!isCoordination(board)) {
        return (
          <option
            key={board._id}
            value={board._id}>
            {board.name}
          </option>
        );
      }

      return (null);
    });
  }

  handleChange(index, event) {
    let value = event.target.value;

    if (index === 'startDate') {
      value = new Date(value).getTime();
    }

    this.setState({
      [index]: value,
    });
  }

  componentDidMount() {
    const self = this;

    DiamondAPI.get({
      collection: 'task_types',
      callback(error, result) {
        if (error) {
          self.props.showError({
            body: 'Ocurrió un error interno al agarrar los tipos de tareas',
          });
        } else {
          self.setState({
            type: result[0] || '',
            task_types: result,
          });
        }
      },
    });

    $('#create-task-title').focus();
  }

  renderTaskTypes() {
    return this.state.task_types.map((type) => {
      return (
        <option value={type.time}>{type.name}</option>
      );
    });
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
      <div className="row create-task-form">
        <div
          className="go-back go-back-task"
          onClick={() => this.props.setLocation('tasks/show')}>
        </div>
        <div className="col-xs-12">
          <h4 className="visible-xs-inline-block">Crear una tarea</h4>
        </div>
        <div className="col-xs-12 create-task-inputs">
          <div className="form-group">
            <label className="control-label" htmlFor="create-task-title">Título</label>
            <input
              id="create-task-title"
              className="form-control"
              value={this.state.title}
              onChange={this.props.handleChange.bind(null, 'taskTitle', undefined)}
              type="text"
              placeholder="Ingresá el título"
            />
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="create-task-board">Tipo</label>
            <select
              id="create-task-type"
              className="form-control"
              value={this.state.type}
              onChange={(e) => this.handleChange('type', e)}
            >
              {this.renderTaskTypes()}
            </select>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="create-task-startdate">Fecha de inicio</label>
            <input
              id="create-task-startdate"
              className="form-control"
              type="datetime-local"
              placeholder="Ingresá la fecha de inicio"
              onChange={(e) => this.handleChange('startDate', e)}
              defaultValue={$.format.date(this.state.startDate, 'yyyy-MM-ddThh:mm')}
            />
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="create-task-board">Pizarrón</label>
            <select
              id="create-task-board"
              className="form-control"
              value={this.state.boardId}
              onChange={(e) => this.handleChange('boardId', e)}
            >
              {this.renderOptions()}
            </select>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="create-task-description">Descripción</label>
            <textarea
              id="create-task-description"
              className="form-control"
              placeholder="Ingresá la la descripción de la tarea"
              onChange={(e) => this.handleChange('description', e)}
            >
            </textarea>
          </div>
          <button
            onClick={this.createTask}
            type="submit"
            className="btn btn-primary"
          >
            Crear tarea
          </button>
        </div>
      </div>
    );
  }
}


class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      time: '',

      types: [],
      subscription: {},
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.insertTaskType = this.insertTaskType.bind(this);
    this.removeTaskType = this.removeTaskType.bind(this);
  }

  componentDidMount() {
    const self = this;
    
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });

    const subscription = DiamondAPI.subscribe({
      collection: 'task_types',
      callback(error, result) {
        if (error) {
          self.props.showError({
            body: 'Ocurrió un error interno al agarrar los tipos de tareas',
          });
        } else {
          self.setState({
            types: result,
          });
        }
      },
    });
    
    self.setState({
      subscription,
    });
  }
  
  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });
  }

  componentWillUnmount() {
    this.state.subscription.stop();
  }

  insertTaskType() {
    const self = this;
    let { name, time } = this.state;

    time = Number(time);

    this.setState({
      name: '',
      time: '',
    });
  
    if (name === '') {
      this.props.showError({
        body: 'Ingresá un nombre válido',
      });
      return;
    }
 
    if (name.length < 3) {
      this.props.showError({
        body: 'Ingresá un nombre con más de 3 caracteres',
      });
      return;
    }

    if (!Number.isInteger(time) || Number(time) <= 0) {
      this.props.showError({
        body: 'El tiempo ingresado es inválido',
      });
      return;
    }

    DiamondAPI.insert({
      collection: 'task_types',
      object: {
        name,
        time,
      },
      isGlobal: true,
      callback(error, result) {
        if (error) {
          self.props.showError({
            body: 'Hubo un error interno al insertar el tipo de tarea',
          });
        }
      }
    });
  }

  removeTaskType(typeId) {
    const self = this;

    DiamondAPI.remove({
      collection: 'task_types',
      filter: {
        _id: typeId,
      },
      callback(error, result) {
        if (error) {
          self.props.showError({
            body: 'Hubo un error interno al eliminar el tipo de tarea',
          });
        }
      }
    });
  }

  handleChange(index, e) {
    const value = e.target.value;

    this.setState({
      [index]: value,
    });
  }

  renderTypes() {
    return this.state.types.map((type) => {
      return (
        <ul className="task-type-item">
          <div
            className="remove-task"
            title="Borrar tipo de tarea"
            data-toggle="tooltip"
            data-placement="bottom"
            onClick={() => this.removeTaskType(type._id)}
          />
          <p className="task-type-item-name">Tipo: {type.name}</p>
          <p>Duración: {type.time} días</p>
        </ul>
      );
    });
  }

  render() {
    return (
      <div className="task-type">
        <h4 className="task-type-title" >Tipos de tareas</h4>
        <div className="form-group">
          <label className="control-label" htmlFor="panel-task-type-name">Nombre</label>
          <input
            id="panel-task-type-name"
            className="form-control"
            value={this.state.name}
            onChange={(e) => this.handleChange('name', e)}
            type="text"
            placeholder="Ingresá el nombre de la tarea"
          />
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="panel-task-type-time">Tiempo (días)</label>
          <input
            id="panel-task-type-time"
            className="form-control"
            value={this.state.time}
            onChange={(e) => this.handleChange('time', e)}
            type="number"
            placeholder="Ingresá el tiempo"
          />
        </div>
        <button
          onClick={this.insertTaskType}
          type="submit"
          className="btn btn-primary"
        >
          Crear tarea
        </button>

        <ol className="col-xs-12 task-type-list">
          {this.renderTypes()}
        </ol>
      </div>
    );
  }
}
/**
 * Renders all the boards the team has.
 */
class BoardsList extends React.Component {
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });
  }

  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });
  }

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
      if (!isCoordination(board)) {
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
    const classes = classNames({
      board: !this.props.coordination,
      'board-fixed': this.props.coordination,
    });

    return (
      <div className={classes}>
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
        <div className='text-center no-task'>No hay tareas asignadas a este pizarrón</div>
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
    const durations = [];
    let updateQuery;

    if (status === 'finished') {
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
    } else {
      updateQuery = {
        $set: {
          status,
        },
      };
    }

    if (status === 'finished') {
      $(`#finish-task-${self.props.task._id}`).tooltip('destroy');            
    } else if (status === 'not_finished') {
      if (status === 'rejected') {
        $(`#accept-task-${self.props.task._id}`).tooltip('destroy');   
        $(`#reject-task-${self.props.task._id}`).tooltip('destroy');
      }
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
                console.error(error);

                this.props.showError({
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
    $(`#edit-task-${this.props.task._id}`).tooltip('hide');

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
      doing: this.props.doing,
      task_title: this.props.task.title,

      task_types: [],

      editing: false,
      showDescription: false,
      intervalId: false,
      count: '00:00:00',
    };

    this.startTask = this.startTask.bind(this);
    this.stopTask = this.stopTask.bind(this);
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.task.title !== this.state.task_title) {
      this.setState({
        task_title: nextProps.task.title,
      });
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
    const editClass = classNames({
      'col-xs-2': isCoordination && !isEditing && isFinished,
      'col-xs-2 icon-fixed': isCoordination && !isEditing && !isFinished,
    }, 'edit-task');
    const descriptionClass = classNames({
      'open-description': showDescription,
      'hide-description': !showDescription,
    }, 'col-xs-12 description')
    const clickHandle = isCoordination ? this.openTask : () => {
      self.setState({
        showDescription: !this.state.showDescription,
      });
    };

    return (
      <div className='col-xs-12 task'>
        <div>
          <div className={containerClass}>
            {
              isEditing ? (
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
                    !isCoordination ? (
                      <p className={descriptionClass}><b>Descripción:</b> {this.props.task.description}</p>
                    ) : (null)
                  }
                  {
                    !isCoordination && isDoing ? (
                      <p className='col-xs-12 time-active'>Tiempo activo: {this.state.count}</p>
                    ) : (null)
                  }
                </div>
              )
            }
          </div>

          {
            isCoordination && !isEditing && !isFinished && !isRejected ? (
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
            isCoordination && !isEditing ? (
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
            isCoordination && !isEditing && (isFinished || isRejected) ? (
                <div
                  id={`restore-task-${this.props.task._id}`}
                  className="col-xs-2 restore-task"
                  title="Restaurar tarea"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  role="button"
                  onClick={() => this.setTaskStatus('not_finished')}
                />
            ) : (null)
          }

          {
            isCoordination && !isEditing && isFinished ? (
              <div className="finished-task" />
            ) : (null)
          }

          {
            isCoordination && !isEditing && isRejected ? (
              <div className="rejected-task" />
            ) : (null)
          }

          {
            !isCoordination && isDoing && !isQueued ? (
              <div>
                <div className="record">
                   <img
                     src="/modules/task-manager/img/record.svg"
                     width="25px"
                   />
                </div>
                <div
                  id={`pause-task-${this.props.task._id}`}
                  className="pause"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Marcar como pausado"
                  role="button"
                  onClick={this.stopTask}
                >
                  <img
                    src="/modules/task-manager/img/pause-button.svg"
                    width="15px"
                  />
                </div>
              </div>
            ) : (null)
          }

          {
            !isCoordination && !isDoing && !isQueued ? (
              <div
                id={`play-task-${this.props.task._id}`}
                className="play"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Marcar como haciendo"
                role="button"
                onClick={this.startTask}
              >
                <img
                  src="/modules/task-manager/img/play-arrow.svg"
                  width="15px"
                />
              </div>
            ) : (null)
          }

          {
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
                >
                  <img
                    src="/modules/task-manager/img/finished-task.svg"
                    width="20px"
                  />
                </div>
              </div>
            ) : (null)
          }

          {
            !isCoordination && isQueued ? (
              <div>
                <div
                  id={`accept-task-${this.props.task._id}`}
                  className="accept"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Aceptar tarea"
                  role="button"
                  onClick={() => this.setTaskStatus('not_finished')}
                >
                  <img
                    src="/modules/task-manager/img/accept-task.svg"
                    width="15px"
                  />
                </div>
                <div
                  id={`reject-task-${this.props.task._id}`}
                  className="reject"
                  title="Rechazar tarea"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  role="button"
                  onClick={() => this.setTaskStatus('rejected')}
                >
                  <img
                    src="/modules/task-manager/img/reject-task.svg"
                    width="15px"
                  />
                </div>
              </div>
            ) : (null)
          }

          {
            !isEditing ? (
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

/**
 * Renders information from the task.
 */
class TaskInformation extends React.Component {
  render() {
    let task;
    let board;
    let status;

    task = this.props.tasks.find(_task => _task._id === this.props.params.taskId);
    board = this.props.boards.find(_board => _board._id === task.boardId);
    /*
    this.props.tasks.forEach((_task) => {
      if (_task._id === this.props.params.taskId) {
        task = _task;
        this.props.boards.forEach((_board) => {
          if (_board._id === _task.boardId) {
            board = _board;
          }
        });
      }
    });
*/
    if (task.status === 'finished') {
      status = 'Finalizada';
    } else if (task.status === 'not_finished') {
      status = 'No finalizada';
    } else if (task.status === 'queued') {
      status = 'En espera';
    } else if (task.status === 'rejected') {
      status = 'Rechazada';
    }

    return (
      <div>
        <div
          className='go-back go-back-task'
          onClick={() => this.props.setLocation('tasks/show')}>
        </div>
        <div className='task-info col-xs-12'>
          <h4 className='task-info-title'>Información de la tarea</h4>
          <div className='item'>
            <p>
              <b>Tarea:</b> {task.title}
            </p>
            <p>
              <b>Plazo:</b>
              {` ${$.format.date(new Date(task.startDate), 'dd/MM/yy')} - ${$.format.date(new Date(task.dueDate), 'dd/MM/yy')}`}
            </p>
            <p>
              <b>Estado:</b> {status}
            </p>
            <p>
              <b>Pizarrón:</b> {board.name}
            </p>
            <p>
              <b>Descripción:</b> {task.description}
            </p>
            <UserTaskInformation
              durations={task.durations}
              users={this.props.users}
            />
          </div>
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
              <p>{working ? 'Trabajando actualmente' : `Tiempo trabajado: ${time}`}</p>
            </div>
          </div>
        </div>
      );
    });
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
    <Route path="/" component={TaskManagerPage}>
      <Route path="/tasks/show" component={BoardsList} />
      <Route path="/tasks/create" component={CreateTask} />
      <Route path="/tasks/:taskId" component={TaskInformation} />
      
      <Route path="/panel" component={Panel} />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
