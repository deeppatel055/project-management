import TaskCom from './../../assets/TASK.COM.png'
import Logo from './../../assets/LOGO.png'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import API from './../../services/api';
const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
       await API.post('/users/login', form, {withCredentials: true});
    //   localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true); // this triggers re-render in App.js
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };


    return (
        <div className="h-screen w-screen overflow-hidden m-0 p-0 grid  bg-[#E6E6E6]">

            <div className='grid grid-cols-1 m-auto md:grid-cols-2  w-[75%] h-[75%] shadow-xl/20 mt-auto rounded-2xl bg-[#CCCCCC]' >
                <div className="flex flex-col justify-center items-center p-0 pt-4 md:pt-0 h-[25vh] md:h-auto bg-transparent ">
                    {/* Desktop Logo */}
                    <img
                        src={Logo}
                        alt="Logo"
                        className="hidden md:block max-w-full w-[25%]  h-[25%]"
                    />
                    <img
                        src={TaskCom}
                        alt="Logo"
                        className="hidden md:block max-w-full"
                    />

                </div>
                {/* Right Side   */}
                <div className='flex justify-center items-center w-full h-full'>
                    <div className='w-4/5 max-w-[400px] text-center'>
                        <h1 className='text-5xl font-bold uppercase font-poppins my-5'>Login</h1>

                        <form className='text-gray-500 mt-1 mb-3' onSubmit={handleLogin}>
                            {/* Email Input  */}
                            <div className='relative'>
                                <div className='flex items-center  rounded-xl px-2 mt-2 border-2'>
                                    <FaUser className='text-gray-500 text-xl mr-2' />
                                    <input type="email" value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })} name="email" placeholder='Email address' className="w-full bg-transparent p-4 text-black text-xl outline-none" required />

                                </div>

                            </div>
                            <div className="relative mt-5 ">
                                <div className="flex items-center  rounded-xl px-2 mt-2 border-2">
                                    <RiLockPasswordLine className="text-gray-500  text-xl mr-2" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        //   value={password}
                                        //   onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent p-4 text-black text-xl outline-none" required
                                    />
                                </div>
                            </div>
                            {/* Forgot Password Link */}
                            <Link
                                to="/forgot-password"
                                className="flex justify-end text-black text-lg mt-1  hover:underline"
                            >
                                Forgot Password?
                            </Link>

                            {/* Submit Button */}


                            <button
                                type="submit"
                                className="w-full bg-[#5356FF] text-white rounded-full mt-4 py-2 text-2xl hover:text-black transition-colors duration-200"
                            >
                                Submit
                            </button>


                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Login