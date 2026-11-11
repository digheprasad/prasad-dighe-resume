import React from "react";

const CONSENT_KEY = "prasad-portfolio-analytics-consent";
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function getAnalyticsConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Analytics remains opt-in for this visit if storage is unavailable.
  }
}

export function useAnalytics(consent) {
  React.useEffect(() => {
    if (!measurementId) return undefined;

    const disabledKey = `ga-disable-${measurementId}`;
    if (consent !== "accepted") {
      if (document.getElementById("google-analytics-script")) {
        window[disabledKey] = true;
        window.gtag?.("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
        });
      }
      return undefined;
    }

    window[disabledKey] = false;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };

    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    const scriptId = "google-analytics-script";
    if (window.portfolioAnalyticsInitialized !== measurementId) {
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        send_page_view: true,
      });

      window.portfolioAnalyticsInitialized = measurementId;
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }

    const sections = document.querySelectorAll("main section[id]");
    const visitedSections = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !visitedSections.has(entry.target.id)) {
            visitedSections.add(entry.target.id);
            window.gtag("event", "section_view", {
              section_id: entry.target.id,
            });
          }
        }
      },
      { threshold: 0.35 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [consent]);
}
