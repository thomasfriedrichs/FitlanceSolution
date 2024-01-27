import React from "react";

const FilterButton = ({ label, filter, toggleFilter, onRemove, onAdd, isActive }) => {

    const handleClick = () => {
        toggleFilter();
        if (filter) {
            onRemove();
        } else {
            onAdd();
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`px-4 py-2 rounded-md shadow-sm ${filter ? "bg-green text-white" : "bg-slate-200"}`}
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