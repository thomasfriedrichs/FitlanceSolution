import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook that checks for overflow in a container and toggles the visibility
 * of an overflow indicator (e.g., a "More Filters" button).
 *
 * @param {React.RefObject} ref - A ref attached to the container element.
 * @returns {Object} An object containing the state and functions to manage overflow.
 */
const useOverflowFilters = (ref) => {
    const [showOverflowIndicator, setShowOverflowIndicator] = useState(false);

    const checkOverflow = useCallback(() => {
        if (ref.current) {
            const containerWidth = ref.current.offsetWidth;
            const childrenWidth = Array.from(ref.current.children).reduce((total, child) => total + child.offsetWidth, 0);

            setShowOverflowIndicator(childrenWidth > containerWidth);
        }
    }, [ref]);

    useEffect(() => {
        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [checkOverflow]);

    return {
        showOverflowIndicator,
    };
};

export default useOverflowFilters;
