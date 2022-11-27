import { useDropzone } from "react-dropzone";
import cx from "classnames";
import { BsDownload, BsBoxArrowDown } from "react-icons/bs";
import "./styles.css";

type FileInputProps = {
    onDrop: (acceptedFiles: File[]) => void;
};

/**
 * Component to display the file input and accept files
 * @param param0 props for FileInput
 */

function FileInput({ onDrop }: FileInputProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div>
            <div {...getRootProps({ className: cx("dropzone", { drag: isDragActive }) })}>
                <input className="input-zone" {...getInputProps()} />
                <div className="text-center head">
                    {isDragActive ? <BsBoxArrowDown className="icon" /> : <BsDownload className="icon" />}
                    {isDragActive ? "Release to drop the files here" : "Drag and drop some files, or click to select files"}
                </div>
            </div>
        </div>
    );
}
export default FileInput;
