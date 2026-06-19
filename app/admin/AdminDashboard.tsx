"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  CalendarCheck,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Hotel,
  ImagePlus,
  Loader2,
  Lock,
  LogOut,
  Pencil,
  Plus,
  Save,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
  RefreshCw,
  Tag
} from "lucide-react";
import { formatCurrency } from "@/lib/data";

/* ─────────────────────────── Types ─────────────────────────── */

type HotelRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  status: string;
  price_from: number;
  amenities?: string[];
};

type RoomRow = {
  id: string;
  hotel_id: string;
  name: string;
  room_number: string | null;
  price_per_night: number;
  capacity: number;
  bed_type: string | null;
  room_size: string | null;
  description: string | null;
  status: string;
  amenities?: string[];
};

type BookingRow = {
  id: string;
  booking_reference: string;
  guest_full_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  total_amount: number;
  status: string;
  created_at: string;
  room_id?: string;
  hotel_id?: string;
};

type PaymentRow = {
  id: string;
  booking_id: string;
  gateway_reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
};

type ReviewRow = {
  id: string;
  booking_id: string;
  guest_name: string;
  hotel_name: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
};

type PartnershipRow = {
  id: string;
  name: string;
  logo_url: string;
  status: string;
  created_at: string;
};

type OfferRow = {
  id: string;
  hotel_id: string | null;
  room_id: string | null;
  title: string;
  description: string | null;
  discount_type: "percentage" | "flat";
  discount_value: number;
  valid_from: string | null;
  valid_until: string | null;
  status: string;
  created_at: string;
};

type DashboardData = {
  stats: {
    bookings: number;
    revenue: number;
    availableRooms: number;
    pendingPayments: number;
  };
  hotels: HotelRow[];
  rooms: RoomRow[];
  bookings: BookingRow[];
  payments: PaymentRow[];
  reviews: ReviewRow[];
  partnerships?: PartnershipRow[];
  offers?: OfferRow[];
};

/* ─────────────────────── Constants ──────────────────────────── */

const roomStatuses = ["available", "fully_booked", "maintenance"];
const bookingStatuses = [
  "pending_payment",
  "confirmed",
  "checked_in",
  "completed",
  "cancelled",
  "refunded"
];

const STATUS_COLORS: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-800",
  fully_booked: "bg-red-100 text-red-800",
  maintenance: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  pending_payment: "bg-amber-100 text-amber-800",
  checked_in: "bg-sky-100 text-sky-800",
  completed: "bg-stone-100 text-stone-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
  successful: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800"
};

/* ─────────────────────── API helper ─────────────────────────── */

async function apiFetch(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) }
  });

  let data: any = {};
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function downloadPDF(
  title: string,
  rows: Record<string, any>[],
  columns: { key: string; label: string; format?: (val: any, row?: any) => string }[]
) {
  if (!rows || !rows.length) return;

  const printDiv = document.createElement("div");
  printDiv.id = "printable-report";

  const printDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const tableHeader = columns
    .map(
      (col) =>
        `<th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; font-weight: 700; font-family: system-ui, -apple-system, sans-serif;">${col.label}</th>`
    )
    .join("");

  const tableRows = rows
    .map((row) => {
      return (
        `<tr style="border-bottom: 1px solid #f1f5f9;">` +
        columns
          .map((col) => {
            let val = row[col.key];
            if (col.format) {
              val = col.format(val, row);
            } else {
              if (val === null || val === undefined) val = "";
              val = String(val);
            }
            return `<td style="padding: 10px; font-size: 11px; color: #1e293b; font-family: system-ui, -apple-system, sans-serif;">${val}</td>`;
          })
          .join("") +
        `</tr>`
      );
    })
    .join("");

  printDiv.innerHTML = `
    <div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a; padding: 20px; max-width: 1000px; margin: 0 auto;">
      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 3px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
        <div>
          <h1 style="margin: 0; font-size: 22px; color: #065f46; font-weight: 800; letter-spacing: -0.5px;">ADVENTURE MIST STAY INN RWANDA</h1>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #475569; font-weight: 500; line-height: 1.5;">
            Musanze, Ruhengeri, Rwanda | Phone: +250 782 656 071 | Email: adventuremiststayinnrwanda@gmail.com
          </p>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; font-size: 16px; color: #1e293b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">${title}</h2>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #64748b;">Date Generated: ${printDate}</p>
        </div>
      </div>

      <!-- Report Details / Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f8fafc;">
            ${tableHeader}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <!-- Footer Section -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94a3b8;">
        <div>Confidential &mdash; Adventure Mist Stay Inn Rwanda &copy; ${new Date().getFullYear()}</div>
        <div>Page 1 of 1</div>
      </div>
    </div>
  `;

  document.body.appendChild(printDiv);

  setTimeout(() => {
    window.print();
    document.body.removeChild(printDiv);
  }, 100);
}


/* ────────────────── Reusable Badge component ────────────────── */

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] || "bg-stone-100 text-stone-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

/* ─────────────────── Image Compressor ────────────────────────── */

function compressImage(file: File, maxWidth = 1200, maxHeight = 900, quality = 0.75): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/* ──────────────────── Edit Room Modal ──────────────────────── */

type EditRoomModalProps = {
  room: RoomRow;
  onClose: () => void;
  onSaved: () => void;
};

