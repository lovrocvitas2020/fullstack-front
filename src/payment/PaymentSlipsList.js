import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './PaymentSlipsList.css';

const PaymentSlipsList = () => {
    const [paymentSlips, setPaymentSlips] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPaymentSlips();
    }, []);

    const fetchPaymentSlips = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/viewpaymentslips');
            setPaymentSlips(response.data);
        } catch (error) {
            setError("Error fetching payment slips. Please try again.");
            console.error("Error fetching payment slips:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this payment slip?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/deletepaymentslip/${id}`);
            fetchPaymentSlips(); // Re-fetch instead of filtering locally
        } catch (error) {
            setError("Error deleting payment slip.");
            console.error("Error deleting payment slip:", error);
        }
    };

    const handleModify = (id) => {
        navigate(`/editpaymentslip/${id}`);
    };

    // Filter payment slips based on search term
    const filteredPaymentSlips = paymentSlips.filter((slip) =>
        slip.payerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPaymentSlips.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPaymentSlips.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="container">
            <h2 className="title">Payment Slips</h2>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by payer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Display Error Message */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Show Loading Indicator */}
            {loading ? (
                <p>Loading payment slips...</p>
            ) : (
                <>
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
                                        <button className="modify-button" onClick={() => handleModify(paymentSlip.id)}>
                                            Modify
                                        </button>
                                        <button className="delete-button" onClick={() => handleDelete(paymentSlip.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={currentPage === index + 1 ? 'active-page' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>

                    <div className="button-container">
                        <Link to="/financeandpaymentoverview">
                            <button className="btn btn-primary">Back To Finance and Payment</button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentSlipsList;
