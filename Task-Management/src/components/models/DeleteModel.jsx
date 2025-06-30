// ConfirmModal.js or inside UserList.jsx
const DeleteModel = ({ isOpen, onConfirm, onCancel,deleteTarget  }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p className="mb-6">Are you sure you want to delete {deleteTarget} ?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );  
};

export default DeleteModel