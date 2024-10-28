import React, { useState, useEffect } from "react";
import "../services/httpServices";
import _ from "lodash";
import { analyze } from "./utils/reportTableAnalyze";
import Table from "./common/table";

const StatisticsTable = ({ data, updateInterval, title, columns }) => {
  const [analyzedData, setAnalyzedData] = useState([]);

  useEffect(() => {
    if (data === undefined || data.length === 0) {
      return null;
    }
    const clonedData = _.cloneDeep(data);
    const analyzedData = analyze(clonedData, updateInterval);
    analyzedData.then((resolve) => {
      console.log("analyzedData", resolve);
      setAnalyzedData(resolve);
    });
  }, [data]);

  return (
    <div style={{ fontSize: 14 }}>
      <h6 className='text-center mb-2'>{title}</h6>

      <Table className='table-bordered' columns={columns} data={analyzedData} />
    </div>
  );
};

export default StatisticsTable;
