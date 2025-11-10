// /frontend/src/data/educationData.js
// Contiene la información educativa detallada para el Dashboard y InfoPage.

export const educationData = [
    {
        id: 2,
        title: "Compatibilidad Sanguínea",
        description: "Aprende los grupos sanguíneos y las reglas de transfusión: ¿A quién puedes donar y de quién puedes recibir?",
        icon: "🔗", 
        colorClass: "text-accent",
        link: "/info/compatibilidad",
        details: {
            subtitle: "Tabla de compatibilidad para donar y recibir sangre:",
            table: [
                { group: "A+", donate: "A+, AB+", receive: "O+, O-, A+, A-" },
                { group: "A-", donate: "A+, A-, AB+, AB-", receive: "O-, A-" },
                { group: "B+", donate: "B+, AB+", receive: "O+, O-, B+, B-" },
                { group: "B-", donate: "B+, B-, AB+, AB-", receive: "O-, B-" },
                { group: "AB+", donate: "AB+", receive: "TODOS" },
                { group: "AB-", donate: "AB+, AB-", receive: "AB-, O-, A-, B-" },
                { group: "O+", donate: "A+, B+, AB+, O+", receive: "O+, O-" },
                { group: "O-", donate: "TODOS", receive: "O-" }
            ],
            extra: "El O- es el donante universal y el AB+ es el receptor universal. El factor Rh es crucial."
        }
    },
    {
        id: 3,
        title: "¿Por qué es importante donar?",
        description: "Tu donación salva vidas en casos de traumatismos, cáncer, y complicaciones quirúrgicas y obstétricas.",
        icon: "❤️", 
        colorClass: "text-accent",
        link: "/info/importancia",
        details: {
            subtitle: "Tus donaciones pueden salvar las vidas de:",
            points: [
                "Mujeres con complicaciones obstétricas.",
                "Personas con traumatismos graves.",
                "Niños con anemia grave.",
                "Pacientes con intervenciones quirúrgicas complejas.",
                "Pacientes graves con COVID 19.",
                "Pacientes con cáncer.",
                "Pacientes que requieren transfusiones periódicas."
            ],
            extra: "Fuente: Organización Mundial de la Salud (OMS)."
        }
    },
    {
        id: 4,
        title: "Cuidados Post-Donación",
        description: "Consume alimentos e hidratación. Evita cargar peso, ejercicios vigorosos, fumar o tomar alcohol.",
        icon: "💧", 
        colorClass: "text-secondary",
        link: "/info/cuidados",
        details: {
            subtitle: "Guía de cuidados inmediatos después de la donación:",
            points: [
                "Consume alimentos y mantente bien hidratado.",
                "No cargues cosas pesadas con el brazo de la donación durante el día.",
                "Evita realizar actividades físicas vigorosas durante ese día.",
                "Sigue las recomendaciones que te dé tu banco de sangre.",
                "Evita fumar o tomar alcohol."
            ],
            extra: "Si sientes mareos o malestar, acuéstate y levanta los pies. Si persiste, busca ayuda médica."
        }
    },
];