
# ServidorCartaAvtomat

Proveedor de artículos de ICG Manager, obtiene información relevante la entrega en un cómodo archivo JSON


## Compilación, instalación y configuración 

**Prerequisitos:**

* Node 22 (recomendado) o superior
* NPM 10 (recomendado) o superior


**Importante:** Podemos saltearnos el siguiente paso descargando la [versión precompilada](https://github.com/tecnico2-microsite/ServidorCartaAvtomat/releases/download/release/build.7z), en ese caso, dirigirse a **Instalación**

### Compilación

Con el proyecto clonado/descargado, instalamos las dependencias


```bash

cd /d ruta\Al\Proyecto\
npm install
```
Ejecutamos el comando para compilar, el mismo además de compilar el proyecto va a copiar una plantilla de .env que nos servirá más adelante.

```bash
npm run tsc
```

Se nos va a generar un directorio *build/*, aquí tendremos nuestra aplicación lista para instalar y configurar.

### Instalación

Instalamos las dependencias (sólamente las esenciales)

```bash
npm install --omit=dev
```
### Configuración

Editamos el archivo de configuraciones *local.env*, que debería verse como lo siguiente, siempre que hablemos de base de datos nos estaremos refiriendo siempre a la de ICG Manager:

```
DB_URL= IP del servidor de la base de datos
DB_NAME= Nombre de la base
DB_PORT= Puerto de escucha del servicio SQL
DB_USER= Usuario con permiso de lectura a la base
DB_PASS= Contraseña del usuario
APP_PORT= Puerto de escucha de la aplicación*
```
\* Este puerto elegido nos servirá para configurar los clientes de [MenuDigitalX](https://github.com/tecnico2-microsite/MenuDigitalX)

Ejemplo de configuración
```
DB_URL=localhost
DB_NAME=ICG
DB_PORT=1433
DB_USER=sca
DB_PASS=
APP_PORT=2121

```

### Correr la aplicación

Ya podemos correrla y responderá peticiones correctamente de la siguiente manera

```bash
cd /d Ruta\Al\Proyecto
node .\index.js
```

Sin embargo, es de nuestro interés que la aplicación corra siempre de fondo y no depender de tener una ventana terminal abierta, para ello podemos utilizar **pm2**

```bash
npm install pm2 -g
```

Sin ir en demasiado detalle de cómo utilizarlo, podemos utilizar [este iniciador]() donde editando las primeras líneas podemos hacerlo de manera sencilla

```bash

set RutaBuild= Ruta al directorio build\ de la app
set Nombre= Identificador del servicio
```

Ejemplo

```bash

set RutaBuild=D:\Programas\ServidorCartaAvtomat\build\
set Nombre=Restaurante
```

Podemos generar una [tarea programada](https://github.com/tecnico2-microsite/ServidorCartaAvtomat/releases/download/release/INICIAR_SERVICIO_CARTA.xml) para iniciarse automáticamente, cambiando únicamente la ruta al script

![](https://github.com/tecnico2-microsite/ServidorCartaAvtomat/blob/master/doc/001.png)



## Uso

Más información sobre cómo levantar un MenuDigital en su [repositorio](https://github.com/tecnico2-microsite/MenuDigitalX)

### API Reference

Podemos enviar únicamente peticiones del tipo GET al endpoint `\articulos\`

Con los siguientes query params filtramos los datos según necesitemos:

```bash
visualizacion= Campo libre que debe estar tildado en el artículo para procesarlo

fullPath= Ruta completa donde debe generarse el archivo JSON, incluyendo el nombre del mismo

inicio= Número de referencia DESDE el cual filtrar

fin= Número de referencia HASTA el cual filtrar

raw= será 'true' (sin comilla) si en lugar de generar un archivo JSON debe imprimir el resultado de la query por consola
```

**!** A partir de la versión 1.2, los campos libres de artículo para filtrar, deben tener su ID iniciando en "CARTA_", ej.: CARTA_RESTO, CARTA_TV1, CARTA_TERRAZA

Ejemplo de query para mostrar los artículos con el tilde en el campo libre "CARTA_BAR", desde la referencia 3000 hasta la 5999
```
GET localhost:2121\articulos?visualizacion=CARTA_BAR&inicio=3000&fin=5999&fullPath=D:\Programas\MenuDigital\data.json
```

En caso de que el archivo se genere correctamente la query devolverá `success!`
