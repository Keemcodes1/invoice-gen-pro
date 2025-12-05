import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser } from 'lucide-react';

const SignaturePad = ({ label, onEnd }) => {
    const sigPad = useRef({});

    const clear = () => {
        sigPad.current.clear();
        onEnd(null);
    };

    const handleEnd = () => {
        onEnd(sigPad.current.toDataURL());
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-slate-400">{label}</label>
                <button
                    onClick={clear}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                    <Eraser className="w-3 h-3" /> Clear
                </button>
            </div>
            <div className="border border-slate-600 rounded-lg overflow-hidden bg-white">
                <SignatureCanvas
                    ref={sigPad}
                    penColor="black"
                    canvasProps={{
                        className: 'w-full h-32',
                        style: { width: '100%', height: '128px' }
                    }}
                    onEnd={handleEnd}
                />
            </div>
        </div>
    );
};

export default SignaturePad;
