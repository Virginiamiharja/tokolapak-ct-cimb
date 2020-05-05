import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class AdminPayments extends React.Component {
  state = {
    //   Ini intinya si transaction list akan punya 1 sampe banyak transactionDetails aka productList
    transactionList: [],
    productList: [],
    activePage: "pending",

    editForm: {
      id: 0,
      userId: 0,
      totalPrice: 0,
      status: "",
      trxStartDate: "",
      trxEndDate: ""
    },

    activeTransactions: [],
    modalOpen: false
  };

  getTransactionList = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        _expand: "user"
      }
    })
      .then(res => {
        this.setState({ transactionList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getProductList = () => {
    Axios.get(`${API_URL}/transactionDetails`, {
      params: {
        _expand: "product"
      }
    })
      .then(res => {
        this.setState({ productList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderTransactionList = () => {
    return this.state.transactionList.map((val, idx) => {
      const {
        id,
        userId,
        totalPrice,
        status,
        trxStartDate,
        trxEndDate,
        shippingOpt,
        user
      } = val;
      if (this.state.activePage == status)
        return (
          <>
            <tr
              onClick={() => {
                if (this.state.activeTransactions.includes(idx)) {
                  this.setState({
                    activeTransactions: [
                      ...this.state.activeTransactions.filter(
                        item => item !== idx
                      )
                    ]
                  });
                } else {
                  this.setState({
                    activeTransactions: [...this.state.activeTransactions, idx]
                  });
                }
              }}
            >
              <td> {id} </td>
              <td> {user.fullName} </td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR"
                }).format(parseInt(totalPrice) + parseInt(shippingOpt))}
              </td>
              <td> {status} </td>
              <td> {trxStartDate} </td>
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
                  onClick={() => this.deleteTransactionHandler(id)}
                >
                  Delete
                </ButtonUI>
              </td>
            </tr>
            {this.renderProductList(val.id, idx)}
          </>
        );
    });
  };

  renderProductList = (id, idx) => {
    return this.state.productList.map(value => {
      // Dia bakal keluarin transactionDetails sesuai dengan transactionId
      if (id == value.transactionId) {
        return (
          <>
            <tr
              className={`collapse-item ${
                this.state.activeTransactions.includes(idx) ? "active" : null
              }`}
            >
              <td className="" colSpan={7}>
                <div className="d-flex m-5 justify-content-around align-items-center">
                  <div className="d-flex">
                    <img src={value.product.image} alt="" />
                    <div className="d-flex flex-column ml-4 justify-content-center">
                      <h5>{value.product.productName}</h5>
                      <h6 className="mt-2">
                        Category:
                        <span style={{ fontWeight: "normal" }}>
                          {value.product.category}
                        </span>
                      </h6>
                      <h6 className="mt-2">
                        Quantity:
                        <span style={{ fontWeight: "normal" }}>
                          {value.quantity}
                        </span>
                      </h6>
                      <h6>
                        Price:
                        <span style={{ fontWeight: "normal" }}>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR"
                          }).format(value.product.price)}
                        </span>
                      </h6>
                      <h6>
                        Description:
                        <span style={{ fontWeight: "normal" }}>
                          {value.product.desc}
                        </span>
                      </h6>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </>
        );
      }
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

  editBtnHandler = idx => {
    this.setState({
      editForm: {
        ...this.state.transactionList[idx]
      },
      modalOpen: true
    });
  };

  editTransactionHandler = () => {
    // Supaya ketika admin approve or cancel the payment dia bakal kebuat tanggal selesai transaksinya
    var date = new Date();
    var trxEndDate =
      // Jangan lupa month di + 1 karena dia start dari 0
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    Axios.patch(`${API_URL}/transactions/${this.state.editForm.id}`, {
      status: this.state.editForm.status,
      trxEndDate
    })
      .then(res => {
        swal("Success!", "The transaction has been edited", "success");
        this.setState({ modalOpen: false });
        this.getTransactionList();
      })
      .catch(err => {
        swal("Error!", "The transaction could not be edited", "error");
        console.log(err);
      });
  };

  deleteTransactionHandler = transactionId => {
    Axios.delete(`${API_URL}/transactions/${transactionId}`)
      .then(res => {
        swal("Success", "The transaction has been deleted", "success");
        this.getTransactionList();
      })
      .catch(err => {
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getTransactionList();
    this.getProductList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="d-flex mb-3">
          <ButtonUI
            className={`auth-screen-btn ${
              this.state.activePage == "pending" ? "active" : null
            }`}
            type="outlined"
            onClick={() => this.setState({ activePage: "pending" })}
          >
            Pending
          </ButtonUI>
          <ButtonUI
            className={`ml-3 auth-screen-btn ${
              this.state.activePage == "approved" ? "active" : null
            }`}
            type="outlined"
            onClick={() => {
              this.setState({ activePage: "approved" });
            }}
          >
            Approved
          </ButtonUI>
        </div>

        <div className="dashboard">
          <caption className="p-3">
            <h2>Transactions</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Check Out Date</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>{this.renderTransactionList()}</tbody>
          </table>
        </div>
        {/* <div className="dashboard-form-container p-4">
          <caption className="mb-4 mt-2">
            <h2>Add Product</h2>
          </caption>
          <div className="row">
            <div className="col-8">
              <TextField
                value={this.state.createForm.productName}
                placeholder="Product Name"
                onChange={e =>
                  this.inputHandler(e, "productName", "createForm")
                }
              />
            </div>
            <div className="col-4">
              <TextField
                value={this.state.createForm.price}
                placeholder="Price"
                onChange={e => this.inputHandler(e, "price", "createForm")}
              />
            </div>
            <div className="col-12 mt-3">
              <textarea
                value={this.state.createForm.desc}
                onChange={e => this.inputHandler(e, "desc", "createForm")}
                style={{ resize: "none" }}
                placeholder="Description"
                className="custom-text-input"
              ></textarea>
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.image}
                placeholder="Image Source"
                onChange={e => this.inputHandler(e, "image", "createForm")}
              />
            </div>
            <div className="col-6 mt-3">
              <select
                value={this.state.createForm.category}
                className="custom-text-input h-100 pl-3"
                onChange={e => this.inputHandler(e, "category", "createForm")}
              >
                <option value="" selected disabled>
                  All
                </option>
                <option value="Phone">Phone</option>
                <option value="Tab">Tab</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
              </select>
            </div>
            <div className="col-3 mt-3">
              <ButtonUI onClick={this.createProductHandler} type="contained">
                Create Product
              </ButtonUI>
            </div>
          </div>
        </div> */}
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Transaction</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-6">
                <TextField
                  value={this.state.editForm.userId}
                  placeholder="User ID"
                />
              </div>
              <div className="col-6">
                <TextField
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR"
                  }).format(this.state.editForm.totalPrice)}
                  placeholder="Price"
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.trxStartDate}
                  placeholder="Check Out Date"
                />
              </div>
              <div className="col-6 mt-3">
                <select
                  value={this.state.editForm.status}
                  className="custom-text-input h-100 pl-3"
                  onChange={e => this.inputHandler(e, "status", "editForm")}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
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
                  onClick={this.editTransactionHandler}
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

export default AdminPayments;
