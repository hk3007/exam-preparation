// src/pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "cookie"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "lax",
    }),
  )

  const redirectTo = typeof req.query.redirect === "string" ? req.query.redirect : undefined
  if (redirectTo) {
    return res.redirect(303, redirectTo)
  }

  res.status(200).json({ success: true })
}
