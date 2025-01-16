// Importamos deleteUser para eliminar la cuenta del usuario
import { deleteUser } from "firebase/auth";
// Importamos el auth con la configuración del proyecto
import { auth } from '@/backend/firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function deleteAccount() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No hay usuario autenticado');
        }
        
        // Eliminar la cuenta de Firebase
        await deleteUser(user);
        
        // Limpiar AsyncStorage
        await AsyncStorage.clear();
        
        // Limpiar el estado global del usuario si estás usando algún contexto
        
        console.log("Cuenta eliminada con éxito");
        return true;
    } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        throw error;
    }
}
