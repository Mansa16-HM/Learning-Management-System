import { Router } from 'express';

import {
    getAllCourse,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    removeLecture,
    markLectureCompleted
} from '../controllers/course.controllers.js';

import {
    authorizedRoles,
    isLoggedIn
} from '../middlewares/auth.middlewares.js';

import upload from '../middlewares/multer.middleware.js';

const router = Router();

/**
 * ======================================
 * GET ALL COURSES + CREATE COURSE
 * ======================================
 */

router.route('/')

    .get(
        getAllCourse
    )

    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse
    );

/**
 * ======================================
 * SAVE LECTURE PROGRESS
 * IMPORTANT:
 * Keep this ABOVE '/:id'
 * ======================================
 */

router.route('/progress')

    .post(
        isLoggedIn,
        markLectureCompleted
    );

/**
 * ======================================
 * GET / UPDATE / DELETE COURSE
 * ======================================
 */

router.route('/:id')

    .get(
        isLoggedIn,
        getLecturesByCourseId
    )

    .put(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        updateCourse
    )

    .delete(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        removeCourse
    )

    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('lecture'),
        addLectureToCourseById
    );

/**
 * ======================================
 * DELETE SINGLE LECTURE
 * ======================================
 */

router.route('/:courseId/lectures/:lectureId')

    .delete(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        removeLecture
    );

export default router;