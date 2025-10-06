import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export default async function AdminRegisterPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value || null
  if (!token) redirect("/login")

  const decoded = verifyToken(token)
  if (!decoded) redirect("/login")

  await connectDB()
  const me = await User.findById(decoded.id).select("role").lean<{ role: string } | null>()
  if (!me || me.role !== "admin") redirect("/dashboard")

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Register New Team Member</h2>
      <p style={{ color: "#666", marginBottom: 16 }}>Only admins can create new internal accounts.</p>
      <form method="post" action="/api/auth/register" style={{ display: "grid", gap: 10 }}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Temporary Password"
          required
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <select name="role" defaultValue="member" style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}>
          <option value="member">member</option>
          <option value="admin">admin</option>
        </select>
        <button
          type="submit"
          style={{ padding: 10, borderRadius: 6, background: "#0ea5e9", color: "#fff", border: "none" }}
        >
          Create Account
        </button>
      </form>
      <p style={{ marginTop: 10, fontSize: 14, color: "#555" }}>
        After creating, share credentials securely. The user logs in at <strong>/login</strong>.
      </p>
    </div>
  )
}
