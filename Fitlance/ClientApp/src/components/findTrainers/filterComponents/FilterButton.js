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
        <div>
            <button
                onClick={handleClick}
                className={`px-4 py-2 rounded-md shadow-sm font-semibold ${filter ? "bg-green text-white" : "bg-white"}`}
            >
                { label }
            </button>
        </div> 
    )
};

export default FilterButton;