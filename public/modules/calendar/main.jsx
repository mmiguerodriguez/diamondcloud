const {
  DiamondAPI,
  React,
  ReactDOM,
  ReactRouter,
  classNames,
  $,
} = window;

const {
  Router,
  Route,
  browserHistory,
} = ReactRouter;

const ERROR_DELAY = 5000;

browserHistory.push('/view'); // initialize the router

// Do NOT change function to ES6
Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const isCoordination = (board) => {
  return (
    board.type === 'coordinadores' ||
    board.type === 'directores creativos' ||
    board.type === 'directores de cuentas'
  );
};

class View extends React.Component {
  getEvents() {
    return this.props.events.map((event) => {
      return (
        <li>{event.title}: {event.description}</li>
      );
    });
  }

  render() {
    return (
      <ul>
        {this.getEvents()}
      </ul>
    );
  }
}

class CreateEventTab extends React.Component {
  handleChange(index, event) {
    let value = event.target.value;

    this.setState({
      [index]: value,
    });
  }

  handleRadio(index, event) {
    let value = event.target.value;

    this.setState({
      isPrivate: index === 'private',
    });
  }

  createEvent() {
    console.log(this.state.isPrivate);

    DiamondAPI.insert({
      collection: 'events',
      object: {
        title: this.state.title,
        description: this.state.description,
        isPrivate: this.state.isPrivate,
        startDate: (new Date()).addDays(3),
        endDate: (new Date()).addDays(4),
      },
      isGlobal: true,
      callback: (err, res) => {
        this.props.backFunction();
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      isPrivate: false,
    };

    this.createEvent = this.createEvent.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div>
        <input
          id="create-event-title"
          className="form-control"
          value={this.state.title}
          placeholder="Título"
          onChange={this.handleChange.bind(null, 'title')}
        />
        <input
          id="create-event-description"
          className="form-control"
          value={this.state.description}
          placeholder="Descripción"
          onChange={this.handleChange.bind(null, 'description')}
        />
        <input
          defaultChecked={true}
          type="radio"
          name="isPrivate"
          value="public"
          onChange={e => this.handleRadio('public', e)}
        />
        Público
        <input
          type="radio"
          name="isPrivate"
          value="private"
          onChange={e => this.handleRadio('private', e)}
        />
        Privado
        <button onClick={this.createEvent}>Create event</button>
      </div>
    );
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {
        type: '',
        body: '',
        delay: '',
        showing: false,
      },
    };

    this.error = this.error.bind(this);
  }

  error({ type = 'show', body = 'Ha ocurrido un error', delay = ERROR_DELAY }) {
    console.log(type, body);
    this.setState({
      error: {
        body,
        delay: delay || ERROR_DELAY,
        showing: type === 'show',
      },
    });
  }

  render() {
    return (
      <div>
        {
          React.cloneElement(this.props.children, {
            error: this.error,
          })
        }
        {
          this.state.error.showing ? (
            <ErrorMessage
              error={this.error}
              {...this.state.error}
            />
          ) : (null)
        }
      </div>
    );
  }
}

Calendar.propTypes = {
  children: React.PropTypes.node,
};

/**
 * In case of error show this component.
 */
class ErrorMessage extends React.Component {
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
      setTimeout(self.props.error.bind(null, { type: 'hide' }), 700);
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

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Calendar}>
      <Route path="view" component={View} />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
