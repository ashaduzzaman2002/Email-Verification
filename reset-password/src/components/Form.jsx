import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
const baseUrl = 'http://localhot:5000';
const Form = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const history = useNavigate()
  const token = query.get('token');
  const id = query.get('id');

  const [invalidUser, setInvalidUser] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: '',
    cpassword: '',
  });

  const verifyToken = async () => {
    try {
      const { data } = await axios(
        `http://localhost:5000/api/user/verify-token?token=${token}&id=${id}`
      );
      setBusy(false);
      
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) setInvalidUser(data.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const handleChange = ({ target }) => {
    setNewPassword({ ...newPassword, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, cpassword } = newPassword;
    if (password.trim().length < 8) {
      return setError('Password must be atleast 8 characters!');
    }

    if (password !== cpassword) {
      return setError('Password does  match!');
    }

    try {
      setBusy(true);
      const { data } = await axios.post(
        `http://localhost:5000/api/user/reset-password?token=${token}&id=${id}`,
        { password }
      );
      setBusy(false);
      if (data.success) {
        setSuccess(true);
      }
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) setError(data.message);
      }
      console.log(error);
    }
  };

  if (success)
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-gray-500 mb-3">
          Password reset successfully.
        </h1>
      </div>
    );

  if (invalidUser )
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-red-400 mb-3">
          {invalidUser}
        </h1>
      </div>
    );

  if (busy)
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-gray-500 mb-3">Loading...</h1>
      </div>
    );

  return (
    <div className="max-w-screen-sm m-auto pt-40">
      <h1 className="text-center text-3xl text-gray-500 mb-3">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit} className="shadow w-full rounded-lg p-10">
        {error && (
          <p className="text-center p-2 mb-4 bg-red-500 text-white">{error}</p>
        )}
        <div className="space-y-8">
          <input
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={newPassword.password}
            type="password"
            className="px-3 text-lg h-10 w-full border-gray-500 border-2 rounded"
          />

          <input
            type="password"
            name="cpassword"
            onChange={handleChange}
            value={newPassword.cpassword}
            placeholder="Confirm Password"
            className="px-3 text-lg h-10 w-full border-gray-500 border-2 rounded"
          />

          <button
            style={{
              backgroundColor: '#00BCD4',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            type="submit"
            className=" bg-cyan-400 h-10 w-full py-3 text-white border-2 rounded"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
