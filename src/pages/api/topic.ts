import { NextApiRequest, NextApiResponse } from "next"; // <-- Changed to standard Pages Router types
import mongoose from "mongoose";
import Topic, { DescriptionNode } from "@/models/Topic"; // Adjust path as necessary
// import { auth } from "@/lib/auth"; // Assume you have an auth function

// Utility function to connect to MongoDB
async function connectToDatabase() {
  // Replace with your actual database connection logic
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

// ----------------------
// Unified API Handler (Required for Pages Router compatibility)
// ----------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  // Function to handle GET logic
  const handleGET = async () => {
    try {
      // const session = await auth();
      // if (!session || !session.user) {
      //   return res.status(401).send("Unauthorized"); // Pages Router response
      // }

      await connectToDatabase();
      
      // Fetch only the simple fields for the list view
      const topics = await Topic.find({}, 'name exam slug link views createdAt updatedAt').lean();

      return res.status(200).json(topics); // Pages Router response
    } catch (error) {
      console.error("GET /api/topics error:", error);
      return res.status(500).send("Internal Server Error"); // Pages Router response
    }
  };

  // Function to handle POST logic
  const handlePOST = async () => {
    try {
      // const session = await auth();
      // if (!session || !session.user || session.user.role !== 'admin') {
      //   return res.status(403).send("Forbidden"); // Pages Router response
      // }

      await connectToDatabase();
      // In Pages Router, the body is typically available directly via req.body
      const body = req.body; 

      // Basic validation (more comprehensive validation would be ideal)
      if (!body.name || !body.exam || !body.slug) {
        return res.status(400).send("Missing required fields: name, exam, slug"); // Pages Router response
      }
      
      // Ensure nested JSON data is parsed if sent as strings (e.g., from a textarea)
      if (typeof body.description === 'string' && body.description) {
          try {
              body.description = JSON.parse(body.description);
          } catch (e) {
              return res.status(400).send("Invalid JSON format for description"); // Pages Router response
          }
      }
      // Set defaults for optional fields if not provided
      body.views = body.views || 0;
      body.link = body.link || '';
      body.description = body.description || [];

      const newTopic = new Topic(body);
      await newTopic.save();

      return res.status(201).json(newTopic); // Pages Router response
    } catch (error: any) {
      console.error("POST /api/topics error:", error);
      // Handle unique slug error
      if (error.code === 11000) {
        return res.status(409).send("Slug must be unique."); // Pages Router response
      }
      return res.status(500).send("Internal Server Error"); // Pages Router response
    }
  };

  // Route requests based on HTTP method
  switch (method) {
    case 'GET':
      return handleGET();
    case 'POST':
      return handlePOST();
    default:
      return res.status(405).send(`Method ${method} Not Allowed`); // Pages Router response
  }
}
