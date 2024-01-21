import { useState, useEffect, useMemo } from 'react';

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
    });

    // Debounce search query to avoid unnecessary re-renders and computations
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleFilterChange = (filterName, value) => {
        // Update filter state based on the filter changed
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const filteredTrainers = useMemo(() => {
        return trainers.filter(trainer => {
            //filtering by name and other criteria
            return trainer.firstName.toLowerCase().includes(debouncedSearchQuery) &&
                (filters.availability.length === 0 || filters.availability.includes(trainer.availability)) &&
                (filters.clientSkill.length === 0 || filters.clientSkill.includes(trainer.clientSkill));
        });
    }, [trainers, debouncedSearchQuery, filters]);

    return {
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        handleSearch,
        handleFilterChange,
        filteredTrainers,
    };
};

export default useTrainerSearchAndFilter;
