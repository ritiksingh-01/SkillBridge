import React from "react";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 relative overflow-hidden rounded-lg bg-white">
                <div className="w-6 h-6 absolute inset-1 bg-blue-500 rotate-45 transform translate-x-3"></div>
              </div>
              <div className="text-white text-2xl font-bold">SkillBridge</div>
            </div>
            <p className="text-blue-100 mb-6">Connecting ambitious professionals with industry-leading mentors to unlock their full potential.</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <Facebook className="text-white w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <Twitter className="text-white w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <Instagram className="text-white w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <Linkedin className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Find Mentor</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Become a Mentor</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Career Tips</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Mentorship Guide</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-300 w-5 h-5" />
                <span className="text-blue-100">123 Innovation Drive, Tech City</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-blue-300 w-5 h-5" />
                <span className="text-blue-100">hello@skillbridge.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-blue-300 w-5 h-5" />
                <span className="text-blue-100">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-blue-700/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-blue-200 text-sm">© 2024 SkillBridge. All Rights Reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="text-blue-200 text-sm hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-blue-200 text-sm hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-blue-200 text-sm hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;