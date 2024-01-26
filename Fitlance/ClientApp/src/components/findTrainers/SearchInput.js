import React, { useState } from "react";

import FilterMultiSelectCheckbox from "./filterComponents/FilterMultiSelectCheckbox";
import FilterButton from "./filterComponents/FilterButton";
import FilterRange from "./filterComponents/FilterRange";

const SearchInput = ({
    searchQuery,
    handleSearch,
    handleFilterChange,
    toggleCertificationFilter,
    handleRangeChange,
    filters = {}
}) => {

    const hourlyRateOptions = Array.from({ length: (150 / 5) + 1 }, (_, index) => index * 5);
    const yearsOfExperienceOptions = Array.from({ length: 31 }, (_, index) => index);
    const availabilityOptions = ["Weekends", "Evening", "Afternoon", "WeekDays"];
    const skillLevelOptions = ["Beginner", "Advanced"];

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
                options: yearsOfExperienceOptions
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
                options: hourlyRateOptions
            }
        }
    };

    const initialInactiveFilters = Object.keys(filterDefinitions);
    const [activeFilters, setActiveFilters] = useState([]);
    const [inactiveFilters, setInactiveFilters] = useState(initialInactiveFilters);
    const [showAllFilters, setShowAllFilters] = useState(false);


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
        setActiveFilters([]);
    };

    const handleToggleFilterView = () => {
        setShowAllFilters(!showAllFilters);
    };

    return (
        <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:justify-between">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search trainers"
                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-4 md:mb-0"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
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
            </div>
            <button onclick={handleClearFilters}>
                Reset
            </button>
        </div>
    );
};

export default SearchInput;