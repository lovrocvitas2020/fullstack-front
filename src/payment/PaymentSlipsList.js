import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './PaymentSlipsList.css';

const PaymentSlipsList = () => {
    const [paymentSlips, setPaymentSlips] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const navigate = useNavigate(); // For navigation after editing or deleting

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

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this payment slip?");
        if (confirm) {
            try {
                await axios.delete(`http://localhost:8080/deletepaymentslip/${id}`);
                setPaymentSlips(paymentSlips.filter((paymentSlip) => paymentSlip.id !== id));
            } catch (error) {
                console.error("Error deleting payment slip:", error);
            }
        }
    };

    const handleModify = (id) => {
        navigate(`/editpaymentslip/${id}`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = paymentSlips.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <h2 className="title">Payment Slips</h2>
            <div className="button-container">
                <Link to="/addpaymentslips">
                    <button className="btn btn-primary">Add New Payment Slip</button>
                </Link>
            </div>
            <table className="table">
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((paymentSlip) => (
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
                                <button 
                                    className="modify-button" 
                                    onClick={() => handleModify(paymentSlip.id)}>
                                    Modify
                                </button>
                                <button 
                                    className="delete-button" 
                                    onClick={() => handleDelete(paymentSlip.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="pagination">
                {Array.from({ length: Math.ceil(paymentSlips.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? 'active-page' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <div className="button-container">
                <Link to="/parametrizationoverview">
                    <button className="btn btn-primary">Back To Parametrization</button>
                </Link>
            </div>
        </div>
    );
};

export default PaymentSlipsList;
