import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';

const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: ""
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '' });
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully...!</b>,
        error: (error) => <b>{error}</b>
      });
      registerPromise.then(() => navigate('/'))
    }

  })

  // formik doesnot support file upload so we need to creat this handler
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }


  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position='top-center' reverseOrder={false} />
      <div className="bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Register</h2>
          <p className="mt-2 text-lg text-gray-600">Happy to join you</p>
        </div>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>

          <div className="flex items-center justify-center">
            <label htmlFor='profile'>
              <img src={file || avatar} alt="avatar" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-200 hover:border-green-400 cursor-pointer" />
            </label>
            <input onChange={onUpload} type='file' id='profile' name='profile' style={{ display: "none" }} />
          </div>

          <div>
            <input {...formik.getFieldProps('email')} type="text" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />
            <input {...formik.getFieldProps('username')} type="text" placeholder="Username" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />
            <input {...formik.getFieldProps('password')} type="text" placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white" />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-green-500 hover:bg-opacity-80">Register</button>

          <div className="text-center text-gray-600">
            <span>Already Register? <Link to="/" className="text-red-500">Login Now</Link></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
