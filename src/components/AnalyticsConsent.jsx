import { AnimatePresence, motion } from "framer-motion";
import { FiBarChart2, FiCheck, FiX } from "react-icons/fi";

export default function AnalyticsConsent({ consent, onConsent, hasAnalytics }) {
  return (
    <AnimatePresence>
      {consent === null && (
        <motion.aside
          aria-label="Analytics preferences"
          className="consent-card glass-card"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.3 }}
        >
          <div className="consent-heading">
            <span className="consent-icon"><FiBarChart2 aria-hidden="true" /></span>
            <div>
              <p className="eyebrow">YOUR PRIVACY</p>
              <h2>Analytics, your choice.</h2>
            </div>
          </div>
          <p>
            {hasAnalytics
              ? "Optional, anonymous analytics help me understand which parts of this portfolio are useful. No analytics loads unless you opt in."
              : "Analytics is not configured on this site. No analytics data is being collected."}
          </p>
          <div className="consent-actions">
            {hasAnalytics && (
              <button className="button button-small button-accent" onClick={() => onConsent("accepted")}>
                <FiCheck aria-hidden="true" /> Allow analytics
              </button>
            )}
            <button className="button button-small button-quiet" onClick={() => onConsent("rejected")}>
              {hasAnalytics && <FiX aria-hidden="true" />}
              {hasAnalytics ? "No thanks" : "Got it"}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
