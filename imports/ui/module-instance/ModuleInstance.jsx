import React from 'react';

export default class ModuleInstance extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='module-container'
           style={{
             top: this.props.moduleInstance.x || 150,
             left: this.props.moduleInstance.y || 150,
        }}>
        <iframe className='module'
                style={{
                  width: this.props.moduleInstance.width || 250,
                  height: this.props.moduleInstance.height || 400,
                }}
                src={ '/modules/' + this.props.moduleInstance._id + '/index.html' }>

        </iframe>
      </div>
    );
  }
}

ModuleInstance.propTypes = {
  moduleInstance: React.PropTypes.object.isRequired,
};
