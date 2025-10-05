import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center text-gray-500 mt-12">
      <p>&copy; {new Date().getFullYear()} TAPARCARDE. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
