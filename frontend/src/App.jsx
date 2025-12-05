import React, { useState } from 'react';
import { FileText, Save, Download, Stamp, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import ImageUpload from './components/ImageUpload';
import SignaturePad from './components/SignaturePad';
import LineItems from './components/LineItems';
import InvoicePreview from './components/InvoicePreview';

function App() {
    const [invoiceData, setInvoiceData] = useState({
        companyName: '',
        companyAddress: '',
        companyContact: '',
        companyRepresentative: '',
        companyLogo: null,
        companyLogoFile: null,
        companyTagline: '',
        customerName: '',
        customerAddress: '',
        items: [],
        companySignature: null,
        customerSignature: null,
        isStamped: false,
        stampText: 'PAID',
        includeVAT: false,
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (field, value) => {
        setInvoiceData(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceData.items];
        newItems[index][field] = value;
        setInvoiceData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setInvoiceData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, price: 0 }]
        }));
    };

    const removeItem = (index) => {
        setInvoiceData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const generatePDF = async () => {
        const element = document.getElementById('invoice-preview');

        try {
            // Create a clone of the element
            const clone = element.cloneNode(true);

            // CRITICAL: Reset all transforms and set proper print styles
            clone.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: -9999px !important;
                width: 794px !important;
                height: auto !important;
                max-width: none !important;
                transform: none !important;
                z-index: 99999 !important;
                background-color: #ffffff !important;
                color: #000000 !important;
                margin: 0 !important;
                padding: 40px !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                overflow: visible !important;
            `;

            // Constrain logo size in the clone
            const logoImg = clone.querySelector('img[alt="Logo"]');
            if (logoImg) {
                logoImg.style.cssText = 'max-height: 180px !important; max-width: 400px !important; width: auto !important; height: auto !important; object-fit: contain !important; display: block !important;';
            }

            // Also reset any inline styles on other images
            const allImages = clone.querySelectorAll('img');
            allImages.forEach(img => {
                if (img.alt !== 'Logo') {
                    img.style.maxWidth = '150px';
                    img.style.maxHeight = '80px';
                }
            });

            // Append to body
            document.body.appendChild(clone);

            // Wait for images to load
            await Promise.all(Array.from(allImages).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            // Small delay to ensure rendering
            await new Promise(resolve => setTimeout(resolve, 500));

            // Get actual dimensions of the clone
            const cloneWidth = clone.scrollWidth;
            const cloneHeight = clone.scrollHeight;

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff',
                width: cloneWidth,
                height: cloneHeight
            });

            // Remove the clone
            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate image dimensions to fit A4
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            // If content is taller than one page, scale it down to fit
            if (imgHeight > pdfHeight) {
                const scale = pdfHeight / imgHeight;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth * scale, pdfHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            }

            pdf.save(`invoice-${invoiceData.customerName || 'draft'}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert(`Failed to generate PDF: ${error.message}`);
            // Ensure clone is removed if error occurs
            try {
                const existingClone = document.querySelector('[style*="z-index: 99999"]');
                if (existingClone) {
                    document.body.removeChild(existingClone);
                }
            } catch (e) { }
        }
    };

    const saveToBackend = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('company_name', invoiceData.companyName);
            formData.append('company_address', invoiceData.companyAddress);
            formData.append('company_contact', invoiceData.companyContact);
            formData.append('company_representative', invoiceData.companyRepresentative);
            formData.append('customer_name', invoiceData.customerName);
            formData.append('customer_address', invoiceData.customerAddress);
            formData.append('date', invoiceData.date);
            if (invoiceData.dueDate) formData.append('due_date', invoiceData.dueDate);
            formData.append('total_amount', invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0));
            formData.append('is_stamped', invoiceData.isStamped);
            formData.append('stamp_text', invoiceData.stampText);

            if (invoiceData.companyLogoFile) {
                formData.append('company_logo', invoiceData.companyLogoFile);
            }

            // Send items as JSON string
            formData.append('items_json', JSON.stringify(invoiceData.items));

            // Handle signatures (convert base64 to blob)
            if (invoiceData.companySignature) {
                const blob = await (await fetch(invoiceData.companySignature)).blob();
                formData.append('company_signature', blob, 'company_sig.png');
            }
            if (invoiceData.customerSignature) {
                const blob = await (await fetch(invoiceData.customerSignature)).blob();
                formData.append('customer_signature', blob, 'customer_sig.png');
            }

            await axios.post('/api/invoices/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Invoice saved successfully!');
        } catch (error) {
            console.error('Error saving invoice:', error);
            const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            alert(`Failed to save invoice: ${msg}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20 font-body">
            <header className="glass-panel sticky top-0 z-50 border-b border-slate-700 mb-8">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 font-heading">
                            InvoiceGen <span className="text-slate-500 font-light">Pro</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={saveToBackend}
                            disabled={isSaving}
                            className="btn-primary flex items-center gap-2 bg-slate-700 hover:bg-slate-600 border-none"
                            style={{ background: '#334155' }}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Saving...' : 'Save Invoice'}
                        </button>
                        <button
                            onClick={generatePDF}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editor Section */}
                    <div className="space-y-6">
                        <div className="glass-panel rounded-xl p-6 animate-slide-up">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 font-heading">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                Company Details
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <ImageUpload
                                    label="Company Logo"
                                    currentImage={invoiceData.companyLogo}
                                    onImageChange={(file, data) => {
                                        setInvoiceData(prev => ({
                                            ...prev,
                                            companyLogo: data,
                                            companyLogoFile: file
                                        }));
                                    }}
                                />
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Company Tagline</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="e.g. Excellence in every service"
                                        value={invoiceData.companyTagline}
                                        onChange={(e) => updateField('companyTagline', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Acme Corp"
                                        value={invoiceData.companyName}
                                        onChange={(e) => updateField('companyName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Address</label>
                                    <textarea
                                        className="input-field h-24 resize-none"
                                        placeholder="123 Business St..."
                                        value={invoiceData.companyAddress}
                                        onChange={(e) => updateField('companyAddress', e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Representative Name</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Jane Smith"
                                            value={invoiceData.companyRepresentative}
                                            onChange={(e) => updateField('companyRepresentative', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Contact Info</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="jane@acme.com"
                                            value={invoiceData.companyContact}
                                            onChange={(e) => updateField('companyContact', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 font-heading">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                Customer Details
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Customer Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="John Doe"
                                        value={invoiceData.customerName}
                                        onChange={(e) => updateField('customerName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Address</label>
                                    <textarea
                                        className="input-field h-24 resize-none"
                                        placeholder="456 Client Ave..."
                                        value={invoiceData.customerAddress}
                                        onChange={(e) => updateField('customerAddress', e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            value={invoiceData.date}
                                            onChange={(e) => updateField('date', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            value={invoiceData.dueDate}
                                            onChange={(e) => updateField('dueDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <LineItems
                                items={invoiceData.items}
                                onItemChange={handleItemChange}
                                onAddItem={addItem}
                                onRemoveItem={removeItem}
                            />
                        </div>

                        <div className="glass-panel rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 font-heading">
                                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                Signatures & Stamp
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <SignaturePad
                                    label="Company Representative"
                                    onEnd={(data) => updateField('companySignature', data)}
                                />
                                <SignaturePad
                                    label="Customer"
                                    onEnd={(data) => updateField('customerSignature', data)}
                                />
                            </div>

                            <div className="border-t border-slate-700 pt-4 flex flex-wrap items-center gap-6" style={{ borderTop: '1px solid #334155', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '24px',
                                            borderRadius: '9999px',
                                            padding: '2px',
                                            cursor: 'pointer',
                                            backgroundColor: invoiceData.isStamped ? '#2563eb' : '#334155',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onClick={() => updateField('isStamped', !invoiceData.isStamped)}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            transform: invoiceData.isStamped ? 'translateX(16px)' : 'translateX(0)',
                                            transition: 'transform 0.2s'
                                        }}></div>
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Apply Stamp</span>
                                </div>
                                {invoiceData.isStamped && (
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ width: '128px', padding: '4px 8px', fontSize: '14px', textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }}
                                        value={invoiceData.stampText}
                                        onChange={(e) => updateField('stampText', e.target.value)}
                                    />
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '24px',
                                            borderRadius: '9999px',
                                            padding: '2px',
                                            cursor: 'pointer',
                                            backgroundColor: invoiceData.includeVAT ? '#f97316' : '#334155',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onClick={() => updateField('includeVAT', !invoiceData.includeVAT)}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            transform: invoiceData.includeVAT ? 'translateX(16px)' : 'translateX(0)',
                                            transition: 'transform 0.2s'
                                        }}></div>
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Include VAT (18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:sticky lg:top-24 h-fit overflow-auto" style={{ maxHeight: '80vh' }}>
                        <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%' }}>
                            <InvoicePreview data={invoiceData} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App
