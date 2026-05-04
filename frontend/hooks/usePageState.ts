"use client";

import { useState, useEffect, useCallback } from "react";
import { usePacking } from "@/components/PackingContext";

export function usePageState() {
  const {
    isDirty, saving, saveChecklist, totalItemCount,
    templates, refreshTemplates, saveAsTemplate, loadTemplate, removeTemplate,
  } = usePacking();

  const [userTier, setUserTier] = useState<"free" | "pro">(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("pg_user_tier") as "free" | "pro") || "free"
      : "free"
  );

  useEffect(() => {
    const onStorage = () => {
      setUserTier((localStorage.getItem("pg_user_tier") as "free" | "pro") || "free");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isPro = userTier === "pro";

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => setToast({ message: msg, type }), []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const [showProPopup, setShowProPopup] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateLoading, setTemplateLoading] = useState(false);
  const [showLoadDropdown, setShowLoadDropdown] = useState(false);

  const handleSaveChecklist = useCallback(async () => {
    const ok = await saveChecklist();
    showToast(ok ? "บันทึก checklist สำเร็จ" : "บันทึกไม่สำเร็จ", ok ? "success" : "error");
  }, [saveChecklist, showToast]);

  const handleSaveTemplate = useCallback(async () => {
    if (!templateName.trim()) return;
    setTemplateLoading(true);
    const ok = await saveAsTemplate(templateName.trim());
    setTemplateLoading(false);
    if (ok) {
      showToast(`บันทึกเทมเพลต "${templateName.trim()}" สำเร็จ`);
      setTemplateName("");
      setShowTemplateModal(false);
    } else {
      showToast("ไม่สามารถบันทึกเทมเพลตได้", "error");
    }
  }, [templateName, saveAsTemplate, showToast]);

  const handleOpenLoad = useCallback(async () => {
    if (!showLoadDropdown) await refreshTemplates();
    setShowLoadDropdown(prev => !prev);
  }, [showLoadDropdown, refreshTemplates]);

  const handleLoadTemplate = useCallback(async (tpl: { id: string; name: string; items: unknown[] }) => {
    setTemplateLoading(true);
    const ok = await loadTemplate(tpl as Parameters<typeof loadTemplate>[0]);
    setTemplateLoading(false);
    setShowLoadDropdown(false);
    showToast(ok ? `โหลด "${tpl.name}" สำเร็จ` : "โหลดไม่สำเร็จ", ok ? "success" : "error");
  }, [loadTemplate, showToast]);

  return {
    userTier, isPro, setUserTier,
    toast, showToast,
    scrollTo,
    showProPopup, setShowProPopup,
    showLoginAlert, setShowLoginAlert,
    showTemplateModal, setShowTemplateModal,
    templateName, setTemplateName,
    templateLoading,
    showLoadDropdown, setShowLoadDropdown,
    handleSaveChecklist,
    handleSaveTemplate,
    handleOpenLoad, handleLoadTemplate,
    isDirty, saving, totalItemCount,
    templates, removeTemplate,
  };
}
