import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import bwipjs from 'bwip-js';

const PaymentSlipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

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

  useEffect(() => {
    if (id) {
      fetchPaymentSlip(id);
    }
  }, [id]);

  useEffect(() => {
    generatePdf417Barcode();
  }, [formData]);

  const fetchPaymentSlip = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/viewpaymentslip/${id}`);
      setFormData(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading payment slip data.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateBarcodeData = () => {
    return `HRVHUB30${formData.currencyCode}${String(Math.round(formData.amount * 100)).padStart(15, '0')}${formData.payerName}${formData.payerAddress}${formData.payerCity}${formData.recipientName}${formData.recipientAddress}${formData.recipientCity}${formData.recipientAccount}HR${formData.modelNumber}${formData.callModelNumber}${formData.purposeCode}${formData.description}`;
  };

  const generatePdf417Barcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const barcodeData = generateBarcodeData();

    try {
      bwipjs.toCanvas(canvas, {
        bcid: 'pdf417',
        text: barcodeData,
        scale: 3,
        height: 10,
        includetext: true,
      });
    } catch (error) {
      console.error('Error generating barcode:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (id) {
        await axios.put(`http://localhost:8080/editpaymentslip/${id}`, formData);
        setMessage({ type: 'success', text: 'Payment slip updated successfully!' });
      } else {
        await axios.post('http://localhost:8080/addpaymentslips', formData);
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
      }
      navigate('/viewpaymentslips');
    } catch (error) {
      setMessage({ type: 'error', text: 'There was an error submitting the payment slip.' });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!id) {
      setMessage({ type: 'error', text: 'Save the payment slip before generating PDF!' });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/generatepdf/${id}`, {
        responseType: 'blob', // Important for handling binary files
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `PaymentSlip_${id}.pdf`;
      link.click();

      setMessage({ type: 'success', text: 'PDF generated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error generating PDF!' });
    }
  };

  return (
    <div className="container mt-4">
      <Link className="btn btn-primary mb-3" to="/viewpaymentslips">
        🏠 Back to View Payment Slips
      </Link>
      <h2>{id ? 'Edit Payment Slip' : 'Enter Payment Slip Data'}</h2>

      {message && <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        {/* Currency Code and Amount */}
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

        {/* Payer Information */}
        <div className="row mt-2">
          <div className="col-md-4">
            <label className="form-label">Payer Name:</label>
            <input type="text" name="payerName" value={formData.payerName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Payer Address:</label>
            <input type="text" name="payerAddress" value={formData.payerAddress} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Payer City:</label>
            <input type="text" name="payerCity" value={formData.payerCity} onChange={handleChange} className="form-control" />
          </div>
        </div>

        {/* Recipient Information */}
        <div className="row mt-2">
          <div className="col-md-4">
            <label className="form-label">Recipient Name:</label>
            <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Recipient Address:</label>
            <input type="text" name="recipientAddress" value={formData.recipientAddress} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Recipient City:</label>
            <input type="text" name="recipientCity" value={formData.recipientCity} onChange={handleChange} className="form-control" />
          </div>
        </div>

        {/* Recipient Account */}
        <div className="mt-2">
          <label className="form-label">Recipient Account:</label>
          <input type="text" name="recipientAccount" value={formData.recipientAccount} onChange={handleChange} className="form-control" required />
        </div>

        {/* Additional Fields */}
        <div className="row mt-2">
          <div className="col-md-4">
            <label className="form-label">Model Number:</label>
            <input type="text" name="modelNumber" value={formData.modelNumber} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Call Model Number:</label>
            <input type="text" name="callModelNumber" value={formData.callModelNumber} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Purpose Code:</label>
            <input type="text" name="purposeCode" value={formData.purposeCode} onChange={handleChange} className="form-control" />
          </div>
        </div>

         {/* Payment Description */}
         <div className="mt-2">
          <label className="form-label">Payment description:</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} className="form-control" required />
        </div>

        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" className="btn btn-success" onClick={generatePDF}>
            📄 Generate PDF
          </button>

        {/* PDF417 Barcode Display */}
        <div className="mt-4">
          <h4>Generated PDF417 Barcode:</h4>
          <canvas ref={canvasRef} width="600" height="200"></canvas>
        </div>
      </form>
    </div>
  );
};

export default PaymentSlipForm;
