/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin only for list) and own-profile self-service
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: itemsPerPage
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: Filter by name (case-insensitive)
 *       - in: query
 *         name: email
 *         schema: { type: string }
 *         description: Filter by email (case-insensitive)
 *       - in: query
 *         name: orderBy
 *         schema: { type: string, enum: [joinDate, username, name], default: joinDate }
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get own profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *   patch:
 *     summary: Update own profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               username: { type: string }
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Profile updated
 *       409:
 *         description: Username or email already taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     summary: Update a user (own account or admin)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               username: { type: string }
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Not the account owner or an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Soft delete a user (own account or admin)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Not the account owner or an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export {};
