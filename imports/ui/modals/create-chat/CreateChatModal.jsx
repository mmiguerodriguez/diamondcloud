import React     from 'react';
import Select    from 'react-select';
import 'react-select/dist/react-select.css';

import Modal     from '../Modal.jsx';

import { InputError, TextInput, SelectInput } from '../../validation/inputs.jsx';

export default class CreateChatModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isPrivate: false,
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
            { /* todo: implement UsersLists */ }
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
  handleChange(index, event) {
    this.setState({
      [index]: event.target.value,
    });
  }
  createChat() {
    // todo: create the chat
  }
}

CreateChatModal.propTypes = {
  
};
