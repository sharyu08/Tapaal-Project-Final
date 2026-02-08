import { useState } from 'react'
import { Mail } from './types'
import { Sidebar } from './layout/Sidebar'
import { Header } from './layout/Header'
import { Dashboard } from './pages/dashboard/Dashboard'
import Analytics from './pages/analytics/Analytics'
import { InwardMails } from './pages/inward-mails/InwardMails'
import { OutwardMails } from './pages/outward-mails/OutwardMails'
import { Users } from './pages/users/Users'
import { Departments } from './pages/departments/Departments'
import { Tracking } from './pages/tracking/Tracking'
import AIAssistant from './components/AIAssistant'
import { EditMail } from './pages/mail-edit/EditMail'
import { MailDetail } from './pages/mail-detail/MailDetail'
import { CreateInwardMail } from './pages/inward/CreateInwardMail'
import { CreateOutwardMail } from './pages/outward-mails/CreateOutwardMail'
import { Profile } from './pages/profile/Profile'
import { Settings } from './pages/settings/Settings'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null)
  const [editingMail, setEditingMail] = useState<Mail | null>(null)
  const [creatingInwardMail, setCreatingInwardMail] = useState(false)
  const [creatingOutwardMail, setCreatingOutwardMail] = useState(false)

  // Handle page navigation - reset detail/edit views when navigating
  const handleNavigate = (page: string) => {
    setSelectedMail(null)
    setEditingMail(null)
    setCreatingInwardMail(false)
    setCreatingOutwardMail(false)
    setCurrentPage(page)
  }

  const handleCreateInwardMail = () => {
    setCreatingInwardMail(true)
  }

  const handleCreateOutwardMail = () => {
    setCreatingOutwardMail(true)
  }

  const renderPage = () => {
    if (editingMail) {
      return <EditMail mail={editingMail} onBack={() => setEditingMail(null)} />
    }

    if (selectedMail) {
      return <MailDetail mail={selectedMail} onBack={() => setSelectedMail(null)} />
    }

    if (creatingInwardMail) {
      return <CreateInwardMail onBack={() => setCreatingInwardMail(false)} />
    }

    if (creatingOutwardMail) {
      return <CreateOutwardMail onBack={() => setCreatingOutwardMail(false)} />
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'analytics':
        return <Analytics />
      case 'inward':
        return <InwardMails onViewMail={setSelectedMail} onEditMail={setEditingMail} onCreateMail={handleCreateInwardMail} />
      case 'outward':
        return <OutwardMails onViewMail={setSelectedMail} onEditMail={setEditingMail} onCreateMail={handleCreateOutwardMail} />
      case 'users':
        return <Users />
      case 'departments':
        return <Departments />
      case 'tracking':
        return <Tracking />
      case 'profile':
        return <Profile />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col">
        <Header onNavigate={handleNavigate} />
        <main className="flex-1 overflow-y-auto bg-white">
          {renderPage()}
        </main>
      </div>
      {/* AI Assistant available on all pages */}
      <AIAssistant
        dashboardData={{
          stats: { totalUsers: 0, totalDepartments: 0, totalMails: 0, totalTrackingEvents: 0 },
          recentMails: [],
          statusData: [],
          monthlyData: []
        }}
      />
    </div>
  )
}
