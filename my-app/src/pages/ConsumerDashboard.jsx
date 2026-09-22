import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import {
  getConsumerProfile,
  getUserClaims,
  logoutUser,
} from "../services/authService";

const ConsumerDashboard = () => {
  const navigate = useNavigate();

  const { user, profile } = useAuth();

  const [consumerProfile, setConsumerProfile] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // LOAD CONSUMER DATA
  // ============================================

  useEffect(() => {
    if (!user?.id) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [consumerData, claimsData] = await Promise.all([
          getConsumerProfile(user.id),
          getUserClaims(user.id),
        ]);

        setConsumerProfile(consumerData);
        setClaims(claimsData);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

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

  if (loading || !profile || !consumerProfile) {
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

  const pendingClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "pending"
  ).length;

  const approvedClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "approved"
  ).length;

  const resolvedClaims = claims.filter(
    (claim) => claim.status?.toLowerCase() === "resolved"
  ).length;

  // ============================================
  // STATUS STYLE
  // ============================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

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
              Consumer Portal
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
          MAIN
      ======================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            WELCOME
        ====================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold text-[#003C37]">
            Consumer Dashboard
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome, {profile.full_name}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Track your warranty claims and submit new claims.
          </p>

        </div>

        {/* ======================================
            PROFILE + NEW CLAIM
        ====================================== */}

        <section className="mb-8 grid gap-6 lg:grid-cols-3">

          {/* PROFILE */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

            <div className="border-b border-slate-200 px-6 py-5">

              <h3 className="text-lg font-semibold text-slate-900">
                Your Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your registered account information.
              </p>

            </div>

            <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">

              {/* NAME */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {profile.full_name || "Not available"}
                </p>
              </div>

              {/* EMAIL */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {profile.email || "Not available"}
                </p>
              </div>

              {/* PHONE */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {consumerProfile.phone || "Not available"}
                </p>
              </div>

              {/* ADDRESS */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Address
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {consumerProfile.address || "Not available"}
                </p>
              </div>

            </div>

          </div>

          {/* NEW CLAIM CARD */}

          <div className="flex flex-col justify-between rounded-2xl bg-[#003C37] p-6 text-white shadow-sm">

            <div>

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                +
              </div>

              <h3 className="text-xl font-bold">
                Need to make a claim?
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/70">
                Submit a new warranty claim and provide the details of your
                product issue.
              </p>

            </div>

            <button
              onClick={() => navigate("/ClaimForm")}
              className="mt-6 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#003C37] transition hover:bg-slate-100"
            >
              Submit New Claim
            </button>

          </div>

        </section>

        {/* ======================================
            CLAIM STATISTICS
        ====================================== */}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Total Claims
            </p>

            <div className="mt-2 flex items-end justify-between">

              <p className="text-3xl font-bold text-slate-900">
                {totalClaims}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003C37]/10 text-lg font-bold text-[#003C37]">
                #
              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Pending
            </p>

            <div className="mt-2 flex items-end justify-between">

              <p className="text-3xl font-bold text-slate-900">
                {pendingClaims}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg font-bold text-amber-600">
                !
              </div>

            </div>

          </div>

          {/* APPROVED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Approved
            </p>

            <div className="mt-2 flex items-end justify-between">

              <p className="text-3xl font-bold text-slate-900">
                {approvedClaims}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                ✓
              </div>

            </div>

          </div>

          {/* RESOLVED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Resolved
            </p>

            <div className="mt-2 flex items-end justify-between">

              <p className="text-3xl font-bold text-slate-900">
                {resolvedClaims}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-600">
                ✓
              </div>

            </div>

          </div>

        </section>

        {/* ======================================
            WARRANTY CLAIMS
        ====================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Your Warranty Claims
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  View the status and details of your submitted claims.
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
                No warranty claims yet
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                You haven't submitted any warranty claims. When you submit
                one, it will appear here.
              </p>

              <button
                onClick={() => navigate("/ClaimForm")}
                className="mt-5 rounded-xl bg-[#003C37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#002f2b]"
              >
                Submit Your First Claim
              </button>

            </div>

          ) : (

            <div className="divide-y divide-slate-200">

              {claims.map((claim) => (

                <div
                  key={claim.id}
                  className="px-6 py-6 transition hover:bg-slate-50"
                >

                  {/* CLAIM HEADER */}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="text-base font-bold text-slate-900">
                          {claim.claim_number}
                        </h4>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            claim.status
                          )}`}
                        >
                          {claim.status || "Unknown"}
                        </span>

                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {claim.companies?.company_name ||
                          "Unknown Company"}
                      </p>

                    </div>

                  </div>

                  {/* CLAIM DETAILS */}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {/* COMPANY */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Company
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {claim.companies?.company_name ||
                          "Unknown Company"}
                      </p>

                    </div>

                    {/* CLAIM ID */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Claim ID
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {claim.claim_number}
                      </p>

                    </div>

                    {/* EXPIRY */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Warranty Expiry
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {claim.expiry_date || "Not available"}
                      </p>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Issue Description
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

export default ConsumerDashboard;