import React from "react";
import "./styles/search.css";
import { useNavigate } from "react-router-dom";
interface SearchBarProps {
  onSearch: (query: string) => void;
}
const Search = ({ onSearch }: SearchBarProps) => {
  const navigate = useNavigate();
  const handleChatBack = () => {
    navigate(-1);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearch(query);
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
        <input type="text" placeholder="Search" onChange={handleInputChange} />
      </div>
    </div>
  );
};

export default Search;
