import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchTrainers } from '../../../services/TrainerService';

const useLazyLoadTrainers = (batchSize = 10) => {
    const { data, isLoading, isError, error } = useQuery(["findTrainers"], fetchTrainers);
    const [displayedTrainers, setDisplayedTrainers] = useState([]);
    const loader = useRef(null);
    const observer = useRef(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Function to load more trainers, triggered when the observer detects the loader element
    const loadMoreTrainers = useCallback(() => {
        if (data && data.length > 0) {
            const currentLength = displayedTrainers.length;
            const moreTrainers = data.slice(currentLength, currentLength + batchSize);
            setDisplayedTrainers(prev => [...prev, ...moreTrainers]);
            setIsFetchingMore(false);  // Reset fetching state
        }
    }, [data, displayedTrainers.length, batchSize]);

    // Set up the Intersection Observer
    useEffect(() => {
        const observerInstance = new IntersectionObserver((entries) => {
            // Check if loader is in view and more trainers are available to load
            if (entries[0].isIntersecting && !isFetchingMore && data && displayedTrainers.length < data.length) {
                setIsFetchingMore(true);  // Set state to indicate more trainers are being fetched
                loadMoreTrainers();       // Call the function to load more trainers
            }
        }, { threshold: 1.0 });  // The threshold sets when the observer's callback should be executed

        observer.current = observerInstance;  // Assigning the observer instance to the ref

        let currentLoader = loader.current;  // Capturing the current loader element
        if (currentLoader) {
            observerInstance.observe(currentLoader);  // Start observing the loader element
        }

        return () => {
            // Cleanup function to unobserve the loader element
            if (currentLoader) {
                observerInstance.unobserve(currentLoader);
            }
        };
    }, [loadMoreTrainers, isFetchingMore, data, displayedTrainers.length]);

    // Initialize the displayed trainers on first load
    useEffect(() => {
        if (data) {
            setDisplayedTrainers(data.slice(0, batchSize));  // Display the first batch of trainers
        }
    }, [data, batchSize]);

    // Return the necessary state and ref for use in the component
    return { displayedTrainers, isLoading, isError, error, loader };
};

export default useLazyLoadTrainers;