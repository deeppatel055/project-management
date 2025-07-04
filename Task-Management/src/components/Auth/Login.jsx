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


// import TaskCom from './../../assets/TASK.COM.png'
// import Logo from './../../assets/LOGO.png'
// import { FaUser } from "react-icons/fa";
// import { RiLockPasswordLine } from "react-icons/ri";
// import { Link, useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// import API from './../../services/api';

// const Login = ({ setIsAuthenticated }) => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//        await API.post('/users/login', form, {withCredentials: true});
//       setIsAuthenticated(true);
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Login failed: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#E6E6E6]">
//       <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 shadow-xl rounded-2xl bg-[#CCCCCC] overflow-hidden min-h-[500px] lg:min-h-[600px]'>
        
//         {/* Left Side - Logo Section */}
//         <div className="flex flex-col justify-center items-center p-6 lg:p-8 bg-transparent order-2 lg:order-1">
//           {/* Mobile Logo - Smaller and Horizontal Layout */}
//           <div className="flex items-center gap-4 lg:hidden mb-4">
//             <img
//               src={Logo}
//               alt="Logo"
//               className="w-12 h-12 sm:w-16 sm:h-16"
//             />
//             <img
//               src={TaskCom}
//               alt="Task.com"
//               className="h-8 sm:h-10 w-auto"
//             />
//           </div>

//           {/* Desktop Logo - Vertical Layout */}
//           <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-6">
//             <img
//               src={Logo}
//               alt="Logo"
//               className="w-24 h-24 xl:w-32 xl:h-32"
//             />
//             <img
//               src={TaskCom}
//               alt="Task.com"
//               className="h-12 xl:h-16 w-auto"
//             />
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className='flex justify-center items-center w-full p-6 lg:p-8 order-1 lg:order-2'>
//           <div className='w-full max-w-sm'>
//             <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold uppercase font-poppins mb-6 lg:mb-8 text-center'>
//               Login
//             </h1>

//             <form className='space-y-4' onSubmit={handleLogin}>
//               {/* Email Input */}
//               <div className='relative'>
//                 <div className='flex items-center rounded-xl px-3 py-2 border-2 border-gray-300 focus-within:border-[#5356FF] transition-colors'>
//                   <FaUser className='text-gray-500 text-lg sm:text-xl mr-3 flex-shrink-0' />
//                   <input 
//                     type="email" 
//                     value={form.email}
//                     onChange={(e) => setForm({ ...form, email: e.target.value })} 
//                     name="email" 
//                     placeholder='Email address' 
//                     className="w-full bg-transparent py-2 sm:py-3 text-black text-lg sm:text-xl outline-none placeholder-gray-400" 
//                     required 
//                   />
//                 </div>
//               </div>

//               {/* Password Input */}
//               <div className="relative">
//                 <div className="flex items-center rounded-xl px-3 py-2 border-2 border-gray-300 focus-within:border-[#5356FF] transition-colors">
//                   <RiLockPasswordLine className="text-gray-500 text-lg sm:text-xl mr-3 flex-shrink-0" />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     value={form.password}
//                     onChange={(e) => setForm({ ...form, password: e.target.value })}
//                     className="w-full bg-transparent py-2 sm:py-3 text-black text-lg sm:text-xl outline-none placeholder-gray-400" 
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Forgot Password Link */}
//               <div className="flex justify-end">
//                 <Link
//                   to="/forgot-password"
//                   className="text-black text-base sm:text-lg hover:underline hover:text-[#5356FF] transition-colors"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-[#5356FF] text-white rounded-full py-3 sm:py-4 text-xl sm:text-2xl hover:bg-[#4148cc] hover:text-white transition-all duration-300 font-medium"
//               >
//                 Submit
//               </button>

//               {/* Error Message */}
//               {error && (
//                 <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
//                   <p className="text-red-700 text-sm sm:text-base text-center">{error}</p>
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login