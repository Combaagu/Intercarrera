// Lógica de comportamiento de la mascota según sensores y hambre
export function determinarEstadoMascota(temperatura, humedad, luz, hambre) {
    let estado = {
        feliz: 0,
        triste: 0,
        sueño: 0,
        hambre: hambre, // Usamos el estado actual de hambre
        temperaturaEstado: '',
        humedadEstado: '',
        luzEstado: ''
    };

    // Estado de la temperatura
    if (temperatura < 15) {
        estado.temperaturaEstado = 0; // Frío
    } else if (temperatura >= 16 && temperatura <= 28) {
        estado.temperaturaEstado = 1; // Óptimo
    } else {
        estado.temperaturaEstado = 2; // Calor extremo
    }

    // Estado de la humedad
    if (humedad < 30) {
        estado.humedadEstado = 0; // Baja humedad
    } else if (humedad >= 31 && humedad <= 60) {
        estado.humedadEstado = 1; // Óptima
    } else {
        estado.humedadEstado = 2; // Alta humedad
    }

    // Estado de la luz
    if (luz < 20) {
        estado.luzEstado = 0; // Poca luz
    } else if (luz >= 21 && luz <= 70) {
        estado.luzEstado = 1; // Óptima
    } else {
        estado.luzEstado = 2; // Exceso de luz
    }

    // Logica avanzada para feliz, triste y sueño
    if (hambre === 0) {
        estado.triste = 1; // Si tiene hambre, está triste
        estado.feliz = 0;
    } else if (hambre === 1) {
        estado.feliz = 1; // Si está llena, está feliz
        estado.triste = 0;
    }

    // Lógica para el sueño (ejemplo)
    if (estado.luzEstado === 0 && estado.temperaturaEstado === 0) {
        estado.sueño = 1; // Está en condiciones de tener sueño
    } else {
        estado.sueño = 0;
    }

    return estado;
}
