"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

export default function Signin() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          pass: form.password,
        }),
      });

      const data = await response.json();
      console.log("got the response");
      if (response.status === 200 && data.status === "success") {
        localStorage.setItem("jwtToken", data.jwt);
        console.log("success 200");
        toast.success("Login successful! Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        window.alert("Invalid Credentials");
        console.log("toast error");
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl"></div>

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-xl relative z-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Glowing Profile Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/50 animate-pulse">
            <UserIcon className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Welcome Admin
          </h1>
          <p className="text-sm text-gray-400 tracking-wide">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={handleChange}
              className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-gray-800/80 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={handleChange}
              className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-gray-800/80 transition-all duration-300"
            />
          </div>

          <p className="text-sm text-gray-400 text-center">
            Enter your credentials to continue
          </p>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg py-3 font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 shadow-md hover:shadow-green-500/30 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin text-white w-5 h-5" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-green-400 hover:text-green-300 transition"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}