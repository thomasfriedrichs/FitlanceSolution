import React from "react";

const FilterButton = ({ label, filter, toggleFilter, onRemove, onAdd }) => {

    const handleClick = () => {
        toggleFilter();
        if (filter) {
            onRemove();
        } else {
            onAdd();
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:space-x-4">
            <button
                onClick={handleClick}
                className={`w-full px-4 py-2 rounded-md shadow-sm ${filter ? "bg-green text-white" : "bg-slate-200"}`}
            >
                { label }
                {filter && (
                    <span className="text-white ml-2">&#10003;</span>
                )}
            </button>
        </div> 
    )
};

export default FilterButton;