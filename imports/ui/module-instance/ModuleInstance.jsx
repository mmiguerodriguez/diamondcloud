import { generateApi }    from '../../api/api/api-client.js';

import React              from 'react';

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

    this.refs = {
      iframe: null,
      module: null,
    };
  }
  render() {
    if (this.props.loading) {
      return (
        <div>Cargando modulo :)</div>
      );
    }

    return (
      <div className='module-container'
           ref='module'
           data-moduleinstance-id={ this.props.moduleInstance._id }
           style={{
             top: this.props.moduleInstance.x,
             left: this.props.moduleInstance.y,
             width: this.props.moduleInstance.width,
             height: this.props.moduleInstance.height,
           }}>
        {
          /*
          this.state.minimized ? (
            <span className='minimized-module-name'>
              { this.props.module.img }
            </span>
          ) : ( null )
          */
        }
        {
          !this.state.loading || this.state.minimized ? (
            <div
              className='module-pin'
              role='button'
              onClick={ this.toggleMinimize.bind(this) }
              onContextMenu={ this.props.openModuleInstanceContextMenu.bind(null, this.props.moduleInstance._id, this.refs.iframe) }>
                <img className='img' src={ this.props.module.img } />
              </div>
          ) : ( null )
        }
        <iframe className='module'
                ref='iframe'
                src={ '/modules/' + this.props.moduleInstance.moduleId + '/index.html' }
                style={{
                  display: this.state.minimized ? 'none' : 'block',
                }}>
        </iframe>
      </div>
    );
  }

  componentDidMount() {
    let DiamondAPI = generateApi(this.props.moduleInstance._id);

    this.refs.iframe.onload = this.iframeLoaded.bind(this);
    this.refs.iframe.contentWindow.DiamondAPI = DiamondAPI;

    this.props.moduleInstancesFrames.push(this.refs.iframe.contentWindow);
  }
  componentDidUpdate() {
    if (this.props.moduleInstance.archived) {
      this.refs.iframe.contentWindow.DiamondAPI.unsubscribe();
    }
  }

  iframeLoaded() {
    let self = this;
    $(this.refs.module)
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
          let moduleInstanceId = self.props.moduleInstance._id;
          let { width, height } = ui.size;

          Meteor.call('ModuleInstances.methods.edit', {
            moduleInstanceId,
            width,
            height,
          }, (error, result) => {
            if (error) {
              console.error(error);
            }
          });
        }
      });

    this.setState({
      loading: false,
    });
  }

  toggleMinimize() {
    let moduleInstanceId = this.props.moduleInstance._id;
    let minimized = !this.props.moduleInstance.minimized;

    this.setState({
      minimized: minimized
    }, () => {
      $(this.refs.module).resizable('option', 'disabled', minimized);
    });

    Meteor.call('ModuleInstances.methods.edit', {
      moduleInstanceId,
      minimized,
    }, (error, result) => {
      if (error) {
        this.setState({
          minimized: !minimized
        }, () => {
          console.error(error);
        });
      } else {
        console.log(result);
      }
    });
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
