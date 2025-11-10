/**
 * DashboardPage.jsx - Panel principal del donante autenticado (ESTRUCTURA FINAL CON ROTACIÓN ESTÁTICA)
 *
 * NOTA: La tarjeta principal alterna entre Requisitos (ID 1) y Proceso (ID 5)
 * de educationEstatico.js, mostrando la lista COMPLETA de puntos directamente.
 */

import { Link } from "react-router-dom";
import Header from "@/components/Header";
// Importaciones de componentes de UI
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
// Importaciones de iconos y assets
import { ArrowRight, RotateCw } from "lucide-react"; 
import botonDonar from "@/assets/boton-donar.png";
import botonMapa from "@/assets/boton-mapa.png";
import botonEstado from "@/assets/boton-estado.png";
import PropTypes from "prop-types";
// Importaciones de data
import { educationData } from "../data/educationData"; 
import { educationEstatico } from "../data/educationEstatico"; 
import { useState } from "react";
import bolsasangre from "@/assets/bolsasangre.png"; // Imagen para la tarjeta interactiva


// Función auxiliar para renderizar la tabla de compatibilidad (Mantenida)
const renderCompatibilityTable = (tableData) => (
    <div className="overflow-x-auto text-sm">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead>
                <tr className="text-left text-xs font-medium text-primary uppercase tracking-wider bg-primary/10">
                    <th className="py-3 px-6">Grupo Sanguíneo</th>
                    <th className="py-3 px-6">Puede donar a:</th>
                    <th className="py-3 px-6">Puede recibir de:</th>
                </tr>
            </thead>
            <tbody className="bg-card divide-y divide-gray-200">
                {tableData.map((row, index) => (
                    <tr key={index} className={row.group.includes('-') ? 'bg-secondary/10' : ''}>
                        <td className="py-4 px-6 whitespace-nowrap font-semibold text-foreground">{row.group}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-foreground">{row.donate}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-foreground">{row.receive}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export default function DashboardPage({ user, onLogout }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null); 

    // 1. ESTADO PARA CONTROLAR LA ROTACIÓN DE LA TARJETA PRINCIPAL
    const [currentStaticCardId, setCurrentStaticCardId] = useState(1); 

    // 2. LÓGICA DE DATOS ESTÁTICOS Y DINÁMICOS
    const staticInfoData = {
        requisitos: Array.isArray(educationEstatico) ? educationEstatico.find(d => d.id === 1) : null,
        proceso: Array.isArray(educationEstatico) ? educationEstatico.find(d => d.id === 5) : null,
    };

    const dynamicCards = Array.isArray(educationData) 
        ? educationData.filter(d => d.id !== 1 && d.id !== 5)
        : [];
    
    // 3. OBTENER LA DATA ACTUAL Y FUNCIÓN DE ROTACIÓN
    const staticRotatorData = currentStaticCardId === 1 
        ? staticInfoData.requisitos 
        : staticInfoData.proceso;
    
    const toggleStaticCard = () => {
        setCurrentStaticCardId(prevId => (prevId === 1 ? 5 : 1));
    };

    const handleCardClick = (cardData) => {
        setSelectedCard(cardData);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    // Guardrail para datos esenciales
    if (!staticRotatorData || !staticRotatorData.details) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
                Cargando data estática (Requisitos/Proceso)... Por favor, verifica educationEstatico.js.
            </div>
        );
    }
    
    // ----------------------------------------------------
    // INICIO DEL RENDERIZADO JSX
    // ----------------------------------------------------

    return (
        <div className="min-h-screen bg-background"> 
            <Header user={user} onLogout={onLogout} />

            <div className="bg-gradient-to-b from-secondary to-background pt-12 pb-20 px-6 relative overflow-hidden">
                
                <div className="container mx-auto py-8 px-6 relative z-10">
                    <div className="text-center mb-12 ">
                        <h1 className="text-3xl font-bold text-foreground mb-2 ">
                            ¡Hola, {user?.firstName || user?.userName || 'Donante'}!
                        </h1>
                        <h1 className="text-4xl font-bold text-accent mb-2">
                            ¿Qué quieres ver hoy?
                        </h1>
                    </div>
                </div>

                {/* 1. Action Cards (Donar, Mapa, Estado) */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    <Link to="/solicitudes" className="group">
                        <div className="text-center transition-transform hover:scale-105">
                            <div className="mb-4">
                                <img src={botonDonar} alt="Donar" className="w-48 h-48 mx-auto object-contain" />
                            </div>
                            <h3 className="text-2xl font-bold text-accent">Donar</h3>
                        </div>
                    </Link>

                    <Link to="/mapa" className="group">
                        <div className="text-center transition-transform hover:scale-105">
                            <div className="mb-4">
                                <img src={botonMapa} alt="Mapa" className="w-48 h-48 mx-auto object-contain" />
                            </div>
                            <h3 className="text-2xl font-bold text-accent">Mapa</h3>
                        </div>
                    </Link>

                    <Link to="/estado-donador" className="group">
                        <div className="text-center transition-transform hover:scale-105">
                            <div className="mb-4">
                                <img src={botonEstado} alt="Estado como donador" className="w-48 h-48 mx-auto object-contain" />
                            </div>
                            <h3 className="text-2xl font-bold text-accent">Estado como donador</h3>
                        </div>
                    </Link>
                </div>
                
                {/* 2. TARJETA INTERACTIVA (Requisitos/Proceso) - Muestra TODA la info */}
                <div className="container mx-auto px-6 max-w-5xl mb-16">
                        <div className="md:flex relative">
                            {/* Columna de Imagen/Ícono (1/3) */}
                            <div className={`md:w-1/3 p-4 flex flex-col items-center justify-center rounded-l-lg`}>
                                <img 
                                    src={bolsasangre} 
                                    alt={staticRotatorData.title} 
                                    className="w-full h-auto object-cover rounded-md shadow-lg"
                                />
                            </div>

                            {/* Columna de Contenido (2/3) */}
                            <div className="md:w-2/3 p-4">
                                <CardHeader className="p-0 pb-2">
                                    <CardTitle className="text-2xl font-extrabold text-foreground flex justify-between items-center">
                                        {staticRotatorData.title}
                                        {/* 🚨 Botón de rotación: Solo la flecha */}
                                        <Button 
                                            onClick={toggleStaticCard} 
                                            variant="ghost"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 p-1"
                                            aria-label="Cambiar información estática"
                                            title={currentStaticCardId === 1 ? 'Ver Proceso' : 'Ver Requisitos'}
                                        >
                                            <ArrowRight className="h-10 w-10" /> 
                                        </Button>
                                    </CardTitle>
                                    {/* Subtítulo de la data estática */}
                                    <p className="text-base text-foreground/80 font-semibold">{staticRotatorData.details.subtitle}</p>
                                </CardHeader>
                                <CardContent className="p-0 pt-3">
                                    {/* Muestra TODOS los puntos de la data estática como párrafos */}
                                    <div className="space-y-2 text-lg text-foreground font-semibold">
                                        {staticRotatorData.details.points?.map((point, index) => ( 
                                            <p key={index}>{point}</p>
                                        ))}
                                    </div>
                                    
                                    {/* Muestra Exclusiones si existen (Opcional, basado en tu data) */}
                                    {staticRotatorData.details.exclusions && staticRotatorData.details.exclusions.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="font-bold text-xl text-primary mb-1">Exclusiones:</p>
                                            {staticRotatorData.details.exclusions.map((exclusion, index) => (
                                                <p key={index} className="text-lg text-accent font-semibold">{exclusion}</p>
                                            ))}
                                        </div>
                                    )}

                                </CardContent>
                            </div>
                        </div>
                    </Card>
                </div>
                
                {/* 3. SECCIÓN EDUCATIVA DINÁMICA (Tarjetas que abren Modal) - Mantenida */}
                <div className="container mx-auto px-6 mt-16 max-w-5xl">

                    <div className="grid md:grid-cols-3 gap-6"> 
                        {dynamicCards.map((card) => (
                            <div 
                                key={card.id} 
                                className="group cursor-pointer" 
                                onClick={() => handleCardClick(card)} // Abre el modal
                            >

                                <Card className="
                                    h-full p-4 
                                    bg-foreground border-4 border-foreground /* Cara frontal: Foreground, Borde Background */
                                    transition-all duration-300 hover:scale-[1.02] 
                                    relative overflow-visible z-10 
                                    before:content-[''] before:absolute before:inset-0 
                                    before:bg-background before:rounded-lg 
                                    before:translate-x-2 before:translate-y-2 /* Desfase a la derecha y abajo */
                                    before:transition-transform before:duration-300 
                                    before:z-[-1] /* Detrás de la tarjeta principal */
                                    group-hover:before:translate-x-0 group-hover:before:translate-y-0
                                ">
                                    <CardHeader className="p-0 pb-2">
                                        <span className={`text-4xl block mb-2 ${card.colorClass} text-primary`}>{card.icon}</span>
                                        <CardTitle className="text-lg font-bold text-accent">
                                            {card.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <p className="text-foreground/80 text-lg font-semibold">
                                            {card.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div> {/* Cierre del div principal de gradiente */}


            <AlertDialog open={isModalOpen} onOpenChange={handleModalClose}>
                <AlertDialogContent className="max-w-xl md:max-w-3xl">
                    {selectedCard && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle className={`text-3xl font-extrabold ${selectedCard.colorClass} flex items-center`}>
                                    <span className="mr-3 text-xl">{selectedCard.icon}</span> 
                                    {selectedCard.title}
                                </AlertDialogTitle>
                                {/* Subtítulo sin línea de borde */}
                                <AlertDialogDescription className="text-lg text-foreground/80 pt-2">
                                    {selectedCard.details.subtitle}
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">

                                {/* Lista Principal */}
                                {selectedCard.details.points && (
                                    <ul className="space-y-3 text-base text-foreground">
                                        <h3 className="text-xl font-bold text-foreground pb-2">Información Relevante</h3> 
                                        {selectedCard.details.points.map((point, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="mr-3 text-primary font-bold">●</span> 
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                
                                {/* Exclusiones */}
                                {selectedCard.details.exclusions && selectedCard.details.exclusions.length > 0 && (
                                    <div className="pt-6 space-y-4 border-t">
                                        <h3 className="text-xl font-bold text-accent pb-2">Exclusiones / Restricciones</h3>
                                        <ul className="space-y-4 text-lg text-foreground">
                                            {selectedCard.details.exclusions.map((point, index) => (
                                                <li key={index} className="flex items-start text-red-700">
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedCard.details.table && renderCompatibilityTable(selectedCard.details.table)}

                                {selectedCard.details.extra && (
                                    <div className="mt-8 p-4 bg-secondary/30 rounded-lg border-l-4 border-primary">
                                        <p className="font-semibold text-primary mb-1">Nota importante:</p>
                                        <p className="text-base text-foreground">{selectedCard.details.extra}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <Button onClick={handleModalClose} variant="secondary">
                                    Cerrar y Volver
                                </Button>
                                <Link to="/mapa" onClick={handleModalClose}>
                                    <Button variant="accent" className="ml-2">
                                        Ver Centros de Donación
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

DashboardPage.propTypes = {
    user: PropTypes.any,
    onLogout: PropTypes.func.isRequired,
};