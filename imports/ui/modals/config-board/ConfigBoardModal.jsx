import React           from 'react';
import Select          from 'react-select';
import classNames      from 'classnames';

import Modal           from '../Modal';
import {
  InputError,
  TextInput,
  SelectInput
}                      from '../../validation/inputs';

import { BOARD_TYPES } from '../board-types';

export default class ConfigBoardModal extends React.Component {
  constructor(props) {
    super(props);

    let users = [];
    this.props.board.users.forEach((user) => {
      if (user.email !== Meteor.user().email()) {
        users.push(user.email);
      }
    });
    users = users.join(',');

    this.state = {
      name: this.props.board.name,
      type: this.props.board.type,
      isPrivate: this.props.board.isPrivate,
      users: this.props.board.users,
      usersValues: users,
    };

    this.close = this.close.bind(this);
    this.editBoard = this.editBoard.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.board._id !== this.props.board._id) {
      let users = [];
      nextProps.board.users.forEach((user) => {
        if (user.email !== Meteor.user().email()) {
          users.push(user.email);
        }
      });
      users = users.join(',');

      this.setState({
        name: nextProps.board.name,
        type: nextProps.board.type,
        isPrivate: nextProps.board.isPrivate,
        users: nextProps.board.users,
        usersValues: users,
      });
    }
  }

  close() {
    $('#configBoardModal').modal('hide');
  }

  editBoard() {
    const boardId = this.props.board._id;
    const board = {
      name: this.state.name,
      type: this.state.type,
      isPrivate: this.state.isPrivate,
      users: this.state.usersValues,
    };

    if (board.isPrivate) {
      if (board.users !== '') {
        const arr = [];

        board.users.split(',').map((email) => {
          arr.push({ email });
        });

        board.users = arr;
      } else {
        board.users = [];
      }

      board.users.push({ email: Meteor.user().email() });
    } else {
      board.users = [];
    }

    if (board.name !== '') {
      if (board.name.length >= 3) {
        if (board.type !== '') {
          if (board.type.length >= 3) {
            Meteor.call('Boards.methods.editBoard', { boardId, ...board }, (error, result) => {
              if (error) {
                this.props.toggleError({
                  type: 'show',
                  body: 'Hubo un error interno al editar el board',
                });
              } else {
                this.close();
              }
            });
          } else {
            this.props.toggleError({
              type: 'show',
              body: 'El tipo del board debe tener 3 o más caracteres',
            });
          }
        } else {
          this.props.toggleError({
            type: 'show',
            body: 'El tipo del board no puede estar vacío',
          });
        }
      } else {
        this.props.toggleError({
          type: 'show',
          body: 'El nombre del board debe tener 3 o más caracteres',
        });
      }
    } else {
      this.props.toggleError({
        type: 'show',
        body: 'El nombre del board no puede estar vacío',
      });
    }
  }

  handleChange(index, event) {
    const val = event.target.value;

    this.setState({
      [index]: val,
    });
  }

  handleRadio(isPrivate, event) {
    if (this.state.isPrivate !== isPrivate) {
      this.setState({
        isPrivate,
      });
    }
  }

  handleSelectChange(value) {
    this.setState({
      usersValues: value,
    });
  }

  renderTeamUsers() {
    const arr = [];

    this.props.team.users.forEach((_user) => {
      const user = Meteor.users.findByEmail(_user.email, {});
      if (user) {
        if (user._id !== Meteor.userId()) {
          arr.push({
            label: user.profile.name,
            value: user.email(),
          });
        }
      }
    });

    return arr;
  }

  renderBoardTypes() {
    return BOARD_TYPES.map((type, index) => {
      return (
        <option
          key={index}
          value={type.value}
        >
          {type.name}
        </option>
      );
    });
  }

  render() {
    const publicBoard = classNames({
      active: !this.state.isPrivate,
    }, 'radio');
    const privateBoard = classNames({
      active: this.state.isPrivate,
    }, 'radio');

    return (
      <Modal
        id={'configBoardModal'}
        header={
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <img src="/img/close-icon.svg" width="18px" />
            </button>
            <h4 className="modal-title">Editar un board</h4>
          </div>
        }
        body={
          <div className="modal-body-fixed container-fluid">
            <p className="explanation-text">
              Modificá el nombre del board y decidí quienes lo van a poder ver.
            </p>
            <div className="form-group name-input">
              <label
                htmlFor="boardName"
                className="control-label"
              >
                Nombre
              </label>
              <div className="col-xs-12">
                <TextInput
                  id="boardName"
                  class="form-control"
                  placeholder="Nombre del board"
                  minCharacters={3}
                  value={this.state.name}
                  onChange={e => this.handleChange('name', e)}
                  errorMessage="El nombre no es válido"
                  emptyMessage="Es obligatorio poner un nombre"
                  minCharactersMessage="El nombre debe tener 3 o más caracteres"
                  required
                />
              </div>
            </div>
            <div className="form-group type-input">
              <label
                htmlFor="boardType"
                className="control-label"
              >
                Tipo
              </label>
              <div className="col-xs-12 type">
                <select
                  className="form-control"
                  value={this.state.type}
                  onChange={e => this.handleChange('type', e)}
                >
                  {this.renderBoardTypes()}
                </select>
              </div>
            </div>
            <div className="form-group privacy-input">
              <label
                htmlFor="privateBoard"
                className="control-label"
              >
                Privacidad
              </label>
              <div className="radio-container">
                <div
                  className="option-container"
                  role="button"
                  onClick={e => this.handleRadio(false, e)}
                >
                  <div className={publicBoard}>
                    <div className="check" />
                  </div>
                  <p className="text">Publico</p>
                </div>
                <div
                  className="option-container"
                  role="button"
                  onClick={e => this.handleRadio(true, e)}
                >
                  <div className={privateBoard}>
                    <div className="check" />
                  </div>
                  <p className="text">Privado</p>
                </div>
              </div>
            </div>
            {
              this.state.isPrivate ? (
                <div className="share-board">
                  <label
                    htmlFor="form-field-name"
                    className="control-label"
                  >
                    Compartir con otros
                  </label>
                  <Select
                    name="form-field-name"
                    className="col-xs-12"
                    placeholder="Ingrese nombre o mail"
                    value={this.state.usersValues}
                    onChange={this.handleSelectChange}
                    disabled={false}
                    options={this.renderTeamUsers()}
                    noResultsText="No se encontraron usuarios en el equipo"
                    backspaceToRemoveMessage="Borrá para eliminar a '{label}'"
                    simpleValue
                    multi
                  />
                </div>
              ) : (null)
            }
          </div>
        }
        footer={
          <div className="row">
            <button
              type="button"
              className="btn btn-cancel btn-hover"
              data-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-accept btn-hover"
              onClick={this.editBoard}
            >
              Guardar
            </button>
          </div>
        }
      />
    );
  }
}

ConfigBoardModal.propTypes = {
  team: React.PropTypes.object,
  board: React.PropTypes.object.isRequired,
  toggleError: React.PropTypes.func.isRequired,
};
