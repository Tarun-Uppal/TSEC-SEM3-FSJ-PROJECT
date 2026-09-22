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

      // Update the claim locally so the UI changes immediately
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#003C37]" />

          <p className="text-sm font-medium text-slate-500">
            Loading dashboard...
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
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "received":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ============================================
  // DASHBOARD
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#003C37]">
              Resolv360
            </p>

            <h1 className="mt-1 text-xl font-bold text-slate-900">
              Company Portal
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Logout
          </button>

        </div>
      </header>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            WELCOME
        ====================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold text-[#003C37]">
            Company Dashboard
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome, {profile.full_name}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage and review warranty claims submitted by your customers.
          </p>

        </div>

        {/* ======================================
            COMPANY INFORMATION
        ====================================== */}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <h3 className="text-lg font-semibold text-slate-900">
              Company Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your registered company details.
            </p>

          </div>

          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Contact Person
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {profile.full_name || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                {profile.email || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Company
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {company.company_name || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Company Address
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {company.address || "Not available"}
              </p>
            </div>

          </div>

        </section>

        {/* ======================================
            STATISTICS
        ====================================== */}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Claims
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalClaims}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003C37]/10 text-xl text-[#003C37]">
                #
              </div>

            </div>

          </div>

          {/* SUBMITTED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Submitted
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {submittedClaims}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
                !
              </div>

            </div>

          </div>

          {/* RECEIVED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Received
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {receivedClaims}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                ✓
              </div>

            </div>

          </div>

          {/* RESOLVED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Resolved
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {resolvedClaims}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                ✓
              </div>

            </div>

          </div>

        </section>

        {/* ======================================
            CLAIMS
        ====================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* CLAIM HEADER */}

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Warranty Claims
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Review claims and update their current status.
                </p>
              </div>

              <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {totalClaims}{" "}
                {totalClaims === 1 ? "Claim" : "Claims"}
              </div>

            </div>

          </div>

          {/* ====================================
              NO CLAIMS
          ==================================== */}

          {claims.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                —
              </div>

              <h4 className="mt-4 text-base font-semibold text-slate-800">
                No warranty claims
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                There are currently no warranty claims submitted to your
                company.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-200">

              {claims.map((claim) => (

                <div
                  key={claim.id}
                  className="px-6 py-6 transition hover:bg-slate-50"
                >

                  {/* CLAIM TOP */}

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="text-base font-bold text-slate-900">
                          {claim.claim_number}
                        </h4>

                        {/* STATUS BADGE */}

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            claim.status
                          )}`}
                        >
                          {claim.status || "Submitted"}
                        </span>

                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {claim.product_name || "Unknown Product"}
                      </p>

                    </div>

                    {/* =================================
                        STATUS EDITOR
                    ================================= */}

                    <div className="flex items-center gap-3">

                      <label
                        htmlFor={`status-${claim.id}`}
                        className="text-sm font-medium text-slate-500"
                      >
                        Update Status
                      </label>

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
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#003C37] focus:ring-2 focus:ring-[#003C37]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() +
                              status.slice(1)}
                          </option>
                        ))}
                      </select>

                      {updatingClaimId === claim.id && (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#003C37]" />
                      )}

                    </div>

                  </div>

                  {/* CLAIM DETAILS */}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {/* PRODUCT */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Product
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {claim.product_name || "Unknown"}
                      </p>

                    </div>

                    {/* CONSUMER */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Consumer
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {claim.profiles?.full_name || "Unknown"}
                      </p>

                    </div>

                    {/* EMAIL */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Consumer Email
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                        {claim.profiles?.email || "Unknown"}
                      </p>

                    </div>

                  </div>

                  {/* ISSUE */}

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Problem Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {claim.issue_details ||
                        "No description provided"}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ======================================
            FOOTER
        ====================================== */}

        <div className="py-8 text-center">

          <p className="text-xs text-slate-400">
            Resolv360 Warranty Management Portal
          </p>

        </div>

      </main>

    </div>
  );
};

export default CompanyDashboard;