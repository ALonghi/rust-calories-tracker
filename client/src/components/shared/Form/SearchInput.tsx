import React, { Dispatch, SetStateAction } from "react";
import Spinner from "@components/shared/Spinner";

type SearchInputProps = {
  searchField: string;
  setSearchField: Dispatch<SetStateAction<string>>;
  isSearching: boolean;
  placeholder?: string;
};

const SearchInput = ({
  searchField,
  setSearchField,
  isSearching,
  placeholder,
}: SearchInputProps) => {
  return (
    <div
      className={`bg-themebg-400 shadow-md  focus:outline-none
          border-none shadow-none rounded-md flex flex-row justify-start items-center flex-nowrap
            focus:border-2 focus:border-themebg-300 w-full 
          text-white block my-3 placeholder:text-gray-600
              sm:text-sm border-gray-400 rounded-md`}
    >
      <input
        type={"text"}
        name={"existingFoodName"}
        id={"existingFoodName"}
        value={searchField}
        className={`bg-transparent focus:outline-none
          border-none shadow-none w-full text-white block px-4 py-2
          placeholder:text-gray-600 sm:text-sm border-gray-400`}
        placeholder={placeholder || "Rice, pasta, etc."}
        onChange={(e) => setSearchField(e.target.value)}
      />
      {isSearching && <Spinner size={20} classes={`mr-2`} />}
    </div>
  );
};

export default SearchInput;
