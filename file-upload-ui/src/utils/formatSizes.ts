export function humanFileSize(size: number): string {
    let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    //@ts-ignore
    return ((size / Math.pow(1024, i)).toFixed(2) * 1).toString() + " " + ["B", "KB", "MB", "GB", "TB"][i];
}
