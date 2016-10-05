import React     from 'react';
import Select    from 'react-select';

import Modal     from '../Modal.jsx';
import {
  InputError,
  TextInput,
  SelectInput
}                from '../../validation/inputs.jsx';

export default class CreateBoardModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      isPrivate: false,
      users: '',
    };

    this.onClose = this.onClose.bind(this);
    this.createBoard = this.createBoard.bind(this);
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
            <div className=''>
              <div className='name-input'>
                <label  htmlFor='projectName'
                        className='control-label left-align'>
                  Nombre
                </label>
                <div className=''>
                  <TextInput
                    id='boardName'
                    class='form-control'
                    placeholder='Nombre del board'
                    value={ this.state.name }
                    required={ true }
                    minCharacters={ 3 }
                    onChange={ this.handleChange.bind(this, 'name') }
                    errorMessage='El nombre no es válido'
                    emptyMessage='Es obligatorio poner un nombre'
                    minCharactersMessage='El nombre debe tener 3 o más caracteres'/>
                </div>
              </div>
            </div>
            <div className='' style={ { overflow: 'auto' } }>
              <label  htmlFor='projectType'
                      className='control-label left-align'>
                Tipo
              </label>
              <form id='projectType' className='form-inline'>
                <div className='radio board-type'>
                  <label>
                    <input  name='board-type-radio'
                            type='radio'
                            value={ false }
                            onChange={ this.handleChange.bind(this, 'isPrivate') }
                            defaultChecked />
                    Publico
                  </label>
                </div>
                <div className='radio board-type'>
                  <label>
                    <input  name='board-type-radio'
                            type='radio'
                            value={ true }
                            onChange={ this.handleChange.bind(this, 'isPrivate') } />
                    Privado
                  </label>
                </div>
              </form>
            </div>
            {
              this.state.isPrivate ? (
                <div className='share-board'>
                  <label  htmlFor='form-field-name'
                          className='control-label left-align'>
                    Compartir con otros
                  </label>
                  <Select
                    name='form-field-name'
                    className=''
                    placeholder='Ingrese nombre o mail...'
                    noResultsText='No se encontraron usuarios en el equipo'
                    multi={ true }
                    simpleValue={ true }
                    disabled={ false }
                    options={ this.teamUsers() }
                    value={ this.state.users }
                    onChange={ this.handleSelectChange } />
                </div>
              ) : ( null )
            }
        </div>
        }
        footer={
          <div>
            <div className='row'>
              <button type='button'
                      className='btn btn-cancel btn-hover'
                      data-dismiss='modal'
                      onClick={ this.onClose }>
                Cancelar
              </button>
              <button type='button'
                      className='btn btn-accept btn-hover'
                      onClick={ this.createBoard }>
                Crear
              </button>
            </div>
          </div>
        }
      />
    );
  }
  teamUsers() {
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
  createBoard() {
    let board = {
      teamId: this.props.team._id,
      ...this.state
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

  // helpers
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
      users: ''
    });
  }
}

CreateBoardModal.propTypes = {
  team: React.PropTypes.object.isRequired,
  addChat: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
};
