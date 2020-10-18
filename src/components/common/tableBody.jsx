import React from "react";

const TableBody = (props) => {
  const { data, columns, isCountable } = props;
  let count = 0;
  return (
    <tbody>
      {data.map((item) => {
        count++;
        return (
          <tr key={item.key}>
            {isCountable ? <td>{count}</td> : null}
            {columns.map((column) => (
              <td>{item[column.name]}</td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
