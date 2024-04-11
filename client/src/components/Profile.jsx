import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import ServerError from './ServerError';
import { updateUser } from '../helper/helper';

const Profile = () => {

  const navigate = useNavigate();
  const { isLoading, apiData, serverError } = useFetch();

  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName,
      lastName: apiData?.lastName,
      mobile: apiData?.mobile,
      email: apiData?.email,
      address: apiData?.address,
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: 'Updated successfully...!',
        error: 'Could not update.'
      })
    }
  })

  // formik doesnot support file upload so we need to creat this handler
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  /**user logout handler function */
  const userLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if (serverError) return <ServerError message={serverError.message} />


  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position='top-center' reverseOrder={false} />
      <div className="bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Profile</h2>
          <p className="mt-2 text-lg text-gray-600">You can update the details.</p>
        </div>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>

          <div className="flex items-center justify-center">
            <label htmlFor='profile'>
              <img src={apiData?.profile || file || avatar} alt="avatar" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-200 hover:border-green-400 cursor-pointer" />
            </label>
            <input onChange={onUpload} type='file' id='profile' name='profile' style={{ display: "none" }} />
          </div>

          <div className=' textbox flex flex-col items-center gap-6'>

            <div className='name flex w-7/8 gap-10'>
              <input {...formik.getFieldProps('firstName')} type="text" placeholder="First Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />
              <input {...formik.getFieldProps('lastName')} type="text" placeholder="Last Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />
            </div>

            <div className='name flex w-7/8 gap-10'>
              <input {...formik.getFieldProps('mobile')} type="text" placeholder="Mobile" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />
              <input {...formik.getFieldProps('email')} type="text" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />
            </div>

          </div>
          <input {...formik.getFieldProps('address')} type="text" placeholder="Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />
          <button type="submit" className="w-full bg-green-600 text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-green-500 hover:bg-opacity-80">Update</button>

          <div className="text-center text-gray-600">
            <span>Come back later? <button onClick={userLogout} className="text-red-500">Logout</button></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
