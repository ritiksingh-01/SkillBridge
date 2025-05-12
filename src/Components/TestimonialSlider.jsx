import React, { useState } from "react";
import { Star } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const TestimonialCard = ({ testimonial, onClick }) => (
  <div 
    className={cn(
      "cursor-pointer p-4 rounded-xl border transition-all min-w-[320px] max-w-[360px] border-gray-200 bg-white hover:border-blue-300"
    )}
    onClick={onClick}
  >
    <div className="flex">
      {Array(5).fill().map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    
    <p className="text-gray-700 text-sm mt-3 mb-4 line-clamp-2">
      "{testimonial.content.substring(0, 80)}..."
    </p>
    
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
        <p className="text-gray-600 text-xs">{testimonial.role}</p>
      </div>
    </div>
    
    <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
      <p className="text-blue-700 text-xs font-medium">Mentored by</p>
      <p className="text-gray-800 text-xs font-medium">{testimonial.mentorName}</p>
      <p className="text-gray-600 text-xs">{testimonial.mentorRole}</p>
    </div>
  </div>
);

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Jennifer Liu",
      role: "Product Manager at Airbnb",
      content: "My mentor helped me transition from a developer role to product management, which increased my salary by 35%.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      mentorName: "David Wilson",
      mentorRole: "Director of Product, Google"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Senior Software Engineer at Microsoft",
      content: "The technical interview preparation from my mentor transformed my job search.",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      mentorName: "Priya Sharma",
      mentorRole: "Engineering Manager, Amazon"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "UX Designer at Shopify",
      content: "Having a mentor who could guide me through building a design portfolio was crucial.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      mentorName: "Alex Chen",
      mentorRole: "Design Lead, Apple"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Marketing Director at Spotify",
      content: "Finding a mentor who understood the specific challenges of scaling marketing operations was a game-changer.",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      mentorName: "Lisa Zhang",
      mentorRole: "CMO, Netflix"
    },
    {
      id: 5,
      name: "Aisha Patel",
      role: "Data Scientist at Tesla",
      content: "The guidance from my mentor helped me navigate complex projects and advance in my field.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      mentorName: "Robert Johnson",
      mentorRole: "AI Research Lead, OpenAI"
    }
  ];
  
  return (
    <div>
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-700 text-sm font-medium">Success Stories</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">What Our Members Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real experiences from professionals who have transformed their careers with SkillBridge</p>
        </div>
        <div className="mt-16 relative">
          <div className="relative overflow-hidden py-4">
            <div 
              className="flex gap-4 animate-marquee"
              onMouseEnter={(e) => {e.currentTarget.style.animationPlayState = "paused"}}
              onMouseLeave={(e) => {e.currentTarget.style.animationPlayState = "running"}}
            >
              {testimonials.concat(testimonials).map((testimonial, i) => (
                <TestimonialCard
                  key={`scroll-${i}`}
                  testimonial={testimonial}
                  onClick={() => setCurrentIndex(i % testimonials.length)}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-50" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-50" />
          </div>
        </div>
        
        <style jsx>{`
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(calc(-50% - 1rem));
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default TestimonialSlider;

