
import React, { useState } from 'react';
import { FileText, Download, Filter, FileSpreadsheet, FilePieChart, RefreshCcw, CheckCircle2, Loader2, Calendar, ShieldCheck, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAppContext } from '../context/AppContext.tsx';

// Completed the truncated ReportsPage component and added export default
const ReportsPage: React.FC = () => {
  const { transactions, users, target, preferences, showToast } = useAppContext();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'short' });
  const currentYear = now.getFullYear();
  
  const lastMonth = new Date(); lastMonth.setMonth(now.getMonth() - 1);
  const lastMonthName = lastMonth.toLocaleString('default', { month: 'short' });
  const lastMonthYear = lastMonth.getFullYear();

  const prevMonth = new Date(); prevMonth.setMonth(now.getMonth() - 2);
  const prevMonthName = prevMonth.toLocaleString('default', { month: 'short' });
  const prevMonthYear = prevMonth.getFullYear();

  const reportTypes = [
    { id: 'monthly', title: 'Monthly Contribution Summary', icon: FileText, date: `${currentMonthName} ${currentYear}`, size: 'Auto', desc: 'Detailed ledger of all approved group contributions for the current fiscal period.' },
    { id: 'goal', title: 'Group Goal Performance', icon: FilePieChart, date: `${lastMonthName} ${lastMonthYear}`, size: 'Auto', desc: 'Strategic analysis of progress toward the shared savings initiative and maturity timeline.' },
    { id: 'audit', title: 'Member Savings Audit', icon: FileSpreadsheet, date: `${prevMonthName} ${prevMonthYear}`, size: 'Auto', desc: 'Certified history of user contributions, standing, and ranking within the ecosystem.' },
  ];

  const generatePDF = async (id: string) => {
    setIsGenerating(id);
    
    try {
      const doc = new jsPDF();
      const accentColor = preferences.primaryColor;
      
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : [1, 195, 141];
      };
      
      const rgb = hexToRgb(accentColor);

      // --- Professional Header ---
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      doc.rect(0, 0, 210, 50, 'F');
      
      // Logo Placeholder
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1);
      doc.circle(30, 25, 12, 'S');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('P', 27, 27);

      doc.setFontSize(26);
      doc.text('PROSPERA', 50, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL FINANCIAL STATEMENT & AUDIT RECORD', 50, 35);
      
      doc.setFontSize(8);
      doc.text(`Doc ID: PRSP-${Math.random().toString(36).substring(7).toUpperCase()}`, 150, 20);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 150, 25);
      doc.text(`Group: ${preferences.groupName}`, 150, 30);
      doc.text(`Currency: ${preferences.currency}`, 150, 35);

      let currentY = 65;

      if (id === 'monthly') {
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFontSize(18);
        doc.text('Monthly Contribution Ledger', 20, currentY);
        currentY += 12;
        
        doc.setTextColor(120, 120, 120);
        doc.setFontSize(10);
        doc.text(`This document captures all approved funds received by ${preferences.groupName} for the current month.`, 20, currentY);
        currentY += 15;

        // Summary Statistics Box
        doc.setFillColor(248, 248, 248);
        doc.roundedRect(20, currentY, 170, 25, 3, 3, 'F');
        
        const approvedTxs = transactions.filter(t => t.status === 'APPROVED');
        const total = approvedTxs.reduce((sum, t) => sum + t.amount, 0);

        doc.setTextColor(80, 80, 80);
        doc.setFontSize(8);
        doc.text('TOTAL REVENUE', 30, currentY + 10);
        doc.text('TRANSACTION COUNT', 90, currentY + 10);
        doc.text('ACTIVE MEMBERS', 150, currentY + 10);

        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFontSize(14);
        doc.text(`${preferences.currency} ${total.toLocaleString()}`, 30, currentY + 18);
        doc.text(`${approvedTxs.length}`, 90, currentY + 18);
        doc.text(`${users.length}`, 150, currentY + 18);
        
        currentY += 40;

        const tableData = approvedTxs.map(t => [
            t.date, 
            t.userName, 
            t.description.length > 40 ? t.description.substring(0, 37) + '...' : t.description, 
            `${t.currency} ${t.amount.toLocaleString()}`
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Value Date', 'Member Name', 'Source/Description', 'Amount']],
          body: tableData,
          headStyles: { fillColor: rgb, fontSize: 10, cellPadding: 4 },
          bodyStyles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          margin: { left: 20, right: 20 },
          theme: 'striped'
        });

      } else if (id === 'goal') {
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFontSize(18);
        doc.text('Goal Performance Analysis', 20, currentY);
        currentY += 12;

        doc.setTextColor(120, 120, 120);
        doc.setFontSize(10);
        doc.text(`Projected growth and maturity status for the current group initiative.`, 20, currentY);
        currentY += 20;

        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFontSize(14);
        doc.text(`Target: ${target.title}`, 20, currentY);
        currentY += 8;
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text(`Motive: ${target.motive}`, 20, currentY, { maxWidth: 170 });
        currentY += 15;

        // Visual Progress Ring Simulation (Simple bar)
        const progress = Math.min((target.currentAmount / target.targetAmount) * 100, 100);
        doc.setFillColor(240, 240, 240);
        doc.rect(20, currentY, 170, 8, 'F');
        doc.setFillColor(rgb[0], rgb[1], rgb[2]);
        doc.rect(20, currentY, (170 * progress) / 100, 8, 'F');
        
        currentY += 15;
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFontSize(14);
        doc.text(`${Math.round(progress)}% of Total Goal Achieved`, 20, currentY);
        
        currentY += 20;
        autoTable(doc, {
          startY: currentY,
          head: [['KPI Metric', 'Current Value']],
          body: [
            ['Principal Goal Amount', `${preferences.currency} ${target.targetAmount.toLocaleString()}`],
            ['Total Accumulation', `${preferences.currency} ${target.currentAmount.toLocaleString()}`],
            ['Deficit Remaining', `${preferences.currency} ${(target.targetAmount - target.currentAmount).toLocaleString()}`],
            ['Expected Maturity', target.deadline],
            ['Daily Savings Required', `${preferences.currency} ${Math.round((target.targetAmount - target.currentAmount) / 30).toLocaleString()} (est.)`],
          ],
          headStyles: { fillColor: rgb },
          margin: { left: 20, right: 20 },
        });

      } else if (id === 'audit') {
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFontSize(18);
        doc.text('Member Audit & Contribution Ranking', 20, currentY);
        currentY += 12;

        doc.setTextColor(120, 120, 120);
        doc.setFontSize(10);
        doc.text(`Certified ranking of all members based on cumulative lifetime contributions.`, 20, currentY);
        currentY += 20;

        const tableData = users.map(u => [
          `POS-${u.rank.toString().padStart(3, '0')}`,
          u.name,
          u.email,
          `${preferences.currency} ${u.totalContributed.toLocaleString()}`
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Audit Index', 'Member Name', 'Contact Identifier', 'Total Contribution']],
          body: tableData,
          headStyles: { fillColor: rgb },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          margin: { left: 20, right: 20 },
        });
      }

      // --- Finality Signatures ---
      const lastTable = (doc as any).lastAutoTable;
      const finalY = lastTable ? lastTable.finalY + 30 : currentY + 50;
      
      // Prevent overflow to footer
      if (finalY < 250) {
        doc.setDrawColor(200, 200, 200);
        doc.line(20, finalY, 70, finalY);
        doc.line(140, finalY, 190, finalY);
        
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('TREASURY SEAL', 35, finalY + 5);
        doc.text('GROUP REPRESENTATIVE', 150, finalY + 5);
      }

      doc.save(`Prospera_Report_${id}_${Date.now()}.pdf`);
      setDownloaded(prev => [...prev, id]);
      showToast('Report generated successfully!', 'success');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      showToast('Failed to generate PDF.', 'error');
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">Financial Reports</h1>
          <p className="text-prospera-gray">Generate certified statements and audit records.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-prospera-accent/10 border border-prospera-accent/20 rounded-xl text-prospera-accent text-sm font-bold">
          <ShieldCheck className="w-4 h-4" />
          Verified System
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reportTypes.map((report) => (
          <div key={report.id} className="p-8 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-xl flex flex-col hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-prospera-accent/10 rounded-2xl text-prospera-accent">
                <report.icon className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-prospera-gray">{report.date}</span>
            </div>
            
            <h3 className="text-xl font-black mb-3 dark:text-white text-gray-900 leading-tight">{report.title}</h3>
            <p className="text-xs text-prospera-gray leading-relaxed flex-1 mb-8">{report.desc}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                {downloaded.includes(report.id) ? (
                  <CheckCircle2 className="w-4 h-4 text-prospera-accent" />
                ) : (
                  <RefreshCcw className="w-4 h-4 text-prospera-gray" />
                )}
                <span className="text-[10px] font-bold text-prospera-gray uppercase">
                  {downloaded.includes(report.id) ? 'Downloaded' : 'Ready'}
                </span>
              </div>
              
              <button 
                onClick={() => generatePDF(report.id)}
                disabled={isGenerating === report.id}
                className="flex items-center gap-2 px-5 py-2.5 bg-prospera-accent text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-prospera-accent/20 hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isGenerating === report.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-prospera-darkest border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Printer className="w-32 h-32 text-prospera-accent" />
        </div>
        <div className="md:w-1/3">
           <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=500" alt="Audit" className="rounded-2xl shadow-2xl border-2 border-white/5" />
        </div>
        <div className="flex-1 space-y-4">
           <h3 className="text-2xl font-black text-white">Custom Fiscal Audit</h3>
           <p className="text-prospera-gray text-sm leading-relaxed max-w-lg">
             Need a custom date range or specific member audit? Admins can request custom exports from the system logs for compliance purposes.
           </p>
           <button className="px-8 py-3 border border-prospera-accent text-prospera-accent rounded-xl font-bold hover:bg-prospera-accent hover:text-white transition-all">
             Request Data Export
           </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
