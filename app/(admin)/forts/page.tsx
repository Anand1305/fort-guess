"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Fort = {
  id: string;
  name: string;
  location: string;
  description: string;
  image_url: string;
  hints: string[];
  is_active: boolean;
};

const emptyForm = {
  id: "",
  name: "",
  location: "",
  description: "",
  image_url: "",
  hints: [""],
};

export default function AdminFortsPage() {
  const [forts, setForts] = useState<Fort[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /* ---------------- LOAD FORTS ---------------- */

  const loadForts = async () => {
    const res = await fetch("/api/forts");
    const data = await res.json();
    if (data.success) setForts(data.data);
  };

  useEffect(() => {
    loadForts();
  }, []);

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

      setForm((prev: any) => ({
        ...prev,
        image_url: data.image_url,
      }));
    } catch (err: any) {
      setMessage(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- AI GENERATE ---------------- */

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

    setForm((prev: any) => ({
      ...prev,
      name: s.name,
      location: s.location,
      description: s.description,
      hints: s.hints,
    }));
  };

  /* ---------------- HINT HELPERS ---------------- */

  const updateHint = (i: number, v: string) => {
    const h = [...form.hints];
    h[i] = v;
    setForm({ ...form, hints: h });
  };

  const addHint = () => setForm({ ...form, hints: [...form.hints, ""] });

  /* ---------------- CREATE / UPDATE ---------------- */

  const submitFort = async () => {
    setLoading(true);
    setMessage(null);

    const payload = {
      ...form,
      hints: form.hints.filter((h: string) => h.trim()),
    };

    const res = await fetch("/api/forts", {
      method: editing ? "PATCH" : "POST", // ✅ Use PATCH for editing
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setMessage(data.message || "Operation failed");
      return;
    }

    setMessage(editing ? "Fort updated" : "Fort created");
    setForm(emptyForm);
    setEditing(false);
    loadForts();
  };

  /* ---------------- EDIT ---------------- */

  const startEdit = (fort: Fort) => {
    setForm(fort);
    setEditing(true);
    setMessage(null);
  };

  /* ---------------- DISABLE FORT (FIXED) ---------------- */

  const disableFort = async (id: string) => {
    if (!confirm("Disable this fort?")) return;

    setLoading(true);

    const res = await fetch("/api/forts", {
      method: "PUT", // ✅ Changed from DELETE to PUT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: false }), // ✅ Set is_active to false
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setMessage("Failed to disable fort");
      return;
    }

    setMessage("Fort disabled");
    loadForts();
  };

  /* ---------------- ACTIVATE FORT (FIXED) ---------------- */

  const activateFort = async (id: string) => {
    setLoading(true);

    const res = await fetch("/api/forts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: true }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setMessage("Failed to activate fort");
      return;
    }

    setMessage("Fort activated");
    loadForts();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Fort" : "Create Fort"}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Fort name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
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
                alt="preview"
                className="rounded-md max-h-48"
              />
            )}
          </div>

          {/* HINTS */}
          <div className="space-y-2">
            {form.hints.map((h: string, i: number) => (
              <Input
                key={i}
                placeholder={`Hint ${i + 1}`}
                value={h}
                onChange={(e) => updateHint(i, e.target.value)}
              />
            ))}
            <Button variant="outline" onClick={addHint}>
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

          <Button
            onClick={submitFort}
            disabled={
              loading ||
              uploading ||
              !form.image_url ||
              form.description.length < 10
            }
          >
            {loading
              ? "Processing..."
              : editing
              ? "Update Fort"
              : "Create Fort"}
          </Button>

          {editing && (
            <Button
              variant="secondary"
              onClick={() => {
                setForm(emptyForm);
                setEditing(false);
              }}
            >
              Cancel Edit
            </Button>
          )}

          {message && (
            <p className="text-sm text-center font-medium">{message}</p>
          )}
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Forts</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {forts.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.location}</TableCell>
                  <TableCell>
                    <Badge variant={f.is_active ? "default" : "secondary"}>
                      {f.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(f)}
                      disabled={loading}
                    >
                      Edit
                    </Button>

                    {f.is_active ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => disableFort(f.id)}
                        disabled={loading}
                      >
                        Disable
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => activateFort(f.id)}
                        disabled={loading}
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
