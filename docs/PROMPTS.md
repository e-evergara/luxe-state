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
