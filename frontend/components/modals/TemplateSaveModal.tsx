"use client";

import { Loader2 } from "lucide-react";

interface TemplateSaveModalProps {
  open: boolean;
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  loading: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function TemplateSaveModal({
  open, templateName, onTemplateNameChange, loading, onSave, onClose,
}: TemplateSaveModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 md:p-6 w-full max-w-sm md:w-96 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-800 mb-4">📌 บันทึกเป็น Template</h3>
        <input
          type="text"
          placeholder="ตั้งชื่อ template..."
          value={templateName}
          onChange={(e) => onTemplateNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
          className="w-full px-4 py-3 rounded-xl border-2 border-brand/40 focus:outline-none focus:border-brand text-gray-900"
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onSave}
            disabled={!templateName.trim() || loading}
            className="flex-1 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-colors disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "บันทึก"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
