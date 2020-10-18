import React from "react";

const TableHeader = (props) => {
  const { columns, isCountable } = props;
  return (
    <thead className="thead-dark">
      <tr>
        {isCountable ? (
          <th scope="col" key="count">
            #
          </th>
        ) : null}
        {columns.map((column) => {
          return (
            <th scope="col" key={column.name}>
              {column.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
