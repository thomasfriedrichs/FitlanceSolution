import { useState, useEffect } from "react"; 

const useIsActiveFilterRange = (filter,  defaultMax) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (filter.min !== 0 || filter.max !== defaultMax) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [filter, defaultMax ]);

    return { isActive }
};

export default useIsActiveFilterRange;