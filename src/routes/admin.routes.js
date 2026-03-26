const express = require('express');
const cookieParser = require('cookie-parser');

const requireAuth = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/admin.middleware');
const { getDashboard, getUsers } = require('../controllers/admin.controller');

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

module.exports = router;
