import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const Signup = ({ onSignup }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [instituteSettings, setInstituteSettings] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const API_BASE = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstituteSettings = async () => {
            try {
                setLoadingSettings(true);
                const response = await fetch(`${API_BASE}/settings/institute`);
                if (response.ok) {
                    const data = await response.json();
                    setInstituteSettings(data);
                } else {
                    setInstituteSettings(null);
                }
            } catch (error) {
                setInstituteSettings(null);
            } finally {
                setLoadingSettings(false);
            }
        };
        fetchInstituteSettings();
    }, [API_BASE]);

    const onSubmit = async (data) => {
        try {
            const headers = { "Content-Type": "application/json" };
            const token = localStorage.getItem("access_token");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            const res = await fetch(
                `${API_BASE.replace("/api", "")}/register`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(data),
                },
            );
            if (!res.ok) {
                const result = await res.json();
                if (res.status === 403) {
                    toast.error(
                        "You are not authorized to register a new user. Please login as an admin.",
                    );
                    return;
                }
                if (
                    result.detail &&
                    result.detail.toLowerCase().includes("admin")
                ) {
                    toast.error(
                        "Registration is closed. Please contact an admin.",
                    );
                    return;
                }
                toast.error(result.detail || "Registration failed");
                return;
            }
            const result = await res.json();
            toast.success("Registration successful! Logging you in...");
            if (onSignup) onSignup(result.access_token);
            navigate("/");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Header Section */}
                <div className="text-center mb-8">
                    {loadingSettings ? (
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse" />
                    ) : instituteSettings &&
                      (instituteSettings.logo || instituteSettings.name) ? (
                        <>
                            {instituteSettings.logo ? (
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border">
                                    <img
                                        src={`${API_BASE.replace("/api", "")}/uploads/${instituteSettings.logo}`}
                                        alt="Institute Logo"
                                        className="w-16 h-16 object-contain"
                                    />
                                </div>
                            ) : null}
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {instituteSettings.name}
                            </h1>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Lock className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Sign Up
                            </h1>
                        </>
                    )}
                    <p className="text-gray-600">Create your account</p>
                </div>

                {/* Signup Form */}
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-white/20">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    {...register("username", {
                                        required: "Username is required",
                                    })}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ease-in-out ${
                                        errors.username
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter your username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 ease-in-out ${
                                        errors.password
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Role Field */}
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Role
                            </label>
                            <select
                                id="role"
                                {...register("role", {
                                    required: "Role is required",
                                })}
                                className={`w-full pl-3 pr-4 py-3 rounded-xl border transition-all duration-200 ease-in-out ${
                                    errors.role
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                            >
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-sm hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing up...
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        © 2025 blacklytning. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
