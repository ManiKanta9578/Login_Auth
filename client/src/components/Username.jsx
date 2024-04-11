import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.jpg';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';
import { useAuthStore } from '../store/store';

const Username = () => {
  const navigate = useNavigate();

  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: ""
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setUsername(values.username);
      navigate('/password');
    }
  })

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position='top-center' reverseOrder={false} />
      <div className="bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Welcome Back!</h2>
          <p className="mt-2 text-lg text-gray-600">Discover more by connecting with us.</p>
        </div>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-center">
            <img src={avatar} alt="avatar" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-200 hover:border-green-400 cursor-pointer" />
          </div>

          <div>
            <input {...formik.getFieldProps('username')} type="text" placeholder="Username" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white" />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-green-500 hover:bg-opacity-80">Let's Go</button>

          <div className="text-center text-gray-600">
            <span>Not a member? <Link to="/register" className="text-red-500">Register Now</Link></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Username;
