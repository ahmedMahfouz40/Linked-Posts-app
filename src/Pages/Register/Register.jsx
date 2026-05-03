import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { scheme } from "../../CompRegex/RegisterRegex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faCalendar,
  faKey,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

function signup(values) {
  return axios.post("https://route-posts.routemisr.com/users/signup", values, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const Register = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode: "onChange",
    resolver: zodResolver(scheme),
  });

  const { mutate: signupMutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (res) => {
      console.log(res);
      console.log(res.data?.message);
      toast.success(res.data?.message);
      navigate("/auth/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Faild to sign up", {
        position: "top-center",
      });
    },
  });

  return (
    <>
      <Helmet>
        <title>Create Account | Route Posts </title>
      </Helmet>
      <section className="  w-full max-w-107.5 lg:order-2 mx-auto">
        <div className="rounded-2xl bg-white p-4 sm:p-6">
          {/* header that is hidden before Lg size */}
          <div className="mb-4 text-center lg:hidden">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
              Route Posts
            </h1>
            <p className="mt-1 text-base font-medium leading-snug text-slate-700">
              Connect with friends and the world around you on Route Posts.
            </p>
          </div>
          {/* buttons to toggel about register and login components */}
          <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              className="rounded-lg py-2 text-sm font-extrabold transition text-slate-600 hover:text-slate-800"
            >
              <Link className="block " to={"/auth/login"}>
                Login
              </Link>
            </button>
            <button
              type="button"
              className="rounded-lg py-2 text-sm font-extrabold transition bg-white text-[#00298d] shadow-sm"
            >
              <Link className="block " to={"/auth/register"}>
                Register
              </Link>
            </button>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Create a new account
          </h2>
          <p className="mt-1 text-sm text-slate-500">It is quick and easy.</p>
          {/* form  */}
          <form
            onSubmit={handleSubmit(signupMutate)}
            className="mt-5 space-y-3.5"
          >
            {/* Full Name */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                {...register("name")}
                placeholder="Full name"
                className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                type="text"
                name="name"
              ></input>
            </div>
            {errors?.name && (
              <p className="text-red-500 text-[13px]">
                *{errors.name?.message}
              </p>
            )}
            {/* User Name */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FontAwesomeIcon icon={faAt} />
              </span>
              <input
                {...register("username")}
                placeholder="Username"
                className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                type="text"
                name="username"
              ></input>
            </div>

            {/* Email Address */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FontAwesomeIcon icon={faAt} />
              </span>
              <input
                {...register("email")}
                placeholder="Email address"
                className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                type="email"
                name="email"
              ></input>
            </div>
            {errors?.email && (
              <p className="text-red-500 text-[13px]">
                *{errors.email?.message}
              </p>
            )}

            {/* gender */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faUserGroup}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                {...register("gender")}
                name="gender"
                className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            {errors?.gender && (
              <p className="text-red-500 text-[13px]">
                *{errors.gender?.message}
              </p>
            )}
            {/* Date Of Birth */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FontAwesomeIcon icon={faCalendar} />
              </span>

              {/* dateOfBirth */}
              <label
                htmlFor="dateOfBirth"
                className=" sm:hidden font-semibold text-sm text-gray-600"
              >
                Date Of Birth
              </label>
              <input
                id="dateOfBirth"
                {...register("dateOfBirth")}
                type="date"
                placeholder="Date Of Birth"
                className="input input-primary w-full mb-4"
              />
            </div>
            {errors?.dateOfBirth && (
              <p className="text-red-500 text-[13px]">
                *{errors.dateOfBirth?.message}
              </p>
            )}
            {/* Password */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FontAwesomeIcon icon={faKey} />
              </span>
              <input
                {...register("password")}
                placeholder="Password"
                autoComplete="off"
                className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                type="password"
                name="password"
              ></input>
            </div>
            {errors?.password && (
              <p className="text-red-500 text-[13px]">
                *{errors.password?.message}
              </p>
            )}
            {/* RePassword */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FontAwesomeIcon icon={faKey} />
              </span>
              <input
                {...register("rePassword")}
                placeholder="Confirm password"
                autoComplete="off"
                className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                type="password"
                name="rePassword"
              ></input>
            </div>
            {errors?.rePassword && (
              <p className="text-red-500 text-[13px]">
                *{errors.rePassword?.message}
              </p>
            )}
            {/* Button */}
            <button
              disabled={isPending}
              className={`w-full rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 disabled:cursor-not-allowed  bg-[#00298d] hover:bg-[#001f6b]`}
            >
              Create New Account
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
