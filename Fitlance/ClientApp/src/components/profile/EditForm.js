import React from "react";
import Cookies from "js-cookie";
import { Formik, Form } from "formik";
import { useQueryClient } from "@tanstack/react-query";

import { ProfileSchema } from "../../validators/Validate";
import { useProfileFormMutation } from "./hooks/useProfileFormMutation";

const EditForm = ({ setNeedsEdit, data }) => {
    const queryClient = useQueryClient();
    const userName = Cookies.get("UserName");
    const { mutate } = useProfileFormMutation(); 

    const { firstName, lastName, city, zipCode, bio } = data;

    const userData = {
        userName: userName,
        firstName: firstName === null ? "" : firstName,
        lastName: lastName === null ? "" : lastName,
        city: city === null ? "" : city,
        zipcode: zipCode === null ? "" : zipCode,
        bio: bio === null ? "" : bio
    };

    const backToProfile = () => {
        setNeedsEdit(false);
    };

    return (
        <Formik
            initialValues={userData}
            onSubmit={(values) => {
                mutate(values, {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["profile"] });
                        return backToProfile();
                    },
                    onError: (error) => {
                        console.log("query error", error);
                    }
                });
            }}
            validationSchema={ProfileSchema}
            enableReinitialize={true}
        >
            {(formik) => {
                const {
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    isValid,
                    dirty
                } = formik
                return (
                    <div className="flex flex-col md:flex-row">
                        <div className="border w-[100%] h-32 md:w-[20%] my-4">
                            <p>profile img</p>
                        </div>
                        <Form
                            className="grid grid-cols-12 grid-rows-min gap-4 my-4 p-2 md:w-[80%] h-[100%]"
                            onSubmit={handleSubmit}
                        >
                            <input
                                type="text"
                                name="firstName"
                                placeholder={firstName === null ? "First name" : firstName}
                                value={values.firstName}
                                onChange={handleChange}
                                className={`border w-full rounded-lg text-center p-1 col-span-12 md:col-span-6
                                    ${errors.firstName && touched.firstName ? "border-red-500" : "border-lime-500"}
                                `}
                            />
                            {errors.firstName && touched.firstName && (
                                <span className="text-red-500">{errors.firstName}</span>
                            )}
                            <input
                                type="text"
                                name="lastName"
                                placeholder={lastName === null ? "Last name" : lastName}
                                value={values.lastName}
                                onChange={handleChange}
                                className={`border w-full rounded-lg text-center p-1 col-span-12 md:col-span-6
                                    ${errors.lastName && touched.lastName ? "border-red-500" : "border-lime-500"}
                                `}
                            />
                            {errors.lastName && touched.lastName && (
                                <span className="text-red-500">{errors.lastName}</span>
                            )}
                            <input
                                type="text"
                                name="city"
                                placeholder={city === null ? "City" : city}
                                value={values.city}
                                onChange={handleChange}
                                className={`border w-full rounded-lg text-center p-1 col-span-12 md:col-span-6
                                    ${errors.city && touched.city ? "border-red-500" : "border-lime-500"}
                                `}
                            />
                            {errors.city && touched.city && (
                                <span className="text-red-500">{errors.city}</span>
                            )}
                            <input
                                type="text"
                                pattern="[0-9]{5}"
                                name="zipcode"
                                placeholder={zipCode === null ? "Zipcode" : zipCode}
                                value={values.zipcode}
                                onChange={handleChange}
                                className={`border w-full rounded-lg text-center p-1 col-span-12 md:col-span-6
                                    ${errors.zipcode && touched.zipcode ? "border-red-500" : "border-lime-500"}
                                `}
                            />
                            {errors.zipcode && touched.zipcode && (
                                <span className="text-red-500">{errors.zipcode}</span>
                            )}
                            <textarea
                                spellCheck="true"
                                type="text"
                                name="bio"
                                placeholder={bio === null ? "Bio" : bio}
                                value={values.bio}
                                onChange={handleChange}
                                className={`border w-full rounded-lg text-center p-1 col-span-12 md:h-32
                                    ${errors.bio && touched.bio ? "border-red-500" : "border-lime-500"}
                                `}
                            >Bio</textarea>
                            {errors.bio && touched.bio && (
                                <span className="text-red-500">{errors.bio}</span>
                            )}
                            <div className="flex justify-center col-span-12">
                                <button
                                    type="submit"
                                    className={`my-4 w-[8rem] h-[2rem] border rounded-full ${!(dirty && isValid) ? "" : "bg-green"}`}
                                    disabled={!(dirty && isValid)}
                                >
                                    Update
                                </button>
                                <button
                                    className="p-2"
                                    onClick={backToProfile}>
                                    Back to profile
                                </button>
                            </div>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
};

export default EditForm;