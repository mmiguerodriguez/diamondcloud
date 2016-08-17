import React     from 'react';
import Select    from 'react-select';

import Modal     from '../Modal.jsx';
import { InputError, TextInput, SelectInput } from '../../validation/inputs.jsx';

export default class CreateChatModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
    };
  }

  render() {
    return (
      <Modal
        id={ 'createChatModal' }
        header={
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <img src="/img/close-modal-icon.svg" width="18px" />
            </button>
            <h4 className="modal-title">Crear un chat</h4>
          </div>
        }
        body={
          <div>
            <Select
              name="form-field-name"
              placeholder="Seleccioná los usuarios"
              simpleValue={ true }
              disabled={ false }
              options={ this.teamUsers() }
              value={ this.state.userId }
              onChange={ this.handleSelectChange.bind(this) } />
          </div>
        }
        footer={
          <div>
            <div className="row">
              <button type="button"
                      className="btn btn-cancel btn-hover"
                      data-dismiss="modal">
                Cancelar
              </button>
              <button type="button"
                      className="btn btn-accept btn-hover"
                      data-dismiss="modal"
                      onClick={ this.createChat.bind(this) }>
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
      arr.push({
        label: user.profile.name,
        value: user._id,
      })
    });

    return arr;
  }
  handleSelectChange(value) {
    this.setState({
      userId: value,
    });
  }
  createChat() {
    let chat = {
      teamId: this.props.team._id,
      ...this.state
    };

    Meteor.call('DirectChats.methods.create', chat, (error, response) => {
      if(error) {
        throw new Meteor.Error(error);
      } else {
        console.log(response);
        $('#createChatModal').modal('hide');
      }
    });
  }
}

CreateChatModal.propTypes = {
  team: React.PropTypes.object.isRequired,
};