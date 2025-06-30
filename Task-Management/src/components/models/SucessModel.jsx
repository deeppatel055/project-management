import { CheckCircle, MailCheck } from "lucide-react";

const SuccessModal = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <MailCheck 
 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2"> Verification Email Sent!</h3>
          <p className="text-gray-600 mb-6">We’ve sent a verification email to the user.
Once they verify their email, their account will be ready to use</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onNavigate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Users
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SuccessModal;