const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth.middleware');
const cookieParser = require('cookie-parser');

const chatController = require('../controllers/chat.controller');

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Gestión de conversaciones y mensajes
 */

router.use(cookieParser());
router.use(requireAuth);

/**
 * @swagger
 * /api/chat/conversations/{friendId}:
 *   post:
 *     summary: Crear o recuperar una conversación con un amigo
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: friendId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del amigo
 *     responses:
 *       200:
 *         description: Conversación creada o recuperada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Solicitud inválida
 */
router.post('/conversations/:friendId', chatController.createOrGetConversation);

/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Obtener todas las conversaciones del usuario
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Lista de conversaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 */
router.get('/conversations', chatController.getMyConversations);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/messages:
 *   get:
 *     summary: Obtener mensajes de una conversación
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la conversación
 *     responses:
 *       200:
 *         description: Lista de mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       404:
 *         description: Conversación no encontrada
 */
router.get('/conversations/:conversationId/messages', chatController.getConversationMessages);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/messages:
 *   post:
 *     summary: Enviar mensaje en una conversación
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la conversación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenido del mensaje
 *     responses:
 *       201:
 *         description: Mensaje enviado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Solicitud inválida
 */
router.post('/conversations/:conversationId/messages', chatController.sendMessage);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/read:
 *   patch:
 *     summary: Marcar conversación como leída
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la conversación
 *     responses:
 *       200:
 *         description: Conversación marcada como leída
 *       404:
 *         description: Conversación no encontrada
 */
router.patch('/conversations/:conversationId/read', chatController.markConversationAsRead);

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *       example:
 *         _id: "624b1f4e8f1b2c001c8e4e1e"
 *         participants: ["624b1f4e8f1b2c001c8e4e1b", "624b1f4e8f1b2c001c8e4e1d"]
 *         messages: []
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         sender:
 *           type: string
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "624b1f4e8f1b2c001c8e4e1f"
 *         sender: "624b1f4e8f1b2c001c8e4e1b"
 *         content: "¡Hola!"
 *         createdAt: "2024-04-01T10:00:00Z"
 */
module.exports = router;