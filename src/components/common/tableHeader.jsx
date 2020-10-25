import React from "react";

const TableHeader = (props) => {
  const { columns } = props;
  return (
    <thead className="thead-dark">
      <tr>
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
