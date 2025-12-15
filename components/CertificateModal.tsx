"use client";

import { X, ExternalLink, Calendar, Award } from "lucide-react";

// Matches the type definition in your main page
type Certificate = {
    id: string;
    title: string;
    issuer: string;
    imageUrl: string;
    verifyLink?: string;
    description?: string;
    issuedAt?: string;
};

interface CertificateModalProps {
    certificate: Certificate | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
    if (!isOpen || !certificate) return null;

    // Format date if it exists
    const formattedDate = certificate.issuedAt
        ? new Date(certificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* --- IMAGE HEADER --- */}
                <div className="w-full bg-stone-100 flex items-center justify-center p-6 sm:p-10 border-b border-stone-100 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:16px_16px]" />

                    <img
                        src={certificate.imageUrl}
                        alt={certificate.title}
                        className="max-h-[40vh] w-auto object-contain rounded-lg shadow-lg relative z-10"
                    />
                </div>

                {/* --- CONTENT SECTION --- */}
                <div className="p-8 overflow-y-auto bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 text-brand-emerald mb-2">
                                <Award size={18} />
                                <span className="text-sm font-bold uppercase tracking-wider">Certification</span>
                            </div>
                            <h2 className="text-3xl font-bold text-brand-dark mb-1 leading-tight">{certificate.title}</h2>
                            <div className="text-lg text-stone-500 font-medium">{certificate.issuer}</div>
                        </div>

                        {/* Date Badge */}
                        {formattedDate && (
                            <div className="flex-shrink-0 flex items-center gap-2 text-stone-500 text-sm bg-stone-50 px-4 py-2 rounded-full border border-stone-100 font-medium">
                                <Calendar size={16} />
                                <span>{formattedDate}</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {certificate.description ? (
                        <p className="text-stone-600 leading-relaxed mb-8 text-lg border-l-4 border-brand-gold/30 pl-4">
                            {certificate.description}
                        </p>
                    ) : (
                        <p className="text-stone-400 italic mb-8">No description provided.</p>
                    )}

                    {/* Action Button */}
                    <div className="flex gap-4 mt-auto pt-6 border-t border-stone-100">
                        {certificate.verifyLink ? (
                            <a
                                href={certificate.verifyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-dark text-white px-8 py-3.5 rounded-lg font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-0.5"
                            >
                                Verify Credential <ExternalLink size={18} />
                            </a>
                        ) : (
                            <button disabled className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold bg-stone-100 text-stone-400 cursor-not-allowed">
                                Verification Unavailable
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}