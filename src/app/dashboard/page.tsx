import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import React from 'react';

// --- TYPE DEFINITIONS ---
type UserData = { email: string; role: string };

type Style = React.CSSProperties;

// --- INLINE STYLE DEFINITIONS ---

// Define a palette for consistency
const colors = {
  primary: '#0ea5e9', // Sky blue
  primaryDark: '#0c8ccc',
  secondary: '#1f2937', // Dark slate/almost black
  text: '#374151',
  textLight: '#a0aec0',
  background: '#f7f9fc',
  cardBackground: '#ffffff',
  welcomeBackground: '#e0f2fe',
  error: '#dc2626',
  errorDark: '#b91c1c',
};

const styles = {
  dashboardLayout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.background,
    // Note: Inline styles cannot directly use media queries for full responsiveness like external CSS
    // but we can rely on flex/grid for fluid layout.
  } as Style,

  // --- SIDEBAR STYLES ---
  sidebar: {
    width: '250px',
    backgroundColor: colors.secondary,
    color: '#fff',
    padding: '24px 0',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  } as Style,
  
  logo: {
    fontSize: '24px',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '30px',
    color: '#fff',
  } as Style,
  
  navMenu: {
    listStyle: 'none',
    padding: 0,
    flexGrow: 1,
  } as Style,
  
  navItem: {
    padding: '12px 24px',
    borderLeft: '4px solid transparent',
    transition: 'background-color 0.2s, color 0.2s',
  } as Style,
  
  navLink: {
    display: 'block',
    color: colors.textLight,
    textDecoration: 'none',
    // Hover/Active effects cannot be done with pure inline styles, 
    // but for static display, this conveys the structure.
  } as Style,
  
  navLinkActive: {
    display: 'block',
    color: '#ffffff',
    textDecoration: 'none',
    // Simulate active state style (border handled by the parent li)
  } as Style,

  adminActions: {
    padding: '0 24px 20px',
  } as Style,

  adminButton: {
    display: 'block',
    padding: '10px',
    backgroundColor: colors.primary,
    color: '#fff',
    textAlign: 'center',
    borderRadius: '6px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as Style,

  // --- MAIN CONTENT STYLES ---
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  } as Style,

  header: {
    backgroundColor: colors.cardBackground,
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    flexShrink: 0,
  } as Style,

  headerTitle: {
    fontSize: '20px',
    fontWeight: 600,
    margin: 0,
    color: colors.text,
  } as Style,

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  } as Style,

  userEmail: {
    color: '#4b5563',
    fontSize: '14px',
  } as Style,

  logoutButton: {
    backgroundColor: colors.error,
    color: '#fff',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: 500,
  } as Style,

  pageContent: {
    padding: '30px',
    flexGrow: 1,
  } as Style,

  // --- CARDS & SECTIONS ---
  welcomeCard: {
    backgroundColor: colors.welcomeBackground,
    borderLeft: `5px solid ${colors.primary}`,
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  } as Style,

  welcomeTitle: {
    margin: '0 0 10px 0',
    color: colors.primary,
    fontSize: '22px',
  } as Style,

  statCards: {
    display: 'grid',
    // Simulate a responsive grid with minmax (will expand based on container)
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  } as Style,

  statCard: {
    backgroundColor: colors.cardBackground,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  } as Style,

  statNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: colors.text,
    margin: 0,
  } as Style,

  manageSection: {
    marginTop: '24px',
  } as Style,

  quickLinkList: {
    listStyle: 'disc',
    paddingLeft: '20px',
    marginTop: '15px',
  } as Style,

  quickLink: {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: 500,
  } as Style,
};

// ------------------------------------------------------------------

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value || null
  if (!token) redirect("/login")

  const decoded = verifyToken(token)
  if (!decoded || typeof decoded.id !== 'string') redirect("/login")

  // Added try-catch for robust MongoDB connection handling
  try {
    await connectDB()
  } catch (e) {
    console.error("Failed to connect to DB:", e);
    redirect("/login");
  }
  
  const me = await User.findById(decoded.id).select("email role").lean<UserData>() as UserData | null

  if (!me) redirect("/login")
  
  // NOTE: Pure inline styles cannot implement true hover/active states or media queries.
  // The structure below uses fluid design (flex/grid) where possible but is visually static.

  return (
    <div style={styles.dashboardLayout}>
      
      {/* -------------------- SIDEBAR -------------------- */}
      <nav style={styles.sidebar}>
        <h2 style={styles.logo}>Team App</h2>
        <ul style={styles.navMenu}>
          {/* Active state simulated via color/background change on the list item */}
          <li style={{...styles.navItem, backgroundColor: colors.secondary, borderLeft: `4px solid ${colors.primary}`}}>
            <a href="/dashboard" style={styles.navLinkActive}>Dashboard</a>
          </li>
          <li style={styles.navItem}>
            <a href="/dashboard/topics" style={styles.navLink}>Topics</a>
          </li>
          <li style={styles.navItem}>
            <a href="/dashboard/questions" style={styles.navLink}>Questions</a>
          </li>
          <li style={styles.navItem}>
            <a href="/dashboard/chapters" style={styles.navLink}>Chapters</a>
          </li>
          <li style={styles.navItem}>
            <a href="/dashboard/exams" style={styles.navLink}>Exams</a>
          </li>
        </ul>
        
        {me.role === "admin" && (
          <div style={styles.adminActions}>
            <a href="/dashboard/admin/register" style={styles.adminButton}>
              + Register Member
            </a>
          </div>
        )}
      </nav>

      {/* -------------------- MAIN CONTENT -------------------- */}
      <div style={styles.mainContent}>
        
        {/* Header/Navbar */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Internal Dashboard</h1>
          <div style={styles.userInfo}>
            <span style={styles.userEmail}>
              {me.email} ({me.role})
            </span>
            <form method="post" action="/api/auth/logout?redirect=/login">
              <button type="submit" style={styles.logoutButton}>
                Logout
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <section style={styles.pageContent}>
          
          {/* Welcome Card */}
          <div style={styles.welcomeCard}>
            <h2 style={styles.welcomeTitle}>Welcome Back!</h2>
            <p style={{ margin: 0, color: colors.text }}>
              You are logged in as a <strong>{me.role}</strong>.
            </p>
          </div>
          
          {/* Stat Cards Grid */}
          <div style={styles.statCards}>
            <div style={styles.statCard}>
              <h3>Topics</h3>
              <p style={styles.statNumber}>42</p>
            </div>
            <div style={styles.statCard}>
              <h3>Open Questions</h3>
              <p style={styles.statNumber}>15</p>
            </div>
            <div style={styles.statCard}>
              <h3>Members</h3>
              <p style={styles.statNumber}>10</p>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div style={styles.manageSection}>
            <h2 style={{ fontSize: '20px', color: colors.text, margin: '0 0 10px 0' }}>Manage Quick Links</h2>
            <ul style={styles.quickLinkList}>
              <li>
                <a href="/dashboard/topics" style={styles.quickLink}>Go to Topics Management</a>
              </li>
              <li>
                <a href="/dashboard/questions" style={styles.quickLink}>Review Open Questions</a>
              </li>
              
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
