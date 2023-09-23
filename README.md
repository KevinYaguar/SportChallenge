# SportClub Listado de Clientes 
En este proyecto fue creado con Django y React.

##Librerías, frameworks y herramientas utilizadas 
**Backend**
-Python 3.10.7
-virtualenv
-django
-django-cors-headers 
-djangorestframework
-coreapi

**Frontend**
-Node js v16.13.2
-vite client-table --template react
-tailwindcss postcss autoprefixer
- tailwindcss init -p
-tanstack/react-table
-classname
-tanstack/match-sorter-utils 
-axios

## Instalación
### 1 Paso
    git clone https://github.com/KevinYaguar/SportChallenge.git
### 2 Paso
**Instalación backend**
-Instalar Python
-pip install virtualenv
-pip install django
-pip install django-cors-headers 
-pip install djangorestframework
-pip install coreapi
### 3 Paso
**Instalación frontend**
**Dentro de /client-table**

-vite@latest client-table --template react  
-npm install -D tailwindcss postcss autoprefixer
-npx tailwindcss init -p
-npm install @tanstack/react-table
-npm install classname
-npm i @tanstack/match-sorter-utils  
-npm install axios
##4 Paso
Para levantar el servidor y entrar al admin de Django correr
-pyhton manage.py migrate
-python manage.py makemigrations client
-python manage.py runserver
##Paso 5
Ingresar a http://localhost:8000/admin 
Para crear un superusuario 
-python manage.py createsuperuser y seguir los pasos creando las credenciales.
Una vez dentro de /admin crear clientes para iterar después.
##Paso 6
**Dentro de /client-table**
Levantar frontend con 
-npm run dev
