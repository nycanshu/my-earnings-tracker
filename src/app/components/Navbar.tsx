"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loginsDisabled, setLoginsDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        setLoginsDisabled(false);
      }
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://my-earnings-tracker.onrender.com/auth/callback",
      },
    });
    if (error) console.error(error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-indigo-600 text-white">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => user && router.push("/")}
      >
        My Earning Tracker
      </h1>

      <div className="flex items-center space-x-4">
        {user && (
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition"
          >
            Dashboard
          </button>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <>
            {loginsDisabled ? (
              <p className="text-yellow-400">Login is disabled</p>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-700 transition"
              >
                Login
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
