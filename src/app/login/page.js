"use client";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("logging", email, password);
    } else {
      console.log("registering", email, password);
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
                    className="text-yellow-500 cursor-pointer"
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
