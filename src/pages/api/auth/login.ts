// src/pages_api/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import { serialize } from "cookie"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { signToken } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  await connectDB()

  const { email, password } = req.body ?? {}
  if (!email || !password) return res.status(400).json({ error: "Email and password required" })

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(401).json({ error: "Invalid credentials" })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: "Invalid credentials" })

  // ✅ stringify _id for JWT
  const token = signToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  })

  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    }),
  )

  res.status(200).json({
    success: true,
    user: { id: user._id.toString(), email: user.email, role: user.role },
  })
}
