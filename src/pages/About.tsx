import React from 'react';

const About: React.FC = () => {
  return (
    <div className="prose lg:prose-xl">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-4">We are a company dedicated to creating amazing web applications using the latest technologies.</p>
      <ul className="list-disc pl-5 mb-4">
        <li>React for UI</li>
        <li>Vite for fast builds</li>
        <li>Tailwind CSS for styling</li>
      </ul>
    </div>
  );
};

export default About;