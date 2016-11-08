import { Meteor } from 'meteor/meteor';
import React      from 'react';

import Modal      from '../Modal';
import UsersList  from '../users-list/UsersList';
import {
  InputError,
  TextInput,
  SelectInput,
}                 from '../../validation/inputs';

export default class ConfigTeamModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.team.name,
    };

    this.close = this.close.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.saveTeam = this.saveTeam.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  close() {
    $('#configTeamModal').modal('hide');
  }

  handleChange(index, event) {
    this.setState({
      [index]: event.target.value,
    });
  }

  saveTeam() {
    const team = {
      ...this.state,
    };

    if (team.name !== '') {
      if (team.name.length >= 3) {
        Meteor.call('Teams.methods.edit', { teamId: this.props.team._id, team }, (error, result) => {
          if (error) {
            this.props.toggleError({
              type: 'show',
              body: 'Hubo un error al modificar los datos del equipo',
            });
          } else {
            this.close();
          }
        });
      } else {
        this.props.toggleError({
          type: 'show',
          body: 'El nombre del equipo debe tener 3 o más caracteres',
        });
      }
    } else {
      this.props.toggleError({
        type: 'show',
        body: 'El nombre del equipo no puede estar vacío',
      });
    }
  }

  addUser(user) {
    if (user.email !== '') {
      if (/\S+@\S+\.\S+/.test(user.email)) {
        if (user.email !== Meteor.user().email()) {
          if (!this.props.team.hasUser(user.email)) {
            if (user.hierarchy) {
              Meteor.call('Teams.methods.share', {
                teamId: this.props.team._id,
                email: user.email,
                hierarchy: user.hierarchy,
              }, (error, result) => {
                if (error) {
                  this.props.toggleError({
                    type: 'show',
                    body: 'Hubo un error interno al compartir el equipo',
                  });
                } else {
                  this.props.loadTeam(this.props.team._id);
                  // TODO: show success message
                }
              });
            } else {
              this.props.toggleError({
                type: 'show',
                body: 'No seleccionaste una jerarquía',
              });
            }
          } else {
            this.props.toggleError({
              type: 'show',
              body: 'El usuario ya está en el equipo',
            });
          }
        } else {
          this.props.toggleError({
            type: 'show',
            body: 'No podés compartirte el equipo a vos mismo',
          });
        }
      } else {
        this.props.toggleError({
          type: 'show',
          body: 'El email ingresado es inválido',
        });
      }
    } else {
      this.props.toggleError({
        type: 'show',
        body: 'El email no puede estar vacío',
      });
    }
  }

  removeUser(user) {
    Meteor.call('Teams.methods.removeUser', { teamId: this.props.team._id, email: user }, (error, result) => {
      if (error) {
        this.props.toggleError({
          type: 'show',
          body: 'Hubo un error interno al eliminar al usuario',
        });
      } else {
        this.props.loadTeam(this.props.team._id);
      }
    });
  }

  render() {
    return (
      <Modal
        id={'configTeamModal'}
        header={
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <img src="/img/close-icon.svg" width="18px" />
            </button>
            <h4 className="modal-title">Configuración de {this.props.team.name}</h4>
          </div>
        }
        body={
          <div>
            { /* <h4 className="configuration-title">{this.props.team.name}</h4>
            <div className="row">
              <div className="name-input">
                <label
                  htmlFor="projectName"
                  className="col-xs-2 control-label left-align"
                >
                  Nombre
                </label>
                <div className="col-xs-12 col-sm-10">
                  <TextInput
                    id="projectName"
                    class="form-control"
                    placeholder="Nombre del equipo"
                    value={this.state.name}
                    minCharacters={3}
                    onChange={e => this.handleChange('name', e)}
                    errorMessage="El nombre no es válido"
                    emptyMessage="Es obligatorio poner un nombre"
                    minCharactersMessage="El nombre debe tener 3 o más caracteres"
                    required
                  />
                </div>
              </div>
            </div> */ }
            <h4 className="configuration-title">Miembros</h4>
            <p className="explanation-text margin">Agregue miembros al equipo.</p>
            <UsersList
              team={this.props.team}
              addUser={this.addUser}
              removeUser={this.removeUser}
              toggleError={this.props.toggleError}
            />
          </div>
        }
        footer={
          <div className="row">
            <button
              type="button"
              className="btn btn-cancel btn-hover"
              data-dismiss="modal"
              data-ripple="rgba(0,0,0, 0.3)"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-accept btn-hover"
              data-ripple="rgba(0,0,0, 0.3)"
              onClick={this.close}
            >
              Guardar
            </button>
          </div>
        }
      />
    );
  }
}

ConfigTeamModal.propTypes = {
  team: React.PropTypes.any.isRequired,
  loadTeam: React.PropTypes.func.isRequired,
  toggleError: React.PropTypes.func.isRequired,
};
