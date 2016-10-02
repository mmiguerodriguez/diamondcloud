const {
  DiamondAPI,
  React,
  ReactDOM,
  ReactRouter,
  SimplePeer,
  classNames,
  navigator,
  URL,
} = window;
const {
  Router,
  Route,
  IndexRoute,
  browserHistory,
} = ReactRouter;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
if (getUserMedia) {
  getUserMedia = getUserMedia.bind(navigator);
}

browserHistory.push('/');

class VideoChatPage extends React.Component {
  constructor() {
    super();

    this.state = {
      user: {}, // Actual user object
      signal: {}, // Peer signal (another users' signals)
      usersList: [], // Users list containing a dictionary of <_id, signal>

      peer: null, // User peer

      myVideo: null, // User video
      videos: [], // Whole videos array

      callStatus: 'Nada', // Call status (not working)
    };

    // Auto-bind functions that need binding
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.getPoopData = this.getPoopData.bind(this);
  }
  render() {
    return (
      <div>
        <button onClick={ this.connect }>Connect</button>
        <button onClick={ this.disconnect }>Disconnect</button>
        <button onClick={ this.getPoopData }>Get signals</button>

        <button onClick={ this.initiate.bind(this, true) }>Initiator</button>
        <button onClick={ this.initiate.bind(this, false) }>Not initiator</button>

        <select
          id='users-list-select'
          value={ JSON.stringify(this.state.signal) }
          onChange={ this.handleChange.bind(this, 'signal') }>
          { this.renderUsersOptions() }
        </select>

        <Video
          id={ 'my-video' }
          options={
            {
              autoplay: 'true',
              muted: 'false',
              width: '250px',
              src: this.state.myVideo ? this.state.myVideo.src : '',
            }
          } />

        { this.renderVideos() }

        <p>{ this.state.callStatus }</p>
      </div>
    );
  }
  componentDidMount() {
    let self = this;

    // Set team and user data
    self.setState({
      user: DiamondAPI.getCurrentUser(),
      myVideo: {},
    });

    // Subscribe to users data and set signal to the first signal it finds
    DiamondAPI.subscribe({
      request: {
        collection: 'users',
        condition: {},
      },
      callback(error, result) {
        if (error) {
          console.log('There was an error getting users data', error);
        } else {
          let users = result.users;
          console.log('Got user data correctly', users);

          self.setState({
            usersList: users,
            signal: users[0].signal,
          });
        }
      }
    });
  }

  // Fake subscribe
  getPoopData() {
    let self = this;

    DiamondAPI.get({
      collection: 'users',
      filter: {},
      callback(error, users) {
        if (error) {
          console.log('Error getting user data', error);
        } else {
          console.log('Get poop data users', users);
          self.setState({
            signal: users[0].signal,
            usersList: users,
          });
        }
      }
    });
  }

  // Connects to another peer
  connect() {
    console.log('Connecting to...', this.state.signal);
    this.state.peer.signal(this.state.signal);
  }
  // Disconnects from peer
  disconnect() {
    this.state.peer.destroy(() => {
      console.log('On disconnect..');

      DiamondAPI.update({
        collection: 'users',
        filter: {
          _id: self.state.user._id,
        },
        updateQuery: {
          $unset: {
            _id: self.state.user._id,
          },
        },
        callback(error, result) {
          if (error) {
            console.log('Error closing cornnection (update)', error);
          } else {
            console.log('Updated users collection correctly');
          }
        }
      });
    });
  }
  // Adds peer to current connection
  addPeer({ src }) {
    let videos = this.state.videos;

    videos.push({
      id: 'random_id',
      src,
    });

    this.setState({
      videos,
    });
  }

