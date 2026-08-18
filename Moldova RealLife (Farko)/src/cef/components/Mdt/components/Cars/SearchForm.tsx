import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!searchQuery?.trim()) return;
    onSearch(searchQuery);
  }

  return (
    <>
      <input
        type="text"
        placeholder="Nr. inmatriculare"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        type="button"
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? 'Se cauta...' : 'Cauta'}
      </button>
    </>
  );
};

export default SearchForm; 