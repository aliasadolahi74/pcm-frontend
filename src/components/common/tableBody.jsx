import React, { Component } from "react";

class TableBody extends Component {
  state = {};

  render() {
    const { data, columns, isCountable } = this.props;
    let count = 0;

    return (
      <tbody>
        {data.map((item) => {
          count++;
          return (
            <tr key={item.key}>
              {isCountable ? <td key={item.key + "count"}>{count}</td> : null}
              {columns.map((column) => (
                <td key={item.key + column.name}>
                  {this.renderCell(item, column)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  }

  renderCell = (item, column) => {
    if (column.content) return column.content(item);
    return item[column.name];
  };
}

export default TableBody;
