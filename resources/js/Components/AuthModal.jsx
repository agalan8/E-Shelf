import { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import RegisterForm from "@/Components/RegisterForm";
import LoginForm from "@/Components/LoginForm";
import ForgotPasswordForm from "@/Components/ForgotPasswordForm";

export default function AuthModal({ isOpen, onClose, status, canResetPassword }) {
    const [currentView, setCurrentView] = useState("register");
    const [showForgotPassword, setShowForgotPassword] = useState(false);  // Estado para mostrar el formulario de "forgotPassword"
    const nodeRef = useRef(null);

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);  // Mostrar el formulario de forgot password sin cambiar la elipse
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);  // Volver al formulario de login
        setCurrentView("login");  // Asegurar que la elipse se mantenga en "login"
    };

    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="fade"
            unmountOnExit
            nodeRef={nodeRef}
        >
            {(state) => (
                <div
                    ref={nodeRef}
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity duration-300
                        ${state === "entering" || state === "entered" ? "opacity-100" : "opacity-0"}`}
                >
                    <div
                        className={`bg-[#18191C] rounded-lg shadow-lg w-full h-full max-w-full min-h-full flex relative transform transition-all duration-300
                            ${state === "entering" || state === "entered" ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 text-2xl text-gray-600 hover:text-gray-900 font-bold transition-colors duration-300 z-10"
                        >
                            X
                        </button>

                        {/* Imagen lateral */}
                        <div
                            className="w-2/3 bg-cover bg-center"
                            style={{ backgroundImage: "url('/fondo_landing.jpg')" }}
                        ></div>

                        {/* Formulario + botones */}
                        <div className="w-1/3 flex pt-32 flex-col items-center p-6 relative min-h-[400px]">
                            {/* Botones de cambio */}
                            {!showForgotPassword && (  // Ocultar los botones cuando se muestre el formulario de "Forgot Password"
                                <div className="bg-zinc-800 rounded-full p-1 flex overflow-hidden w-full mb-6 relative">
                                    {/* Elipse de fondo que se mueve */}
                                    <div
                                        className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-300 ease-in-out transform ${
                                            currentView === "login" ? "translate-x-0" : "translate-x-full"
                                        } bg-gradient-to-r from-[#8a2ad4] to-[#a32bff] rounded-full`}
                                    ></div>

                                    {/* Botón Iniciar sesión */}
                                    <button
                                        onClick={() => setCurrentView("login")}
                                        className={`w-1/2 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out relative z-10 ${
                                            currentView === "login"
                                                ? "text-white"
                                                : "text-[#a2a0a9] hover:text-[#64646a]"
                                        }`}
                                    >
                                        Iniciar sesión
                                    </button>
                                    {/* Botón Registrarse */}
                                    <button
                                        onClick={() => setCurrentView("register")}
                                        className={`w-1/2 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out relative z-10 ${
                                            currentView === "register"
                                                ? "text-white"
                                                : "text-[#a2a0a9] hover:text-[#64646a]"
                                        }`}
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            )}

                            {/* Formulario dinámico */}
                            <div className="pl-4 pr-4 w-full flex flex-col items-center mb-2">
                                {currentView === "register" && !showForgotPassword && (
                                    <RegisterForm
                                        onClose={onClose}
                                        onSwitchToLogin={() => setCurrentView("login")}
                                    />
                                )}
                                {currentView === "login" && !showForgotPassword && (
                                    <LoginForm
                                        onClose={onClose}
                                        status={status}
                                        canResetPassword={canResetPassword}
                                        onSwitchToRegister={() => setCurrentView("register")}
                                        onSwitchToForgotPassword={handleForgotPasswordClick}  // Aquí cambiamos la función
                                    />
                                )}
                                {showForgotPassword && (  // Mostrar el formulario de "Forgot Password"
                                    <ForgotPasswordForm
                                        onClose={onClose}
                                        onSwitchToLogin={handleBackToLogin}  // Al volver al login
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CSSTransition>
    );
}
