import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance";

const initialState = {
    lectures: [],
    completedLectures: []
};

// ===============================
// GET COURSE LECTURES
// ===============================
export const getCourseLectures = createAsyncThunk(
    "/course/lecture/get",
    async (cid) => {

        try {

            const response =
                axiosInstance.get(`/course/${cid}`);

            toast.promise(response, {
                loading: "Fetching course lectures",
                success: "Lectures fetched successfully",
                error: "Failed to load lectures"
            });

            return (await response).data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message
            );
        }
    }
);

// ===============================
// ADD COURSE LECTURE
// ===============================
export const addCourseLectures = createAsyncThunk(
    "/course/lecture/add",
    async (data) => {

        try {

            const formData = new FormData();

            formData.append(
                "title",
                data.title
            );

            formData.append(
                "description",
                data.description
            );

            // YouTube URL
            if (data.youtubeUrl) {

                formData.append(
                    "youtubeUrl",
                    data.youtubeUrl
                );
            }

            // Uploaded video
            if (data.lecture) {

                formData.append(
                    "lecture",
                    data.lecture
                );
            }

            const response =
                axiosInstance.post(
                    `/course/${data.id}`,
                    formData
                );

            toast.promise(response, {
                loading: "Adding lecture",
                success: "Lecture added successfully",
                error: "Failed to add lecture"
            });

            return (await response).data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message
            );
        }
    }
);
export const markLectureCompleted = createAsyncThunk(
    "/course/progress",
    async (data) => {

        try {

            const response = axiosInstance.post(
                "/course/progress",
                data
            );

            toast.promise(response, {
                loading: "Saving progress...",
                success: "Lecture completed",
                error: "Failed to save progress"
            });

            return (await response).data;

        } catch (error) {

            toast.error(error?.response?.data?.message);
        }
    }
);
// ===============================
// DELETE LECTURE
// ===============================
export const deleteCourseLecture = createAsyncThunk(
    "/course/lecture/delete",
    async (data) => {

        try {

            const response =
                axiosInstance.delete(
                    `/course/${data.courseId}/lectures/${data.lectureId}`
                );

            toast.promise(response, {
                loading: "Deleting lecture",
                success: "Lecture deleted successfully",
                error: "Failed to delete lecture"
            });

            return (await response).data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message
            );
        }
    }
);

// ===============================
// MARK LECTURE COMPLETE
// ===============================
export const markLectureComplete = createAsyncThunk(
    "/course/lecture/complete",
    async (data) => {

        try {

            const response =
                axiosInstance.post(
                    "/course/progress",
                    {
                        courseId: data.courseId,
                        lectureId: data.lectureId
                    }
                );

            return (await response).data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message
            );
        }
    }
);

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(
                getCourseLectures.fulfilled,
                (state, action) => {

                    state.lectures =
                        action?.payload?.lectures;
                }
            )

            .addCase(
                addCourseLectures.fulfilled,
                (state, action) => {

                    state.lectures =
                        action?.payload?.lectures;
                }
            )

            .addCase(
                markLectureComplete.fulfilled,
                (state, action) => {

                    const progress =
                        action?.payload?.courseProgress;

                    if (progress?.length > 0) {

                        state.completedLectures =
                            progress[0]
                                ?.completedLectures || [];
                    }
                }
            );
    }
});

export default lectureSlice.reducer;