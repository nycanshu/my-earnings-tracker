'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

interface Task {
    id: number;
    name: string;
    price: number;
    payment_status: 'Claimed' | 'pending';
    submission_date: string;
    created_at: string; // Add created_at field
}

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/');
            } else {
                setUser(user);
            }
        };
        fetchUser();
    }, [router]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            const { data, error } = await supabase.from('tasks').select('*');
            if (error) {
                console.error('Error fetching tasks:', error);
            } else {
                // Sort tasks by created_at date
                const sortedTasks = (data || []).sort((a: Task, b: Task) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setTasks(sortedTasks);
            }
        };
        fetchTasks();
    }, [user]);

    if (!user) return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;

    // Calculate total earnings & pending payments
    const totalEarnings = tasks.reduce((sum, task) => sum + (task.payment_status === 'Claimed' ? task.price : 0), 0);
    const pendingPayments = tasks.reduce((sum, task) => sum + (task.payment_status === 'pending' ? task.price : 0), 0);

    // Function to update payment status
    const updatePaymentStatus = async (taskId: number, newStatus: 'Claimed' | 'pending') => {
        setLoading(true);
        const { error } = await supabase
            .from('tasks')
            .update({ payment_status: newStatus })
            .eq('id', taskId);
        
        if (error) {
            console.error('Error updating status:', error);
        } else {
            setTasks(tasks.map(task => 
                task.id === taskId ? { ...task, payment_status: newStatus } : task
            ));
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6">Dashboard</h1>
                <p className="text-lg text-gray-800 text-center mb-6">Welcome, {user.email}!</p>

                {/* Earnings Summary */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="p-6 bg-white rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-semibold text-gray-700">Total Earnings</h2>
                        <p className="text-3xl font-bold text-green-500">₹{totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-semibold text-gray-700">Pending Payments</h2>
                        <p className="text-3xl font-bold text-red-500">₹{pendingPayments.toFixed(2)}</p>
                    </div>
                </div>

                {/* Task List with Editable Payment Status */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Task History</h2>
                    {tasks.length === 0 ? (
                        <p className="text-gray-500 text-center">No tasks added yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-indigo-600 text-white">
                                        <th className="p-3 text-left">Task Name</th>
                                        <th className="p-3 text-center">Price</th>
                                        <th className="p-3 text-center">Payment Status</th>
                                        <th className="p-3 text-center">Submission Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task.id} className="border-b border-gray-200">
                                            <td className="p-3">{task.name}</td>
                                            <td className="p-3 text-center">₹{task.price.toFixed(2)}</td>
                                            
                                            {/* Dropdown for Payment Status Update */}
                                            <td className="p-3 text-center">
                                                <select
                                                    className="p-2 border rounded-md text-white font-semibold"
                                                    style={{
                                                        backgroundColor: task.payment_status === 'Claimed' ? '#22C55E' : '#EF4444'
                                                    }}
                                                    value={task.payment_status}
                                                    onChange={(e) => updatePaymentStatus(task.id, e.target.value as 'Claimed' | 'pending')}
                                                    disabled={loading}
                                                >
                                                    <option value="Claimed">Claimed</option>
                                                    <option value="pending">Pending</option>
                                                </select>
                                            </td>

                                            <td className="p-3 text-center">{new Date(task.submission_date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}