"use client";
import { useState } from "react";
import { X, Search } from "lucide-react";
import { searchPosts } from "../actions/posts";

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResults: (results: any[]) => void;
}

export default function SearchSidebar({ isOpen, onClose, onSearchResults }: SearchSidebarProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const results = await searchPosts(query);
    onSearchResults(results);
    setLoading(false);
    onClose(); // Optional: close sidebar once searched
  };

  return (
    <>
      {/* Background Dimmer (Overlay) */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[998] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className={`fixed top-0 right-0 h-full w-[350px] bg-[#F2F0E8] shadow-2xl z-[999] transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-serif italic text-[#234F1E]">Discover</h2>
            <button onClick={onClose} className="hover:rotate-90 transition-transform text-[#234F1E]">
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search tags or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-[#234F1E]/20 py-3 pr-10 focus:outline-none focus:border-[#234F1E] text-[#234F1E] placeholder-[#234F1E]/40"
              autoFocus
            />
            <button type="submit" className="absolute right-0 top-3 text-[#234F1E]">
              <Search size={22} className={loading ? "animate-pulse" : ""} />
            </button>
          </form>

          <div className="mt-12">
            <p className="text-[10px] uppercase tracking-widest text-[#234F1E]/50 font-bold mb-4">Quick Links</p>
            <div className="flex flex-wrap gap-2">
              {['Wellness', 'Tech', 'Minimalism'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => { setQuery(tag); }}
                  className="text-xs px-3 py-1 rounded-full border border-[#234F1E]/10 text-[#234F1E] hover:bg-[#234F1E] hover:text-white transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}