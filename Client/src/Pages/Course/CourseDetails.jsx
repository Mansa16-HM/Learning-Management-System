import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function CourseDetails() {
    const { state } = useLocation();
    const course = state;

    const [currentLecture, setCurrentLecture] = useState(
        course?.lectures?.[0]
    );

    // ✅ Debug log - check what data we have
    useEffect(() => {
        console.log("=== COURSE DATA ===", course);
        console.log("=== LECTURES ===", course?.lectures);
        console.log("=== CURRENT LECTURE ===", currentLecture);
    }, []);

    useEffect(() => {
        console.log("=== LECTURE CHANGED ===", currentLecture);
        console.log("=== YOUTUBE URL ===", currentLecture?.youtubeUrl);
    }, [currentLecture]);

    // ✅ Properly convert any YouTube URL to embed URL
    function getEmbedUrl(url) {
        if (!url) return "";
        const match = url.match(/[?&]v=([^&]+)/);
        if (match) return `https://www.youtube.com/embed/${match[1]}`;
        const shortMatch = url.match(/youtu\.be\/([^?]+)/);
        if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
        return url;
    }

    return (
        <div className="flex min-h-screen text-white">

            {/* LEFT SIDE - LECTURES LIST */}
            <div className="w-1/3 border-r p-3">
                <h2 className="text-xl mb-3">{course?.title}</h2>

                {course?.lectures?.map((lec, index) => (
                    <div
                        key={index}
                        className="cursor-pointer p-2 border-b hover:bg-gray-800"
                        onClick={() => {
                            console.log("Clicked lecture:", lec);
                            setCurrentLecture(lec);
                        }}
                    >
                        {lec.title}
                    </div>
                ))}
            </div>

            {/* RIGHT SIDE - VIDEO PLAYER */}
            <div className="w-2/3 p-5">

                <h2 className="text-xl mb-2">
                    {currentLecture?.title}
                </h2>

                <p className="mb-4">
                    {currentLecture?.description}
                </p>

                {/* ✅ Debug - shows YouTube URL on screen */}
                <p className="text-xs text-gray-500 mb-2">
                    YouTube URL: {currentLecture?.youtubeUrl || "none"}
                </p>

                {/* ✅ VIDEO PLAYER - YouTube or uploaded video */}
                {currentLecture?.youtubeUrl ? (
                    <iframe
                        width="100%"
                        height="450"
                        src={getEmbedUrl(currentLecture.youtubeUrl)}
                        title={currentLecture.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : currentLecture?.lecture?.secure_url ? (
                    <video
                        width="100%"
                        controls
                        src={currentLecture.lecture.secure_url}
                    />
                ) : (
                    <p className="text-gray-400">No video available for this lecture.</p>
                )}
            </div>
        </div>
    );
}

export default CourseDetails;