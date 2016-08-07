import React from 'react';

import Collapsible  from '../Collapsible.jsx';
import BoardsLayout from './boards/BoardsLayout.jsx';
import UsersLayout  from './users/UsersLayout.jsx';

export default class ChatsCollapsible extends React.Component {
  render() {
    return (
      <Collapsible
        id={ 'chats-collapsible' }
        header={
          <div>
            <div  type="button"
                  className="close col-md-2"
                  onClick={ this.props.toggleCollapsible.bind(null, 'chats') }>
              <img src="/img/close-modal-icon.svg" width="18px" />
            </div>
            <h3 className="col-md-10 title">Chats</h3>
          </div>
        }
        body={
          <div></div>
        }
      />
    );
  }
}

ChatsCollapsible.propTypes = {
  boards: React.PropTypes.array.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
};
