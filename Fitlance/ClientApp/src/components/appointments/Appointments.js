import React, { useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getUserAppointments, getTrainerAppointments } from "../../services/AppointmentService";
import SingleAppointment from "./SingleAppointment";
import CustomToolbar from "./CustomToolbar";
import useLazyLoadItems from "./hooks/useLazyLoadItems";
import "./calendar-styles.css";

const Appointments = () => {
    const role = Cookies.get("Role");
    const appointmentsContainerRef = useRef();
    const { data, isLoading, isError, error, refetch } = useQuery(["getAppointments"], role === "User" ? getUserAppointments : getTrainerAppointments);

    const displayedAppointments = useLazyLoadItems(data, 5, appointmentsContainerRef);
    const localizer = momentLocalizer(moment);


    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary animate-spin" />
            </div>
        );
    };

    console.log(data)

    if (isError) {
        return (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="p-4 bg-white rounded-lg shadow-xl text-center">
                    <h2 className="text-xl font-bold text-red-600">An Error Occurred</h2>
                    <p className="text-red-600">{error.message}</p>
                    <button
                        onClick={handleRetry}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const calendarEvents = () => {
        return data?.map((appointment) => ({
            start: new Date(appointment.startTimeUtc),
            end: new Date(appointment.endTimeUtc),
        })) || [];
    };


    return (
        <section className="flex justify-center">
            <div className="mt-8 md:mt-12 mb-20 w-full">
                <div className=" flex justify-start">
                    <h1 className="text-2xl">
                        Appointments
                    </h1>
                </div>
                <div className="md:flex md:justify-around md:items-start md:space-x-2 mt-6">
                    <div className="h-[32rem] md:w-2/5">
                        <Calendar
                            events={calendarEvents()}
                            startAccessor="start"
                            endAccessor="end"
                            localizer={localizer}
                            components={{
                                toolbar: (props) => <CustomToolbar {...props} localizer={localizer} />,
                            }}/>
                    </div>
                    <div ref={appointmentsContainerRef} className="md:w-1/2 h-[50rem] overflow-y-auto">
                        {displayedAppointments.map((appointment, i) => {
                            return (
                                <SingleAppointment key={i} appointment={appointment}/>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Appointments;