import type { ReactNode } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import AIChatPage from './pages/patient/AIChatPage';
import SymptomsCheckerPage from './pages/patient/SymptomsCheckerPage';
import ARDiagnosisPage from './pages/patient/ARDiagnosisPage';
import PrescriptionsPage from './pages/patient/PrescriptionsPage';
import MedicalRecordsPage from './pages/patient/MedicalRecordsPage';
import ConsultationsPage from './pages/patient/ConsultationsPage';
import BookConsultationPage from './pages/patient/BookConsultationPage';
import ConsultationDetailPage from './pages/patient/ConsultationDetailPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorConsultationsPage from './pages/doctor/DoctorConsultationsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFound from './pages/NotFound';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Landing',
    path: '/',
    element: <LandingPage />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
  },
  {
    name: 'Register',
    path: '/register',
    element: <LoginPage />,
  },
  {
    name: 'Forbidden',
    path: '/403',
    element: <ForbiddenPage />,
  },
  // Patient Routes
  {
    name: 'Patient Dashboard',
    path: '/patient',
    element: <PatientDashboard />,
  },
  {
    name: 'Patient AI Chat',
    path: '/patient/ai-chat',
    element: <AIChatPage />,
  },
  {
    name: 'Patient Symptoms Checker',
    path: '/patient/symptoms',
    element: <SymptomsCheckerPage />,
  },
  {
    name: 'Patient AR Diagnosis',
    path: '/patient/ar-diagnosis',
    element: <ARDiagnosisPage />,
  },
  {
    name: 'Patient Consultations',
    path: '/patient/consultations',
    element: <ConsultationsPage />,
  },
  {
    name: 'Book Consultation',
    path: '/patient/consultations/new',
    element: <BookConsultationPage />,
  },
  {
    name: 'Consultation Detail',
    path: '/patient/consultations/:id',
    element: <ConsultationDetailPage />,
  },
  {
    name: 'Patient Prescriptions',
    path: '/patient/prescriptions',
    element: <PrescriptionsPage />,
  },
  {
    name: 'Patient Records',
    path: '/patient/records',
    element: <MedicalRecordsPage />,
  },
  {
    name: 'Patient Profile',
    path: '/patient/profile',
    element: <PatientDashboard />,
  },
  // Doctor Routes
  {
    name: 'Doctor Dashboard',
    path: '/doctor',
    element: <DoctorDashboard />,
  },
  {
    name: 'Doctor AI Chat',
    path: '/doctor/ai-chat',
    element: <AIChatPage />,
  },
  {
    name: 'Doctor Symptoms Checker',
    path: '/doctor/symptoms',
    element: <SymptomsCheckerPage />,
  },
  {
    name: 'Doctor AR Diagnosis',
    path: '/doctor/ar-diagnosis',
    element: <ARDiagnosisPage />,
  },
  {
    name: 'Doctor Consultations',
    path: '/doctor/consultations',
    element: <DoctorConsultationsPage />,
  },
  {
    name: 'Doctor Consultation Detail',
    path: '/doctor/consultations/:id',
    element: <ConsultationDetailPage />,
  },
  {
    name: 'Doctor Patients',
    path: '/doctor/patients',
    element: <DoctorDashboard />,
  },
  {
    name: 'Doctor Prescriptions',
    path: '/doctor/prescriptions',
    element: <PrescriptionsPage />,
  },
  {
    name: 'Doctor Records',
    path: '/doctor/records',
    element: <MedicalRecordsPage />,
  },
  {
    name: 'Doctor Profile',
    path: '/doctor/profile',
    element: <DoctorDashboard />,
  },
  // Admin Routes
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    name: 'Admin Patients',
    path: '/admin/patients',
    element: <AdminDashboard />,
  },
  {
    name: 'Admin Doctors',
    path: '/admin/doctors',
    element: <AdminDashboard />,
  },
  {
    name: 'Admin Settings',
    path: '/admin/settings',
    element: <AdminDashboard />,
  },
  {
    name: 'Admin AI Chat',
    path: '/admin/ai-chat',
    element: <AIChatPage />,
  },
  {
    name: 'Admin Symptoms Checker',
    path: '/admin/symptoms',
    element: <SymptomsCheckerPage />,
  },
  {
    name: 'Admin AR Diagnosis',
    path: '/admin/ar-diagnosis',
    element: <ARDiagnosisPage />,
  },
  {
    name: 'Admin Consultations',
    path: '/admin/consultations',
    element: <AdminDashboard />,
  },
  {
    name: 'Admin Prescriptions',
    path: '/admin/prescriptions',
    element: <PrescriptionsPage />,
  },
  {
    name: 'Admin Records',
    path: '/admin/records',
    element: <MedicalRecordsPage />,
  },
  {
    name: 'Admin Profile',
    path: '/admin/profile',
    element: <AdminDashboard />,
  },
  // 404
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
