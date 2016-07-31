import React from 'react';

import Modal from '../Modal.jsx';

export default class CreateTeamModal extends React.Component {
  render() {
    return (
      <Modal 
        id={ 'configTeamModal' }
        header={
          <div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <img src="img/close-modal-icon.svg" width="18px" />
            </button>
            <h4 className="modal-title">Configuración del proyecto</h4>
          </div>
        }
        body={
          <div>
            <h4 style="margin-left: 0px;">Miembros</h4>
            <div class="row" style="margin-bottom: -1px;">
              <div class="input-group col-sm-6 col-xs-12 col-sm-offset-3">
                <input type="text" class="form-control" id="searchUsers" placeholder="Buscá entre los integrantes" />
                <div class="input-group-addon search-input"><img src="http://image0.flaticon.com/icons/svg/109/109164.svg" width="20px" /></div>
              </div>
            </div>
            <div class="row">
              <div class="contacts-list col-sm-6 col-xs-12 col-sm-offset-3">
                <div class="row">
                  <div class="col-xs-1">
                    <img alt="User" src="//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOtt-yFL9aGQYz1k-cA0Am2Po4dKzi76pA/s96-c-mo/photo.jpg" className="navbar-photo" />
                  </div>
                  <div class="col-xs-6">
                    <p style="margin-left: 25px; margin-top: 10px; margin-bottom: 10px;">Gomito Gomez</p>
                  </div>
                  <div class="col-xs-3">
                    <img alt="Enviar mensaje" style="margin-top: 10px; margin-bottom: 10px;" src="http://image0.flaticon.com/icons/svg/60/60697.svg" width="25px" />
                  </div>
                  <div class="col-xs-1">
                    <button type="button" class="close" aria-label="Close" style="margin-left: 15px; margin-top: 10px; margin-bottom: 10px;"><span aria-hidden="true">&times;</span></button>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div class="row">
              <div class="input-group col-sm-6 col-xs-12 col-sm-offset-3">
                <input type="text" class="form-control" id="searchUsers" placeholder="Compartir proyecto" />
                <div class="input-group-addon search-input"><img src="http://image0.flaticon.com/icons/svg/60/60807.svg" width="20px" /></div>
              </div>
            </div>
            <hr />
            <h4 style="margin-left: 10px;">Plan</h4>
            <div class="row">
              <div class="col-sm-6 col-sm-offset-2 col-xs-12">
                <p>Plan actual: Free <button type="button" class="btn btn-add btn-upgrade">Upgrade</button></p>
                <p>Personas: 10/50</p>
                <p>Branches: 4/12</p>
                <p>Módulos usados: <b style="color: red;">5/5</b></p>
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
                      className="btn btn-cancel btn-hover"
                      onClick="">
                Cancelar
              </button>
              <button type="button" 
                      className="btn btn-accept btn-hover"
                      onClick="">
                Aceptar
              </button>
            </div>
          </div>
        }
      />
    );
  }
  chosePlan(type) {
    console.log('Chose plan: ', type);
  }
}