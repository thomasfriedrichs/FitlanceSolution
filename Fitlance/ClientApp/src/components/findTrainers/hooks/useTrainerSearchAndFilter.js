import { useState, useEffect, useMemo } from "react";

// A debouncing function to delay processing based on user input
/*const useDebounce = (value, delay) => {
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
};*/

const useTrainerSearchAndFilter = (trainers) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [input , setInput] = useState('');
    const [filters, setFilters] = useState({
        availability: [],
        clientSkill: [],
        trainingCertificationRequired: false,
        nutritionCertificationRequired: false,
        yearsOfExperienceRange: {min: 0, max: 30},
        hourlyRateRange: { min: 0, max: 150 },
    });

    // Debounce search query to avoid unnecessary re-renders and computations
    //const debouncedSearchQuery = useDebounce(searchQuery, 200);
    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSearch = () => {
        setSearchQuery(input);
    };
    
    const toggleCertificationFilter = (filterName) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: !prevFilters[filterName],
        }));
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: Array.isArray(value) ? value : [],
        }));
    };

    const handleRangeChange = (range, value, which) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [range]: {
                ...prevFilters[range],
                [which]: value === "" ? "" : Number(value),
            },
        }));
    };

    const deactivateAllFilters = () => {
        setFilters({
            availability: [],
            clientSkill: [],
            trainingCertificationRequired: false,
            nutritionCertificationRequired: false,
            yearsOfExperienceRange: { min: 0, max: 30 },
            hourlyRateRange: { min: 0, max: 150 },
        });
    };

    console.log("searchQuery", searchQuery)
    console.log("input", input)

    const filteredTrainers = useMemo(() => {
        return trainers.filter(trainer => {
            return trainer.firstName.toLowerCase().includes(searchQuery) &&
                (filters.availability.length === 0 || filters.availability.some(avail => trainer.availability.includes(avail))) &&
                (filters.clientSkill.length === 0 || filters.clientSkill.some(skill => trainer.clientSkill.includes(skill))) &&
                trainer.yearsOfExperience >= filters.yearsOfExperienceRange.min &&
                trainer.yearsOfExperience <= filters.yearsOfExperienceRange.max &&
                trainer.hourlyRate >= filters.hourlyRateRange.min &&
                trainer.hourlyRate <= filters.hourlyRateRange.max &&
                (!filters.trainingCertificationRequired ||
                    (filters.trainingCertificationRequired && (trainer.certifications?.length ?? 0) > 0)) &&
                (!filters.nutritionCertificationRequired ||
                    (filters.nutritionCertificationRequired && (trainer.nutritionCertification?.length ?? 0) > 0))
            });
    }, [trainers, searchQuery, filters]);

    return {
        input,
        setSearchQuery,
        filters,
        setFilters,
        handleSearch,
        handleFilterChange,
        toggleCertificationFilter,
        handleRangeChange,
        filteredTrainers,
        deactivateAllFilters,
        handleInputChange
    };
};

export default useTrainerSearchAndFilter;    