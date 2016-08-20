import React from 'react';

export default class Modal extends React.Component {
  render() {
    return (
      <div className='modal fade' id={ this.props.id } tabIndex='-1' role='dialog'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              { this.props.header }
            </div>
            <div className='modal-body'>
              { this.props.body }
            </div>
            <div className='modal-footer'>
              { this.props.footer }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  id: React.PropTypes.string.isRequired,
  header: React.PropTypes.element.isRequired,
  body: React.PropTypes.element.isRequired,
  footer: React.PropTypes.element.isRequired,
};
