import React, { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import FilterMultiSelectCheckbox from "./filterComponents/FilterMultiSelectCheckbox";
import FilterButton from "./filterComponents/FilterButton";
import FilterRange from "./filterComponents/FilterRange";

const SearchInput = ({
    input,
    handleSearch,
    handleFilterChange,
    toggleCertificationFilter,
    handleRangeChange,
    filters = {},
    deactivateAllFilters,
    handleInputChange
}) => {

    const hourlyRateOptions = Array.from({ length: (150 / 5) + 1 }, (_, index) => index * 5);
    const yearsOfExperienceOptions = Array.from({ length: 31 }, (_, index) => index);
    const availabilityOptions = ["Weekends", "Evening", "Afternoon", "WeekDays"];
    const skillLevelOptions = ["Beginner", "Advanced"];
    const defaultHourlyRangeMax = 150;
    const defaultYearsOfExperienceMax = 30;

    const filterDefinitions = {
        availability: {
            id: 1,
            component: FilterMultiSelectCheckbox,
            props: {
                label: "Select Availability",
                options: availabilityOptions,
                selectedOptions: filters.availability,
                onChange: (selected) => handleFilterChange('availability', selected)
            }
        },
        clientSkill: {
            id: 2,
            component: FilterMultiSelectCheckbox,
            props: {
                label: "Select Skill Level",
                options: skillLevelOptions,
                selectedOptions: filters.clientSkill,
                onChange: (selected) => handleFilterChange('clientSkill', selected)
            }
        },
        trainingCertification: {
            id: 3,
            component: FilterButton,
            props: {
                label: "Certified Trainer",
                filter: filters.trainingCertificationRequired,
                toggleFilter: () => toggleCertificationFilter("trainingCertificationRequired")
            }
        },
        nutritionCertification: {
            id: 4,
            component: FilterButton,
            props: {
                label: "Certified Nutritionist",
                filter: filters.nutritionCertificationRequired,
                toggleFilter: () => toggleCertificationFilter("nutritionCertificationRequired")
            }
        },
        yearsOfExperience: {
            id: 5,
            component: FilterRange,
            props: {
                label: "Years of Experience",
                minId: "minYearsOfExperience",
                maxId: "maxYearsOfExperience",
                handleRangeChange: handleRangeChange,
                range: "yearsOfExperienceRange",
                filter: filters.yearsOfExperienceRange,
                options: yearsOfExperienceOptions,
                defaultMax: defaultYearsOfExperienceMax
            }
        },
        hourlyRate: {
            id: 6,
            component: FilterRange,
            props: {
                label: "Hourly Rate",
                minId: "minHourlyRate",
                maxId: "maxHourlyRate",
                handleRangeChange: handleRangeChange,
                range: "hourlyRateRange",
                filter: filters.hourlyRateRange,
                options: hourlyRateOptions,
                defaultMax: defaultHourlyRangeMax
            }
        }
    };

    const initialInactiveFilters = Object.keys(filterDefinitions);
    const [activeFilters, setActiveFilters] = useState([]);
    const [inactiveFilters, setInactiveFilters] = useState(initialInactiveFilters);
    const [showFilters, setShowFilters] = useState(true);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleAddFilter = (filter) => {
        if (!activeFilters.includes(filter)) {
            setActiveFilters([...activeFilters, filter]);
            setInactiveFilters(inactiveFilters.filter(id => id !== filter));
        }
    };

    const handleRemoveFilter = (filter) => {
        if (!inactiveFilters.includes(filter)) {
            setInactiveFilters([...inactiveFilters, filter]);
            setActiveFilters(activeFilters.filter(id => id !== filter));
        }
    };

    const handleClearFilters = () => {
        deactivateAllFilters();
        setInactiveFilters(initialInactiveFilters);
        setActiveFilters([]);
    };

    return (
        <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:justify-between">
            <div className="relative w-full mb-4 md:mb-0">
                <input
                    type="text"
                    value={input} 
                    onChange={handleInputChange}
                    placeholder="Search trainers"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                /> 
                <button
                    onClick={handleSearch}
                    className="absolute transition-colors duration-300 ease-in-out inset-y-0 right-36 px-4 text-gray-600 hover:text-gray-800 flex items-center bg-transparent border-none"
                    >
                    Search
                </button>
                <button
                    onClick={toggleFilters}
                    className="absolute transition-colors duration-300 ease-in-out inset-y-0 right-0 px-4 text-gray-600 hover:text-gray-800 flex items-center bg-transparent border-none"
                >
                    {showFilters ? 'Hide' : 'Show'} Filters
                    <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="ml-2"/>

                </button>
            </div>
            {showFilters && (
                <div className="flex flex-wrap bg-slate-100 justify-around gap-4 p-2 rounded-lg w-full">
                    {activeFilters.map((filterDef) => {
                        const FilterComponent = filterDefinitions[filterDef].component;
                        const props = filterDefinitions[filterDef].props;
                        const id = filterDefinitions[filterDef].id;
                        return (
                            <FilterComponent
                                key={id}
                                {...props}
                                onRemove={() => handleRemoveFilter(filterDef)}
                                onAdd={() => handleAddFilter(filterDef)}
                                />
                        )
                    })}
                    {inactiveFilters.map((filterDef) => {
                        const FilterComponent = filterDefinitions[filterDef].component;
                        const props = filterDefinitions[filterDef].props;
                        const id = filterDefinitions[filterDef].id;
                        return (
                            <FilterComponent
                                key={id}
                                {...props}
                                onRemove={() => handleRemoveFilter(filterDef)}
                                onAdd={() => handleAddFilter(filterDef)}
                                />
                        )
                    })}
                    {activeFilters.length >= 1 && (
                        <button
                            className="text-grey px-4 py-2 rounded-md font-semibold transition-colors duration-300 ease-in-out hover:bg-slate-200 "
                            onClick={handleClearFilters}
                        >
                            Reset
                        </button>
                    )}
                </div>
            )}
        </div>           
    );
};

export default SearchInput;