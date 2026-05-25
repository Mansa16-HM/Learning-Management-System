import cloudinary from 'cloudinary';
import fs from 'fs/promises';

import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Course from '../models/course.model.js';
import AppError from '../utils/error.util.js';
import User from '../models/usermodel.js';

// ===============================
// GET ALL COURSES
// ===============================
export const getAllCourse = asyncHandler(async (req, res, next) => {
    try {

        const courses = await Course.find({})
            .select('-lectures');

        res.status(200).json({
            success: true,
            message: 'All courses fetched successfully',
            courses
        });

    } catch (error) {

        return next(
            new AppError(error.message, 500)
        );
    }
});

// ===============================
// GET LECTURES BY COURSE ID
// ===============================
export const getLecturesByCourseId = asyncHandler(
    async (req, res, next) => {

        try {

            const { id } = req.params;

            const course = await Course.findById(id);

            if (!course) {

                return next(
                    new AppError('Course not found', 404)
                );
            }

            res.status(200).json({
                success: true,
                message: 'Course lectures fetched successfully',
                lectures: course.lectures
            });

        } catch (error) {

            return next(
                new AppError(error.message, 500)
            );
        }
    }
);

// ===============================
// CREATE COURSE
// ===============================
export const createCourse = asyncHandler(
    async (req, res, next) => {

        console.log(req.body);
        console.log(req.file);

        const {
            title,
            description,
            category,
            createdBy
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !createdBy
        ) {

            return next(
                new AppError(
                    'All fields are required',
                    400
                )
            );
        }

        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: 'Dummy',
                secure_url: 'Dummy'
            }
        });

        if (req.file) {

            try {

                const result =
                    await cloudinary.v2.uploader.upload(
                        req.file.path,
                        {
                            folder: 'lms'
                        }
                    );

                course.thumbnail.public_id =
                    result.public_id;

                course.thumbnail.secure_url =
                    result.secure_url;

                await fs.rm(
                    `uploads/${req.file.filename}`
                );

            } catch (error) {

                return next(
                    new AppError(error.message, 500)
                );
            }

            await course.save();
        }

        res.status(200).json({
            success: true,
            message: 'Course created successfully',
            course
        });
    }
);

// ===============================
// UPDATE COURSE
// ===============================
export const updateCourse = asyncHandler(
    async (req, res, next) => {

        try {

            const { id } = req.params;

            const course =
                await Course.findByIdAndUpdate(
                    id,
                    { $set: req.body },
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!course) {

                return next(
                    new AppError('Course not found', 404)
                );
            }

            res.status(200).json({
                success: true,
                message: 'Course updated successfully',
                course
            });

        } catch (error) {

            return next(
                new AppError(error.message, 500)
            );
        }
    }
);

// ===============================
// DELETE COURSE
// ===============================
export const removeCourse = asyncHandler(
    async (req, res, next) => {

        try {

            const { id } = req.params;

            const course =
                await Course.findById(id);

            if (!course) {

                return next(
                    new AppError('Course not found', 404)
                );
            }

            await Course.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: 'Course removed successfully'
            });

        } catch (error) {

            return next(
                new AppError(error.message, 500)
            );
        }
    }
);

// ===============================
// ADD LECTURE (UPLOAD OR YOUTUBE)
// ===============================
export const addLectureToCourseById =
    asyncHandler(async (req, res, next) => {

        const {
            title,
            description,
            youtubeUrl
        } = req.body;

        const { id } = req.params;

        if (!title || !description) {

            return next(
                new AppError(
                    'Title and description are required',
                    400
                )
            );
        }

        const course = await Course.findById(id);

        if (!course) {

            return next(
                new AppError('Course not found', 404)
            );
        }

        const lectureData = {
            title,
            description,
            youtubeUrl,
            lecture: {}
        };

        if (req.file) {

            try {

                const result =
                    await cloudinary.v2.uploader.upload(
                        req.file.path,
                        {
                            folder: 'lms',
                            chunk_size: 50000000,
                            resource_type: 'video'
                        }
                    );

                lectureData.lecture.public_id =
                    result.public_id;

                lectureData.lecture.secure_url =
                    result.secure_url;

                await fs.rm(
                    `uploads/${req.file.filename}`
                );

            } catch (error) {

                return next(
                    new AppError(error.message, 500)
                );
            }
        }

        course.lectures.push(lectureData);

        course.numberOfLectures =
            course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture added successfully',
            course
        });
    });

