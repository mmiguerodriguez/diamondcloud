import React from 'react';

import Modal from '../Modal.jsx';

export default class ConfigTeamModal extends React.Component {
  constructor(props) {
    super(props);
    // Sets state variables the first time
    // the component gets created
    this.state = {
      name: this.props.team.name,
      plan: this.props.team.plan,
      type: this.props.team.type,
    };
  }
  componentWillReceiveProps(props) {
    // Fixes issues when component receives
    // new props
    this.setState({
      name: props.team.name,
      plan: props.team.plan,
      type: props.team.type,
    });
  }
  render() {
    return (
      <Modal
        id={ 'configTeamModal' }
        header={
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <img src="img/close-modal-icon.svg" width="18px" />
            </button>
            <h4 className="modal-title">Configuración del equipo</h4>
          </div>
        }
        body={
          <div>
            <h4 className="configuration-title">Equipo</h4>
            <div className="row">
              <div className="name-input">
                <label  htmlFor="projectName"
                        className="col-xs-2 col-sm-offset-2 control-label left-align">
                  Nombre
                </label>
                <div className="col-xs-12 col-sm-6">
                  <input  id="projectName"
                          className="form-control"
                          placeholder="Nombre del proyecto"
                          type="text"
                          value={ this.state.name }
                          onChange={ this.handleChange.bind(this, 'name') }/>
                </div>
              </div>
              <div className="name-input">
                <label  htmlFor="projectType"
                        className="col-xs-2 col-sm-offset-2 control-label left-align">
                  Tipo
                </label>
                <div  id="otherProjectType"
                      className="col-xs-12 col-sm-6">
                  <input  id="projectType"
                          className="form-control"
                          placeholder="Tipo de proyecto"
                          type="text"
                          value={ this.state.type }
                          onChange={ this.handleChange.bind(this, 'type') }/>
                </div>
              </div>
            </div>
            <hr />
            <h4 className="configuration-title">Miembros</h4>
            <div className="row contacts-list-row">
              <div className="input-group col-sm-6 col-xs-12 col-sm-offset-3">
                <input  id="searchUsers"
                        className="form-control"
                        placeholder="Buscá entre los integrantes"
                        type="text"/>
                <div className="input-group-addon search-input">
                  <img src="img/search-people-icon.svg" width="20px" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="contacts-list col-sm-6 col-xs-12 col-sm-offset-3">
                <div className="row">
                  <div className="col-xs-1">
                    <img alt="User" src="//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOtt-yFL9aGQYz1k-cA0Am2Po4dKzi76pA/s96-c-mo/photo.jpg" className="navbar-photo contact-list-photo" />
                  </div>
                  <div className="col-xs-6">
                    <p className="contact-list-name">Gomito Gomez</p>
                  </div>
                  <div className="col-xs-3"></div>
                  <div className="col-xs-1">
                    <div className="close">
                      <img src="img/close-modal-icon.svg" width="16px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="input-group col-sm-6 col-xs-12 col-sm-offset-3">
                <input  id="shareTeam"
                        className="form-control"
                        placeholder="Compartir equipo"
                        type="text" />
                <div className="input-group-addon search-input">
                  <img src="img/add-people-icon.svg" width="20px" />
                </div>
              </div>
            </div>
            <hr />
            <h4 className="configuration-title">Plan</h4>
            <div className="row">
              <div className="col-sm-6 col-sm-offset-2 col-xs-12">
                <p>
                  Plan actual: { this.props.team.plan }
                  {
                    this.props.team.plan === 'free' ? (
                      <button type="button"
                              className="btn btn-add btn-upgrade">
                        Upgrade
                      </button>
                    ) : ( null )
                  }
                </p>
                <p>Personas: { this.props.team.users.length }</p>
                <p>Boards: { this.props.team.boards.length }/12</p>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="row">
            <button type="button"
                    className="btn btn-cancel btn-hover"
                    data-dismiss="modal">
              Cancelar
            </button>
            <button type="button"
                    className="btn btn-accept btn-hover"
                    data-dismiss="modal"
                    onClick={ this.saveTeam.bind(this) }>
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
    let teamId = this.props.team._id;
    let team = {
      ...this.state,
    };

    Meteor.call('Teams.methods.edit', { teamId, team }, (error, result) => {
      if(error) {
        throw new Meteor.Error(error);
      } else {
        // ... what shall we do?
      }
    });
  }
}

ConfigTeamModal.propTypes = {
  team: React.PropTypes.any,
}
