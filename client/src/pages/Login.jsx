import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLoading, setUser } from '../redux/authSlice';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";

const Login = () => {

    useEffect(() => {
        document.title = "Login Page"
    }, [])

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
            role: "admin"
        }
    });
    const role = watch("role");

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = async (data) => {
        try {
            dispatch(setLoading(true));
            console.log('API URL:', import.meta.env.VITE_USER_ENDPOINT);

            const response = await axios.post(`${import.meta.env.VITE_USER_ENDPOINT}/login`, data,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            // console.log(response.data);
            console.log("API URL 2:", import.meta.env.VITE_USER_ENDPOINT);
            if (response.data.success) {
                dispatch(setUser(response.data.user));
                navigate('/home');

                if (response.data.user.role === "user") {
                    navigate('/home');
                }
                
                toast.success(response.data.message);
            }
        } catch (error) {
            // console.log(error);
            // console.log("REQUEST:", error.request);
            // console.log(error.response);
            toast.error(error.response?.data?.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">

            {/* Glass Card */}
            <form onSubmit={handleSubmit(submitHandler)}
                className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h2>

                {/* Email */}
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        className="w-full p-3 rounded-lg bg-white/80 border border-gray-300 outline-none"
                    />
                    {errors.email && <p className="text-white text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        className="w-full p-3 rounded-lg bg-white/80 border border-gray-300 outline-none"
                    />
                    {errors.password && <p className="text-white text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Role Selection */}

                <div className="mb-6">
                    <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                        {["admin", "user"].map((r) => (
                            <label
                                key={r}
                                className={`flex-1 text-center py-2 text-sm rounded-lg cursor-pointer transition-all capitalize
                                    ${role === r
                                        ? "bg-white text-black shadow-md"
                                        : "text-white/70 hover:text-white"
                                    }`}
                            >
                                <input type="radio" value={r} {...register("role", { required: "Please select a role" })} className="hidden" />
                                {r}
                            </label>
                        ))}
                    </div>
                    {errors.role && <p className="text-white text-sm mt-1">{errors.role.message}</p>}
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Please wait..." : "Login"}
                </button>

                {/* Signup */}
                <p className="text-center text-sm text-white mt-4">
                    Don't have an account?
                    <Link to="/signup" className="underline ml-1 font-medium">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login;