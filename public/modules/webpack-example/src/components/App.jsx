import 'react';

export default class App extends React.Component {
  render() {
    console.log(require('../img/mic.svg'));
    return (
      <div>
        Este es un componente <span className="power">de React</span> para testear
        <img src={require('../img/mic.svg')} />
      </div>
    );
  }
}