import React from 'react';

export default class ModuleInstance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: this.props.moduleInstance.x,
      y: this.props.moduleInstance.y,
      width: this.props.moduleInstance.width,
      height: this.props.moduleInstance.height,
      loading: true,
    };
  }
  render() {
    return (
      <div className='module-container'
           data-moduleinstance-id={ this.props.moduleInstance._id }
           style={{
             top: this.props.moduleInstance.x,
             left: this.props.moduleInstance.y,
             width: this.props.moduleInstance.width,
             height: this.props.moduleInstance.height,
           }}>
        {
          !this.state.loading ? (
            <div className='module-pin' role='button'></div>
          ) : ( null )
        }
        <iframe id={ this.props.moduleInstance._id }
                className='module'
                src={ '/modules/' + this.props.moduleInstance.moduleId + '/index.html' }>

        </iframe>
      </div>
    );
  }
  componentDidMount() {
    $('#' + this.props.moduleInstance._id).load(this.iframeLoaded.bind(this));
  }
  iframeLoaded() {
    let self = this;

    $('.module-container').draggable({
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
    }).resizable({
      containment: 'parent',
      stop(event, ui) {
        let { width, height } = ui.size;

        Meteor.call('ModuleInstances.methods.edit', {
          moduleInstanceId: self.props.moduleInstance._id,
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
}

ModuleInstance.propTypes = {
  moduleInstance: React.PropTypes.object.isRequired,
};
