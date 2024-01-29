import { useState, useEffect } from "react"; 

const useIsActiveFilterCheckbox = (selectedOptions) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(selectedOptions.length > 0);
    }, [selectedOptions]);

    return { isActive }
};

export default useIsActiveFilterCheckbox;