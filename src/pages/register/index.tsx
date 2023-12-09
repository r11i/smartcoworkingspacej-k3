import React from 'react';
import Image from 'next/image';
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()
  const handleRegister = async () => {
    // if (password.length < 6) {
    //   alert('Password must be greater than 6 characters');
    //   return
    // }
    // await supabase
    // .from('member')
    // .select('*')
    // .eq('email', email)
    // .then(({ data, error }) => {
    //   if (error) {
    //     alert(error.message)
    //     return
    //   }
    //   if (data.length !== 0) {
    //     alert('User already exist!')
    //     return
    //   }
    // })
    // const {data, error: registrationError} = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     emailRedirectTo: `/api/auth/`,
    //   },
    // })

    // if (registrationError) {
    //   console.error("Error during registration:", registrationError.message);
    //   alert(registrationError.message);
    //   return;
    // }
    // router.refresh()

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Registration successful');
        router.refresh(); // Assuming you want to reload the page after successful registration
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Internal server error');
    }
  }

  return (
    <div style={{color: 'white', position: 'relative', height: '100vh', width: '100vw'}}>
      <div className='bg-black opacity-50 absolute h-screen w-screen'></div>
      <div style={{width: '65%', height: '100vh', right: '0', position: 'absolute'}}>
        <div style={{position: 'relative', height: '100vh'}}>
          <Image alt="gambar" style={{position: 'absolute', width: '100%', height: '100%'}} src="/Banner.png" height={862} width={1002}/>
          <div style={{top: '50%', transform: 'translate(0%, -50%)', left: '40%', zIndex: '1', position: 'absolute', width: '50%', height: 'fit-content'}}>
            <div className='mb-[50px] max-[532px]:mb-[25px]'>
              <p className='text-[48px] text-[#E0F7FC] font-bold text-center max-[532px]:text-[32px]'>SIGN UP</p>
              <p style={{fontSize: '18px', textAlign: 'center'}}>Create a new account</p>
            </div>
            {/* <form action="process_registration.php" method="post"> */}
              <label htmlFor="email">Email</label>
              <input style={{color: 'black', width: '100%', padding: '9px 19px 9px 19px', borderRadius: '10px', display: 'block'}} type="email" id="email" name="email" placeholder="Input your email.." onChange={(e) => setEmail(e.target.value)} value={email} required></input>
              <label htmlFor="password">Password</label>
              <input style={{color: 'black', width: '100%', padding: '9px 19px 9px 19px', borderRadius: '10px', display: 'block'}} className='mb-[60px] max-[532px]:mb-[30px]' type="password" id="password" name="password" placeholder="Input your password.." onChange={(e) => setPassword(e.target.value)} value={password} required></input>
              {/* <label htmlFor="name">Confirm password</label>
              <input style={{marginBottom: '60px', color: 'black', width: '100%',padding: '9px 19px 9px 19px', borderRadius: '10px', display: 'block'}} type="text" id="confirm-password" name="confirm-password" placeholder="Confirm your password.." required></input> */}
              <button onClick={handleRegister} style={{fontWeight: 'bold', borderRadius: '15px', width: '100%', padding: '11px 25px 11px 25px', backgroundColor: '#005CB1', cursor:'pointer', marginTop: '20px'}}>Register</button>
            {/* </form> */}
            <p style={{textAlign: 'center', marginTop: '10px'}}>Already have an account? <Link href='/login' style={{color: '#005CB1'}}>Login</Link></p>
            
          </div>
        </div>
      </div>
      <Image alt="gambar" style={{height: '100vh', position: 'absolute', zIndex: '-1', width: '66%'}} src="/Banner1.jpg" width={900} height={862} />
      <div style={{position: 'relative', height: '100vh'}}>
        <div style={{position: 'absolute', top: '100px'}} className='left-[51px] max-[532px]:left-[25px]'>
          <p className='text-[36px] font-bold max-[735px]:text-[24px] max-[532px]:text-[16px]'>JOIN US</p>
          <p className='text-[48px] font-bold max-[735px]:text-[32px] max-[532px]:text-[22px]'>ELEVATE YOUR<br></br>WORKSPACE.</p>
        </div>
      </div>

      
    </div>
  );
}

export default Register;
