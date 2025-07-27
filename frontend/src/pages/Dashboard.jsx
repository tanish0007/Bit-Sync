import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';  //
import UserVideoBox from '../components/UserVideoBox';
import Footer from '../components/Footer';
import UserNav from '../components/UserNav';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [meetingUrl, setMeetingUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/v1/user/all_activity', {
                    withCredentials: true,
                });
                setHistory(res.data);
            } catch (err) {
                console.error('Failed to fetch history:', err);
            }
        };

        fetchHistory();
    }, []);

    const handleJoinMeeting = () => {
        if (!meetingUrl.trim()) return;
        const code = meetingUrl.split('/').pop();
        navigate(`/meet/${code}`);
    };

    const handleHostMeeting = () => {
        const newRoomId = uuidv4();  // Generate a new room UUID
        navigate(`/room/${newRoomId}`);  // Redirect to MeetingRoom page with roomId
    };

    return (
        <div className='flex flex-col h-screen'>
            <UserNav />
            <main className='flex-1 bg-gray-900 text-white flex flex-row gap-10 items-center justify-center'>

                {/* LEFT SECTION */}
                <div className='w-[30%] p-7 rounded-xl flex flex-col items-center'>
                    <div>
                        <UserVideoBox />
                    </div>

                    {/* Join Meeting */}
                    <div className='mt-4 w-full'>
                        <label className='block text-sm mb-1'>Join a Meeting</label>
                        <div className='flex gap-2'>
                            <input
                                type='text'
                                placeholder='Enter Meeting URL'
                                value={meetingUrl}
                                onChange={(e) => setMeetingUrl(e.target.value)}
                                className='flex-1 px-3 py-2 rounded bg-gray-700 text-white outline-none'
                            />
                            <button
                                onClick={handleJoinMeeting}
                                className='bg-cyan-400 hover:bg-blue-700 px-4 py-2 rounded text-black'
                            >
                                Join Meeting
                            </button>
                        </div>
                    </div>

                    <hr className='my-5 border-gray-600' />

                    {/* Host Meeting */}
                    <button
                        onClick={handleHostMeeting}
                        className='bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full text-white'
                    >
                        Host a Meeting
                    </button>
                </div>

                {/* Vertical Divider */}
                <div className='w-[4px] bg-white/30 h-[500px] rounded-xl'></div>

                {/* RIGHT SECTION */}
                <div className='w-[30%] bg-gray-800 p-4 rounded-xl shadow-lg overflow-y-auto'>
                    <h2 className='text-xl mb-4 font-semibold'>Your Meeting History</h2>
                    {history.length === 0 ? (
                        <p className='text-gray-400'>No meetings yet.</p>
                    ) : (
                        <ul className='space-y-2'>
                            {history.map((meeting, index) => (
                                <li
                                    key={index}
                                    className='bg-gray-700 px-4 py-2 rounded flex justify-between items-center'
                                >
                                    <span>🔗 {meeting.meeting_code}</span>
                                    <span className='text-sm text-gray-400'>
                                        {new Date(meeting.createdAt).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;