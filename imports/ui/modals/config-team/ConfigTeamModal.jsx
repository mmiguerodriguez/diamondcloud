import React from 'react';

import Modal from '../Modal.jsx';

export default class ConfigTeamModal extends React.Component {
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
            <h4>Miembros</h4>
            <div className="row contacts-list-row">
              <div className="input-group col-sm-6 col-xs-12 col-sm-offset-3">
                <input type="text" className="form-control" id="searchUsers" placeholder="Buscá entre los integrantes" />
                <div className="input-group-addon search-input"><img src="http://image0.flaticon.com/icons/svg/109/109164.svg" width="20px" /></div>
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
                  <div className="col-xs-3">
                    <img alt="Enviar mensaje" src="http://image0.flaticon.com/icons/svg/60/60697.svg" width="25px" className="send-message-icon" />
                  </div>
                  <div className="col-xs-1">
                    <div className="close">
                      <img src="http://image.flaticon.com/icons/svg/61/61155.svg" width="15px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="input-group col-sm-6 col-xs-12 col-sm-offset-3">
                <input type="text" className="form-control" id="searchUsers" placeholder="Compartir proyecto" />
                <div className="input-group-addon search-input"><img src="http://image0.flaticon.com/icons/svg/60/60807.svg" width="20px" /></div>
              </div>
            </div>
            <hr />
            <h4>Plan</h4>
            <div className="row">
              <div className="col-sm-6 col-sm-offset-2 col-xs-12">
                <p>Plan actual: Free <button type="button" className="btn btn-add btn-upgrade">Upgrade</button></p>
                <p>Personas: 10</p>
                <p>Boards: 4/12</p>
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
