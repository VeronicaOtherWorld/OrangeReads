"use client";
import { useEffect, useState } from "react";
import myAxios from "@/lib/myAxios";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await myAxios.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        if (error?.response?.status === 401) {
          // not login yet
          setUser(null);
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setChecking(false);
      }
    };
    fetchUser();
  }, []);

  return { user, checking };
}
