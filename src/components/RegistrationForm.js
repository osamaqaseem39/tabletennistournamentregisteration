import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, CreditCard, User, Mail, Phone, Calendar, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiCall, API_CONFIG } from '../config/api';
import BANK_DETAILS from '../config/bankDetails';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    referralCode: '',
    paymentMethod: 'bank', // Changed default to bank transfer
    // Removed card-related fields since we're only doing bank transfer
    rulesAccepted: false,
    paymentProof: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState('');
  const [referralInfo, setReferralInfo] = useState(null);
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);

  // Handle referral code from URL parameter
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam && !formData.referralCode) {
      setFormData(prev => ({ ...prev, referralCode: refParam }));
      // Auto-validate the referral code
      setTimeout(() => {
        validateReferralCodeFromParam(refParam);
      }, 500);
    }
  }, [searchParams, formData.referralCode]);

  const validateReferralCodeFromParam = async (code) => {
    if (!code.trim()) return;
    
    setIsValidatingReferral(true);
    try {
      const response = await apiCall('/users/validate-referral', 'POST', {
        referralCode: code.trim()
      });

      if (response.success) {
        setReferralInfo(response.data);
        setErrors(prev => ({ ...prev, referralCode: '' }));
      } else {
        setReferralInfo(null);
        setErrors(prev => ({ ...prev, referralCode: response.message }));
      }
    } catch (error) {
      setReferralInfo(null);
      setErrors(prev => ({ ...prev, referralCode: 'Failed to validate referral code' }));
    } finally {
      setIsValidatingReferral(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear referral info when referral code changes
    if (name === 'referralCode') {
      setReferralInfo(null);
    }
  };

  const validateReferralCode = async () => {
    if (!formData.referralCode.trim()) {
      setErrors(prev => ({ ...prev, referralCode: 'Please enter a referral code' }));
      return;
    }

    setIsValidatingReferral(true);
    try {
      const response = await apiCall('/users/validate-referral', 'POST', {
        referralCode: formData.referralCode.trim()
      });

      if (response.success) {
        setReferralInfo(response.data);
        setErrors(prev => ({ ...prev, referralCode: '' }));
      } else {
        setReferralInfo(null);
        setErrors(prev => ({ ...prev, referralCode: response.message }));
      }
    } catch (error) {
      setReferralInfo(null);
      setErrors(prev => ({ ...prev, referralCode: 'Failed to validate referral code' }));
    } finally {
      setIsValidatingReferral(false);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (step === 3) {
      // No validation needed for payment step since we're just showing bank details
    }

    if (step === 4) {
      if (!formData.rulesAccepted) newErrors.rulesAccepted = 'You must accept the rules to continue';
      if (!formData.paymentProof) newErrors.paymentProof = 'Payment proof is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Prepare user data for registration
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        referralCode: formData.referralCode,
        paymentMethod: 'bank' // Always bank transfer
      };

      // Register user
      const result = await register(userData);
      
      if (result.success) {
        // If registration is successful, navigate to status page
        navigate('/status');
      } else {
        setSubmitError(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Account Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`input-field ${errors.password ? 'border-red-500' : ''}`}
          placeholder="Create a password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`input-field pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="First name"
            />
          </div>
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
            placeholder="Last name"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="Phone number"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`input-field pl-10 ${errors.address ? 'border-red-500' : ''}`}
            placeholder="Enter your full address(just in case of emergency)"
            rows="3"
          />
        </div>
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>



      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`input-field pl-10 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Referral Code (Optional)
        </label>
        <div className="relative">
          <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleInputChange}
            onBlur={validateReferralCode}
            className={`input-field pl-10 ${errors.referralCode || isValidatingReferral ? 'border-red-500' : ''}`}
            placeholder="Enter referral code if you have one"
          />
        </div>
        {errors.referralCode && <p className="text-red-500 text-sm mt-1">{errors.referralCode}</p>}
        {isValidatingReferral && <p className="text-sm text-gray-500 mt-1">Validating...</p>}
        
        {/* URL Referral Code Indicator */}
        {searchParams.get('ref') && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Referral link detected!</span> This code was automatically filled from your referral link.
            </p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-1">
          Use someone's referral code to get PKR 50 discount. Referrer must have at least 5 referrals to provide discount.
        </p>
        {referralInfo && (
           <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
             <div className="flex items-center mb-2">
               <Gift className="h-5 w-5 text-green-600 mr-2" />
               <span className="font-semibold text-green-800">Valid Referral Code!</span>
             </div>
             <div className="text-sm text-green-700 space-y-1">
               <p>Referrer: <span className="font-medium">{referralInfo.referrerName}</span></p>
               <p>Discount: <span className="font-medium">PKR {referralInfo.discount}</span></p>
               <p>Original Amount: <span className="font-medium">PKR {referralInfo.originalAmount}</span></p>
               <p className="font-semibold text-green-800">Final Amount: PKR {referralInfo.finalAmount}</p>
             </div>
           </div>
         )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Payment Information</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">PKR </span>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-blue-900 mb-2">Bank Transfer Payment</h4>
            <p className="text-blue-700 mb-4">
              Please transfer the registration fee to the following bank account and upload the payment screenshot.
            </p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Details</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Account Holder Name</label>
            <p className="text-lg font-semibold text-gray-900">{BANK_DETAILS.accountHolderName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Account Number</label>
            <p className="text-lg font-semibold text-gray-900">{BANK_DETAILS.accountNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Bank Name</label>
            <p className="text-lg font-semibold text-gray-900">{BANK_DETAILS.bankName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">IBAN Code</label>
            <p className="text-lg font-semibold text-gray-900">{BANK_DETAILS.IBANCode}</p>
          </div>

        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xs">!</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please include your name in the transfer description/reference so we can identify your payment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Amount to Pay */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-green-900 mb-4">Amount to Transfer</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-700">Base Registration Fee:</span>
            <span className="font-medium text-green-900">PKR 1500</span>
          </div>
          {referralInfo && (
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Referral Discount:</span>
              <span className="font-medium text-green-900">-PKR {referralInfo.discount}</span>
            </div>
          )}
          <div className="border-t border-green-300 pt-2 flex justify-between">
            <span className="font-semibold text-green-900">Final Amount:</span>
            <span className="text-xl font-bold text-green-900">PKR {referralInfo ? referralInfo.finalAmount : 1500}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Instructions</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {BANK_DETAILS.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Need Help with Payment?</h5>
          <div className="text-sm text-blue-700 space-y-1">
            <p>Phone: {BANK_DETAILS.contactInfo.phone}</p>
            {BANK_DETAILS.contactInfo.whatsapp && (
              <p>WhatsApp: {BANK_DETAILS.contactInfo.whatsapp}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Upload Payment Proof</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">📸</span>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-blue-900 mb-2">Payment Screenshot Required</h4>
            <p className="text-blue-700">
              Please upload a screenshot of your bank transfer confirmation to complete your registration.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tournament Rules</h4>
        <div className="space-y-3 text-sm text-gray-700">
          
          <p>1. Proper sports attire is mandatory</p>
          <p>2. Equipment will be provided by the organizers</p>
          <p>3. Matches will follow standard table tennis rules</p>
          <p>4. Decisions of the referees are final</p>
          <p>5. No refunds will be provided after registration</p>
        </div>
        
        <label className="flex items-start mt-4 cursor-pointer">
          <input
            type="checkbox"
            name="rulesAccepted"
            checked={formData.rulesAccepted}
            onChange={handleInputChange}
            className="mt-1 mr-3 h-4 w-4 text-primary-600"
          />
          <span className="text-sm text-gray-700">
            I have read and agree to the tournament rules and regulations *
          </span>
        </label>
        {errors.rulesAccepted && <p className="text-red-500 text-sm mt-1">{errors.rulesAccepted}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Proof Screenshot *
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            name="paymentProof"
            onChange={handleInputChange}
            accept="image/*"
            className="hidden"
            id="paymentProof"
          />
          <label htmlFor="paymentProof" className="cursor-pointer">
            <span className="text-primary-600 hover:text-primary-700 font-medium">
              Click to upload
            </span>
            <span className="text-gray-500"> or drag and drop</span>
          </label>
          <p className="text-sm text-gray-500 mt-2">
            PNG, JPG, JPEG up to 10MB
          </p>
          {formData.paymentProof && (
            <div className="mt-4">
              <p className="text-sm text-green-600 font-medium">
                ✓ {formData.paymentProof.name}
              </p>
            </div>
          )}
        </div>
        {errors.paymentProof && <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs">✓</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-800">
              <strong>Almost done!</strong> After uploading your payment proof, your registration will be submitted for review. 
              You'll receive a confirmation email once your payment is verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Account', component: renderStep1 },
    { number: 2, title: 'Personal', component: renderStep2 },
    { number: 3, title: 'Payment Details', component: renderStep3 },
    { number: 4, title: 'Upload Proof', component: renderStep4 }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Registration</h1>
        <p className="text-gray-600">Complete your registration in 4 simple steps</p>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{submitError}</span>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep > step.number 
                ? 'bg-green-500 border-green-500 text-white' 
                : currentStep === step.number 
                ? 'bg-primary-600 border-primary-600 text-white' 
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {currentStep > step.number ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-20 h-1 mx-4 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {steps[currentStep - 1].component()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                Previous
              </button>
            )}
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary ml-auto"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm; 