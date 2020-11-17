import React, { Component } from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

class Table extends Component {
  state = {};
  render() {
    const { columns, data } = this.props;

    return (
      <table className="table">
        <TableHeader columns={columns} />
        <TableBody data={data} columns={columns} />
      </table>
    );
  }
}

export default Table;
