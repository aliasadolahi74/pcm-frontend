import React, { Component } from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

class Table extends Component {
  state = {};
  render() {
    const { columns, data, isCountable } = this.props;

    return (
      <table className="table">
        <TableHeader isCountable={isCountable} columns={columns} />
        <TableBody isCountable={isCountable} data={data} columns={columns} />
      </table>
    );
  }
}

export default Table;
