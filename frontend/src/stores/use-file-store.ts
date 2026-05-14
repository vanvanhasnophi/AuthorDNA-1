import { create } from "zustand";

export type UploadedFileInfo = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: number;
};

type FileStore = {
  files: UploadedFileInfo[];
  addFiles: (newFiles: File[]) => { success: boolean; reason?: string };
  removeFile: (id: string) => void;
  clearFiles: () => void;
};

export const fileObjectMap = new Map<string, File>();

export const useFileStore = create<FileStore>()((set, get) => ({
  files: [],
  addFiles: (newFiles: File[]) => {
    const { files } = get();
    const remaining = 10 - files.length;
    if (remaining <= 0) {
      return { success: false, reason: "Maximum 10 files allowed" };
    }

    const filesToAdd = newFiles.slice(0, remaining);
    const added: UploadedFileInfo[] = [];

    for (const file of filesToAdd) {
      const id = crypto.randomUUID();
      fileObjectMap.set(id, file);
      added.push({
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: Date.now(),
      });
    }

    set({ files: [...files, ...added] });
    return { success: true };
  },
  removeFile: (id: string) => {
    fileObjectMap.delete(id);
    set((state) => ({ files: state.files.filter((f) => f.id !== id) }));
  },
  clearFiles: () => {
    fileObjectMap.clear();
    set({ files: [] });
  },
}));
