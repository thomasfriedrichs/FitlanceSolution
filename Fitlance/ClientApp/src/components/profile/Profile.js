import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import EditForm from "./EditForm";
import UserInfo from "./UserInfo";
import { fetchProfile } from "../../services/ProfileService";
import Appointments from "../appointments/Appointments";

const Profile = () => {
    const { data, isLoading, isError, error } = useQuery(["profile"], fetchProfile);
    const [editView, setEditView] = useState(false);

    const editProfile = () => {
        setEditView(true);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                <FontAwesomeIcon
                    data-testid="loading-spinner"
                    icon={faSpinner}
                    className="text-4xl text-primary animate-spin" />
            </div>
        );
    };


    if (isError) {
        return (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="p-4 bg-white rounded-lg shadow-xl text-center">
                    <h2 className="text-xl font-bold text-red-600">An Error Occurred</h2>
                    <p className="text-red-600">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="flex justify-center">
            <div className="mt-8 md:mt-12 mb-20 p-8 w-full md:w-[80vw] h-full">
                <div className="flex justify-between">
                    <h1 className="text-4xl">Profile</h1>
                    {editView ?
                        null
                        :
                        <button
                            className="text-green"
                            onClick={editProfile}>
                            Edit Profile
                        </button>}
                </div>
                <section>
                    {editView ?
                        <EditForm
                            setNeedsEdit={setEditView}
                            data={data} />
                        :
                        <UserInfo data={data} />
                    }
                </section>
                <section>
                    <Appointments />
                </section>
            </div>
        </div>
    );
};

export default Profile;