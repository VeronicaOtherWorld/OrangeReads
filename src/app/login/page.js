"use client";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("enter email or password!");
      return;
    }

    if (isLogin) {
      console.log("loggin", email, password);
      const res = await axios.post(
        "/auth/login",
        { email, password },
        { validateStatus: () => true }
      );

      if (res.status === 200) {
        alert("login successfully");
        router.push("/");
      } else if (res.status === 404) {
        alert("not found");
      } else if (res.status === 401) {
        alert("invalid password");
      } else {
        alert(res.data?.error || "failure");
      }
    } else {
      console.log("registering", email, password);

      const res = await axios.post(
        "/auth/register",
        {
          email,
          password,
        },
        { validateStatus: () => true }
      );

      if (res.status === 201) {
        alert("success");
        setIsLogin(true);
      } else if (res.status === 409) {
        alert("user exists");
      } else {
        alert("failure" + res.data?.error);
      }
    }
  };

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen flex items-center justify-center bg-amber-100">
        <div className="flex bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
          {/* left pic */}
          <div className="w-1/2 flex items-center justify-center bg-yellow-300 relative">
            <img src="/asset/login_pic.png" alt="img" />
          </div>
          {/* right  content */}
          {/* tabs */}
          <div className="w-1/2 p-10">
            <div className="flex mb-6">
              <button
                className={`flex-1 py-2 font-semibold border-b-2 transition-all duration-300 ${
                  isLogin ? "border-yellow-400" : "border-transparent"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 font-semibold border-b-2 transition-all duration-300 ${
                  !isLogin ? "border-yellow-400" : "border-transparent"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>
            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-300 py-2 rounded-md font-bold hover:bg-yellow-500 transition"
              >
                {isLogin ? "Login" : " Create Account"}
              </button>

              {isLogin ? (
                <div className="text-sm mt-4 text-center">
                  Do not have an account?
                  <span
                    className="text-yellow-500 cursor-pointer"
                    onClick={() => setIsLogin(false)}
                  >
                    register
                  </span>
                </div>
              ) : (
                <div className="text-sm mt-4 text-center">
                  have an account?
                  <span
                    className="text-yellow-500 cursor-pointer "
                    onClick={() => setIsLogin(true)}
                  >
                    login
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
