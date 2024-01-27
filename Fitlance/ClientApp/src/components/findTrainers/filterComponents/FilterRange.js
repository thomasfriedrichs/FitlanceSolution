import React, { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useDropdownControl from "../hooks/useDropdownControl";

const FilterRange = ({
    label,
    minId,
    maxId,
    handleRangeChange,
    range,
    filter,
    options,
    onAdd,
    isActive
}) => {

    const { isOpen, setIsOpen, dropdownRef } = useDropdownControl();
    const [tempMin, setTempMin] = useState(filter.min);
    const [tempMax, setTempMax] = useState(filter.max);

    const minOptions = options.filter(option => option <= tempMax);
    const maxOptions = options.filter(option => option >= tempMin);

    const handleAddFilter = () => {
        handleRangeChange(range, tempMin, "min");
        handleRangeChange(range, tempMax, "max");
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
                <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-2 w-full">
                    <div className="flex flex-col">
                        <label htmlFor={minId} className="block text-sm font-medium text-gray-700">Min</label>
                        <select
                            id={minId}
                            value={tempMin}
                            onChange={(e) => setTempMin(Number(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                        >
                            {minOptions.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor={maxId} className="block text-sm font-medium text-gray-700">Max</label>
                        <select
                            id={maxId}
                            value={tempMax}
                            onChange={(e) => setTempMax(Number(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                        >
                            {maxOptions.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="bg-blue-500 text-white p-2 rounded-md mt-2"
                        onClick={handleAddFilter}
                    >
                        Add Filter
                    </button>
                </div>
            )}
        </div>
    )
};

export default FilterRange;