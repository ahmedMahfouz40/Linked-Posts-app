import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { useCallback } from "react";

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

const Settings = () => {
  const queryClient = useQueryClient();

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
      message: "Passwords do not match",
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
      toast.error(error.response?.data?.message ?? "Faild to register");
      if (error.response?.data?.message === "jwt malformed")
        toast.error("Password Already Changed");
    },
  });

  const onSubmit = useCallback(
    (values) => {
      // remove confirmPass before sending data to backend
      const { confirmPassword: _, ...data } = values;
      mutate(data);
    },
    [mutate],
  );

  return (
    <>
      <Helmet>
        <title>Change Password | Route Posts</title>
      </Helmet>
      <div className="mx-auto max-w-7xl px-3 py-3.5 my-20">
        <main className="min-w-0">
          <div className="mx-auto max-w-2xl">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
                  <FontAwesomeIcon icon={faKey} />
                </span>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Change Password
                  </h1>
                  <p className="text-sm text-slate-500">
                    Keep your account secure by using a strong password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Current password
                  </span>
                  <input
                    {...register("password")}
                    placeholder="Enter current password"
                    className={` ${errors.password ? " border-red-600" : "border-slate-200 "}     w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition `}
                    type="password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    New password
                  </span>
                  <input
                    {...register("newPassword")}
                    placeholder="Enter new password"
                    className={` ${errors.newPassword ? " border-red-600 " : "border-slate-200 "}   w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition `}
                    type="password"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.newPassword.message}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Confirm new password
                  </span>
                  <input
                    {...register("confirmPassword")}
                    placeholder="Re-enter new password"
                    className={` ${errors.confirmPassword ? " border-red-600 outline-none" : "border-slate-200"}    w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition `}
                    type="password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </label>

                {isSuccess && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    Password changed successfully.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] cursor-pointer px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Updating..." : "Update password"}
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default Settings;
