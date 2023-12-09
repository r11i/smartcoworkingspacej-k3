import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface profileData{
    email: string,
    membership_start: string,
    membership_end: string,
}

const Navbar = () => {
  const supabase = createClientComponentClient()
  const [profileData, setProfileData] = useState<profileData>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchProfileData = async () => {
        try {
            const supabase = createClientComponentClient()
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user)
            const user_email = user?.email
            console.log(user_email)
            const response = await fetch(`/api/profile?user_email=${user_email}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                // body: JSON.stringify({ user_email }),
              });
            const data = await response.json();
            
            if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch data');
            }

            setProfileData(data[0]);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
        };

        fetchProfileData();
    }, []);

  const logOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">CoSpace J</span>
      </Link>
      <div className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded={isDropdownOpen}
            onClick={toggleDropdown}
          >
            <img className="w-8 h-8 rounded-full" src="/Banner1.jpg" alt="user photo" />
          </button>
          {/* Dropdown menu */}
          <div
            className={`absolute top-[100%] right-[0px] mt-[15%] ${
              isDropdownOpen ? 'block' : 'hidden'
            } z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              {profileData && (
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">{profileData.email}</span>)}        
              
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Profile</Link>
              </li>
              <li>
                <a onClick={logOut} className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;