import React from "react";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import { connect } from "react-redux";
import {
  optLoginRegister,
  loginHandler,
  registerHandler
} from "../../../redux/actions";
import Cookie from "universal-cookie";
import { Redirect } from "react-router-dom";

const cookieObject = new Cookie();

class AuthScreen extends React.Component {
  state = {
    username: "",
    email: "",
    role: "",
    password: "",
    rptPassword: "",

    logUsername: "",
    logPassword: ""
  };

  valueHandler = (event, field) => {
    this.setState({ [field]: event.target.value });
  };

  loginHandler = () => {
    const { logUsername, logPassword } = this.state;
    let userLogin = {
      logUsername,
      logPassword
    };

    this.props.loginHandler(userLogin);

    this.setState({
      logUsername: "",
      logPassword: ""
    });
  };

  registerHandler = () => {
    const { username, email, password, rptPassword, role } = this.state;
    let userRegister = {
      username,
      email,
      password,
      rptPassword,
      role: "User"
    };

    this.props.registerHandler(userRegister);

    this.setState({
      username: "",
      email: "",
      password: "",
      rptPassword: "",
      role: ""
    });
  };

  componentDidUpdate() {
    // Kalo misalnya ada id berarti dia akan execute function
    if (this.props.user.id) {
      // Kita set cookie dengan nama auth data trs kita ambil apa yang mau kita simpan yaitu si user kan
      // Tapi dia nerima hanya string jd kita parsing gitu dari object jadi string
      cookieObject.set("authData", JSON.stringify(this.props.user));
    }
  }

  renderLoginForm = () => {
    return (
      <div>
        <h3> Log In </h3>
        <p className="mt-4">
          Welcome back,
          <br /> Please, login to your account
        </p>
        <TextField
          placeholder="Username"
          value={this.state.logUsername}
          className="mt-5"
          onChange={e => {
            this.valueHandler(e, "logUsername");
          }}
        />
        <TextField
          placeholder="Password"
          value={this.state.logPassword}
          className="mt-2"
          onChange={e => {
            this.valueHandler(e, "logPassword");
          }}
        />
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
  };

  renderRegistrationForm = () => {
    return (
      <div>
        <h3> Register </h3>
        <p className="mt-4">
          You will get the best recommendation for rent
          <br /> house in near of you
        </p>
        <TextField
          placeholder="Username"
          value={this.state.username}
          className="mt-5"
          onChange={e => {
            this.valueHandler(e, "username");
          }}
        />
        <TextField
          placeholder="Email"
          value={this.state.email}
          className="mt-2"
          onChange={e => {
            this.valueHandler(e, "email");
          }}
        />
        <TextField
          placeholder="Password"
          value={this.state.password}
          className="mt-2"
          onChange={e => {
            this.valueHandler(e, "password");
          }}
        />
        <TextField
          placeholder="Confirm Password"
          className="mt-2"
          value={this.state.rptPassword}
          onChange={e => {
            this.valueHandler(e, "rptPassword");
          }}
        />
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
  };

  render() {
    const { option, isLoggedIn } = this.props.user;
    if (!isLoggedIn) {
      return (
        <div className="container">
          <div className="row ">
            <div className="col-5 mt-5">
              <div className="d-flex mb-3">
                <ButtonUI
                  onClick={() => {
                    this.props.optLoginRegister("register");
                  }}
                  type="outlined"
                  className="mr-3"
                >
                  Register
                </ButtonUI>
                <ButtonUI
                  type="outlined"
                  onClick={() => {
                    this.props.optLoginRegister("login");
                  }}
                >
                  Login
                </ButtonUI>
              </div>
              {option == "signin"
                ? this.renderLoginForm()
                : this.renderRegistrationForm()}
            </div>
            <div className="col-7 border">Picture</div>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  optLoginRegister,
  loginHandler,
  registerHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
