import React from 'react';

interface SearchFormProps {
  searchQuery: string;
  isLoading: boolean;
  onSearch: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchQuery,
  isLoading,
  onSearch,
  onSearchChange

}) => {
  return (
    <>
      <input 
        type="text" 
        placeholder="Enter name or ID" 
        value={searchQuery}
        onChange={onSearchChange}
      />
      <button 
        type="button" 
        onClick={onSearch}
        disabled={isLoading}
      >
        Search
      </button>
    </>
  );
};

export default SearchForm;
