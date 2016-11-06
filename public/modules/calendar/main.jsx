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
        <li>{event.name}</li>
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

  createEvent() {
    alert(this.state.title, this.state.description);
  }

  constructor(props) {
    super(props);
    
    this.state = {
      title: '',
      description: '',
    };
    
    this.createEvent = this.createEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div>
        <input
          id="create-event-title"
          className="form-control"
          value={this.state.title}
          onChange={this.handleChange.bind(null, 'title')}
        />
        <input
          id="create-event-description"
          className="form-control"
          value={this.state.description}
          onChange={this.handleChange.bind(null, 'description')}
        />
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
          <button onClick={this.openCreateEvent}>Create event</button> : null
        }
        {
          this.state.currentTab === 'events' ?
          <EventsList
            events={this.state.events}
          /> :
          <CreateEventTab/>
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