function EditRoomModal({ room, onClose, onSaved }: EditRoomModalProps) {
  const [form, setForm] = useState({
    name: room.name,
    room_number: room.room_number || "",
    description: room.description || "",
    price_per_night: String(room.price_per_night),
    capacity: String(room.capacity),
    bed_type: room.bed_type || "",
    room_size: room.room_size || "",
    status: room.status,
    amenities: room.amenities || [] as string[],
    imageFiles: [] as File[]
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const compressedImages = await Promise.all(
        form.imageFiles.map(file => compressImage(file))
      );
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "imageFiles") {
          compressedImages.forEach(file => formData.append("images", file));
        } else if (key === "amenities") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      formData.append("id", room.id);

      const response = await fetch("/api/admin/rooms", {
        method: "PATCH",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
              <Pencil size={16} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500">Editing</p>
              <h3 className="font-bold text-stone-900">{room.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={save} className="p-6 overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Room Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Room Number</label>
              <input
                value={form.room_number}
                onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. 101"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Price per night (USD)</label>
              <input
                required
                type="number"
                min="1"
                value={form.price_per_night}
                onChange={(e) => setForm({ ...form, price_per_night: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Capacity (guests)</label>
              <input
                required
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Bed Type</label>
              <input
                value={form.bed_type}
                onChange={(e) => setForm({ ...form, bed_type: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. King bed"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Room Size</label>
              <input
                value={form.room_size}
                onChange={(e) => setForm({ ...form, room_size: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. 36 sqm"
              />
            </div>
            <div className="col-span-2 grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="col-span-2 grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              >
                {roomStatuses.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Upload New Images (Replacing existing)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setForm({ ...form, imageFiles: Array.from(e.target.files || []) })}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none file:mr-4 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {form.imageFiles.length > 0 && (
                <p className="text-xs text-stone-500 mt-1">{form.imageFiles.length} files selected.</p>
              )}
            </div>
            <div className="col-span-2">
              <AmenitiesSelector selected={form.amenities} onChange={(a) => setForm({ ...form, amenities: a })} />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:bg-stone-300"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ──────────────── Delete Confirm Modal ─────────────────────── */

type DeleteRoomModalProps = {
  room: RoomRow;
  onClose: () => void;
  onDeleted: () => void;
};

function DeleteRoomModal({ room, onClose, onDeleted }: DeleteRoomModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setDeleting(true);
    setError("");
    try {
      await apiFetch("/api/admin/rooms", {
        method: "DELETE",
        body: JSON.stringify({ id: room.id })
      });
      onDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Trash2 size={22} className="text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-stone-900">Delete Room</h3>
          <p className="mt-2 text-sm text-stone-600">
            Are you sure you want to delete <span className="font-semibold">{room.name}</span>?
            This action cannot be undone and will remove all associated data.
          </p>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-stone-300"
            >
              {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              {deleting ? "Deleting…" : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── Edit Hotel Modal ─────────────────────── */

type EditHotelModalProps = {
  hotel: HotelRow;
  onClose: () => void;
  onSaved: () => void;
};

function EditHotelModal({ hotel, onClose, onSaved }: EditHotelModalProps) {
  const [form, setForm] = useState({
    name: hotel.name,
    city: hotel.city,
    country: hotel.country,
    price_from: String(hotel.price_from),
    status: hotel.status,
    amenities: hotel.amenities || [] as string[],
    imageFiles: [] as File[]
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const compressedImages = await Promise.all(
        form.imageFiles.map(file => compressImage(file))
      );
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "imageFiles") {
          compressedImages.forEach(file => formData.append("images", file));
        } else if (key === "amenities") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      formData.append("id", hotel.id);

      const response = await fetch("/api/admin/hotels", {
        method: "PATCH",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
              <Pencil size={16} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500">Editing</p>
              <h3 className="font-bold text-stone-900">{hotel.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={save} className="p-6 overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5 col-span-2">
              <label className="text-xs font-semibold text-stone-600">Hotel Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">City</label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Country</label>
              <input
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Price From (USD)</label>
              <input
                required
                type="number"
                min="1"
                value={form.price_from}
                onChange={(e) => setForm({ ...form, price_from: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-span-2 grid gap-1.5">
              <label className="text-xs font-semibold text-stone-600">Upload New Images (Replacing existing)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setForm({ ...form, imageFiles: Array.from(e.target.files || []) })}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none file:mr-4 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {form.imageFiles.length > 0 && (
                <p className="text-xs text-stone-500 mt-1">{form.imageFiles.length} files selected.</p>
              )}
            </div>
            <div className="col-span-2">
              <AmenitiesSelector selected={form.amenities} onChange={(a) => setForm({ ...form, amenities: a })} />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:bg-stone-300"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────── Amenities Selector ──────────────────────── */

function AmenitiesSelector({ selected, onChange }: { selected: string[], onChange: (a: string[]) => void }) {
  const [newAmenity, setNewAmenity] = useState("");
  const predefined = ["WiFi", "Pool", "Parking", "Gym", "Restaurant", "Air conditioning", "TV", "Breakfast", "Coffee", "Security", "Mountain views"];
  
  const allAmenities = Array.from(new Set([...predefined, ...selected]));

  const toggle = (amenity: string) => {
    if (selected.includes(amenity)) onChange(selected.filter(a => a !== amenity));
    else onChange([...selected, amenity]);
  };

  const addCustom = () => {
    const trimmed = newAmenity.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setNewAmenity("");
    }
  };

  return (
    <div className="grid gap-2">
      <label className="text-xs font-semibold text-stone-600">Amenities (Free Things)</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {allAmenities.map(amenity => {
          const isSelected = selected.includes(amenity);
          return (
            <button
              key={amenity}
              type="button"
              onClick={() => toggle(amenity)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition border ${isSelected ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"}`}
            >
              {amenity}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input 
          value={newAmenity}
          onChange={(e) => setNewAmenity(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          placeholder="Type new amenity..."
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none flex-1"
        />
        <button type="button" onClick={addCustom} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800">
          Add
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── Main Dashboard ────────────────────────── */

export function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<"hotels" | "rooms" | "offers" | "bookings" | "payments" | "reviews" | "partnerships">("rooms");
  const [bookingFilter, setBookingFilter] = useState<"all" | "successful" | "pending">("all");
  const [editingRoom, setEditingRoom] = useState<RoomRow | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<RoomRow | null>(null);
  const [editingHotel, setEditingHotel] = useState<HotelRow | null>(null);
  const [deletingHotel, setDeletingHotel] = useState<HotelRow | null>(null);
  const [editingOffer, setEditingOffer] = useState<OfferRow | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<OfferRow | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showAddOffer, setShowAddOffer] = useState(false);

  const [offerForm, setOfferForm] = useState({
    hotel_id: "",
    room_id: "",
    title: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    valid_from: "",
    valid_until: "",
    status: "active"
  });

  const [hotelForm, setHotelForm] = useState({
    name: "Adventure Mist Stay Inn Rwanda",
    city: "Kigali",
    country: "Rwanda",
    price_from: "65",
    status: "active",
    imageFiles: [] as File[],
    amenities: [] as string[]
  });

  const [roomForm, setRoomForm] = useState({
    hotel_id: "",
    name: "",
    room_number: "",
    price_per_night: "65",
    capacity: "2",
    bed_type: "",
    room_size: "",
    description: "",
    status: "available",
    imageFiles: [] as File[],
    amenities: [] as string[]
  });

  const [partnerForm, setPartnerForm] = useState({
    name: "",
    logo_url: "",
    status: "active"
  });

  const hotelById = useMemo(
    () => new Map((data?.hotels || []).map((h) => [h.id, h])),
    [data?.hotels]
  );

  const filteredBookings = useMemo(() => {
    return (data?.bookings || []).filter(b => {
      if (bookingFilter === "all") return true;
      if (bookingFilter === "successful") return ["confirmed", "checked_in", "completed"].includes(b.status);
      if (bookingFilter === "pending") return ["pending_payment", "cancelled", "refunded"].includes(b.status);
      return true;
    });
  }, [data?.bookings, bookingFilter]);

  async function loadDashboard() {
    setError("");
    const dashboard = (await apiFetch("/api/admin/dashboard")) as DashboardData;
    setData(dashboard);
    setRoomForm((c) => ({
      ...c,
      hotel_id: c.hotel_id || dashboard.hotels[0]?.id || ""
    }));
  }

  useEffect(() => {
    async function boot() {
      try {
        const session = await apiFetch("/api/admin/session");
        setAuthenticated(session.authenticated);
        if (session.authenticated) await loadDashboard();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load session.");
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving("login");
    setError("");
    try {
      await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setAuthenticated(true);
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSaving("");
    }
  }

  async function logout() {
    await apiFetch("/api/admin/logout", { method: "POST", body: "{}" });
    setAuthenticated(false);
    setData(null);
    setPassword("");
  }

  async function addHotel(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hotelForm.imageFiles.length < 1) {
      setError("Please provide at least 1 image for the hotel.");
      return;
    }
    setSaving("hotel");
    setError("");
    try {
      const compressedImages = await Promise.all(
        hotelForm.imageFiles.map(file => compressImage(file))
      );
      const formData = new FormData();
      Object.entries(hotelForm).forEach(([key, value]) => {
        if (key === "imageFiles") {
          compressedImages.forEach(file => formData.append("images", file));
        } else if (key === "amenities") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await fetch("/api/admin/hotels", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");

      await loadDashboard();
      setShowAddHotel(false);
      setHotelForm({
        name: "Adventure Mist Stay Inn Rwanda",
        city: "Kigali",
        country: "Rwanda",
        price_from: "65",
        status: "active",
        imageFiles: [],
        amenities: []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add hotel.");
    } finally {
      setSaving("");
    }
  }

  async function addRoom(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (roomForm.imageFiles.length < 2) {
      setError("Please provide at least 2 images for the room.");
      return;
    }
    setSaving("room");
    setError("");
    try {
      const compressedImages = await Promise.all(
        roomForm.imageFiles.map(file => compressImage(file))
      );
      const formData = new FormData();
      Object.entries(roomForm).forEach(([key, value]) => {
        if (key === "imageFiles") {
          compressedImages.forEach(file => formData.append("images", file));
        } else if (key === "amenities") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");

      setRoomForm((c) => ({ ...c, name: "", room_number: "", description: "", imageFiles: [], amenities: [] }));
      await loadDashboard();
      setShowAddRoom(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add room.");
    } finally {
      setSaving("");
    }
  }

  async function addPartner(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving("partner");
    setError("");
    try {
      await apiFetch("/api/admin/partnerships", {
        method: "POST",
        body: JSON.stringify(partnerForm)
      });
      setPartnerForm({ name: "", logo_url: "", status: "active" });
      await loadDashboard();
      setShowAddPartner(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add partnership.");
    } finally {
      setSaving("");
    }
  }

  async function deleteHotel(hotel: HotelRow) {
    if (!confirm(`Delete hotel "${hotel.name}"? This cannot be undone.`)) return;
    setSaving("delhotel_" + hotel.id);
    try {
      await apiFetch("/api/admin/hotels", {
        method: "DELETE",
        body: JSON.stringify({ id: hotel.id })
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete hotel.");
    } finally {
      setSaving("");
    }
  }

  async function handleToggleRoomStatus(roomId: string, currentStatus: string) {
    setSaving(roomId);
    let nextStatus = "available";
    if (currentStatus === "available") nextStatus = "fully_booked";
    else if (currentStatus === "fully_booked") nextStatus = "maintenance";

    try {
      await apiFetch("/api/admin/rooms", {
        method: "PATCH",
        body: JSON.stringify({ id: roomId, status: nextStatus })
      });
      await loadDashboard();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to toggle room status.");
    } finally {
      setSaving("");
    }
  }

  async function submitOffer(e: FormEvent) {
    e.preventDefault();
    setSaving("offer");
    try {
      const body = {
        hotel_id: offerForm.hotel_id || null,
        room_id: offerForm.room_id || null,
        title: offerForm.title,
        description: offerForm.description || null,
        discount_type: offerForm.discount_type,
        discount_value: Number(offerForm.discount_value),
        valid_from: offerForm.valid_from ? new Date(offerForm.valid_from).toISOString() : null,
        valid_until: offerForm.valid_until ? new Date(offerForm.valid_until).toISOString() : null,
        status: offerForm.status
      };

      if (editingOffer) {
        await apiFetch("/api/admin/offers", {
          method: "PATCH",
          body: JSON.stringify({ id: editingOffer.id, ...body })
        });
        setEditingOffer(null);
      } else {
        await apiFetch("/api/admin/offers", {
          method: "POST",
          body: JSON.stringify(body)
        });
        setShowAddOffer(false);
      }

      setOfferForm({
        hotel_id: "",
        room_id: "",
        title: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        valid_from: "",
        valid_until: "",
        status: "active"
      });

      await loadDashboard();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save offer.");
    } finally {
      setSaving("");
    }
  }

  async function deleteOffer(offerId: string) {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    setSaving(offerId);
    try {
      await apiFetch("/api/admin/offers", {
        method: "DELETE",
        body: JSON.stringify({ id: offerId })
      });
      await loadDashboard();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete offer.");
    } finally {
      setSaving("");
    }
  }

  async function updateBookingStatus(booking: BookingRow, status: string) {
    setSaving(booking.id);
    await apiFetch("/api/admin/bookings", {
      method: "PATCH",
      body: JSON.stringify({ id: booking.id, status })
    });
    await loadDashboard();
    setSaving("");
  }

  async function updateReviewStatus(reviewId: string, status: string) {
    setSaving(reviewId);
    try {
      await apiFetch("/api/admin/reviews", {
        method: "PATCH",
        body: JSON.stringify({ id: reviewId, status })
      });
      await loadDashboard();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update review status.");
    } finally {
      setSaving("");
    }
  }

  async function deleteReview(reviewId: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setSaving(reviewId);
    try {
      await apiFetch("/api/admin/reviews", {
        method: "DELETE",
        body: JSON.stringify({ id: reviewId })
      });
      await loadDashboard();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete review.");
    } finally {
      setSaving("");
    }
  }

  /* ── Loading screen ── */
  if (loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
          <p className="text-sm text-stone-500">Loading dashboard…</p>
        </div>
      </main>
    );
  }

  /* ── Login screen ── */
  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-950 via-emerald-950 to-stone-900 px-4 py-12 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="rounded-2xl glass-panel-dark p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-950/50">
                <Lock size={24} className="text-white" />
              </div>
              <h1 className="mt-5 text-2xl font-bold text-white tracking-tight">Admin Access</h1>
              <p className="mt-1 text-sm text-stone-400">Adventure Mist Stay Inn Rwanda</p>
            </div>

            <form onSubmit={login} className="mt-8 grid gap-4">
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-stone-300">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-stone-850 bg-stone-900/60 px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none transition border-stone-700"
                  placeholder="admin@adventuremist.com"
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-stone-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-stone-850 bg-stone-900/60 px-4 py-3 pr-12 text-sm text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none transition border-stone-700"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && (
                <p className="rounded-xl bg-red-950/50 border border-red-900/50 px-4 py-2.5 text-sm text-red-300">{error}</p>
              )}
              <button
                disabled={saving === "login"}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white shining-button disabled:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving === "login" ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Lock size={18} />
                )}
                {saving === "login" ? "Signing in…" : "Sign in"}
              </button>
              
              <div className="mt-5 text-center">
                <Link href="/" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition">
                  &larr; Back to Website
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }

  /* ── Modals ── */
  const stats = [
    { label: "Total Bookings", value: data?.stats.bookings || 0, icon: CalendarCheck, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Revenue Earned", value: formatCurrency(data?.stats.revenue || 0), icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Available Rooms", value: data?.stats.availableRooms || 0, icon: BedDouble, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Pending Payments", value: data?.stats.pendingPayments || 0, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" }
  ];

  return (
    <>
      {/* Edit/Delete Room modals */}
      {editingRoom && (
        <EditRoomModal room={editingRoom} onClose={() => setEditingRoom(null)} onSaved={loadDashboard} />
      )}
      {deletingRoom && (
        <DeleteRoomModal room={deletingRoom} onClose={() => setDeletingRoom(null)} onDeleted={loadDashboard} />
      )}
      {/* Edit Hotel modal */}
      {editingHotel && (
        <EditHotelModal hotel={editingHotel} onClose={() => setEditingHotel(null)} onSaved={loadDashboard} />
      )}

      <main className="min-h-screen bg-stone-50 flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-stone-900 text-stone-100 flex flex-col fixed inset-y-0 left-0 border-r border-stone-800 z-20">
          <div className="p-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md">
                <Hotel size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide leading-none">ADVENTURE MIST</h1>
                <p className="text-[10px] font-semibold text-stone-400 mt-1">Stay Inn Rwanda</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {([
              ["hotels", "Hotels", Hotel],
              ["rooms", "Rooms", BedDouble],
              ["offers", "Offers", Tag],
              ["bookings", "Bookings", CalendarCheck],
              ["payments", "Payments", CreditCard],
              ["reviews", "Reviews", Star],
              ["partnerships", "Partnerships", Users]
            ] as [typeof activeTab, string, any][]).map(([tab, label, Icon]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-stone-400 hover:text-white hover:bg-stone-800/80"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-stone-800 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2.5 text-xs font-semibold text-stone-300 hover:bg-stone-700 transition"
            >
              View Website
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-650 hover:bg-red-750 px-4 py-2.5 text-xs font-semibold text-white transition bg-red-650 hover:bg-red-700"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-64 min-h-screen flex flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 border-b border-stone-200 bg-white px-6 py-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Admin Panel &rarr;</p>
              <h1 className="text-lg font-bold text-stone-900 capitalize">
                {activeTab} Management
              </h1>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowAddHotel((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-sm transition"
              >
                <Plus size={14} />
                {showAddHotel ? "Hide Hotel Form" : "Add Hotel"}
              </button>
              <button
                onClick={() => setShowAddRoom((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-md transition"
              >
                <Plus size={14} />
                {showAddRoom ? "Hide Room Form" : "Add Room"}
              </button>
              <button
                onClick={() => {
                  setEditingOffer(null);
                  setOfferForm({
                    hotel_id: "",
                    room_id: "",
                    title: "",
                    description: "",
                    discount_type: "percentage",
                    discount_value: "",
                    valid_from: "",
                    valid_until: "",
                    status: "active"
                  });
                  setShowAddOffer(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-md transition"
              >
                <Plus size={14} />
                Add Offer
              </button>
            </div>
          </header>

          {/* Page Body Container */}
          <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-150 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {/* Redesigned Stat Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                const iconGradients: Record<string, string> = {
                  "Total Bookings": "from-sky-500 to-blue-600 text-white shadow-md",
                  "Revenue Earned": "from-emerald-500 to-teal-600 text-white shadow-md",
                  "Available Rooms": "from-violet-500 to-indigo-600 text-white shadow-md",
                  "Pending Payments": "from-amber-500 to-orange-600 text-white shadow-md"
                };
                const gradCls = iconGradients[stat.label] || "from-stone-500 to-stone-600 text-white";
                return (
                  <div key={stat.label} className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="mt-2.5 text-2xl font-bold text-stone-900 tracking-tight">{stat.value}</p>
                      </div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradCls} shadow-lg`}>
                        <Icon size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          {/* Add Hotel Form Modal */}
          {showAddHotel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm" onClick={() => setShowAddHotel(false)}>
              <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                  <h2 className="flex items-center gap-2 font-bold text-stone-900">
                    <Hotel size={18} className="text-stone-500" /> Add New Hotel
                  </h2>
                  <button onClick={() => setShowAddHotel(false)} className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={addHotel} className="p-6 overflow-y-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(["name", "city", "country", "price_from"] as const).map((field) => (
                    <div key={field} className="grid gap-1">
                      <label className="text-xs font-semibold capitalize text-stone-500">
                        {field.replace("_", " ")} *
                      </label>
                      <input
                        required
                        type={field === "price_from" ? "number" : "text"}
                        min={field === "price_from" ? "1" : undefined}
                        value={hotelForm[field]}
                        onChange={(e) => setHotelForm({ ...hotelForm, [field]: e.target.value })}
                        className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                        placeholder={field.replace("_", " ")}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 lg:col-span-4 grid gap-1">
                    <label className="text-xs font-semibold text-stone-500">Upload Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setHotelForm({ ...hotelForm, imageFiles: Array.from(e.target.files || []) })}
                      className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {hotelForm.imageFiles.length > 0 && (
                      <p className="text-xs text-stone-500 mt-1">{hotelForm.imageFiles.length} files selected.</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <AmenitiesSelector selected={hotelForm.amenities} onChange={(a) => setHotelForm({ ...hotelForm, amenities: a })} />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-2">
                    <button type="button" onClick={() => setShowAddHotel(false)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                      Cancel
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800">
                      <Save size={15} />
                      {saving === "hotel" ? "Saving…" : "Save Hotel"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Room Form Modal */}
          {showAddRoom && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm" onClick={() => setShowAddRoom(false)}>
              <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                  <h2 className="flex items-center gap-2 font-bold text-stone-900">
                    <BedDouble size={18} className="text-stone-500" /> Add New Room
                  </h2>
                  <button onClick={() => setShowAddRoom(false)} className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={addRoom} className="p-6 overflow-y-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold text-stone-500">Hotel</label>
                    <select
                      value={roomForm.hotel_id}
                      onChange={(e) => setRoomForm({ ...roomForm, hotel_id: e.target.value })}
                      className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      {(data?.hotels || []).map((h) => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  {([
                    ["name", "Room name *", "text", true],
                    ["room_number", "Room number *", "text", true],
                    ["price_per_night", "Price per night (USD) *", "number", true],
                    ["capacity", "Capacity (guests) *", "number", true],
                    ["bed_type", "Bed type", "text", false],
                    ["room_size", "Room size", "text", false]
                  ] as ["name" | "room_number" | "price_per_night" | "capacity" | "bed_type" | "room_size", string, string, boolean][]).map(([field, label, type, required]) => (
                    <div key={field} className="grid gap-1">
                      <label className="text-xs font-semibold text-stone-500">{label}</label>
                      <input
                        type={type}
                        required={required}
                        min={type === "number" ? "1" : undefined}
                        value={roomForm[field]}
                        onChange={(e) => setRoomForm({ ...roomForm, [field]: e.target.value })}
                        className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                        placeholder={label}
                      />
                    </div>
                  ))}
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold text-stone-500">Status</label>
                    <select
                      value={roomForm.status}
                      onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                      className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      {roomStatuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 grid gap-1">
                    <label className="text-xs font-semibold text-stone-500">Upload Images (minimum 2)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setRoomForm({ ...roomForm, imageFiles: Array.from(e.target.files || []) })}
                      className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {roomForm.imageFiles.length > 0 && (
                      <p className="text-xs text-stone-500 mt-1">{roomForm.imageFiles.length} files selected.</p>
                    )}
                    {roomForm.imageFiles.length < 2 && roomForm.imageFiles.length > 0 && (
                      <p className="text-xs text-amber-600 mt-1">Please select at least 2 images.</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <AmenitiesSelector selected={roomForm.amenities} onChange={(a) => setRoomForm({ ...roomForm, amenities: a })} />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 grid gap-1">
                    <label className="text-xs font-semibold text-stone-500">Description</label>
                    <textarea
                      rows={2}
                      value={roomForm.description}
                      onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                      className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                      placeholder="Room description…"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-2">
                    <button type="button" onClick={() => setShowAddRoom(false)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                      Cancel
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
                      <Save size={15} />
                      {saving === "room" ? "Saving…" : "Save Room"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab Content Wrapper */}
          <div className="mt-2">

            {/* Hotels Table */}
            {activeTab === "hotels" && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="border-b border-stone-100 px-6 py-4">
                  <h2 className="font-bold text-stone-900">
                    Hotels
                    <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                      {data?.hotels?.length || 0}
                    </span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-teal-600 text-xs font-bold uppercase tracking-wide text-white">
                      <tr>
                        <th className="px-6 py-3">Hotel Name</th>
                        <th className="px-6 py-3">City</th>
                        <th className="px-6 py-3">Price From</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(data?.hotels || []).map((hotel) => (
                        <tr key={hotel.id} className="hover:bg-stone-50/60 transition">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-stone-900">{hotel.name}</p>
                            <p className="text-xs text-stone-400">{hotel.country}</p>
                          </td>
                          <td className="px-6 py-4 text-stone-600">{hotel.city}</td>
                          <td className="px-6 py-4 font-semibold text-stone-900">{formatCurrency(Number(hotel.price_from))}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={hotel.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingHotel(hotel)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => deleteHotel(hotel)}
                                disabled={saving === "delhotel_" + hotel.id}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(data?.hotels || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-stone-400">
                            No hotels found. Add a hotel to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Rooms Table */}
            {activeTab === "rooms" && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="border-b border-stone-100 px-6 py-4">
                  <h2 className="font-bold text-stone-900">
                    Rooms
                    <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                      {data?.rooms?.length || 0}
                    </span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-emerald-700 text-xs font-bold uppercase tracking-wide text-white">
                      <tr>
                        <th className="px-6 py-3">Room</th>
                        <th className="px-6 py-3">Hotel</th>
                        <th className="px-6 py-3">Price / night</th>
                        <th className="px-6 py-3">Capacity</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(data?.rooms || []).map((room) => (
                        <tr key={room.id} className="hover:bg-stone-50/60 transition">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-stone-900">{room.name}</p>
                            {room.room_number && (
                              <p className="text-xs text-stone-400">#{room.room_number}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-stone-600">
                            {hotelById.get(room.hotel_id)?.name || "—"}
                          </td>
                          <td className="px-6 py-4 font-semibold text-stone-900">
                            {formatCurrency(Number(room.price_per_night))}
                          </td>
                          <td className="px-6 py-4 text-stone-600">
                            {room.capacity} guest{room.capacity !== 1 ? "s" : ""}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={room.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                disabled={saving === room.id}
                                onClick={() => handleToggleRoomStatus(room.id, room.status)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Cycle room status: Available -> Fully booked -> Maintenance"
                              >
                                {saving === room.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <RefreshCw size={12} />
                                )}
                                Status
                              </button>
                              <button
                                onClick={() => setEditingRoom(room)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition"
                              >
                                <Pencil size={12} />
                                Edit
                              </button>
                              <button
                                onClick={() => setDeletingRoom(room)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(data?.rooms || []).length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-400">
                            No rooms found. Add a room to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Offers Table */}
            {activeTab === "offers" && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="border-b border-stone-100 px-6 py-4">
                  <h2 className="font-bold text-stone-900">
                    Offers &amp; Discounts
                    <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                      {data?.offers?.length || 0}
                    </span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-rose-600 text-xs font-bold uppercase tracking-wide text-white">
                      <tr>
                        <th className="px-6 py-3">Title</th>
                        <th className="px-6 py-3">Applies To</th>
                        <th className="px-6 py-3">Discount</th>
                        <th className="px-6 py-3">Valid From</th>
                        <th className="px-6 py-3">Valid Until</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(data?.offers || []).map((offer) => {
                        const roomName = (data?.rooms || []).find(r => r.id === offer.room_id)?.name;
                        const hotelName = (data?.hotels || []).find(h => h.id === offer.hotel_id)?.name;
                        return (
                          <tr key={offer.id} className="hover:bg-stone-50/60 transition">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-stone-900">{offer.title}</p>
                              {offer.description && <p className="text-xs text-stone-400 mt-0.5">{offer.description}</p>}
                            </td>
                            <td className="px-6 py-4 text-stone-600">
                              {roomName ? (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                  Room: {roomName}
                                </span>
                              ) : hotelName ? (
                                <span className="inline-flex items-center gap-1 rounded bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                                  Hotel: {hotelName}
                                </span>
                              ) : "—"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-rose-700">
                              {offer.discount_type === "percentage"
                                ? `${offer.discount_value}% off`
                                : `$${offer.discount_value} off`}
                            </td>
                            <td className="px-6 py-4 text-stone-600 text-xs">
                              {offer.valid_from ? new Date(offer.valid_from).toLocaleDateString() : "Any time"}
                            </td>
                            <td className="px-6 py-4 text-stone-600 text-xs">
                              {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : "No expiry"}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={offer.status} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingOffer(offer);
                                    setOfferForm({
                                      hotel_id: offer.hotel_id || "",
                                      room_id: offer.room_id || "",
                                      title: offer.title,
                                      description: offer.description || "",
                                      discount_type: offer.discount_type,
                                      discount_value: String(offer.discount_value),
                                      valid_from: offer.valid_from ? offer.valid_from.slice(0, 10) : "",
                                      valid_until: offer.valid_until ? offer.valid_until.slice(0, 10) : "",
                                      status: offer.status
                                    });
                                    setShowAddOffer(true);
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                                >
                                  <Pencil size={12} /> Edit
                                </button>
                                <button
                                  onClick={() => deleteOffer(offer.id)}
                                  disabled={saving === offer.id}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                                >
                                  {saving === offer.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {(data?.offers || []).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-sm text-stone-400">
                            No offers yet. Click "Add Offer" to create a discount.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Table */}
            {activeTab === "bookings" && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <h2 className="font-bold text-stone-900">
                      Bookings
                      <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                        {filteredBookings.length}
                      </span>
                    </h2>
                    <div className="ml-4 flex gap-1 rounded-lg bg-stone-100 p-1">
                      {(["all", "successful", "pending"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setBookingFilter(f)}
                          className={`rounded-md px-3 py-1 text-xs font-semibold capitalize ${bookingFilter === f ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const bookingColumns = [
                        { key: "booking_reference", label: "Reference" },
                        { key: "guest_full_name", label: "Guest Name" },
                        { key: "guest_email", label: "Email" },
                        { key: "guest_phone", label: "Phone" },
                        { key: "check_in_date", label: "Check-in" },
                        { key: "check_out_date", label: "Check-out" },
                        { key: "guest_count", label: "Guests" },
                        { 
                          key: "total_amount", 
                          label: "Total Amount", 
                          format: (val: any) => formatCurrency(Number(val)) 
                        },
                        { key: "status", label: "Status", format: (val: any) => String(val).toUpperCase().replace(/_/g, " ") },
                        { 
                          key: "created_at", 
                          label: "Booked On", 
                          format: (val: any) => new Date(val).toLocaleDateString() 
                        }
                      ];
                      downloadPDF("Bookings Report", filteredBookings, bookingColumns);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                  >
                    Export PDF
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-sky-600 text-xs font-bold uppercase tracking-wide text-white">
                      <tr>
                        <th className="px-6 py-3">Reference</th>
                        <th className="px-6 py-3">Guest</th>
                        <th className="px-6 py-3">Dates</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-stone-50/60 transition">
                          <td className="px-6 py-4 font-mono font-semibold text-stone-900 text-xs">
                            {booking.booking_reference}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-stone-900">{booking.guest_full_name}</p>
                            <p className="text-xs text-stone-400">{booking.guest_email}</p>
                          </td>
                          <td className="px-6 py-4 text-stone-600 text-xs">
                            {booking.check_in_date} → {booking.check_out_date}
                          </td>
                          <td className="px-6 py-4 font-semibold text-stone-900">
                            {formatCurrency(Number(booking.total_amount))}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={booking.status}
                              disabled={saving === booking.id}
                              onChange={(e) => updateBookingStatus(booking, e.target.value)}
                              className="rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                            >
                              {bookingStatuses.map((s) => (
                                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-stone-400">
                            No bookings match the selected filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments Table */}
            {activeTab === "payments" && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                  <h2 className="font-bold text-stone-900">
                    Payments
                    <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                      {data?.payments?.length || 0}
                    </span>
                  </h2>
                  <button
                    onClick={() => {
                      const paymentColumns = [
                        { key: "gateway_reference", label: "Gateway Reference" },
                        { 
                          key: "booking_id", 
                          label: "Booking Ref", 
                          format: (val: any) => {
                            const ref = data?.bookings?.find(b => b.id === val)?.booking_reference;
                            return ref || val || "N/A";
                          } 
                        },
                        { 
                          key: "amount", 
                          label: "Amount", 
                          format: (val: any) => formatCurrency(Number(val)) 
                        },
                        { key: "currency", label: "Currency" },
                        { key: "status", label: "Status", format: (val: any) => String(val).toUpperCase() },
                        { 
                          key: "paid_at", 
                          label: "Paid At", 
                          format: (val: any) => val ? new Date(val).toLocaleString() : "Not paid yet" 
                        }
                      ];
                      downloadPDF("Payments Report", data?.payments || [], paymentColumns);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                  >
                    Export PDF
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-violet-700 text-xs font-bold uppercase tracking-wide text-white">
                      <tr>
                        <th className="px-6 py-3">Gateway Reference</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Currency</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Paid At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(data?.payments || []).map((payment) => (
                        <tr key={payment.id} className="hover:bg-stone-50/60 transition">
                          <td className="px-6 py-4 font-mono text-xs text-stone-600">
                            {payment.gateway_reference}
                          </td>
                          <td className="px-6 py-4 font-semibold text-stone-900">
                            {formatCurrency(Number(payment.amount))}
                          </td>
                          <td className="px-6 py-4 text-stone-600">{payment.currency}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={payment.status} />
                          </td>
                          <td className="px-6 py-4 text-xs text-stone-500">
                            {payment.paid_at
                              ? new Date(payment.paid_at).toLocaleString()
                              : "Not paid yet"}
                          </td>
                        </tr>
                      ))}
                      {(data?.payments || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-stone-400">
                            No payments recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews Table */}
            {activeTab === "reviews" && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                  <h2 className="font-bold text-stone-900">
                    Customer Reviews
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {data?.reviews?.length || 0}
                    </span>
                  </h2>
                  <p className="text-xs text-stone-400">Approve reviews before they appear on the site</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-stone-600">
                    <thead className="bg-amber-500 text-xs font-bold uppercase tracking-wider text-white">
                      <tr>
                        <th className="px-6 py-3">Guest</th>
                        <th className="px-6 py-3">Hotel</th>
                        <th className="px-6 py-3">Rating</th>
                        <th className="px-6 py-3">Comment</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(data?.reviews || []).map((review) => (
                        <tr key={review.id} className="hover:bg-amber-50/40 transition">
                          <td className="px-6 py-4 font-semibold text-stone-900">
                            {review.guest_name}
                          </td>
                          <td className="px-6 py-4 text-stone-600">{review.hotel_name}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: review.rating }).map((_, idx) => (
                                <Star key={idx} size={15} fill="currentColor" />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-stone-600 max-w-xs truncate" title={review.comment}>
                            {review.comment}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              review.status === "published"
                                ? "bg-emerald-100 text-emerald-800"
                                : review.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-stone-100 text-stone-700"
                            }`}>
                              {review.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-stone-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              {review.status !== "published" && (
                                <button
                                  onClick={() => updateReviewStatus(review.id, "published")}
                                  disabled={saving === review.id}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                                >
                                  <Check size={11} /> Approve
                                </button>
                              )}
                              {review.status !== "hidden" && (
                                <button
                                  onClick={() => updateReviewStatus(review.id, "hidden")}
                                  disabled={saving === review.id}
                                  className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50 transition"
                                >
                                  Hide
                                </button>
                              )}
                              <button
                                onClick={() => deleteReview(review.id)}
                                disabled={saving === review.id}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 transition"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(data?.reviews || []).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-sm text-stone-400">
                            No reviews submitted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Partnerships Table */}
            {activeTab === "partnerships" && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                  <h2 className="font-bold text-stone-900">
                    Partnerships
                    <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                      {data?.partnerships?.length || 0}
                    </span>
                  </h2>
                  <button
                    onClick={() => setShowAddPartner((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition"
                  >
                    <Plus size={14} /> Add Partner
                  </button>
                </div>
                {showAddPartner && (
                  <div className="border-b border-stone-100 bg-stone-50 px-6 py-4">
                    <form onSubmit={addPartner} className="flex gap-3 items-end">
                      <div className="grid gap-1 flex-1">
                        <label className="text-xs font-semibold text-stone-500">Name</label>
                        <input
                          value={partnerForm.name}
                          onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                          className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="grid gap-1 flex-1">
                        <label className="text-xs font-semibold text-stone-500">Logo URL</label>
                        <input
                          value={partnerForm.logo_url}
                          onChange={(e) => setPartnerForm({ ...partnerForm, logo_url: e.target.value })}
                          className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                      <button className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                        {saving === "partner" ? "Saving..." : "Save"}
                      </button>
                    </form>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-rose-600 text-xs font-bold uppercase tracking-wide text-white">
                      <tr>
                        <th className="px-6 py-3">Partner Name</th>
                        <th className="px-6 py-3">Logo</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Added</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(data?.partnerships || []).map((partner) => (
                        <tr key={partner.id} className="hover:bg-stone-50/60 transition">
                          <td className="px-6 py-4 font-semibold text-stone-900">{partner.name}</td>
                          <td className="px-6 py-4">
                            {partner.logo_url && (
                              <img src={partner.logo_url} alt={partner.name} className="h-8 object-contain" />
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={partner.status} />
                          </td>
                          <td className="px-6 py-4 text-xs text-stone-500">
                            {new Date(partner.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={async () => {
                                if (confirm("Delete this partner?")) {
                                  await apiFetch("/api/admin/partnerships", { method: "DELETE", body: JSON.stringify({ id: partner.id }) });
                                  loadDashboard();
                                }
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(data?.partnerships || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-stone-400">
                            No partnerships added.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </main>
    </>
  );
}
