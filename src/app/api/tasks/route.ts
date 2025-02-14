import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all tasks
export async function GET() {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 200 });
}

// POST a new task
export async function POST(req: Request) {
    const task = await req.json();
    const { data, error } = await supabase.from('tasks').insert([task]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
