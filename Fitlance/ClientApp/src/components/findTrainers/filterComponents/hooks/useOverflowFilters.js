import { useState, useEffect, useCallback } from 'react';

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
