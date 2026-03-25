"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");
  const { id } = use(params);

  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${id}/posts`);
        if (!response.ok) throw new Error("Failed to fetch user posts");
        const data = await response.json();
        setUserPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPosts();
  }, [id]);

  if (isLoading) return <p className='mt-8 text-center text-gray-500'>Loading prompts...</p>;
  if (error) return <p className='mt-8 text-center text-red-500'>{error}</p>;

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
