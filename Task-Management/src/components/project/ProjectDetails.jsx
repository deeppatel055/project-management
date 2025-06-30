import React, { } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// For task  
import { useDispatch } from 'react-redux';
import { getTasksByProject } from '../../actions/taskActions';
import TaskList from '../task/TaskList';
import { ClipboardList, Edit3, FileText, Pencil, ShieldCheck, Users } from 'lucide-react';
import { deleteProject } from '../../actions/projectActions';
import DeleteModel from '../models/DeleteModel';
import calender from '../../assets/calendar.svg';
import multiUser from '../../assets/multiUser.svg';
import Edit from '../../assets/edit.svg';


export default function ProjectDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { projects } = useSelector((state) => state.projects);
    // eslint-disable-next-line no-unused-vars
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [deleteContent, setDeleteContent] = useState('');
    const [projectToDelete, setProjectToDelete] = useState(null);
    const { user } = useSelector((state) => state.user);
    const canEditOrDelete = user?.role === 'admin' || user?.role === 'superadmin';



    const [projectUsers, setProjectUsers] = useState({ defaultUser: [], createdBy: '' });

    const project = projects.find(p => Number(p.id) === Number(id));

    const dispatch = useDispatch();


    useEffect(() => {
        if (project && project.members) {
            const superadmin = project.members.filter(user => user.role === 'superadmin');
            const creator = project.members.find(user => user.id === project.created_by);

            setProjectUsers({
                defaultUser: superadmin, // ✅ now always an array
                createdBy: creator || 'Not Available'

            });

        }
    }, [project]);


    useEffect(() => {
        if (id) {
            setIsLoading(true);
            dispatch(getTasksByProject(id)).finally(() => setIsLoading(false));
        }
    }, [id, dispatch]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading project details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.5 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
                    <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    // Format date helper with better error handling
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            // eslint-disable-next-line no-unused-vars
        } catch (error) {

            return 'Invalid date';
        }
    };

    // Check if date is overdue
    const isOverdue = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    // Get project status color with better contrast
    const getProjectStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-600 text-white';
            case 'in progress': return 'bg-[#5356FF] text-white';
            case 'pending': return 'bg-red-600 text-white';
            case 'on hold': return 'bg-gray-600 text-white';
            default: return 'bg-blue-600 text-white';
        }
    };
    const confirmDelete = (project) => {
        // Safely check for user object fields
        setDeleteContent(`Project "${project.title}"`);

        setProjectToDelete(project);
        setShowModal(true);


    };
    // Handle delete project with loading state
    const handleDelete = async () => {
        if (!projectToDelete) return;

        await dispatch(deleteProject(projectToDelete.id));
        setShowModal(false);
        setProjectToDelete(null);
        setDeleteContent('');
        navigate('/')

    };

    // Handle edit project
    const handleEdit = () => {
        setIsEditing(true);
        navigate(`/projects/${id}/edit`);
    };

    // Get team members excluding superadmin and creator
    const teamMembers = project.members?.filter(m => m.id !== project.created_by && m.role !== 'superadmin') || [];
    const displayedMembers = showAllMembers ? teamMembers : teamMembers.slice(0, 6);


    const tabs = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'projectTask', label: 'Project Task', icon: ClipboardList },

    ];

    return (
        <div className="p-4 sm:p-6 lg:p-0 lg:pr-10 ">
            {/* Breadcrumb Navigation */}

            {/* Header Section with better accessibility */}
            <div className="backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
                <div className="bg-white px-6 sm:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col gap-5 ">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                <h1 className="text-3xl text-black lg:text-4xl font-bold break-words">
                                    {project.title}
                                </h1>
                                <span className={`px-4 py-2 rounded-full text-black text-sm font-semibold ${getProjectStatusColor(project.status)} shadow-md whitespace-nowrap`}>
                                    {project.status || 'Not Set'}
                                </span>
                            </div>

                            {/* Project summary info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm opacity-90">
                                <div className="flex items-center gap-2">
                                    {/* <svg className=" text-black w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg> */}
                                    <img src={multiUser} alt=""  className='h-4 w-4'/>
                                    <span className='text-black'>{teamMembers.length} team members</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* <svg className=" text-black w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg> */}
                                    <img src={calender} alt=""  className='h-4 w-4'/>
                                    <span className='text-black'>Start: {formatDate(project.starting_date)}</span>

                                </div>
                                <div className="flex items-center gap-2">
                                                                       <img src={calender} alt=""  className='h-4 w-4'/>

                                    <span className='text-black'>Due: {formatDate(project.due_date)}</span>
                                    {isOverdue(project.due_date) && (
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                            Overdue
                                        </span>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Action Buttons with better responsive design */}
                        {canEditOrDelete &&
                            <div className="flex flex-row sm:flex-col gap-3 w-full lg:w-auto">
                                <NavLink
                                    to={`/projects/${project.id}/edit`}
                                    onClick={handleEdit}
                                    className="px-6 py-3 border-1 border-black backdrop-blur-sm text-black rounded-3xl font-medium transition-all duration-200 hover:scale-101 flex items-center justify-center gap-2"
                                    aria-label={`Edit ${project.title}`}
                                >
                                    {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg> */}
                                    <img src={Edit} alt="" className='w-4 h-4' />
                                    Edit Project
                                </NavLink>
                                <button
                                    // onClick={() => setShowModal(true)}
                                    onClick={() => confirmDelete(project)}

                                    className="px-6 py-3 bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm text-white rounded-3xl font-medium transition-all duration-200 hover:scale-101 flex items-center justify-center gap-2"
                                    aria-label={`Delete ${project.title}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Project
                                </button>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex border-b border-gray-200 bg-white/50 backdrop-blur-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center px-4 py-4 text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? 'text-[#5356FF] border-b-2 border-[#5356FF] bg-blue-50/50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                }`}
                        >
                            <tab.icon className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Project Description */}
                    <div className="mb-8">
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">

                                <h2 className="text-xl font-bold text-gray-800">Project Description</h2>
                            </div>
                            <div className="prose prose-gray max-w-none">
                                {project.description ? (
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {project.description}
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

                    {/* Created By & Super Admins */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
                        <div className="flex flex-col gap-6 rounded-2xl p-6 bg-white shadow-lg h-fit">
                            {/* Created By */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Created By</h3>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow">
                                    <img
                                        src={projectUsers.createdBy.profile_picture
                                            || 'http://localhost:5000/public/images/default-profile.png'
                                        }
                                        alt={projectUsers.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'http://localhost:5000/public/images/default-profile.png';
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-gray-800 truncate" title={projectUsers.createdBy.email}>
                                            {projectUsers.createdBy.email}
                                        </div>
                                        <div className="text-sm text-gray-500 capitalize">
                                            {projectUsers.createdBy.role}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Super Admins */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Super Admins</h3>
                                </div>

                                {Array.isArray(projectUsers.defaultUser) && projectUsers.defaultUser.length === 0 ? (
                                    <p className="text-gray-500">No superadmins found.</p>
                                ) : Array.isArray(projectUsers.defaultUser) ? (

                                    <div className="grid gap-4">
                                        {projectUsers.defaultUser.map((user) => (
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
                                                        {user.role}
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

                        {/* Team Members */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border h-fit border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">

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
                                    {displayedMembers.map((member, index) => (
                                        <div
                                            key={index}
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
                                                    {member.role}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium text-gray-500 mb-2">No Team Members</h3>
                                    <p className="text-gray-400 text-sm">No team members have been assigned to this project yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}


            {activeTab === "projectTask" && (
                < div className="mb-8">
                    <TaskList />
                </div>
            )
            }




            <DeleteModel                isOpen={showModal}
                onConfirm={handleDelete}
                onCancel={() => setShowModal(false)}
                deleteTarget={deleteContent}
            />

        </div >
        // </div>
    );

}
