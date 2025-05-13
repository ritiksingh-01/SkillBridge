import React from "react";
import { Star } from "lucide-react";

const TestimonialSlider = () => {
  const mentorImages = {
    "David Wilson": "https://randomuser.me/api/portraits/men/44.jpg",
    "Priya Sharma": "https://randomuser.me/api/portraits/women/46.jpg",
    "Alex Chen": "https://randomuser.me/api/portraits/women/65.jpg",
    "Lisa Zhang": "https://randomuser.me/api/portraits/women/52.jpg",
    "Robert Johnson": "https://randomuser.me/api/portraits/men/68.jpg"
  };

  const testimonials = [
    {
      text: "Working with my mentor transformed my career. I gained skills that helped me land a promotion within 3 months. The personalized guidance was exactly what I needed.",
      name: "Alex Rivera",
      title: "Product Manager @ Dropbox",
      photo: "https://randomuser.me/api/portraits/men/1.jpg", // Example user photo
      mentorName: "David Wilson",
      mentorRole: "Director of Product, Google"
    },
    {
      text: "The structured approach and accountability my mentor provided was invaluable. I learned more in 6 weeks of mentorship than I did in a year of self-study.",
      name: "Taylor Kim",
      title: "Software Engineer @ Adobe",
      photo: "https://randomuser.me/api/portraits/women/2.jpg", // Example user photo
      mentorName: "Priya Sharma",
      mentorRole: "Engineering Manager, Amazon"
    },
    {
      text: "My mentor helped me navigate a challenging career transition. Their industry insights and practical advice gave me the confidence to make the leap and secure my dream role.",
      name: "Jordan Smith",
      title: "Marketing Director @ Spotify",
      photo: "https://randomuser.me/api/portraits/men/3.jpg", // Example user photo
      mentorName: "Alex Chen",
      mentorRole: "Design Lead, Apple"
    },
    {
      text: "Finding a mentor who understood the specific challenges of scaling marketing operations was a game-changer for my career trajectory.",
      name: "Jennifer Liu",
      title: "Product Manager at Airbnb",
      photo: "https://randomuser.me/api/portraits/women/4.jpg", // Example user photo
      mentorName: "Lisa Zhang",
      mentorRole: "CMO, Netflix"
    },
    {
      text: "The guidance from my mentor helped me navigate complex projects and advance in my field much faster than I could have alone.",
      name: "Aisha Patel",
      title: "Data Scientist at Tesla",
      photo: "https://randomuser.me/api/portraits/women/5.jpg", // Example user photo
      mentorName: "Robert Johnson",
      mentorRole: "AI Research Lead, OpenAI"
    }
  ];

  return (
    <div className="w-full px-6 md:px-16 lg:px-24 py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-700 text-sm font-medium">Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Members Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from professionals who have transformed their careers through our mentorship platform
          </p>
        </div>
        
        {/* Animated testimonials section */}
        <div className="mt-8 relative overflow-hidden py-4">
          {/* First row of testimonials that moves left */}
          <div 
            className="flex gap-4 animate-marquee"
            style={{
              animation: "marquee 40s linear infinite",
            }}
          >
            {testimonials.concat(testimonials).map((item, index) => (
              <div 
                key={`row1-${index}`}
                className="min-w-[320px] md:min-w-[380px] bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">{item.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-gray-500 text-sm">{item.title}</div>
                  </div>
                </div>
                <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 text-xs font-medium">Mentored by</p>
                  <p className="text-gray-800 text-xs font-medium">{item.mentorName}</p>
                  <p className="text-gray-600 text-xs">{item.mentorRole}</p>
                  <div className="mt-2 w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img src={mentorImages[item.mentorName]} alt={item.mentorName} className="w-full h-full object-cover" /> {/* Mentor image */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for smooth visual transition */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white" />
        </div>
      </div>
      
      {/* CSS for the marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 1rem));
          }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TestimonialSlider;