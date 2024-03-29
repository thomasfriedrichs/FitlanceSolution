﻿import React from "react";
import { Field, Formik, Form } from "formik";
import Cookies from "js-cookie";

import { RegisterSchema } from "../../validators/Validate";
import { register } from "../../services/AuthService";

const Register = () => {

    const initialValues = {
        username: "",
        email: "",
        password: "",
        role: ""
    };

    const handleRegistration = async (values) => {
        try {
            const response = await register(values.username, values.email, values.password, values.role);
            if (response) {
                Cookies.set("Id", response.Id)
                Cookies.set("Role", response.userRole[0])
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={RegisterSchema}
            onSubmit={handleRegistration}
        >
            {(formik) => {
                const {
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    handleBlur,
                    isValid,
                    dirty,
                } = formik;

                return (
                    <div className="flex flex-col gap-y-4">
                        <h1 className="text-3xl text-center">Sign up to continue</h1>
                        <Form onSubmit={handleSubmit}>
                            <div className="my-4">
                                <div className="w-full">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full rounded-full text-center p-2
                                        ${errors.email && touched.email ? "border-red-500" : "border-lime-500"}
                                        `}
                                    />
                                </div>
                                {errors.username && touched.username && (
                                    <span className="text-red-500">{errors.username}</span>
                                )}
                            </div>
                            <div className="w-full">
                                <div className="w-full">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full rounded-full text-center p-2
                                        ${errors.password && touched.password ? "border-red-500" : "border-lime-500"}
                                        `}
                                    />
                                    {errors.email && touched.email && (
                                        <span className="text-red-500">{errors.email}</span>
                                    )}
                                </div>
                            </div>
                            <div className="my-4">
                                <div className="w-full">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full rounded-full text-center p-2
                                        ${errors.password && touched.password ? "border-red-500" : "border-lime-500"}
                                        `}
                                    />
                                    {errors.password && touched.password && (
                                        <span className="text-red-500">{errors.password}</span>
                                    )}
                                </div>
                            </div>
                            <div
                                role="group"
                                id="radio-group"
                                aria-labelledby="radio-group"
                                className="flex flex-row justify-around"
                            >
                                <label htmlFor="user" className={`cursor-pointer w-36 text-center rounded-full p-2 transition-colors border-2 hover:border-slate-400 duration-300 ease-in-out ${values.role === "User" ? "bg-green text-white" : "hover:border-2"}`}>
                                    <Field type="radio" id="user" name="role" value="User" className="hidden" />
                                    Sign up as User
                                </label>
                                <label htmlFor="trainer" className={`cursor-pointer w-36 text-center rounded-full p-2 transition-colors border-2 hover:border-slate-400 duration-300 ease-in-out ${values.role === "Trainer" ? "bg-green text-white" : ""}`}>
                                    <Field type="radio" id="trainer" name="role" value="Trainer" className="hidden" />
                                    Sign up as Trainer
                                </label>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className={`my-4 w-[8rem] h-[2rem] rounded-full transition-colors border-2 hover:border-slate-400 duration-300 ease-in-out ${!(dirty && isValid) ? "" : "bg-green"}`}
                                    disabled={!(dirty && isValid)}
                                >
                                    Sign up
                                </button>
                            </div>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
};

export default Register;