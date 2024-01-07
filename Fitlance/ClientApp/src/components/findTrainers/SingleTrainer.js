﻿import React, { useState } from "react";

import images from "./../../assets/profileImages/index";
import AppointmentForm from "../appointments/AppointmentForm";
import { postAppointment } from "../../services/AppointmentService";
import RatingStars from "./RatingStars";

const SingleTrainer = ({ trainer, imageIndex }) => {
    const {
        firstName,
        lastName,
        bio,
        gender,
        specialization,
        nutritionCertification,
        yearsOfExperience,
        rating,
        hourlyRate,
        secondLanguage,
        reviewCount,
        certifications,
        availability,
        clientSkill,
        id
    } = trainer;
    const [appointmentFormView, setAppointmentFormView] = useState(false);

    const toggleDropdownForm = () => {
        setAppointmentFormView(!appointmentFormView);
    };

    const certificationsStr = certifications.join(', ');
    const availabilityStr = availability.join(', ');
    const clientSkillStr = clientSkill.join(', ');

    const formatRatingWithOneDecimal = (rating) => {
        return rating.toFixed(1);
    }
    const formattedRating = formatRatingWithOneDecimal(rating);

    const getPronouns = (gender) => {
        const pronouns = {
            male: "He/Him",
            female: "She/Her",
            nonbinary: "They/Them"
        };
        return pronouns[gender.toLowerCase()] || "Not specified";
    };

    return (
        <article className={`relative border-b rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mb-6 bg-white flex flex-col xl:flex-row justify-between items-start hover:bg-slate-100 px-2 pb-12 md:pb-2 md:h-auto`}>
            <div className="flex flex-row items-center">
                <div className="flex flex-col justify-between w-full md:ml-4">
                    <div className="flex items-center space-x-4">
                        <img
                            className="h-24 w-24 rounded-full object-cover"
                            src={images[imageIndex].image}
                            alt={`Profile of ${firstName} ${lastName}`}
                        />
                        <div>
                            <h2 className="text-xl font-bold">{firstName} {lastName}</h2>
                            <div className="flex items-center space-x-1">
                                <span className="text-lg font-semibold">{formattedRating}</span>
                                <RatingStars rating={rating} />
                            </div>
                            <p className="text-sm text-gray-600">{reviewCount} Reviews</p>
                            <div className="flex flex-row space-x-2">
                                <p className="text-sm text-gray-600">{getPronouns(gender)}</p>
                                <p className="text-sm text-gray-600">{yearsOfExperience} YOE</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-800 p-1">{bio}</p>
                    <div className="text-sm">
                        <p className="font-bold p-1">Hourly Rate: <span className="font-normal">${hourlyRate} Per Hour</span></p>
                        <p className="font-bold p-1">Certifications: <span className="font-normal">{certificationsStr || 'Not specified'}</span></p>
                        <p className="font-bold p-1">Availability: <span className="font-normal">{availabilityStr || 'Not specified'}</span></p>
                        <p className="font-bold p-1">Client Skills: <span className="font-normal">{clientSkillStr || 'Not specified'}</span></p>
                    </div>
                </div>
            </div>
            <section className={`${appointmentFormView ? "block" : "hidden"} w-full xl:w-1/2 pb-10`}>
                {appointmentFormView && (
                    <AppointmentForm
                        toggleView={toggleDropdownForm}
                        query={postAppointment}
                        reqType={"post"}
                        trainerId={id}
                    />
                )}
            </section>
            <button
                onClick={toggleDropdownForm}
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 p-2 ${appointmentFormView ? "hover:text-red-500" : "hover:text-green"} rounded-lg focus:outline-none`}
                aria-expanded={appointmentFormView}
            >
                {appointmentFormView ? "Close" : "Make Appointment"}
            </button>
        </article>
    )
}

export default SingleTrainer;