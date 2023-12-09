import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import InputField from './components/InputField'
import Button from './components/Button'
import Link from 'next/link'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Navbar from '@/components/Navbar';
import Carousel from '@/components/Homesider';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [paket, setPaket] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const handlePaketChange = (newValue: string) => {
    setPaket(newValue);
  };
  const [buktiPembayaran, setBuktiPembayaran] = useState('');
  const handleBuktiPembayaranChange = (newValue: string) => {
    setBuktiPembayaran(newValue);
  };
  const [startTime, setStartTime] = useState<Date>();
  const handleStartTimeChange = (date: Date) => {
    setStartTime(date)
  }
  const formatDateTimeForPostgres = (dateTime: Date) => {
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}T00:00:00`;
    return formattedDateTime;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log(user?.id);
        if (!user){
          router.push('/login')
          console.log('helo')
          console.log(user)
          return
        }

        setIsLoading(false)
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false)
      }
    };
    fetchUserData();
  }, []);

  const handleOrder = async () => {
    console.log(startTime);
    const { data: { user } } = await supabase.auth.getUser();
    const user_email = user?.email
    const user_id = user?.id
    const date = new Date();
    
    const currentTime = formatDateTimeForPostgres(date);

    setIsLoading(true);

    
    let { data: member, error: membererror } = await supabase
    .from('member')
    .select('*')
    .eq('email', user_email)
    
    if (membererror) {
      alert(membererror)
      setIsLoading(false)
      return
    }

    if(member){
      if (new Date(member[0].membership_end) > new Date(currentTime) ) {
        alert ('You still have active membership')
        setIsLoading(false)
        return
      }
      
      
    }

    if(!buktiPembayaran){ 
      alert('Isi bukti pembayaran')
      setIsLoading(false)
      return
    }

    if(startTime != null) {
      if (startTime < new Date(currentTime)) {
        alert('Start time must not be less than current time')
        setIsLoading(false)
        return
      }
    }

    

    let duration;
    let time;

    if (paket !== '1' && paket !== '2' && paket !== '3') {
      alert ('Pilihlah paket yang sesuai (1,2,3). 1 = 1 hari, 2 = 1 minggu, 3 = 1 bulan')
      setIsLoading(false)
      return
    }

    if (!startTime){
      alert ('isi tanggal mulai membership')
      setIsLoading(false)
      return
    }

    if (paket === '1') {
      duration = 1;
    }

    if (paket === '2') {
      duration = 7;
    }

    if (paket === '3') {
      duration = 30;
    }


    
    // time = formatDateTimeForPostgres(startTime);
    console.log(time)

    let datesToUpdate = [];


    // const { data, error } = await supabase.from('ketersediaan').select('*');
    // if (duration){
    //   for (let i = 0; i < duration; i++) {
    //     // const currentDate = new Date(startTime);
    //     const time = new Date(startTime);
    //     time.setDate(time.getDate() + i);

    //     // Format the current date for comparison
    //     const formattedTime = formatDateTimeForPostgres(time);

    //     // Find the corresponding record in the fetched data
    //     const availabilityRecord = data?.find(record => record.tanggal_ketersediaan === formattedTime);

    //     if (availabilityRecord) {
    //       // Check the kapasitas attribute
    //       if (availabilityRecord.kapasitas === 0) {
    //         setIsLoading(false);
    //         alert('Kapasitas penuh');
    //         return;
    //       }
    //     } 

    //     datesToUpdate.push(formattedTime);
    //   }
    // }

    const response = await fetch('/api/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        duration,
        startTime,
      }),
    });

    const result = await response.json();

    if (result.error) {
      alert(result.error);
      setIsLoading(false);
      return
    }

    datesToUpdate = result.datesToUpdate

    console.log(datesToUpdate)

    const response1 = await fetch('/api/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datesToUpdate,
        user_email,
        paket,
        buktiPembayaran,
        user_id,
      }),
    });

    const result1 = await response1.json();

    if (result1.error) {
      alert(result1.error);
      setIsLoading(false);
      return
    }

    // const { data, error } = await supabase.from('ketersediaan').select('*');

    // for (const dateToUpdate of datesToUpdate) {
    //   const availabilityRecord = data?.find(record => record.tanggal_ketersediaan === dateToUpdate);

    //   if (availabilityRecord) {
    //     // Update kapasitas column of the existing row
    //     await supabase
    //       .from('ketersediaan')
    //       .update({ kapasitas: availabilityRecord.kapasitas - 1 })
    //       .eq('tanggal_ketersediaan', dateToUpdate);
    //   } else {
    //     // Insert a new row with values (date, 29)
    //     await supabase.from('ketersediaan').upsert([
    //       { tanggal_ketersediaan: dateToUpdate, kapasitas: 29 },
    //     ]);
    //   }
    // }


    
    // const lastDate = datesToUpdate[datesToUpdate.length - 1];
    // const modifiedLastDate = lastDate.replace(/(\d{4}-\d{2}-\d{2}T)\d{2}:\d{2}:\d{2}/, '$123:59:59');
    // await supabase.from('member')
    //               .update({ membership_start: datesToUpdate[0], membership_end: modifiedLastDate })
    //               .eq('email', user_email);


    // const { error: tranksaksierror} = await supabase.from('transaksi')
    //               .insert({ id_user: user?.id, id_paket: paket, bukti_pembayaran: buktiPembayaran });


    // if (tranksaksierror){
    //   console.log(tranksaksierror)
    // }
    setIsLoading(false);

    alert('Reservasi berhasil')
    router.refresh()

  };

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
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <Navbar/>
        <Carousel/>
        <fieldset style={{borderTop: '2px solid #76B3DD'}} className='px-[183px] py-[70px] max-[815px]:px-[90px] max-[815px]:py-[35px] max-[633px]:px-[25px] max-[633px]:py-[17px]'>
            <legend  className='m-auto pl-[5%] pr-[5%] text-[36px] font-[700] max-[815px]:text-[24px]'>Reserve space</legend>
                <InputField className="mb-[27px]" inputClass='max-[633px]:px-[10px] ' placeholder="Input your desired membership package..." label="Package no" value={paket} onChange={handlePaketChange}/>
                
                <div className='font-bold'>Membership Start</div>
                <div className="px-[19px] py-[9px] mb-[27px]  border-solid border-[#e5e7eb] border-[2px] rounded-[10px] w-[100%]">
                  <DatePicker
                    className="mr-[35px] w-[100%] "
                    selected={startTime}
                    onChange={handleStartTimeChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date and time"
                  />                 
                </div>

                <InputField className="mb-[27px]" inputClass='max-[633px]:px-[10px] ' placeholder="Input your bukti pembayaran..." label="Bukti pembayaran" value={buktiPembayaran} onChange={handleBuktiPembayaranChange}/>
                
    
                <div className='flex justify-end flex-wrap max-[633px]:flex-col'>
                    <Link href={'/mytrips'} className='max-[633px]:flex max-[633px]:justify-end'>
                      <Button className='mr-[33px] font-bold border-[3px] border-solid border-[#2D2F3D] w-[208px] max-[633px]:w-[140px] max-[633px]:mr-[0px] max-[633px]:mb-[20px]' label='Cancel'></Button>
                    </Link>
                    <div className='max-[633px]:flex max-[633px]:justify-end'>
                    <Button className='border-solid border-black border-[1px] bg-[#2D2F3D] text-white font-bold w-[208px] max-[633px]:w-[140px] max-[633px]:right-[0]' label='Booking Now' onClick={handleOrder}></Button>   
                    </div>
                </div>
        </fieldset>
    </div>
  )
}
