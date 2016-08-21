import React from 'react';

export default class ModuleInstance extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='module-container'>
        <iframe className='module' src={ '/modules/' + this.props.moduleInstance._id + '/index.html' }></iframe>
      </div>
    );
  }
  
}

ModuleInstance.propTypes = {
  moduleInstance: React.PropTypes.object.isRequired,
};