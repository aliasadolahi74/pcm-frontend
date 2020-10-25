import React, { Component } from "react";

class LoginForm extends Component {
  h1Tags = React.createRef();
  state = {};

  componentDidMount() {
    this.h1Tags.current.style.color = "#f00";
  }

  render() {
    return (
      <div>
        <h1 ref={this.h1Tags}>Login Form 1</h1>
        <h1 ref={this.h1Tags}>Login Form 2</h1>
        <h1 ref={this.h1Tags}>Login Form 3</h1>
        <h1 ref={this.h1Tags}>Login Form 4</h1>
      </div>
    );
  }
}

export default LoginForm;
