import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const SearchableSelect = ({options,Address,onChange,dropdownRef,menuIsOpen}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [getAddress, setGetAddress] = useState('');

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderRadius: '0.375rem', // Tailwind border-radius: 'rounded-md'
      border: '1px solid #d1d5db', // Tailwind border-color: 'border-gray-300'
      padding: '0.375rem', // Tailwind padding: 'p-1.5'
      minHeight: '2.5rem', // Tailwind height: 'h-10'
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9CA3AF', // Tailwind hover: 'hover:border-gray-400'
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.375rem', // Tailwind border-radius: 'rounded-md'
      border: '1px solid #d1d5db', // Tailwind border-color: 'border-gray-300'
      marginTop: '0.25rem', // Tailwind margin: 'mt-1'
      zIndex: 20,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#3b82f6' // Tailwind bg-blue-500 for selected option
        : state.isFocused
        ? '#e5e7eb' // Tailwind bg-gray-200 for focused option
        : 'white',
      color: state.isSelected ? 'white' : 'black',
    }),
  };
  const handleSelectChange = (newValue) => {
    setSelectedOption(newValue);
    // Check if the input is custom or selected from options
    if (newValue.__isNew__) {
      console.log(newValue)
      onChange({
        id: newValue.id,
        label: newValue.label,
        value: "6",
        address: newValue.label || newValue.value, // Set the custom input value or label
      })
      // setGetAddress(newValue.label || newValue.value); // Set the custom input value or label
    } else {
      onChange(newValue)
      // setGetAddress('');
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto ">
      <CreatableSelect
      ref={dropdownRef} 
      menuIsOpen={menuIsOpen}
        value={Address}
        onChange={handleSelectChange}
        options={options}
        isSearchable
        placeholder="Search for nearest delivery store"
        styles={customStyles}
        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
      />
    </div>
  );
};

export default SearchableSelect;
