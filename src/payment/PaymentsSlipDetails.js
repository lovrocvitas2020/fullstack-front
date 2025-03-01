import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const PaymentSlipDetails = () => {
    const { id } = useParams(); // Retrieve the ID from the URL
    const [paymentSlip, setPaymentSlip] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPaymentSlipDetails();
    }, []);

    const fetchPaymentSlipDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/viewpaymentslip/${id}`);
            setPaymentSlip(response.data);
        } catch (error) {
            console.error("Error fetching payment slip details:", error);
            setError("Unable to fetch payment slip details.");
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!paymentSlip) {
        return <div>Loading payment slip details...</div>;
    }

    return (
        <div className="container">
            <h2>Payment Slip Details</h2>
            <table>
                <tbody>
                    <tr>
                        <th>ID:</th>
                        <td>{paymentSlip.id}</td>
                    </tr>
                    <tr>
                        <th>Currency Code:</th>
                        <td>{paymentSlip.currencyCode}</td>
                    </tr>
                    <tr>
                        <th>Amount:</th>
                        <td>{paymentSlip.amount}</td>
                    </tr>
                    <tr>
                        <th>Payer Name:</th>
                        <td>{paymentSlip.payerName}</td>
                    </tr>
                    <tr>
                        <th>Payer Address:</th>
                        <td>{paymentSlip.payerAddress}</td>
                    </tr>
                    <tr>
                        <th>Payer City:</th>
                        <td>{paymentSlip.payerCity}</td>
                    </tr>
                    <tr>
                        <th>Recipient Name:</th>
                        <td>{paymentSlip.recipientName}</td>
                    </tr>
                    <tr>
                        <th>Recipient Address:</th>
                        <td>{paymentSlip.recipientAddress}</td>
                    </tr>
                    <tr>
                        <th>Recipient City:</th>
                        <td>{paymentSlip.recipientCity}</td>
                    </tr>
                    <tr>
                        <th>Recipient Account:</th>
                        <td>{paymentSlip.recipientAccount}</td>
                    </tr>
                    <tr>
                        <th>Model Number:</th>
                        <td>{paymentSlip.modelNumber}</td>
                    </tr>
                    <tr>
                        <th>Call Model Number:</th>
                        <td>{paymentSlip.callModelNumber}</td>
                    </tr>
                    <tr>
                        <th>Purpose Code:</th>
                        <td>{paymentSlip.purposeCode}</td>
                    </tr>
                    <tr>
                        <th>Description:</th>
                        <td>{paymentSlip.description}</td>
                    </tr>
                    <tr>
                    <th>Generated QR Code:</th>
                            <td>
                                {paymentSlip.generatedQRcode ? (
                                    <QRCodeCanvas value={paymentSlip.generatedQRcode} size={200} />
                                ) : (
                                    "No QR Code Available"
                                )}
                            </td>
                    </tr>

                    
                </tbody>
            </table>
            <Link to="/viewpaymentslips">
                <button>Back to Payment Slips</button>
            </Link>
        </div>
    );
};

export default PaymentSlipDetails;
