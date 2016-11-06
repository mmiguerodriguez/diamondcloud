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

/*

Events
  - _id
  - title
  - description
  - startDate
  - endDate
  - isPrivate
  - boards (<=> isPrivate)
  - color

*/

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

class EventsList extends React.Component {
  constructor(props) {
    super(props);
  }
  
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
      currentTab: 'events',
      events: [],
      loading: true,
    };
    
    this.openCreateEvent = this.openCreateEvent.bind(this);
    this.closeCreateEvent = this.closeCreateEvent.bind(this);
  }

  componentDidMount() {
    const self = this;
    
    DiamondAPI.get({
      collection: 'events',
      filter: {
        
      },
      callback: (error, result) => {
        self.setState({
          events: result,
          loading: false,
        });
      },
    });
  }
  
  openCreateEvent() {
    this.setState({
      currentTab: 'create-event',
    });
  }
  
  closeCreateEvent() {
    this.setState({
      currentTab: 'events',
    });
  }
  
  render() {
    if (this.state.loading) {
      return (
        <div className="loading">
          <div className="loader" />
        </div>
      );
    }

    return (
      <div>
        {
          isCoordination(DiamondAPI.getCurrentBoard()) ?
          (
            this.state.currentTab === 'events' ?
            <button onClick={this.openCreateEvent}>Create event</button> :
            <button onClick={this.closeCreateEvent}>Back to events</button>
          ) :
          null
        }
        {
          this.state.currentTab === 'events' ?
          <EventsList
            events={this.state.events}
          /> :
          <CreateEventTab
            backFunction={this.closeCreateEvent}
          />
        }
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="*" component={Calendar} />
  </Router>,
  document.getElementById('render-target')
);
