# Bank Details Setup for Tournament Registration

## Overview
This system has been updated to use manual bank transfer payments instead of online payment processing. Users will transfer money to your bank account and upload screenshots as proof of payment.

## How to Update Bank Details

### 1. Edit the Configuration File
Open `frontend/src/config/bankDetails.js` and update the following fields with your actual bank information:

```javascript
export const BANK_DETAILS = {
  accountHolderName: "Your Full Name Here",        // ← Update this
  accountNumber: "1234567890",                     // ← Update this
  bankName: "Your Bank Name",                      // ← Update this
  IBANCode: "ABCD0001234",                        // ← Update this
  branch: "Your Branch Name (Optional)",           // ← Update this (optional)
  upiId: "yourname@bank (Optional)",              // ← Update this (optional)
  
  // Contact information for payment queries
  contactInfo: {
    phone: "+91 98765 43210",                     // ← Update this
    email: "payments@yourtournament.com",          // ← Update this
    whatsapp: "+91 98765 43210"                   // ← Update this (optional)
  }
};
```

### 2. Required Fields
- **accountHolderName**: Your full name as it appears on the bank account
- **accountNumber**: Your bank account number
- **bankName**: Name of your bank
- **IBANCode**: IBAN code of your bank branch

### 3. Optional Fields
- **branch**: Your bank branch name (will be displayed if provided)
- **upiId**: Your UPI ID if you want to offer UPI payments (will be displayed if provided)
- **whatsapp**: WhatsApp number for payment queries (will be displayed if provided)

### 4. Contact Information
Update the contact details so users can reach you if they have payment-related questions:
- **phone**: Your phone number
- **email**: Your email address
- **whatsapp**: Your WhatsApp number (optional)

## What Users Will See

### Payment Step (Step 3)
Users will see:
- Your bank account details clearly displayed
- The exact amount they need to transfer
- Payment instructions
- Your contact information for support

### Upload Proof Step (Step 4)
Users will:
- Accept tournament rules
- Upload a screenshot of their bank transfer confirmation
- Submit their registration

### Status Screen
After registration, users can:
- View their payment status
- See payment method details
- Check if payment proof has been uploaded
- Access your contact information

## Payment Flow

1. **User fills registration form** (Steps 1-2)
2. **User sees your bank details** (Step 3)
3. **User transfers money** to your account
4. **User uploads screenshot** of transfer confirmation (Step 4)
5. **Registration submitted** for your review
6. **You verify payment** and approve registration

## Benefits of This System

- ✅ **No transaction fees** from payment gateways
- ✅ **Full control** over payment verification
- ✅ **Simple setup** - just update one config file
- ✅ **Professional appearance** with clear bank details
- ✅ **User-friendly** with step-by-step instructions
- ✅ **Contact support** built into the payment flow

## Security Notes

- Users only see your bank details, not sensitive information
- Payment verification is manual, giving you full control
- Screenshots are stored securely for verification
- No credit card information is collected or stored

## Testing

After updating the bank details:
1. Start the frontend application
2. Go through the registration process
3. Verify that your bank details appear correctly in Step 3
4. Check that contact information is displayed properly

## Need Help?

If you need assistance updating the bank details or have questions about the payment system, please refer to the main project documentation or contact the development team. 