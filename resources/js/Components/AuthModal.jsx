import { useState } from "react";
import RegisterForm from "@/Components/RegisterForm";
import LoginForm from "@/Components/LoginForm";

export default function AuthModal({ isOpen, onClose }) {
    const [currentView, setCurrentView] = useState("register");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                {currentView === "register" && (
                    <RegisterForm onClose={onClose} onSwitchToLogin={() => setCurrentView("login")} />
                )}
                {currentView === "login" && (
                    <LoginForm onClose={onClose} onSwitchToRegister={() => setCurrentView("register")} />
                )}
            </div>
        </div>
    );
}
