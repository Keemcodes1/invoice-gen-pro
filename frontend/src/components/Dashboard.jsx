import React from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Plus, Search, Edit2, Trash2, Send, TrendingUp, Calendar, User } from 'lucide-react';

const Dashboard = ({
    invoices,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    onCreateNew,
    onEdit,
    onDelete,
    onUpdateStatus
}) => {
    // Calculate stats
    const stats = {
        total: invoices.length,
        drafts: invoices.filter(inv => inv.status === 'draft').length,
        sent: invoices.filter(inv => inv.status === 'sent').length,
        paid: invoices.filter(inv => inv.status === 'paid').length,
        overdue: invoices.filter(inv => inv.status === 'overdue').length,
    };

    // Calculate total revenue (paid invoices)
    const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0);

    // Filter invoices
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return { bg: 'rgba(100, 116, 139, 0.2)', text: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' };
            case 'sent': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
            case 'paid': return { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
            case 'overdue': return { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
            default: return { bg: 'rgba(100, 116, 139, 0.2)', text: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' };
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return `UGX ${(amount || 0).toLocaleString()}`;
    };

    const formatShortCurrency = (amount) => {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toString();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white font-heading">Invoice Dashboard</h2>
                <p className="text-slate-400 text-sm mt-1">Manage and track all your invoices</p>
            </div>

            {/* Stats Cards - Enhanced Design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Total Revenue - Highlighted */}
                <div
                    className="col-span-2 sm:col-span-1 lg:col-span-2 rounded-xl p-4 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)',
                        border: '1px solid rgba(249, 115, 22, 0.2)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(249, 115, 22, 0.2)' }}>
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-xs text-orange-300/70 uppercase tracking-wide">Revenue (Paid)</p>
                            <p className="text-xl font-bold text-orange-400">UGX {formatShortCurrency(totalRevenue)}</p>
                        </div>
                    </div>
                </div>

                {/* Total Invoices */}
                <div className="glass-panel rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-xl font-bold text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs text-slate-400">Total</p>
                </div>

                {/* Drafts */}
                <div className="glass-panel rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-xl font-bold text-white">{stats.drafts}</span>
                    </div>
                    <p className="text-xs text-slate-400">Drafts</p>
                </div>

                {/* Sent */}
                <div className="glass-panel rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Send className="w-4 h-4 text-blue-400" />
                        <span className="text-xl font-bold text-white">{stats.sent}</span>
                    </div>
                    <p className="text-xs text-slate-400">Sent</p>
                </div>

                {/* Paid */}
                <div className="glass-panel rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xl font-bold text-white">{stats.paid}</span>
                    </div>
                    <p className="text-xs text-slate-400">Paid</p>
                </div>

                {/* Overdue */}
                <div className="glass-panel rounded-xl p-3 sm:p-4 relative">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xl font-bold text-white">{stats.overdue}</span>
                    </div>
                    <p className="text-xs text-slate-400">Overdue</p>
                    {stats.overdue > 0 && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-panel rounded-xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="input-field pl-10 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        className="input-field text-sm"
                        style={{ minWidth: '130px' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Drafts</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    {/* Create New Button */}
                    <button
                        onClick={onCreateNew}
                        className="btn-primary btn-with-icon"
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '0.9375rem',
                            fontWeight: '600',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
                            letterSpacing: '0.02em',
                            whiteSpace: 'nowrap',
                            minWidth: 'fit-content'
                        }}
                    >
                        <Plus className="w-5 h-5" style={{ strokeWidth: 2.5 }} />
                        <span>New Invoice</span>
                    </button>
                </div>
            </div>

            {/* Invoice List */}
            <div className="glass-panel rounded-xl overflow-hidden">
                {filteredInvoices.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-400 mb-2 font-medium">
                            {invoices.length === 0 ? "No invoices yet" : "No results found"}
                        </p>
                        <p className="text-slate-500 text-sm mb-6">
                            {invoices.length === 0
                                ? "Create your first invoice to get started"
                                : "Try adjusting your search or filter"}
                        </p>
                        {invoices.length === 0 && (
                            <button
                                onClick={onCreateNew}
                                className="btn-primary"
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.625rem',
                                    letterSpacing: '0.02em'
                                }}
                            >
                                <Plus className="w-5 h-5" style={{ strokeWidth: 2.5 }} />
                                Create Invoice
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800/50 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                                <div className="col-span-2">Invoice</div>
                                <div className="col-span-3">Client</div>
                                <div className="col-span-2">Date</div>
                                <div className="col-span-2">Amount</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>
                            <div className="divide-y divide-slate-700/50">
                                {filteredInvoices.map((invoice, index) => {
                                    const statusStyle = getStatusColor(invoice.status);
                                    return (
                                        <div
                                            key={invoice.id}
                                            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/30 transition-all duration-200"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="col-span-2">
                                                <span className="font-mono text-sm text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                                    {invoice.invoiceNumber}
                                                </span>
                                            </div>
                                            <div className="col-span-3">
                                                <p className="font-medium text-white truncate">{invoice.customerName || 'Unnamed Client'}</p>
                                                {invoice.companyName && (
                                                    <p className="text-xs text-slate-500 truncate">{invoice.companyName}</p>
                                                )}
                                            </div>
                                            <div className="col-span-2 text-sm text-slate-300 flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-500" />
                                                {formatDate(invoice.date)}
                                            </div>
                                            <div className="col-span-2 font-semibold text-white">
                                                {formatCurrency(invoice.total)}
                                            </div>
                                            <div className="col-span-1">
                                                <span
                                                    className="px-2 py-1 rounded-lg text-xs font-medium capitalize inline-flex items-center gap-1"
                                                    style={{
                                                        backgroundColor: statusStyle.bg,
                                                        color: statusStyle.text,
                                                        border: `1px solid ${statusStyle.border}`
                                                    }}
                                                >
                                                    {invoice.status}
                                                </span>
                                            </div>
                                            <div className="col-span-2 flex justify-end gap-1">
                                                <button
                                                    onClick={() => onEdit(invoice)}
                                                    className="btn-icon btn-icon-blue"
                                                    style={{
                                                        padding: '0.5rem 0.75rem',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.375rem',
                                                        fontSize: '0.8125rem',
                                                        fontWeight: '500'
                                                    }}
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                    <span className="hidden lg:inline">Edit</span>
                                                </button>
                                                {invoice.status === 'draft' && (
                                                    <button
                                                        onClick={() => onUpdateStatus(invoice.id, 'sent')}
                                                        className="btn-icon"
                                                        style={{
                                                            padding: '0.5rem 0.75rem',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.375rem',
                                                            fontSize: '0.8125rem',
                                                            fontWeight: '500',
                                                            background: 'rgba(99, 102, 241, 0.1)',
                                                            color: '#818cf8'
                                                        }}
                                                        title="Mark as Sent"
                                                    >
                                                        <Send className="w-3.5 h-3.5" />
                                                        <span className="hidden lg:inline">Send</span>
                                                    </button>
                                                )}
                                                {invoice.status === 'sent' && (
                                                    <button
                                                        onClick={() => onUpdateStatus(invoice.id, 'paid')}
                                                        className="btn-icon"
                                                        style={{
                                                            padding: '0.5rem 0.75rem',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.375rem',
                                                            fontSize: '0.8125rem',
                                                            fontWeight: '500',
                                                            background: 'rgba(16, 185, 129, 0.1)',
                                                            color: '#34d399'
                                                        }}
                                                        title="Mark as Paid"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        <span className="hidden lg:inline">Paid</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => onDelete(invoice.id)}
                                                    className="btn-icon btn-icon-red"
                                                    style={{ padding: '0.5rem', borderRadius: '8px' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-700/50">
                            {filteredInvoices.map((invoice, index) => {
                                const statusStyle = getStatusColor(invoice.status);
                                return (
                                    <div
                                        key={invoice.id}
                                        className="p-4 active:bg-slate-800/50 transition-colors"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Top row - Invoice number and status */}
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                                {invoice.invoiceNumber}
                                            </span>
                                            <span
                                                className="px-2 py-1 rounded-lg text-xs font-medium capitalize"
                                                style={{
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.text,
                                                    border: `1px solid ${statusStyle.border}`
                                                }}
                                            >
                                                {invoice.status}
                                            </span>
                                        </div>

                                        {/* Client info */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate">
                                                    {invoice.customerName || 'Unnamed Client'}
                                                </p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(invoice.date)}
                                                </p>
                                            </div>
                                            <p className="font-bold text-white text-right">
                                                {formatCurrency(invoice.total)}
                                            </p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-2 mt-1">
                                            <button
                                                onClick={() => onEdit(invoice)}
                                                className="flex-1 py-2.5 px-4 text-sm font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                                style={{
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                                }}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Invoice
                                            </button>
                                            {invoice.status === 'draft' && (
                                                <button
                                                    onClick={() => onUpdateStatus(invoice.id, 'sent')}
                                                    className="py-2.5 px-4 text-sm font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                                    }}
                                                >
                                                    <Send className="w-4 h-4" />
                                                    Send
                                                </button>
                                            )}
                                            {invoice.status === 'sent' && (
                                                <button
                                                    onClick={() => onUpdateStatus(invoice.id, 'paid')}
                                                    className="py-2.5 px-4 text-sm font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                                    }}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Paid
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onDelete(invoice.id)}
                                                className="py-2.5 px-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center"
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    color: '#f87171'
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Footer info */}
            {filteredInvoices.length > 0 && (
                <p className="text-center text-xs text-slate-500">
                    Showing {filteredInvoices.length} of {invoices.length} invoices
                </p>
            )}
        </div>
    );
};

export default Dashboard;
