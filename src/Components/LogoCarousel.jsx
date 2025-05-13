import { useEffect, useRef } from 'react';

export default function LogoCarousel() {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    // Animation function
    const animate = () => {
      // Move 0.5px per frame for smooth scrolling
      scrollContainer.scrollLeft += 0.5;
      
      // Reset scroll position when reaching the end to create infinite loop
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    let animationId = requestAnimationFrame(animate);
    
    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="w-full px-6 md:px-16 lg:px-24 py-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-gray-500 font-medium tracking-wide">TRUSTED BY PROFESSIONALS FROM</p>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* First set of logos */}
          <div className="flex flex-nowrap min-w-full">
            <div className="mx-8 flex-shrink-0">
              <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://cdn.worldvectorlogo.com/logos/netflix-3.svg" alt="Netflix logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://cdn.worldvectorlogo.com/logos/adobe-2.svg" alt="Adobe logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://1000logos.net/wp-content/uploads/2021/04/Microsoft-logo.png" alt="Microsoft logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://cdn.worldvectorlogo.com/logos/apple-14.svg" alt="Apple logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://cdn.worldvectorlogo.com/logos/ibm.svg" alt="IBM logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
          </div>
          
          {/* Duplicate set for seamless scrolling */}
          <div className="flex flex-nowrap min-w-full">
            <div className="mx-8 flex-shrink-0">
              <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://cdn.worldvectorlogo.com/logos/netflix-3.svg" alt="Netflix logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://cdn.worldvectorlogo.com/logos/adobe-2.svg" alt="Adobe logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://1000logos.net/wp-content/uploads/2021/04/Microsoft-logo.png" alt="Microsoft logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://cdn.worldvectorlogo.com/logos/apple-14.svg" alt="Apple logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="mx-8 flex-shrink-0">
              <img src="https://cdn.worldvectorlogo.com/logos/ibm.svg" alt="IBM logo" className="h-8 opacity-70 hover:opacity-100 transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}