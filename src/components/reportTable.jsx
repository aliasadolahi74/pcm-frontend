import React, { Component } from "react";
import Table from "./common/table";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";

class ReportTable extends Component {
  render() {
    const { columns, data } = this.props;
    const clonedData = _.cloneDeep(data);
    const analyzedData = analyze(clonedData);
    return <Table columns={columns} data={analyzedData} />;
  }
}

export default ReportTable;
