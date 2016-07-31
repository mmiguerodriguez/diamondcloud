import React from 'react';

import Modal from '../Modal.jsx';

export default class CreateTeamModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
    this.nextPage = this.nextPage.bind(this);
    this.backPage = this.backPage.bind(this);
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
                            type="text" />
                  </div>
                </div>
                <div className="name-input">
                  <label  htmlFor="projectDescription"
                          className="col-xs-2 col-sm-offset-2 control-label left-align">
                    Tipo
                  </label>
                  <div className="col-xs-12 col-sm-6">
                    <select id="projectDescription"
                            className="form-control"
                            placeholder="Tipo de proyecto">
                      <option disabled defaultValue>Tipo de proyecto</option>
                      <option value="Web">Web</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Diseño">Diseño</option>
                      <option value="Programación">Programación</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div  id="otherProjectDescription"
                      className="col-xs-12 col-sm-6 col-sm-offset-4 hidden">
                  <input  id="projectType"
                          className="form-control"
                          placeholder="Tipo de proyecto"
                          type="text" />
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
                  <button type="button"
                          className="btn btn-free col-xs-12"
                          onClick={ this.chosePlan.bind(this, 'free') }>
                    Elegir plan Free
                  </button>
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
                  <button type="button"
                          className="btn btn-premium col-xs-12"
                          onClick={ this.chosePlan.bind(this, 'premium') }>
                    Elegir plan Premium
                  </button>
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
              <div className="row contacts-list-row">
                <div className="contacts-list col-sm-6 col-xs-12 col-sm-offset-3">
                  <div className="row">
                    <div className="col-xs-1">
                      <img  className="contact-list-photo"
                            alt="User"
                            src="//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOtt-yFL9aGQYz1k-cA0Am2Po4dKzi76pA/s96-c-mo/photo.jpg" />
                    </div>
                    <div className="col-xs-6">
                      <p className="contact-list-name">Gomito Gomez</p>
                    </div>
                    <div className="col-xs-3">
                      <img  className="send-message-icon"
                            alt="Enviar mensaje"
                            src="img/send-message-icon.svg"
                            width="24px" />
                    </div>
                    <div className="col-xs-1">
                      <div className="close">
                        <img src="img/close-modal-icon.svg" width="16px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                      onClick={ this.backPage }>
                Atrás
              </button>
              <button type="button"
                      id="next-page-btn"
                      className="btn btn-accept btn-hover"
                      onClick={ this.nextPage }>
                Siguiente
              </button>
            </div>
          </div>
        }
      />
    );
  }
  componentDidMount() {
    $('#projectDescription').on('change', function() {
      let otherDescription = $(this).val() === 'Otro';
      let element = $('#otherProjectDescription');

      if(otherDescription) {
        element.removeClass('hidden');
      } else {
        if(!element.hasClass('hidden'))
          element.addClass('hidden');
      }
    });
  }
  chosePlan(type) {
    let other = type === 'free' ? 'premium' : 'free';
    $('.' + type).addClass(type + '-card-active');
    $('.' + other).removeClass(other + '-card-active');
  }
  backPage(){
    let page = this.state.page;
    if(page - 1 < 1) return;

    $('#create-team-page-' + (page - 1)).effect('slide', {
      direction: 'left',
      mode: 'show',
    }, 500);

    $('#create-team-page-' + page).hide();
    $('#actual-page').html(page - 1);
    $('#next-page-btn').html('Siguiente');

    this.setState({ page: page - 1 });
  }
  nextPage(){
    let page = this.state.page;
    if(page + 1 > 3) return;

    $('#create-team-page-' + (page + 1)).effect('slide', {
      direction: 'right',
      mode: 'show',
    }, 500);

    $('#create-team-page-' + page).hide();
    $('#actual-page').html(page + 1);

    if(page + 1 === 3) {
      $('#next-page-btn').html('Crear');
    } else {
      $('#next-page-btn').html('Siguiente');
    }
    this.setState({ page: page + 1 });
  }
}
