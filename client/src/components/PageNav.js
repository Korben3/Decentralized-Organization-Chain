import React from "react";
import Pagination from "react-bootstrap/Pagination";

const PageNav = ({ pollsPerPage, totalPolls, currentPage, gotoPage }) => {
  let items = [];

  for (
    let number = 1;
    number <= Math.ceil(totalPolls / pollsPerPage);
    number++
  ) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => gotoPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <br />
      <Pagination className="ml-4">{items}</Pagination>
    </div>
  );
};

export default PageNav;
