import React     from 'react';
import Select    from 'react-select';

import Modal     from '../Modal';

export default class CreateChatModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { userId: '' };

    this.clearData = this.clearData.bind(this);
    this.createChat = this.createChat.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  teamUsers() {
    const arr = [];

    this.props.team.users.map((_user) => {
      const user = Meteor.users.findByEmail(_user.email, {});
      if (user) {
        if (user._id !== Meteor.userId()) {
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
    const chat = {
      teamId: this.props.team._id,
      ...this.state,
    };

    if (chat.userId !== '') {
      Meteor.call('DirectChats.methods.create', chat, (error, response) => {
        if (error) {
          this.props.toggleError({
            type: 'show',
            body: 'Hubo un error interno al crear el chat',
          });
        } else {
          this.close();

          this.props.addChat({ directChatId: response._id });
          this.props.toggleCollapsible('chats');
        }
      });
    } else {
      this.props.toggleError({
        type: 'show',
        body: 'Tenés que seleccionar un usuario',
      });
    }
  }

  handleSelectChange(value) {
    this.setState({
      userId: value,
    });
  }

  close() {
    $('#createChatModal').modal('hide');
    this.clearData();
  }

  clearData() {
    this.setState({
      userId: '',
    });
  }

  render() {
    return (
      <Modal
        id={'createChatModal'}
        header={
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <img src="/img/close-icon.svg" width="18px" />
            </button>
            <h4 className="modal-title">Crear un chat</h4>
          </div>
        }
        body={
          <div className="modal-body-fixed">
            <p className="explanation-text">
              Selecione a un miembro del equipo con el que querés chatear.
            </p>
            <Select
              name="form-field-name"
              className="create-chat-user-select"
              placeholder="Seleccioná los usuarios"
              value={this.state.userId}
              onChange={this.handleSelectChange}
              options={this.teamUsers()}
              disabled={false}
              noResultsText="No se encontraron usuarios en el equipo"
              simpleValue
            />
          </div>
        }
        footer={
          <div>
            <div className="row">
              <button
                type="button"
                className="btn btn-cancel btn-hover"
                data-dismiss="modal"
                onClick={this.clearData}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-accept btn-hover"
                onClick={this.createChat}
              >
                Crear
              </button>
            </div>
          </div>
        }
      />
    );
  }
}

CreateChatModal.propTypes = {
  team: React.PropTypes.object.isRequired,
  addChat: React.PropTypes.func.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
  toggleError: React.PropTypes.func.isRequired,
};
