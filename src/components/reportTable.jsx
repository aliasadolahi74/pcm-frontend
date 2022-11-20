import React, { Component } from "react";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";
import PaginatedTable from "./common/Pagination/PaginatedTable";

class ReportTable extends Component {
  render() {
    const { columns, data } = this.props;
    const clonedData = _.cloneDeep(data);
    const analyzedData = analyze(clonedData);
    return <PaginatedTable columns={columns} data={analyzedData} />;
  }
}

export default ReportTable;
