import React from "react";
import classes from "./pagination.module.css";

const Pagination = (props) => {
  const { currentPage, onPageChange: onPageNumberClick, itemsCount } = props;

  const numberOfPages = Math.ceil(itemsCount / 5);

  const arr = new Array(numberOfPages);
  const PAGE_NUMBER_LIMIT = 5;
  arr.fill(0);

  const insertPaginationItems = (currentPage, limit, numberOfPages) => {
    let pagination = [];

    if (currentPage <= limit) {
      for (let i = 1; i < currentPage; i++) {
        const classArr = [classes.PaginationBarItem];
        if (currentPage === i) {
          classArr.push(classes.CurrentPage);
        }
        pagination.push(
          <span
            key={i}
            onClick={() => onPageNumberClick(i)}
            className={classArr.join(" ")}
          >
            {i}
          </span>
        );
      }
    } else {
      for (let i = currentPage - limit + 1; i < currentPage; i++) {
        const classArr = [classes.PaginationBarItem];
        if (currentPage === i) {
          classArr.push(classes.CurrentPage);
        }
        pagination.push(
          <span
            key={i}
            onClick={() => onPageNumberClick(i)}
            className={classArr.join(" ")}
          >
            {i}
          </span>
        );
      }
    }

    for (
      let i = currentPage;
      i < currentPage + limit && i <= numberOfPages;
      i++
    ) {
      const classArr = [classes.PaginationBarItem];
      if (currentPage === i) {
        classArr.push(classes.CurrentPage);
      }
      pagination.push(
        <span
          key={i}
          onClick={() => onPageNumberClick(i)}
          className={classArr.join(" ")}
        >
          {i}
        </span>
      );
    }
    return pagination;
  };

  return (
    <div className={classes.PaginationBarContainer}>
      {currentPage > 1 ? (
        <span
          key='first'
          onClick={() => onPageNumberClick(1)}
          className={classes.PaginationBarItem}
        >
          اولین
        </span>
      ) : null}

      {insertPaginationItems(currentPage, PAGE_NUMBER_LIMIT, numberOfPages)}

      {currentPage < numberOfPages ? (
        <span
          key='last'
          onClick={() => onPageNumberClick(numberOfPages)}
          className={classes.PaginationBarItem}
        >
          آخرین
        </span>
      ) : null}
    </div>
  );
};

export default Pagination;
