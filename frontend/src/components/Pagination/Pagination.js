import React from "react";

import "./Pagination.css";

export default function Pagination({ has_next_page, has_previous_page, previous_page, current_page, next_page, highest_page, setCurrentPage }) {
  function changePage(e, page) {
    e.preventDefault();

    setCurrentPage(page);
  }

  return (
    <div className="pagination flex">
      <button
        className="previous-btn flex"
        onClick={(e) => changePage(e, previous_page)}
        style={has_previous_page ? { cursor: "pointer" } : {}}
        disabled={has_previous_page ? false : true}
      >
        <div className={has_previous_page ? "active" : ""}>
          <i className="fas fa-chevron-left"></i>
        </div>
        <p className={`lead ${has_previous_page ? "active" : ""}`}>Previous</p>
      </button>

      <div className="pages-container flex">
        {current_page !== 1 && <p onClick={(e) => changePage(e, 1)}>1</p>}
        {previous_page > 1 && <p onClick={(e) => changePage(e, previous_page)}>{previous_page}</p>}
        <p className="active" onClick={(e) => changePage(e, current_page)}>
          {current_page}
        </p>
        {next_page < highest_page && <p onClick={(e) => changePage(e, next_page)}>{next_page}</p>}
        {current_page !== highest_page && <p onClick={(e) => changePage(e, highest_page)}>{highest_page}</p>}
      </div>

      <button
        className="next-btn flex"
        onClick={(e) => changePage(e, next_page)}
        style={has_next_page ? { cursor: "pointer" } : {}}
        disabled={has_next_page ? false : true}
      >
        <p className={`lead ${has_next_page ? "active" : ""}`}>Next</p>
        <div className={has_next_page ? "active" : ""}>
          <i className="fas fa-chevron-right"></i>
        </div>
      </button>
    </div>
  );
}
