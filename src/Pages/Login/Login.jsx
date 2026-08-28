import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";
import { useMutation } from "@tanstack/react-query";
import { scheme } from "../../CompRegex/LoginRegex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faEye,
  faEyeSlash,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import AuthContext from "../../Contexts/AuthContext/authContext";

function signin(values) {
  return axios.post("https://route-posts.routemisr.com/users/signin", values, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
const Login = () => {
  const { setUserToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPasswrod, setShowPassword] = useState(false);
  const { mutate: signinMutate, isPending } = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      navigate("/");
      
      
      localStorage.setItem("token", data.data.data.token);
      setUserToken(data.data.data.token);
      toast.success(data.message, {
        delay: 1000,
      });
    },
    onError: (error) => {
     
      toast.error(error.response?.data?.message ?? "Faild to sign in");
      setError("password", { message: error.response?.data?.message });
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(scheme),
  });

  return (
    <>
      <Helmet>
        <title>Sign In | Route Posts </title>
      </Helmet>
      <section className="  w-full max-w-107.5 lg:order-2 mx-auto">
        <div className="rounded-2xl bg-white p-4 sm:p-6 dark:bg-slate-900">
          {/* header that is hidden before Lg size */}
          <div className="mb-4 text-center lg:hidden">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d] dark:text-[#8fa8ff]">
              Route Posts
            </h1>
            <p className="mt-1 text-base font-medium leading-snug text-slate-700 dark:text-slate-300">
              Connect with friends and the world around you on Route Posts.
            </p>
          </div>
          {/* buttons to toggel about register and login components */}
          <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              className="rounded-lg py-2 text-sm font-extrabold transition bg-white text-[#00298d] shadow-sm dark:bg-slate-700 dark:text-[#8fa8ff]"
            >
              <Link className="block " to={"/auth/login"}>
                Login
              </Link>
            </button>
            <button
              type="button"
              className="rounded-lg py-2 text-sm font-extrabold transition text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Link className="block " to={"/auth/register"}>
                Register
              </Link>
            </button>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Log in to Route Posts
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Log in and continue your social journey.
          </p>

          {/* form  */}
          <form
            onSubmit={handleSubmit(signinMutate)}
            className="mt-5 space-y-3.5"
          >
            {/* Email Address */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <FontAwesomeIcon icon={faAt} />
              </span>
              <input
                {...register("email")}
                placeholder="Email address"
                className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d] dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:focus:bg-slate-900 dark:focus:border-[#8fa8ff]"
                type="email"
                name="email"
              ></input>
            </div>
            {errors?.email && (
              <p className="text-red-500 text-[13px] dark:text-red-400">
                *{errors.email?.message}
              </p>
            )}
            {/* Password */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <FontAwesomeIcon icon={faKey} />
              </span>
              <input
                {...register("password")}
                placeholder="Password"
                autoComplete="off"
                className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d] dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:focus:bg-slate-900 dark:focus:border-[#8fa8ff]"
                type={showPasswrod ? "text" : "password"}
                name="password"
              ></input>
              <FontAwesomeIcon
                onClick={() => setShowPassword((prev) => !prev)}
                icon={showPasswrod ? faEyeSlash : faEye}
                className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer dark:text-slate-500"
              />
            </div>
            {errors?.password && (
              <p className="text-red-500 text-[13px] dark:text-red-400">
                *{errors.password?.message}
              </p>
            )}
            {/* Button */}
            <button
              disabled={isPending}
              className="w-full rounded-xl py-3 text-base font-extrabold bg-[#00298d] hover:bg-[#001f6b] text-white transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#3454c7] dark:hover:bg-[#2843a8]"
            >
              Log In
            </button>
            <button
              type="button"
              className="mx-auto block text-sm font-semibold text-[#00298d] transition hover:underline dark:text-[#8fa8ff]"
            >
              Forgot password?
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;