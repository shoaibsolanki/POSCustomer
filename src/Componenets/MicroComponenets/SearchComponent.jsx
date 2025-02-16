import React from 'react';

const SearchComponent = ({ placeholder, onSearch }) => {
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const handleSearch = debounce((value) => {
        console.log(value.target.value)
        onSearch(value.target.value);
    }, 500);

    // const handleKeyDown = (event) => {
    //     if (event.key === 'Enter') {
    //         handleSearch(event.target.value);
    //     }
    // };

    return (
        <div className="flex items-center justify-center p-4">
            <input
                type="text"
                placeholder={placeholder}
                onChange={handleSearch}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
};

export default SearchComponent;