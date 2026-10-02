import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import {
  getCompanyProfile,
  getCompanyClaims,
  updateClaimStatus,
  logoutUser,
} from "../services/authService";

const STATUS_OPTIONS = ["submitted", "received", "resolved"];

const CompanyDashboard = () => {
  const navigate = useNavigate();

  const { user, profile } = useAuth();

  const [company, setCompany] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingClaimId, setUpdatingClaimId] = useState(null);

  // ============================================
  // LOAD COMPANY DATA
  // ============================================

  useEffect(() => {
    if (!user?.id) return;

    const loadCompanyData = async () => {
      try {
        setLoading(true);

        const companyProfile = await getCompanyProfile(user.id);
        const companyClaims = await getCompanyClaims(user.id);

        setCompany(companyProfile);
        setClaims(companyClaims);
      } catch (error) {
        console.error("Error loading company data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [user?.id]);

  // ============================================
  // UPDATE CLAIM STATUS
  // ============================================

  const handleStatusChange = async (claimId, newStatus) => {
    try {
      setUpdatingClaimId(claimId);

      await updateClaimStatus(claimId, newStatus);

      setClaims((currentClaims) =>
        currentClaims.map((claim) =>
          claim.id === claimId
            ? {
                ...claim,
                status: newStatus,
              }
            : claim
        )
      );
    } catch (error) {
      console.error("Error updating claim status:", error);
      alert("Unable to update claim status. Please try again.");
    } finally {
      setUpdatingClaimId(null);
    }
  };

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading || !profile || !company) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
        <div className="flex flex-col items-center">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#d9dfdc]" />
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#173f3a]" />
          </div>

          <p className="mt-5 text-[13px] font-medium tracking-[-0.01em] text-[#7a817e]">
            Loading your dashboard
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // CLAIM COUNTS
  // ============================================

  const totalClaims = claims.length;

  const submittedClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "submitted"
  ).length;

  const receivedClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "received"
  ).length;

  const resolvedClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "resolved"
  ).length;

  // ============================================
  // STATUS STYLING
  // ============================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return "border-[#eadfc8] bg-[#fcf8ee] text-[#94733a]";

      case "received":
        return "border-[#d8e4e8] bg-[#f2f7f8] text-[#477080]";

      case "resolved":
        return "border-[#d5e7df] bg-[#f2f8f5] text-[#3e735f]";

      default:
        return "border-[#e2e6e3] bg-[#f7f8f7] text-[#69726d]";
    }
  };

  // ============================================
  // DASHBOARD
  // ============================================

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1d2421]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="sticky top-0 z-30 border-b border-[#e4e7e4]/80 bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#173f3a] shadow-[0_4px_12px_rgba(23,63,58,0.14)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-white"
                stroke="currentColor"
                strokeWidth="1.8"
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
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#356b62]">
                Resolv360
              </p>

              <p className="mt-0.5 text-[13px] font-medium tracking-[-0.01em] text-[#4c5551]">
                Company Portal
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="h-9 rounded-[11px] border border-[#dfe4e1] bg-white px-4 text-[12px] font-semibold text-[#59625e] shadow-[0_1px_2px_rgba(20,30,25,0.02)] transition-all duration-200 hover:border-[#cdd4d0] hover:bg-[#fafbfa] hover:text-[#29322e] focus:outline-none focus:ring-4 focus:ring-[#68736e]/10"
          >
            Log Out
          </button>

        </div>
      </header>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* ======================================
            WELCOME
        ====================================== */}

        <section className="mb-9">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#32675e]" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#4d766e]">
                  Company Dashboard
                </p>
              </div>

              <h1 className="text-[34px] font-semibold tracking-[-0.045em] text-[#18201d] sm:text-[40px]">
                Welcome, {profile.full_name}
              </h1>

              <p className="mt-2.5 max-w-2xl text-[14px] leading-6 text-[#747c78] sm:text-[15px]">
                Manage and review warranty claims submitted by your customers.
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-full border border-[#e0e5e2] bg-white/70 px-4 py-2 text-[11px] font-medium text-[#727a76] backdrop-blur-sm">
                {company.company_name || "Company"}
              </div>
            </div>

          </div>
        </section>

        {/* ======================================
            COMPANY INFORMATION
        ====================================== */}

        <section className="mb-7 overflow-hidden rounded-[24px] border border-[#e2e6e3] bg-white shadow-[0_14px_45px_rgba(24,39,34,0.045)]">

          <div className="border-b border-[#eceeec] bg-[#fcfcfb] px-6 py-5 sm:px-7">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#edf4f1] text-[#356b62]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 20.25h15M6.75 20.25V6.75L12 4.5l5.25 2.25v13.5M9 9h.01M9 12h.01M9 15h.01M15 9h.01M15 12h.01M15 15h.01"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#202824]">
                  Company Information
                </h2>

                <p className="mt-0.5 text-[12px] text-[#858c88]">
                  Your registered company details.
                </p>
              </div>
            </div>

          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">

            {[
              {
                label: "Contact Person",
                value: profile.full_name,
              },
              {
                label: "Email",
                value: profile.email,
              },
              {
                label: "Company",
                value: company.company_name,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[16px] border border-[#e8ebe9] bg-[#fafbf9] px-4 py-3.5 transition-colors duration-200 hover:bg-[#f7f9f7]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9aa19e]">
                  {item.label}
                </p>

                <p className="mt-1.5 break-words text-[13px] font-medium leading-5 text-[#303934]">
                  {item.value || "Not available"}
                </p>
              </div>
            ))}

            <div className="rounded-[16px] border border-[#e8ebe9] bg-[#fafbf9] px-4 py-3.5 transition-colors duration-200 hover:bg-[#f7f9f7] sm:col-span-2 lg:col-span-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9aa19e]">
                Company Address
              </p>

              <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#303934]">
                {company.address || "Not available"}
              </p>
            </div>

          </div>
        </section>

        {/* ======================================
            STATISTICS
        ====================================== */}

        <section className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="group rounded-[20px] border border-[#e2e6e3] bg-white p-5 shadow-[0_10px_30px_rgba(24,39,34,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(24,39,34,0.06)]">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#7c8580]">
                  Total Claims
                </p>

                <p className="mt-2 text-[30px] font-semibold tracking-[-0.045em] text-[#1c2521]">
                  {totalClaims}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#edf4f1] text-[#32675e]">
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
                    d="M7 4.75h10M7 9.25h10M7 13.75h6M5.75 3.75h12.5A1.75 1.75 0 0 1 20 5.5v13a1.75 1.75 0 0 1-1.75 1.75H5.75A1.75 1.75 0 0 1 4 18.5v-13a1.75 1.75 0 0 1 1.75-1.75Z"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#edf1ef]">
              <div className="h-full w-full rounded-full bg-[#32675e]" />
            </div>
          </div>

          {/* SUBMITTED */}

          <div className="group rounded-[20px] border border-[#e2e6e3] bg-white p-5 shadow-[0_10px_30px_rgba(24,39,34,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(24,39,34,0.06)]">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#7c8580]">
                  Submitted
                </p>

                <p className="mt-2 text-[30px] font-semibold tracking-[-0.045em] text-[#1c2521]">
                  {submittedClaims}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fbf4e6] text-[#9a783f]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="7.75" />
                  <path
                    strokeLinecap="round"
                    d="M12 8v4.5l2.75 1.75"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#f3eee4]">
              <div className="h-full rounded-full bg-[#b18a4c]" style={{ width: totalClaims ? `${(submittedClaims / totalClaims) * 100}%` : "0%" }} />
            </div>
          </div>

          {/* RECEIVED */}

          <div className="group rounded-[20px] border border-[#e2e6e3] bg-white p-5 shadow-[0_10px_30px_rgba(24,39,34,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(24,39,34,0.06)]">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#7c8580]">
                  Received
                </p>

                <p className="mt-2 text-[30px] font-semibold tracking-[-0.045em] text-[#1c2521]">
                  {receivedClaims}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef5f7] text-[#4d7380]">
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
                    d="m5.5 12 4.1 4.1L18.5 7"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#edf2f3]">
              <div className="h-full rounded-full bg-[#638895]" style={{ width: totalClaims ? `${(receivedClaims / totalClaims) * 100}%` : "0%" }} />
            </div>
          </div>

          {/* RESOLVED */}

          <div className="group rounded-[20px] border border-[#e2e6e3] bg-white p-5 shadow-[0_10px_30px_rgba(24,39,34,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(24,39,34,0.06)]">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#7c8580]">
                  Resolved
                </p>

                <p className="mt-2 text-[30px] font-semibold tracking-[-0.045em] text-[#1c2521]">
                  {resolvedClaims}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#edf6f1] text-[#3f745f]">
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
                    d="m5.5 12 4.1 4.1L18.5 7"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#edf3ef]">
              <div className="h-full rounded-full bg-[#5e8c78]" style={{ width: totalClaims ? `${(resolvedClaims / totalClaims) * 100}%` : "0%" }} />
            </div>
          </div>

        </section>

        {/* ======================================
            CLAIMS
        ====================================== */}

        <section className="overflow-hidden rounded-[24px] border border-[#e2e6e3] bg-white shadow-[0_14px_45px_rgba(24,39,34,0.045)]">

          {/* CLAIM HEADER */}

          <div className="border-b border-[#eceeec] bg-[#fcfcfb] px-6 py-6 sm:px-7">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#edf4f1] text-[#356b62]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.5 4.5h11A1.5 1.5 0 0 1 19 6v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18V6a1.5 1.5 0 0 1 1.5-1.5Z"
                    />
                    <path
                      strokeLinecap="round"
                      d="M8.5 8h7M8.5 12h7M8.5 16h4"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#202824]">
                    Warranty Claims
                  </h2>

                  <p className="mt-0.5 text-[12px] text-[#858c88]">
                    Review claims and update their current status.
                  </p>
                </div>
              </div>

              <div className="self-start rounded-full border border-[#e1e6e3] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#69736e] sm:self-auto">
                {totalClaims} {totalClaims === 1 ? "Claim" : "Claims"}
              </div>

            </div>
          </div>

          {/* ====================================
              NO CLAIMS
          ==================================== */}

          {claims.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f3f1] text-[#a0a8a4]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.5 4.5h11A1.5 1.5 0 0 1 19 6v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18V6a1.5 1.5 0 0 1 1.5-1.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    d="M9 9h6M9 13h6"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.015em] text-[#343d38]">
                No warranty claims
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[#858c88]">
                There are currently no warranty claims submitted to your
                company.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-[#eceeec]">

              {claims.map((claim) => (

                <article
                  key={claim.id}
                  className="px-5 py-6 transition-colors duration-200 hover:bg-[#fcfdfc] sm:px-7 sm:py-7"
                >

                  {/* CLAIM TOP */}

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2.5">

                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-[#202824]">
                          {claim.claim_number}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize tracking-wide ${getStatusStyle(
                            claim.status
                          )}`}
                        >
                          {claim.status || "Submitted"}
                        </span>

                      </div>

                      <p className="mt-2 text-[13px] font-medium text-[#59625e]">
                        {claim.product_name || "Unknown Product"}
                      </p>

                    </div>

                    {/* STATUS EDITOR */}

                    <div className="flex flex-wrap items-center gap-2.5">

                      <label
                        htmlFor={`status-${claim.id}`}
                        className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#969e9a]"
                      >
                        Status
                      </label>

                      <div className="relative">
                        <select
                          id={`status-${claim.id}`}
                          value={
                            claim.status?.toLowerCase() || "submitted"
                          }
                          disabled={updatingClaimId === claim.id}
                          onChange={(event) =>
                            handleStatusChange(
                              claim.id,
                              event.target.value
                            )
                          }
                          className="h-9 min-w-[128px] appearance-none rounded-[11px] border border-[#dfe4e1] bg-white pl-3 pr-8 text-[12px] font-semibold text-[#4c5551] outline-none transition-all duration-200 hover:border-[#cbd3ce] focus:border-[#32675e] focus:ring-4 focus:ring-[#32675e]/[0.08] disabled:cursor-not-allowed disabled:bg-[#f5f6f5]"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() +
                                status.slice(1)}
                            </option>
                          ))}
                        </select>

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#89918d]"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m7 10 5 5 5-5"
                          />
                        </svg>
                      </div>

                      {updatingClaimId === claim.id && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#dfe4e1] border-t-[#32675e]" />
                      )}

                    </div>

                  </div>

                  {/* CLAIM DETAILS */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                    {/* PRODUCT */}

                    <div className="rounded-[15px] border border-[#e8ebe9] bg-[#fafbf9] px-4 py-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa19e]">
                        Product
                      </p>

                      <p className="mt-1.5 break-words text-[13px] font-medium leading-5 text-[#303934]">
                        {claim.product_name || "Unknown"}
                      </p>
                    </div>

                    {/* CONSUMER */}

                    <div className="rounded-[15px] border border-[#e8ebe9] bg-[#fafbf9] px-4 py-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa19e]">
                        Consumer
                      </p>

                      <p className="mt-1.5 break-words text-[13px] font-medium leading-5 text-[#303934]">
                        {claim.profiles?.full_name || "Unknown"}
                      </p>
                    </div>

                    {/* EMAIL */}

                    <div className="rounded-[15px] border border-[#e8ebe9] bg-[#fafbf9] px-4 py-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa19e]">
                        Consumer Email
                      </p>

                      <p className="mt-1.5 break-all text-[13px] font-medium leading-5 text-[#303934]">
                        {claim.profiles?.email || "Unknown"}
                      </p>
                    </div>

                  </div>

                  {/* ISSUE */}

                  <div className="mt-3 rounded-[16px] border border-[#e5e9e6] bg-[#f8faf8] px-4 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969e9a]">
                      Problem Description
                    </p>

                    <p className="mt-2 text-[13px] leading-6 text-[#59625e]">
                      {claim.issue_details ||
                        "No description provided"}
                    </p>
                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

        {/* ======================================
            FOOTER
        ====================================== */}

        <footer className="flex items-center justify-center gap-2 py-8">
          <div className="h-1 w-1 rounded-full bg-[#a4aca8]" />

          <p className="text-[11px] text-[#969e9a]">
            Resolv360 Warranty Management Portal
          </p>

          <div className="h-1 w-1 rounded-full bg-[#a4aca8]" />
        </footer>

      </main>
    </div>
  );
};

export default CompanyDashboard;
