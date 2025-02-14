'use client';

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
 
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        submission_date: '',
        payment_date: '',
        payment_status: 'pending',
    });

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            payment_date: name === 'submission_date' ? calculatePaymentDate(value) : prev.payment_date,
        }));
    };

    const calculatePaymentDate = (date: string) => {
        const submissionDate = new Date(date);
        submissionDate.setDate(submissionDate.getDate() + 7);
        return submissionDate.toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('tasks').insert([formData]);
        if (error) {
            alert('Error adding task');
        } else {
            alert('Task added successfully!');
            setFormData({
                name: '',
                description: '',
                price: '',
                submission_date: '',
                payment_date: '',
                payment_status: 'pending',
            });
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-2xl font-semibold text-gray-800">🔒 Please login to add tasks.</h1>
                <p>Dear stalkers this is my personal project and login is restricted in this. So please don't try to login.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6">Add New Task</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Task ID</label>
                        <input name="id" value={formData.id} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
                    </div> */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Task Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Task Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                        <input type="date" name="submission_date" value={formData.submission_date} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                        <input type="date" name="payment_date" value={formData.payment_date} readOnly className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
                        <p className="text-xs text-gray-500">Auto-set to 7 days after submission date</p>
                    </div>
                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                        Submit Task
                    </button>
                </form>
            </div>
        </div>
    );
}
