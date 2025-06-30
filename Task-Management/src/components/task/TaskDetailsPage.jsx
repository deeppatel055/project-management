import { useEffect, useState } from "react";
import {
    Flag,
    Edit3,
    FileText,
    History,
    CheckCircle2,
    AlertCircle,
    Pencil,
    ShieldCheck
} from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTaskDetail, deleteTask } from "../../actions/taskActions";
import TaskNotes from "./TaskNote";
import AuditHistory from "./TaskAudit";
import DeleteModel from './../models/DeleteModel';
import Edit from '../../assets/edit.svg'

export default function TaskDetails() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { loading, task, } = useSelector((state) => state.taskDetail);
    const { task_id } = useParams();
    const [showAllMembers, setShowAllMembers] = useState(false);


    const [activeTab, setActiveTab] = useState('overview');
    const [taskUser, setTaskUsers] = useState({ defaultUser: [], createdBy: '' })
    const [deleteContent, setDeleteContent] = useState('');
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    console.log('task', task);
    

    useEffect(() => {
        if (task && task.assigned_members) {
            const superadmin = task.assigned_members.filter(user => user.user_role === 'superadmin');
            const created_by = task.assigned_members.find(user => user.id === task.user_id)

            setTaskUsers({
                defaultUser: superadmin,
                createdBy: created_by
            })
            console.log('defaultUser', superadmin);
            
        }
    }, [task])
