import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageSquare,
  Plus,
  Save,
  X,
  User,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Clock
} from "lucide-react";
import { addTaskNote, deleteTaskNote, getTaskDetail, getTaskNotes } from "../../actions/taskActions";

export default function TaskNotes() {
  const dispatch = useDispatch();
  const { task } = useSelector((state) => state.taskDetail);
  const { notes = [] } = useSelector((state) => state.taskNotes);
  const { user } = useSelector((state) => state.allUsers);

  const [isAdding, setIsAdding] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Auto-focus textarea when adding/editing
  useEffect(() => {
    if (task?.id) {
      dispatch(getTaskNotes(task.id));
    }
  }, [dispatch, task?.id]);
  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAdding]);

  // const handleAdd = async () => {
  //   if (!noteText.trim()) {
  //     alert("Please enter a note before saving.");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     await dispatch(addTaskNote(task.id, noteText.trim()));

  //     // ✅ Re-fetch the notes to get full info including user name and timestamp
  //     await dispatch(getTaskNotes(task.id));

  //     setNoteText("");
  //     setIsAdding(false);
  //   } catch (error) {
  //     console.error("Failed to add note:", error);
  //     alert("Failed to add note. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
const handleAdd = async () => {
  if (!noteText.trim()) {
    alert("Please enter a note before saving.");
    return;
  }

  setIsSubmitting(true);
  try {
    // ✅ Add note
    await dispatch(addTaskNote(task.id, noteText.trim()));

    // ✅ Re-fetch full task detail including updated audit logs
    await dispatch(getTaskDetail(task.id));

    // Reset UI state
    setNoteText("");
    setIsAdding(false);
  } catch (error) {
    console.error("Failed to add note:", error);
    alert("Failed to add note. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleDelete = async (noteId) => {
    setIsSubmitting(true);
    try {
      await dispatch(deleteTaskNote(noteId, task.id));
      await dispatch(getTaskNotes(task.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note.id);
    setEditText(note.content || "");
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      alert("Please enter a note before saving.");
      return;
    }

    setEditingNote(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditText("");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNoteText("");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content) => {
    if (typeof content === "string") return content;
    if (typeof content === "object") return JSON.stringify(content, null, 2);
    return String(content || "");
  };

  const sortedNotes = [...notes].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Task Notes
              </h2>
              <p className="text-sm text-gray-600">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Add Note Form */}
        {isAdding && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">{user?.name || 'You'}</span>
              <span className="text-xs text-gray-500 ml-2">
                <Clock className="h-3 w-3 inline mr-1" />
                Now
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Share your thoughts, updates, or observations about this task..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">
                <span className={noteText.length > 500 ? 'text-red-500' : 'text-gray-500'}>
                  {noteText.length}/500 characters
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isSubmitting || !noteText.trim() || noteText.length > 500}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Note
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-500 mb-4">Start a conversation about this task by adding your first note.</p>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Note
                </button>
              )}
            </div>
          ) : (
            sortedNotes.map((note, index) => (
              <div
                key={note?.id || `note-${index}`}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors duration-200 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Note Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {note?.name || 'Unknown User'}
                          </span>
                          {user?.id === note?.user_id && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDateTime(note?.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Note Content */}
                    <div className="ml-11">
                      {editingNote === note?.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="group">
                          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {formatContent(note?.content)}
                          </p>

                          {/* Note Actions */}
                          {user?.id == notes?.user_id && (
                            <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => handleEdit(note)}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                Edit
                              </button>

                              {deleteConfirm === note?.id ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Delete this note?
                                  </span>
                                  <button
                                    onClick={() => handleDelete(note?.id)}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(note?.id)}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}