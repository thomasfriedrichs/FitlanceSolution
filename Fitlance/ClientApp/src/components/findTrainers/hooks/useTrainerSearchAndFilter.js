import { useState, useEffect, useMemo } from "react";

// A debouncing function to delay processing based on user input
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const useTrainerSearchAndFilter = (trainers) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        availability: [],
        clientSkill: [],
        hasTrainingCert: false,
        hasNutritionCert: false,
        yearsOfExperience: 0,
        hourlyRate: 0,
    });

    // Debounce search query to avoid unnecessary re-renders and computations
    const debouncedSearchQuery = useDebounce(searchQuery, 200);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const handleToggleChange = (filterName) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: !prevFilters[filterName],
        }));
    };

    const handleRangeChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: Number(value),
        }));
    };


    const filteredTrainers = useMemo(() => {
        return trainers.filter(trainer => {
            return trainer.firstName.toLowerCase().includes(debouncedSearchQuery) &&
                (filters.availability || trainer.availability.includes(filters.availability)) &&
                (filters.clientSkill || trainer.clientSkill === filters.clientSkill) &&
                (filters.hasTrainingCert === false || trainer.trainingCertification === filters.hasTrainingCert) &&
                (filters.hasNutritionCert === false || trainer.nutritionCertification === filters.hasNutritionCert) &&
                trainer.yearsOfExperience >= filters.yearsOfExperience &&
                trainer.hourlyRate >= filters.hourlyRate;
        });
    }, [trainers, debouncedSearchQuery, filters]);

    return {
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        handleSearch,
        handleFilterChange,
        handleToggleChange,
        handleRangeChange,
        filteredTrainers,
    };
};

export default useTrainerSearchAndFilter;
