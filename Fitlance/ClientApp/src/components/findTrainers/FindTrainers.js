import React from "react";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import SingleTrainer from "./SingleTrainer";
import useLazyLoadTrainers from "./hooks/useLazyLoadTrainers";

const FindTrainers = () => {
    const { displayedTrainers, isLoading, isError, error, loader } = useLazyLoadTrainers();

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary animate-spin" />
            </div>
        );
    };


    if (isError) {
        return <span className="mt-32">Error: {error.message}</span>
    };

    return (
        <div className="flex justify-center">
            <div className="mt-8 md:mt-12 mb-20 p-4 md:p-8 w-full md:w-[80vw] h-full">
                <div className="flex justify-start mt-2">
                    <h1 className="text-4xl">
                        Find Trainers
                    </h1>
                </div>
                <div className="mt-10">
                    {displayedTrainers.map((trainer, i) => {
                        const imageIndex = Math.floor(Math.random() * 61);
                        return (
                            <SingleTrainer
                                key={i}
                                trainer={trainer}
                                imageIndex={imageIndex}/>
                        );
                    })}
                    <div ref={loader} className="loading-indicator">
                        {isLoading && <span>Loading more trainers...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindTrainers;