import React, { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useDropdownControl from "../hooks/useDropdownControl";

const RatingFilter = ({
    ratingOptions,
    filter,
    onChange,
    label,
    onAdd,
    onRemove,
}) => {
    const { isOpen, setIsOpen, dropdownRef } = useDropdownControl();
    const [tempRating, setTempRating] = useState(filter);
    const isActive = filter !== null;

    const handleRatingChange = (newRating) => {
        setTempRating(newRating);
    };

    const handleAddFilter = () => {
        onChange(tempRating);
        setIsOpen(false);
        onAdd();
    };

    const handleRemoveFilter = () => {
        onChange(null);
        setIsOpen(false);
        onRemove();
    };

    console.log(filter);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className={`${isActive ? "bg-green hover:bg-darkGreen text-white font-bold" : "bg-white font-semibold"} transition-colors duration-300 ease-in-out border-2 hover:border-slate-400 rounded-full p-2 shadow-sm  w-full`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {label}
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="ml-2" />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-full">
                    {ratingOptions.map((option) => (
                        <button
                            key={option}
                            className={`block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 ${tempRating === option ? "bg-gray-200" : ""}`}
                            onClick={() => handleRatingChange(option)}
                        >
                            {option}+
                        </button>
                    ))}
                    <div className="flex justify-around p-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleAddFilter}
                        >
                            Apply
                        </button>
                        <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                            onClick={handleRemoveFilter}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingFilter;
