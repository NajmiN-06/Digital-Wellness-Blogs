"use client";

import { useState, useEffect } from "react";
import { useReadingList } from "../store/useReadingList";
import { getSavedPosts } from "../actions/posts";
import BlogCard from "../components/BlogCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MyListPage() {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const savedIds = useReadingList((state) => state.savedIds);

  useEffect(() => {
    const fetchMyList = async () => {
      setIsLoading(true);
      try {
        // We call the server action we created earlier
        const data = await getSavedPosts(savedIds);
        setSavedPosts(data);
      } catch (error) {
        console.error("Error loading reading list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyList();
  }, [savedIds]); // Re-fetch if items are removed while on this page

  return (
    <main className="min-h-screen bg-[#F2F0E8] pt-32 pb-20 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-[#234F1E]/60 hover:text-[#234F1E] transition-colors mb-4 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to Feed
            </Link>
            <h1 className="text-5xl md:text-6xl font-serif italic text-[#234F1E]">
              My Reading List
            </h1>
          </div>
          <p className="text-[#234F1E]/70 font-medium italic">
            {savedPosts.length} {savedPosts.length === 1 ? 'story' : 'stories'} saved for later
          </p>
        </div>

        {/* Grid Section */}
        {isLoading ? (
          <div className="text-center py-20 opacity-50 italic">Loading your library...</div>
        ) : savedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-[#234F1E]/10 rounded-3xl">
            <h2 className="text-2xl font-serif text-[#234F1E] mb-4">Your list is currently quiet.</h2>
            <p className="text-[#234F1E]/60 mb-8">Discover intentional stories and save them for later.</p>
            <Link href="/">
              <button className="bg-[#234F1E] text-[#F2F0E8] px-8 py-3 rounded-full font-semibold hover:bg-[#193C14] transition-all">
                Explore Stories
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}