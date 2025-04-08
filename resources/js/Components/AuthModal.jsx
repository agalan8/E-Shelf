import { useState } from "react";
import RegisterForm from "@/Components/RegisterForm";
import LoginForm from "@/Components/LoginForm";
import ForgotPasswordForm from "@/Components/ForgotPasswordForm";  // Importar ForgotPasswordForm

export default function AuthModal({ isOpen, onClose, status, canResetPassword }) {
    const [currentView, setCurrentView] = useState("register");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                {/* Botón de cerrar (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-900"
                    style={{ fontWeight: "bold" }}
                >
                    X
                </button>

                {currentView === "register" && (
                    <RegisterForm
                        onClose={onClose}
                        onSwitchToLogin={() => setCurrentView("login")}
                    />
                )}
                {currentView === "login" && (
                    <LoginForm
                        onClose={onClose}
                        status={status}
                        canResetPassword={canResetPassword}
                        onSwitchToRegister={() => setCurrentView("register")}
                        onSwitchToForgotPassword={() => setCurrentView("forgotPassword")}  // Cambia a la vista ForgotPassword
                    />
                )}
                {currentView === "forgotPassword" && (
                    <ForgotPasswordForm
                        onClose={onClose}
                        onSwitchToLogin={() => setCurrentView("login")}  // Regresar a la vista Login
                    />
                )}
            </div>
        </div>
    );
}
