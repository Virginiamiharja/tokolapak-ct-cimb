import React from "react";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";

import { connect } from "react-redux";
import { loginHandler, registerHandler } from "../../../redux/actions";
import Cookie from "universal-cookie";
import { Redirect } from "react-router-dom";

import "./AuthScreen.css";

const cookieObject = new Cookie();

class AuthScreen extends React.Component {
  state = {
    activePage: "register",
    loginForm: {
      username: "",
      password: "",
      showPassword: false
    },

    registerForm: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      showPassword: false
    }
  };

  // Untuk form dengan type text
  valueHandler = (event, field, form) => {
    const { value } = event.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value
      }
    });
  };

  // Untuk form dengan type checkbox
  checkedHandler = (event, form) => {
    const { checked } = event.target;
    this.setState({
      [form]: {
        ...this.state[form],
        showPassword: checked
      }
    });
  };

  loginHandler = () => {
    const { username, password } = this.state.loginForm;
    let userLogin = {
      username,
      password
    };
    this.props.loginHandler(userLogin);
  };

  registerHandler = () => {
    const { username, fullName, email, password } = this.state.registerForm;
    let userRegister = {
      username,
      fullName,
      email,
      password
    };
    this.props.registerHandler(userRegister);
  };

  componentDidUpdate() {
    if (this.props.user.id) {
      cookieObject.set("authData", JSON.stringify(this.props.user));
    }
  }

  renderAuthComponent = () => {
    const { activePage } = this.state;
    if (activePage == "register") {
      return (
        <div>
          <h3> Register </h3>
          <p className="mt-4">
            You will get the best recommendation for rent
            <br /> house in near of you
          </p>
          <TextField
            placeholder="Username"
            value={this.state.registerForm.username}
            className="mt-5"
            onChange={e => {
              this.valueHandler(e, "username", "registerForm");
            }}
          />
          <TextField
            placeholder="Full Name"
            value={this.state.registerForm.fullName}
            className="mt-2"
            onChange={e => {
              this.valueHandler(e, "fullName", "registerForm");
            }}
          />
          <TextField
            placeholder="Email"
            value={this.state.registerForm.email}
            className="mt-2"
            onChange={e => {
              this.valueHandler(e, "email", "registerForm");
            }}
          />
          <TextField
            placeholder="Password"
            value={this.state.registerForm.password}
            className="mt-2"
            onChange={e => {
              this.valueHandler(e, "password", "registerForm");
            }}
            type={this.state.registerForm.showPassword ? "text" : "password"}
          />
          <input
            type="checkbox"
            onChange={e => {
              this.checkedHandler(e, "registerForm");
            }}
            className="mt-3"
            name="showPasswordRegister"
          />
          Show Password
          <div className="d-flex justify-content-center">
            <ButtonUI
              type="contained"
              className="mt-4"
              onClick={this.registerHandler}
            >
              Register
            </ButtonUI>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h3> Log In </h3>
          <p className="mt-4">
            Welcome back,
            <br /> Please, login to your account
          </p>
          <TextField
            placeholder="Username"
            value={this.state.loginForm.username}
            className="mt-5"
            onChange={e => {
              this.valueHandler(e, "username", "loginForm");
            }}
          />
          <TextField
            placeholder="Password"
            value={this.state.loginForm.password}
            className="mt-2"
            onChange={e => {
              this.valueHandler(e, "password", "loginForm");
            }}
            type={this.state.loginForm.showPassword ? "text" : "password"}
          />
          <input
            type="checkbox"
            onChange={e => {
              this.checkedHandler(e, "loginForm");
            }}
            className="mt-3"
            name="showPasswordLogin"
          />
          Show Password
          <div className="d-flex justify-content-center">
            <ButtonUI
              type="contained"
              className="mt-4"
              onClick={this.loginHandler}
            >
              Login
            </ButtonUI>
          </div>
        </div>
      );
    }
  };

  render() {
    if (this.props.user.id > 0) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <div className="row ">
          <div className="col-5 mt-5">
            <div className="d-flex mb-3">
              <ButtonUI
                className={`auth-screen-btn ${
                  this.state.activePage == "register" ? "active" : null
                }`}
                type="outlined"
                onClick={() => this.setState({ activePage: "register" })}
              >
                Register
              </ButtonUI>
              <ButtonUI
                className={`ml-3 auth-screen-btn ${
                  this.state.activePage == "login" ? "active" : null
                }`}
                type="outlined"
                onClick={() => {
                  this.setState({ activePage: "login" });
                }}
              >
                Login
              </ButtonUI>
            </div>

            {/* Untuk munculin error message berdasarkan global state errMsg */}
            {this.props.user.errMsg ? (
              <div className="alert alert-danger mt-5">
                {this.props.user.errMsg}
              </div>
            ) : null}
            {this.renderAuthComponent()}
          </div>
          <div className="col-7 border">Picture</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  loginHandler,
  registerHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
