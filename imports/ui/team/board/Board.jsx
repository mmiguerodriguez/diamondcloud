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
          <span onClick={ this.props.getMessages.bind(null, { boardId: this.props.board._id }) }>
            <h4 className='message-text'>Chat del board</h4>
            <img  src='/img/sidebar/messages.svg'
                  title='Abrir chat del board'
                  className='message-icon'
                  width='28px'/>
          </span>
        </div>
        <div className='board'>
          { this.renderModules() }
        </div>
      </div>
    );
  }
  componentDidMount() {
    let self = this;

    $('.board').droppable({
      accept(e) {
        const validClasses = ['module-item', 'module-container'];
        let valid = false;

        validClasses.forEach((c) => (valid = e.hasClass(c) ? true : valid));
        return valid;
      },
      drop(event, ui) {
        let item = ui.draggable.hasClass('module-item');
        let container = ui.draggable.hasClass('module-container');

        if(item) {
          let boardId = self.props.board._id;
          let moduleId = ui.draggable.data('module-id');

          let x = ui.position.top - 40;
          let y = ui.position.left;

          if(x >= 0 && y >= 0) {
            Meteor.call('ModuleInstances.methods.create', {
              boardId,
              moduleId,
              x,
              y,
              width: 350, // must change to fixed
              height: 400, // must change to fixed
              data: { },
            }, (error, result) => {
              if(error) {
                throw new Meteor.Error(error);
              } else {
                console.log(result);
              }
            });
          } else {
            console.error('Can\'t create module on those coordinates.');
          }
        } else if(container) {
          let moduleInstanceId = ui.draggable.data('moduleinstance-id');

          let x = ui.position.top;
          let y = ui.position.left;

          if(x >= 0 && y >= 0) {
            Meteor.call('ModuleInstances.methods.edit', {
              moduleInstanceId,
              x,
              y,
            }, (error, result) => {
              if(error) {
                throw new Meteor.Error(error);
              } else {
                console.log(result);
              }
            });
          } else {
            console.error('Can\'t create module on those coordinates.');
          }
        }
      }
    });
  }
  renderModules() {
    let arr = [];

    if(this.props.moduleInstances) {
      this.props.moduleInstances.map((moduleInstance) => {

        let module = this.props.modules.find((module) => {
          return module._id = moduleInstance.moduleId;
        });

        arr.push(
          <ModuleInstance
            key={ moduleInstance._id }
            moduleInstance={ moduleInstance }
            moduleInstancesFrames={ this.props.moduleInstancesFrames }
            module={ module }
            boards={ this.props.boards }
            users={ this.props.users }
            openModuleInstanceContextMenu={ this.props.openModuleInstanceContextMenu }
            />
        );
      });
    }

    return arr;
  }
  renderUsers() {
    let arr = [];

    if(this.props.board.isPrivate) {
      this.props.board.users.map((_user) => {
        let user = Meteor.users.findOne(_user._id) || _user;
        arr.push(
          <img  key={ user._id || user.email }
            className='img-circle shared-people'
            src={ user.profile ? user.profile.picture : '/img/user-shape.svg' }
            alt={ user.profile ? user.profile.name : user.email }
            title={ user.profile ? user.profile.name : user.email }
            width='32px' />
        );
      });
    } else {
      this.props.users.map((_user) => {
        let user = Meteor.users.findOne({ 'emails.address': _user.email }) || _user;
        arr.push(
          <img  key={ user._id || user.email }
                className='img-circle shared-people'
                src={ user.profile ? user.profile.picture : '/img/user-shape.svg' }
                alt={ user.profile ? user.profile.name : user.email }
                title={ user.profile ? user.profile.name : user.email }
                width='32px' />
        );
      });
    }

    return arr;
  }
}

Board.propTypes = {
  boards: React.PropTypes.array.isRequired,
  board: React.PropTypes.object.isRequired,
  moduleInstances: React.PropTypes.array,
  moduleInstancesFrames: React.PropTypes.array,
  modules: React.PropTypes.array,
  users: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
  openModuleInstanceContextMenu: React.PropTypes.func.isRequired,
};
