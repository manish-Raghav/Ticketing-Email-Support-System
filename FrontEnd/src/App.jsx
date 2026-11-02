import { Routes, Route, Navigate } from 'react-router-dom';

import ForgotPassword from './Pages/Auth/Forgotpassword';
import ResetPassword from './Pages/Auth/Resetpassword';
import VerifyOTP from './Pages/Auth/VerifyOtp';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ProtectedRoute from './Routes/ProtectedRoute';


import Home from './Pages/Home';
import CustomerDashboard from './Pages/customer/CustomerDashboard';
import AgentDashboard from './Pages/agent/AgentDashboard';

import AdminDashboard from './Pages/admin/AdminDashboard';
import DashboardLayout from './layoute/DashboardLayout';
import MyTickets from './Pages/customer/MyTickets';
import CustomerTicketDetails from './Pages/customer/TicketDetails';
import CreateTicket from './Pages/customer/CreateTicket';
import AllTickets from './Pages/admin/AllTickets';
import ManageAgents from './Pages/admin/ManageAgents';
import ManageUsers from './Pages/admin/ManageUsers';
import AssignedTickets from './Pages/agent/AssignedTickets';
import AgentTicketDetails from './Pages/agent/TicketDetails';
import TicketDetailsPage from './Pages/TicketDetailsPage';




export default function App() {
  return (
    <Routes>

      <Route path='/' element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route
          path="/customer/dashboard"
          element={<CustomerDashboard />}
        />
      </Route>


      <Route element={<ProtectedRoute allowedRoles={["support_agent"]} />}>
        <Route
          path="/agent/dashboard"
          element={<AgentDashboard />}
        />
      </Route>


      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Route> */}



      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <DashboardLayout role="customer" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="tickets" element={<MyTickets />} />
        <Route path="tickets/create" element={<CreateTicket />} />
        <Route path="tickets/:id" element={<CustomerTicketDetails />} />
      </Route>

      {/* Agent Dashboard */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRoles={["support_agent"]}>
            <DashboardLayout role="support_agent" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="tickets" element={<AssignedTickets />} />
        <Route path="tickets/:id" element={<AgentTicketDetails />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tickets" element={<AllTickets />} />
        <Route path="tickets/:id" element={<TicketDetailsPage role="admin" />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="agents" element={<ManageAgents />} />
      </Route>
      {/* 
      Default route
      <Route path="/" element={<Navigate to="/login" replace />} /> */}

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}