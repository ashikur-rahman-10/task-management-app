import React, { useState } from "react";
import loginImg from "../../assets/images/loginGirl.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { set, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import GoogleLogin from "../../Components/GoogleLogin/GoogleLogin";
import useAuth from "../../Hooks/UseAuth";

const Login = () => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { loginWithPass, passwordReset } = useAuth();
  const location = useLocation();
  const from = location?.state?.pathname || "/";
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    loginWithPass(data.email, data.password)
      .then(async (result) => {
        setError("");
        Swal.fire({
          icon: "success",
          title: "User Login Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log({ result });
        navigate(from);
        console.log(from);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error.message);
      });
  };
  const handleForgetPass = () => {
    Swal.fire({
      title: "Submit your email",
      input: "email",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        passwordReset(email)
          .then((result) => {
            Swal.fire({
              title: "Please check your Inbox!",
              text: "We sent you a Password reset email",
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Please check your email!",
              text: "You provide a wrong email.",
            });
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  };

  // Scroll to top
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto flex items-center justify-center">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="flex md:flex-row flex-col-reverse items-center justify-center w-full ">
        <div className="md:w-1/2  ">
          <img className="p-10 md:p-0" src={loginImg} alt="" />
        </div>
        <div className="md:w-1/2 p-4 w-full max-w-md md:ml-20">
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="shadow-md shadow-[#9BC1DE]  rounded-xl  md:p-10 p-6 "
          >
            <h1 className="text-center md:text-4xl text-2xl my-10">Login</h1>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                {...register("email")}
                className="input input-bordered input-info bg-transparent"
              />
            </div>
            <div className="form-control w-full h-fit relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={show ? "text" : "password"}
                placeholder="password"
                {...register("password")}
                className="input input-bordered input-info bg-transparent"
              />
              <span
                onClick={() => {
                  setShow(!show);
                }}
                className="absolute bottom-4 right-3"
              >
                {show ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
              </span>
            </div>
            {error && (
              <span>
                <p className="text-xs font-medium text-error mt-5">{error}</p>
              </span>
            )}
            <div>
              <input
                type="submit"
                value={"Login"}
                className="input input-bordered w-full hover:bg-transparent hover:text-info bg-info my-7 input-info"
              />
            </div>
            <div className="mb-4">
              <GoogleLogin />
            </div>
            <div className="flex items-center justify-center">
              <Link
                onClick={handleForgetPass}
                className="text-xs hover:underline text-error font-medium"
              >
                Forget Password?
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <Link
                to={"/register"}
                className="text-xs hover:underline text-warning font-medium"
              >
                Are you new? | Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
