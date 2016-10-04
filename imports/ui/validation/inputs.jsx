import React from 'react';
import classNames from 'classnames';

export class InputError extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Input is invalid'
    };
  }

  render() {
    var errorClass = classNames(this.props.className, {
      'error_container':   true,
      'visible':           this.props.visible,
      'invisible':         !this.props.visible
    });

    return (
      <div className={errorClass}>
        <span>{this.props.errorMessage}</span>
      </div>
    )
  }
}

InputError.propTypes = {
  className: React.PropTypes.string.isRequired,
  visible: React.PropTypes.bool.isRequired,
  errorMessage: React.PropTypes.string.isRequired,
};

export class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmpty: true,
      value: this.props.value || '',
      valid: false,
      errorMessage: "Input is invalid",
      errorVisible: false
    };
  }

  handleChange(event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  validation(value, valid) {
    //The valid variable is optional, and true if not passed in:
    if (typeof valid === 'undefined') {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      //This happens when the user leaves the field, but it is not valid
      //(we do final validation in the parent component, then pass the result
      //here for display)
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }
    else if (this.props.required && jQuery.isEmptyObject(value)) {
      //this happens when we have a required field with no text entered
      //in this case, we want the "emptyMessage" error message
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    }
    else if (value.length < this.props.minCharacters) {
      //This happens when the text entered is not the required length,
      //in which case we show the regular error message
      message = this.props.minCharactersMessage;
      valid = false;
      errorVisible = true;
    }

    //setting the state will update the display,
    //causing the error message to display if there is one.
    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible
    });
  }

  handleBlur(event) {
    let valid;
    //Complete final validation from parent element when complete
    if (this.props.validate){
      valid = this.props.validate(event.target.value);
    }
    //pass the result to the local validation element for displaying the error
    this.validation(event.target.value, valid);
  }

  render() {
    return (
      <div>
        <input
          id={this.props.id}
          placeholder={this.props.placeholder}
          className={this.props.class}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          value={this.state.value} />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
          className="error"/>
      </div>
    );
  }
}

TextInput.propTypes = {
  id: React.PropTypes.string,
  class: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
  required: React.PropTypes.bool,
  minCharacters: React.PropTypes.number,
  validate: React.PropTypes.func,
  onChange: React.PropTypes.func,
  errorMessage: React.PropTypes.string.isRequired,
  emptyMessage: React.PropTypes.string,
  minCharactersMessage: React.PropTypes.string,
};

export class SelectInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: false,
      errorMessage: 'Input is invalid',
      errorVisible: false,
    };
  }

  handleChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render() {
    let arr = [];
    this.props.options.forEach((option) => {
      if (option.isDefault){
        arr.push(
          <option key={option.name} disabled defaultValue>{option.name}</option>
        );
      }
      else {
        arr.push(
          <option key={option.name} value={option.value}>{option.name}</option>
        );
      }
    });
    return (
      <select
        id={this.props.id}
        className={this.props.class}
        placeholder={this.props.placeholder}
        required={this.props.required}
        onChange={this.handleChange.bind(this)}>
        {arr}
      </select>
    );
  }
}

SelectInput.propTypes = {
  id: React.PropTypes.string,
  class: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool,
  options: React.PropTypes.array.isRequired,//[{value, name}]
}
