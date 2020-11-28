import React, { Component } from "react";
import Table from "./common/table";
import "../services/httpServices";

class ReportTable extends Component {
  render() {
    const { columns, data } = this.props;
    return <Table isCountable={true} columns={columns} data={data} />;
  }
}

export default ReportTable;
