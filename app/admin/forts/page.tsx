"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateFortPage() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    image_url: "",
    hints: [""],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /* ---------------- IMAGE UPLOAD ---------------- */

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setForm((prev) => ({
        ...prev,
        image_url: data.image_url,
      }));
    } catch (err: any) {
      setMessage(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- HINT HANDLERS ---------------- */

  const updateHint = (index: number, value: string) => {
    const updated = [...form.hints];
    updated[index] = value;
    setForm({ ...form, hints: updated });
  };

  const addHint = () => {
    setForm({ ...form, hints: [...form.hints, ""] });
  };

  /* ---------------- SUBMIT FORT ---------------- */

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    const payload = {
      ...form,
      hints: form.hints.filter((h) => h.trim().length > 0),
    };

    try {
      const res = await fetch("/api/forts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create fort");
      }

      setMessage("✅ Fort created successfully");

      setForm({
        name: "",
        location: "",
        description: "",
        image_url: "",
        hints: [""],
      });
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/ai/fort-suggestion", {
      method: "POST",
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setMessage("AI generation failed");
      return;
    }

    const s = data.suggested;

    setForm({
      name: s.name,
      location: s.location,
      description: s.description,
      image_url: "", // admin uploads image separately
      hints: s.hints,
    });
  };


  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Fort (Admin)</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Fort name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            placeholder="Location (e.g. Pune, Maharashtra)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <Textarea
            placeholder="Description (min 10 characters)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* IMAGE UPLOAD */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fort Image</label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />

            {uploading && (
              <p className="text-xs text-muted-foreground">Uploading image…</p>
            )}

            {form.image_url && (
              <img
                src={form.image_url}
                alt="Fort preview"
                className="rounded-md max-h-48 mt-2"
              />
            )}
          </div>

          {/* HINTS */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hints</label>

            {form.hints.map((hint, index) => (
              <Input
                key={index}
                placeholder={`Hint ${index + 1}`}
                value={hint}
                onChange={(e) => updateHint(index, e.target.value)}
              />
            ))}

            <Button type="button" variant="outline" onClick={addHint}>
              + Add Hint
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateAI}
            disabled={loading || uploading}
          >
            🤖 Generate with AI
          </Button>

          {/* SUBMIT */}
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              uploading ||
              !form.image_url ||
              form.description.length < 10
            }
            className="w-full"
          >
            {loading ? "Creating..." : "Create Fort"}
          </Button>

          {message && <p className="text-sm text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
