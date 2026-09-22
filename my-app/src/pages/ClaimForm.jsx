import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

import {
  getConsumerProfile,
  getCompanies,
  createClaim,
} from "../services/authService";

const ClaimForm = () => {
  const navigate = useNavigate();

  // ============================================
  // AUTH DATA
  // ============================================

  const { user, profile, loading: authLoading } = useAuth();

  // ============================================
  // CONSUMER DATA
  // ============================================

  const [consumerProfile, setConsumerProfile] = useState(null);

  // ============================================
  // COMPANIES
  // ============================================

  const [companies, setCompanies] = useState([]);

  // ============================================
  // FORM DATA
  // ============================================

  const [formData, setFormData] = useState({
    companyId: "",
    productName: "",
    expiryDate: "",
    serialNumber: "",
    purchaseDate: "",
    issueDetails: "",
  });

  // ============================================
  // UI STATES
  // ============================================

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================
  // LOAD CONSUMER + COMPANIES
  // ============================================

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [consumerData, companyData] = await Promise.all([
          getConsumerProfile(user.id),
          getCompanies(),
        ]);

        setConsumerProfile(consumerData);
        setCompanies(companyData);
      } catch (error) {
        console.error("Error loading claim form:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ============================================
  // SUBMIT CLAIM
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.companyId) {
      setError("Please select a company.");
      return;
    }

    if (!formData.productName.trim()) {
      setError("Please enter the product name.");
      return;
    }

    if (!formData.expiryDate) {
      setError("Please enter the warranty expiry date.");
      return;
    }

    if (!formData.issueDetails.trim()) {
      setError("Please enter the issue details.");
      return;
    }

    if (!user?.id) {
      setError("You must be logged in to submit a claim.");
      return;
    }

    try {
      setSubmitting(true);

      const claim = await createClaim({
        userId: user.id,
        companyId: formData.companyId,
        productName: formData.productName.trim(),
        expiryDate: formData.expiryDate,
        serialNumber: formData.serialNumber.trim(),
        purchaseDate: formData.purchaseDate,
        issueDetails: formData.issueDetails.trim(),
      });

      console.log("Claim created:", claim);

      setSuccess(
        `Claim submitted successfully! Your claim number is ${claim.claim_number}.`
      );

      setFormData({
        companyId: "",
        productName: "",
        expiryDate: "",
        serialNumber: "",
        purchaseDate: "",
        issueDetails: "",
      });
    } catch (error) {
      console.error("Claim submission error:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // LOADING SCREEN
  // ============================================

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#003C37]" />
          <p className="text-sm font-medium text-slate-500">
            Loading claim form...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-4xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/consumer/dashboard")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#003C37]"
          >
            <span>←</span>
            Back to Dashboard
          </button>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#003C37]">
              Consumer Portal
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Warranty Claim
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Submit a warranty claim for your product. Provide the details
              below so the company can review and process your claim.
            </p>
          </div>
        </div>

        {/* =====================================
            MAIN CARD
        ====================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* =====================================
              CARD HEADER
          ====================================== */}

          <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Submit a New Claim
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the product and warranty information below.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">

            {/* =====================================
                USER INFORMATION
            ====================================== */}

            <section className="mb-8">

              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900">
                  Your Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  This information is associated with your account.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {profile?.full_name || "Not available"}
                  </p>
                </div>

                {/* EMAIL */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {profile?.email || "Not available"}
                  </p>
                </div>

                {/* PHONE */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {consumerProfile?.phone || "Not available"}
                  </p>
                </div>

                {/* ADDRESS */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {consumerProfile?.address || "Not available"}
                  </p>
                </div>

              </div>
            </section>

            {/* =====================================
                SUCCESS MESSAGE
            ====================================== */}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Claim submitted
                  </p>

                  <p className="mt-1 text-sm leading-5 text-emerald-700">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {/* =====================================
                ERROR MESSAGE
            ====================================== */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Unable to submit claim
                  </p>

                  <p className="mt-1 text-sm leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* =====================================
                CLAIM FORM
            ====================================== */}

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* =====================================
                  PRODUCT INFORMATION
              ====================================== */}

              <section>

                <div className="mb-5">
                  <h3 className="text-base font-semibold text-slate-900">
                    Product Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell us about the product covered by the warranty.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* COMPANY */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="companyId"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Company <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="companyId"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003C37] focus:ring-2 focus:ring-[#003C37]/10"
                    >
                      <option value="">
                        Select a company
                      </option>

                      {companies.map((company) => (
                        <option
                          key={company.user_id}
                          value={company.user_id}
                        >
                          {company.company_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PRODUCT NAME */}

                  <div>
                    <label
                      htmlFor="productName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Product Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="e.g. Washing Machine"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#003C37] focus:ring-2 focus:ring-[#003C37]/10"
                    />
                  </div>

                  {/* SERIAL NUMBER */}

                  <div>
                    <label
                      htmlFor="serialNumber"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Serial Number
                    </label>

                    <input
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      placeholder="Enter serial number"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#003C37] focus:ring-2 focus:ring-[#003C37]/10"
                    />
                  </div>

                </div>
              </section>

              {/* =====================================
                  WARRANTY INFORMATION
              ====================================== */}

              <section className="border-t border-slate-200 pt-7">

                <div className="mb-5">
                  <h3 className="text-base font-semibold text-slate-900">
                    Warranty Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Provide the relevant purchase and warranty dates.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* PURCHASE DATE */}

                  <div>
                    <label
                      htmlFor="purchaseDate"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Purchase Date
                    </label>

                    <input
                      type="date"
                      id="purchaseDate"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003C37] focus:ring-2 focus:ring-[#003C37]/10"
                    />
                  </div>

                  {/* EXPIRY DATE */}

                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Warranty Expiry Date{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003C37] focus:ring-2 focus:ring-[#003C37]/10"
                    />
                  </div>

                </div>
              </section>

              {/* =====================================
                  ISSUE DETAILS
              ====================================== */}

              <section className="border-t border-slate-200 pt-7">

                <div className="mb-5">
                  <h3 className="text-base font-semibold text-slate-900">
                    Issue Details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Describe the problem you are experiencing with the
                    product.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="issueDetails"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Describe the Issue{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="issueDetails"
                    name="issueDetails"
                    value={formData.issueDetails}
                    onChange={handleChange}
                    placeholder="Describe the issue with your product..."
                    rows="6"
                    required
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#003C37] focus:ring-2 focus:ring-[#003C37]/10"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Please provide as much detail as possible to help the
                    company understand the problem.
                  </p>
                </div>

              </section>

              {/* =====================================
                  ACTIONS
              ====================================== */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-7 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => navigate("/consumer/dashboard")}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#003C37] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002f2b] focus:outline-none focus:ring-2 focus:ring-[#003C37]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Claim"
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>

        {/* =====================================
            FOOTER
        ====================================== */}

        <p className="mt-6 text-center text-xs text-slate-400">
          Your claim information will be securely shared with the selected
          company for processing.
        </p>

      </div>
    </div>
  );
};

export default ClaimForm;