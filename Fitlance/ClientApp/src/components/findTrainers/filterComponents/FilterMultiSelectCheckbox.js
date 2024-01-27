import React, { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useDropdownControl from "../hooks/useDropdownControl";

const MultiSelectCheckbox = ({
    options,
    selectedOptions,
    onChange,
    label,
    isActive,
    onAdd,
}) => {

    const { isOpen, setIsOpen, dropdownRef } = useDropdownControl();
    const [tempSelectedOptions, setTempSelectedOptions] = useState(selectedOptions);

    const handleToggle = (option) => {
        setTempSelectedOptions(prev => {
            if (prev.includes(option)) {
                return prev.filter(item => item !== option);
            } else {
                return [...prev, option];
            }
        });
    };

    const handleAddFilter = () => {
        onChange(tempSelectedOptions);
        setIsOpen(false);
        onAdd();
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
                                checked={tempSelectedOptions.includes(option)}
                                onChange={() => handleToggle(option)}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                    <button
                        className="bg-blue-500 text-white p-2 rounded-md mt-2"
                        onClick={handleAddFilter}
                    >
                        Add Filter
                    </button>
                </div>
            )}
        </div>
    );
};

export default MultiSelectCheckbox;