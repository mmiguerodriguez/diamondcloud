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
  
  renderBoardUsersSelectValue() {
    return this.props.board.users.map((user, index) => {
      if (this.props.board.users.length - 1 === index) {
        return user.email;
      } else {
        return user.email + ',';
      }
    });
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
  
  editBoard() {
    let board = { ...this.state };
    let boardId = this.props.board._id;
    
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
    
    console.log(board.users);
    /*
    
    Meteor.call('Boards.methods.edit', { boardId, ...board }, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Success editing board data');
      }
    });
    
    */
  }
  
  constructor(props) {
    super(props);
    
    this.state = {
      name: this.props.board.name,
      type: this.props.board.type,
      isPrivate: this.props.board.isPrivate,
      users: '',
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.editBoard = this.editBoard.bind(this);
  }

  render() {
    return (
      <Modal
        id={'configBoardModal'}
        header={
          <div>
            
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
                    name='board-public-radio'
                    type='radio'
                    value={false}
                    onChange={(e) => this.handleChange('isPrivate', e)}
                    checked={!this.state.isPrivate ? true : false}
                  />
                  Publico
                </label>
                <label className='radio-inline'>
                  <input
                    name='board-private-radio'
                    type='radio'
                    value={true}
                    onChange={(e) => this.handleChange('isPrivate', e)}
                    checked={this.state.isPrivate ? true : false}
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
                    value={this.renderBoardUsersSelectValue()}
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
  board: React.PropTypes.object.isRequired,
};