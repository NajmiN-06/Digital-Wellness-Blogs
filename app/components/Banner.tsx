"use client";
import { ArrowRight, Bookmark, PenTool } from 'lucide-react';
import { useReadingList } from '../store/useReadingList';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from "../public/Mindfultech-logo.webp"
interface BannerProps {
  onSearchClick: () => void;
}

export default function MindfulBanner({ onSearchClick }: BannerProps) {
  const savedCount = useReadingList((state) => state.savedIds.length);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="relative px-6 lg:px-24 bg-[#F2F0E8] text-[#234F1E]">

      {/* 1. Sticky Navigation Pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 rounded-full bg-white/70 px-8 py-3 text-sm font-medium shadow-lg backdrop-blur-md border border-slate-100">
        {['Explore', 'Home', 'Community', 'My List'].map((item) => (
          <Link
            key={item}
            // Point 'My List' to the new route
            href={
              item === 'Home' ? '/' :
              item === 'Community' ? '/community' :
                item === 'My List' ? '/mylist' : '#'
              
            }
            onClick={(e) => {
              if (item === 'Explore') {
                e.preventDefault();
                onSearchClick();
              }
              // We don't need e.preventDefault() for My List anymore because it's a real page!
            }}
            className={`transition-colors ${(item === 'Home' && isHome)
                ? "text-[#234F1E] font-bold underline decoration-2 underline-offset-4"
                : "text-slate-700 hover:text-[#234F1E]"
              }`}
          >
            {item}
          </Link>
        ))}
      </nav>

      {/* 2. The Main Hero Section */}
      <div className="mx-auto max-w-4xl pt-40 pb-32 text-center flex flex-col items-center">

        {/* 'MindfulTech' Badge */}
        <span className="mb-8 inline-block rounded-full bg-[#E1E6DC] px-5 py-5 text-xs font-bold uppercase tracking-widest text-[#234F1E]">
          MINDFULTECH
        </span>

        {/* The Main Heading (Note the large font and line height) */}
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] text-[#234F1E]">
          A Community for Mindful Tech & Digital Wellness
        </h1>

        {/* The Subtitle */}
        <p className="mt-8 max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-[#234F1E]/80">
          Share your insights, discover thoughtful perspectives, and join a movement toward intentional technology use.
        </p>

        {/* Centered Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Link href="/write">
            <button className="rounded-full bg-[#234F1E] px-10 py-4 text-sm font-semibold text-[#F2F0E8] shadow-md hover:bg-[#193C14] transition-colors">
              Start Writing
            </button>
          </Link>
          <button
            onClick={onSearchClick}
            className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#234F1E] 
          hadow-sm ring-1 ring-[#234F1E]/10 hover:ring-[#234F1E]/30 transition-all">
            Explore Posts
            <ArrowRight size={16} className="text-[#234F1E]/50 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. The Sticky Footer Pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center rounded-full bg-white/90 px-3 py-2.5 shadow-2xl backdrop-blur-md border border-slate-100">

        <div className="flex items-center gap-3 px-6 py-2 border-r border-slate-100">
          <Bookmark
            size={18}
            // 2. The icon fills in when there's at least one item saved
            className={`transition-all duration-300 ${savedCount > 0 ? "fill-[#234F1E] text-[#234F1E]" : "text-[#234F1E]"
              }`}
          />

          <span className="text-sm font-semibold text-[#234F1E]">
            {/* 3. The number now updates automatically */}
            Reading List ({savedCount})
          </span>
        </div>
        {/* The Dark Green 'Write' button */}
        <Link href="/write">
          <button className="flex items-center gap-3 rounded-full bg-[#234F1E] px-7 py-3 text-sm font-semibold text-[#F2F0E8] hover:bg-[#193C14] transition-colors ml-3">
            <PenTool size={18} />
            Write
          </button>
        </Link>
      </div>

    </div>
  );
}