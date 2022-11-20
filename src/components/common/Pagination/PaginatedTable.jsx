import React, { useState } from "react";
import PaginationBar from "./PaginationBar";
import Table from "../table";
import _ from "lodash";

const LIMIT = 10;

const PaginatedTable = ({ data, columns }) => {
  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
  });

  const getPaginatedData = (data, limit, page) => {
    return _.slice(data, (page - 1) * limit, page * limit);
  };

  const handlePageNumberClick = (page) => {
    setPaginationState({ currentPage: page });
  };

  const numberOfPages = Math.ceil(data?.length / LIMIT);
  const { currentPage } = paginationState;

  return (
    <React.Fragment>
      <Table
        data={getPaginatedData(data, LIMIT, currentPage)}
        columns={columns}
      />
      {numberOfPages > 1 ? (
        <PaginationBar
          numberOfPages={numberOfPages}
          currentPage={currentPage}
          onPageNumberClick={handlePageNumberClick}
        />
      ) : null}
    </React.Fragment>
  );
};

export default PaginatedTable;
