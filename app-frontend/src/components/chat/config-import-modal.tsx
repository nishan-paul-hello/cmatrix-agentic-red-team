import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle, Key } from "lucide-react";
import { llmService, type ImportResult } from "@/lib/api/llm";

interface ConfigImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function ConfigImportModal({ isOpen, onClose, onImportSuccess }: ConfigImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setError("Please select a valid JSON file");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setError(null);

    try {
      const result = await llmService.importConfig(selectedFile);
      setImportResult(result);
      onImportSuccess();
    } catch (err: unknown) {
      console.error("Import error:", err);
      const message = err instanceof Error ? err.message : "Failed to import configuration";
      setError(message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    setError(null);
    onClose();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setError("Please select a valid JSON file");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setImportResult(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card cyber-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="terminal-text text-xl">Import LLM Configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          {!importResult && (
            <div
              className="border-border hover:border-primary/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-4">
                <Upload className="text-muted-foreground h-12 w-12" />
                <div>
                  <p className="text-lg font-medium">
                    {selectedFile ? selectedFile.name : "Drop your JSON config file here"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">or click to browse files</p>
                </div>
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-sky-500">
                    <FileText className="h-4 w-4" />
                    <span>
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-lg border p-3">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 text-sky-700 dark:text-sky-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">{importResult.message}</span>
              </div>

              {importResult.default_provider_set && (
                <div className="text-muted-foreground text-sm">
                  ✓ Default provider has been activated
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Imported Configurations:</h4>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {importResult.imported_configs.map((config, index) => (
                    <div
                      key={index}
                      className="bg-secondary/50 flex items-center justify-between rounded p-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{config.provider}</span>
                        <span className="text-muted-foreground">({config.model})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {config.has_api_key && <Key className="h-3 w-3 text-sky-500" />}
                        {config.activated && <CheckCircle2 className="h-3 w-3 text-sky-500" />}
                        <span className="text-muted-foreground text-xs">
                          {config.has_api_key ? "Key set" : "No key"}
                          {config.activated ? " • Active" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            {!importResult ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!selectedFile || isImporting}>
                  {isImporting ? "Importing..." : "Import Configuration"}
                </Button>
              </>
            ) : (
              <Button onClick={handleClose}>Close</Button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-muted-foreground border-t pt-4 text-sm">
            <p className="mb-2 font-medium">Expected JSON format:</p>
            <pre className="bg-secondary/50 overflow-x-auto rounded p-3 text-xs">
              {`{
  "default_provider": "gemini",
  "providers": {
    "gemini": {
      "enabled": true,
      "model": "gemini-2.5-pro",
      "api_keys": ["key1", "key2", "key3"]
    },
    "openrouter": {
      "enabled": false,
      "model": "x-ai/grok-4-fast:free",
      "api_key": "sk-or-v1-..."
    }
  }
}`}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
