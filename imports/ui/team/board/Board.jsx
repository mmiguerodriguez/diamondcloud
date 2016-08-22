import React          from 'react';

import ModuleInstance from '../../module-instance/ModuleInstance.jsx';

export default class Board extends React.Component {
  render() {
    return (
      <div className='board-container'>
        <div className='sub-header'>
          <div className='sub-header-data'>
            <h4 className='title'>{ this.props.board.name }</h4>
            <h4 className='members'>
              Miembros:
              { this.renderUsers() }
            </h4>
          </div>
          <span>
            <img  src='/img/sidebar/messages.svg'
                  className='message-icon'
                  width='28px'
                  onClick={ this.props.getMessages.bind(null, { boardId: this.props.board._id }) }/>
          </span>
        </div>
        <div className='board'>
          { this.renderModules() }
        </div>
      </div>
    );
  }
  componentDidMount() {
    $('.board').droppable({
      accept: '.module-item',
      drop: (event, ui) => {
        let moduleId = $($(ui.draggable[0])).data('module-id');

        Meteor.call('ModuleInstances.methods.create', {
          moduleId,
          x: ui.position.top - 40,
          y: ui.position.left,
          width: 350, // must change to fixed
          height: 400, // must change to fixed
          vars: { },
        }, (error, result) => {
          if(error) {
            throw new Meteor.Error(error);
          } else {
            console.log(result);
          }
        });
      }
    });
  }
  renderModules() {
    let arr = [];

    if(this.props.moduleInstances) {
      this.props.moduleInstances.map((moduleInstance) => {
        arr.push(
          <ModuleInstance
            key={ moduleInstance._id }
            moduleInstance={ moduleInstance } />
        );
      });
    }

    return arr;
  }
  renderUsers() {
    let arr = [];

    if(this.props.board.isPrivate) {
      this.props.board.users.map((_user) => {
        let user = Meteor.users.findOne(_user._id);
        arr.push(
          <img  key={ user._id }
            className='img-circle shared-people'
            src={ user.profile.picture }
            alt={ user.profile.name }
            title={ user.profile.name }
            width='32px' />
        );
      });
    } else {
      this.props.users.map((_user) => {
        let user = Meteor.users.findOne({ 'emails.address': _user.email });
        arr.push(
          <img  key={ user._id }
                className='img-circle shared-people'
                src={ user.profile.picture }
                alt={ user.profile.name }
                title={ user.profile.name }
                width='32px' />
        );
      });
    }

    return arr;
  }
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
  moduleInstances: React.PropTypes.array,
  users: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
