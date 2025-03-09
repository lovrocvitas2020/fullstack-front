import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GeneratedPaymentSlipsList = () => {
    const [paymentSlips, setPaymentSlips] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGeneratedPaymentSlips();
    }, []);

    const fetchGeneratedPaymentSlips = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/viewgeneratedpaymentslips');
            setPaymentSlips(response.data);
        } catch (error) {
            setError("Error fetching generated payment slips. Please try again.");
            console.error("Error fetching generated payment slips:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this generated payment slip?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/deletegeneratedpaymentslip/${id}`);
            fetchGeneratedPaymentSlips(); // Refresh the list after deletion
        } catch (error) {
            setError("Error deleting generated payment slip.");
            console.error("Error deleting generated payment slip:", error);
        }
    };

    const handleViewPdf = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/generatedpaymentslips/pdf/${id}`, {
                responseType: 'blob', // Important: Receive binary data as a Blob
            });

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);

            window.open(pdfUrl); // Open the PDF in a new tab
        } catch (error) {
            console.error("Error fetching PDF:", error);
            setError("Error loading PDF.");
        }
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
            <h2 className="title">Generated Payment Slips</h2>

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
                <p>Loading generated payment slips...</p>
            ) : (
                <>
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
                                    <td>{paymentSlip.purposeCode}</td>
                                    <td>{paymentSlip.description}</td>
                                    <td>
                                        <button className="delete-button" onClick={() => handleDelete(paymentSlip.id)}>
                                            Delete
                                        </button>
                                        <button className="btn btn-info" onClick={() => handleViewPdf(paymentSlip.id)} >
                                           View PDF
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
                        <Link to="/parametrizationoverview">
                            <button className="btn btn-primary">Back To Administration</button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default GeneratedPaymentSlipsList;
