import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import User from '../models/usermodel.js';

const router = Router();

/**
 * @route POST /api/v1/progress/complete
 * @description Mark a lecture as completed
 * @access Private
 */
router.post('/complete', isLoggedIn, async (req, res) => {
    try {
        const { courseId, lectureId } = req.body;
        const userId = req.user.id;

        if (!courseId || !lectureId) {
            return res.status(400).json({
                success: false,
                message: "courseId and lectureId are required"
            });
        }

        const user = await User.findById(userId);

        // Find existing course progress
        const courseProgress = user.courseProgress.find(
            p => p.courseId.toString() === courseId
        );

        if (courseProgress) {
            // Add lecture if not already completed
            if (!courseProgress.completedLectures.includes(lectureId)) {
                courseProgress.completedLectures.push(lectureId);
            }
        } else {
            // Create new course progress
            user.courseProgress.push({
                courseId,
                completedLectures: [lectureId]
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Lecture marked as completed",
            courseProgress: user.courseProgress
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route GET /api/v1/progress/:courseId
 * @description Get completed lectures for a course
 * @access Private
 */
router.get('/:courseId', isLoggedIn, async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);

        const courseProgress = user.courseProgress.find(
            p => p.courseId.toString() === courseId
        );

        res.status(200).json({
            success: true,
            completedLectures: courseProgress?.completedLectures || []
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
