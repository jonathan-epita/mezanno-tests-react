import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Activer les CORS pour toutes les requêtes
app.use(cors());

// Proxy pour Gallica
app.get('/api/*', async (req, res) => {
  const apiUrl = `https://gallica.bnf.fr${req.originalUrl.replace('/api', '')}`;
  try {
    console.log("Traitement d'une requête: ", apiUrl);
    
    const response = await axios.get(apiUrl);
    res.status(response.status).send(response.data);
    console.log(response.status);    
  } catch (error) {
    console.error('Erreur lors de la requête au serveur Gallica :', error);
    res.status(500).send('Erreur interne au proxy.');
  }
});

app.listen(PORT, () => {
  console.log(`Serveur proxy local en cours d'exécution sur http://localhost:${PORT}`);
});
