const API_URL = 'http://localhost:3000/api/auth';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    fk_rol: number;
    persona?: {
      nombre: string;
      apellido: string;
    };
  };
}

export const authService = {
  /**
   * Envía las credenciales al backend y guarda el token si es exitoso.
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Lanzamos el error que viene del backend (ej: "Credenciales incorrectas")
        throw new Error(data.error || 'Error en el inicio de sesión');
      }

      // LOGIN EXITOSO: Guardamos el token y datos del usuario
      // localStorage es simple, para más seguridad podrías usar cookies httpOnly
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Cierra sesión borrando los datos locales
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // O usar navigate() de react-router
  },

  /**
   * Obtiene el token actual
   */
  getToken: () => localStorage.getItem('token'),
  
  /**
   * Verifica si está logueado
   */
  isAuthenticated: () => !!localStorage.getItem('token')
};