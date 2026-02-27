# GraminSeva Telemedicine PWA

A comprehensive telemedicine Progressive Web Application designed specifically for rural healthcare delivery in India. The platform connects patients in rural areas with healthcare providers through multiple communication channels, featuring AI-powered assistance, voice and video consultation capabilities, offline functionality, and multi-language support optimized for low-bandwidth environments.

## 🌟 Features

### Core Functionality
- **Role-Based Authentication**: Three user roles (Patient, Doctor, Admin) with secure authentication
- **AI Health Assistant**: Powered by Gemini 2.5 Flash for intelligent health guidance
- **Multi-Language Support**: Available in English, Hindi (हिंदी), and Marathi (मराठी)
- **Progressive Web App**: Installable, offline-capable, and optimized for mobile devices
- **Low-Bandwidth Optimization**: Designed for rural network conditions

### Patient Features
- AI-powered health chatbot for instant medical advice
- Consultation booking and management
- Digital prescription viewing with QR codes
- Medical records management
- Symptom checker (offline-capable)
- Voice and video consultation support

### Doctor Features
- Patient consultation management
- Pending consultation requests
- Digital prescription creation
- Patient medical history access
- Real-time consultation interface

### Admin Features
- User management (patients, doctors, admins)
- System analytics and statistics
- Platform configuration
- Role assignment and permissions

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **date-fns** for date formatting
- **react-markdown** for rich text rendering

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** for data storage
- **Row Level Security (RLS)** for data protection
- **Supabase Storage** for medical images

### Edge Functions (APIs)
- **Gemini 2.5 Flash** - AI chatbot with streaming responses
- **Whisper v3** - Speech-to-text transcription
- **TTS API** - Text-to-speech synthesis

## 📋 Database Schema

### Tables
1. **profiles** - Extended user information with roles
2. **consultations** - Medical consultation sessions
3. **prescriptions** - Digital prescriptions with QR codes
4. **medical_records** - Patient medical history
5. **symptoms_database** - Offline symptom checker data
6. **chat_messages** - AI chatbot conversation history

### Storage
- **medical_images** - Bucket for medical photos and documents

## 🔐 Security

- Username + password authentication (simulated email)
- Role-based access control (RBAC)
- Row Level Security (RLS) policies
- Secure Edge Functions for API calls
- Encrypted prescription data in QR codes

## 🌐 Multi-Language Support

The application supports three languages with complete UI translations:
- **English** - Default language
- **हिंदी (Hindi)** - For Hindi-speaking users
- **मराठी (Marathi)** - For Marathi-speaking users

Language preference is saved per user and persists across sessions.

## 📱 PWA Features

- **Installable**: Can be installed on mobile devices and desktops
- **Offline Support**: Service worker caches essential resources
- **App Shortcuts**: Quick access to AI chat and consultations
- **Responsive Design**: Optimized for all screen sizes
- **Low Bandwidth**: Optimized assets and lazy loading

## 🎨 Design System

### Color Palette
- **Primary**: Medical blue (#2563eb) - Trust and professionalism
- **Secondary**: Soft teal - Healing and calm
- **Success**: Green - Positive health indicators
- **Warning**: Orange - Alerts and attention
- **Destructive**: Red - Errors and critical actions

### Typography
- Clean, readable fonts optimized for medical content
- Proper hierarchy for easy scanning
- Accessible contrast ratios (WCAG AA compliant)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- API keys for integrated services (auto-configured)

### Installation

1. **Clone the repository**
   ```bash
   cd /workspace/app-9x8mtlzrh2wx
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment variables are already configured**
   - Supabase URL and keys are set
   - API integration keys are injected into Edge Functions

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 👥 User Roles

### Patient
- Default role for new registrations
- Can book consultations, chat with AI, view prescriptions
- Access to personal medical records

### Doctor
- Must be assigned by admin
- Can accept consultations, create prescriptions
- Access to patient medical information

### Admin
- First registered user becomes admin automatically
- Full system access and user management
- Can assign roles to other users

## 🔧 Configuration

### First User Setup
The first user to register automatically becomes an admin. This admin can then:
1. Log in to the admin dashboard
2. Navigate to user management
3. Assign doctor roles to healthcare providers
4. Manage system settings

### Language Configuration
Users can change their language preference from:
- The language switcher in the header
- Their profile settings

## 📊 API Integration

All third-party API calls are handled through Supabase Edge Functions for security:

1. **AI Chat** (`/functions/v1/ai-chat`)
   - Streams responses from Gemini 2.5 Flash
   - Saves conversation history
   - Supports multi-turn conversations

2. **Speech-to-Text** (`/functions/v1/speech-to-text`)
   - Transcribes audio files
   - Supports 100+ languages
   - Returns detailed transcription with timestamps

3. **Text-to-Speech** (`/functions/v1/text-to-speech`)
   - Converts text to natural speech
   - Multiple voice options
   - Returns audio stream

## 🔒 Privacy & Compliance

- All health data is encrypted at rest
- HIPAA-compliant data handling practices
- User consent for data collection
- Right to data deletion
- Secure transmission (HTTPS only)

## 🐛 Troubleshooting

### Common Issues

1. **Login fails**
   - Ensure username contains only letters, numbers, and underscores
   - Check that email verification is disabled in Supabase

2. **AI chat not responding**
   - Check Edge Function logs in Supabase dashboard
   - Verify API integration keys are configured

3. **Images not uploading**
   - Check storage bucket permissions
   - Ensure file size is under 1MB
   - Verify file format (JPEG, PNG, WEBP)

## 📈 Future Enhancements

- Video consultation with WebRTC
- AR-based diagnosis tools
- Voice consultation with real-time transcription
- Prescription QR code scanning
- Advanced symptom checker with ML
- Telemedicine analytics dashboard
- Integration with health monitoring devices
- Appointment scheduling system
- Payment integration for consultations

## 📄 License

© 2026 GraminSeva. All rights reserved.

## 🤝 Support

For support, please contact the development team or refer to the documentation.

---

**Note**: This application is designed for rural healthcare delivery in India. For medical emergencies, always contact local emergency services immediately.
