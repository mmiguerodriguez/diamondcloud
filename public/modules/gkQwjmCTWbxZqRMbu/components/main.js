const { DiamondAPI, SimplePeer, navigator } = window;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

if (getUserMedia) {
  getUserMedia = getUserMedia.bind(navigator);
}

var user = DiamondAPI.getCurrentUser();
var users = DiamondAPI.getTeamData().users;

function initiate(initiator) {
  getUserMedia({ video: true, audio: true }, (stream) => {
    console.log('My stream (initialization)', stream);

    let video = document.getElementById('my-video');
    video.src = window.URL.createObjectURL(stream);

    var peer = new SimplePeer({
      initiator,
      stream,
      trickle: false,
    });

    document.getElementById('connect').addEventListener('click', (event) => {
      let otherId = JSON.parse(document.getElementById('otherId').value);
      peer.signal(otherId);

      console.log('Connected to another peer', otherId);
    });
    document.getElementById('disconnect').addEventListener('click', (event) => {
      console.log('Disconnecting...');
      peer.destroy();
      
      video.src = '';
    });
    
    /* Messages (won't use for now)
    document.getElementById('send').addEventListener('click', (event) => {
      let message = document.getElementById('yourMessage').value;
      peer.send(message);

      console.log('Sent message', message);
    });
    peer.on('data', (data) => {
      console.log('Received data', data);
      document.getElementById('messages').textContent += data + '\n';
    });
    End messages */
    
    peer.on('signal', (data) => {
      console.log('Received a signal', data);

      DiamondAPI.get({
        collection: 'users',
        filter: {
          '_id': user._id,
        },
        callback(error, result) {
          if (error) {
            console.log('Error getting users', error);
          } else {
            if(result.length > 0) {
              DiamondAPI.update({
                collection: 'users',
                filter: {
                  _id: user._id,
                },
                updateQuery: {
                  $unset: {
                    _id: "5e5pFqhaKa7gvj8Sz",
                  },
                },
                callback(error, result) {
                  if (error) {
                    console.log('Error updating users', error);
                  } else {
                    console.log('Success removing user with ', user._id, ' id');
                  }
                }
              });
            }
          }
        }
      });

      DiamondAPI.insert({
        collection: 'users',
        obj: {
          _id: user._id,
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

      document.getElementById('yourId').value = JSON.stringify(data);
    });

    peer.on('close', () => {
      console.log('Closed connection');
      
      DiamondAPI.update({
        collection: 'users',
        filter: {
          _id: user._id,
        },
        updateQuery: {
          $unset: {
            _id: user._id,
          },
        },
        callback(error, result) {
          if (error) {
            console.log('Error updating', error);
          } else {
            console.log('Updated users collection correctly');
          }
        }
      });
    });

    peer.on('stream', (stream) => {
      console.log('Streaming received', stream);
      let video = document.getElementById('their-video');
      video.src = window.URL.createObjectURL(stream);
    });

  }, (error) => {
    console.log(error);
  });
}

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
      
      let users_list = document.getElementById('users-list');
      users_list.innerHTML = '';
      
      users.forEach((user) => {
        users_list.innerHTML += `
          <option 
            value=${ JSON.stringify(user.signal) }>
            ${ user._id }
          </option>`;
      });
    }
  }
});


