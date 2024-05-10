const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const secretKey = 'tu_secreto';



const predefinedUsers = [
    new User(1, 'Ariel Raura', 'ariel@gmail.com', 'ariel123'),
    new User(2, 'Usuario2', 'usuario2@example.com', 'password2'),
    new User(3, 'Usuario3', 'usuario3@example.com', 'password3')
];

// Agregar los usuarios predefinidos a la lista de usuarios
let users = [...predefinedUsers];

exports.getUsers = (req, res) => {
    res.json(users);
};

exports.getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
};

exports.createUser = (req, res) => {
    console.log('Solicitud para crear un nuevo usuario recibida');
    const { name, email, password } = req.body;
    const newUser = new User(Date.now(), name, email, password);
    users.push(newUser);
    res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].email = email;
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
};

exports.deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        res.json(deletedUser[0]);
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    // Buscar al usuario por su correo electrónico
    const user = users.find(user => user.email === username);
    if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    // Verificar la contraseña en texto plano
    if (password !== user.password) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    // Si las credenciales son válidas, generar un token de sesión
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
};
