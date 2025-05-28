import React, { useState, useEffect } from "react";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";
import Table from "./common/table";
import {useSelector} from "react-redux";

const StatisticsTable = ({ data, title, columns }) => {


  return (
    <div style={{ fontSize: 14 }}>
      <h6 className='text-center mb-2'>{title}</h6>

      <Table className='table-bordered' columns={columns} data={data} />
    </div>
  );
};

export default StatisticsTable;
