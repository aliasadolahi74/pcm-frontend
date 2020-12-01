import React, { Component } from "react";
import _ from "lodash";

class Pagination extends Component {
  render() {
    const { currentPage, itemsCount, onPageChange } = this.props;

    const numberOfPages = this.getNumberOfPages(itemsCount);

    return (
      <nav
        aria-label="Page navigation"
        className="d-flex justify-content-center mt-auto"
      >
        <ul className="pagination">
          {numberOfPages === 1
            ? ""
            : _.range(1, numberOfPages + 1).map((page) => (
                <li
                  className={
                    "page-item " + (currentPage === page ? "active" : "")
                  }
                  key={page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                >
                  <a className="page-link" href="/#">
                    {page}
                  </a>
                </li>
              ))}
        </ul>
      </nav>
    );
  }

  getNumberOfPages = (itemsCount) => {
    return Math.ceil(itemsCount / this.props.pageSize);
  };
}

export default Pagination;
