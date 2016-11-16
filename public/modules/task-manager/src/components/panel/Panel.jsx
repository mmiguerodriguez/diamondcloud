import React from 'react';

/**
 * Panel to add task-types
 * Renders only to coordinators
 */
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

    $(`#task-type${typeId}`).tooltip('destroy');

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
            id={`task-type${type._id}`}
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
            placeholder="Duración"
          />
        </div>
        <button
          onClick={this.insertTaskType}
          type="submit"
          className="btn btn-primary"
        >
          Crear
        </button>

        <ol className="col-xs-12 task-type-list">
          {this.renderTypes()}
        </ol>
      </div>
    );
  }
}

export default Panel;
