"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionNotes } from "@/hooks/use-session-notes";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, Save, Download, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface NotesEditorProps {
  clientId: string;
  sessionId: string;
}

export function NotesEditor({ clientId, sessionId }: NotesEditorProps) {
  const router = useRouter();
  const [editorValue, setEditorValue] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const {
    notes,
    isLoading,
    isError,
    generateNotes,
    updateNotes,
    isGenerating,
    isUpdating,
  } = useSessionNotes(clientId, sessionId);

  // Set editor value when notes are loaded
  useEffect(() => {
    if (notes && notes.content) {
      setEditorValue(notes.content);
    }
  }, [notes]);

  // Handle generate notes
  const handleGenerate = async () => {
    try {
      await generateNotes();
    } catch (error) {
      console.error("Failed to generate notes:", error);
    }
  };

  // Handle save notes
  const handleSave = async () => {
    try {
      await updateNotes({ content: editorValue });
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  // Handle download notes as markdown
  const handleDownload = () => {
    const blob = new Blob([editorValue], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `session-notes-${sessionId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center min-h-[500px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Session Notes</span>
          <div className="flex gap-2">
            {!notes && (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="secondary"
              >
                {isGenerating && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isGenerating ? "Generating..." : "Generate Notes"}
              </Button>
            )}
            {notes && (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="outline"
                size="icon"
                title="Regenerate Notes"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={handleDownload}
              disabled={!editorValue}
              variant="outline"
              size="icon"
              title="Download Notes"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating || !editorValue}
              variant="default"
            >
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Save Notes
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notes || editorValue ? (
          <div className="w-full">
            <div className="flex mb-4 border-b">
              <button
                className={`px-4 py-2 ${activeTab === "edit" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("edit")}
              >
                Edit
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "preview" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("preview")}
              >
                Preview
              </button>
            </div>

            {activeTab === "edit" ? (
              <Textarea
                className="min-h-[500px] font-mono text-sm"
                value={editorValue}
                onChange={(e) => setEditorValue(e.target.value)}
                placeholder="Write or generate notes..."
              />
            ) : (
              <div className="prose max-w-none min-h-[500px] p-4 border rounded-md">
                <ReactMarkdown>{editorValue}</ReactMarkdown>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8">
            <h3 className="text-lg font-medium mb-2">No Notes Yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate notes based on the session data or create your own.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-2"
            >
              {isGenerating && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Generate Notes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
