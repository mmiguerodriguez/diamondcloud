import { Meteor }         from 'meteor/meteor';
import React              from 'react';
import { browserHistory } from 'react-router';

import Modal              from '../Modal.jsx';
import UsersList          from '../users-list/UsersList.jsx';
import {
  InputError,
  TextInput,
  SelectInput
}                         from '../../validation/inputs.jsx';

export default class CreateTeamModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      name: '',
      plan: '',
      type: 'Web',
      otherType: '',
      usersEmails: [],
    };

    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.backPage = this.backPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  render() {
    return (
      <Modal
        id={ 'createTeamModal' }
        header={
          <div>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <img src='/img/close-icon.svg' width='18px' />
            </button>
            <h4 className='modal-title'>Crear equipo</h4>
          </div>
        }
        body={
          <div>
              <div  id='create-team-page-1'
                    className='name'
                    style={{ display: 'block' }}>
                <p className='explanation-text margin container-fluid'>Introducí el nombre y tipo del equipo.</p>
                <div className='row'>
                  <div className='name-input'>
                    <label  htmlFor='projectName'
                            className='col-xs-2 col-sm-offset-2 control-label left-align'>
                      Nombre
                    </label>
                    <div className='col-xs-12 col-sm-6'>
                      <TextInput
                        id='projectName'
                        class='form-control'
                        placeholder='Nombre del equipo'
                        required={ true }
                        minCharacters={ 3 }
                        onChange={ this.handleChange.bind(this, 'name') }
                        errorMessage='El nombre no es válido'
                        emptyMessage='Es obligatorio poner un nombre'
                        minCharactersMessage='El nombre debe tener 3 o más caracteres'/>
                    </div>
                  </div>
                  <div className='name-input'>
                    <label
                      htmlFor='projectType'
                      className='col-xs-2 col-sm-offset-2 control-label left-align'>
                      Tipo
                    </label>
                    <div className='col-xs-12 col-sm-6'>
                      <SelectInput
                        id='projectType'
                        class='form-control'
                        placeholder='Tipo de equipo'
                        onChange={this.handleChange.bind(this, 'type')}
                        options={
                          [
                            { isDefault: true, name: 'Tipo de equipo' },
                            { value: 'Web', name: 'Web' },
                            { value: 'Marketing', name: 'Marketing' },
                            { value: 'Diseño', name: 'Diseño' },
                            { value: 'Programación', name: 'Programación' },
                            { value: 'Otro', name: 'Otro' },
                          ]
                        }/>
                    </div>
                  </div>
                  {
                    this.state.type === 'Otro' ? (
                      <div
                        id='otherProjectType'
                        className='col-xs-12 col-sm-6 col-sm-offset-4'>
                        <TextInput
                          id='projectType'
                          class='form-control'
                          placeholder='Tipo de equipo'
                          onChange={ this.handleChange.bind(this, 'otherType') }
                          required={ false }
                          errorMessage='El tipo de proyecto no es válido'/>
                      </div>
                    ) : ( null )
                  }
                </div>
              </div>
              <div
                id='create-team-page-2'
                className='plan'
                style={{ display: 'none' }}>
                <p className='explanation-text margin container-fluid'>Elegí las funcionalidades que queres que tu equipo tenga disponible en Diamond Cloud</p>
                <div className='row'>
                  <div className='free col-xs-5 col-xs-offset-1'>
                    <div className='free-card'>
                      <h3 className='plan-card-title'>Free</h3>
                      <div className='row'>
                        <ul>
                          <li>12 branches</li>
                          <li>5 módulos</li>
                          <li>200MB por equipo</li>
                        </ul>
                      </div>
                    </div>
                    <div
                      className='btn btn-free col-xs-12'
                      onClick={ this.choosePlan.bind(this, 'free') }>
                      Elegir plan Free
                    </div>
                  </div>
                  <div className='premium col-xs-5'>
                    <div className="tag"><p>Proximamente...</p></div>
                    <div className='premium-card'>
                      <h3 className='plan-card-title'>Premium</h3>
                      <div className='row'>
                        <ul>
                          <li>Infinitas branches</li>
                          <li>Módulos infinitos</li>
                          <li>Storage relativo a la contidad de usuarios</li>
                        </ul>
                      </div>
                      <br />
                      <div className='row premium-card-price'>
                        <h4 className='premium-price'>$2.99</h4>
                        <p>por usuario/mes</p>
                      </div>
                    </div>
                    <div className='btn btn-premium col-xs-12'>
                      Próximamente...
                    </div>
                  </div>
                </div>
              </div>
              <div
                id='create-team-page-3'
                className='share'
                style={{ display: 'none' }}>
                <p className='explanation-text margin container-fluid'>Insertá un mail de Google de los miembros de tu equipo para poder trabajar colaborativamente. Si todavia no tienen cuenta en Diamond Cloud se le enviará un link al mail</p>
                <UsersList
                  usersEmails={ this.state.usersEmails }
                  addUser={ this.addUser }
                  removeUser={ this.removeUser } />
              </div>
          </div>
        }
        footer={
          <div className='row'>
            <div className='col-xs-1'>
              <p className='create-modal-page'>
                <span id='actual-page'>1</span>
                <span>/3</span>
              </p>
            </div>
            <div className='col-xs-11'>
              <button
                type='button'
                id='back-page-btn'
                className='btn btn-cancel btn-hover'
                onClick={ this.backPage }>
                Atrás
              </button>
              <button
                type='button'
                id='next-page-btn'
                className='btn btn-accept btn-hover'
                onClick={ this.nextPage }>
                Siguiente
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

  addUser(user) {
    let users = this.state.usersEmails;
    if (users.indexOf(user) === -1) {
      users.push(user);
      this.setState({
        usersEmails: users,
      });
    }
  }
  removeUser(user){
    let users = this.state.usersEmails;
    let index = users.indexOf(user);
    if (index !== -1) {
      users.splice(index, 1);
      this.setState({
        usersEmails: users,
      });
    }
  }

  choosePlan(type) {
    let other = type === 'free' ? 'premium' : 'free';
    $('#createTeamModal .' + type).addClass(type + '-card-active');
    $('#createTeamModal .' + other).removeClass(other + '-card-active');

    this.setState({ plan: type });
  }
  backPage() {
    let page = this.state.page;
    if (page - 1 < 1) return;

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
    if (page === 1){
      if ($('#projectName').val().length < 3) {
        this.errorBorder('#projectName');
        return;
      }
    } else if (page === 2) {
      if (this.state.plan !== 'free'){
        this.errorBorder('.btn-free');
        return;
      }
    }
    if (page + 1 > 3) {
      this.createTeam();
      return;
    }

    $('#createTeamModal #create-team-page-' + page).hide();
    $('#createTeamModal #create-team-page-' + (page + 1)).effect('slide', {
      direction: 'right',
      mode: 'show',
    }, 500);

    $('#createTeamModal #actual-page').html(page + 1);

    if (page + 1 === 3) {
      $('#createTeamModal #next-page-btn').html('Crear');
    } else {
      $('#createTeamModal #next-page-btn').html('Siguiente');
    }

    this.setState({ page: page + 1 });
  }

  createTeam() {
    let { name, plan, type, otherType, usersEmails } = this.state;
    type = type === 'Otro' ? otherType : type;

    let form = { name, plan, type, usersEmails };
    Meteor.call('Teams.methods.create', form, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        $('#createTeamModal').modal('hide');
        browserHistory.push('/team/' + result._id);
      }
    });
  }

  errorBorder(element) {
    $(element).css('transition', 'border-color 500ms');
    $(element).css('border-color', 'red');
    setTimeout(() => {
      $(element).css('border-color', '#ccc');
    }, 500);
  }
}
