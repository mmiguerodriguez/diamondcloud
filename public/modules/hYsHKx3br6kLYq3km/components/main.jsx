require('./test.jsx');

class Teta extends React.Component {
  render() {
    return (
      <div>Soy teta</div>
    );
  }
}

ReactDOM.render(
  <div>
    <Teta />
    <Test />
  </div>,
  document.getElementById('render-target')
);