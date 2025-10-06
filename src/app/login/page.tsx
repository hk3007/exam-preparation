"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setErr(data.error || "Login failed")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      setErr("Network error or server connection failed")
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          padding: 28,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: 12 }}>Team Login</h2>
        {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          style={{ width: "100%", padding: 10, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ddd" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 6,
            background: "#0ea5e9",
            color: "#fff",
            border: "none",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
          Need an account? Registration is internal-only. Ask an admin to register you at{" "}
          <strong>/dashboard/admin/register</strong>.
        </p>
      </form>
    </div>
  )
}
