import { Meteor }     from 'meteor/meteor';
import React          from 'react';
import classNames     from 'classnames';

import { Modules }    from '../../../api/modules/modules';
import ModuleInstance from '../../module-instance/ModuleInstance';

const MAX_MODULE_INSTANCES = 8;

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleForDirectors: this.props.board.visibleForDirectors,
      zIndexs: {},
    };

    this.toggleBoardToDirectors = this.toggleBoardToDirectors.bind(this);
  }

  componentDidMount() {
    const self = this;

    $(this.board).droppable({
      accept(e) {
        const validClasses = ['module-item', 'module-container'];
        let valid = false;

        validClasses.forEach(c => (valid = e.hasClass(c) ? true : valid));
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

          if (self.props.moduleInstances.length < MAX_MODULE_INSTANCES) {
            if (x >= 0 && y >= 0) {
              Meteor.call('ModuleInstances.methods.create', {
                boardId,
                moduleId,
                x,
                y,
                width: Modules.findOne(moduleId).settings.width,
                height: Modules.findOne(moduleId).settings.height,
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
          } else {
            self.props.toggleError({
              type: 'show',
              body: `No se pueden crear más módulos (máximo ${MAX_MODULE_INSTANCES})`,
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

  getMaxZIndex() {
    let maxZIndex = 0;

    for (const i in this.state.zIndexs) {
      if (this.state.zIndexs[i] > maxZIndex) {
        maxZIndex = this.state.zIndexs[i];
      }
    }

    return maxZIndex;
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
          body: 'Hubo un error interno al cambiar el estado del pizarrón',
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
            data-toggle="tooltip"
            data-placement="bottom"
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
            data-toggle="tooltip"
            data-placement="bottom"
            width="32px"
          />
        );
      });
    }
  }

  renderModules() {
    if (this.props.moduleInstances) {
      return this.props.moduleInstances.map((moduleInstance) => {
        const module = Modules.findOne(moduleInstance.moduleId);

        const changeState = () => {
          const obj = this.state.zIndexs;
          obj[moduleInstance._id] = this.getMaxZIndex() + 1;

          this.setState({
            zIndexs: obj,
          });

          return this.getMaxZIndex();
        };

        return (
          <ModuleInstance
            key={moduleInstance._id}
            moduleInstance={moduleInstance}
            moduleInstancesFrames={this.props.moduleInstancesFrames}
            module={module}
            boards={this.props.boards}
            users={this.props.users}
            changeState={changeState}
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
    const email = Meteor.user().email();

    return (
      <div className={classes}>
        <div className="sub-header">
          <div className="sub-header-data col-xs-5 col-md-6">
            <ol className="breadcrumb truncate">
              <li>
                <a href="#">{this.props.team.name}</a>
              </li>
              <li className="active">{this.props.board.name}</li>
            </ol>
          </div>
          <div className="col-xs-7 col-md-6 right-data truncate">
            <h4 className="members truncate">
              {this.renderUsers()}
            </h4>
            {
              this.props.board.isPrivate &&
              !this.props.team.userIsCertainHierarchy(email, 'director creativo') &&
              !this.props.team.userIsCertainHierarchy(email, 'director de cuentas') &&
              !this.props.team.userIsCertainHierarchy(email, 'coordinador') &&
              this.props.board.type === 'creativos' ? (
                <div className="visibility">
                  <label 
                    className="switch"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Cambiar visibilidad de directores"
                  >
                    <input
                      id="visible-input"
                      type="checkbox"
                      checked={this.state.visibleForDirectors ? true : false}
                      onChange={() => this.toggleBoardToDirectors(this.state.visibleForDirectors ? 'lockBoard' : 'unlockBoard')}
                    />
                    <div className="slider round" />
                  </label>
                </div>
              ) : (null)
            }
            <span
              className="message-icon-span"
              onClick={this.props.addChat.bind(null, { boardId: this.props.board._id })}
            >
              <img
                src="/img/sidebar/messages.svg"
                title="Abrir chat del board"
                data-toggle="tooltip"
                data-placement="bottom"
                className="message-icon"
                width="28px"
              />
            </span>
          </div>
        </div>
        <div className="board" ref={(c) => { this.board = c; }}>
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
