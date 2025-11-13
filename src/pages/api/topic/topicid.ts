import { connectDB } from "@/lib/mongodb";
import Topic from "@/models/Topic";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper function to create a case-insensitive, trimmed slug query
const createSlugQuery = (slug: string) => {
    // 1. Trim whitespace
    const cleanedSlug = slug.trim();
    
    // 2. Use RegEx for case-insensitive exact match
    return { slug: { $regex: new RegExp(`^${cleanedSlug}$`, 'i') } };
};

// GET single topic by slug
export async function GET(_: Request, { params }: { params: { slug: string } }) {
    await connectDB();
    try {
        const query = createSlugQuery(params.slug);
        
        // This must find the topic now that TopicPage works
        const topic = await Topic.findOne(query);

        if (!topic)
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
            
        return NextResponse.json({ success: true, topic });
    } catch (error) {
        console.error("GET Topic Error:", error);
        return NextResponse.json({ message: "Error fetching topic" }, { status: 500 });
    }
}

// PUT (Update) single topic by slug
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
    await connectDB();
    try {
        const body = await req.json();
        const query = createSlugQuery(params.slug);
        
        const updated = await Topic.findOneAndUpdate(query, body, {
            new: true,
        });

        if (!updated)
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
            
        return NextResponse.json({ success: true, topic: updated });
    } catch (error) {
        console.error("PUT Topic Error:", error);
        return NextResponse.json({ message: "Error updating topic" }, { status: 500 });
    }
}

// DELETE single topic by slug
export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
    await connectDB();
    try {
        const query = createSlugQuery(params.slug);
        
        const deleted = await Topic.findOneAndDelete(query);
        
        if (!deleted)
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
            
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Topic Error:", error); 
        return NextResponse.json({ message: "Error deleting topic" }, { status: 500 });
    }
}