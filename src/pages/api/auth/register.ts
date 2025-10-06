import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import cookie from "cookie"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const cookiesHeader = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
  const token = cookiesHeader.token
  const decoded = token ? verifyToken(token) : null
  if (!decoded) return res.status(401).json({ error: "Unauthorized" })

  await connectDB()
  const me = await User.findById(decoded.id).select("role")
  if (!me || me.role !== "admin") return res.status(403).json({ error: "Forbidden" })

  // Support form POST or JSON
  const { email, password, role } = typeof req.body === "string" ? JSON.parse(req.body) : req.body

  if (!email || !password) return res.status(400).json({ error: "Email and password are required" })

  const normalizedEmail = String(email).toLowerCase()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) return res.status(409).json({ error: "User already exists" })

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(String(password), salt)

  const newUser = await User.create({
    email: normalizedEmail,
    password: hashed,
    role: role === "admin" ? "admin" : "member",
  })

  return res.status(201).json({
    message: "User registered successfully",
    user: { id: newUser._id.toString(), email: newUser.email, role: newUser.role },
  })
}
