"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { joinCommunity, getMembers } from '../actions/community';
import { User, Users, X } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    getMembers().then(setMembers);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await toast.promise(joinCommunity(formData), {
      loading: 'Submitting...',
      success: 'Welcome to the community!',
      error: 'Error joining community',
    });

    setIsFormOpen(false);
    getMembers().then(setMembers); // Refresh list
  };

  return (
    <main className="min-h-screen bg-[#F2F0E8] pt-32 pb-20 px-6">
        <Link 
              href="/" 
              className="ml-15 flex items-center gap-2 text-[#234F1E]/60 hover:text-[#234F1E] transition-colors mb-4 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to Feed
            </Link>
      <div className="max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif italic text-[#234F1E] mb-6">Join Our Community</h1>
          <p className="text-lg text-[#234F1E]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Step up in the world of mindfulness. Connect with like-minded individuals 
            dedicated to intentional technology use and digital wellness.
          </p>
          
          {!isFormOpen && (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#234F1E] text-[#F2F0E8] px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              Join the Circle
            </button>
          )}
        </div>

        {/* Modal Form Overlay */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#234F1E]/20 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 text-[#234F1E]/40 hover:text-[#234F1E]"><X /></button>
              
              <h2 className="text-3xl font-serif italic text-[#234F1E] mb-8">Application</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" required placeholder="Full Name" className="w-full bg-[#F2F0E8] text-[#234F1E] rounded-xl px-5 py-3 outline-none" />
                  <input name="email" type="email" required placeholder="Email" className="w-full bg-[#F2F0E8] text-[#234F1E] rounded-xl px-5 py-3 outline-none" />
                  <input name="contact" required placeholder="Contact (e.g. +91...)" className="w-full bg-[#F2F0E8] text-[#234F1E] rounded-xl px-5 py-3 outline-none" />
                  <select name="status" required className="w-full bg-[#F2F0E8] text-[#234F1E] rounded-xl px-5 py-3 outline-none">
                    <option value="student">Student</option>
                    <option value="working">Working Professional</option>
                  </select>
                </div>
                <textarea name="about" required rows={3} placeholder="About yourself (3 lines)..." className="w-full bg-[#F2F0E8] text-[#234F1E] rounded-xl px-5 py-3 outline-none resize-none" />
                <textarea name="whyJoin" required rows={3} placeholder="Why do you want to join?" className="w-full bg-[#F2F0E8] text-[#234F1E] rounded-xl px-5 py-3 outline-none resize-none" />
                <button type="submit" className="w-full bg-[#234F1E] text-[#F2F0E8] py-4 rounded-xl font-bold">Submit Application</button>
              </form>
            </div>
          </div>
        )}

        {/* Members Listing */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-10 border-b border-[#234F1E]/10 pb-4">
            <Users className="text-[#234F1E]" />
            <h3 className="text-2xl font-serif italic text-[#234F1E]">Community Members</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white/60 p-6 rounded-3xl border border-white hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[#E1E6DC] p-3 rounded-full"><User size={20} className="text-[#234F1E]" /></div>
                  <div>
                    <h4 className="font-bold text-[#234F1E]">{member.name}</h4>
                    <p className="text-xs uppercase tracking-widest text-[#234F1E]/50">{member.status}</p>
                  </div>
                </div>
                <p className="text-sm text-[#234F1E]/80 italic line-clamp-3">"{member.about}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}