import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Lock, Shield, Image, ArrowLeft, Upload, Camera, X } from 'lucide-react';

// import { loadCurrentUser } from '../actions/userActions'; // If needed for refresh
import { getUserById, editUser } from './../../actions/userActions';
import Loading from '../common/Loading';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors for user details state (loading, error, data)
  const userDetailsState = useSelector(state => state.userDetails);
  const { loading: loadingDetails, error: errorDetails, user } = userDetailsState;

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'read',
    profile_picture: null,
  });

  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fetch user data on mount or when id changes
  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id]);

  // When user data is fetched successfully, set form and preview
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        role: user.role || 'read',
        password: '',
        profile_picture: null,
      });
      setPreview(user.profile_picture || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture' && files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('File size should be less than 5MB');
        return;
      }
      setForm(prev => ({ ...prev, profile_picture: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };


  const removeImage = () => {
    setForm(prev => ({ ...prev, profile_picture: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!id) {
      setLocalError('User ID is missing');
      return;
    }

    setLoadingSubmit(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('mobile', form.mobile || '');
      if (form.password) formData.append('password', form.password);
      formData.append('role', form.role);
      if (form.profile_picture) formData.append('profile_picture', form.profile_picture);
      formData.append('id', id);

      await dispatch(editUser(formData));

      alert('User updated successfully!');
      navigate('/users');
    } catch (err) {
      setLocalError(err.message || 'Failed to update user');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingDetails) return <Loading />;
  if (errorDetails) return <div className="p-4 text-red-600">Error: {errorDetails}</div>;

  return (
    <div className="max-w-4xl mx-auto  px-4">


      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          {/* Profile Picture Section */}

          <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start">
            <div className="relative mb-4 sm:mb-0">
              <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center relative group">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-0 transition-opacity flex items-center justify-center">
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
                {preview && (
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
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border rounded-lg transition-colors"
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className=" w-full pl-11 pr-4 py-3 border rounded-lg transition-colors "
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border rounded-lg transition-colors"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password (Leave blank to keep current)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 border rounded-lg transition-colors"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                User Role *
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border rounded-lg transition-colors bg-white appearance-none "
                  required
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
            </div>
          </div>


          {(localError || errorDetails) && (
            <p className="text-red-500 text-sm">{localError || errorDetails}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 mt-8 pt-6 border-t border-gray-200">
            {/* Back button - bottom left */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              disabled={loadingSubmit}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {/* Action buttons - bottom right */}
            <div className="flex space-x-4">

              <button
                type="submit"
                className="px-8 py-3 bg-[#5356FF] text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating User...
                  </>
                ) : (
                  'Update User'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;