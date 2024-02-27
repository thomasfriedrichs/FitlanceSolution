import { useState, useMemo } from "react";

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

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSearchClick = () => {
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
    console.log("trainer", trainers[0])

    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const filteredTrainers = useMemo(() => {
        return trainers.filter(trainer => {
            const matchesSearchQuery = searchQuery ?
                trainer.firstName.toLowerCase().includes(lowerCaseSearchQuery) ||
                trainer.lastName.toLowerCase().includes(lowerCaseSearchQuery) ||
                trainer.bio.toLowerCase().includes(lowerCaseSearchQuery)
                : true;

            const matchesFilters =
                (filters.availability.length === 0 || filters.availability.some(avail => trainer.availability.includes(avail))) &&
                (filters.clientSkill.length === 0 || filters.clientSkill.some(skill => trainer.clientSkill.includes(skill))) &&
                trainer.yearsOfExperience >= filters.yearsOfExperienceRange.min &&
                trainer.yearsOfExperience <= filters.yearsOfExperienceRange.max &&
                trainer.hourlyRate >= filters.hourlyRateRange.min &&
                trainer.hourlyRate <= filters.hourlyRateRange.max &&
                (!filters.trainingCertificationRequired ||
                    (filters.trainingCertificationRequired && (trainer.certifications?.length ?? 0) > 0)) &&
                (!filters.nutritionCertificationRequired ||
                    (filters.nutritionCertificationRequired && (trainer.nutritionCertification?.length ?? 0) > 0));

           return matchesSearchQuery && matchesFilters;
        });
    }, [trainers, searchQuery, lowerCaseSearchQuery, filters]);

    return {
        input,
        setSearchQuery,
        filters,
        setFilters,
        handleSearchClick,
        handleFilterChange,
        toggleCertificationFilter,
        handleRangeChange,
        filteredTrainers,
        deactivateAllFilters,
        handleInputChange
    };
};

export default useTrainerSearchAndFilter;