import React     from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Modal     from '../Modal.jsx';

import { InputError, TextInput, SelectInput } from '../../validation/inputs.jsx';

export default class CreateBoardModal extends React.Component {
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
        id={ 'createBoardModal' }
        header={
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <img src="/img/close-modal-icon.svg" width="18px" />
            </button>
            <h4 className="modal-title">Crear un board</h4>
          </div>
        }
        body={
          <div>
            <div className="row">
              <div className="name-input">
                <label  htmlFor="projectName"
                        className="col-xs-2 col-sm-offset-2 control-label left-align">
                  Nombre
                </label>
                <div className="col-xs-12 col-sm-6">
                  <TextInput
                    id="boardName"
                    class="form-control"
                    placeholder="Nombre del board"
                    value={ this.state.name }
                    required={ true }
                    minCharacters={ 3 }
                    onChange={ this.handleChange.bind(this, 'name') }
                    errorMessage="El nombre no es válido"
                    emptyMessage="Es obligatorio poner un nombre"
                    minCharactersMessage="El nombre debe tener 3 o más caracteres"/>
                </div>
              </div>
            </div>
            <div className='row'>
              <form className="form-inline col-xs-8 col-xs-offset-4">
                <div className="radio board-type">
                  <label>
                    <input  id="public"
                            type="radio"
                            name="optionsRadios"
                            value={ false }
                            onChange={ this.handleChange.bind(this, 'isPrivate') }
                            defaultChecked />
                    Publico
                  </label>
                </div>
                <div className="radio board-type">
                  <label>
                    <input  id="private" 
                            type="radio"
                            name="optionsRadios"
                            value={ true }
                            onChange={ this.handleChange.bind(this, 'isPrivate') } />
                    Privado
                  </label>
                </div>
              </form>
            </div>
            <div className='row'>
              <Select
                name="form-field-name"
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' }
                ]}
                multi={true}
              />
            </div>
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
                      onClick={ this.createBoard.bind(this) }>
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
  createBoard() {
    // todo: create the board
  }
}

CreateBoardModal.propTypes = {
  
};
