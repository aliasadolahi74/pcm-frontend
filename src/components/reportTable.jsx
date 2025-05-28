import React, { Component } from "react";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";
import PaginatedTable from "./common/Pagination/PaginatedTable";

class ReportTable extends Component {
  state = {
    analyzedData: [],
  };

  componentDidMount = () => {
    const { data } = this.props;
    if (data === undefined || data.length === 0) {
      return null;
    }
    const clonedData = _.cloneDeep(data);
    const analyzedData = analyze(clonedData);
    analyzedData.then((resolve) => {
      this.setState({ analyzedData: resolve });
    });
  };

  render() {
    const { columns } = this.props;
    return <PaginatedTable columns={columns} data={this.state.analyzedData} />;
  }
}

export default ReportTable;
