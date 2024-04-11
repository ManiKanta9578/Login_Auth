import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import ServerError from './ServerError';
import { verifyPassword } from '../helper/helper';

const Password = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const { isLoading, apiData, serverError } = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: ""
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      // console.log(values)
      let loginPromise = verifyPassword({ username, password: values.password });
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success: 'Login Successfully...!',
        error: 'Incorrect password.'
      })
      loginPromise.then((res) => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile');
      })
    }
  });

  if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  // if (serverError) return <h1 className='text-2xl font-bold text-red-500'>{serverError.message}</h1>;
  if (serverError) return <ServerError message={serverError.message} />

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position='top-center' reverseOrder={false} />
      <div className="bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Hello {apiData?.firstName || username} </h2>
          <p className="mt-2 text-lg text-gray-600">Explore more by connecting with us.</p>
        </div>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-center">
            <img src={apiData?.profile || avatar} alt="avatar" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-200 hover:border-green-400 cursor-pointer" />
          </div>

          <div>
            <input {...formik.getFieldProps('password')} type="text" placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white" />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-green-500 hover:bg-opacity-80">Sign In</button>

          <div className="text-center text-gray-600">
            <span>Forgot Password? <Link to="/recovery" className="text-red-500">Recover Now</Link></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Password;

