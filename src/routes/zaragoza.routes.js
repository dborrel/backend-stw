const express = require("express");
const router = express.Router();
const controller = require("../controllers/zaragoza.controller");

/**
 * @swagger
 * tags:
 *   name: Zaragoza
 *   description: Endpoints para eventos externos de Zaragoza
 */

/**
 * @swagger
 * /api/zaragoza/events:
 *   get:
 *     summary: Listar eventos de Zaragoza
 *     tags: [Zaragoza]
 *     responses:
 *       200:
 *         description: Lista de eventos externos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/events", controller.getEvents);

/**
 * @swagger
 * /api/zaragoza/events/today:
 *   get:
 *     summary: Listar eventos de Zaragoza para hoy
 *     tags: [Zaragoza]
 *     responses:
 *       200:
 *         description: Lista de eventos de hoy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/events/today", controller.getToday);

/**
 * @swagger
 * /api/zaragoza/events/search:
 *   get:
 *     summary: Buscar eventos de Zaragoza
 *     tags: [Zaragoza]
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
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/events/search", controller.search);

/**
 * @swagger
 * /api/zaragoza/events/{id}:
 *   get:
 *     summary: Obtener evento de Zaragoza por ID
 *     tags: [Zaragoza]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del evento externo
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento no encontrado
 */
router.get("/events/:id", controller.getEvent);

/**
 * @swagger
 * /api/zaragoza/import:
 *   post:
 *     summary: Importar eventos desde Zaragoza
 *     tags: [Zaragoza]
 *     responses:
 *       201:
 *         description: Eventos importados
 */
router.post("/import", controller.importFromZaragoza);

/**
 * @swagger
 * /api/zaragoza/sync:
 *   post:
 *     summary: Sincronizar manualmente eventos de Zaragoza
 *     tags: [Zaragoza]
 *     responses:
 *       200:
 *         description: Sincronización completada
 */
router.post("/sync", controller.manualSync);

module.exports = router;