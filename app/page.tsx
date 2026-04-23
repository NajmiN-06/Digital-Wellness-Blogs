"use client";

import { useState, useEffect } from "react";
import Banner from "./components/Banner";
import SearchSidebar from "./components/Sidebar";
import BlogCard from "./components/BlogCard";
import { getAllPosts } from "./actions/posts"; // Ensure this is exported from your actions

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); 
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial posts on page load
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        const initialPosts = await getAllPosts();
        setPosts(initialPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialPosts();
  }, []);

  return (
    <main className="min-h-screen bg-[#F2F0E8]">
      {/* 1. Banner - Pass the trigger function */}
      <Banner onSearchClick={() => setIsSidebarOpen(true)} />

      {/* 2. Search Results Section - Only shows after searching */}
      {hasSearched && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-b border-[#234F1E]/10">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-serif italic text-[#234F1E]">
              Search Results
            </h3>
            <button 
              onClick={() => setHasSearched(false)}
              className="text-[#234F1E] text-sm underline opacity-60 hover:opacity-100"
            >
              Clear Search
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 opacity-50 italic text-[#234F1E]">
              No matches found. Try a different tag or keyword.
            </div>
          )}
        </section>
      )}

      {/* 3. Main Feed - Shows "Latest Stories" */}
      <div className="max-w-7xl mx-auto py-20 px-6 lg:px-24 pb-32">
        <div className="flex-col text-center justify-center items-center mb-12">
        <h3 className="text-3xl font-serif italic text-[#234F1E]">
          {hasSearched ? "More Stories" : "Featured Stories"}
        </h3>
        <p className="text-lg text-[#234F1E]/70 mb-12">Thoughtful perspectives from our community</p>
        </div>
        {isLoading ? (
          <div className="text-center py-10 text-[#234F1E] opacity-50">Loading posts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* 4. The Sidebar */}
      <SearchSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSearchResults={(results) => {
          setSearchResults(results);
          setHasSearched(true);
          // Scroll down to results automatically
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
      />
    </main>
  );
}