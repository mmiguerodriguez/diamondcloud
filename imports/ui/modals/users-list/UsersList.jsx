import React from 'react';

import User from './user/User.jsx';

export default class UsersList extends React.Component {
  render() {
    return (
      <div className="row contacts-list-row">
        <div className="contacts-list col-sm-6 col-xs-12 col-sm-offset-3">
          { this.renderUsers() }
        </div>
      </div>
    );
  }

  renderUsers() {
    let arr = [];
    let users = [
      {
        _id: '1',
        name: 'Pepe peposo',
        picture: 'https://lh6.googleusercontent.com/-Y7bDHBt36fI/AAAAAAAAAAI/AAAAAAAAAAw/d8VMfHZ1LbU/photo.jpg',
      },
      {
        _id: '2',
        name: 'Pepe peposo',
        picture: 'https://lh6.googleusercontent.com/-Y7bDHBt36fI/AAAAAAAAAAI/AAAAAAAAAAw/d8VMfHZ1LbU/photo.jpg',
      },
      {
        _id: '3',
        name: 'Pepe leproso',
        picture: 'https://lh6.googleusercontent.com/-Y7bDHBt36fI/AAAAAAAAAAI/AAAAAAAAAAw/d8VMfHZ1LbU/photo.jpg',
      }
    ];

    users.map((user) => {
      arr.push(<User key={ user._id } user={ user } />);
    });

    return arr;
  }
}

UsersList.propTypes = {
  users: React.PropTypes.array.isRequired,
};
