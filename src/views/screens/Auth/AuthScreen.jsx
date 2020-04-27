import React from "react";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";

class AuthScreen extends React.Component {
  state = {
    option: true
  };

  openRegisterPage = () => {
    this.setState({ option: false });
  };

  openLoginPage = () => {
    this.setState({ option: true });
  };

  render() {
    const { option } = this.state;
    if (option) {
      return (
        <div className="container">
          <div className="row ">
            <div className="col-5 mt-5">
              <div className="d-flex mb-3">
                <div onClick={this.openRegisterPage}>
                  <ButtonUI
                    onClick={this.openRegisterPage}
                    type="outlined"
                    className="mr-3"
                  >
                    Register
                  </ButtonUI>
                </div>
                <div onClick={this.openLoginPage}>
                  <ButtonUI type="outlined"> Login </ButtonUI>
                </div>
              </div>
              <div>
                <h3> Log In </h3>
                <p className="mt-4">
                  Welcome back,
                  <br /> Please, login to your account
                </p>
                <TextField placeholder="Username" className="mt-5" />
                <TextField placeholder="Password" className="mt-2" />
                <div className="d-flex justify-content-center">
                  <ButtonUI type="contained" className="mt-4">
                    Login
                  </ButtonUI>
                </div>
              </div>
            </div>
            <div className="col-7 border">Picture</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="row ">
            <div className="col-5 mt-5">
              <div className="d-flex mb-3">
                <div onClick={this.openRegisterPage}>
                  <ButtonUI
                    onClick={this.openRegisterPage}
                    type="outlined"
                    className="mr-3"
                  >
                    Register
                  </ButtonUI>
                </div>
                <div onClick={this.openLoginPage}>
                  <ButtonUI type="outlined"> Login </ButtonUI>
                </div>
              </div>
              <div>
                <h3> Register </h3>
                <p className="mt-4">
                  You will get the best recommendations for rent
                  <br /> house in near of you
                </p>
                <TextField placeholder="Name" className="mt-5" />
                <TextField placeholder="Email" className="mt-2" />
                <TextField placeholder="Password" className="mt-2" />
                <TextField placeholder="Confirm password" className="mt-2" />
                <div className="d-flex justify-content-center">
                  <ButtonUI type="contained" className="mt-4">
                    Register
                  </ButtonUI>
                </div>
              </div>
            </div>
            <div className="col-7 border">Picture</div>
          </div>
        </div>
      );
    }
  }
}

export default AuthScreen;
