import { useRef, useEffect, useState } from 'react';
import { maleImages, femaleImages, nonBinaryImages } from "../../../assets/profileImages/index";

export const usePersistentProfileImage = (gender) => {
    const selectedImageRef = useRef(null);
    const [isImageReady, setImageReady] = useState(false);

    useEffect(() => {
        if (!selectedImageRef.current && gender) {
            const formattedGender = gender.toLowerCase().replace(/-/g, '');
            let imageArray;
            if (formattedGender === 'male') {
                imageArray = maleImages;
            } else if (formattedGender === 'female') {
                imageArray = femaleImages;
            } else {
                imageArray = nonBinaryImages;
            }

            const randomImageIndex = Math.floor(Math.random() * imageArray.length);
            selectedImageRef.current = imageArray[randomImageIndex];
            setImageReady(true);
        }
    }, [gender]);

    return { profileImage: selectedImageRef.current, isImageReady };
};