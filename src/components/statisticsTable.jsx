import React, { Component } from "react";
import Table from "./common/table";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";

class StatisticsTable extends Component {
  render() {
    const { columns, data, title } = this.props;
    if (data.length === 0) {
      return null;
    }
    const clonedData = _.cloneDeep(data);
    const analyzedData = analyze(clonedData);
    return (
      <div>
        <h6 className="text-center mb-4">{title}</h6>
        <Table
          className="table-bordered"
          columns={columns}
          data={analyzedData}
        />
      </div>
    );
  }
}

export default StatisticsTable;
