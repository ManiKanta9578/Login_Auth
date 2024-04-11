import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/store';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

export const Recovery = () => {

  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      console.log(OTP)
      if (OTP) return toast.success('OTP has been send to your email!');
      return toast.error('Problem while generating OTP!')
    })
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let verifyResult = await verifyOTP({ username, code: OTP });

      if (verifyResult.status === 201) {
        toast.success('Verified Successfully!');
        navigate('/reset');
      } else {
        throw new Error('Could not verify!');
      }
    } catch (error) {
      toast.error('Wrong OTP! Check email again!');
    }
  }



  // handler of resend OTP
  function resendOTP() {

    let sentPromise = generateOTP(username);

    toast.promise(sentPromise,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: <b>Could not Send it!</b>,
      }
    );

    sentPromise.then((OTP) => {
      console.log(OTP)
    });

  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Recovery</h2>
          <p className="mt-2 text-lg text-gray-600">Enter OTP to recover password.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="flex items-center justify-center">
            <span className="text-gray-500 text-sm py-4 text-left">Enter 6 digit OTP sent to your email address</span>
          </div>

          <input onChange={(e) => setOTP(e.target.value)} type="text" placeholder="OTP" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />

          <button type='submit' className="w-full bg-green-600 text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-green-500 hover:bg-opacity-80">
            Recovery
          </button>
        </form>

        <div className="text-center text-gray-600">
          <span>
            Can't get OTP? <button onClick={resendOTP} className="text-red-500">Resend</button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
