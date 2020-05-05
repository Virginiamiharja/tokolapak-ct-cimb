import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Home from "./views/screens/Home/Home";
import Navbar from "./views/components/Navbar/Navbar";
import AuthScreen from "./views/screens/Auth/AuthScreen";
import Cookie from "universal-cookie";
import { connect } from "react-redux";
import { keepLoginHandler, cookieChecker } from "./redux/actions/";
import ProductDetails from "./views/screens/ProductDetails/ProductDetails";
import Cart from "./views/screens/Cart/Cart";
import AdminDashboard from "./views/screens/Admin/AdminDashboard";
import AdminMembers from "./views/screens/Admin/AdminMembers";
import AdminPayments from "./views/screens/Admin/AdminPayments";
import History from "./views/screens/History/History";
import Wishlist from "./views/screens/Wishlist/Wishlist";
import PageReport from "./views/screens/Admin/PageReport";
import PageNotFound from "./views/screens/PageNotFound/PageNotFound";

const cookieObject = new Cookie();

class App extends React.Component {
  componentDidMount() {
    // Set time out ini gimmick aja untuk tau cara kerja cookie check
    setTimeout(() => {
      let cookieResult = cookieObject.get("authData", { path: "/" });
      if (cookieResult) {
        this.props.keepLoginHandler(cookieResult);
      } else {
        this.props.cookieChecker();
      }
    }, 2000);
  }

  renderRoutes = () => {
    if (this.props.user.role == "admin") {
      return (
        <>
          <Route exact path="/admin/dashboard" component={AdminDashboard} />
          <Route exact path="/admin/members" component={AdminMembers} />
          <Route exact path="/admin/payments" component={AdminPayments} />
          <Route exact path="/admin/pagereport" component={PageReport} />
        </>
      );
    } else if (this.props.user.role == "user") {
      return (
        <>
          <Route exact path="/user/history" component={History} />
          <Route exact path="/user/wishlist" component={Wishlist} />
        </>
      );
    }
  };

  render() {
    if (this.props.user.cookieChecked) {
      return (
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={AuthScreen} />
            <Route
              exact
              path="/product/:productId"
              component={ProductDetails}
            />
            <Route exact path="/cart" component={Cart} />
            {this.renderRoutes()}
            <Route path="*" component={PageNotFound} />
          </Switch>
          <div style={{ height: "120px" }} />
        </>
      );
    } else {
      return <div>Loading ...</div>;
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  keepLoginHandler,
  cookieChecker
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