// ===============================
// REMOVE LECTURE
// ===============================
export const removeLecture = asyncHandler(
    async (req, res, next) => {

        try {

            const {
                courseId,
                lectureId
            } = req.params;

            const course =
                await Course.findById(courseId);

            if (!course) {

                return next(
                    new AppError('Course not found', 404)
                );
            }

            const index =
                course.lectures.findIndex(
                    (lec) =>
                        lec._id.toString() ===
                        lectureId
                );

            if (index === -1) {

                return next(
                    new AppError(
                        'Lecture not found',
                        404
                    )
                );
            }

            const lecture =
                course.lectures[index];

            if (
                lecture?.lecture?.public_id
            ) {

                await cloudinary.v2.uploader.destroy(
                    lecture.lecture.public_id,
                    {
                        resource_type: 'video'
                    }
                );
            }

            course.lectures.splice(index, 1);

            course.numberOfLectures =
                course.lectures.length;

            await course.save();

            res.status(200).json({
                success: true,
                message:
                    'Lecture removed successfully'
            });

        } catch (error) {

            return next(
                new AppError(error.message, 500)
            );
        }
    }
);
// ===============================
// UPDATE LECTURE PROGRESS
// ===============================
export const updateLectureProgress =
    asyncHandler(async (req, res, next) => {

        try {

            const userId = req.user.id;

            const {
                courseId,
                lectureId
            } = req.body;

            // Check required fields
            if (!courseId || !lectureId) {

                return next(
                    new AppError(
                        'Course ID and Lecture ID are required',
                        400
                    )
                );
            }

            // Find user
            const user =
                await User.findById(userId);

            if (!user) {

                return next(
                    new AppError(
                        'User not found',
                        404
                    )
                );
            }

            // Find course progress
            let progress =
                user.courseProgress.find(
                    (item) =>
                        item.courseId.toString() ===
                        courseId
                );

            // If no progress exists
            if (!progress) {

                user.courseProgress.push({
                    courseId,
                    completedLectures: [
                        lectureId
                    ]
                });

            } else {

                // Prevent duplicate lectures
                const lectureAlreadyCompleted =
                    progress.completedLectures.some(
                        (id) =>
                            id.toString() ===
                            lectureId
                    );

                if (
                    !lectureAlreadyCompleted
                ) {

                    progress.completedLectures.push(
                        lectureId
                    );
                }
            }

            // Save progress
            await user.save();

            res.status(200).json({
                success: true,
                message:
                    'Lecture marked as completed',
                courseProgress:
                    user.courseProgress
            });

        } catch (error) {

            return next(
                new AppError(error.message, 500)
            );
        }
    });
    // ===============================
// MARK LECTURE AS COMPLETED
// ===============================
export const markLectureCompleted = asyncHandler(async (req, res, next) => {

    const { courseId, lectureId } = req.body;

    const userId = req.user.id;

    if (!courseId || !lectureId) {
        return next(new AppError("Course ID and Lecture ID are required", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // Find course progress
    let courseProgress = user.courseProgress.find(
        (item) => item.courseId.toString() === courseId
    );

    // If no course progress exists
    if (!courseProgress) {

        user.courseProgress.push({
            courseId,
            completedLectures: [lectureId]
        });

    } else {

        // Avoid duplicate lecture IDs
        const alreadyCompleted =
    courseProgress.completedLectures.some(
        (id) => id.toString() === lectureId
    );

        if (!alreadyCompleted) {
            courseProgress.completedLectures.push(
    lectureId
);
        }
    }
user.markModified("courseProgress");
    await user.save();

    res.status(200).json({
        success: true,
        message: "Lecture marked as completed",
        courseProgress: user.courseProgress
    });
});