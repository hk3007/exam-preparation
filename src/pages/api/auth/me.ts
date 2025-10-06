// src/pages_api/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { parse, serialize } from "cookie"
import { verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  const token = cookies.token

  if (!token) return res.status(200).json({ user: null })

  const decoded = verifyToken(token)
  if (!decoded) {
    // invalid token -> clear cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }),
    )
    return res.status(200).json({ user: null })
  }

  const user = await User.findById(decoded.id).select("-password")
  if (!user) return res.status(200).json({ user: null })

  res.status(200).json({ user })
}
