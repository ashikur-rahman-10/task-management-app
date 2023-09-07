import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const Register = () => {
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const { createUser, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_HOSTING_KEY
    }`;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        const { name, email, password, photo, confirmPass, bio } = data;

        if (password === confirmPass) {
            const formData = new FormData();

            formData.append("image", data.image[0]);
            fetch(imageHostingUrl, {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((imgResponse) => {
                    if (imgResponse.success) {
                        const imgUrl = imgResponse.data.display_url;
                        const savedUser = {
                            name,
                            email,
                            photoURL: imgUrl,
                            bio,
                        };

                        // Get the existing users array from local storage or initialize an empty array
                        const users =
                            JSON.parse(localStorage.getItem("users")) || [];

                        // Add the new user to the array
                        users.push(savedUser);

                        // Save the updated array of users back to local storage
                        localStorage.setItem("users", JSON.stringify(users));

                        // Continue with the registration process or other actions as needed
                        createUser(email, password)
                            .then((result) => {
                                const loggedUser = result.user;
                                updateUser(name, imgUrl)
                                    .then((result) => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "User Created Successfully. Please Login to continue",
                                            showConfirmButton: false,
                                            timer: 3000,
                                        });

                                        setError("");

                                        logout()
                                            .then((result) => {
                                                navigate("/login");
                                            })
                                            .catch((error) => {});
                                    })
                                    .catch(() => {
                                        console.log(error.message);
                                    });
                            })
                            .catch((error) => {
                                console.log(error.message);
                                setError(error.message);
                            });
                    }
                });
        } else {
            Swal.fire({
                icon: "error",
                title: "Password is not matching",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
    };

    // Scroll to top
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
    return (
        <div className="min-h-screen w-full max-w-7xl py-16 mx-auto flex items-center justify-center ">
            <Helmet>
                <title>Sign up</title>
            </Helmet>
            <div className="flex md:flex-row-reverse flex-col-reverse items-center justify-center w-full ">
                <div className=" p-4 w-full max-w-4xl md:ml-20">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="shadow-md shadow-purple-500 rounded-xl  md:p-10 p-6 "
                    >
                        <h1 className="text-center  md:text-4xl text-2xl my-10 md:my-5">
                            Sign Up
                        </h1>
                        <div className="md:flex md:gap-5">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text ">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="name"
                                    {...register("name", { required: true })}
                                    className="input input-bordered input-info text-black"
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text ">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="email"
                                    {...register("email", { required: true })}
                                    className="input input-bordered input-info text-black"
                                />
                            </div>
                        </div>
                        <div className="md:flex gap-5 relative z-0">
                            <div className="form-control w-full h-fit relative">
                                <label className="label">
                                    <span className="label-text ">
                                        New Password
                                    </span>
                                </label>
                                <input
                                    type={show ? "text" : "password"}
                                    placeholder="new password"
                                    {...register("password", {
                                        pattern:
                                            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{6,}/,
                                        minLength: 6,
                                        required: true,
                                    })}
                                    className="input input-bordered input-info text-black"
                                />

                                <span
                                    onClick={() => {
                                        setShow(!show);
                                    }}
                                    className="absolute bottom-4 right-3"
                                >
                                    {show ? (
                                        <FaEyeSlash className="text-black"></FaEyeSlash>
                                    ) : (
                                        <FaEye className="text-black"></FaEye>
                                    )}
                                </span>
                            </div>
                            {(errors.password?.type === "pattern" ||
                                errors.password?.type === "minLength") && (
                                <div className="alert alert-warning absolute z-10 max-w-sm top-24">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                    <span className="text-xs text-red-600 mt-3">
                                        password is less than 6 characters, or
                                        don't have a capital letter, or don't
                                        have a special character
                                    </span>
                                </div>
                            )}
                            <div className="form-control w-full h-fit relative">
                                <label className="label">
                                    <span className="label-text ">
                                        Confirm Password
                                    </span>
                                </label>
                                <input
                                    type={show ? "text" : "password"}
                                    placeholder="type your password again"
                                    {...register("confirmPass", {
                                        required: true,
                                    })}
                                    className="input input-bordered input-info text-black"
                                />
                            </div>
                        </div>

                        <div className="md:flex md:gap-5">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-white">
                                        Photo
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    {...register("image", { required: true })}
                                    className="file-input file-input-bordered text-black input-info w-full"
                                />
                            </div>
                            <div className="form-control  mx-auto w-full">
                                <label className="label">
                                    <span className="label-text ">Bio</span>
                                </label>
                                <textarea
                                    type="text"
                                    {...register("bio", { required: true })}
                                    placeholder="your bio"
                                    className="textarea textarea-bordered textarea-info  text-black"
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-center items-center">
                            {error && (
                                <small className="text-red-600 my-4 font-medium">
                                    {error}
                                </small>
                            )}
                        </div>
                        <div>
                            <input
                                type="submit"
                                value={"Register"}
                                className="input input-bordered w-full hover:bg-transparent hover:text-info bg-info  my-7 input-info"
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <Link
                                to={"/login"}
                                className="text-xs hover:underline text-warning font-medium"
                            >
                                Already have account? | Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
