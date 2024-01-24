import React from "react";

import MultiSelectCheckbox from "./MultiSelectCheckbox";

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

    return (
        <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:justify-between">
            {/* Search Input */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search trainers"
                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-4 md:mb-0"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
                {/* Availability Dropdown */}
                <MultiSelectCheckbox
                    label="Select Availability"
                    options={availabilityOptions}
                    selectedOptions={filters.availability}
                    onChange={(selected) => handleFilterChange('availability', selected)}
                />
                <MultiSelectCheckbox
                    label="Select Skill Level"
                    options={skillLevelOptions}
                    selectedOptions={filters.clientSkill}
                    onChange={(selected) => handleFilterChange('clientSkill', selected)}
                />
                {/*Training certification button*/}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <button
                        onClick={() => toggleCertificationFilter("trainingCertificationRequired")}
                        className={`w-full px-4 py-2 rounded-md shadow-sm ${filters.trainingCertificationRequired ? "bg-green text-white" : "bg-slate-200"}`}
                    >
                        Certified Trainer
                        {filters.trainingCertificationRequired && (
                            <span className="text-white ml-2">&#10003;</span>
                        )}
                    </button>
                </div>
                {/*// Nutrition Certification Button*/}
                <div>
                    <button
                        onClick={() => toggleCertificationFilter("nutritionCertificationRequired")}
                        className={`w-full px-4 py-2 rounded-md shadow-sm ${filters.nutritionCertificationRequired ? "bg-green text-white" : "bg-slate-200"}`}
                    >
                        Certified Nutritionist
                        {filters.nutritionCertificationRequired && (
                            <span className="text-white ml-2">&#10003;</span>
                        )}
                    </button>
                </div>
            </div>
            {/* Years of Experience Range Selector */}
            <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium text-gray-700">Years of Experience</label>
                <div className="flex flex-row space-x-4">
                    {/* Min Years of Experience Selector */}
                    <div className="flex flex-col">
                        <label htmlFor="minYearsOfExperience" className="block text-sm font-medium text-gray-700">Min</label>
                        <select
                            id="minYearsOfExperience"
                            value={filters.yearsOfExperienceRange.min}
                            onChange={(e) => handleRangeChange("yearsOfExperienceRange", e.target.value, "min")}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                        >
                            {yearsOfExperienceOptions.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Max Years of Experience Selector */}
                    <div className="flex flex-col">
                        <label htmlFor="maxYearsOfExperience" className="block text-sm font-medium text-gray-700">Max</label>
                        <select
                            id="maxYearsOfExperience"
                            value={filters.yearsOfExperienceRange.max}
                            onChange={(e) => handleRangeChange("yearsOfExperienceRange", e.target.value, "max")}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                        >
                            {yearsOfExperienceOptions.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Hourly Rate Range Selector */}
            <div className="flex flex-col space-y-4">
                <label className="text-lg font-medium text-gray-700">Hourly Rate</label>
                <div className="flex flex-row space-x-4">
                    {/* Min Hourly Rate Selector */}
                    <div className="flex flex-col">
                        <label htmlFor="minHourlyRate" className="block text-sm font-medium text-gray-700">Min</label>
                        <select
                            id="minHourlyRate"
                            value={filters.hourlyRateRange.min}
                            onChange={(e) => handleRangeChange("hourlyRateRange", e.target.value, "min")}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                        >
                            {hourlyRateOptions.map((rate) => (
                                <option key={rate} value={rate}>{rate}</option>
                            ))}
                        </select>
                    </div>

                    {/* Max Hourly Rate Selector */}
                    <div className="flex flex-col">
                        <label htmlFor="maxHourlyRate" className="block text-sm font-medium text-gray-700">Max</label>
                        <select
                            id="maxHourlyRate"
                            value={filters.hourlyRateRange.max}
                            onChange={(e) => handleRangeChange("hourlyRateRange", e.target.value, "max")}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                        >
                            {hourlyRateOptions.map((rate) => (
                                <option key={rate} value={rate}>{rate}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchInput;