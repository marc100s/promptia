"use client";

import { useState, useEffect, useRef } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchTimeout = useRef(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/prompt");
      if (!response.ok) throw new Error("Failed to fetch prompts");
      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to fetch prompts"
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        if (!isMounted) return;
        setAllPosts(data);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPosts();

    return () => {
      isMounted = false;
      clearTimeout(searchTimeout.current);
    };
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout.current);
    setSearchText(e.target.value);

    searchTimeout.current = setTimeout(() => {
      const searchResult = filterPrompts(e.target.value);
      setSearchedResults(searchResult);
    }, 500);
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {isLoading && (
        <p className='mt-8 text-center text-gray-500'>Loading prompts...</p>
      )}
      {error && (
        <p className='mt-8 text-center text-red-500'>{error}</p>
      )}

      {!isLoading && !error && (
        searchText ? (
          <PromptCardList
            data={searchedResults}
            handleTagClick={handleTagClick}
          />
        ) : (
          <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
        )
      )}
    </section>
  );
};

export default Feed;
