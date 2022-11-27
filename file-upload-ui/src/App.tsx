import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import FileInput from "./components/FileInput/FileInput";
import FileList from "./components/FileList/FileList";
import { chunkSize, URL } from "./CONSTANTS";
import { v4 as uuidv4 } from "uuid";
import { FileData } from "./files";

function App() {
    const [files, setFiles] = React.useState<FileData[]>([]);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        const fileData = acceptedFiles.map((file: File) => {
            return {
                status: "toupload",
                progress: 0,
                file,
            } as FileData;
        });
        setFiles(fileData);
    }, []);

    const onUpload = async (data: FileData) => {
        updateFileStatus(data.file.name, "uploading");

        const file = data.file;
        const totalChunkCount = Math.floor(file.size / chunkSize) + 1;

        console.log("totalChunkCount", totalChunkCount);

        const fileID = uuidv4();
        let chunkStartIndex = 0;
        let chunkEndIndex = Math.min(chunkSize, file.size);

        for (let i = 0; i < totalChunkCount; i++) {
            await new Promise((resolve) => setTimeout(resolve, 200));

            const chunk = file.slice(chunkStartIndex, chunkEndIndex);
            chunkStartIndex = chunkEndIndex;
            chunkEndIndex = Math.min(chunkEndIndex + chunkSize, file.size);

            const response = await fetch(`${URL}/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    name: fileID,
                    chunkIndex: i.toString(),
                },
                body: chunk,
            }).catch((err) => {
                console.log("err", err);
                updateFileStatus(data.file.name, "error");
            });
            if (response && response.status === 200) {
                updateProgress(file.name, ((i + 1) / totalChunkCount) * 100);
            }
        }
        await uploadComplete(fileID, file.name);
    };

    /**
     * Send a request to the server to notify that the file upload is complete and the file can be merged
     * @param fileID Randomly generated file ID
     * @param originalName Original name of the file
     */
    const uploadComplete = async (fileID: string, originalName: string) => {
        const resp = await fetch(`${URL}/uploadComplete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileID,
                originalName,
            }),
        }).catch((err) => {
            console.log("err", err);
            updateFileStatus(originalName, "error");
        });
        if (resp && resp.status === 200) {
            updateFileStatus(originalName, "uploaded");
        }
    };

    /**
     * Update the progress of a file
     * @param fileName name of the file
     * @param progress progress of the file upload
     */
    const updateProgress = (fileName: string, progress: number) => {
        setFiles((prevFiles) => {
            const newFiles = prevFiles.map((file) => {
                if (file.file.name === fileName) {
                    return {
                        ...file,
                        progress: Math.round(progress),
                    } as FileData;
                }
                return file;
            });
            return newFiles;
        });
    };

    /**
     * Update the status of a file
     * @param fileName name of the file
     * @param status status of the file
     */
    const updateFileStatus = (fileName: string, status: string) => {
        setFiles((prevFiles) => {
            const newFiles = prevFiles.map((file) => {
                if (file.file.name === fileName) {
                    return {
                        ...file,
                        status: status,
                    } as FileData;
                }
                return file;
            });
            return newFiles;
        });
    };

    return (
        <div className="container">
            <h1 className="">Chunk Uploader</h1>
            <FileInput onDrop={onDrop} />
            <FileList files={files} onUpload={onUpload} />
        </div>
    );
}

export default App;
