import React from 'react';

/**
 * Renders error messages to tell user something
 * is wrong with their inputs, etc.
 */
class ErrorMessage extends React.Component {
  close() {
    let self = this;

    $('.error-message').removeClass('show-error');
    $('.error-message').addClass('hide-error', () => {
      setTimeout(self.props.hideError.bind(null), 700);
    });
  }

  constructor(props) {
    super(props);

    this.state = {};

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    setTimeout(this.close.bind(null), this.props.delay);
  }

  render() {
    return (
      <div className='error-message show-error'>
        <div className='error-body'>{this.props.body}</div>
        <div className='error-close' onClick={this.close}>Cerrar</div>
      </div>
    );
  }
}

export default ErrorMessage;
