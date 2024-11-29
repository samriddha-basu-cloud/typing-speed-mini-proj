import React from 'react';
import { ChevronRightIcon, KeyboardIcon, SparklesIcon } from 'lucide-react';
import SignInButton from '../components/SignInButton';
import TypingIllustration from '../assets/typing-illustration.jpg';

const Home = () => {
  const features = [
    {
      icon: <KeyboardIcon className="w-10 h-10 text-blue-600" />,
      title: "Accurate Tracking",
      description: "Measure your typing speed and accuracy with precision."
    },
    {
      icon: <SparklesIcon className="w-10 h-10 text-purple-600" />,
      title: "Personalized Progress",
      description: "Track your improvement and set personal typing goals."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center shadow-sm bg-white">
        <div className="flex items-center space-x-2">
          <KeyboardIcon className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">TypeMaster</h2>
        </div>
        {/* <div className="flex items-center space-x-4">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
        </div> */}
      </nav>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Boost Your <span className="text-blue-600">Typing Speed</span> 
            <br />and Accuracy
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Transform your typing skills with real-time feedback and engaging challenges.
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
                {feature.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <SignInButton className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
            Get Started
            <ChevronRightIcon className="ml-2 w-5 h-5" />
          </SignInButton>
        </div>

        {/* Right Content - Decorative Typing Illustration */}
        <div className="hidden md:flex justify-center items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>
              <img 
                src={TypingIllustration}
                alt="Typing Illustration" 
                className="relative z-10 rounded-xl shadow-2xl"
                />             
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-6 text-center text-gray-600">
          © 2024 TypeMaster. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;