import React           from 'react';

import { generateAPI } from '../../api/api/api-client';

const PIN_HEIGHT = 16;

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
      zIndex: 0,
    };

    this.iframeLoaded = this.iframeLoaded.bind(this);
    this.toggleMinimize = this.toggleMinimize.bind(this);
  }

  componentDidMount() {
    const DiamondAPI = generateAPI(this.props.moduleInstance._id);

    this.iframe.onload = this.iframeLoaded;
    this.iframe.contentWindow.DiamondAPI = DiamondAPI;
    this.props.moduleInstancesFrames.push(this.iframe.contentWindow);
  }

  iframeLoaded() {
    const self = this;

    this.iframe.contentWindow.document.body.onclick = () => {
      self.setState({
        zIndex: self.props.changeState(),
      });
    };

    $(this.module)
    .draggable({
      containment: 'parent',
      handle: '.module-pin',
      cursor: '-webkit-grabbing !important',
      cursorAt: {
        top: -6,
      },
      distance: 5,
      iframeFix: true,
      start() {
        self.setState({
          zIndex: self.props.changeState(),
        });
      },
    })
    .resizable({
      containment: 'parent',
      disabled: this.state.minimized,
      minWidth: this.props.module.settings.minWidth,
      minHeight: this.props.module.settings.minHeight,
      start(event, ui) {
        ui.element.append(
          $('<div />', {
            id: 'iframe-helper',
            css: {
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              'z-index': 10,
            },
          })
        );

        self.setState({
          zIndex: self.props.changeState(),
        });
      },
      stop(event, ui) {
        $('#iframe-helper', ui.element).remove();

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
      resize(event, ui) {
        const $board = $('.board');
        const paddingRight = $board.width() - (ui.position.left + ui.size.width);
        const paddingBottom = $board.height() - (PIN_HEIGHT + ui.position.top + ui.size.height);

        $(self.module)
        .width(ui.size.width)
        .height(ui.size.height);

        $('#iframe-helper', ui.element)
        .width(ui.size.width)
        .height(ui.size.height)
        .css('padding-right', paddingRight)
        .css('padding-bottom', paddingBottom);
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
    const moduleStyle = {
      top: this.props.moduleInstance.x,
      left: this.props.moduleInstance.y,
      width: this.props.moduleInstance.width,
      height: this.props.moduleInstance.height,
      marginTop: PIN_HEIGHT,
      zIndex: this.state.zIndex,
    };

    const dev = process.env.NODE_ENV === 'development';
    const url = dev ? (
      `/modules/${this.props.moduleInstance.moduleId}/dev/index.html`
    ) : (
      `/modules/${this.props.moduleInstance.moduleId}/public/index.html`
    );

    return (
      <div
        className="module-container"
        style={moduleStyle}
        ref={(c) => { this.module = c; }}
        data-moduleinstance-id={this.props.moduleInstance._id}
      >
        {
          this.state.loading && !this.state.minimized ? (
            <div className="loading">
              <div className="loader" />
            </div>
          ) : (null)
        }
        {
          !this.state.loading || this.state.minimized ? (
            <div
              className="module-pin"
              role="button"
              onClick={this.toggleMinimize}
              onContextMenu={
                this.props.openModuleInstanceContextMenu.bind(
                  null,
                  this.props.moduleInstance._id,
                  this.iframe
                )
              }
            >
              <img className="img" src={`${this.props.module.path}/image.png`} />
            </div>
          ) : (null)
        }
        <iframe
          className="module"
          ref={(c) => { this.iframe = c; }}
          src={url}
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
  changeState: React.PropTypes.func.isRequired,
  openModuleInstanceContextMenu: React.PropTypes.func.isRequired,
};
