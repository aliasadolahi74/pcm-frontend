import React, { Component } from "react";
import Table from "./common/table";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";

class StatisticsTable extends Component {
  render() {
    const { columns, data, title } = this.props;
<<<<<<< HEAD
    if (data === undefined || data.length === 0) {
=======
    if (data.length === 0) {
>>>>>>> 56f99646e54e4149e299b6afa1c0573d508a1d4c
      return null;
    }
    const clonedData = _.cloneDeep(data);
    const analyzedData = analyze(clonedData);
    return (
      <div>
<<<<<<< HEAD
        <h6 className='text-center mb-4'>{title}</h6>
        <Table
          className='table-bordered'
=======
        <h6 className="text-center mb-4">{title}</h6>
        <Table
          className="table-bordered"
>>>>>>> 56f99646e54e4149e299b6afa1c0573d508a1d4c
          columns={columns}
          data={analyzedData}
        />
      </div>
    );
  }
}

export default StatisticsTable;
