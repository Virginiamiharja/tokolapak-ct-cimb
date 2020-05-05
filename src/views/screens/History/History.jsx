import React from "react";
import "./History.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";
import { connect } from "react-redux";

class History extends React.Component {
  state = {
    //   Ini intinya si transaction list akan punya 1 sampe banyak transactionDetails aka productList
    transactionList: [],
    productList: [],

    // editForm: {
    //   id: 0,
    //   userId: 0,
    //   totalPrice: 0,
    //   status: "",
    //   trxStartDate: "",
    //   trxEndDate: ""
    // },

    activeTransactions: [],
    modalOpen: false
  };

  getTransactionList = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        userId: this.props.user.id,
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
        totalPrice,
        status,
        trxStartDate,
        trxEndDate,
        user,
        shippingOpt
      } = val;
      if (status == "approved")
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
              <td colSpan={2}> {user.fullName} </td>
              <td colSpan={2}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR"
                }).format(parseInt(totalPrice) + parseInt(shippingOpt))}
              </td>
              <td> {status} </td>
              <td>
                <select
                  value={shippingOpt}
                  className="custom-text-input h-100 pl-3"
                >
                  <option value="0" selected disabled>
                    All
                  </option>
                  <option value="100000">Instant - Rp. 100.000</option>
                  <option value="50000">Same Day - Rp. 50.000</option>
                  <option value="20000">Express - Rp. 20.000</option>
                  <option value="0">Economy - Free</option>
                </select>{" "}
              </td>
              <td> {trxStartDate} </td>
              <td> {trxEndDate} </td>
              <td>
                <ButtonUI
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
                        activeTransactions: [
                          ...this.state.activeTransactions,
                          idx
                        ]
                      });
                    }
                  }}
                  type="contained"
                >
                  Details
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
        <div className="dashboard">
          <caption className="p-3">
            <h2>Transactions</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th colSpan={2}>Full Name</th>
                <th colSpan={2}>Total Price + Shipping Fee</th>
                <th>Status</th>
                <th>Shipping Fee</th>
                <th>Check Out Date</th>
                <th>Approved Date</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>{this.renderTransactionList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    search: state.search
  };
};

export default connect(mapStateToProps)(History);