  // Initiates peer and sets its callbacks
  // Ask for userMedia
  initiate(isInitiator) {
    let self = this;

    getUserMedia({ video: true, audio: true }, (stream) => {
      console.log('My stream (initialization)', stream);

      this.state.myVideo.src = window.URL.createObjectURL(stream);

      let peer = new SimplePeer({
        initiator: isInitiator,
        stream,
        trickle: false,
        config: {
          iceServers: [
            {
              url: 'stun:23.21.150.121',
            },
            {
              url: 'stun.l.google.com:19302',
            },
            {
              url: 'stun1.l.google.com:19302',
            },
            {
              url: 'stun2.l.google.com:19302',
            },
            {
              url: 'stun3.l.google.com:19302',
            },
            {
              url: 'stun4.l.google.com:19302',
            },
          ]
        }
      });

      peer.on('signal', (data) => {
        console.log('Received a signal', data);

        if (data.type === 'offer') {
          self.setState({
            callStatus: 'Atendeeeeeee',
          });
        } else if (data.type === 'answer') {
          self.setState({
            callStatus: 'Llamandoooooo',
          });
        }

        DiamondAPI.get({
          collection: 'users',
          filter: {
            _id: self.state.user._id,
          },
          callback(error, result) {
            if (error) {
              console.log('Error getting users', error);
            } else {
              if(result.length > 0) {
                console.log('User is inserted proceeding to update its collection');

                // Set flags so update works correctly
                data.$flags = {
                  insertAsPlainObject: true,
                };

                DiamondAPI.update({
                  collection: 'users',
                  filter: {
                    _id: self.state.user._id,
                  },
                  updateQuery: {
                    $set: {
                      signal: data,
                    },
                  },
                  callback(error, result) {
                    if (error) {
                      console.log('Error updating user signal', error);
                    } else {
                      console.log('Success updating user signal for id', self.state.user._id);
                    }
                  }
                });
              } else {
                console.log('User isn\'t inserted in the collection, inserting');

                DiamondAPI.insert({
                  collection: 'users',
                  obj: {
                    _id: self.state.user._id,
                    signal: data,
                  },
                  callback(error, success) {
                    if (error) {
                      console.log('Error inserting user signal', error);
                    } else {
                      console.log('Success inserting user signal', success);
                    }
                  }
                });
              }
            }
          }
        });
      });
      peer.on('data', (data) => {
        console.log('Received a message with data', data);
      });
      peer.on('stream', (stream) => {
        let src = URL.createObjectURL(stream);

        self.addPeer({ src });
      });

      peer.on('close', () => {
        console.log('Closed connection...'); // For some reason this never gets called
      });

      self.setState({
        peer,
      });
    }, (error) => {
      console.log('There was an error getting user media', error);
    });
  }

  // Renders videos
  renderVideos() {
    if(this.state.videos) {
      if(this.state.videos.length > 0) {
        return this.state.videos.map((video) => {
          return (
            <Video
              id={ video._id }
              options={{
                autoplay: true,
                muted: false,
                width: '',
                src: video.src
              }} />
          );
        });
      } else {
        return;
      }
    } else {
      return;
    }
  }
  // Renders <option>
  renderUsersOptions() {
    console.log('UsersList', this.state.usersList);
    if (this.state.usersList) {
      if (this.state.usersList.length > 0) {
        let users = DiamondAPI.getTeamData().users;

        return this.state.usersList.map((user) => {
          if(this.state.user._id !== user._id) {
            let user_name;
            users.forEach((_user) => {
              if(user._id === _user._id) {
                user_name = _user.profile.name;
              }
            });

            return (
              <option
                value={ JSON.stringify(user.signal) }>
                { user_name }
              </option>
            );
          } else {
            return;
          }
        });
      } else {
        return;
      }
    } else {
      return;
    }
  }
  // Handles <select> change
  handleChange(index, event) {
    let value = event.target.value;
    if (index === 'signal') {
      value = JSON.parse(value);
    }

    this.setState({
      [index]: value,
    });
  }
}

// Component to render a single <video> element
class Video extends React.Component {
  render() {
    return (
      <video
        id={ this.props.id }
        { ...this.props.options }></video>
    );
  }
}

// Render classes with router
ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ VideoChatPage }>
      <IndexRoute component={ VideoChatPage } />
    </Route>
  </Router>,
  document.getElementById('render-target')
);
