import { useEffect, useState } from "react";
import { MdAutoDelete } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import HomeLayout from "../../Layouts/HomeLayout";
import {
    deleteCourseLecture,
    getCourseLectures
} from "../../Redux/Slices/LectureSlice";
import axiosInstance from "../../Helpers/axiosinstance";

function Displaylectures() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { lectures } = useSelector((state) => state.lecture);
    const { role } = useSelector((state) => state.auth);
    const [currentVideo, setCurrentVideo] = useState(0);

    // ✅ Track completed lectures from database
    const [completedLectures, setCompletedLectures] = useState([]);

    // ✅ Check if all lectures are completed
    const allCompleted = lectures && lectures.length > 0 &&
        completedLectures.length >= lectures.length;

    // ✅ Convert YouTube URL to embed URL
    const getEmbedUrl = (url) => {
        if (!url) return "";
        let videoId = "";
        if (url.includes("youtube.com/watch")) {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get("v");
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1].split("?")[0];
        }
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        return url;
    };

    // ✅ Load progress from database
    async function loadProgress() {
        try {
            const user = await axiosInstance.get('/user/me');
            const courseProgress = user.data?.user?.courseProgress?.find(
                p => p.courseId?.toString() === state._id?.toString()
            );
            if (courseProgress) {
                setCompletedLectures(
                    courseProgress.completedLectures.map(id => id.toString())
                );
            }
        } catch (error) {
            console.log("Error loading progress:", error);
        }
    }

    // ✅ Mark lecture as complete in database
    async function handleCompleteLecture() {
        try {
            const currentLecture = lectures[currentVideo];
            if (!currentLecture) return;

            const res = await axiosInstance.post('/course/progress', {
                courseId: state._id,
                lectureId: currentLecture._id
            });

            if (res.data.success) {
                toast.success("Lecture marked as completed! ✅");
                setCompletedLectures(prev => {
                    if (!prev.includes(currentLecture._id.toString())) {
                        return [...prev, currentLecture._id.toString()];
                    }
                    return prev;
                });
            }
        } catch (error) {
            toast.error("Failed to mark lecture as complete");
        }
    }

    // ✅ Handle Get Certificate
    function handleGetCertificate() {
        if (!allCompleted) {
            toast.error(`Complete all ${lectures.length} lectures to get certificate!`);
            return;
        }
        navigate("/course/certificate", { state: { ...state } });
    }

    // ✅ Delete Lecture
    async function onLectureDelete(courseId, lectureId) {
        if (window.confirm("Are you sure you want to delete the lecture?")) {
            await dispatch(deleteCourseLecture({ courseId, lectureId }));
            await dispatch(getCourseLectures(courseId));
        }
    }

    // ✅ Fetch Lectures and Progress on load
    useEffect(() => {
        if (!state) {
            navigate("/courses");
            return;
        }
        dispatch(getCourseLectures(state._id));
        loadProgress();
    }, []);

    // ✅ Current Lecture
    const currentLecture = lectures && lectures[currentVideo];

    // ✅ Check if current lecture is completed
    const isCurrentCompleted = currentLecture &&
        completedLectures.includes(currentLecture._id?.toString());

    return (
        <HomeLayout>
            <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-[5%]">

                <div className="text-center text-2xl font-semibold text-yellow-500">
                    Course Name : {state?.title}
                </div>

                {lectures && lectures.length > 0 ? (
                    <div className="flex flex-col md:flex-row justify-center gap-10 w-full">

                        {/* LEFT SIDE VIDEO PLAYER */}
                        <div className="space-y-5 md:w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">

                            {currentLecture?.youtubeUrl ? (
                                <iframe
                                    width="100%"
                                    height="300"
                                    src={getEmbedUrl(currentLecture.youtubeUrl)}
                                    title={currentLecture?.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-tl-lg rounded-tr-lg"
                                />
                            ) : (
                                <video
                                    src={currentLecture?.lecture?.secure_url}
                                    className="object-fill rounded-tl-lg rounded-tr-lg max-h-96 w-full"
                                    controls
                                    disablePictureInPicture
                                    muted
                                    controlsList="nodownload"
                                />
                            )}

                            <div>
                                <h1 className="text-xl font-semibold">
                                    <span className="text-yellow-500">Title :</span>{" "}
                                    {currentLecture?.title}
                                </h1>
                                <p className="mt-2">
                                    <span className="text-yellow-500">Description :</span>{" "}
                                    {currentLecture?.description}
                                </p>
                            </div>

                            {/* ✅ Complete Lecture Button */}
                            {isCurrentCompleted ? (
                                <button
                                    disabled
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        background: "#16a34a",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                        cursor: "not-allowed"
                                    }}
                                >
                                    ✅ Lecture Completed
                                </button>
                            ) : (
                                <button
                                    onClick={handleCompleteLecture}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        background: "#22c55e",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                        cursor: "pointer"
                                    }}
                                >
                                    ✔ Mark as Complete
                                </button>
                            )}
                        </div>

                        {/* RIGHT SIDE LECTURE LIST */}
                        <div className="md:w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">

                            <div className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                                <p>Lectures List</p>
                                {role === "ADMIN" && (
                                    <button
                                        onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                                        className="btn btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                                    >
                                        Add New Lecture
                                    </button>
                                )}
                            </div>

                            {/* ✅ Progress Bar */}
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${lectures.length > 0
                                            ? (completedLectures.length / lectures.length) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                            <p className="text-sm text-gray-400 text-center">
                                {completedLectures.length} / {lectures.length} lectures completed
                            </p>

                            <ul className="space-y-4 overflow-y-auto max-h-[18rem]">
                                {lectures.map((lecture, idx) => (
                                    <li className="flex justify-between items-center" key={lecture._id}>
                                        <p
                                            className="cursor-pointer hover:text-yellow-400 flex items-center gap-2"
                                            onClick={() => setCurrentVideo(idx)}
                                        >
                                            {completedLectures.includes(lecture._id?.toString()) ? (
                                                <AiFillCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                                            ) : (
                                                <span className="w-4 h-4 rounded-full border border-gray-500 flex-shrink-0 inline-block" />
                                            )}
                                            <span>Lecture {idx + 1} : {lecture?.title}</span>
                                        </p>
                                        {role === "ADMIN" && (
                                            <button
                                                onClick={() => onLectureDelete(state?._id, lecture?._id)}
                                                className="text-2xl"
                                            >
                                                <MdAutoDelete />
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {/* ✅ Get Certificate Button */}
                            <button
                                onClick={handleGetCertificate}
                                style={{
                                    width: "100%",
                                    marginTop: "16px",
                                    padding: "12px",
                                    background: allCompleted ? "#d4a843" : "#4b5563",
                                    color: allCompleted ? "#1a2744" : "#9ca3af",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "700",
                                    cursor: allCompleted ? "pointer" : "not-allowed",
                                    fontSize: "14px",
                                    transition: "all 0.3s"
                                }}
                            >
                                {allCompleted
                                    ? "🎓 Get Certificate"
                                    : `🔒 Complete all ${lectures.length} lectures to unlock`}
                            </button>

                        </div>
                    </div>

                ) : (
                    role === "ADMIN" && (
                        <button
                            onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                            className="btn btn-primary px-4 py-2 rounded-md font-semibold text-lg"
                        >
                            Add New Lecture
                        </button>
                    )
                )}
            </div>
        </HomeLayout>
    );
}

export default Displaylectures;
