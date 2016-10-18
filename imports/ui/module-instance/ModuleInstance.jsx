import React           from 'react';

import { generateApi } from '../../api/api/api-client';

export default class ModuleInstance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: this.props.moduleInstance.x,
      y: this.props.moduleInstance.y,
      width: this.props.moduleInstance.width,
      height: this.props.moduleInstance.height,
      minimized: this.props.moduleInstance.minimized,
      loading: true,
    };
  }

  componentDidMount() {
    const DiamondAPI = generateApi(this.props.moduleInstance._id);

    this.iframe.onload = this.iframeLoaded.bind(this);
    this.iframe.contentWindow.DiamondAPI = DiamondAPI;
    this.props.moduleInstancesFrames.push(this.iframe.contentWindow);
  }

  componentDidUpdate() {
    if (this.props.moduleInstance.archived) {
      this.iframe.contentWindow.DiamondAPI.unsubscribe();
    }
  }

  iframeLoaded() {
    const self = this;

    $(this.module)
    .draggable({
      containment: 'parent',
      handle: '.module-pin',
      cursor: '-webkit-grabbing !important',
      cursorAt: { top: -6 },
      distance: 5,
      iframeFix: true,
    })
    .resizable({
      containment: 'parent',
      disabled: this.state.minimized,
      stop(event, ui) {
        const moduleInstanceId = self.props.moduleInstance._id;
        const { width, height } = ui.size;

        Meteor.call('ModuleInstances.methods.edit', {
          moduleInstanceId,
          width,
          height,
        }, (error, result) => {
          if (error) {
            console.error(error);
          }
        });
      },
    });

    this.setState({
      loading: false,
    });
  }

  toggleMinimize() {
    const moduleInstanceId = this.props.moduleInstance._id;
    const minimized = !this.props.moduleInstance.minimized;

    this.setState({
      minimized,
    }, () => {
      $(this.module).resizable('option', 'disabled', minimized);
    });

    Meteor.call('ModuleInstances.methods.edit', {
      moduleInstanceId,
      minimized,
    }, (error, result) => {
      if (error) {
        this.setState({
          minimized: !minimized,
        }, () => {
          console.error(error);
        });
      }
    });
  }

  render() {
    return (
      <div
        className="module-container"
        ref={(c) => { this.module = c; }}
        data-moduleinstance-id={this.props.moduleInstance._id}
        style={{
          top: this.props.moduleInstance.x,
          left: this.props.moduleInstance.y,
          width: this.props.moduleInstance.width,
          height: this.props.moduleInstance.height,
        }}
      >
        {
          this.state.loading && !this.state.minimized ? (
            <div>Cargando...</div>
          ) : (null)
        }
        {
          this.state.minimized ? (
            <span className="minimized-module-name">
              {this.props.module.name}
            </span>
          ) : (null)
        }
        {
          !this.state.loading || this.state.minimized ? (
            <div
              className="module-pin"
              role="button"
              onClick={this.toggleMinimize.bind(this)}
              onContextMenu={
                this.props.openModuleInstanceContextMenu.bind(null, this.props.moduleInstance._id, this.iframe)
              }
            >
              <img className="img" src={this.props.module.img} />
            </div>
          ) : (null)
        }
        <iframe
          className="module"
          ref={(c) => { this.iframe = c; }}
          src={`/modules/${this.props.moduleInstance.moduleId}/index.html`}
          style={{
            display: this.state.minimized || this.state.loading ? 'none' : 'block',
          }}
        />
      </div>
    );
  }
}

ModuleInstance.propTypes = {
  moduleInstance: React.PropTypes.object.isRequired,
  moduleInstancesFrames: React.PropTypes.array,
  module: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  users: React.PropTypes.array.isRequired,
  openModuleInstanceContextMenu: React.PropTypes.func.isRequired,
};
