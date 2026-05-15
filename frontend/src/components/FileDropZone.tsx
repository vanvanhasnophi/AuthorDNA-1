import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { validateFiles } from "@/lib/file-validation";
import { useFileStore } from "@/stores/use-file-store";

export default function FileDropZone() {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addFiles = useFileStore((s) => s.addFiles);

  const handleFiles = (fileList: FileList | File[]) => {
    const files = fileList instanceof FileList ? Array.from(fileList) : fileList;
    setError(null);

    const currentCount = useFileStore.getState().files.length;
    const result = validateFiles(files, currentCount);

    if (result.errors.length > 0) {
      setError(result.errors[0].reason);
    }

    if (result.valid.length > 0) {
      addFiles(result.valid);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 transition-colors",
          dragging
            ? "border-brand bg-brand-muted/20"
            : "border-border hover:border-brand/60",
        ].join(" ")}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-muted/30 text-brand">
          <Upload className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="font-serif text-base text-ink">Drag & drop files here</p>
          <p className="mt-1 text-sm text-ink-muted">or click to browse</p>
        </div>
        <p className="text-xs text-ink-muted/70">
          Supported: .doc, .docx, .pdf &middot; Max 10 files
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".doc,.docx,.pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {error && (
        <div className="rounded-lg border border-border bg-paper/60 px-4 py-2.5 text-sm text-ink-muted">
          {error}
        </div>
      )}
    </div>
  );
}
