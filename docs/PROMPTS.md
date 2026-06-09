1. Crear Home screen para el sitio web de Luxe State. 

```Text
    Vamos a crear el HomeScreen con propiedades mock.

    - Crea un set de datos mock para mostrar las propiedades que eventualmente vendrán de una base de datos.

    - El HomeScreen debe de lucir igual al código dado en @docs/resources/home_discover_screen/code.html
```

2. Vamos a mejorar el homeScreen. diseño 

```Text
  El disño no cumple ademas con los colores ademas no cambia a modo oscuro
```

3. Mejorar estructura de carpetas
```Text
  Mejora la estructura de directorios de la carpeta [components](./components) 
    1. Mete todo el contenido en una carpaeta llamada ui
    2. Los components especialmente para los archivos, [DarkModeSync.tsx](./components/DarkModeSync.tsx) , [FeaturedCard.tsx](./components/FeaturedCard.tsx) ,[HomeScreen.tsx](./components/HomeScreen.tsx) ,[Navbar.tsx](./components/Navbar.tsx) ,[PropertyCard.tsx](./components/PropertyCard.tsx)  Quiero que esten en sus carpetas para poder pensar en un futuro expandirlo ya que tendremos muchos mas componentes
```

4. Vamos a agregar nuevos componentes para la aplicacion web 
```Text
  agrega unos 10 propiedades mas a la lista
```

## Database

1. Vamos a crear una base de datos para la aplicacion web 

```Text
    Vamos a crear la base de datos en supabase, por favor usa el MCP de Supabase que ya está conectado.
    La paginación debe de ser del lado del servidor usando funciones de NextJS.
```

2. Plan de base de datos
```Text
   En el plan crear una taba relacional ya que las imagenes pueden ser varias image y cada imagen tiene su titulo y descripcion, si un campo status para saber si la muetra o no, y la data de auditoria como quien la creo que fecha, quien la actualizo y que fecha
```
3. Featured Collections
```Text
   Vamos a crear las "Featured Collections" propiedades, necesito que tengamos una bandera en la base de datos que me permita asignar una propiedad como "Featured"   
```

3. Authentication and Authorization

```Text
    Vamos a crear el login basado en el diseño exactamente igual al proporcionado en `docs/resources/social_login_and_registration/code.html`

    - Necesitamos que si el usuario tiene avatar de google o github, entonces que se muestre en el navbar
    - Implemente Google SignIn y Github Sign in basado en Supabase.
```
3.1.0 Add prompt in the implementation plan
```Text
    Yo proveere las configuraciones de Supabase para GitHub y Google Signin
```

3.1.1 add next.config for image
```Text
    Necesitamos autorizar la fuente de imágenes de GitHub para los avatar de los usuarios, de paso también añade los URLS de google

    Invalid src prop (https://avatars.githubusercontent.com/u/3438503?v=4) on `next/image`, hostname "avatars.githubusercontent.com" is not configured under images in your `next.config.js`
    See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
```

3.2 Add bottom closed session in navbar
```Text
  Necesito que el diseño del login, luzca igual al de la imagen proporcionada, ya que actualmente los colores no son los mismos.
  También, necesito en el navbar una manera de cerrar sesión
  Necesito un botón que siga el i18n para poder llamar la pantalla del login
```

4.1 Dashboard Page 
```Text
  Vamos a crear un dashboard administrativo que permita:

  - Ver las propiedades actuales
  - Editar roles de los usuarios autenticados en nuestra aplicación, crea una tabla en base de datos para esta labor
  - Crea un middleware para validar el role del usuario
  
```

4.1.1 User roles
```Text
  Necesito que todos los usuarios que se autentiquen en nuestra aplicación, creen un registro en la tabla de user_roles con el role por defecto.

  El middleware no me está dejando entrar a la ruta /admin/dashboard aunque el usuario sea administrador 
```

4.2 Dashboard UI
```Text
  Necesito que las pantallas de admin/users y admin/properties tengan los diseños exactamente igual a los proporcionados.

  - Pantalla de usuarios `</> code.html`
  - Pantalla de propiedades `</> code.html`

  Deben de lucir igual a esos diseños, siguiendo los lineamientos de color.


   Necesito que las pantallas de admin/dashboard?tab=users  y /admin/dashboard?tab=properties tengan los diseños exactamente igual a los proporcionados en la seccion de Panel de control.

  - Pantalla de usuarios [code.html](./docs/resources/admin_user_directory_cards/code.html) 
  - Pantalla de propiedades [code.html](./docs/resources/property_management_dashboard/code.html) 

  Deben de lucir igual a esos diseños, siguiendo los lineamientos de color.
```

4.2.1 Dashboard Properties

```Text
  Necesito que las pantallas de /admin/dashboard?tab=properties, implemente la paginacion de 10 propoerties por pagina y que traiga de 10 en 10 de la base de datos, no todas de golpe.
```

4.2.2 Dashboard details
```Text
   En el panel administrativo necesito:

  - Que el navbar muestre la foto de perfil del usuario si es que la tiene
  - Necesito una paginación de propiedades y de usuarios
  - Necesito que los botones de agregar propiedad y agregar usuario sigan los mismos color y diseños
  - Que el navbar muestre claramente cuál es la ruta activa
```

5.1 Create Add Property Page

```Text
  Vamos a preparar la pantalla para editar y crear propiedades nuevas.

  - Siga el diseño exactamente igual a @docs/resources/add_edit_property_form/code.html ya que cuenta con las clases y estructura necesaria
  - Si faltan campos en el formulario añadelos acorde
  - Sino le subimos una imagen ponle una por defecto de acorde al diseño
  - Añade una navegación entre la página de properties en el panel administrativo hacia la nueva página de creación o edición cuando sea necesario.
  - Vamos a usar un bucket en Supabase para la carga de imágenes y actualizarlas.
```

5.1.1 Add Property Runtime Error

```Text
  Necesito que configures este path en next.config para que las imágenes se puedan ver

  Runtime Error

  Invalid src prop
  (https://sjlojbdoihgappqtmads.supabase.co/storage/v1/object/public/property_images/properties/50pqpjszhut_1771877372446.jpg) 
  on `next/image`, hostname "sjlojbdoihgappqtmads.supabase.co" is not configured under images in your `next.config.js`
  
  See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
```

5.2  RLS (row level security) en Supabase
```Text
  Acabo de activar el RLS (row level security) en Supabase, y las grabaciones no funcionan.
```

5.3  Update Properties in Add Property Page
```Text
  Necesito que pongamos en el mantenimiento de propiedades, una opción para ingresar la latitud y longitud.
```

5.3.1 Show map in Add Property Page
```Text
  En la pantalla de editar y crear propiedades en el panel administrativo, vamos a mostrar el mapa de leaflet, cuando tengamos la latitud y longitud.
```

6. Deactive Properties
```Text
  Vamos a implementar una funcionalidad para desactivar propiedades.

  - Añade un campo 'active' de tipo booleano en la tabla de propiedades.
  - Por defecto, el valor debe ser true (activado).
  - En el panel administrativo, en la lista de propiedades, necesito un switch o botón para activar/desactivar cada propiedad.
  - Debe seguir los mismos lineamientos de diseño y colores que los demás elementos del dashboard.
  - Cuando una propiedad está desactivada, no debe mostrarse en la página principal de la aplicación (HomeScreen).
  - Cuando una propiedad está desactivada, debe de aparecer en el panel administrativo para futuras actualizaciones.
```