﻿import React from "react";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SingleTrainer from "./SingleTrainer";
import SearchInput from "./SearchInput";
import useLazyLoadTrainers from "./hooks/useLazyLoadTrainers";
import useTrainerSearchAndFilter from "./hooks/useTrainerSearchAndFilter";

const FindTrainers = () => {
    const {
        displayedTrainers,
        isLoading,
        isError,
        error,
        loader
    } = useLazyLoadTrainers();
    const {
        filters,
        deactivateAllFilters,
        input,
        handleSearch,
        handleFilterChange,
        toggleCertificationFilter,
        handleRangeChange,
        filteredTrainers,
        handleInputChange
    } = useTrainerSearchAndFilter(displayedTrainers);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary animate-spin" />
            </div>
        );
    };

    if (isError) {
        return (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="p-4 bg-white rounded-lg shadow-xl text-center">
                    <h2 className="text-xl font-bold text-red-600">An Error Occurred</h2>
                    <p className="text-red-600">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <div className="mt-8 md:mt-12 mb-20 p-4 md:p-8 w-full md:w-[80vw] h-full">
                <div className="flex justify-center mt-2">
                    <h1 className="text-4xl">
                        Find Trainers
                    </h1>
                </div>
                <SearchInput
                    type="text"
                    placeholder="Search trainers"
                    value={input}
                    onChange={handleSearch}
                    handleFilterChange={handleFilterChange}
                    toggleCertificationFilter={toggleCertificationFilter}
                    handleRangeChange={handleRangeChange}
                    filters={filters}
                    deactivateAllFilters={deactivateAllFilters}
                    handleInputChange={handleInputChange}
                />
                <div className="mt-10">
                    {filteredTrainers.map((trainer, i) => {
                        return (
                            <SingleTrainer
                                key={i}
                                trainer={trainer}
                            />
                        );
                    })}
                    <div ref={loader} className="loading-indicator">
                        {isLoading && <span>Loading more trainers...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindTrainers;