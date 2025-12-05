import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const LineItems = ({ items, onItemChange, onAddItem, onRemoveItem }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold text-slate-300">Items</h3>
                <button
                    onClick={onAddItem}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Add Item
                </button>
            </div>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="glass-panel p-3 rounded-lg flex gap-3 items-start animate-fade-in">
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="Description"
                                className="input-field py-1 text-sm"
                                value={item.description}
                                onChange={(e) => onItemChange(index, 'description', e.target.value)}
                            />
                            <div className="flex gap-2">
                                <div className="w-20">
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        className="input-field py-1 text-sm"
                                        value={item.quantity}
                                        onChange={(e) => onItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        className="input-field py-1 text-sm"
                                        value={item.price}
                                        onChange={(e) => onItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between h-full gap-2">
                            <button
                                onClick={() => onRemoveItem(index)}
                                className="text-slate-500 hover:text-red-400 p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-mono font-bold text-blue-400">
                                UGX {(item.quantity * item.price).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-4 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
                    No items added yet
                </div>
            )}
        </div>
    );
};

export default LineItems;
