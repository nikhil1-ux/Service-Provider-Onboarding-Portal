import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const user = await login(data.email, data.password);

      toast.success("Welcome back!");

      navigate(user.role === "admin" ? "/admin" : "/provider");
    } 
    catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Login failed");
      } 
      else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign In</h1>
        <p className="muted">Service Provider Onboarding Portal</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
          })}
        />
        {errors.email && (
          <p className="error">{errors.email.message}</p>
        )}

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="muted small">
          New provider? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;