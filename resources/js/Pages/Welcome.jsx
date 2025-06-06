import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthModal from "@/Components/AuthModal";

export default function Welcome({ openAuthModal, status, canResetPassword }) {
    // Estado para controlar la apertura del modal
    const [isRegisterOpen, setRegisterOpen] = useState(false);

    // Abrir el modal si openAuthModal es true (cuando se redirige desde el servidor)
    useEffect(() => {
        if (openAuthModal) {
            setRegisterOpen(true); // Abrir el modal si openAuthModal es true
        }
    }, [openAuthModal]); // Esto se ejecuta cuando `openAuthModal` cambia

    return (
        <>
            <Head title="">
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700;900&family=Raleway:wght@300;500;600;700;900&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div
                className="relative min-h-screen bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/fondo_landing.jpg')" }}
            >
                <div className="flex flex-col justify-center min-h-screen px-16 bg-black bg-opacity-50 text-left">
                    <h1
                        className="text-5xl mb-8 flex items-center"
                        style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: "700",
                            marginTop: "-50px",
                            color: "#F1F1F1",
                        }}
                    >
                        <img
                            src="/logo_full.png"
                            alt="E"
                            className="w-auto h-20 object-contain mr-2"
                        />
                    </h1>
                    <h2
                        className="text-6xl mb-6 max-w-[65vw]"
                        style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: "900",
                            lineHeight: "1.3",
                            color: "#F1F1F1",
                        }}
                    >
                        Organiza tus recuerdos,
                        <br /> crea tu historia.
                    </h2>
                    <p className="text-2xl mb-12" style={{ fontFamily: "Raleway, sans-serif", fontWeight: "700", maxWidth: "65vw", color: "#F1F1F1" }}>
                        Herramientas sencillas para gestionar y compartir imágenes de alta calidad.
                    </p>
                    <div className="flex">
                        <button
                            onClick={() => setRegisterOpen(true)} // Abrir el modal al hacer clic en el botón
                            className="px-8 py-4 text-2xl bg-white text-[#240A34] rounded-lg shadow hover:bg-transparent hover:text-white hover:border-white transition duration-300 ease-in-out hover:backdrop-blur-sm hover:bg-[#6A3F8C] hover:bg-opacity-20 border-2"
                            style={{
                                fontFamily: "Raleway, sans-serif",
                                fontWeight: "900",
                                marginRight: "30px",
                            }}
                        >
                            Únete ahora
                        </button>

                        <a
                            href={route("explorar")}
                            className="px-8 py-4 text-xl bg-transparent text-white rounded-lg shadow border-2 border-white transition duration-300 ease-in-out hover:backdrop-blur-sm hover:bg-[#6A3F8C] hover:bg-opacity-20"
                            style={{
                                fontFamily: "Raleway, sans-serif",
                                fontWeight: "800",
                            }}
                        >
                            Explorar
                        </a>
                    </div>
                </div>
            </div>

            {/* El modal se muestra si isRegisterOpen es true */}
            <AuthModal
                isOpen={isRegisterOpen}
                status={status}
                canResetPassword={canResetPassword}
                onClose={() => setRegisterOpen(false)} // Cerrar el modal
            />
        </>
    );
}
