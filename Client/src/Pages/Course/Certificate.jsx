import { useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function Certificate() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { data } = useSelector((state) => state.auth);
    const certificateRef = useRef();

    const course = state;
    const studentName = data?.fullName || "Student";
    const courseName = course?.title || "Course";
    const instructorName = course?.createdBy || "Instructor";
    const completionDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    function handlePrint() {
        const printStyle = `
            <style>
                @page { size: A4 landscape; margin: 8mm; }
                body { margin: 0; background: #f8f4ed; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                .no-print { display: none !important; }
            </style>
        `;
        const printContent = certificateRef.current.outerHTML;
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printStyle + printContent;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload();
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#111827",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
        }}>

            {/* Action Buttons */}
            <div className="no-print" style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: "10px 20px",
                        background: "#374151",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px"
                    }}
                >
                    ← Go Back
                </button>
                <button
                    onClick={handlePrint}
                    style={{
                        padding: "10px 24px",
                        background: "#d4a843",
                        color: "#1a2744",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "14px"
                    }}
                >
                    ⬇ Download Certificate
                </button>
            </div>

            {/* Certificate */}
            <div ref={certificateRef} style={{
                background: "#f8f4ed",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%"
            }}>
                <div style={{
                    background: "#fff",
                    width: "100%",
                    maxWidth: "800px",
                    border: "1px solid #d4a843",
                    position: "relative",
                    fontFamily: "Georgia, serif"
                }}>

                    {/* Inner border */}
                    <div style={{
                        position: "absolute",
                        inset: "8px",
                        border: "1px solid #d4a843",
                        pointerEvents: "none",
                        zIndex: 1
                    }} />

                    {/* Top Navy Banner */}
                    <div style={{
                        background: "#1a2744",
                        padding: "20px 40px",
                        textAlign: "center"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                            <div style={{
                                width: "44px", height: "44px",
                                borderRadius: "50%",
                                background: "#d4a843",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth="2">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                                </svg>
                            </div>
                            <div>
                                <div style={{ color: "#d4a843", fontSize: "20px", fontWeight: "bold", letterSpacing: "4px", fontFamily: "Arial, sans-serif" }}>
                                    LMS USING MERN
                                </div>
                                <div style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" }}>
                                    LEARNING MANAGEMENT SYSTEM
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ padding: "36px 48px", textAlign: "center" }}>

                        {/* Title */}
                        <div style={{ marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", letterSpacing: "5px", color: "#888", fontFamily: "Arial, sans-serif" }}>
                                CERTIFICATE OF
                            </span>
                        </div>
                        <h1 style={{ fontSize: "42px", color: "#1a2744", margin: "0 0 6px", letterSpacing: "1px", fontWeight: "normal" }}>
                            Completion
                        </h1>

                        {/* Gold divider with diamond */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "12px 0 24px" }}>
                            <div style={{ height: "1px", background: "#d4a843", width: "80px" }} />
                            <div style={{ width: "8px", height: "8px", background: "#d4a843", transform: "rotate(45deg)" }} />
                            <div style={{ height: "1px", background: "#d4a843", width: "80px" }} />
                        </div>

                        <p style={{ color: "#666", fontSize: "12px", letterSpacing: "2px", marginBottom: "16px", fontFamily: "Arial, sans-serif" }}>
                            THIS IS TO CERTIFY THAT
                        </p>

                        {/* Student Name */}
                        <div style={{ marginBottom: "20px" }}>
                            <span style={{
                                fontSize: "42px",
                                color: "#1a2744",
                                fontStyle: "italic",
                                borderBottom: "2px solid #d4a843",
                                paddingBottom: "4px"
                            }}>
                                {studentName}
                            </span>
                        </div>

                        <p style={{ color: "#666", fontSize: "12px", letterSpacing: "2px", margin: "0 0 14px", fontFamily: "Arial, sans-serif" }}>
                            HAS SUCCESSFULLY COMPLETED THE COURSE
                        </p>

                        {/* Course Name */}
                        <div style={{
                            background: "#1a2744",
                            padding: "12px 32px",
                            display: "inline-block",
                            marginBottom: "24px",
                            borderRadius: "2px"
                        }}>
                            <span style={{ color: "#d4a843", fontSize: "24px", letterSpacing: "1px" }}>
                                {courseName}
                            </span>
                        </div>

                        {/* Course Details Row */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "24px" }}>
                            <div style={{ textAlign: "center" }}>
                                <span style={{ fontSize: "10px", color: "#888", letterSpacing: "1px", fontFamily: "Arial, sans-serif", display: "block" }}>INSTRUCTOR</span>
                                <span style={{ fontSize: "14px", color: "#1a2744", fontFamily: "Arial, sans-serif" }}>{instructorName}</span>
                            </div>
                            <div style={{ width: "1px", background: "#e0e0e0" }} />
                            <div style={{ textAlign: "center" }}>
                                <span style={{ fontSize: "10px", color: "#888", letterSpacing: "1px", fontFamily: "Arial, sans-serif", display: "block" }}>DURATION</span>
                                <span style={{ fontSize: "14px", color: "#1a2744", fontFamily: "Arial, sans-serif" }}>Self-paced</span>
                            </div>
                            <div style={{ width: "1px", background: "#e0e0e0" }} />
                            <div style={{ textAlign: "center" }}>
                                <span style={{ fontSize: "10px", color: "#888", letterSpacing: "1px", fontFamily: "Arial, sans-serif", display: "block" }}>ISSUED ON</span>
                                <span style={{ fontSize: "14px", color: "#1a2744", fontFamily: "Arial, sans-serif" }}>{completionDate}</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "#e8e8e8", margin: "8px 0 24px" }} />

                        {/* Signatures */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 20px" }}>

                            {/* Instructor Signature */}
                            <div style={{ textAlign: "center" }}>
                                <div style={{
                                    fontSize: "24px",
                                    fontStyle: "italic",
                                    color: "#1a2744",
                                    borderBottom: "1px solid #999",
                                    paddingBottom: "4px",
                                    minWidth: "160px",
                                    marginBottom: "6px"
                                }}>
                                    {instructorName}
                                </div>
                                <span style={{ fontSize: "10px", color: "#888", letterSpacing: "1px", fontFamily: "Arial, sans-serif" }}>
                                    COURSE INSTRUCTOR
                                </span>
                            </div>

                            {/* Official Seal */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                <div style={{
                                    width: "80px", height: "80px",
                                    borderRadius: "50%",
                                    border: "3px solid #d4a843",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                    background: "#fdf8f0"
                                }}>
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.5">
                                        <circle cx="12" cy="8" r="4"/>
                                        <path d="M8 8h-4l2 9h12l2-9h-4"/>
                                        <path d="M9 17v3m6-3v3"/>
                                    </svg>
                                    <span style={{ fontSize: "7px", color: "#d4a843", letterSpacing: "1px", fontFamily: "Arial, sans-serif", marginTop: "2px" }}>
                                        CERTIFIED
                                    </span>
                                </div>
                                <span style={{ fontSize: "9px", color: "#aaa", fontFamily: "Arial, sans-serif", letterSpacing: "1px" }}>
                                    OFFICIAL SEAL
                                </span>
                            </div>

                            {/* Director Signature */}
                            <div style={{ textAlign: "center" }}>
                                <div style={{
                                    fontSize: "24px",
                                    fontStyle: "italic",
                                    color: "#1a2744",
                                    borderBottom: "1px solid #999",
                                    paddingBottom: "4px",
                                    minWidth: "160px",
                                    marginBottom: "6px"
                                }}>
                                    Admin
                                </div>
                                <span style={{ fontSize: "10px", color: "#888", letterSpacing: "1px", fontFamily: "Arial, sans-serif" }}>
                                    PLATFORM DIRECTOR
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Navy Banner */}
                    <div style={{
                        background: "#1a2744",
                        padding: "10px 40px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <span style={{ color: "#94a3b8", fontSize: "10px", fontFamily: "Arial, sans-serif", letterSpacing: "1px" }}>
                            www.lmsmern.com
                        </span>
                        <span style={{ color: "#d4a843", fontSize: "10px", fontFamily: "Arial, sans-serif", letterSpacing: "2px" }}>
                            LMS USING MERN © 2026
                        </span>
                        <span style={{ color: "#94a3b8", fontSize: "10px", fontFamily: "Arial, sans-serif", letterSpacing: "1px" }}>
                            Verify at: lmsmern.com/verify
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Certificate;