const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth.middleware');
const cookieParser = require('cookie-parser');

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  getFriends,
  removeFriend,
  getSuggestedFriends,
  getSearchableUsers,
  getUsersBySearch,
  getSentRequests
} = require('../controllers/friends.controller');

/**
 * @swagger
 * tags:
 *   name: Amigos
 *   description: Gestión de solicitudes y lista de amigos
 */

router.use(cookieParser());
router.use(requireAuth);

/**
 * @swagger
 * /api/friends/request:
 *   post:
 *     summary: Enviar solicitud de amistad
 *     tags: [Amigos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario al que se envía la solicitud
 *     responses:
 *       201:
 *         description: Solicitud enviada
 *       400:
 *         description: Solicitud inválida
 */
router.post('/request', sendFriendRequest);

/**
 * @swagger
 * /api/friends/{requestId}/accept:
 *   put:
 *     summary: Aceptar solicitud de amistad
 *     tags: [Amigos]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la solicitud a aceptar
 *     responses:
 *       200:
 *         description: Solicitud aceptada
 *       400:
 *         description: Solicitud inválida
 *       403:
 *         description: No tienes permiso para aceptar esta solicitud
 *       404:
 *         description: Solicitud no encontrada
 */
router.put('/:requestId/accept', acceptFriendRequest);

/**
 * @swagger
 * /api/friends/{requestId}/reject:
 *   put:
 *     summary: Rechazar solicitud de amistad
 *     tags: [Amigos]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la solicitud a rechazar
 *     responses:
 *       200:
 *         description: Solicitud rechazada
 *       400:
 *         description: Solicitud inválida
 *       403:
 *         description: No tienes permiso para rechazar esta solicitud
 *       404:
 *         description: Solicitud no encontrada
 */
router.put('/:requestId/reject', rejectFriendRequest);

/**
 * @swagger
 * /api/friends/pending:
 *   get:
 *     summary: Obtener solicitudes de amistad pendientes
 *     tags: [Amigos]
 *     responses:
 *       200:
 *         description: Lista de solicitudes pendientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequest'
 */
router.get('/pending', getPendingRequests);

/**
 * @swagger
 * /api/friends/list:
 *   get:
 *     summary: Obtener lista de amigos
 *     tags: [Amigos]
 *     responses:
 *       200:
 *         description: Lista de amigos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/list', getFriends);

/**
 * @swagger
 * /api/friends/suggested:
 *   get:
 *     summary: Obtener sugerencias de amigos
 *     tags: [Amigos]
 *     responses:
 *       200:
 *         description: Lista de sugerencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/suggested', getSuggestedFriends);

/**
 * @swagger
 * /api/friends/{friendId}:
 *   delete:
 *     summary: Eliminar amigo
 *     tags: [Amigos]
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del amigo a eliminar
 *     responses:
 *       200:
 *         description: Amigo eliminado
 *       400:
 *         description: Solicitud inválida
 *       404:
 *         description: No sois amigos
 */
router.delete('/:friendId', removeFriend);

/**
 * @swagger
 * /api/friends/searchable:
 *   get:
 *     summary: Obtener usuarios buscables
 *     tags: [Amigos]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/searchable', getSearchableUsers);

/**
 * @swagger
 * /api/friends/search:
 *   get:
 *     summary: Buscar usuarios
 *     tags: [Amigos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Texto de búsqueda
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/search', getUsersBySearch);

/**
 * @swagger
 * /api/friends/sent:
 *   get:
 *     summary: Obtener solicitudes de amistad enviadas
 *     tags: [Amigos]
 *     responses:
 *       200:
 *         description: Lista de solicitudes enviadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequest'
 */
router.get('/sent', getSentRequests);

/**
 * @swagger
 * components:
 *   schemas:
 *     FriendRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         from:
 *           type: string
 *           description: ID del usuario que envía la solicitud
 *         to:
 *           type: string
 *           description: ID del usuario que recibe la solicitud
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "624b1f4e8f1b2c001c8e4e1c"
 *         from: "624b1f4e8f1b2c001c8e4e1b"
 *         to: "624b1f4e8f1b2c001c8e4e1d"
 *         status: "pending"
 *         createdAt: "2024-04-01T10:00:00Z"
 */
module.exports = router;
