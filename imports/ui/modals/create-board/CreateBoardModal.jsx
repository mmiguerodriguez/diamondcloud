import React     from 'react';
import Select    from 'react-select';

import Modal     from '../Modal.jsx';
import { InputError, TextInput, SelectInput } from '../../validation/inputs.jsx';

export default class CreateBoardModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isPrivate: false,
      users: [],
    };
  }

  render() {
    return (
      <Modal
        id={ 'createBoardModal' }
        header={
          <div>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <img src='/img/close-modal-icon.svg' width='18px' />
            </button>
            <h4 className='modal-title'>Crear un board</h4>
          </div>
        }
        body={
          <div className='modal-body-fixed container-fluid'>
            <p className='explanation-text'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.</p>
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
                    multi={ true }
                    simpleValue={ true }
                    disabled={ false }
                    options={ this.teamUsers() }
                    value={ this.state.users }
                    onChange={ this.handleSelectChange.bind(this) } />
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
                      onClick={ this.clearData.bind(this) }>
                Cancelar
              </button>
              <button type='button'
                      className='btn btn-accept btn-hover'
                      onClick={ this.createBoard.bind(this) }>
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
      let user = Meteor.users.findOne({ 'emails.address': _user.email });
      if(user._id !== Meteor.userId()) {
        arr.push({
          label: user.profile.name,
          value: user._id,
        });
      }
    });

    return arr;
  }
  createBoard() {
    let board = {
      teamId: this.props.team._id,
      ...this.state
    };

    if(board.isPrivate) {
      let arr = [];
      board.users.split(',').map((userId) => {
        arr.push({ _id: userId });
      });
      board.users = arr;
    } else {
      board.users = [];
    }

    if(board.name != '' && board.name.length >= 3) {
      Meteor.call('Boards.methods.create', board, (error, board) => {
        if(error) {
          throw new Meteor.Error(error);
        } else {
          this.clearData();
          this.closeModal();
          
          this.props.toggleCollapsible('boards');
          this.props.changeBoard(board._id);
          this.props.getMessages({ boardId: board._id });

        }
      });
    } else {
      this.errorBorder($('#boardName'));
    }
  }

  // helpers
  handleChange(index, event) {
    let val = event.target.value;
    if(index === 'isPrivate')  {
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
  closeModal() {
    $('#createBoardModal').modal('hide');
  }
  clearData() {
    this.setState({
      name: '',
      isPrivate: false,
      users: [],
    });
  }
}

CreateBoardModal.propTypes = {
  team: React.PropTypes.object.isRequired,
  getMessages: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
};
