"use client";

import { useState, useEffect } from "react";
import { Trash2, Mail, Calendar, User, RefreshCw } from "lucide-react";

type Message = {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
};

export default function MessageManager() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/contact");
            if (res.ok) setMessages(await res.json());
        } catch (error) {
            console.error("Failed to load messages");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this message permanently?")) return;

        // Optimistic UI update (remove immediately)
        setMessages(messages.filter(m => m.id !== id));

        try {
            await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
        } catch (error) {
            alert("Failed to delete from server");
            fetchMessages(); // Revert on error
        }
    };

    // Format date nicely (e.g., "Oct 24, 2024")
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-stone-800">Inbox</h2>
                <button
                    onClick={fetchMessages}
                    className="p-2 text-stone-500 hover:text-brand-emerald hover:bg-stone-50 rounded-lg transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="space-y-4">
                {isLoading && messages.length === 0 ? (
                    <div className="text-center py-10 text-stone-400">Loading messages...</div>
                ) : messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg.id} className="p-5 border border-stone-100 rounded-xl bg-stone-50/50 hover:bg-white hover:shadow-md transition-all group">

                            {/* Header: Name, Email, Date, Delete */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-100">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-dark">{msg.name}</h3>
                                        <a href={`mailto:${msg.email}`} className="text-sm text-stone-500 hover:text-brand-emerald flex items-center gap-1">
                                            <Mail size={12} /> {msg.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-xs font-medium text-stone-400 flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-stone-100">
                                        <Calendar size={12} />
                                        {formatDate(msg.createdAt)}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Message Body */}
                            <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                            </p>

                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                        <Mail className="mx-auto h-10 w-10 text-stone-300 mb-3" />
                        <p className="text-stone-500 font-medium">No messages yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}