import React from 'react';

export default class ModuleInstance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: this.props.moduleInstance.x,
      y: this.props.moduleInstance.y,
      width: this.props.moduleInstance.width,
      height: this.props.moduleInstance.height,
    };
  }
  render() {
    return (
      <div className='module-container'
           style={{
             top: this.props.moduleInstance.x,
             left: this.props.moduleInstance.y,
           }}>
        <iframe className='module'
                style={{
                  width: this.props.moduleInstance.width,
                  height: this.props.moduleInstance.height,
                }}
                src={ '/modules/' + this.props.moduleInstance.moduleId + '/index.html' }>

        </iframe>
      </div>
    );
  }
  editModuleInstance() {

  }

}

ModuleInstance.propTypes = {
  moduleInstance: React.PropTypes.object.isRequired,
};
