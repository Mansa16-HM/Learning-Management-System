import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { getCourseLectures } from "../../Redux/Slices/LectureSlice";
import toast from "react-hot-toast";
import axios from "axios";

function CourseDescription() {

    const { id } = useParams(); // ✅ FIXED (no useLocation state)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { role, data } = useSelector((state) => state.auth);

    const [course, setCourse] = useState(null);

    // ✅ Fetch course from backend (survives refresh)
    async function fetchCourse() {
        try {
            const res = await axios.get(
                `http://localhost:5014/api/v1/courses/${id}`
            );

            setCourse(res.data.course);

        } catch (error) {
            toast.error("Failed to load course");
        }
    }

    useEffect(() => {
        fetchCourse();
    }, [id]);

    // Convert YouTube link to embed
    const getEmbedUrl = (url) => {
        if (!url) return "";
        const match = url.match(/v=([^&]+)/);
        return match
            ? `https://www.youtube.com/embed/${match[1]}`
            : url;
    };

    // Fetch lectures
    async function handleWatchLectures() {
        try {
            const res = await dispatch(getCourseLectures(id));
            const lectures = res?.payload?.lectures;

            if (!lectures || lectures.length === 0) {
                toast.error("No lectures found for this course");
                return;
            }

            navigate("/course/displaylecture", {
                state: { ...course, lectures }
            });

        } catch (error) {
            toast.error("Failed to load lectures");
        }
    }

    if (!course) {
        return (
            <HomeLayout>
                <h1 className="text-white text-center mt-10">Loading...</h1>
            </HomeLayout>
        );
    }

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 md:px-20 flex flex-col items-center justify-center text-white">

                <div className="flex flex-col items-center justify-center md:shadow-[0_0_10px_black] md:w-[50rem]">

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-yellow-500 mb-2 text-center mt-5">
                        {course.title}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 py-10 w-full md:w-[80%]">

                        {/* Left */}
                        <div className="space-y-3">

                            <img
                                className="w-full h-64 object-cover rounded"
                                src={course.thumbnail?.secure_url}
                                alt="thumbnail"
                            />

                            <div className="text-center text-xl">
                                <p>
                                    <span className="font-semibold">Total lectures: </span>
                                    {course.numberOfLectures}
                                </p>

                                <p>
                                    <span className="font-semibold">Instructor: </span>
                                    {course.createdBy}
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="space-y-3 text-xl">

                            <p className="text-yellow-500">Course description:</p>
                            <p>{course.description}</p>

                            {/* YouTube video */}
                            {course.videoUrl && (
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={getEmbedUrl(course.videoUrl)}
                                    title="Course Video"
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            )}

                            {/* Buttons */}
                            {role === "ADMIN" ||
                            data?.subscription?.status === "active" ? (
                                <button
                                    onClick={handleWatchLectures}
                                    className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500"
                                >
                                    Watch Lectures
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500"
                                >
                                    Subscribe
                                </button>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </HomeLayout>
    );
}

export default CourseDescription;