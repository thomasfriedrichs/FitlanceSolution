import React, { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useDropdownControl from "../hooks/useDropdownControl";
import useIsActiveFilterCheckbox from "./hooks/useIsActiveFilterCheckBox";

const MultiSelectCheckbox = ({
    options,
    selectedOptions,
    onChange,
    label,
    onAdd,
    onRemove
}) => {

    const { isOpen, setIsOpen, dropdownRef } = useDropdownControl();
    const [tempSelectedOptions, setTempSelectedOptions] = useState(selectedOptions);
    const { isActive } = useIsActiveFilterCheckbox(selectedOptions);

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

    const handleRemoveFilter = () => {
        onChange([]);
        setIsOpen(false);
        onRemove();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className={`${isActive ? "bg-green text-white font-bold" : "bg-white font-semibold"} rounded-full p-2 shadow-sm  w-full`}
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
                                className="hidden"
                                checked={tempSelectedOptions.includes(option)}
                                onChange={() => handleToggle(option)}
                            />
                            <span
                                className={`w-4 h-4 inline-block mr-2 rounded-full border border-gray-300 align-middle ${tempSelectedOptions.includes(option) ? 'bg-green' : ''
                                    }`}
                            ></span>
                            <span>{option}</span>
                        </label>
                    ))}
                    <div className="flex justify-around">
                        <button
                            className="transition-colors duration-300 ease-in-out hover:bg-green hover:text-white p-2 rounded-md mt-2"
                            onClick={handleAddFilter}
                        >
                            {isActive ? "Update" : "Add"}
                        </button>
                        <button
                            onClick={handleRemoveFilter}
                            className="transition-colors duration-300 ease-in-out hover:bg-slate-200 hover:text-slate-600 p-2 rounded-md mt-2 ml-2"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectCheckbox;