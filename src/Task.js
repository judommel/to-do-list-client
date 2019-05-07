import React from "react";

class Task extends React.Component {
  render() {
    return (
      <li>
        <i
          className="fas fa-times"
          onClick={e => {
            this.props.delete(e);
          }}
        />
        <span
          onClick={i => {
            this.props.check(i);
          }}
          className={this.props.theme}
        >
          {this.props.text}
        </span>
        <span className="quantity">{this.props.quantity}</span>
      </li>
    );
  }
}

export default Task;
