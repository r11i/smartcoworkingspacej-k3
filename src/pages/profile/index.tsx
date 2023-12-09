import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

interface profileData{
    email: string,
    membership_start: string,
    membership_end: string,
}

const Profile = () => {
  const [profileData, setProfileData] = useState<profileData>();

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       const supabase = createClientComponentClient()
//       // Replace 'profiles' with the name of your Supabase table
//       const { data, error } = await supabase.from('member')
//       .select('*')
//       .eq('email', 'richardharis10@gmail.com');

//       if (error) {
//         console.error('Error fetching profile data:', error.message);
//       } else {
//         setProfileData(data[0]);
//       }
//     };

//     fetchProfileData();
//   }, []);

    const [user, setUser] = useState<User | null>(null);
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //   const fetchUserData = async () => {
    //     try {
          
    //       const { data: { user } } = await supabase.auth.getUser();
    //       setUser(user);
    //       console.log(user?.id);
          
    //       setIsLoading(false)
          
          
    //     } catch (error) {
    //       console.error('Error fetching user data:', error);
    //       setIsLoading(false)
    //     }
    //   };
    //   fetchUserData();
    // }, []);
    useEffect(() => {
        const fetchProfileData = async () => {
        try {
            
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user)
            const user_email = user?.email
            console.log(user_email)
            if (!user){
              router.push('/login')
              console.log('helo')
              console.log(user)
              return
            }
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
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching profile data:', error);
            setIsLoading(false)
        }
        };

        fetchProfileData();
    }, []);

  if(isLoading) {
    return (
    <p className='flex justify-center items-center w-screen h-screen'>
      <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    </p>
    )
  }

  return (
    <div>
      <Navbar/>
      {profileData && (
        <div className="bg-white flex flex-row justify-center w-full mt-1">
          <div className="bg-white w-screen relative flex  flex-col justify-center">
            
            <div className=" font-extrabold text-black text-[60px] text-center max-[632px]:text-[40px] ">
              Account Profile
              <div className='mt-8'>
                <img
                src={'/Banner1.jpg'}
                className='w-24 h-24 mx-auto rounded-full'
                alt=""
              />
              </div>
            </div>
            <div className=" font-extrabold text-[#ff9901] text-[30px] text-center  ">
              Kelompok 2
            </div>
            <div className=" font-medium text-black text-[18px] text-center  ">
              K03 - CospaceJ
            </div>


            <div className='flex items-center justify-center py-4'>
              <div className=" font-extrabold text-[#ff9901] text-[20px] w-[30%] max-[559px]:text-[13px]">
                Email
              </div>
              <div className="bg-white rounded-[20px] border border-solid border-[#d3d3d3] w-[40%] px-2 h-[40px] flex items-center max-[400px]:w-[50%]">
                <div className="font-medium text-[#464444] text-[15px]  px-4 max-[559px]:text-[10px]">
                  {profileData.email}
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center py-4'>
              <div className=" font-extrabold text-[#ff9901] text-[20px] w-[30%] max-[559px]:text-[13px]">
                Membership Start
              </div>
              <div className="bg-white rounded-[20px] border border-solid border-[#d3d3d3] w-[40%] px-2 h-[40px] flex items-center max-[400px]:w-[50%]">
                <div className="font-medium text-[#464444] text-[15px]  px-4 max-[559px]:text-[10px]">
                  {profileData.membership_start}
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center py-4'>
              <div className=" font-extrabold text-[#ff9901] text-[20px] w-[30%] max-[559px]:text-[13px]">
                Membership End
              </div>
              <div className="bg-white rounded-[20px] border border-solid border-[#d3d3d3] w-[40%] px-2 h-[40px] flex items-center max-[400px]:w-[50%]">
                <div className="font-medium text-[#464444] text-[15px] px-4 max-[559px]:text-[10px]">
                  {profileData.membership_end}
                </div>
              </div>
            </div>
            
            <div className='flex w-[100%] justify-center gap-20 mt-[20px]'>
              <div className=" rounded-[8px] border-2 border-solid border-[#ff8f05] p-4 w-[20%]">
                <Link href={'/'} className='cursor-pointer'>
                <button className="font-medium text-black text-[18px] text-center w-[100%] max-[500px]:text-[13px] max-[388px]:text-[10px]">
                  Back
                </button>
                </Link>
              </div>
              <div className=" bg-[#ff8f05] rounded-[8px] p-4 w-[20%]">
                <Link href={'/'}>
                <button className="font-extrabold text-white text-[20px] text-center w-[100%] max-[500px]:text-[13px] max-[388px]:text-[10px]">
                  RENEW
                </button>
                </Link>
              </div>
              
            </div>
            
          </div>
        </div>
      )}
    </div>

    
  );
};

export default Profile;
