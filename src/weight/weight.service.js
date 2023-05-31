import * as weightRepository from "./weight.repository.js";
import * as userRepository from "../user/user.repository.js";

/**
 * @swagger
 *
 * /weight:
 *   post:
 *     tags:
 *       - Weight
 *     summary: Create weight entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *               weight:
 *                 type: number
 *                 description: Weight value
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the weight entry
 *     responses:
 *       201:
 *         description: Weight entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 newWeight:
 *                   $ref: '#/components/schemas/WeightEntry'
 *       401:
 *         description: Unauthorized or User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Failed to create weight entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 error:
 *                   type: string
 *                   description: Error message
 */
export async function createWeight(req, res) {
  const { userId, weight, date } = req.body;

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const newWeight = await weightRepository.createWeight({
      userId,
      weight,
      date,
    });

    return res.status(201).json({ success: true, newWeight });
  } catch (error) {
    console.error("Error creating weight:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create weight entry" });
  }
}

/**
 * @swagger
 *
 * /weight/{userId}:
 *   get:
 *     tags:
 *       - Weight
 *     summary: Get weight records by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Weight records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 weightRecords:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WeightEntry'
 *       401:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Failed to retrieve weight records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 error:
 *                   type: string
 *                   description: Error message
 */
export async function getWeight(req, res) {
  const userId = req.params.userId;

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const weightRecords = await weightRepository.getWeightByUserId(userId);

    return res.status(200).json({ success: true, weightRecords });
  } catch (error) {
    console.error("Error retrieving weight records:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to retrieve weight records" });
  }
}

/**
 * @swagger
 *
 * /weight/{weightId}:
 *   put:
 *     tags:
 *       - Weight
 *     summary: Update weight record by ID
 *     parameters:
 *       - in: path
 *         name: weightId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the weight record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight:
 *                 type: number
 *                 description: Updated weight value
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Updated date of the weight entry
 *     responses:
 *       200:
 *         description: Weight record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Weight record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Failed to update weight record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 error:
 *                   type: string
 *                   description: Error message
 */
export async function updateWeight(req, res) {
  const weightId = req.params.weightId;
  const { weight, date } = req.body;

  try {
    const existingWeight = await weightRepository.getById(weightId);
    if (!existingWeight) {
      return res
        .status(404)
        .json({ success: false, message: "Weight record not found" });
    }

    existingWeight.weight = weight;
    existingWeight.date = date;
    await existingWeight.save();

    return res
      .status(200)
      .json({ success: true, message: "Weight record updated successfully" });
  } catch (error) {
    console.error("Error updating weight record:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update weight record" });
  }
}

/**
 * @swagger
 *
 * /weight/{weightId}:
 *   delete:
 *     tags:
 *       - Weight
 *     summary: Delete weight record by ID
 *     parameters:
 *       - in: path
 *         name: weightId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the weight record
 *     responses:
 *       204:
 *         description: Weight record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Weight record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Failed to delete weight record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 error:
 *                   type: string
 *                   description: Error message
 */
export async function deleteWeight(req, res) {
  const weightId = req.params.weightId;

  try {
    const existingWeight = await weightRepository.getById(weightId);
    if (!existingWeight) {
      return res
        .status(404)
        .json({ success: false, message: "Weight record not found" });
    }

    await weightRepository.deleteWeight(weightId);

    return res
      .status(204)
      .json({ success: true, message: "Weight record deleted successfully" });
  } catch (error) {
    console.error("Error deleting weight record:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete weight record" });
  }
}
