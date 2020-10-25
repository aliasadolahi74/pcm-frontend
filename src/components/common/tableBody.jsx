import React, { Component } from "react";

class TableBody extends Component {
  state = {};

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => {
          return (
            <tr key={item.key}>
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
