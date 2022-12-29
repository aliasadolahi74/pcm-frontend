import { Button, Input } from "@mantine/core";
import React from "react";
import { useRef } from "react";
import classes from "./Pagination.module.css";

const PaginationBar = (props) => {
  const { currentPage, onPageNumberClick, numberOfPages } = props;
  const pageNumberRef = useRef();

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
            onClick={() => onPageNumberClick(i)}
            className={classArr.join(" ")}
          >
            {i}
          </span>
        );
      }
    }

    // i = 100    ta 105
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
          onClick={() => onPageNumberClick(i)}
          className={classArr.join(" ")}
        >
          {i}
        </span>
      );
    }
    return pagination;
  };

  const handleGoToPageClick = (e) => {
    e.preventDefault();
    const { value } = pageNumberRef.current;
    if (
      value <= numberOfPages &&
      numberOfPages > PAGE_NUMBER_LIMIT &&
      value > 0
    ) {
      onPageNumberClick(parseInt(value));
    }
  };

  return (
    <div className={classes.PaginationBarContainer}>
      {currentPage > 1 ? (
        <span
          key='firstItem'
          onClick={() => onPageNumberClick(1)}
          className={classes.PaginationBarItem}
        >
          اولین
        </span>
      ) : null}

      {insertPaginationItems(currentPage, PAGE_NUMBER_LIMIT, numberOfPages)}

      {currentPage < numberOfPages ? (
        <span
          key='lastItem'
          onClick={() => onPageNumberClick(numberOfPages)}
          className={classes.PaginationBarItem}
        >
          آخرین
        </span>
      ) : null}
      {numberOfPages > 5 ? (
        <form
          style={{
            display: "flex",
            flexDirection: "row",
            marginRight: "10px",
            alignItems: "center",
            columnGap: 10,
          }}
          onSubmit={handleGoToPageClick}
        >
          <Input
            styles={{ input: { width: "100px" } }}
            placeholder='شماره صفحه'
            radius='xs'
            ref={pageNumberRef}
          />
          <Button onClick={handleGoToPageClick} compact>
            رفتن به صفحه
          </Button>
        </form>
      ) : null}
    </div>
  );
};

export default PaginationBar;
