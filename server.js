//Charge les variables d'environnement depuis .env
require("dotenv").config({path: './config/.env'});

//Importer le module mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const User = require('./models/User');

const router = express.Router();


//On crée une fonction asynchrone appelée "databaseconnection" pour se connecter à la base de données
const databaseConnection = async () => {
    // On essaie de se connecter à la base de données
    try {
        // Connexion à la base de données en utilisant l'URI stockée dans les variables d'environnement
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, //  permet d'utiliser la nouvelle méthode et d'éviter les erreurs.
            useUnifiedTopology: true, //  permet d'utiliser le nouveau système
        });
        console.log("Connexion réussie");
    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB :", error.message);
    }
};

// Middleware
app.use(express.json());



// creer un utilisateur
router.post("/users", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });
    try {
        const newUser = await user.save();
        res.status(500).json({ newUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//lire les utilisateurs

router.get("/users", async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// ÉDITER UN UTILISATEUR PAR ID
router.put("/users/:id", async (req, res, next) => {
    try {
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body }
        );
        if (!updateUser) {
            res.status(404).send("Utilisateur non trouvé");
        }
        res.status(201).send(updateUser);

    } catch (error) {
        res.status(500).send(error);
    }
});

//DELETE : SUPPRIMER UN UTILISATEUR PAR ID
router.delete("/users/:id", async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
        if (!deletedUser) {
            return res.status(404).send("Utilisateur non trouvé");
        }
        res.status(200).send("Suppression réussie");
    } catch (error) {
        res.status(500).send(error);
    }
});


app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));