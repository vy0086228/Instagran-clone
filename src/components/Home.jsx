import React, { useEffect, useState } from "react";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import { Outlet } from "react-router-dom";
import useGetAllPost from "@/hooks/useGetAllPost";

const Home = () => {
  useGetAllPost();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an async operation that might block rendering (like network request)
    const timeout = setTimeout(() => {
      setLoading(false); // Update state when done
    }, 2000); // Timeout to simulate async behavior

    return () => clearTimeout(timeout); // Clean up the timeout on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Return a loading indicator while waiting
  }

  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
