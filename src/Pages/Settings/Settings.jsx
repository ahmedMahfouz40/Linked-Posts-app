
import { faEye, faEyeSlash, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { useCallback, useReducer } from "react";

function changePassword(values) {
  return axios.patch(
    "https://route-posts.routemisr.com/users/change-password",
    values,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    },
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "CURRENT_PASSWORD":
      return { ...state, password: !state.password };
    case "NEW_PASSWORD":
      return { ...state, newPassword: !state.newPassword };
    case "CONFIRM_NEW_PASSWORD":
      return { ...state, confirmNewPassword: !state.confirmNewPassword };
    default:
      return state;
  }
}

const Settings = () => {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, {
    password: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const schema = z
    .object({
      password: z
        .string()
        .nonempty("Current Password is required!")
        .min(
          8,
          "At least 8 characters with uppercase, lowercase, number, and special character.",
        )
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must contain uppercase, lowercase, number and special character",
        ),

      newPassword: z
        .string()
        .min(1, "New password is required")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must contain uppercase, lowercase, number and special character",
        ),

      confirmPassword: z.string().min(1, "Please confirm the new password"),
    })
    .refine((data) => data.newPassword !== data.password, {
      message: "New password must be different from your current password",
      path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Password doesn't match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["profileData", res.data.data.token]);
      localStorage.setItem("token", res.data.data.token);
      toast.success(res.data.message);
      reset();
    },
    onError: (error) => {
      // FIX: avoid firing two toasts for the same error, fixed typo "Faild",
      // and used more accurate wording for a password-change context.
      const message = error.response?.data?.message;
      if (message === "jwt malformed") {
        toast.error("Password already changed");
      } else {
        toast.error(message ?? "Failed to change password");
      }
    },
  });

  const onSubmit = useCallback(
    (values) => {
      const { confirmPassword: _, ...data } = values;
      mutate(data);
    },
    [mutate],
  );

  return (
    <div className="h-screen py-25">
      <Helmet>
        <title>Change Password | Route Posts</title>
      </Helmet>
      <div className="mx-auto max-w-7xl  px-3  ">
        <main className="min-w-0">
          <div className="mx-auto max-w-2xl">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2] dark:bg-slate-800 dark:text-[#63b3ff]">
                  <FontAwesomeIcon icon={faKey} />
                </span>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
                    Change Password
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Keep your account secure by using a strong password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Current Password */}
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Current password
                  </span>

                  <div className="relative">
                    <input
                      {...register("password")}
                      placeholder="Enter current password"
                      className={` ${errors.password ? " border-red-600" : "border-slate-200 dark:border-slate-700"}     w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition dark:bg-slate-800 dark:text-slate-100`}
                      type={state.password ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "CURRENT_PASSWORD" })}
                      className="absolute top-1/2 end-2 -translate-y-1/2 cursor-pointer text-slate-700 dark:text-slate-400"
                    >
                      <FontAwesomeIcon
                        icon={state.password ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm dark:text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </label>

                {/* New Password */}
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    New password
                  </span>
                  <div className="relative">
                    <input
                      {...register("newPassword")}
                      placeholder="Enter new password"
                      className={` ${errors.newPassword ? " border-red-600 " : "border-slate-200 dark:border-slate-700"}   w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition dark:bg-slate-800 dark:text-slate-100`}
                      type={state.newPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "NEW_PASSWORD" })}
                      className="absolute top-1/2 end-2 -translate-y-1/2 cursor-pointer text-slate-700 dark:text-slate-400"
                    >
                      <FontAwesomeIcon
                        icon={state.newPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm dark:text-red-400">
                      {errors.newPassword.message}
                    </p>
                  )}
                </label>

                {/* Confirm New Password */}
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Confirm new password
                  </span>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      placeholder="Re-enter new password"
                      className={` ${errors.confirmPassword ? " border-red-600 outline-none" : "border-slate-200 dark:border-slate-700"}    w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition dark:bg-slate-800 dark:text-slate-100`}
                      type={state.confirmNewPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "CONFIRM_NEW_PASSWORD" })}
                      className="absolute top-1/2 end-2 -translate-y-1/2 cursor-pointer text-slate-700 dark:text-slate-400"
                    >
                      <FontAwesomeIcon
                        icon={state.confirmNewPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm dark:text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </label>

                {isSuccess && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Password changed successfully.
                  </div>
                )}

                {/* Update Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] cursor-pointer px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#3454c7] dark:hover:bg-[#2843a8]"
                >
                  {isPending ? "Updating..." : "Update password"}
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;