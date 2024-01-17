import React from "react";
import "./styles/search.css";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const navigate = useNavigate();
  const handleChatBack = () => {
    navigate(-1);
  };
  return (
    <div className="search-box">
      <div className="chat-back-btn">
        <i
          className="bi bi-arrow-left-circle-fill font-size-icon"
          onClick={handleChatBack}
        ></i>
      </div>
      <div>
        <input type="text" placeholder="Search" />
      </div>
    </div>
  );
};

export default Search;
