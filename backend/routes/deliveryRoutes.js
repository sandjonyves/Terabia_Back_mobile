const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// ============================================================
// 1. ROUTES SPÉCIFIQUES (À METTRE EN PREMIER !!!)
// ============================================================

// Récupérer les livraisons disponibles (Status 'available' & sans livreur)
// Frontend : Utilisé dans le Dashboard (index.tsx)
router.get('/available', deliveryController.getAvailableDeliveries);

// Récupérer l'historique des missions d'un livreur spécifique
// Frontend : Utilisé dans "Mes Missions" (deliveries.tsx)
router.get('/mine/:agency_id', deliveryController.getMyDeliveries);

// Trouver une livraison grâce à l'ID de la commande associée
// (On le met avant /:id pour éviter les conflits)
router.get('/order/:order_id', deliveryController.getDeliveryByOrderId);

// ============================================================
// 2. ROUTES D'ACTION
// ============================================================

// Accepter une livraison (Logique "Premier arrivé")
// Frontend : Bouton "Accepter" du Dashboard
router.post('/:id/accept', deliveryController.acceptDelivery);

// ============================================================
// 3. ROUTES CRUD CLASSIQUES (À METTRE À LA FIN)
// ============================================================

// Créer une livraison manuellement
router.post('/', deliveryController.createDelivery);

// Récupérer la liste complète (Admin)
router.get('/', deliveryController.getAllDeliveries);

// Récupérer une livraison précise par son ID
// ⚠️ IMPORTANT : Cette route doit être après '/available' et '/mine'
// Sinon Express pensera que "available" est un ID.
router.get('/:id', deliveryController.getDeliveryById);

// Mettre à jour une livraison (Statut, Date livraison, etc.)
router.put('/:id', deliveryController.updateDelivery);

// Supprimer une livraison
router.delete('/:id', deliveryController.deleteDelivery);

module.exports = router;