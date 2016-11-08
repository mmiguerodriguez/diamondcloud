import React from "react";

export default class Module extends React.Component {
  componentDidMount() {
    const self = this;

    $(this.module).draggable({
      cursor: '-webkit-grabbing !important',
      containment: $('.board'),
      helper(event) {
        return $(`
          <img
            src="${self.props.module.path}/preview.png"
            width="${self.props.module.settings.width}"
            height="${self.props.module.settings.height}"
          />
        `);
      },
    });
  }

  render() {
    return (
      <div
        className="module-item row"
        ref={(c) => { this.module = c; }}
        role="button"
        data-module-id={this.props.module._id}
        data-ripple="rgba(0,0,0, 0.3)"
      >
        <div className="col-xs-2">
          <img
            src={`${this.props.module.path}/image.png`}
            className="img module-preview"
            width="32px"
          />
        </div>
        <h4 className="col-xs-10 module-name truncate">{this.props.module.name}</h4>
      </div>
    );
  }
}

Module.propTypes = {
  module: React.PropTypes.object.isRequired,
};
