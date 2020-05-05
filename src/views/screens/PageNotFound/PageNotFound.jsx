import React from "react";
// import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class PageNotFound extends React.Component {
  render() {
    return (
      <caption className="p-3">
        <h2>PAGE NOT FOUND</h2>
      </caption>
    );
  }
}

export default PageNotFound;
