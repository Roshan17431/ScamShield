import { ChangeEvent, DragEvent, KeyboardEvent, useRef } from "react";
import { Image, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { ACCEPTED_IMAGE_EXTENSIONS, formatFileSize } from "../utils/fileValidation";

interface UploadCardProps {
  file: File | null;
  previewUrl: string;
  error: string;
  isExtracting: boolean;
  disabled: boolean;
  onSelectFile: (file: File) => boolean;
  onRemoveImage: () => void;
  onExtractText: () => void;
}

export default function UploadCard({
  file,
  previewUrl,
  error,
  isExtracting,
  disabled,
  onSelectFile,
  onRemoveImage,
  onExtractText
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    if (disabled) {
      return;
    }
    inputRef.current?.click();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onSelectFile(selectedFile);
    }
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) {
      return;
    }
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      onSelectFile(droppedFile);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  return (
    <section id="upload" className="glass-card p-5 sm:p-6" aria-labelledby="upload-title">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">Screenshot Upload</p>
          <h2 id="upload-title" className="text-2xl font-semibold text-[color:var(--text)]">
            Extract image text
          </h2>
        </div>
        <span className="panel-icon" aria-hidden="true">
          <Upload size={21} />
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPTED_IMAGE_EXTENSIONS}
        onChange={handleInputChange}
        aria-label="Upload screenshot"
        disabled={disabled}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={`drop-zone focus-ring ${disabled ? "pointer-events-none opacity-60" : ""}`}
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        onKeyDown={handleKeyDown}
        aria-label="Drag and drop screenshot or browse files"
        aria-disabled={disabled}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected screenshot preview" className="h-full w-full object-contain" />
        ) : (
          <div className="flex max-w-sm flex-col items-center text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[color:var(--surface-soft)] text-[color:var(--accent)]">
              <Image size={26} aria-hidden="true" />
            </span>
            <span className="text-base font-semibold text-[color:var(--text)]">Drop screenshot here</span>
            <span className="mt-2 text-sm leading-6 text-[color:var(--muted)]">PNG, JPG, or JPEG up to 10 MB</span>
          </div>
        )}
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-[color:var(--danger)]">{error}</p> : null}

      {file ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[color:var(--muted)]">
          <span className="min-w-0 truncate">{file.name}</span>
          <span>{formatFileSize(file.size)}</span>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="secondary-button w-full sm:w-auto" onClick={openFilePicker} disabled={disabled}>
          <RefreshCw size={17} aria-hidden="true" />
          {file ? "Replace Image" : "Browse Image"}
        </button>
        {file ? (
          <button type="button" className="ghost-button w-full sm:w-auto" onClick={onRemoveImage} disabled={disabled}>
            <Trash2 size={17} aria-hidden="true" />
            Remove Image
          </button>
        ) : null}
        <button
          type="button"
          className="primary-button w-full sm:ml-auto sm:w-auto"
          disabled={!file || isExtracting || disabled}
          onClick={onExtractText}
        >
          {isExtracting ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Upload size={17} aria-hidden="true" />}
          {isExtracting ? "Extracting" : "Extract Text"}
        </button>
      </div>
    </section>
  );
}
