import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, User, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const Signup = ({ onSignup }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [instituteSettings, setInstituteSettings] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const API_BASE = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Watch password for confirmation validation
    const password = watch("password");

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

            // Remove confirmPassword from data before sending
            const { confirmPassword, ...submitData } = data;

            const res = await fetch(
                `${API_BASE.replace("/api", "")}/register`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(submitData),
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-4">
            <div className="max-w-md w-full">
                {/* Compact Header */}
                <div className="text-center mb-6">
                    {loadingSettings ? (
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm animate-pulse" />
                    ) : instituteSettings &&
                      (instituteSettings.logo || instituteSettings.name) ? (
                        <>
                            {instituteSettings.logo ? (
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={`${API_BASE.replace("/api", "")}/uploads/${instituteSettings.logo}`}
                                        alt="Institute Logo"
                                        className="max-w-full h-auto max-h-24 object-contain rounded-lg"
                                    />
                                </div>
                            ) : null}
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                {instituteSettings.name}
                            </h1>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Sign Up
                            </h1>
                        </>
                    )}
                    <p className="text-sm text-gray-600">Create your account</p>
                </div>

                {/* Compact Signup Form */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-white/20">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-xs font-medium text-gray-700 mb-1"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    {...register("username", {
                                        required: "Username is required",
                                    })}
                                    className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border transition-all duration-200 ease-in-out ${
                                        errors.username
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Role Field */}
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-xs font-medium text-gray-700 mb-1"
                            >
                                Role
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    id="role"
                                    {...register("role", {
                                        required: "Role is required",
                                    })}
                                    className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border transition-all duration-200 ease-in-out ${
                                        errors.role
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    }`}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                            {errors.role && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Min 6 characters",
                                        },
                                    })}
                                    className={`w-full pl-9 pr-8 py-2.5 text-sm rounded-lg border transition-all duration-200 ease-in-out ${
                                        errors.password
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    }`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-xs font-medium text-gray-700 mb-1"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmPassword"
                                    {...register("confirmPassword", {
                                        required: "Please confirm password",
                                        validate: (value) =>
                                            value === password ||
                                            "Passwords don't match",
                                    })}
                                    className={`w-full pl-9 pr-8 py-2.5 text-sm rounded-lg border transition-all duration-200 ease-in-out ${
                                        errors.confirmPassword
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    }`}
                                    placeholder="Confirm Password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.01] shadow-sm hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing up...
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </button>

                        {/* Login Redirect Link */}
                        <div className="text-center mt-2">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Compact Footer */}
                <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">
                        © 2025 blacklytning. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
