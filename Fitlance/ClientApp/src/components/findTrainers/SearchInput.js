import React from "react";

const SearchInput = ({
    searchQuery,
    handleSearch,
    handleAvailabilityChange,
    toggleCertificationFilter,
    handleSkillLevelChange,
    handleYearsOfExperienceChange,
    handleHourlyRateChange,
    filters = {}
}) => {
    console.log("Training Cert", filters.trainingCertificationRequired)
    return (
        <div className="space-y-4">
            {/* Search Input */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search trainers"
                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <div className="flex justify-row justify-around">
                {/* Availability Dropdown */}
                <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                    <select
                        id="availability"
                        value={filters.availability}
                        onChange={handleAvailabilityChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                    >
                        <option value="">Select Availability</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Evenings">Evenings</option>
                        <option value="Afternoon">Afternoon</option>
                    </select>
                </div>            
                {/* Skill Level Dropdown */}
                <div>
                    <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700">Skill Level</label>
                    <select
                        id="skillLevel"
                        value={filters.skillLevel}
                        onChange={handleSkillLevelChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
                    >
                        <option value="">Select Skill Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                {/*Training certification button*/}
                <div>
                    <button
                        onClick={() => toggleCertificationFilter('trainingCertificationRequired')}
                        className={`mt-1 px-4 py-2 rounded-md shadow-sm bg-green-600`}
                    >
                        Certified Trainer
                    </button>
                </div>
                {/*// Nutrition Certification Button*/}
                <div>
                    <button
                        onClick={() => toggleCertificationFilter('nutritionCertificationRequired')}
                        className={`mt-1 px-4 py-2 rounded-md shadow-sm ${filters.nutritionCertificationRequired ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                        {filters.nutritionCertificationRequired ? 'Nutrition Cert Required' : 'Nutrition Cert Not Required'}
                    </button>
                </div>
            </div>
            {/* Years of Experience Range Selector */}
            <div>
                <label htmlFor="yearsExp" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                    type="range"
                    id="yearsExp"
                    min="0"
                    max="30"
                    value={filters.yearsOfExperience}
                    onChange={handleYearsOfExperienceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
            </div>
            {/* Hourly Rate Range Selector */}
            <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                <input
                    type="range"
                    id="hourlyRate"
                    min="0"
                    max="500"
                    value={filters.hourlyRate}
                    onChange={handleHourlyRateChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
            </div>
        </div>
    );
};


export default SearchInput;