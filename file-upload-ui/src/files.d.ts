export type FileData = {
    status: "toupload" | "uploading" | "uploaded" | "error";
    progress: number;
    file: File;
};
