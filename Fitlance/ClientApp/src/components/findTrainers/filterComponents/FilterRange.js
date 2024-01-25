import React from "react";

const FilterRange = ({
    label,
    minId,
    maxId,
    handleRangeChange,
    range,
    filter,
    options }) => {

    const minOptions = options.filter(option => option <= filter.max);
    const maxOptions = options.filter(option => option >= filter.min);

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-lg font-medium text-gray-700">{label }</label>
            <div className="flex flex-row space-x-4">
                <div className="flex flex-col">
                    <label htmlFor={minId} className="block text-sm font-medium text-gray-700">Min</label>
                    <select
                        id={minId}
                        value={filter.min}
                        onChange={(e) => handleRangeChange(range, e.target.value, "min")}
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
                        value={filter.max}
                        onChange={(e) => handleRangeChange(range, e.target.value, "max")}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                    >
                        {maxOptions.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
};

export default FilterRange;