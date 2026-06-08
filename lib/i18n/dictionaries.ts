export const dictionaries = {
  en: {
    // Navigation
    nav: {
      buy: 'Buy',
      rent: 'Rent',
      sell: 'Sell',
      savedHomes: 'Saved Homes',
      signIn: 'Sign In',
      signOut: 'Sign out',
    },
    // Home Screen
    home: {
      heroTitlePrefix: 'Find your ',
      heroTitleHighlight: 'sanctuary',
      heroTitleSuffix: '.',
      searchPlaceholder: 'Search by city, neighborhood, or address...',
      searchButton: 'Search',
      filters: 'Filters',
      featuredTitle: 'Featured Collections',
      featuredSubtitle: 'Curated properties for the discerning eye.',
      viewAll: 'View all',
      newMarketTitle: 'New in Market',
      newMarketSubtitle: 'Fresh opportunities added this week.',
      emptyState: 'No properties found matching your criteria.',
      types: {
        all: 'All',
        house: 'House',
        apartment: 'Apartment',
        villa: 'Villa',
        penthouse: 'Penthouse'
      },
      purposes: {
        all: 'All',
        buy: 'Buy',
        rent: 'Rent'
      }
    },
    // Login Screen
    login: {
      title: 'Welcome to LuxeEstate',
      subtitle: 'Unlock exclusive properties worldwide.',
      google: 'Continue with Google',
      github: 'Continue with GitHub',
      connecting: 'Connecting...',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      help: 'Help Center'
    }
  },
  es: {
    // Navigation
    nav: {
      buy: 'Comprar',
      rent: 'Alquilar',
      sell: 'Vender',
      savedHomes: 'Guardados',
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
    },
    // Home Screen
    home: {
      heroTitlePrefix: 'Encuentra tu ',
      heroTitleHighlight: 'santuario',
      heroTitleSuffix: '.',
      searchPlaceholder: 'Buscar por ciudad, vecindario o dirección...',
      searchButton: 'Buscar',
      filters: 'Filtros',
      featuredTitle: 'Colecciones Destacadas',
      featuredSubtitle: 'Propiedades curadas para el ojo exigente.',
      viewAll: 'Ver todo',
      newMarketTitle: 'Nuevos en el Mercado',
      newMarketSubtitle: 'Nuevas oportunidades añadidas esta semana.',
      emptyState: 'No se encontraron propiedades que coincidan con los criterios.',
      types: {
        all: 'Todos',
        house: 'Casa',
        apartment: 'Apartamento',
        villa: 'Villa',
        penthouse: 'Penthouse'
      },
      purposes: {
        all: 'Todos',
        buy: 'Comprar',
        rent: 'Alquilar'
      }
    },
    // Login Screen
    login: {
      title: 'Bienvenido a LuxeEstate',
      subtitle: 'Desbloquea propiedades exclusivas a nivel mundial.',
      google: 'Continuar con Google',
      github: 'Continuar con GitHub',
      connecting: 'Conectando...',
      noAccount: "¿No tienes una cuenta?",
      signUp: 'Regístrate',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      help: 'Centro de Ayuda'
    }
  }
};

export type Dictionary = typeof dictionaries.en;
