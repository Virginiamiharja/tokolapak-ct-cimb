import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class AdminMembers extends React.Component {
  state = {
    userList: [],

    createForm: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      role: ""
    },

    editForm: {
      id: 0,
      username: "",
      email: "",
      password: "",
      fullName: "",
      role: ""
    },

    modalOpen: false
  };

  getUserList = () => {
    Axios.get(`${API_URL}/users`)
      .then(res => {
        this.setState({ userList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderUserList = () => {
    return this.state.userList.map((val, idx) => {
      const { id, fullName, username, email, password, role } = val;
      return (
        <>
          <tr>
            <td> {id} </td>
            <td> {fullName} </td>
            <td> {username} </td>
            <td> {email} </td>
            <td> {password} </td>
            <td>
              <ButtonUI
                onClick={_ => this.editBtnHandler(idx)}
                type="contained"
              >
                Edit
              </ButtonUI>
            </td>
            <td>
              <ButtonUI
                className="mt-3"
                type="textual"
                onClick={() => this.deleteUserHandler(id)}
              >
                Delete
              </ButtonUI>
            </td>
          </tr>
        </>
      );
    });
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value
      }
    });
  };

  createUserHandler = () => {
    Axios.post(`${API_URL}/users`, this.state.createForm)
      .then(res => {
        swal("Success!", "New user has been added to the list", "success");
        this.setState({
          createForm: {
            username: "",
            email: "",
            password: "",
            fullName: "",
            role: ""
          }
        });
        this.getUserList();
      })
      .catch(err => {
        swal("Error!", "New user could not be added to the list", "error");
      });
  };

  editBtnHandler = idx => {
    this.setState({
      editForm: {
        ...this.state.userList[idx]
      },
      modalOpen: true
    });
  };

  editUserHandler = () => {
    Axios.put(`${API_URL}/users/${this.state.editForm.id}`, this.state.editForm)
      .then(res => {
        swal("Success!", "User has been edited", "success");
        this.setState({ modalOpen: false });
        this.getUserList();
      })
      .catch(err => {
        swal("Error!", "User could not be edited", "error");
        console.log(err);
      });
  };

  deleteUserHandler = userId => {
    Axios.delete(`${API_URL}/users/${userId}`)
      .then(res => {
        swal("Success", "User has been deleted", "success");
        this.getUserList();
      })
      .catch(err => {
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getUserList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="dashboard">
          <caption className="p-3">
            <h2>Users</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>{this.renderUserList()}</tbody>
          </table>
        </div>
        <div className="dashboard-form-container p-4">
          <caption className="mb-4 mt-2">
            <h2>Add User</h2>
          </caption>
          <div className="row">
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.fullName}
                placeholder="Full Name"
                onChange={e => this.inputHandler(e, "fullName", "createForm")}
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.username}
                placeholder="Username"
                onChange={e => this.inputHandler(e, "username", "createForm")}
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.email}
                placeholder="Email"
                onChange={e => this.inputHandler(e, "email", "createForm")}
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.password}
                placeholder="Password"
                onChange={e => this.inputHandler(e, "password", "createForm")}
              />
            </div>
            <div className="col-12 mt-3">
              <select
                value={this.state.createForm.role}
                className="custom-text-input h-100 pl-3"
                onChange={e => this.inputHandler(e, "role", "createForm")}
              >
                <option value="" selected disabled>
                  All
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-3 mt-3">
              <ButtonUI onClick={this.createUserHandler} type="contained">
                Add User
              </ButtonUI>
            </div>
          </div>
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit User</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.fullName}
                  placeholder="Full Name"
                  onChange={e => this.inputHandler(e, "fullName", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.username}
                  placeholder="Username"
                  onChange={e => this.inputHandler(e, "username", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.email}
                  placeholder="Email"
                  onChange={e => this.inputHandler(e, "email", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.password}
                  placeholder="Password"
                  onChange={e => this.inputHandler(e, "password", "editForm")}
                />
              </div>
              <div className="col-12 mt-3">
                <select
                  value={this.state.editForm.role}
                  className="custom-text-input h-100 pl-3"
                  onChange={e => this.inputHandler(e, "role", "editForm")}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="col-5 mt-3 offset-1">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
              <div className="col-5 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={this.editUserHandler}
                  type="contained"
                >
                  Save
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default AdminMembers;
