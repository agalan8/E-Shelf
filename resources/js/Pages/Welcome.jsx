import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
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
                            color: "#F1F1F1", // Color blanco suave
                        }}
                    >
                        <img
                            src="/logo.png"
                            alt="E"
                            className="w-auto h-20 object-contain mr-2"
                        />
                        -Shelf
                    </h1>
                    <h2
                        className="text-6xl mb-6 max-w-[65vw]"
                        style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: "900",
                            lineHeight: "1.3",  // Ajustando el interlineado
                            color: "#F1F1F1", // Color blanco suave
                        }}
                    >
                        Organiza tus recuerdos,
                        <br /> crea tu historia.
                    </h2>
                    <p className="text-2xl mb-12" style={{ fontFamily: "Raleway, sans-serif", fontWeight: "700", maxWidth: "65vw", color: "#F1F1F1" }}>
                        Herramientas sencillas para gestionar y compartir imágenes de alta calidad.
                    </p>
                    <div className="flex">
                        <Link
                            href={route("register")}
                            className="px-8 py-4 text-2xl bg-white text-[#240A34] rounded-lg shadow hover:bg-transparent hover:text-white hover:border-white transition duration-300 ease-in-out hover:backdrop-blur-sm hover:bg-[#6A3F8C] hover:bg-opacity-20 border-2"
                            style={{
                                fontFamily: "Raleway, sans-serif",
                                fontWeight: "900", // Peso máximo de la fuente
                                marginRight: "30px", // Añadiendo margen derecho al primer botón
                            }}
                        >
                            Únete ahora
                        </Link>

                        <Link
                            href={route("explorar")}
                            className="px-8 py-4 text-xl bg-transparent text-white rounded-lg shadow border-2 border-white transition duration-300 ease-in-out hover:backdrop-blur-sm hover:bg-[#6A3F8C] hover:bg-opacity-20"
                            style={{
                                fontFamily: "Raleway, sans-serif",
                                fontWeight: "800", // Peso máximo de la fuente
                            }}
                        >
                            Explorar
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
