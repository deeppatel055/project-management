import { useSelector } from "react-redux";
import { History, User, Eye, Edit3, Trash2, Plus, MessageSquare, UserCheck } from "lucide-react";
import { useState } from "react";

const ICON_MAP = {
  create: <Plus className="h-4 w-4 text-green-600" />,
  update: <Edit3 className="h-4 w-4 text-blue-600" />,
  delete: <Trash2 className="h-4 w-4 text-red-600" />,
  assign: <UserCheck className="h-4 w-4 text-purple-600" />,
  note_add: <MessageSquare className="h-4 w-4 text-green-600" />,
  NOTE_delete: <Trash2 className="h-4 w-4 text-red-600" />,
  DEFAULT: <Eye className="h-4 w-4 text-gray-600" />,
};

const COLOR_MAP = {
  create: "bg-green-50 border-green-200",
  update: "bg-blue-50 border-blue-200",
  delete: "bg-red-50 border-red-200",
  assign: "bg-purple-50 border-purple-200",
  note_add: "bg-green-50 border-green-200",
  NOTE_DELETE: "bg-red-50 border-red-200",
  DEFAULT: "bg-gray-50 border-gray-200",
};

export default function AuditHistory() {
  const { auditLogs = [] } = useSelector((state) => state.taskDetail);
  const [showAuditHistory, setShowAuditHistory] = useState(true);


  const parsed = auditLogs.map((log) => {
    // console.log('actione type', ICON_MAP[log.action_type] || ICON_MAP.DEFAULT);

    return {
      ...log,
      previous_data: log.previous_data ? JSON.parse(log.previous_data) : {},
      new_data: log.new_data ? JSON.parse(log.new_data) : {},
    };
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const formatDate = (str) =>
    new Date(str).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderChangeDetails = (log) => {
    if (log.action_type === 'CREATE') {
      return (
        <div className="mt-2 text-sm">
          <p className="text-gray-600 mb-1">Initial task data:</p>
          <div className="bg-white rounded p-2 text-xs">
            {Object.entries(log.new_data || {}).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium text-gray-500 w-20 capitalize">
                  {key.replace('_', ' ')}:
                </span>
                <span className="text-gray-700">
                  {typeof value === 'object' ? JSON.stringify(value) : value || 'Not set'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }


    if (log.action_type === 'NOTE_ADD') {
      return (
        <div className="mt-2 text-sm">
          <p className="text-gray-600 mb-1">Added note:</p>
          <div className="bg-white rounded p-2 text-xs italic text-gray-700">
            "{log.new_data?.note}"
          </div>
        </div>
      );
    }

    if (log.action_type === 'NOTE_DELETE') {
      return (
        <div className="mt-2 text-sm">
          <p className="text-gray-600 mb-1">Deleted note:</p>
          <div className="bg-white rounded p-2 text-xs italic text-gray-700 line-through">
            "{log.previous_data?.note}"
          </div>
        </div>
      );
    }

    if (log.previous_data && log.new_data && Object.keys(log.new_data).length > 0) {
      return (
        <div className="mt-2 text-sm">
          <p className="text-gray-600 mb-1">Changes made:</p>
          <div className="bg-white rounded p-2 text-xs space-y-1">
            {Object.keys(log.new_data).map((key) => {
              const oldValue = log.previous_data[key];
              const newValue = log.new_data[key];
              const formattedOld = typeof oldValue === 'object' ? JSON.stringify(oldValue) : oldValue;
              
              const formattedNew = typeof newValue === 'object' ? JSON.stringify(newValue) : newValue;

              const isFirstTime = oldValue === undefined || oldValue === null || oldValue === '';

              return (
                <div key={key} className="flex">

                    <span className="font-medium text-gray-500 capitalize">{key.replace('_', ' ')} :</span>
                    <div className="ml-2 ">
                      {isFirstTime ? (
                        <span className="text-green-600">{formattedNew || 'Set'}</span>
                      ) : (
                        <>
                          <span className="text-red-600 line-through">
                            {formattedOld || 'Not set'}
                          </span>
                          <span className="mx-2">→</span>
                          <span className="text-green-600">{formattedNew || 'Not set'}</span>
                        </>
                      )}
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <History className="h-5 w-5 mr-2" /> Activity History ({parsed.length})
        </h2>
        <button
          onClick={() => setShowAuditHistory(!showAuditHistory)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showAuditHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>
      {showAuditHistory && (

        <div className="px-6 py-4">
          {parsed.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-4" />
              No activity history available.
            </div>
          ) : (
            <ul className="space-y-4">
              {parsed.map((log) => (
                <li key={log.id} className={`border p-4 rounded-lg ${COLOR_MAP[log.action_type] || COLOR_MAP.DEFAULT}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      {ICON_MAP[log.action_type] || ICON_MAP.DEFAULT}
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{log.user_name}</span>
                      <span className="text-sm text-gray-600">{log.change_summary || log.action_type}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(log.created_at)}</span>
                  </div>

                  {renderChangeDetails(log)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

    </div>
  );
}
