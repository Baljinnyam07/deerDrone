"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { 
  MessageSquare, User, Calendar, CheckCircle2, XCircle, 
  Settings, Inbox, Search, Filter, Phone, Bot, Eye, EyeOff, 
  ChevronRight, Copy, Check, MoreVertical, X, Clock, Target, Trash2, Edit, Send
} from "lucide-react";
import { updateLeadStatus, deleteLead, updateMessengerConfig, getConversationHistory, sendMessengerReply, updateLeadNotes } from "./actions";

interface ChatbotDashboardClientProps {
  leads: any[];
  messengerConfig: any;
}

const STATUS_COLORS: Record<string, { bg: string, text: string }> = {
  new: { bg: "#DBEAFE", text: "#1E3A8A" }, // Blue
  contacted: { bg: "#FEF3C7", text: "#92400E" }, // Amber
  qualified: { bg: "#D1FAE5", text: "#065F46" }, // Emerald
  closed: { bg: "#F1F5F9", text: "#475569" }, // Slate
};

const INTENT_COLORS: Record<string, { bg: string, text: string }> = {
  loan_request: { bg: "#FEE2E2", text: "#991B1B" }, // Red
  order_intent: { bg: "#D1FAE5", text: "#065F46" }, // Green
  product_interest: { bg: "#E0E7FF", text: "#3730A3" }, // Indigo
  human_support: { bg: "#FEF3C7", text: "#92400E" }, // Amber
  spam: { bg: "#F1F5F9", text: "#475569" },
  default: { bg: "#F3F4F6", text: "#374151" },
};

