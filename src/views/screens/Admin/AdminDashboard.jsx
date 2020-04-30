import React from "react";
import "./AdminDashboard.css";
import { Table } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class AdminDashboard extends React.Component {
  state = {
    productList: [],

    addProductForm: {
      productName: "",
      price: 0,
      category: "",
      image: "",
      desc: ""
    },

    editProductForm: {
      id: 0,
      productName: "",
      price: 0,
      category: "",
      image: "",
      desc: ""
    }
  };

  getProductList = () => {
    Axios.get(`${API_URL}/products`)
      .then(res => {
        this.setState({ productList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    {
      this.getProductList();
    }
  }

  renderProductList = () => {
    return this.state.productList.map((value, index) => {
      const { id, productName, price, category, image, desc } = value;
      return (
        <tr>
          <td> {id} </td>
          <td> {productName} </td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR"
            }).format(price)}
          </td>
          <td> {category} </td>
          <td>
            <img style={{ height: "100px" }} src={image} alt="" />
          </td>
          <td> {desc} </td>
          <td>
            <ButtonUI onClick={() => this.editButtonHandler(index)}>
              Edit
            </ButtonUI>
          </td>
          <td>
            <ButtonUI type="outlined"> Delete </ButtonUI>
          </td>
        </tr>
      );
    });
  };

  inputHandler = (event, field, form) => {
    const { value } = event.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value
      }
    });
  };

  addProductHandler = () => {
    Axios.post(`${API_URL}/products`, this.state.addProductForm)
      .then(res => {
        console.log(res);
        swal("Congrats", "The data has been addded to the database", "success");
        this.setState({
          addProductForm: {
            productName: "",
            price: 0,
            category: "",
            image: "",
            desc: ""
          }
        });

        this.getProductList();
      })
      .catch(err => {
        console.log(err);
      });
  };

  editButtonHandler = index => {
    this.setState({ editProductForm: { ...this.state.productList[index] } });
  };

  editProductHandler = () => {
    // PUT VS PATCH
    //   Kalo put itu misalnya kita ganti nama doang nih, nanti dia bakal kehapus trs adanya nama doang di db.json kasarnya kaya ngereplace sama apa yang diudate
    //   Jdi harus di spread dulu gitu, kalo patch dia bakal cari oh nama keganti tapi semua kaya category price gabakal hilang
    Axios.put(
      `${API_URL}/products/${this.state.editProductForm.id}`,
      this.state.editProductForm
    )
      .then(res => {
        console.log(res);
        swal("Success", "Your product has been edited", "success");
        this.getProductList();
        this.setState({
          editProductForm: {
            id: 0,
            productName: "",
            price: 0,
            category: "",
            image: "",
            desc: ""
          }
        });
      })
      .catch(err => {
        console.log(err);
        swal("Error", "Your item could not be edited", "error");
      });
  };

  deleteProductHandler = () => {};

  render() {
    const {
      productName,
      price,
      category,
      image,
      desc
    } = this.state.addProductForm;

    return (
      <div className="container py-4">
        {this.state.addProductForm.productName}
        <Table className="text-center">
          <thead>
            <tr>
              <td> ID </td>
              <td> Name </td>
              <td> Price </td>
              <td> Category </td>
              <td> Image </td>
              <td> Description </td>
              <td colSpan={2}> Action </td>
            </tr>
          </thead>
          <tbody>{this.renderProductList()}</tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <TextField
                  placeholder="Name"
                  value={productName}
                  onChange={e => {
                    this.inputHandler(e, "productName", "addProductForm");
                  }}
                />
              </td>
              <td>
                <TextField
                  placeholder="Price"
                  value={price}
                  onChange={e => {
                    this.inputHandler(e, "price", "addProductForm");
                  }}
                />
              </td>
              <td>
                <select
                  className="form-control"
                  value={category}
                  onChange={e => {
                    this.inputHandler(e, "category", "addProductForm");
                  }}
                >
                  <option value=""> All .. </option>
                  <option value="Phone"> Phone </option>
                  <option value="Laptop"> Laptop </option>
                  <option value="Table"> Tab </option>
                  <option value="Watch"> Desktop </option>
                </select>
              </td>
              <td>
                <TextField
                  placeholder="Image"
                  value={image}
                  onChange={e => {
                    this.inputHandler(e, "image", "addProductForm");
                  }}
                />
              </td>
              <td colSpan={3}>
                <TextField
                  placeholder="Description"
                  value={desc}
                  onChange={e => {
                    this.inputHandler(e, "desc", "addProductForm");
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={7}></td>
              <td colSpan={1}>
                <ButtonUI type="contained" onClick={this.addProductHandler}>
                  Add Product
                </ButtonUI>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <TextField
                  placeholder="Name"
                  value={this.state.editProductForm.productName}
                  onChange={e => {
                    this.inputHandler(e, "productName", "editProductForm");
                  }}
                />
              </td>
              <td>
                <TextField
                  placeholder="Price"
                  value={this.state.editProductForm.price}
                  onChange={e => {
                    this.inputHandler(e, "price", "editProductForm");
                  }}
                />
              </td>
              <td>
                <select
                  className="form-control"
                  value={this.state.editProductForm.category}
                  onChange={e => {
                    this.inputHandler(e, "category", "editProductForm");
                  }}
                >
                  <option value=""> All .. </option>
                  <option value="Phone"> Phone </option>
                  <option value="Laptop"> Laptop </option>
                  <option value="Table"> Tab </option>
                  <option value="Watch"> Desktop </option>
                </select>
              </td>
              <td>
                <TextField
                  placeholder="Image"
                  value={this.state.editProductForm.image}
                  onChange={e => {
                    this.inputHandler(e, "image", "editProductForm");
                  }}
                />
              </td>
              <td colSpan={3}>
                <TextField
                  placeholder="Description"
                  value={this.state.editProductForm.desc}
                  onChange={e => {
                    this.inputHandler(e, "desc", "editProductForm");
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={7}></td>
              <td colSpan={1}>
                <ButtonUI type="contained" onClick={this.editProductHandler}>
                  Edit Product
                </ButtonUI>
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  }
}

export default AdminDashboard;
