import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import "./Navbar.css";
import ButtonUI from "../Button/Button";
import {
  logoutHandler,
  searchProduct,
  navCartQty
} from "../../../redux/actions";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    dropdownOpen: false,
    cartQty: 0
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {
    this.props.logoutHandler();
    // this.forceUpdate();
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  componentDidMount() {
    this.props.navCartQty(this.props.user.id);
  }

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
            }`}
            type="text"
            placeholder="Cari produk impianmu disini"
            // onChange={e => {
            //   this.props.searchProduct(e.target.value);
            // }}
            onChange={this.props.searchProduct}
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.props.user.id ? (
            <>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.fullName}</p>
                </DropdownToggle>
                <DropdownMenu className="mt-2">
                  {this.props.user.role == "admin" ? (
                    <>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/dashboard"
                        >
                          Dashboard
                        </Link>
                      </DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/members"
                      >
                        <DropdownItem>Members</DropdownItem>
                      </Link>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/payments"
                      >
                        <DropdownItem>Payments</DropdownItem>
                      </Link>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/pagereport"
                      >
                        <DropdownItem>Page Report</DropdownItem>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/user/history"
                      >
                        <DropdownItem>History</DropdownItem>
                      </Link>

                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/user/wishlist"
                      >
                        <DropdownItem>Wishlist</DropdownItem>
                      </Link>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
              <Link
                className="d-flex flex-row"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                    {this.props.product.navCartQty}
                  </small>
                </CircleBg>
              </Link>
              <ButtonUI
                onClick={this.logoutBtnHandler}
                className="ml-3"
                type="textual"
              >
                Sign Out
              </ButtonUI>
            </>
          ) : (
            <>
              <ButtonUI className="mr-3" type="textual">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/auth"
                >
                  Sign In
                </Link>
              </ButtonUI>
              <ButtonUI type="contained">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/auth"
                >
                  Sign Up
                </Link>
              </ButtonUI>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    search: state.search,
    product: state.product
  };
};

const mapDispatchToProps = {
  logoutHandler,
  searchProduct,
  navCartQty
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
