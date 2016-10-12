import React     from 'react';
import Select    from 'react-select';

import Modal     from '../Modal.jsx';
import {
  InputError,
  TextInput,
  SelectInput
}                from '../../validation/inputs.jsx';

const BOARD_TYPES = [
  { name: 'Creativos', value: 'creativos' },
  { name: 'Sistemas', value: 'sistemas' },
  { name: 'Directores Creativos', value: 'directores creativos' },
  { name: 'Directores de Cuentas', value: 'directores de cuentas' },
  { name: 'Administradores', value: 'administradores' },
  { name: 'Coordinadores', value: 'coordinadores' },
  { name: 'Medios', value: 'medios' },
];

export default class CreateBoardModal extends React.Component {
  createBoard() {
    let board = {
      teamId: this.props.team._id,
      ...this.state,
    };

    if (board.isPrivate) {
      let arr = [];

      if (board.users !== '') {
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

    if (board.name != '' && board.name.length >= 3) {
      Meteor.call('Boards.methods.create', board, (error, result) => {
        if (error) {
          console.error(error);
        } else {
          this.onClose();

          this.props.toggleCollapsible('boards');
          this.props.changeBoard(result._id);
          this.props.addChat({ boardId: result._id });
        }
      });
    } else {
      this.errorBorder('#boardName');
    }
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

  errorBorder(element) {
    $(element).css('transition', 'border-color 500ms');
    $(element).css('border-color', 'red');
    setTimeout(() => {
      $(element).css('border-color', '#ccc');
    }, 500);
  }

  onClose() {
    $('#createBoardModal').modal('hide'); // hide modal
    // reset state
    this.setState({
      name: '',
      // isPrivate: false,
      users: '',
      type: BOARD_TYPES[0].value,
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
      users: '',
      type: BOARD_TYPES[0].value,
      isPrivate: false,
    };

    this.onClose = this.onClose.bind(this);
    this.createBoard = this.createBoard.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  render() {
    return (
      <Modal
        id={ 'createBoardModal' }
        header={
          <div>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <img src='/img/close-icon.svg' width='18px' />
            </button>
            <h4 className='modal-title'>Crear un board</h4>
          </div>
        }
        body={
          <div className='modal-body-fixed container-fluid'>
            <p className='explanation-text'>Insertá el nombre del board y decidí quenes lo van a poder ver.</p>
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
                  value={this.state.name}
                  required={true}
                  minCharacters={3}
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
                <div className='col-xs-12'>
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
              <div className='col-xs-12'>
                <label className='radio-inline'>
                  <input
                    name='board-private-radio'
                    type='radio'
                    value={false}
                    onChange={(e) => this.handleChange('isPrivate', e)}
                    defaultChecked
                  />
                  Publico
                </label>
                <label className='radio-inline'>
                  <input
                    name='board-private-radio'
                    type='radio'
                    value={true}
                    onChange={(e) => this.handleChange('isPrivate', e)}
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
                    className=''
                    placeholder='Ingrese nombre o mail...'
                    noResultsText='No se encontraron usuarios en el equipo'
                    multi={true}
                    simpleValue={true}
                    disabled={false}
                    options={this.renderTeamUsers()}
                    value={this.state.users}
                    onChange={this.handleSelectChange}
                  />
                </div>
              ) : (null)
            }
        </div>
        }
        footer={
          <div>
            <div className='row'>
              <button
                type='button'
                className='btn btn-cancel btn-hover'
                data-dismiss='modal'
                onClick={this.onClose}>
                Cancelar
              </button>
              <button
                type='button'
                className='btn btn-accept btn-hover'
                onClick={this.createBoard}>
                Crear
              </button>
            </div>
          </div>
        }
      />
    );
  }
}

CreateBoardModal.propTypes = {
  team: React.PropTypes.object.isRequired,
  addChat: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
};
