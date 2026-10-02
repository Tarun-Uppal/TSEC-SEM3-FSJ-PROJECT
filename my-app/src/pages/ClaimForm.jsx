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

  const { user, profile, loading: authLoading } = useAuth();

  const [consumerProfile, setConsumerProfile] = useState(null);
  const [companies, setCompanies] = useState([]);

  const [formData, setFormData] = useState({
    companyId: "",
    productName: "",
    expiryDate: "",
    serialNumber: "",
    purchaseDate: "",
    issueDetails: "",
  });

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
  // LOADING
  // ============================================

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
        <div className="flex flex-col items-center">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#d9dfdc]" />
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#173f3a]" />
          </div>

          <p className="mt-5 text-[13px] font-medium tracking-[-0.01em] text-[#7a817e]">
            Loading your claim form
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-[#1d2421] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="mb-9">
          <button
            type="button"
            onClick={() => navigate("/consumer/dashboard")}
            className="group mb-7 inline-flex items-center gap-2 text-[13px] font-medium text-[#737b77] transition-colors duration-200 hover:text-[#173f3a]"
          >
            <span className="text-base transition-transform duration-200 group-hover:-translate-x-0.5">
              ←
            </span>

            Back to Dashboard
          </button>

          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1f6258]" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#356b62]">
                Consumer Portal
              </p>
            </div>

            <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#18201d] sm:text-[42px] sm:leading-[1.08]">
              Warranty Claim
            </h1>

            <p className="mt-3 max-w-xl text-[15px] leading-7 tracking-[-0.01em] text-[#737b77] sm:text-base">
              Submit a warranty claim and provide the information needed to
              help the company review your request.
            </p>
          </div>
        </header>

        {/* =====================================
            MAIN CARD
        ====================================== */}

        <main className="overflow-hidden rounded-[26px] border border-[#e3e6e3] bg-white shadow-[0_18px_55px_rgba(24,39,34,0.06)]">

          {/* CARD HEADER */}

          <div className="border-b border-[#eceeec] bg-[#fcfcfb] px-6 py-6 sm:px-9">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#202824]">
                  Submit a New Claim
                </h2>

                <p className="mt-1.5 text-[13px] leading-5 text-[#858c88]">
                  Enter the product and warranty information below.
                </p>
              </div>

              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf4f1] text-[#285d54] sm:flex">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 3.75h9A1.5 1.5 0 0 1 18 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.75V5.25a1.5 1.5 0 0 1 1.5-1.5Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-9 sm:py-9">

            {/* =====================================
                USER INFORMATION
            ====================================== */}

            <section className="mb-9">
              <div className="mb-5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4d766e]">
                  Account
                </p>

                <h3 className="text-[17px] font-semibold tracking-[-0.025em] text-[#202824]">
                  Your Information
                </h3>

                <p className="mt-1 text-[13px] text-[#858c88]">
                  This information is associated with your account.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {/* INFO ITEM */}

                {[
                  {
                    label: "Full Name",
                    value: profile?.full_name,
                  },
                  {
                    label: "Email",
                    value: profile?.email,
                  },
                  {
                    label: "Phone",
                    value: consumerProfile?.phone,
                  },
                  {
                    label: "Address",
                    value: consumerProfile?.address,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#e8ebe9] bg-[#fafbf9] px-4 py-3.5 transition-colors duration-200 hover:bg-[#f7f9f7]"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9aa19e]">
                      {item.label}
                    </p>

                    <p className="mt-1.5 break-words text-[13px] font-medium leading-5 text-[#303934]">
                      {item.value || "Not available"}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* =====================================
                SUCCESS
            ====================================== */}

            {success && (
              <div className="mb-7 rounded-2xl border border-[#d5e8df] bg-[#f4faf7] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dcefe7] text-[#28705c]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-[#245846]">
                      Claim submitted
                    </p>

                    <p className="mt-1 text-[13px] leading-5 text-[#4c7768]">
                      {success}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =====================================
                ERROR
            ====================================== */}

            {error && (
              <div className="mb-7 rounded-2xl border border-[#f0d8d5] bg-[#fff8f7] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8e5e2] text-[#b34e45]">
                    <span className="text-sm font-semibold">!</span>
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-[#8f3f38]">
                      Unable to submit claim
                    </p>

                    <p className="mt-1 text-[13px] leading-5 text-[#ad5c54]">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =====================================
                FORM
            ====================================== */}

            <form onSubmit={handleSubmit} className="space-y-9">

              {/* =====================================
                  PRODUCT INFORMATION
              ====================================== */}

              <section>
                <div className="mb-5">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4d766e]">
                    Step 01
                  </p>

                  <h3 className="text-[17px] font-semibold tracking-[-0.025em] text-[#202824]">
                    Product Information
                  </h3>

                  <p className="mt-1 text-[13px] text-[#858c88]">
                    Tell us about the product covered by the warranty.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* COMPANY */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="companyId"
                      className="mb-2 block text-[13px] font-medium text-[#39423e]"
                    >
                      Company{" "}
                      <span className="text-[#b4584e]">*</span>
                    </label>

                    <select
                      id="companyId"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleChange}
                      required
                      className="h-[50px] w-full appearance-none rounded-[14px] border border-[#dfe4e1] bg-[#fbfcfb] px-4 text-[14px] text-[#29322e] outline-none transition-all duration-200 hover:border-[#c9d1cd] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                    >
                      <option value="">Select a company</option>

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
                      className="mb-2 block text-[13px] font-medium text-[#39423e]"
                    >
                      Product Name{" "}
                      <span className="text-[#b4584e]">*</span>
                    </label>

                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="e.g. Washing Machine"
                      required
                      className="h-[50px] w-full rounded-[14px] border border-[#dfe4e1] bg-[#fbfcfb] px-4 text-[14px] text-[#29322e] placeholder:text-[#a4aaa7] outline-none transition-all duration-200 hover:border-[#c9d1cd] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                    />
                  </div>

                  {/* SERIAL NUMBER */}

                  <div>
                    <label
                      htmlFor="serialNumber"
                      className="mb-2 block text-[13px] font-medium text-[#39423e]"
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
                      className="h-[50px] w-full rounded-[14px] border border-[#dfe4e1] bg-[#fbfcfb] px-4 text-[14px] text-[#29322e] placeholder:text-[#a4aaa7] outline-none transition-all duration-200 hover:border-[#c9d1cd] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                    />
                  </div>
                </div>
              </section>

              {/* =====================================
                  WARRANTY INFORMATION
              ====================================== */}

              <section className="border-t border-[#eceeec] pt-8">
                <div className="mb-5">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4d766e]">
                    Step 02
                  </p>

                  <h3 className="text-[17px] font-semibold tracking-[-0.025em] text-[#202824]">
                    Warranty Information
                  </h3>

                  <p className="mt-1 text-[13px] text-[#858c88]">
                    Provide the relevant purchase and warranty dates.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* PURCHASE DATE */}

                  <div>
                    <label
                      htmlFor="purchaseDate"
                      className="mb-2 block text-[13px] font-medium text-[#39423e]"
                    >
                      Purchase Date
                    </label>

                    <input
                      type="date"
                      id="purchaseDate"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      className="h-[50px] w-full rounded-[14px] border border-[#dfe4e1] bg-[#fbfcfb] px-4 text-[14px] text-[#29322e] outline-none transition-all duration-200 hover:border-[#c9d1cd] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                    />
                  </div>

                  {/* EXPIRY DATE */}

                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="mb-2 block text-[13px] font-medium text-[#39423e]"
                    >
                      Warranty Expiry Date{" "}
                      <span className="text-[#b4584e]">*</span>
                    </label>

                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                      className="h-[50px] w-full rounded-[14px] border border-[#dfe4e1] bg-[#fbfcfb] px-4 text-[14px] text-[#29322e] outline-none transition-all duration-200 hover:border-[#c9d1cd] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                    />
                  </div>
                </div>
              </section>

              {/* =====================================
                  ISSUE DETAILS
              ====================================== */}

              <section className="border-t border-[#eceeec] pt-8">
                <div className="mb-5">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4d766e]">
                    Step 03
                  </p>

                  <h3 className="text-[17px] font-semibold tracking-[-0.025em] text-[#202824]">
                    Issue Details
                  </h3>

                  <p className="mt-1 text-[13px] text-[#858c88]">
                    Describe the problem you are experiencing with the
                    product.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="issueDetails"
                    className="mb-2 block text-[13px] font-medium text-[#39423e]"
                  >
                    Describe the Issue{" "}
                    <span className="text-[#b4584e]">*</span>
                  </label>

                  <textarea
                    id="issueDetails"
                    name="issueDetails"
                    value={formData.issueDetails}
                    onChange={handleChange}
                    placeholder="Describe the issue with your product..."
                    rows="6"
                    required
                    className="w-full resize-none rounded-[14px] border border-[#dfe4e1] bg-[#fbfcfb] px-4 py-3.5 text-[14px] leading-6 text-[#29322e] placeholder:text-[#a4aaa7] outline-none transition-all duration-200 hover:border-[#c9d1cd] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  />

                  <p className="mt-2.5 text-[11px] leading-5 text-[#9aa19e]">
                    Please provide as much detail as possible to help the
                    company understand the problem.
                  </p>
                </div>
              </section>

              {/* =====================================
                  ACTIONS
              ====================================== */}

              <div className="flex flex-col-reverse gap-3 border-t border-[#eceeec] pt-7 sm:flex-row sm:items-center sm:justify-end">

                <button
                  type="button"
                  onClick={() => navigate("/consumer/dashboard")}
                  className="h-[48px] rounded-[14px] border border-[#dfe4e1] bg-white px-6 text-[13px] font-semibold text-[#4b5550] transition-all duration-200 hover:border-[#cbd2ce] hover:bg-[#fafbfa] focus:outline-none focus:ring-4 focus:ring-[#68736e]/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group h-[48px] rounded-[14px] bg-[#173f3a] px-7 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(23,63,58,0.16)] transition-all duration-200 hover:bg-[#123630] hover:shadow-[0_8px_24px_rgba(23,63,58,0.22)] focus:outline-none focus:ring-4 focus:ring-[#173f3a]/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Claim
                      <span className="text-white/60 transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* =====================================
            FOOTER
        ====================================== */}

        <div className="flex items-center justify-center gap-2 px-4 py-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5 text-[#9ba29f]"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3.75 5.25 6.5v5.25c0 4.1 2.7 7.55 6.75 8.5 4.05-.95 6.75-4.4 6.75-8.5V6.5L12 3.75Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.5 12 1.7 1.7 3.4-3.7"
            />
          </svg>

          <p className="text-center text-[11px] text-[#969e9a]">
            Your claim information is securely shared with the selected
            company for processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimForm;
