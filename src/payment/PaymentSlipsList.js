import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PaymentSlipsList = () => {
    const [paymentSlips, setPaymentSlips] = useState([]);

    useEffect(() => {
        fetchPaymentSlips();
    }, []);

    const fetchPaymentSlips = async () => {
        try {
            const response = await axios.get('http://localhost:8080/viewpaymentslips');
            setPaymentSlips(response.data);
        } catch (error) {
            console.error("Error fetching payment slips:", error);
        }
    };

    return (
        <div>
            <h2>Payment Slips</h2>
            <Link to="/addpaymentslips">
                <button>Add New Payment Slip</button>
            </Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Currency Code</th>
                        <th>Amount</th>
                        <th>Payer Name</th>
                        <th>Payer Address</th>
                        <th>Payer City</th>
                        <th>Recipient Name</th>
                        <th>Recipient Address</th>
                        <th>Recipient City</th>
                        <th>Recipient Account</th>
                        <th>Model Number</th>
                        <th>Call Model Number</th>
                        <th>Purpose Code</th>
                        <th>Description</th>
                        <th>Details</th> 
                    </tr>
                </thead>
                <tbody>
                    {paymentSlips.map((paymentSlip) => (
                        <tr key={paymentSlip.id}>
                            <td>{paymentSlip.id}</td>
                            <td>{paymentSlip.currencyCode}</td>
                            <td>{paymentSlip.amount}</td>
                            <td>{paymentSlip.payerName}</td>
                            <td>{paymentSlip.payerAddress}</td>
                            <td>{paymentSlip.payerCity}</td>
                            <td>{paymentSlip.recipientName}</td>
                            <td>{paymentSlip.recipientAddress}</td>
                            <td>{paymentSlip.recipientCity}</td>
                            <td>{paymentSlip.recipientAccount}</td>
                            <td>{paymentSlip.modelNumber}</td>
                            <td>{paymentSlip.callModelNumber}</td>
                            <td>{paymentSlip.purposeCode}</td>
                            <td>{paymentSlip.description}</td>
                            <td>
                                <Link to={`/paymentslips/${paymentSlip.id}`}>View Details</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Link to="/parametrizationoverview">
                <button>Back To Parametrization</button>
            </Link>
        </div>
    );
};

export default PaymentSlipsList;
