import React, { Component } from "react";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";
import Table from "./common/table";

class StatisticsTable extends Component {
  render() {
    const { columns, data, title, updateInterval } = this.props;
    if (data === undefined || data.length === 0) {
      return null;
    }
    const clonedData = _.cloneDeep(data);
    const analyzedData = analyze(clonedData, updateInterval);

    return (
      <div style={{ fontSize: 14 }}>
        <h6 className='text-center mb-2'>{title}</h6>
        <Table
          className='table-bordered'
          columns={columns}
          data={analyzedData}
        />
      </div>
    );
  }
}

export default StatisticsTable;
