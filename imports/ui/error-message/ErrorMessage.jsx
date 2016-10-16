import React from 'react';

export default class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    setTimeout(this.close.bind(null), this.props.delay);
  }

  close() {
    const self = this;

    $('.error-message').removeClass('show-error');
    $('.error-message').addClass('hide-error', () => {
      setTimeout(self.props.error.bind(null, 'hide'), 700);
    });
  }

  render() {
    return (
      <div className="error-message show-error">
        <div className="error-body">{this.props.body}</div>
        <div className="error-close" onClick={this.close}>Cerrar</div>
      </div>
    );
  }
}

ErrorMessage.propTypes = {
  body: React.PropTypes.string.isRequired,
  delay: React.PropTypes.number.isRequired,
  showing: React.PropTypes.bool.isRequired,
};
