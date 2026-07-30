/**
 * @swagger
 * tags:
 *   name: Stories
 *   description: Story management
 */

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Get all stories (public)
 *     tags: [Stories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: itemsPerPage
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category name
 *       - in: query
 *         name: createdAt
 *         schema: { type: string, format: date }
 *         description: Filter stories created on or after this date
 *       - in: query
 *         name: orderBy
 *         schema: { type: string, enum: [createdAt, title], default: createdAt }
 *     responses:
 *       200:
 *         description: Paginated list of stories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
 *   post:
 *     summary: Create a story
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, body]
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Story
 *               body:
 *                 type: string
 *                 example: Story content here...
 *               categoryIds:
 *                 type: array
 *                 items: { type: string, format: uuid }
 *               autoSummarize:
 *                 type: boolean
 *                 default: true
 *                 description: Whether to auto-generate an AI summary on creation
 *     responses:
 *       201:
 *         description: Story created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Story'
 */

/**
 * @swagger
 * /stories/{storyId}:
 *   get:
 *     summary: Get story by ID
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Story found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Story'
 *       404:
 *         description: Story not found
 *   patch:
 *     summary: Update story (owner or admin)
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               body:
 *                 type: string
 *                 description: If changed, the AI summary is automatically regenerated
 *               categoryIds:
 *                 type: array
 *                 items: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Story updated
 *       403:
 *         description: Not the story owner or an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete story (owner or admin)
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Story deleted
 *       403:
 *         description: Not the story owner or an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /stories/{storyId}/regenerate-summary:
 *   post:
 *     summary: Regenerate AI summary for a story (any authenticated user)
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Summary regenerated (or returned as-is if already up to date)
 *       404:
 *         description: Story not found
 *       429:
 *         description: Too many requests — rate limited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export {};
