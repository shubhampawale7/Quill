import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex items-center">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search posts..."
        className="text-sm bg-gray-100 dark:bg-gray-800 rounded-l-md p-2 focus:outline-none w-32 md:w-48 transition-all"
      />
      <button
        type="submit"
        className="p-2 bg-sky-500 text-white rounded-r-md hover:bg-sky-600"
      >
        <FiSearch />
      </button>
    </form>
  );
};

export default SearchBox;
