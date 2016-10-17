import React          from 'react';
import classNames     from 'classnames';

import ModuleInstance from '../../module-instance/ModuleInstance';

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleForDirectors: this.props.board.visibleForDirectors,
    };

    this.toggleBoardToDirectors = this.toggleBoardToDirectors.bind(this);
  }

  componentDidMount() {
    const self = this;

    $('.board').droppable({
      accept(e) {
        const validClasses = ['module-item', 'module-container'];
        let valid = false;

        validClasses.forEach((c) => (valid = e.hasClass(c) ? true : valid));
        return valid;
      },
      drop(event, ui) {
        const item = ui.draggable.hasClass('module-item');
        const container = ui.draggable.hasClass('module-container');

        if (item) {
          const boardId = self.props.board._id;
          const moduleId = ui.draggable.data('module-id');

          const x = ui.position.top - 40;
          const y = ui.position.left;

          if (x >= 0 && y >= 0) {
            Meteor.call('ModuleInstances.methods.create', {
              boardId,
              moduleId,
              x,
              y,
              width: 350, // must change to fixed
              height: 400, // must change to fixed
            }, (error, result) => {
              if (error) {
                self.props.toggleError({
                  type: 'show',
                  body: 'Hubo un error interno al crear el módulo',
                });
              }
            });
          } else {
            self.props.toggleError({
              type: 'show',
              body: 'No se puede crear un módulo en esas coordenadas',
            });
          }
        } else if (container) {
          const moduleInstanceId = ui.draggable.data('moduleinstance-id');

          const x = ui.position.top;
          const y = ui.position.left;

          if (x >= 0 && y >= 0) {
            Meteor.call('ModuleInstances.methods.edit', {
              moduleInstanceId,
              x,
              y,
            }, (error, result) => {
              if (error) {
                self.props.toggleError({
                  type: 'show',
                  body: 'Hubo un error interno al crear el módulo',
                });
              }
            });
          } else {
            self.props.toggleError({
              type: 'show',
              body: 'No se puede crear un módulo en esas coordenadas',
            });
          }
        }
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.board.visibleForDirectors !== this.props.board.visibleForDirectors) {
      this.setState({
        visibleForDirectors: nextProps.board.visibleForDirectors,
      });
    }
  }

  toggleBoardToDirectors(methodName) {
    const self = this;

    this.setState({
      visibleForDirectors: methodName === 'unlockBoard',
    });

    Meteor.call(`Boards.methods.${methodName}`, {
      _id: this.props.board._id,
    }, (error, result) => {
      if (error) {
        self.props.toggleError({
          type: 'show',
          body: 'Hubo un error interno al cambiar el estado del board',
        });

        // If there was an error, reset state to the correct one.
        self.setState({
          visibleForDirectors: methodName === 'unlockBoard',
        });
      }
    });
  }

  renderUsers() {
    if (this.props.board.isPrivate) {
      return this.props.board.users.map((_user) => {
        const user = Meteor.users.findByEmail(_user.email, {}) || _user;

        return (
          <img
            key={user._id || _user.email}
            className="img-circle shared-people"
            src={user.profile ? `${user.profile.picture}?sz=60` : '/img/user-shape.jpg'}
            title={user.profile ? user.profile.name : _user.email}
            width="32px"
          />
        );
      });
    } else {
      return this.props.team.users.map((_user) => {
        const user = Meteor.users.findByEmail(_user.email, {}) || _user;

        return (
          <img
            key={user._id || _user.email}
            className="img-circle shared-people"
            src={user.profile ? `${user.profile.picture}?sz=60` : '/img/user-shape.jpg'}
            title={user.profile ? user.profile.name : user.email}
            width="32px"
          />
        );
      });
    }
  }

  renderModules() {
    if (this.props.moduleInstances) {
      return this.props.moduleInstances.map((moduleInstance) => {
        let module;
        this.props.modules.forEach((_module) => {
          if (_module._id === moduleInstance.moduleId) {
            module = _module;
          }
        });

        return (
          <ModuleInstance
            key={moduleInstance._id}
            moduleInstance={moduleInstance}
            moduleInstancesFrames={this.props.moduleInstancesFrames}
            module={module}
            boards={this.props.boards}
            users={this.props.users}
            openModuleInstanceContextMenu={this.props.openModuleInstanceContextMenu}
          />
        );
      });
    }

    return (null);
  }

  render() {
    const classes = classNames('board-container', {
      'permission-asker-opened': this.props.permissionAsker,
    });

    return (
      <div className={classes}>
        <div className="sub-header">
          <div className="sub-header-data col-xs-6">
            <ol className="breadcrumb truncate">
              <li>
                <a href="">{this.props.team.name}</a>
              </li>
              <li className="active">{this.props.board.name}</li>
            </ol>
            { /* <h4 className='title truncate'>{ this.props.board.name }</h4> */ }
          </div>
          <div className="col-xs-6 right-data">
            <h4 className="members truncate">
              {this.renderUsers()}
            </h4>
            <div className="visibility">
              {
                this.state.visibleForDirectors ? (
                  <img
                    role="button"
                    onClick={() => this.toggleBoardToDirectors('lockBoard')}
                    src="/img/visibility-off.svg"
                    className="visibility-img"
                    title="Hacer no visible para directores"
                    alt="Hacer no visible para directores"
                  />
                ) : (
                  <img
                    role="button"
                    onClick={() => this.toggleBoardToDirectors('unlockBoard')}
                    src="/img/visibility-on.svg"
                    className="visibility-img"
                    title="Hacer visible para directores"
                    alt="Hacer visible para directores"
                  />
                )
              }
            </div>
            <span
              className="message-icon-span"
              onClick={this.props.addChat.bind(null, {
                boardId: this.props.board._id
              })}
            >
              { /* <h4 className='message-text'>Chat del board</h4> */ }
              <img
                src="/img/sidebar/messages.svg"
                title="Abrir chat del board"
                className="message-icon"
                width="28px"
              />
            </span>
          </div>
        </div>
        <div className="board">
          {this.renderModules()}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  board: React.PropTypes.object.isRequired,
  moduleInstances: React.PropTypes.array,
  moduleInstancesFrames: React.PropTypes.array,
  modules: React.PropTypes.array,
  users: React.PropTypes.array.isRequired,
  addChat: React.PropTypes.func.isRequired,
  openModuleInstanceContextMenu: React.PropTypes.func.isRequired,
  permissionAsker: React.PropTypes.bool.isRequired,
  toggleError: React.PropTypes.func.isRequired,
};
