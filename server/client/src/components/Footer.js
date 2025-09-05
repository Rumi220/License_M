import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 text-white border-t border-gray-700 mt-12 p-6">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
    {/* Left: copyright */}
    <p className="text-sm opacity-90">
      &copy; {new Date().getFullYear()} NHQ Distributions. All rights reserved.
    </p>

    {/* Right: links */}
    <div className="flex items-center gap-4 mt-3 sm:mt-0">
      <a
        href="/"
        className="text-white hover:text-gray-300 transition-colors duration-200 text-sm"
      >
        Privacy
      </a>
      <a
        href="/"
        className="text-white hover:text-gray-300 transition-colors duration-200 text-sm"
      >
        Terms
      </a>
      <a
        href="/"
        className="text-white hover:text-gray-300 transition-colors duration-200 text-sm"
      >
        Contact
      </a>
    </div>
  </div>
</footer>

    </div>
  );
};

export default Footer;