export function ChatbotDashboardClient({ leads: initialLeads, messengerConfig }: ChatbotDashboardClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"messenger" | "comments" | "settings">("messenger");
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  
  // Drawer state
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Load chat history when lead selected
  useEffect(() => {
    if (selectedLead) {
      setNotesText(selectedLead.notes || "");
      if (selectedLead.session_id) {
        setIsLoadingHistory(true);
        getConversationHistory(selectedLead.session_id).then(history => {
          setChatHistory(history || []);
          setIsLoadingHistory(false);
        });
      } else {
        setChatHistory([]);
      }
    }
  }, [selectedLead]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Settings State
  const [isPending, startTransition] = useTransition();
  const [isEnabled, setIsEnabled] = useState(messengerConfig?.is_enabled ?? true);
  const [accessToken, setAccessToken] = useState(messengerConfig?.page_access_token || "");
  const [verifyToken, setVerifyToken] = useState(messengerConfig?.verify_token || "");
  const [pageId, setPageId] = useState(messengerConfig?.page_id || "");
  const [showToken, setShowToken] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  // Source Filtered Leads
  const sourceFilteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (activeTab === "comments") return l.category === "fb_comment";
      if (activeTab === "messenger") return l.category !== "fb_comment";
      return true;
    });
  }, [leads, activeTab]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLeads = sourceFilteredLeads.filter(l => l.created_at?.startsWith(today)).length;
    const loanRequests = sourceFilteredLeads.filter(l => l.intent === "loan_request" || l.intent === "financing" || l.category === "loan").length;
    const unanswered = sourceFilteredLeads.filter(l => l.status === "new").length;
    const closed = sourceFilteredLeads.filter(l => l.status === "closed" || l.status === "qualified").length;
    const conversion = sourceFilteredLeads.length ? Math.round((closed / sourceFilteredLeads.length) * 100) : 0;

    return { todayLeads, loanRequests, unanswered, conversion };
  }, [sourceFilteredLeads]);

  // Filtered Leads (Search & Status)
  const filteredLeads = useMemo(() => {
    return sourceFilteredLeads.filter(l => {
      const matchesSearch = (l.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (l.phone || "").includes(searchQuery);
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sourceFilteredLeads, searchQuery, statusFilter]);

  // Handlers
  const handleStatusChange = (id: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status: newStatus });
    
    startTransition(async () => {
      await updateLeadStatus(id, newStatus);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Энэ Lead-ийг устгах уу?")) return;
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
    startTransition(async () => {
      await deleteLead(id);
    });
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedLead?.session_id) return;
    setIsReplying(true);
    try {
      await sendMessengerReply(selectedLead.session_id, replyText);
      // Optimistically add to history
      setChatHistory(prev => [...prev, { message: replyText, from: { id: messengerConfig.page_id }, created_time: new Date().toISOString() }]);
      setReplyText("");
    } catch (err: any) {
      alert(err.message || "Хариу илгээхэд алдаа гарлаа.");
    } finally {
      setIsReplying(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNotes(true);
    try {
      await updateLeadNotes(selectedLead.id, notesText);
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: notesText } : l));
      setSelectedLead({ ...selectedLead, notes: notesText });
    } catch (err: any) {
      // alert if needed, but mostly silent
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleSaveSettings = () => {
    startTransition(async () => {
      try {
        await updateMessengerConfig({
          is_enabled: isEnabled,
          page_access_token: accessToken,
          verify_token: verifyToken,
          page_id: pageId,
        });
        setSettingsMessage("✅ Хадгаллаа");
      } catch (err: any) {
        setSettingsMessage("❌ Алдаа гарлаа");
      }
      setTimeout(() => setSettingsMessage(""), 3000);
    });
  };

  const getLeadScore = (lead: any) => {
    if (lead.intent === "order_intent" || lead.intent === "loan_request") return { text: "Hot", color: "#EF4444" };
    if (lead.intent === "product_interest" || lead.intent === "human_support") return { text: "Warm", color: "#F59E0B" };
    return { text: "Cold", color: "#3B82F6" };
  };

  return (
    <div style={{ backgroundColor: "#F6F8FC", borderRadius: "20px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
      
      {/* Header Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", backgroundColor: "#fff", padding: "0 2rem" }}>
        <button 
          onClick={() => setActiveTab("messenger")}
          style={{ 
            display: "flex", alignItems: "center", gap: "0.5rem", padding: "1.5rem 1rem", 
            borderBottom: activeTab === "messenger" ? "2px solid #2563EB" : "2px solid transparent",
            color: activeTab === "messenger" ? "#2563EB" : "#64748B", fontWeight: 600, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer"
          }}
        >
          <MessageSquare size={18} /> Messenger
        </button>
        <button 
          onClick={() => setActiveTab("comments")}
          style={{ 
            display: "flex", alignItems: "center", gap: "0.5rem", padding: "1.5rem 1rem", 
            borderBottom: activeTab === "comments" ? "2px solid #2563EB" : "2px solid transparent",
            color: activeTab === "comments" ? "#2563EB" : "#64748B", fontWeight: 600, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer"
          }}
        >
          <Inbox size={18} /> Comments
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          style={{ 
            display: "flex", alignItems: "center", gap: "0.5rem", padding: "1.5rem 1rem", 
            borderBottom: activeTab === "settings" ? "2px solid #2563EB" : "2px solid transparent",
            color: activeTab === "settings" ? "#2563EB" : "#64748B", fontWeight: 600, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer"
          }}
        >
          <Settings size={18} /> Bot Settings
        </button>
      </div>

      <div style={{ padding: "2rem" }}>
        {(activeTab === "messenger" || activeTab === "comments") && (
          <div style={{ display: "flex", gap: "2rem", height: "calc(100vh - 250px)", minHeight: "600px" }}>
            
            {/* Left Area: Metrics & Inbox */}
            <div style={{ flex: selectedLead ? "2" : "1", display: "flex", flexDirection: "column", gap: "1.5rem", transition: "all 0.3s" }}>
              
              {/* Metrics Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {[
                  { label: "Today's Leads", value: isMounted ? metrics.todayLeads : "-", icon: Calendar, color: "#2563EB", bg: "#DBEAFE" },
                  { label: "Loan Requests", value: isMounted ? metrics.loanRequests : "-", icon: Target, color: "#EF4444", bg: "#FEE2E2" },
                  { label: "Unanswered", value: isMounted ? metrics.unanswered : "-", icon: MessageSquare, color: "#F59E0B", bg: "#FEF3C7" },
                  { label: "Conversion Rate", value: isMounted ? `${metrics.conversion}%` : "-", icon: CheckCircle2, color: "#10B981", bg: "#D1FAE5" },
                ].map((m, i) => (
                  <div key={i} style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <m.icon size={24} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748B", fontWeight: 500 }}>{m.label}</p>
                      <h3 style={{ margin: 0, fontSize: "1.5rem", color: "#0F172A", fontWeight: 700 }}>{m.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inbox Container */}
              <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                
                {/* Filters */}
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", backgroundColor: "#F8FAFC" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="text" 
                      placeholder="Search by name or phone..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>
                  <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", outline: "none", fontSize: "0.875rem", backgroundColor: "#fff" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Lead List */}
                <div style={{ overflowY: "auto", flex: 1 }}>
                  {filteredLeads.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
                      <Inbox size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
                      <p>No leads found.</p>
                    </div>
                  ) : (
                    filteredLeads.map((lead: any) => {
                      const intentColors = INTENT_COLORS[lead.intent] || INTENT_COLORS.default;
                      const statusColors = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
                      const isSelected = selectedLead?.id === lead.id;

                      return (
                        <div 
                          key={lead.id} 
                          onClick={() => setSelectedLead(lead)}
                          style={{ 
                            display: "flex", alignItems: "flex-start", padding: "1.25rem 1.5rem", gap: "1rem", 
                            borderBottom: "1px solid #F1F5F9", cursor: "pointer",
                            backgroundColor: isSelected ? "#EFF6FF" : "#fff",
                            transition: "background 0.2s"
                          }}
                        >
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#64748B", fontWeight: 600 }}>
                            {lead.name ? lead.name.substring(0, 2).toUpperCase() : "?"}
                          </div>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {lead.name || "Unknown User"}
                              </h4>
                              <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                                {lead.created_at ? new Date(lead.created_at).toISOString().split('T')[0] : "Unknown Date"}
                              </span>
                            </div>
                            
                            <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {lead.interest || "No message preview"}
                            </p>
                            
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                              <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, backgroundColor: intentColors.bg, color: intentColors.text }}>
                                {lead.intent ? lead.intent.replace(/_/g, " ").toUpperCase() : "GENERAL"}
                              </span>
                              <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, backgroundColor: statusColors.bg, color: statusColors.text }}>
                                {lead.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Drawer: Lead Detail */}
            {selectedLead && (
              <div style={{ flex: "1", backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", minWidth: "350px", maxWidth: "450px" }}>
                
                {/* Drawer Header */}
                <div style={{ padding: "1.5rem", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", backgroundColor: "#F8FAFC" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.5rem", fontWeight: 600 }}>
                      {selectedLead.name ? selectedLead.name.substring(0, 1).toUpperCase() : "?"}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0F172A" }}>{selectedLead.name || "Unknown"}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748B", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                        <Phone size={14} /> {selectedLead.phone || "No phone"}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
                </div>

                {/* Drawer Content */}
                <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* Action Bar */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <select 
                      value={selectedLead.status}
                      onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                      style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.875rem", fontWeight: 600, backgroundColor: STATUS_COLORS[selectedLead.status]?.bg || "#fff", color: STATUS_COLORS[selectedLead.status]?.text || "#000" }}
                    >
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="qualified">QUALIFIED</option>
                      <option value="closed">CLOSED</option>
                    </select>
                    <button 
                      onClick={() => handleDelete(selectedLead.id)}
                      style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #FEE2E2", backgroundColor: "#FEF2F2", color: "#EF4444", cursor: "pointer" }}
                      title="Delete Lead"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Info Cards */}
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1, backgroundColor: "#F8FAFC", padding: "1rem", borderRadius: "12px", border: "1px solid #F1F5F9" }}>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 600 }}>Lead Score</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: getLeadScore(selectedLead).color, fontWeight: 700 }}>
                        <Target size={16} /> {getLeadScore(selectedLead).text}
                      </div>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#F8FAFC", padding: "1rem", borderRadius: "12px", border: "1px solid #F1F5F9" }}>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 600 }}>Source</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0F172A", fontWeight: 600, textTransform: "capitalize" }}>
                        <Bot size={16} color="#2563EB" /> {selectedLead.source_page || "Chatbot"}
                      </div>
                    </div>
                  </div>

                  {/* Message Detail / Chat History */}
                  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <MessageSquare size={16} color="#64748B" /> Харилцааны түүх
                    </h4>
                    
                    <div style={{ backgroundColor: "#F8FAFC", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", flex: 1, minHeight: "200px", maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {isLoadingHistory ? (
                        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "0.875rem", margin: "auto" }}>Уншиж байна...</p>
                      ) : chatHistory.length > 0 ? (
                        chatHistory.map((msg, i) => {
                          const isPage = msg.from?.id === messengerConfig?.page_id;
                          return (
                            <div key={i} style={{ alignSelf: isPage ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                              <div style={{ backgroundColor: isPage ? "#2563EB" : "#E2E8F0", color: isPage ? "#fff" : "#0F172A", padding: "0.6rem 0.8rem", borderRadius: "12px", borderBottomRightRadius: isPage ? 0 : "12px", borderBottomLeftRadius: !isPage ? 0 : "12px", fontSize: "0.875rem", whiteSpace: "pre-wrap" }}>
                                {msg.message}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ fontSize: "0.875rem", color: "#64748B", margin: "auto", textAlign: "center" }}>
                          {selectedLead.session_id ? "Түүх олдсонгүй." : "Chat ID байхгүй (Хуучин бүртгэл эсвэл FB Comment)"}
                          <br/><br/>
                          <strong>Сүүлийн сонирхол:</strong><br/>
                          {selectedLead.interest}
                        </div>
                      )}
                    </div>

                    {/* Reply Input */}
                    {selectedLead.session_id && selectedLead.category !== "fb_comment" && (
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Messenger-ээр хариу бичих..."
                          style={{ flex: 1, padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", outline: "none", fontSize: "0.875rem" }}
                          onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                        />
                        <button 
                          onClick={handleSendReply}
                          disabled={isReplying || !replyText.trim()}
                          style={{ padding: "0 1rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", opacity: (!replyText.trim() || isReplying) ? 0.6 : 1 }}
                        >
                          {isReplying ? <Clock size={18} /> : <Send size={18} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Edit size={16} color="#64748B" /> Internal Notes
                    </h4>
                    <textarea 
                      value={notesText}
                      onChange={e => setNotesText(e.target.value)}
                      placeholder="Add notes about this lead..."
                      style={{ width: "100%", padding: "1rem", borderRadius: "12px", fontSize: "0.875rem", border: "1px solid #CBD5E1", minHeight: "80px", resize: "none", outline: "none" }}
                    />
                    <button onClick={handleSaveNotes} disabled={isSavingNotes} style={{ marginTop: "0.5rem", padding: "0.4rem 1rem", fontSize: "0.75rem", backgroundColor: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
                      {isSavingNotes ? "Хадгалж байна..." : "Save Note"}
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Connection Status Card */}
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "2rem", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div>
                  <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", color: "#0F172A" }}>Bot Connection Status</h2>
                  <p style={{ margin: 0, color: "#64748B", fontSize: "0.875rem" }}>Toggle the Chatbot integration for Messenger.</p>
                </div>
                
                {/* Premium Switch */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: isEnabled ? "#10B981" : "#94A3B8" }}>
                    {isEnabled ? "ONLINE" : "OFFLINE"}
                  </span>
                  <label style={{ position: "relative", display: "inline-block", width: "52px", height: "28px" }}>
                    <input type="checkbox" checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ 
                      position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, 
                      backgroundColor: isEnabled ? "#22C55E" : "#CBD5E1", transition: "0.4s", borderRadius: "34px" 
                    }}>
                      <span style={{ 
                        position: "absolute", height: "20px", width: "20px", left: isEnabled ? "28px" : "4px", bottom: "4px", 
                        backgroundColor: "white", transition: "0.4s", borderRadius: "50%", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" 
                      }} />
                    </span>
                  </label>
                </div>
              </div>

              {/* Tokens Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Page Access Token</label>
                  <div style={{ display: "flex", position: "relative" }}>
                    <input
                      type={showToken ? "text" : "password"}
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="EAA..."
                      style={{ flex: 1, padding: "0.75rem 1rem", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "0.875rem", outline: "none", backgroundColor: "#F8FAFC", color: showToken ? "#0F172A" : "#64748B", letterSpacing: showToken ? "normal" : "2px" }}
                    />
                    <button onClick={() => setShowToken(!showToken)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                      {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "#94A3B8" }}>Never share this token with anyone. It gives full access to your Facebook Page messages.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Verify Token</label>
                    <input
                      type="text"
                      value={verifyToken}
                      onChange={(e) => setVerifyToken(e.target.value)}
                      placeholder="Your secret string"
                      style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "0.875rem", outline: "none", backgroundColor: "#F8FAFC" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Page ID</label>
                    <input
                      type="text"
                      value={pageId}
                      onChange={(e) => setPageId(e.target.value)}
                      placeholder="123456789"
                      style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "0.875rem", outline: "none", backgroundColor: "#F8FAFC" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid #E2E8F0" }}>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isPending}
                    style={{
                      padding: "0.75rem 2rem",
                      background: "#2563EB",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: isPending ? "not-allowed" : "pointer",
                      opacity: isPending ? 0.7 : 1,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {isPending ? "Saving..." : "Save Configuration"}
                  </button>
                  {settingsMessage && <span style={{ fontSize: "0.875rem", fontWeight: 500, color: settingsMessage.includes("Алдаа") ? "#EF4444" : "#10B981" }}>{settingsMessage}</span>}
                </div>
              </div>
            </div>

            {/* Model Setup Info Card */}
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "2rem", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h2 style={{ margin: "0 0 1.5rem", fontSize: "1.25rem", color: "#0F172A" }}>Model Configuration</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                  <div>
                    <strong style={{ color: "#0F172A", display: "block", marginBottom: "0.25rem" }}>GPT-4o-mini</strong>
                    <span style={{ color: "#64748B", fontSize: "0.875rem" }}>Primary Inference Engine</span>
                  </div>
                  <span style={{ backgroundColor: "#D1FAE5", color: "#065F46", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>ACTIVE</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                  <div>
                    <strong style={{ color: "#0F172A", display: "block", marginBottom: "0.25rem" }}>Streaming Contracts</strong>
                    <span style={{ color: "#64748B", fontSize: "0.875rem" }}>UI/UX Optimization</span>
                  </div>
                  <span style={{ backgroundColor: "#DBEAFE", color: "#1E3A8A", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>ENABLED</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
