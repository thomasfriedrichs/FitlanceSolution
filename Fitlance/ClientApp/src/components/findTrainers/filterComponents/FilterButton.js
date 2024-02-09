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
        <button
            onClick={handleClick}
            className={`${filter ? "bg-green text-white font-bold" : "bg-white font-semibold"} px-4 py-2 rounded-full shadow-sm`}
        >
            { label }
        </button>
    )
};

export default FilterButton;