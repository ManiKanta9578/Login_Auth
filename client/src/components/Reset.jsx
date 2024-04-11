import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidate } from '../helper/validate';
import { useAuthStore } from '../store/store';
import { resetPassword } from '../helper/helper';
import { Navigate, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook';
import ServerError from './ServerError';

const Reset = () => {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const { isLoading, apiData, status, serverError } = useFetch('createResetSession');

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      let resetPromise = resetPassword({ username, password: values.password });
      toast.promise(resetPromise, {
        loading: 'Updating...',
        success: 'Reset successfully...!',
        error: 'Could not Reset!'
      });
      resetPromise.then(() => navigate('/password'))
    }
  })

  if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if (serverError) return <ServerError message={serverError.message} />
  if (status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position='top-center' reverseOrder={false} />
      <div className="bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Reset</h2>
          <p className="mt-2 text-lg text-gray-600">Enter new password.</p>
        </div>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>



          <div>
            <input {...formik.getFieldProps('password')} type="text" placeholder="New Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white mb-3" />
            <input {...formik.getFieldProps('confirmPassword')} type="text" placeholder="Confirm Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400 bg-transparent text-white" />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-green-500 hover:bg-opacity-80">Reset</button>

          {/* <div className="text-center text-gray-600">
            <span>Forgot Password? <Link to="/recovery" className="text-red-500">Recover Now</Link></span>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Reset;
