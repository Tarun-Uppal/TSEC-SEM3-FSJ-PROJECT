import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  getUserProfile,
  getConsumerProfile,
  getCompanies,
  createClaim,
} from "../services/authService";


const ClaimForm = () => {

  const navigate = useNavigate();

  // ============================================
  // USER DATA
  // ============================================

  const [profile, setProfile] = useState(null);
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
  // LOAD USER + COMPANIES
  // ============================================

  useEffect(() => {

    async function loadUserData() {

      try {

        setLoading(true);
        setError("");

        // Load user profile
        const userProfile = await getUserProfile();

        // Load consumer information
        const consumerData = await getConsumerProfile();

        // Load all companies
        const companyData = await getCompanies();

        setProfile(userProfile);
        setConsumerProfile(consumerData);
        setCompanies(companyData);

      } catch (error) {

        console.error("Error loading claim form:", error);

        setError(error.message);

      } finally {

        setLoading(false);

      }
    }

    loadUserData();

  }, []);


  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

  };


  // ============================================
  // SUBMIT CLAIM
  // ============================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
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

    try {

      setSubmitting(true);

      // Create claim
      const claim = await createClaim({
        companyId: formData.companyId,
        productName: formData.productName,
        expiryDate: formData.expiryDate,
        serialNumber: formData.serialNumber,
        purchaseDate: formData.purchaseDate,
        issueDetails: formData.issueDetails,
      });

      console.log("Claim created:", claim);

      // Show success message
      setSuccess(
        `Claim submitted successfully! Your claim number is ${claim.claim_number}.`
      );

      // Clear claim fields
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

  if (loading) {
    return (
      <div className="claim-loading">
        <p>Loading...</p>
      </div>
    );
  }


  // ============================================
  // PAGE
  // ============================================

  return (
    console.log(companies),

    <div className="claim-page">

      <div className="claim-card">

        <h1>Warranty Claim</h1>

        <p className="claim-subtitle">
          Submit your warranty claim using the form below.
        </p>


        {/* =====================================
            USER INFORMATION
        ====================================== */}

        <div className="user-information">

          <h2>Your Information</h2>

          <p>
            <strong>Full Name:</strong>{" "}
            {profile?.full_name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {profile?.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {consumerProfile?.phone}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {consumerProfile?.address}
          </p>

        </div>


        {/* =====================================
            SUCCESS MESSAGE
        ====================================== */}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}


        {/* =====================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =====================================
            CLAIM FORM
        ====================================== */}

        <form onSubmit={handleSubmit}>


          {/* COMPANY */}

          <div className="form-group">

            <label htmlFor="companyId">
              Company
            </label>

            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required
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


          {/* PRODUCT */}

          <div className="form-group">

            <label htmlFor="productName">
              Product Name
            </label>

            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter the product name"
              required
            />

          </div>


          {/* EXPIRY DATE */}

          <div className="form-group">

            <label htmlFor="expiryDate">
              Warranty Expiry Date
            </label>

            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />

          </div>


          {/* PURCHASE DATE */}

          <div className="form-group">

            <label htmlFor="purchaseDate">
              Purchase Date
            </label>

            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
            />

          </div>


          {/* SERIAL NUMBER */}

          <div className="form-group">

            <label htmlFor="serialNumber">
              Serial Number
            </label>

            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Enter the serial number"
            />

          </div>


          {/* ISSUE DETAILS */}

          <div className="form-group">

            <label htmlFor="issueDetails">
              Issue Details
            </label>

            <textarea
              id="issueDetails"
              name="issueDetails"
              value={formData.issueDetails}
              onChange={handleChange}
              placeholder="Describe the issue with your product..."
              rows="5"
              required
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={submitting}
          >

            {submitting
              ? "Submitting..."
              : "Submit Claim"
            }

          </button>


        </form>


        {/* BACK TO DASHBOARD */}

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/consumer-dashboard")}
        >
          Back to Dashboard
        </button>

      </div>

    </div>

  );
};


export default ClaimForm;