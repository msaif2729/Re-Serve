import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, ShieldCheck, CheckCircle2, Award, Building, Utensils, Calendar, MapPin } from 'lucide-react';

export default function CertificateGenerator({ order, donor, ngo }) {
  const certificateRef = useRef();

  const handleDownloadPdf = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Re-Serve_Tax_Certificate_${order?._id || 'receipt'}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const receiptDate = order?.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : new Date().toLocaleDateString();

  return (
    <div className="space-y-4">
      {/* Hidden Render Container for PDF Capture */}
      <div className="overflow-hidden h-0 w-0 relative">
        <div
          ref={certificateRef}
          className="w-[1120px] h-[790px] bg-slate-950 text-white p-12 space-y-8 border-8 border-emerald-500/40 relative font-sans"
        >
          {/* Certificate Header */}
          <div className="flex items-center justify-between border-b-2 border-emerald-500/30 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950">
                <Utensils className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">Re-Serve Surplus Network</h1>
                <p className="text-xs text-emerald-400 font-mono">National Food Safety & Redistribution Compliance</p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400 space-y-0.5">
              <div>Voucher ID: RSV-{order?._id ? String(order._id).slice(-8).toUpperCase() : 'RECEIPT'}</div>
              <div>Issue Date: {receiptDate}</div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center space-y-2 py-4">
            <div className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-4 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>Official Tax Exemption Certificate</span>
            </div>
            <h2 className="text-4xl font-black text-white">CERTIFICATE OF FOOD DONATION</h2>
            <p className="text-slate-400 text-sm">Issued in recognition of verified surplus food donation to hunger relief.</p>
          </div>

          {/* Donor & NGO Details */}
          <div className="grid grid-cols-2 gap-6 bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">DONOR BUSINESS ENTITY</span>
              <h3 className="text-xl font-bold text-white">{donor?.name || 'Registered Donor Kitchen'}</h3>
              <p className="text-xs text-slate-400">FSSAI License: {donor?.fssai_license || 'Verified License'}</p>
              {donor?.address_text && <p className="text-xs text-slate-400">Address: {donor.address_text}</p>}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">RECIPIENT NGO ORGANIZATION</span>
              <h3 className="text-xl font-bold text-white">{ngo?.name || 'Verified Relief NGO'}</h3>
              <p className="text-xs text-slate-400">NGO Reg No: {ngo?.reg_no || 'Verified Registration'}</p>
              <p className="text-xs text-slate-400">Tax Exemption: Tax Exemption Verified</p>
            </div>
          </div>

          {/* Donation Summary Table */}
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex justify-between font-bold text-xs uppercase text-slate-400 border-b border-slate-800 pb-2">
              <span>Item Description</span>
              <span>Servings</span>
              <span>Fair Market Valuation</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-white">
              <span>{order?.donor_form_id?.food_name || 'Surplus Meal Listing'}</span>
              <span>{order?.serves || 0} Meals</span>
              <span className="text-emerald-400">₹{((order?.serves || 0) * 85).toLocaleString()}</span>
            </div>
          </div>

          {/* Footer & Stamps */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Verified via OTP Physical Handover Protocol</span>
            </div>

            <div className="text-right font-mono">
              <p className="text-white font-bold">Authorized Signatory</p>
              <p className="text-[10px] text-slate-500">Re-Serve Audit Board</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visible Action Button */}
      <button
        onClick={handleDownloadPdf}
        className="gradient-btn px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 w-full shadow-lg"
      >
        <Download className="w-4 h-4" />
        <span>Download Tax Exemption Certificate (PDF)</span>
      </button>
    </div>
  );
}
