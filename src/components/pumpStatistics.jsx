import React, { Component } from "react";
import Table from "./common/table";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";

class PumpStatistics extends Component {
  render() {
    const { columns, data, title } = this.props;
    const clonedData = _.cloneDeep(data);
    const analyzedData = analyze(clonedData);
    return (
      <div>
        <h6>{title}</h6>
        <Table columns={columns} data={analyzedData} />
      </div>
    );
  }
}

export default PumpStatistics;
