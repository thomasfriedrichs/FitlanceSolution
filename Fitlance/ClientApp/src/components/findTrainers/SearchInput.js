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
    const [activeFilters, setActiveFilters] = useState([]);
    const [inActiveFilters, setInActiveFilters] = useState([]);

    const hourlyRateOptions = Array.from({ length: (150 / 5) + 1 }, (_, index) => index * 5);
    const yearsOfExperienceOptions = Array.from({ length: 31 }, (_, index) => index);
    const availabilityOptions = ["Weekends", "Evening", "Afternoon", "WeekDays"];
    const skillLevelOptions = ["Beginner", "Advanced"];

    const handleAddFilter = (filter) => {
        setActiveFilters([...activeFilters, filter]);
    };

    const handleRemoveFilter = (filter) => {
        setInActiveFilters([...inActiveFilters, filter]);
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
                <FilterMultiSelectCheckbox
                    label="Select Availability"
                    options={availabilityOptions}
                    selectedOptions={filters.availability}
                    onChange={(selected) => handleFilterChange('availability', selected)}
                />
                <FilterMultiSelectCheckbox
                    label="Select Skill Level"
                    options={skillLevelOptions}
                    selectedOptions={filters.clientSkill}
                    onChange={(selected) => handleFilterChange('clientSkill', selected)}
                />
                <FilterButton
                    label="Certified Trainer"
                    filter={filters.trainingCertificationRequired}   
                    toggleFilter={() => toggleCertificationFilter("trainingCertificationRequired")}
                />
                <FilterButton
                    label="Certified Nutritionist"
                    filter={filters.nutritionCertificationRequired}
                    toggleFilter={() => toggleCertificationFilter("nutritionCertificationRequired")}
                />
            </div>
            <FilterRange
                label="Years of Experience"
                minId="minYearsOfExperience"
                maxId="maxYearsOfExperience"
                handleRangeChange={handleRangeChange}
                range="yearsOfExperienceRange"
                filter={filters.yearsOfExperienceRange}
                options={yearsOfExperienceOptions}
            />
            <FilterRange
                label="Hourly Rate"
                minId="minHourlyRate"
                maxId="maxHourlyRate"
                handleRangeChange={handleRangeChange}
                range="hourlyRateRange"
                filter={filters.hourlyRateRange}
                options={hourlyRateOptions}
            />
        </div>
    );
};

export default SearchInput;