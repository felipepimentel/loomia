import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="prose lg:prose-xl">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Home Page</h1>
      <p className="mb-4">This is a sample home page using React and Tailwind CSS.</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Learn More
      </button>
    </div>
  );
};

export default Home;