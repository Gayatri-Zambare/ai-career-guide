import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatDrawer } from './components/AIChatDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { CareerExplorerPage } from './pages/CareerExplorerPage';
import { CareerDetailsPage } from './pages/CareerDetailsPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { AssessmentHistoryPage } from './pages/AssessmentHistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const [currentTab, setCurrentTab] = useState<string>('landing');
    const [activeParam, setActiveParam] = useState<any>(null);

    // Parse URL hash or handle navigation
    const handleNavigate = (tab: string, param?: any) => {
        setCurrentTab(tab);
        setActiveParam(param !== undefined ? param : null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Protected route redirects
    useEffect(() => {
        if (!loading) {
            const protectedTabs = ['dashboard', 'assessment', 'profile', 'history'];
            if (!user && protectedTabs.includes(currentTab)) {
                setCurrentTab('login');
            } else if (currentTab === 'admin' && user?.role !== 'admin') {
                setCurrentTab('dashboard');
            }
        }
    }, [user, loading, currentTab]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
            {/* Top Navbar */}
            <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

            {/* Main Content Area */}
            <main className="flex-1">
                {currentTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
                {currentTab === 'login' && <LoginPage onNavigate={handleNavigate} />}
                {currentTab === 'register' && <RegisterPage onNavigate={handleNavigate} />}
                {currentTab === 'dashboard' && <StudentDashboard onNavigate={handleNavigate} />}
                {currentTab === 'assessment' && <AssessmentPage onNavigate={handleNavigate} />}
                {currentTab === 'results' && <ResultsPage assessmentId={activeParam} onNavigate={handleNavigate} />}
                {currentTab === 'explorer' && <CareerExplorerPage onNavigate={handleNavigate} />}
                {currentTab === 'career-details' && <CareerDetailsPage careerId={activeParam || 1} onNavigate={handleNavigate} />}
                {currentTab === 'profile' && <StudentProfilePage onNavigate={handleNavigate} />}
                {currentTab === 'history' && <AssessmentHistoryPage onNavigate={handleNavigate} />}
                {currentTab === 'admin' && <AdminDashboardPage onNavigate={handleNavigate} />}
            </main>

            {/* Floating AI Career Assistant */}
            <AIChatDrawer />

            {/* Footer */}
            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
