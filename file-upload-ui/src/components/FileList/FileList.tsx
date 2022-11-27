import { FileData } from "../../files";
import { humanFileSize } from "../../utils/formatSizes";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./styles.css";

type FileListProps = {
    files: FileData[];
    onUpload: (data: FileData) => void;
};

/**
 * Component to display the list of files and their status
 * @param param0 props for FileList
 */

function FileList({ files, onUpload }: FileListProps) {
    const fileItems = files.map((data: FileData) => (
        <li key={data.file.name} className="file-item">
            <p>
                {data.file.name} - {humanFileSize(data.file.size)}
            </p>
            {data.status === "uploading" && <ProgressBar animated now={data.progress} label={data.progress + "%"} />}
            {data.status === "toupload" && (
                <button className="btn btn-primary" title="Upload" onClick={() => onUpload(data)}>
                    Upload
                </button>
            )}
            {data.status === "uploaded" && <p className="text-center done">Uploaded</p>}
        </li>
    ));

    return (
        <div className="file-list-container">
            <ul className="file-list">{fileItems}</ul>
        </div>
    );
}

export default FileList;
