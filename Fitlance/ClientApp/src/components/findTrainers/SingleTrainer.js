import React, { useState } from "react";

import images from "./../../assets/profileImages/index";
import AppointmentForm from "../appointments/AppointmentForm";
import { postAppointment } from "../../services/AppointmentService";

const SingleTrainer = ({ trainer, imageIndex }) => {
    const {
        firstName,
        lastName,
        city,
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

    return (
        <article className={`relative border-b rounded-sm flex flex-col xl:flex-row justify-between items-start hover:bg-slate-100 mb-4 pb-8 md:pb-2 md:h-auto`}>
            <div className="flex flex-row items-center">
                <div className="p-2">
                    <img
                        className="object-cover h-24 w-24 rounded-full"
                        src={images[imageIndex].image}
                        alt={`Profile of ${firstName} ${lastName}`}
                    />
                </div>
                <div className="flex flex-col justify-between w-full md:ml-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-xl font-semibold">{`${firstName} ${lastName}`}</h2>
                        <p className="font-semibold">{`${city}, ${gender}, ${yearsOfExperience} years experience`}</p>
                    </div>
                    <p className="my-2">{bio}</p>
                    <div className="text-sm">
                        <p>Specialization: {specialization}</p>
                        <p>Nutrition Certification: {nutritionCertification}</p>
                        <p>Hourly Rate: ${hourlyRate}</p>
                        <p>Rating: {rating} stars</p>
                        <p>Second Language: {secondLanguage}</p>
                        <p>Review Count: {reviewCount}</p>
                        <p>Certifications: {certificationsStr}</p>
                        <p>Availability: {availabilityStr}</p>
                        <p>Client Skills: {clientSkillStr}</p>
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