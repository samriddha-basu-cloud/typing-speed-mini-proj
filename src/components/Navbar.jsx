import React from 'react';
import { Link } from 'react-router-dom';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../utils/firebase';

// Helper function to get initials from a name
const getInitials = (name) => {
  if (!name) return '??';
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
  return initials.length > 2 ? initials.slice(0, 2) : initials;
};

const UserProfile = ({ user }) => {
  // Use the photoURL directly from Google account
  const profileImage = user.photoURL;
  const initials = getInitials(user.displayName);

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        {profileImage ? (
          <img 
            src={profileImage} 
            alt={`${user.displayName}'s profile`} 
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-md">
            {initials}
          </div>
        )}
        {/* Optional online status indicator */}
        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-800 font-semibold text-sm">
          {user.displayName}
        </span>
        <span className="text-gray-500 text-xs">
          {user.email}
        </span>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="
      bg-white 
      shadow-md 
      sticky 
      top-0 
      z-50 
      px-6 
      py-4 
      flex 
      justify-between 
      items-center
      w-full
    ">
      <Link 
        to="/" 
        className="
          text-2xl 
          font-bold 
          text-blue-600 
          hover:text-blue-700 
          transition 
          duration-300 
          ease-in-out
          tracking-tight
        "
      >
        Typing Speed App
      </Link>
      
      {user ? (
        <div className="flex items-center space-x-5">
          <UserProfile user={user} />
          <button
            onClick={signOutUser}
            className="
              flex 
              items-center 
              space-x-2
              bg-red-500 
              text-white 
              px-4 
              py-2 
              rounded-lg 
              hover:bg-red-600 
              transition 
              duration-300 
              ease-in-out 
              shadow-md 
              hover:shadow-lg
              text-sm
              font-medium
            "
          >
            <LogOutIcon className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="
            flex 
            items-center 
            space-x-2
            bg-blue-600 
            text-white 
            px-4 
            py-2 
            rounded-lg 
            hover:bg-blue-700 
            transition 
            duration-300 
            ease-in-out 
            shadow-md 
            hover:shadow-lg
            text-sm
            font-medium
          "
        >
          Sign In
        </Link>
      )}
    </nav>
  );
};

export default Navbar;