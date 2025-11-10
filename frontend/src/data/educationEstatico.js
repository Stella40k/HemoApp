 export const educationEstatico =[
 {
        id: 1,
        title: "Requisitos Clave para Donar",
        description: "No estés en ayunas. Desayuna ligero, hidrátate bien y evita grasas o lácteos. ¡Consulta las exclusiones!",
        icon: "📋", 
        colorClass: "text-accent",
        link: "/info/requisitos",
        details: {
            subtitle: "Guía de requisitos y preparación para la donación:",
            points: [
                "Alimentación: No estés en ayunas. Desayuna de forma normal y ligera, pero evita alimentos grasos y lácteos el día de la donación.",
                "Hidratación: Bebe abundantes líquidos (no lácteos) como agua, jugos o té antes de la donación.",
                "Salud y Descanso: Debes gozar de buena salud, haber dormido al menos seis horas la noche anterior y no presentar síntomas de resfriado o tos.",
                "Edad y peso: Tener entre 18 y 65 años y pesar más de 50 kg.",
                "Documentación: Es indispensable presentar una identificación oficial con fotografía."
            ],
            exclusions: [ 
                "No haber tomado medicamentos en los últimos cinco días (consultar caso a caso).",
                "No haber estado en tratamiento de endodoncia, acupuntura o haberse practicado tatuajes o perforaciones en los últimos 12 meses.",
                "No haber sido operado en los últimos seis meses.",
                "No haberse vacunado en los últimos 30 días.",
                "No haber ingerido bebidas alcohólicas en 72 horas previas a la donación.",
                "No estar embarazada o en lactancia."
            ],
            extra: "La alimentación correcta es crucial para evitar mareos y desmayos. Evita las grasas, ya que pueden afectar los tests de laboratorio (cribado serológico)."
        }
    },
        {
        id: 5,
        title: "El Camino de la Sangre",
        description: "Conoce el proceso completo: desde tu donación, el triaje, los tests de compatibilidad, hasta la transfusión al paciente.",
        icon: "💉", 
        colorClass: "text-primary",
        link: "/info/proceso",
        details: {
            subtitle: "El proceso completo, del donante al paciente:",
            // 🚨 TEXTO CORREGIDO A ESPAÑOL
            points: [
                "1. Registro y pre-triaje (verificar peso, presión arterial, etc.).",
                "2. Triaje clínico (entrevista con el médico).",
                "3. Momento de la extracción (donación de sangre).",
                "4. Pruebas para verificar tipo sanguíneo y cribado serológico (detectar enfermedades como VIH y hepatitis).",
                "5. Fraccionamiento de la sangre (separar hemocomponentes - glóbulos rojos, plasma, etc.).",
                "6. La sangre apta para transfusión es enviada a las agencias de transfusión.",
                "7. Las agencias de transfusión realizan pruebas de compatibilidad entre la sangre del donante y el receptor, y la envían a hospitales y clínicas.",
                "8. En el hospital o clínica de destino, la transfusión es realizada y monitoreada."
            ],
            extra: "Este proceso garantiza la seguridad y la efectividad de la transfusión."
        }
    },
];