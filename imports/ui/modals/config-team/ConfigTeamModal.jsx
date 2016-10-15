import React     from 'react';

import Modal     from '../Modal.jsx';
import UsersList from '../users-list/UsersList.jsx';
import {
  InputError,
  TextInput,
  SelectInput
}                from '../../validation/inputs.jsx';

export default class ConfigTeamModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.team.name,
      plan: this.props.team.plan,
      type: this.props.team.type,
    };

    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.saveTeam = this.saveTeam.bind(this);
  }

  render() {
    return (
      <Modal
        id={ 'configTeamModal' }
        header={
          <div>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <img src='/img/close-icon.svg' width='18px' />
            </button>
            <h4 className='modal-title'>Configuración del equipo</h4>
          </div>
        }
        body={
          <div>
            <h4 className='configuration-title'>Equipo</h4>
            <p className='explanation-text margin'>Edite el nombre y tipo del equipo</p>
            <div className='row'>
              <div className='name-input'>
                <label  htmlFor='projectName'
                        className='col-xs-2 control-label left-align'>
                  Nombre
                </label>
                <div className='col-xs-12 col-sm-10'>
                  <TextInput
                    id='projectName'
                    class='form-control'
                    placeholder='Nombre del equipo'
                    value={ this.state.name }
                    required={ true }
                    minCharacters={ 3 }
                    onChange={ this.handleChange.bind(this, 'name') }
                    errorMessage='El nombre no es válido'
                    emptyMessage='Es obligatorio poner un nombre'
                    minCharactersMessage='El nombre debe tener 3 o más caracteres'/>
                </div>
              </div>
              <div className='name-input'>
                <label  htmlFor='projectType'
                        className='col-xs-2 control-label left-align'>
                  Tipo
                </label>
                <div  id='otherProjectType'
                      className='col-xs-12 col-sm-10'>
                  <TextInput
                    id='projectType'
                    class='form-control'
                    placeholder='Tipo de equipo'
                    value={ this.state.type }
                    onChange={ this.handleChange.bind(this, 'type') }
                    required={ false }
                    errorMessage='El tipo de equipo no es válido'/>
                </div>
              </div>
            </div>
            <hr />
            <h4 className='configuration-title'>Miembros</h4>
            <p className='explanation-text margin'>Agregue miembros al equipo.</p>
            <UsersList
              team={ this.props.team }
              addUser={ this.addUser }
              removeUser={ this.removeUser } />
            <hr />
            <h4 className='configuration-title'>Plan</h4>
            <p className='explanation-text margin'>Visualize mas información de su proyecto</p>
            <div className='row'>
              <div className='col-xs-12'>
                <p>Plan actual: { this.props.team.plan }</p>
                <p>Personas: { this.props.team.users.length }</p>
                <p>Boards: { this.props.team.boards.length }/12</p>
              </div>
            </div>
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
              onClick={ this.saveTeam }>
              Guardar
            </button>
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
  saveTeam() {
    let team = {
      ...this.state,
    };

    Meteor.call('Teams.methods.edit', { teamId: this.props.team._id, team }, (error, result) => {
      if (error) {
        console.error(error);
      }
    });
  }

  addUser(user) {
    Meteor.call('Teams.methods.share', {
      teamId: this.props.team._id,
      email: user.email,
      hierarchy: user.hierarchy,
    }, (error, result) => {
      if (error) {
        console.error(error);
      }
      else {
        this.props.loadTeam(this.props.team._id);
        // todo: show success message
      }
    });
  }

  removeUser(user){
    Meteor.call('Teams.methods.removeUser', { teamId: this.props.team._id, email: user }, (error, result) => {
      if (error) {
        console.error(error);
      }
      else {
        this.props.loadTeam(this.props.team._id);
        // todo: show success message
      }
    });
  }
}

ConfigTeamModal.propTypes = {
  team: React.PropTypes.any.isRequired,
  loadTeam: React.PropTypes.func.isRequired,
};
