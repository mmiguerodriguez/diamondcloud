import React              from 'react';
import { browserHistory } from 'react-router';

import isCoordination     from '../helpers/isCoordination';

/**
 * Renders the layout to create a task.
 */
class CreateTaskLayout extends React.Component {
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

    if (self.state.type === '' || !Number.isInteger(type)) {
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
            type: result.length ? result[0].time : '',
            task_types: result,
          });
        }
      },
    });

    $('#create-task-title').focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.taskTitle !== this.props.taskTitle) {
      this.setState({
        title: nextProps.taskTitle,
      });
    }
  }

  renderTaskTypes() {
    return this.state.task_types.map((type) => {
      return (
        <option value={type.time}>{type.name}</option>
      );
    });
  }

  render() {
    return (
      <div className="row create-task-form">
        <div
          className="go-back go-back-task"
          onClick={() => this.props.setLocation('tasks/show')}
        />
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
            <label className="control-label" htmlFor="create-task-description">Descripción</label>
            <textarea
              id="create-task-description"
              className="form-control"
              placeholder="Ingresá la la descripción de la tarea"
              onChange={(e) => this.handleChange('description', e)}
            >
            </textarea>
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

export default CreateTaskLayout;
