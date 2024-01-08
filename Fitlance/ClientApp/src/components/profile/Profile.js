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
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary animate-spin" />
            </div>
        );
    };


    if (isError) {
        return <span className="mt-32">Error: {error.message}</span>
    };

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