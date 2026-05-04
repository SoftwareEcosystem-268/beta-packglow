"use client";

import { useCallback } from "react";
import { useAuth } from "@/components/AuthContext";
import ProUpgradePopup from "@/components/ProUpgradePopup";
import { usePageState } from "@/hooks/usePageState";

import HomeNavbar from "@/components/sections/HomeNavbar";
import HeroSection from "@/components/sections/HeroSection";
import DestinationsSection from "@/components/sections/DestinationsSection";
import PackingSection from "@/components/sections/PackingSection";
import ProFeaturesPreview from "@/components/sections/ProFeaturesPreview";
import OutfitsSection from "@/components/sections/OutfitsSection";
import BookingsSection from "@/components/sections/BookingsSection";
import PricingSection from "@/components/sections/PricingSection";
import FooterSection from "@/components/sections/FooterSection";

import Toast from "@/components/modals/Toast";
import LoginAlertModal from "@/components/modals/LoginAlertModal";

import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  const { user } = useAuth();
  const state = usePageState();

  const handleDismissToast = useCallback(() => state.showToast("", "success"), [state]);

  return (
    <div className="min-h-screen bg-[#F5F3EF] overflow-x-hidden">
      <HomeNavbar isPro={state.isPro} scrollTo={state.scrollTo} />

      <HeroSection />
      <DestinationsSection />

      <ErrorBoundary>
        <PackingSection
          isPro={state.isPro}
          showToast={state.showToast}
          scrollTo={state.scrollTo}
          showTemplateModal={state.showTemplateModal}
          setShowTemplateModal={state.setShowTemplateModal}
          templateName={state.templateName}
          setTemplateName={state.setTemplateName}
          templateLoading={state.templateLoading}
          showLoadDropdown={state.showLoadDropdown}
          setShowLoadDropdown={state.setShowLoadDropdown}
          handleSaveChecklist={state.handleSaveChecklist}
          handleSaveTemplate={state.handleSaveTemplate}
          handleOpenLoad={state.handleOpenLoad}
          handleLoadTemplate={state.handleLoadTemplate}
          templates={state.templates}
          removeTemplate={state.removeTemplate}
        />
      </ErrorBoundary>

      <ProFeaturesPreview
        isPro={state.isPro}
        user={user}
        onUpgrade={() => state.setShowProPopup(true)}
        onLoginRequired={() => state.setShowLoginAlert(true)}
      />

      <ErrorBoundary>
        <OutfitsSection isPro={state.isPro} setShowProPopup={state.setShowProPopup} />
      </ErrorBoundary>

      <ErrorBoundary>
        <BookingsSection showToast={state.showToast} />
      </ErrorBoundary>

      <PricingSection
        user={user}
        setShowProPopup={state.setShowProPopup}
        setShowLoginAlert={state.setShowLoginAlert}
        showToast={state.showToast}
      />

      <FooterSection scrollTo={state.scrollTo} />

      {/* Global modals */}
      <Toast toast={state.toast} onDismiss={handleDismissToast} />
      <LoginAlertModal open={state.showLoginAlert} onClose={() => state.setShowLoginAlert(false)} />
      {state.showProPopup && (
        <ProUpgradePopup
          onClose={() => state.setShowProPopup(false)}
          onUpgrade={() => {
            localStorage.setItem("pg_user_tier", "pro");
            state.setUserTier("pro");
            state.setShowProPopup(false);
            state.showToast("อัปเกรดเป็น Pro สำเร็จ!");
          }}
        />
      )}
    </div>
  );
}
