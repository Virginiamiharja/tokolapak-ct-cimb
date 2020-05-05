import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class PageReport extends React.Component {
  state = {
    //   Ini intinya si transaction list akan punya 1 sampe banyak transactionDetails aka productList
    userList: [],
    productList: [],
    transactionList: [],

    activePage: "user",

    activeTransactions: [],
    modalOpen: false
  };

  getTransactionList = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        status: "approved",
        _expand: "user"
      }
    })
      .then(res => {
        console.log(res.data);
        this.setState({ transactionList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getUserList = () => {
    Axios.get(`${API_URL}/users`)
      .then(res => {
        console.log(res.data);
        this.setState({ userList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  //   getProductList = () => {
  //     Axios.get(`${API_URL}/transactionDetails`, {
  //       params: {
  //         _expand: "product"
  //       }
  //     })
  //       .then(res => {
  //         this.setState({ productList: res.data });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   };

  renderTransactionList = currUserId => {
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
      if (currUserId == userId)
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
              <td colSpan={2}> Transaction ID = {id} </td>
              <td coslpan={2}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR"
                }).format(parseInt(totalPrice) + parseInt(shippingOpt))}
              </td>
              <td> {status} </td>
              <td> {trxStartDate} </td>
            </tr>
          </>
        );
    });
  };

  renderUserList = () => {
    return this.state.userList.map(value => {
      const { username, fullName, email, id } = value;
      return (
        <>
          <tr>
            <td> {id} </td>
            <td> {fullName} </td>
            {/* <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(parseInt(totalPrice) + parseInt(shippingOpt))}
            </td> */}
            <td> {username} </td>
            <td> {email} </td>

            <td>
              <ButtonUI
                // onClick={_ => this.editBtnHandler(idx)}
                type="contained"
              >
                Edit
              </ButtonUI>
            </td>
            <td>
              <ButtonUI
                className="mt-3"
                type="textual"
                // onClick={() => this.deleteTransactionHandler(id)}
              >
                Delete
              </ButtonUI>
            </td>
          </tr>
          {this.renderTransactionList(id)}
        </>
      );
    });
  };

  //   renderProductList = (id, idx) => {
  //     return this.state.productList.map(value => {
  //       // Dia bakal keluarin transactionDetails sesuai dengan transactionId
  //       if (id == value.transactionId) {
  //         return (
  //           <>
  //             <tr
  //               className={`collapse-item ${
  //                 this.state.activeTransactions.includes(idx) ? "active" : null
  //               }`}
  //             >
  //               <td className="" colSpan={7}>
  //                 <div className="d-flex m-5 justify-content-around align-items-center">
  //                   <div className="d-flex">
  //                     <img src={value.product.image} alt="" />
  //                     <div className="d-flex flex-column ml-4 justify-content-center">
  //                       <h5>{value.product.productName}</h5>
  //                       <h6 className="mt-2">
  //                         Category:
  //                         <span style={{ fontWeight: "normal" }}>
  //                           {value.product.category}
  //                         </span>
  //                       </h6>
  //                       <h6 className="mt-2">
  //                         Quantity:
  //                         <span style={{ fontWeight: "normal" }}>
  //                           {value.quantity}
  //                         </span>
  //                       </h6>
  //                       <h6>
  //                         Price:
  //                         <span style={{ fontWeight: "normal" }}>
  //                           {new Intl.NumberFormat("id-ID", {
  //                             style: "currency",
  //                             currency: "IDR"
  //                           }).format(value.product.price)}
  //                         </span>
  //                       </h6>
  //                       <h6>
  //                         Description:
  //                         <span style={{ fontWeight: "normal" }}>
  //                           {value.product.desc}
  //                         </span>
  //                       </h6>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </td>
  //             </tr>
  //           </>
  //         );
  //       }
  //     });
  //   };

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

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getTransactionList();
    this.getUserList();
    // this.getProductList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="d-flex mb-3">
          <ButtonUI
            className={`auth-screen-btn ${
              this.state.activePage == "user" ? "active" : null
            }`}
            type="outlined"
            onClick={() => this.setState({ activePage: "user" })}
          >
            User
          </ButtonUI>
          <ButtonUI
            className={`ml-3 auth-screen-btn ${
              this.state.activePage == "product" ? "active" : null
            }`}
            type="outlined"
            onClick={() => {
              this.setState({ activePage: "product" });
            }}
          >
            Product
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
            <tbody>
              {/* {this.renderTransactionList()} */}
              {this.renderUserList()}
            </tbody>
            {/* {this.renderUserList()} */}
          </table>
        </div>

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
                  //   value={this.state.editForm.userId}
                  placeholder="User ID"
                />
              </div>
              <div className="col-6">
                <TextField
                  //   value={new Intl.NumberFormat("id-ID", {
                  //     style: "currency",
                  //     currency: "IDR"
                  //   }).format(this.state.editForm.totalPrice)}
                  placeholder="Price"
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  //   value={this.state.editForm.trxStartDate}
                  placeholder="Check Out Date"
                />
              </div>
              <div className="col-6 mt-3">
                <select
                  //   value={this.state.editForm.status}
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
                  //   onClick={this.editTransactionHandler}
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

export default PageReport;
