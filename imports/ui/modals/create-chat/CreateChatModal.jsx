import React     from 'react';
import Select    from 'react-select';

import Modal     from '../Modal.jsx';
import {
  InputError,
  TextInput,
  SelectInput
}                from '../../validation/inputs.jsx';

export default class CreateChatModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { userId: '' };

    this.clearData = this.clearData.bind(this);
    this.createChat = this.createChat.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  render() {
    return (
      <Modal
        id={ 'createChatModal' }
        header={
          <div>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <img src='/img/close-modal-icon.svg' width='18px' />
            </button>
            <h4 className='modal-title'>Crear un chat</h4>
          </div>
        }
        body={
          <div className='modal-body-fixed'>
            <p className='explanation-text'>Selecione a un miembro del equipo con el que querés chatear.</p>
            <Select
              name='form-field-name'
              className='create-chat-user-select'
              placeholder='Seleccioná los usuarios'
              noResultsText='No se encontraron usuarios en el equipo'
              simpleValue={ true }
              disabled={ false }
              options={ this.teamUsers() }
              value={ this.state.userId }
              onChange={ this.handleSelectChange } />
          </div>
        }
        footer={
          <div>
            <div className='row'>
              <button type='button'
                      className='btn btn-cancel btn-hover'
                      data-dismiss='modal'
                      onClick={ this.clearData }>
                Cancelar
              </button>
              <button type='button'
                      className='btn btn-accept btn-hover'
                      onClick={ this.createChat }>
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
      if(user) {
        if(user._id !== Meteor.userId()) {
          arr.push({
            label: user.profile.name,
            value: user._id,
          });
        }
      }
    });

    return arr;
  }
  createChat() {
    let chat = {
      teamId: this.props.team._id,
      ...this.state
    };

    if(chat.userId != '') {
      Meteor.call('DirectChats.methods.create', chat, (error, response) => {
        if(error) {
          console.error(error);
        } else {
          this.props.addChat({ directChatId: response._id });
          this.props.toggleCollapsible('chats');

          this.clearData();
          this.closeModal();
        }
      });
    } else {
      this.errorBorder($('.create-chat-user-select'));
    }
  }

  // helpers
  errorBorder(element) {
    $(element).css('border-color', 'red');
    setTimeout(() => {
      $(element).css('border-color', '#d9d9d9 #ccc #b3b3b3');
    }, 500);
  }
  handleSelectChange(value) {
    this.setState({
      userId: value,
    });
  }
  closeModal() {
    $('#createChatModal').modal('hide');
  }
  clearData() {
    this.setState({
      userId: '',
    });
  }
}

CreateChatModal.propTypes = {
  team: React.PropTypes.object.isRequired,
  addChat: React.PropTypes.func.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
};
