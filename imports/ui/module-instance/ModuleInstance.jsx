import React              from 'react';
import { generateApi }    from '../../api/api/api-client.js';

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
          !this.state.loading ? (
            <div
              className='module-pin'
              role='button'
              onClick={ this.toggleMinimize.bind(this) }
              onContextMenu={ this.props.openModuleInstanceContextMenu.bind(null, this.props.moduleInstance._id) }></div>
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
    let DiamondAPI = generateApi({
      moduleInstanceId: this.props.moduleInstance._id,
      boards: this.props.boards,
      users: this.props.users,
    });

    this.refs.iframe.onload = this.iframeLoaded.bind(this);
    this.refs.iframe.contentWindow.DiamondAPI = DiamondAPI;
  }
  iframeLoaded() {
    $(this.refs.module)
      .draggable({
        containment: 'parent',
        handle: '.module-pin',
        cursor: 'pointer',
        cursorAt: { top: -6 },
        iframeFix: true,

        start(event, ui) {
          $('.trash').css('display', 'block');
        },
        stop(event, ui) {
          $('.trash').css('display', 'none');
        }
      })
      .resizable({
        containment: 'parent',

        stop(event, ui) {
          let moduleInstanceId = ui.helper.data('moduleinstance-id');
          let { width, height } = ui.size;

          Meteor.call('ModuleInstances.methods.edit', {
            moduleInstanceId,
            width,
            height,
          }, (error, result) => {
            if(error) {
              throw new Meteor.Error(error);
            } else {
              console.log(result);
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
    });
    
    $(this.refs.module).resizable({
      disabled: minimized,
    });
    
    Meteor.call('ModuleInstances.methods.edit', { 
      moduleInstanceId,
      minimized,
    }, (error, result) => {
      if(error) {
        this.setState({
          minimized: !minimized
        }, () => {
          throw new Meteor.Error(error);
        });
      } else {
        console.log(result);
      }
    });
  }
}

ModuleInstance.propTypes = {
  moduleInstance: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  users: React.PropTypes.array.isRequired,
  openModuleInstanceContextMenu: React.PropTypes.func.isRequired,
};
