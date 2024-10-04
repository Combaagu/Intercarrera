# Intercarrera

# Registro de usuario
# login de usuario

# GET de datos MQTT

# Logica con los datos MQTT

# API REST

# POST de datos MQTT/Broker

# 


# ------------------------

npm i 

npm run index

# Rutas
para registrar usuario:

# POST
http://localhost:3000/api/auth/registro

{
    "nombre":"franco",
    "email": "franco@example.com",
    "contraseña": "1234"
}

para loguear usuario: 

# POST
http://localhost:3000/api/auth/login

{
    "email": "chuca@example.com",
    "contraseña": "12345"
}

seria como el Home / de prueba para ver que el usuaria exista y este logueadop y pueda acceder

# GET
http://localhost:3000/api/auth/ 