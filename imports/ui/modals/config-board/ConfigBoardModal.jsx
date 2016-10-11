import React     from 'react';

import Modal     from '../Modal.jsx';
import {
  InputError,
  TextInput,
  SelectInput
}                from '../../validation/inputs.jsx';

export default class ConfigBoardModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        id={ 'configBoardModal' }
        header={
          <div>
            
          </div>
        }
        body={
          <div>
            
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
              data-dismiss='modal'>
              Guardar
            </button>
          </div>
        }
      />
    );
  }
}

ConfigBoardModal.propTypes = {
  
};