import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import { AppLayout } from './components'
import { AuthProvider, WorkflowProvider } from './contexts'
import {
  DashboardPage,
  RequestHubPage,
  RequestListPage,
  RequestWizardPage,
  RequestWorkflowPage,
  RequestDetailPage,
  ProjectRequestForm,
  LoanRequestForm,
  CarRequestForm,
  ConferenceRequestForm,
  AdminInboxPage,
  DocumentReviewPage,
  DirectorPendingPage,
  ApprovalPage,
} from './pages'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WorkflowProvider>
        <BrowserRouter>
          <Routes>
            {/* Public / Landing page */}
            <Route path="/" element={<App />} />
            
            {/* App Layout Routes (Protected/Authenticated) */}
            <Route element={<AppLayout />}>
              {/* Dashboard */}
              <Route path="dashboard" element={<DashboardPage />} />
              
              {/* Researcher - Requests */}
              <Route path="requests">
                <Route index element={<RequestListPage />} />
                <Route path="new" element={<RequestHubPage />} />
                {/* Workflow paths - 4 main paths from flowchart */}
                <Route path="workflow/:pathId" element={<RequestWorkflowPage />} />
                {/* Direct form access (for standalone or editing) */}
                <Route path="create/project" element={<ProjectRequestForm />} />
                <Route path="create/loan" element={<LoanRequestForm />} />
                <Route path="create/car" element={<CarRequestForm />} />
                <Route path="create/conference" element={<ConferenceRequestForm />} />
                <Route path="create/:type" element={<RequestWizardPage />} />
                <Route path=":id" element={<RequestDetailPage />} />
              </Route>
              
              {/* Admin - Document Review */}
              <Route path="admin">
                <Route path="inbox" element={<AdminInboxPage />} />
                <Route path="review/:id" element={<DocumentReviewPage />} />
              </Route>
              
              {/* Director - Approvals */}
              <Route path="director">
                <Route path="pending" element={<DirectorPendingPage />} />
                <Route path="approve/:id" element={<ApprovalPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </WorkflowProvider>
    </AuthProvider>
  </StrictMode>,
)
