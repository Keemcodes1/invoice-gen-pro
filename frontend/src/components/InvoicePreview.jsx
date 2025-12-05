import React from 'react';

const InvoicePreview = ({ data }) => {
    const {
        companyName, companyAddress, companyContact, companyRepresentative, companyLogo, companyTagline,
        customerName, customerAddress,
        items,
        companySignature, customerSignature,
        isStamped, stampText,
        includeVAT,
        date, dueDate,
        bankName, accountName, accountNumber, swiftCode,
        mtnName, mtnNumber, airtelName, airtelNumber
    } = data;

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxRate = includeVAT ? 0.18 : 0;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    return (
        <div id="invoice-preview" style={{
            width: '794px',
            minHeight: '1123px',
            backgroundColor: '#ffffff',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Corner Elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, transparent 60%)',
                pointerEvents: 'none'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '200px',
                height: '200px',
                background: 'linear-gradient(315deg, rgba(0, 0, 0, 0.04) 0%, transparent 60%)',
                pointerEvents: 'none'
            }}></div>

            {/* Top Gradient Bar - Orange to Black */}
            <div style={{
                height: '8px',
                background: 'linear-gradient(90deg, #F97316 0%, #EA580C 50%, #1F2937 100%)',
                width: '100%'
            }}></div>

            <div style={{ padding: '40px 32px', position: 'relative' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
                    {/* Left - Logo and Invoice Title */}
                    <div>
                        {companyLogo && (
                            <div style={{ marginBottom: '16px' }}>
                                <img
                                    src={companyLogo}
                                    alt="Logo"
                                    style={{
                                        height: '180px',
                                        maxWidth: '400px',
                                        objectFit: 'contain',
                                        display: 'block'
                                    }}
                                />
                                {companyTagline && (
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#F97316',
                                        fontStyle: 'italic',
                                        marginTop: '8px',
                                        fontWeight: '500',
                                        maxWidth: '400px'
                                    }}>
                                        {companyTagline}
                                    </p>
                                )}
                            </div>
                        )}
                        <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#111827', letterSpacing: '-1px', margin: 0, lineHeight: 1 }}>INVOICE</h1>
                        <p style={{ fontSize: '14px', color: '#F97316', fontWeight: '600', marginTop: '8px' }}>{invoiceNumber}</p>
                    </div>

                    {/* Right - Date Box */}
                    <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', padding: '20px 24px', borderRadius: '12px', border: '1px solid #FED7AA', minWidth: '180px' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <p style={{ fontSize: '10px', color: '#9A3412', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Issue Date</p>
                            <p style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '4px 0 0 0' }}>{date || new Date().toLocaleDateString()}</p>
                        </div>
                        {dueDate && (
                            <div>
                                <p style={{ fontSize: '10px', color: '#9A3412', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Due Date</p>
                                <p style={{ fontSize: '16px', fontWeight: '700', color: '#DC2626', margin: '4px 0 0 0' }}>{dueDate}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Billing Section */}
                <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
                    {/* From */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ width: '4px', height: '20px', background: 'linear-gradient(180deg, #F97316, #EA580C)', borderRadius: '2px' }}></div>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: '#F97316', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>From</p>
                        </div>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>{companyName || 'Your Company'}</p>
                        <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6' }}>{companyAddress || 'Company Address'}</p>
                        {(companyContact || companyRepresentative) && (
                            <div style={{ marginTop: '12px', padding: '10px', background: '#FFF7ED', borderRadius: '8px', fontSize: '12px', border: '1px solid #FFEDD5' }}>
                                {companyRepresentative && <p style={{ margin: '0 0 4px 0', color: '#374151' }}><strong>Rep:</strong> {companyRepresentative}</p>}
                                {companyContact && <p style={{ margin: 0, color: '#374151' }}><strong>Contact:</strong> {companyContact}</p>}
                            </div>
                        )}
                    </div>

                    {/* To */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ width: '4px', height: '20px', background: '#374151', borderRadius: '2px' }}></div>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>Bill To</p>
                        </div>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>{customerName || 'Client Name'}</p>
                        <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6' }}>{customerAddress || 'Client Address'}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div style={{ marginBottom: '32px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', background: 'linear-gradient(90deg, #111827 0%, #1F2937 100%)', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>Description</th>
                                <th style={{ textAlign: 'center', padding: '16px 20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', background: '#1F2937', width: '80px' }}>Qty</th>
                                <th style={{ textAlign: 'right', padding: '16px 20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', background: '#1F2937', width: '120px' }}>Unit Price</th>
                                <th style={{ textAlign: 'right', padding: '16px 20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', background: 'linear-gradient(90deg, #1F2937 0%, #111827 100%)', borderTopRightRadius: '10px', borderBottomRightRadius: '10px', width: '120px' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <td style={{ padding: '18px 20px', fontSize: '14px', color: '#111827', fontWeight: '500' }}>{item.description}</td>
                                    <td style={{ padding: '18px 20px', fontSize: '14px', color: '#4B5563', textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ padding: '18px 20px', fontSize: '14px', color: '#4B5563', textAlign: 'right' }}>UGX {item.price.toLocaleString()}</td>
                                    <td style={{ padding: '18px 20px', fontSize: '14px', color: '#111827', fontWeight: '700', textAlign: 'right' }}>UGX {(item.quantity * item.price).toLocaleString()}</td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic', background: '#F9FAFB' }}>No items added yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                    <div style={{ width: '320px', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '12px', padding: '20px 24px', border: '1px solid #FED7AA' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '13px', color: '#4B5563' }}>Subtotal</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>UGX {subtotal.toLocaleString()}</span>
                        </div>
                        {includeVAT && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '2px dashed #FDBA74' }}>
                                <span style={{ fontSize: '13px', color: '#4B5563' }}>VAT (18%)</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>UGX {taxAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>Total Due</span>
                            <span style={{ fontSize: '24px', fontWeight: '900', color: '#EA580C' }}>UGX {total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Details Section */}
                {(bankName || accountNumber || mtnNumber || airtelNumber) && (
                    <div style={{ marginBottom: '32px', padding: '20px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ width: '4px', height: '20px', background: 'linear-gradient(180deg, #10B981, #059669)', borderRadius: '2px' }}></div>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#059669', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>Payment Details</p>
                        </div>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                            {/* Bank Transfer */}
                            {(bankName || accountNumber) && (
                                <div style={{ flex: 1, minWidth: '180px' }}>
                                    <p style={{ fontSize: '11px', fontWeight: '600', color: '#10B981', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank Transfer</p>
                                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #D1FAE5' }}>
                                        {bankName && <p style={{ fontSize: '12px', color: '#111827', margin: '0 0 4px 0' }}><strong>Bank:</strong> {bankName}</p>}
                                        {accountName && <p style={{ fontSize: '12px', color: '#111827', margin: '0 0 4px 0' }}><strong>A/C Name:</strong> {accountName}</p>}
                                        {accountNumber && <p style={{ fontSize: '12px', color: '#111827', margin: '0 0 4px 0' }}><strong>A/C No:</strong> {accountNumber}</p>}
                                        {swiftCode && <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}><strong>SWIFT:</strong> {swiftCode}</p>}
                                    </div>
                                </div>
                            )}

                            {/* MTN Mobile Money */}
                            {mtnNumber && (
                                <div style={{ flex: 1, minWidth: '140px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                        <div style={{ width: '20px', height: '20px', background: '#FACC15', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '7px', color: '#000' }}>MTN</div>
                                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#CA8A04', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>MTN MoMo</p>
                                    </div>
                                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #FEF08A' }}>
                                        {mtnName && <p style={{ fontSize: '12px', color: '#111827', margin: '0 0 4px 0' }}><strong>Name:</strong> {mtnName}</p>}
                                        <p style={{ fontSize: '12px', color: '#111827', margin: 0 }}><strong>Tel:</strong> {mtnNumber}</p>
                                    </div>
                                </div>
                            )}

                            {/* Airtel Money */}
                            {airtelNumber && (
                                <div style={{ flex: 1, minWidth: '140px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                        <div style={{ width: '20px', height: '20px', background: '#EF4444', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '6px', color: '#fff', letterSpacing: '-0.3px' }}>airtel</div>
                                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Airtel Money</p>
                                    </div>
                                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #FECACA' }}>
                                        {airtelName && <p style={{ fontSize: '12px', color: '#111827', margin: '0 0 4px 0' }}><strong>Name:</strong> {airtelName}</p>}
                                        <p style={{ fontSize: '12px', color: '#111827', margin: 0 }}><strong>Tel:</strong> {airtelNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '32px', borderTop: '2px solid #F3F4F6', position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ height: '60px', marginBottom: '8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            {companySignature ? (
                                <img src={companySignature} alt="Company Sig" style={{ maxHeight: '60px', maxWidth: '140px' }} />
                            ) : (
                                <div style={{ width: '140px', height: '1px', background: '#D1D5DB' }}></div>
                            )}
                        </div>
                        <div style={{ borderTop: '2px solid #111827', width: '160px', paddingTop: '8px' }}>
                            <p style={{ fontSize: '10px', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: '600' }}>Authorized Signature</p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ height: '60px', marginBottom: '8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            {customerSignature ? (
                                <img src={customerSignature} alt="Customer Sig" style={{ maxHeight: '60px', maxWidth: '140px' }} />
                            ) : (
                                <div style={{ width: '140px', height: '1px', background: '#D1D5DB' }}></div>
                            )}
                        </div>
                        <div style={{ borderTop: '2px solid #111827', width: '160px', paddingTop: '8px' }}>
                            <p style={{ fontSize: '10px', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: '600' }}>Client Signature</p>
                        </div>
                    </div>

                    {/* Stamp */}
                    {isStamped && (
                        <div style={{ position: 'absolute', right: '20px', top: '0px', transform: 'rotate(-15deg)', border: '4px solid #EA580C', borderRadius: '8px', padding: '8px 20px', color: '#EA580C', fontSize: '32px', fontWeight: '900', letterSpacing: '4px', opacity: '0.85' }}>
                            {stampText || 'PAID'}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(90deg, #FFF7ED 0%, #FFEDD5 100%)', padding: '20px 32px', borderTop: '1px solid #FED7AA' }}>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#4B5563', margin: 0 }}>
                    <strong style={{ color: '#EA580C' }}>Thank you for your business!</strong>
                    <span style={{ margin: '0 12px', color: '#D1D5DB' }}>•</span>
                    Payment terms: Due upon receipt
                </p>
            </div>
        </div>
    );
};

export default InvoicePreview;
