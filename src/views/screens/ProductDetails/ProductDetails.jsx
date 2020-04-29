import React from "react";
import "./ProductDetails.css";
import ButtonUI from "../../components/Button/Button";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";
import swal from "sweetalert";

class ProductDetails extends React.Component {
  state = {
    product: {
      productName: "",
      price: 0,
      category: "",
      image: "",
      desc: "",
      id: 0
    }
  };

  addToCartHandler = () => {
    Axios.post(`${API_URL}/carts`, {
      userId: this.props.user.id,
      // Bisa dari state productId bisa juga dari query params
      productId: this.state.product.id,
      qty: 2
    })
      .then(res => {
        console.log(res);
        swal("Add to cart", "Your item has been added to your cart", "success");
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    Axios.get(`${API_URL}/products/${this.props.match.params.productId}`)
      .then(res => {
        console.log(res);
        this.setState({ product: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const {
      productName,
      price,
      category,
      image,
      desc,
      id
    } = this.state.product;
    return (
      <div className="container" key={`product-${id}`}>
        <div className="row mt-4 py-4">
          <div className="col-6 text-center">
            <img
              // Object fit contain : keseluruhan dari image ini harus tercontain width 100% height 550px tanpa mengubah dimensi si image
              style={{ width: "100%", objectFit: "contain", height: "550px" }}
              src={image}
              alt=""
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center">
            <h2> {productName} </h2>
            <h4>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(price)}
            </h4>
            <p className="mt-4">{desc}</p>
            <div className="d-flex mt-4">
              <ButtonUI onClick={this.addToCartHandler}> Add To Cart</ButtonUI>
              <ButtonUI className="ml-4" type="outlined">
                Add To Wishlist
              </ButtonUI>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const MapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(MapStateToProps)(ProductDetails);
