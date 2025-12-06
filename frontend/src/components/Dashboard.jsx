import React from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Plus, Search, Edit2, Trash2, Send } from 'lucide-react';

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
            case 'draft': return { bg: '#374151', text: '#9ca3af' };
            case 'sent': return { bg: '#1e40af', text: '#60a5fa' };
            case 'paid': return { bg: '#065f46', text: '#34d399' };
            case 'overdue': return { bg: '#991b1b', text: '#f87171' };
            default: return { bg: '#374151', text: '#9ca3af' };
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

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="glass-panel rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-2xl font-bold text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs text-slate-400">Total Invoices</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <span className="text-2xl font-bold text-white">{stats.drafts}</span>
                    </div>
                    <p className="text-xs text-slate-400">Drafts</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Send className="w-5 h-5 text-blue-400" />
                        <span className="text-2xl font-bold text-white">{stats.sent}</span>
                    </div>
                    <p className="text-xs text-slate-400">Sent</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-2xl font-bold text-white">{stats.paid}</span>
                    </div>
                    <p className="text-xs text-slate-400">Paid</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="text-2xl font-bold text-white">{stats.overdue}</span>
                    </div>
                    <p className="text-xs text-slate-400">Overdue</p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-panel rounded-xl p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by client, company, or invoice number..."
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        className="input-field"
                        style={{ width: 'auto', minWidth: '150px' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="draft">Drafts</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    {/* Create New Button */}
                    <button
                        onClick={onCreateNew}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Invoice</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>
            </div>

            {/* Invoice List */}
            <div className="glass-panel rounded-xl overflow-hidden">
                {filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 mb-4">
                            {invoices.length === 0
                                ? "No invoices yet. Create your first one!"
                                : "No invoices match your search."}
                        </p>
                        {invoices.length === 0 && (
                            <button onClick={onCreateNew} className="btn-primary">
                                <Plus className="w-4 h-4 inline mr-2" />
                                Create Invoice
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700">
                        {/* Table Header - Desktop */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-slate-800/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <div className="col-span-2">Invoice #</div>
                            <div className="col-span-3">Client</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Amount</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* Invoice Rows */}
                        {filteredInvoices.map((invoice) => {
                            const statusStyle = getStatusColor(invoice.status);
                            return (
                                <div
                                    key={invoice.id}
                                    className="p-4 hover:bg-slate-800/30 transition-colors"
                                >
                                    {/* Desktop View */}
                                    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                                        <div className="col-span-2 font-mono text-sm text-blue-400">
                                            {invoice.invoiceNumber}
                                        </div>
                                        <div className="col-span-3">
                                            <p className="font-medium text-white truncate">{invoice.customerName || 'Unnamed Client'}</p>
                                            <p className="text-xs text-slate-400 truncate">{invoice.companyName}</p>
                                        </div>
                                        <div className="col-span-2 text-sm text-slate-300">
                                            {formatDate(invoice.date)}
                                        </div>
                                        <div className="col-span-2 font-semibold text-white">
                                            {formatCurrency(invoice.total)}
                                        </div>
                                        <div className="col-span-1">
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                                                style={{
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.text
                                                }}
                                            >
                                                {invoice.status}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(invoice)}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {invoice.status === 'draft' && (
                                                <button
                                                    onClick={() => onUpdateStatus(invoice.id, 'sent')}
                                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Mark as Sent"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            )}
                                            {invoice.status === 'sent' && (
                                                <button
                                                    onClick={() => onUpdateStatus(invoice.id, 'paid')}
                                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Mark as Paid"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onDelete(invoice.id)}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile View */}
                                    <div className="md:hidden space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-mono text-sm text-blue-400">{invoice.invoiceNumber}</p>
                                                <p className="font-medium text-white">{invoice.customerName || 'Unnamed Client'}</p>
                                            </div>
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                                                style={{
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.text
                                                }}
                                            >
                                                {invoice.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-slate-400">{formatDate(invoice.date)}</p>
                                                <p className="font-semibold text-white">{formatCurrency(invoice.total)}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onEdit(invoice)}
                                                    className="p-2 text-slate-400 hover:text-blue-400 bg-slate-700 rounded-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(invoice.id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 bg-slate-700 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
