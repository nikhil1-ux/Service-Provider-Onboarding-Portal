import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Register = () => {
  const { register: registerUser } = useAuth();
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
      await registerUser(data);

      toast.success("Registration successful!");

      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Registration failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create Account</h1>
        <p className="muted">Service Provider Onboarding Portal</p>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          {...register("name", {
            required: "Name is required",
          })}
        />
        {errors.name && (
          <p className="error">{errors.name.message}</p>
        )}

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
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}

        <label>Role</label>
        <select
          {...register("role", {
            required: "Role is required",
          })}
        >
          <option value="">Select Role</option>
          <option value="provider">Provider</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="error">{errors.role.message}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="muted small">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;