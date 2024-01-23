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
        trainingCertificationRequired: false,
        nutritionCertificationRequired: false,
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

    const toggleCertificationFilter = (filterName) => {
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
                trainer.yearsOfExperience >= filters.yearsOfExperience &&
                trainer.hourlyRate >= filters.hourlyRate &&
                (!filters.trainingCertificationRequired ||
                    (filters.trainingCertificationRequired && (trainer.certifications?.length ?? 0) > 0)) &&
                (!filters.nutritionCertificationRequired ||
                    (filters.nutritionCertificationRequired && (trainer.nutritionCertification?.length ?? 0) > 0))
            });
    }, [trainers, debouncedSearchQuery, filters]);

    return {
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        handleSearch,
        handleFilterChange,
        toggleCertificationFilter,
        handleRangeChange,
        filteredTrainers,
    };
};

export default useTrainerSearchAndFilter;
