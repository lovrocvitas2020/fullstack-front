import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const PaymentSlipForm = () => {
  const [formData, setFormData] = useState({
    currencyCode: '',
    amount: '',
    payerName: '',
    payerAddress: '',
    payerCity: '',
    recipientName: '',
    recipientAddress: '',
    recipientCity: '',
    recipientAccount: '',
    modelNumber: '',
    callModelNumber: '',
    purposeCode: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.currencyCode || !formData.amount || !formData.payerName || !formData.recipientName) {
      setMessage({ type: 'error', text: 'Please fill out all required fields.' });
      return false;
    }
    if (formData.amount <= 0) {
      setMessage({ type: 'error', text: 'Amount must be a positive number.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:8080/addpaymentslips', formData);
      console.log("formData:", formData)
      setMessage({ type: 'success', text: 'Payment slip submitted successfully!' });
      setFormData({
        currencyCode: '',
        amount: '',
        payerName: '',
        payerAddress: '',
        payerCity: '',
        recipientName: '',
        recipientAddress: '',
        recipientCity: '',
        recipientAccount: '',
        modelNumber: '',
        callModelNumber: '',
        purposeCode: '',
        description: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'There was an error submitting the payment slip. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
         <Link className="btn btn-primary mb-3" to="/viewpaymentslips">
        🏠 Back to View Payment Slips
      </Link>
      <h2 className="mb-3">Enter Payment Slip Data</h2>
      
      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">Currency Code:</label>
            <input type="text" name="currencyCode" value={formData.currencyCode} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Amount:</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label">Payer Name:</label>
            <input type="text" name="payerName" value={formData.payerName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Payer Address:</label>
            <input type="text" name="payerAddress" value={formData.payerAddress} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label">Payer City:</label>
            <input type="text" name="payerCity" value={formData.payerCity} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Recipient Name:</label>
            <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label">Recipient Address:</label>
            <input type="text" name="recipientAddress" value={formData.recipientAddress} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Recipient City:</label>
            <input type="text" name="recipientCity" value={formData.recipientCity} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label">Recipient Account:</label>
            <input type="text" name="recipientAccount" value={formData.recipientAccount} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Model Number:</label>
            <input type="text" name="modelNumber" value={formData.modelNumber} onChange={handleChange} className="form-control" />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            <label className="form-label">Call Model Number:</label>
            <input type="text" name="callModelNumber" value={formData.callModelNumber} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Purpose Code:</label>
            <input type="text" name="purposeCode" value={formData.purposeCode} onChange={handleChange} className="form-control" />
          </div>
        </div>

        <div className="mt-3">
          <label className="form-label">Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3"></textarea>
        </div>

        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default PaymentSlipForm;
