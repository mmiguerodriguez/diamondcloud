import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory } from 'react-router'

import Modal     from '../Modal.jsx';
import UsersList from '../users-list/UsersList.jsx';

export default class CreateTeamModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      name: '',
      plan: '',
      type: 'Web',
      usersEmails: [],
    };
  }
  render() {
    return (
      <Modal
        id={ 'createTeamModal' }
        header={
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <img src="img/close-modal-icon.svg" width="18px" />
            </button>
            <h4 className="modal-title">Crear Proyecto</h4>
          </div>
        }
        body={
          <div>
            <div  id="create-team-page-1"
                  className="name"
                  style={{ display: 'block' }}>
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
                            onChange={ this.handleChange.bind(this, 'name') } />
                  </div>
                </div>
                <div className="name-input">
                  <label  htmlFor="projectType"
                          className="col-xs-2 col-sm-offset-2 control-label left-align">
                    Tipo
                  </label>
                  <div className="col-xs-12 col-sm-6">
                    <select id="projectType"
                            className="form-control"
                            placeholder="Tipo de proyecto"
                            onChange={ this.handleChange.bind(this, 'type') }>
                      <option disabled defaultValue>Tipo de proyecto</option>
                      <option value="Web">Web</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Diseño">Diseño</option>
                      <option value="Programación">Programación</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div  id="otherProjectType"
                      className="col-xs-12 col-sm-6 col-sm-offset-4 hidden">
                  <input  id="projectType"
                          className="form-control"
                          placeholder="Tipo de proyecto"
                          type="text"
                          onChange={ this.handleChange.bind(this, 'type') } />
                </div>
              </div>
            </div>
            <div  id="create-team-page-2"
                  className="plan"
                  style={{ display: 'none' }}>
              <div className="row">
                <div className="free col-xs-5 col-xs-offset-1">
                  <div className="free-card">
                    <h3 className="plan-card-title">Free</h3>
                    <div className="row">
                      <ul>
                        <li>12 branches</li>
                        <li>5 módulos</li>
                        <li>200MB por proyecto</li>
                      </ul>
                    </div>
                  </div>
                  <div className="btn btn-free col-xs-12"
                          onClick={ this.chosePlan.bind(this, 'free') }>
                    Elegir plan Free
                  </div>
                </div>
                <div className="premium col-xs-5">
                  <div className="premium-card">
                    <h3 className="plan-card-title">Premium</h3>
                    <div className="row">
                      <ul>
                        <li>Infinitas branches</li>
                        <li>Módulos infinitos</li>
                        <li>Storage relativo a la contidad de usuarios</li>
                      </ul>
                    </div>
                    <br />
                    <div className="row premium-card-price">
                      <h4 className="premium-price">$2.99</h4>
                      <p>por usuario/mes</p>
                    </div>
                  </div>
                  <div className="btn btn-premium col-xs-12">
                    Próximamente...
                  </div>
                </div>
              </div>
            </div>
            <div  id="create-team-page-3"
                  className="share"
                  style={{ display: 'none' }}>
              <div className="row">
                <div className="input-group col-sm-6 col-xs-12 col-sm-offset-3">
                  <input  id="searchUsers"
                          className="form-control"
                          placeholder="Compartir proyecto"
                          type="text" />
                  <div className="input-group-addon search-input">
                    <img src="img/add-people-icon.svg"
                         width="24px" />
                  </div>
                </div>
              </div>
              <UsersList team={ undefined } />
            </div>
          </div>
        }
        footer={
          <div className="row">
            <div className="col-xs-1">
              <p className="create-modal-page">
                <span id="actual-page">1</span>
                <span>/3</span>
              </p>
            </div>
            <div className="col-xs-11">
              <button type="button"
                      id="back-page-btn"
                      className="btn btn-cancel btn-hover"
                      onClick={ this.backPage.bind(this) }>
                Atrás
              </button>
              <button type="button"
                      id="next-page-btn"
                      className="btn btn-accept btn-hover"
                      onClick={ this.nextPage.bind(this) }>
                Siguiente
              </button>
            </div>
          </div>
        }
      />
    );
  }
  componentDidMount() {
    $('#createTeamModal #projectType').on('change', function() {
      let element = $('#createTeamModal #otherProjectType');
      let otherDescription = $(this).val() === 'Otro';

      if(otherDescription) {
        element.removeClass('hidden');
      } else {
        if(!element.hasClass('hidden'))
          element.addClass('hidden');
      }
    });
  }
  handleChange(index, event) {
    this.setState({
      [index]: event.target.value,
    });
  }

  chosePlan(type) {
    let other = type === 'free' ? 'premium' : 'free';
    $('#createTeamModal .' + type).addClass(type + '-card-active');
    $('#createTeamModal .' + other).removeClass(other + '-card-active');

    this.setState({ plan: type });
  }
  backPage() {
    let page = this.state.page;
    if(page - 1 < 1) return;

    $('#createTeamModal #create-team-page-' + (page - 1)).effect('slide', {
      direction: 'left',
      mode: 'show',
    }, 500);

    $('#createTeamModal #create-team-page-' + page).hide();
    $('#createTeamModal #actual-page').html(page - 1);
    $('#createTeamModal #next-page-btn').html('Siguiente');

    this.setState({ page: page - 1 });
  }
  nextPage() {
    let page = this.state.page;
    if(page + 1 > 3) {
      this.createTeam();
      return;
    }

    $('#create-team-page-' + (page + 1)).effect('slide', {
      direction: 'right',
      mode: 'show',
    }, 500);

    $('#createTeamModal #create-team-page-' + page).hide();
    $('#createTeamModal #actual-page').html(page + 1);

    if(page + 1 === 3) {
      $('#createTeamModal #next-page-btn').html('Crear');
    } else {
      $('#createTeamModal #next-page-btn').html('Siguiente');
    }

    this.setState({ page: page + 1 });
  }

  createTeam() {
    let { name, plan, type, usersEmails } = this.state;
    type = type === 'Otro' ? $('#createTeamModal #otherProjectType').val() : type;

    $('#createTeamModal .contacts-list-row').each(function(index, item) {
      // let mail = ''; // Todo: Grab users emails
      // usersEmails.push(mail);
    });

    let form = { name, plan, type, usersEmails };
    Meteor.call('Teams.methods.create', form, (error, result) => {
      if (error) {
        throw new Meteor.Error(error);
      } else {
        $('#createTeamModal').modal('hide');
        browserHistory.push('/team/' + result._id);
      }
    });
  }
}
