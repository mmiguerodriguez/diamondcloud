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
                    <input  type="radio"
                            value={ false }
                            onChange={ this.handleChange.bind(this, 'isPrivate') }
                            defaultChecked />
                    Publico
                  </label>
                </div>
                <div className="radio board-type">
                  <label>
                    <input  type="radio"
                            value={ true }
                            onChange={ this.handleChange.bind(this, 'isPrivate') } />
                    Privado
                  </label>
                </div>
              </form>
            </div>
            {
              this.state.isPrivate ? (
                <Select
                  name="form-field-name"
                  placeholder="Seleccioná los usuarios"
                  multi={ true }
                  simpleValue={ true }
                  disabled={ false }
                  options={ this.teamUsers() }
                  value={ this.state.users }
                  onChange={ this.handleSelectChange.bind(this) } />
              ) : ( null )
            }
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

    Meteor.call('Boards.methods.create', board, (error, response) => {
      if(error) {
        throw new Meteor.Error(error);
      } else {
        this.setState({
          name: '',
          isPrivate: false,
          users: [],
        });

        $('#createBoardModal').modal('hide');
      }
    });
  }
}

CreateBoardModal.propTypes = {
  team: React.PropTypes.object.isRequired,
};
