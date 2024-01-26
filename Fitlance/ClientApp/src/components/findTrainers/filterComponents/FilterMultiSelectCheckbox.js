import React from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useDropdownControl from "../hooks/useDropdownControl";

const MultiSelectCheckbox = ({ options, selectedOptions, onChange, label }) => {
    const { isOpen, setIsOpen, dropdownRef } = useDropdownControl();

    const handleToggle = (option) => {
        let newSelectedOptions;
        if (selectedOptions.includes(option)) {
            newSelectedOptions = selectedOptions.filter(item => item !== option);
        } else {
            newSelectedOptions = [...selectedOptions, option];
        }
        onChange(newSelectedOptions);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="bg-white rounded-md p-2 shadow-sm  w-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                {label}
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="ml-2" />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-full">
                    {options.map(option => (
                        <label key={option} className="flex items-center space-x-3 p-2">
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleToggle(option)}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectCheckbox;