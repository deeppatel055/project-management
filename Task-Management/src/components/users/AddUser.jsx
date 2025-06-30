import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { User, Mail, Phone, Lock, Shield, Eye, EyeOff, Upload, X, Camera, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { addUser } from './../../actions/userActions';
import SuccessModal from '../models/SucessModel';


// Success Modal Component


const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'read',
    password: '',
    profile_picture: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);



  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      role: 'read',
      profile_picture: null,
    });
    setErrors({});
    setShowPassword(false);
    setImagePreview(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid';
    // if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required';
    // if (!/^\d{10}$/.test(formData.mobile)) errs.mobile = 'Mobile number must be 10 digits';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!formData.role) errs.role = 'Role is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile_picture' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, profile_picture: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profile_picture: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return
    };

    setLoading(true);
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
    await dispatch(addUser(data));
      // console.log('dat', data);
      
      setShowSuccessModal(true);
    } catch (error) {
      alert(`Failed to add user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const validationErrors = validate();
  //   setErrors(validationErrors);
  //   if (Object.keys(validationErrors).length > 0) {
  //     return;
  //   }

  //   setLoading(true);
  //   const data = new FormData();
  //   for (const key in formData) {
  //     if (formData[key]) {
  //       data.append(key, formData[key]);
  //     }

  //   }

  //   // try {
  //   //   const result = await dispatch(addUser(data));
  //   //   if (result.success) {
  //   //     setShowSuccessModal(true);
  //   //   } else {
  //   //     alert(`Failed to add user: ${result.message}`);
  //   //   }
  //   // } catch (error) {
  //   //   alert(`Unexpected error: ${error.message}`);
  //   // } finally {
  //   //   setLoading(false);
  //   console.log('user can added');

  //   setShowSuccessModal(true);

  //   // navigate(-1)
  //   // }
  //   // try {
  //   //   const result = await dispatch(addUser(data));
  //   //   console.log('Dispatch Result:', result); // <== Add this
  //   //   if (result.success) {
  //   //     setShowSuccessModal(true);
  //   //   } else {
  //   //     alert(`Failed to add user: ${result.message}`);
  //   //   }
  //   // } catch (error) {
  //   //   alert(`Unexpected error: ${error.message}`);
  //   // }

  // };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Reset form for adding another user
    handleReset();
  };

  const handleNavigateToUsers = () => {
    setShowSuccessModal(false);
    navigate('/users');
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto  px-4">


      {/* Success Modal */}
      {/* {showSuccessModal && ( */}
        <SuccessModal

         isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          onNavigate={handleNavigateToUsers}
          message="Verification email has been sent to the user."
        />
      {/* )} */}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start">
            <div className="relative mb-4 sm:mb-0">
              <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center relative group">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-white hover:text-red-300 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm">Profile Photo</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>

            <div className="sm:ml-6 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-600 mb-3">
                Upload a profile picture for the user. JPG, PNG or GIF (max 5MB)
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <label
                  htmlFor="profile_picture"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Enter mobile number"
                />
              </div>
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters
              </p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                User Role *
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white appearance-none ${errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="read">Read</option>
                  <option value="write">Write</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 mt-8 pt-6 border-t border-gray-200">
            {/* Back Button - Left Side */}
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>

            {/* Right Side Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#5356FF] text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding User...
                  </>
                ) : (
                  'Add User'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;