import React           from 'react';
import Select          from 'react-select';

import Modal           from '../Modal.jsx';
import {
  InputError,
  TextInput,
  SelectInput
}                      from '../../validation/inputs.jsx';

import { BOARD_TYPES } from '../board-types.js';

export default class ConfigBoardModal extends React.Component {
  editBoard() {
    let boardId = this.state.board._id;
    let board = {
      name: this.state.name,
      type: this.state.type,
      isPrivate: this.state.isPrivate,
      users: this.state.users,
    };

    if (board.isPrivate) {
      if (board.users !== '') {
        let arr = [];

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

    Meteor.call('Boards.methods.editBoard', { boardId, ...board }, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Success editing board data');
      }
    });
  }

  startup(nextProps) {
    let board, users = [];
    let props = nextProps || this.props;

    /**
     * Get the real board
     */
    props.boards.forEach((_board) => {
      if (_board._id === props.boardId) {
        board = _board;
      }
    });

    /**
     * Set board users
     */
    board.users.forEach((user) => {
      if (user.email !== Meteor.user().email()) {
        users.push(user.email);
      }
    });

    users = users.join(',');

    console.log(board);

    this.setState({
      board,
      name: board.name,
      type: board.type,
      isPrivate: board.isPrivate,
      users,
    });
  }

  renderTeamUsers() {
    let arr = [];

    this.props.team.users.map((_user) => {
      let user = Meteor.users.findByEmail(_user.email, {});
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
          value={type.value}>
          {type.name}
        </option>
      );
    });
  }

  handleChange(index, event) {
    let val = event.target.value;
    if (index === 'isPrivate')  {
      val = val === 'true' ? true : false;
    }

    this.setState({
      [index]: val,
    });
  }

  handleSelectChange(value) {
    this.setState({
      users: value,
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      type: '',
      isPrivate: '',
      users: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.editBoard = this.editBoard.bind(this);
  }

  componentWillMount() {
    this.startup();
  }

  componentWillReceiveProps(nextProps) {
    this.startup(nextProps);
  }

  render() {
    return (
      <Modal
        id={'configBoardModal'}
        header={
          <div>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <img src='/img/close-icon.svg' width='18px' />
            </button>
            <h4 className='modal-title'>Editar un board</h4>
          </div>
        }
        body={
          <div className='modal-body-fixed container-fluid'>
            <p className='explanation-text'>Modificá el nombre del board y decidí quienes lo van a poder ver.</p>
            <div className='form-group name-input'>
              <label
                htmlFor='boardName'
                className='control-label'>
                Nombre
              </label>
              <div className='col-xs-12'>
                <TextInput
                  id='boardName'
                  class='form-control'
                  placeholder='Nombre del board'
                  required={true}
                  minCharacters={3}
                  value={this.state.name}
                  onChange={(e) => this.handleChange('name', e)}
                  errorMessage='El nombre no es válido'
                  emptyMessage='Es obligatorio poner un nombre'
                  minCharactersMessage='El nombre debe tener 3 o más caracteres'
                />
              </div>
            </div>
            <div className='form-group type-input'>
              <label
                htmlFor='boardType'
                className='control-label'>
                Tipo
              </label>
              <div className='col-xs-12 type'>
                <select
                  className='form-control'
                  value={this.state.type}
                  onChange={(e) => this.handleChange('type', e)}>
                  {this.renderBoardTypes()}
                </select>
              </div>
            </div>
            <div className='form-group privacy-input'>
              <label
                htmlFor='privateBoard'
                className='control-label'>
                Privacidad
              </label>
              <div className='col-xs-12 privacy'>
                <label className='radio-inline'>
                  <input
                    name='board-private-radio'
                    type='radio'
                    value={false}
                    onChange={(e) => this.handleChange('isPrivate', e)}
                    defaultChecked={!this.state.isPrivate ? true : false}
                  />
                  Publico
                </label>
                <label className='radio-inline'>
                  <input
                    name='board-private-radio'
                    type='radio'
                    value={true}
                    onChange={(e) => this.handleChange('isPrivate', e)}
                    defaultChecked={this.state.isPrivate ? true : false}
                  />
                  Privado
                </label>
              </div>
            </div>
            {
              this.state.isPrivate ? (
                <div className='share-board'>
                  <label
                    htmlFor='form-field-name'
                    className='control-label'>
                    Compartir con otros
                  </label>
                  <Select
                    name='form-field-name'
                    className='col-xs-12'
                    placeholder='Ingrese nombre o mail...'
                    noResultsText='No se encontraron usuarios en el equipo'
                    multi={true}
                    simpleValue={true}
                    disabled={false}
                    value={this.state.users}
                    options={this.renderTeamUsers()}
                    onChange={this.handleSelectChange}
                  />
                </div>
              ) : (null)
            }
          </div>
        }
        footer={
          <div className='row'>
            <button
              type='button'
              className='btn btn-cancel btn-hover'
              data-dismiss='modal'>
              Cancelar
            </button>
            <button
              type='button'
              className='btn btn-accept btn-hover'
              data-dismiss='modal'
              onClick={this.editBoard}>
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
  boards: React.PropTypes.array.isRequired,
  boardId: React.PropTypes.string.isRequired,
};