console.log('Array.isArray(taskUser.defaultUser)', taskUser.defaultUser.length === 0);

    useEffect(() => {
        dispatch(getTaskDetail(task_id));
    }, [dispatch, task_id]);

    const formatDate = (dateString) =>
        dateString
            ? new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            : "Not set";



    const getPriorityConfig = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return {
                    color: "text-red-700 bg-gradient-to-r from-red-50 to-red-100 border-red-200",
                    icon: AlertCircle,
                    pulse: "animate-pulse"
                };
            case "medium":
                return {
                    color: "text-amber-700 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200",
                    icon: Flag,
                    pulse: ""
                };
            case "low":
                return {
                    color: "text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200",
                    icon: CheckCircle2,
                    pulse: ""
                };
            default:
                return {
                    color: "text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200",
                    icon: Flag,
                    pulse: ""
                };
        }
    };



    // };
    const getProjectStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-600 text-white';
            case 'in progress': return 'bg-[#5356FF] text-white';
            case 'pending': return 'bg-red-600 text-white';
            case 'on hold': return 'bg-gray-600 text-white';
            default: return 'bg-blue-600 text-white';
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'notes', label: 'Notes', icon: Edit3 },
        { id: 'history', label: 'History', icon: History }
    ];

    const priorityConfig = getPriorityConfig(task?.priority);
    const PriorityIcon = priorityConfig.icon;

    const teamMembers = task.assigned_members?.filter(t => t.id != task.user_id && t.user_role !=='superadmin') || []

    const displayMembers = showAllMembers ? teamMembers : teamMembers.slice(0, 6)
    const confirmDelete = (task) => {
        setDeleteContent(`Task "${task.id}"`)
        setTaskToDelete(task)
        setShowModal(true)
    }

    const handleDelete = async () => {
        if (!taskToDelete) return;
        await dispatch(deleteTask(taskToDelete.id));
        setShowModal(false)
        setTaskToDelete(null)
        setDeleteContent('')
        navigate(-1)

    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (

        <div className="p-4 sm:p-6 lg:p-0 lg:pr-10 ">

            {/* Header */}
            <div className="backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
                <div className="bg-white px-6 sm:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col gap-5 ">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                <h1 className="text-3xl text-black lg:text-4xl font-bold break-words">
                                    {task?.title}
                                </h1>
                                <span className={`px-4 py-2 rounded-full text-black text-sm font-semibold ${getProjectStatusColor(task?.status)} shadow-md whitespace-nowrap`}> {task?.status || 'Not Set'}</span>

                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig.color} ${priorityConfig.pulse}`}>
                                    <PriorityIcon className="h-4 w-4 mr-1.5" />
                                    {task?.priority}
                                </span>
                            </div>
                            {/* <NavLink
                                to={`/projects/${task?.project_id}/tasks/${task_id}/edit`}
                                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit Task
                            </NavLink> */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm opacity-90">
                                <div className="flex items-center gap-2">
                                    <svg className=" text-black w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className='text-black'>{teamMembers.length} team members</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className=" text-black w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className='text-black'>Start: {formatDate(task.starting_date)}</span>

                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className=" text-black w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className='text-black'>Due: {formatDate(task.due_date)}</span>
                                    {/* {isOverdue(task.due_date) && (
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                            Overdue
                                        </span>
                                    )} */}
                                </div>

                            </div>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-3 w-full lg:w-auto">
                            <NavLink
                                to={`/projects/${task?.project_id}/tasks/${task_id}/edit`}
                                // onClick={handleEdit}
                                className="px-6 py-3 border-1 border-black backdrop-blur-sm text-black rounded-3xl font-medium transition-all duration-200 hover:scale-102 flex items-center justify-center gap-2"
                                aria-label={`Edit ${task.title}`}
                            >
                                {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg> */}
                                <img src={Edit} alt="" className="w-3 h-3" />
                                Edit Task
                            </NavLink>
                            <button
                                onClick={() => confirmDelete(task)}
                                className="px-6 py-3 bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm text-white rounded-3xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                                aria-label={`Delete ${task.title}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Task
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-white/50 backdrop-blur-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center px-4 py-4 text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                }`}
                        >
                            <tab.icon className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
                <>
                    <div className="mb-8">
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Task Description</h2>
                            </div>
                            <div className="prose prose-gray max-w-none">
                                {task.description ? (
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {task.description}
                                    </p>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="italic">No description provided</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
                        <div className="flex flex-col gap-6 rounded-2xl p-6 bg-white shadow-lg h-fit">
                            {/* Created By */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Pencil />
                                    <h3 className="text-lg font-bold text-gray-800">Created By</h3>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow">
                                    <img
                                        src={taskUser.profile_picture || 'http://localhost:5000/public/images/default-profile.png'}
                                        alt={taskUser.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'http://localhost:5000/public/images/default-profile.png';
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-gray-800 truncate" title={taskUser.createdBy.email}>
                                            {taskUser.createdBy.email}
                                        </div>
                                        <div className="text-sm text-gray-500 capitalize">
                                            {taskUser.createdBy.role}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <ShieldCheck />
                                    <h3 className="text-lg font-bold text-gray-800">Super Admins</h3>
                                </div>

                                {Array.isArray(taskUser.defaultUser) && taskUser.defaultUser.length === 0 ? (
                                    <p className="text-gray-500">No superadmins found.</p>
                                ) : Array.isArray(taskUser.defaultUser) ? 
                                ( 
                                    <div className="grid gap-4">
                                    {taskUser.defaultUser.map((user) => (
                                       <div key={user.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow">
                                                <img
                                                    src={user.profile_picture || 'http://localhost:5000/public/images/default-profile.png'}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'http://localhost:5000/public/images/default-profile.png';
                                                    }}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium text-gray-800 truncate" title={user.email}>
                                                        {user.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500 capitalize">
                                                        {user.user_role}
                                                    </div>
                                                </div>
                                            </div>
                                    ))}
                                    </div>
                                ) : (
                                    <p className="text-red-500 text-sm">Invalid data format for superadmins.</p>
                                )}
                            </div>
                        </div>

                        {/* </div>
                        </div> */}



                        {/* Team Members */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <svg className=" text-black w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
                                </div>

                                {teamMembers.length > 6 && (
                                    <button
                                        onClick={() => setShowAllMembers(!showAllMembers)}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
                                    >
                                        {showAllMembers ? 'Show Less' : `Show All (${teamMembers.length})`}
                                    </button>
                                )}
                            </div>

                            {teamMembers.length > 0 ? (
                                <div className="grid gap-4">

                                    {displayMembers.map((member,) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow"
                                        >
                                            <img
                                                src={member.profile_picture || 'http://localhost:5000/public/images/default-profile.png'}
                                                alt={member.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'http://localhost:5000/public/images/default-profile.png';
                                                }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-gray-800 truncate" title={member.email}>
                                                    {member.email}
                                                </div>
                                                <div className="text-sm text-gray-500 capitalize">
                                                    {member.user_role}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) :
                                (
                                    <div className="text-center py-12">
                                        <h3 className="text-lg font-medium text-gray-500 mb-2">No Team Members</h3>
                                        <p className="text-gray-400 text-sm">No team members have been assigned to this project yet.</p>
                                    </div>
                                )}

                        </div>
                    </div>
                </>
            )}


            {
                activeTab === 'notes' && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8">
                        <TaskNotes />
                    </div>
                )
            }

            {
                activeTab === 'history' && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8">
                        <AuditHistory />
                    </div>
                )
            }

            <DeleteModel isOpen={showModal}
                onConfirm={handleDelete}
                onCancel={() => setShowModal(false)}
                deleteTarget={deleteContent}
            />
        </div >
    );
}