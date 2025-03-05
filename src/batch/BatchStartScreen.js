import React, { useState } from "react";
import { Link } from "react-router-dom";

const BatchStartScreen = () => {
    const [message, setMessage] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

    const startBatch1 = async () => {
        setMessage("Starting batch...");
        setIsLoading(true);
    
        try {
            const response = await fetch(`${API_URL}/batch/startbatch1`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }
          
            const result = await response.json(); // Expecting { blob: ..., fileName: ... }

            console.log(result.blob);

            const byteCharacters = atob(result.blob);
            const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });

            const fileUrl = URL.createObjectURL(blob); // Create a URL for the blob

            console.log("fileUrl:", fileUrl);

    
            setMessage(`✅ Success: Worklog File generated!`);
            setFileUrl(fileUrl); // Set file URL for downloading
        } catch (error) {
            console.error("Batch 1 Error:", error);
            setMessage("❌ Error: Unable to process batch 1.");
        } finally {
            setIsLoading(false);
        }
    };
    

    const startBatch2 = async () => {
        setMessage("Starting batch...");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/startbatch2`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.text();
            if (response.ok) {
                setMessage(`✅ Success: ${result}`);
            } else {
                throw new Error(result);
            }
        } catch (error) {
            console.error("Batch 2 Error:", error);
            setMessage("❌ Error: Unable to process batch 2.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Link to="/parametrizationoverview" style={styles.link}>
                🏠 Back to Administration Overview
            </Link>
            <h2>Start Batch Job</h2>
            <div style={styles.buttonContainer}>
                <button style={{ ...styles.button, opacity: isLoading ? 0.6 : 1 }} onClick={startBatch1} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Start Batch - Generate Worklog Report"}
                </button>
                {fileUrl && (
                    <a href={fileUrl} download="worklog_report.pdf" style={styles.downloadLink}>
                        📄 Download File
                    </a>
                )}
            </div>
            <br />
            <button style={{ ...styles.button, opacity: isLoading ? 0.6 : 1 }} onClick={startBatch2} disabled={isLoading}>
                {isLoading ? "Processing..." : "Start Batch - Generate Users List 2"}
            </button>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

// Simple styles
const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px",
    },
    link: {
        display: "inline-block",
        marginBottom: "15px",
        textDecoration: "none",
        color: "#007bff",
        fontSize: "16px",
    },
    buttonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
    },
    downloadLink: {
        marginLeft: "10px",
        color: "blue",
        textDecoration: "underline",
        cursor: "pointer",
    },
    message: {
        marginTop: "20px",
        fontWeight: "bold",
    },
};

export default BatchStartScreen;
