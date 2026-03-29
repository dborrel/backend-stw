const express = require('express');
const cookieParser = require('cookie-parser');

const requireAuth = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/admin.middleware');
const { getDashboard, getUsers, getEvents, getReportsSummary, getReports } = require('../controllers/admin.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Administración
 *   description: Endpoints de administración (requieren permisos de admin)
 */

router.use(cookieParser());

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Obtener dashboard de administración
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/dashboard', requireAuth, requireAdmin, getDashboard);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/users', requireAuth, requireAdmin, getUsers);

/**
 * @swagger
 * /api/admin/events:
 *   get:
 *     summary: Listar todos los eventos
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/events', requireAuth, requireAdmin, getEvents);

/**
 * @swagger
 * /api/admin/reports/summary:
 *   get:
 *     summary: Obtener resumen de reportes
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de reportes por categoría
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/reports/summary', requireAuth, requireAdmin, getReportsSummary);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Listar todos los reportes
 *     tags: [Administración]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría (Contenido, Usuarios, Eventos)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/reports', requireAuth, requireAdmin, getReports);

module.exports = router;
