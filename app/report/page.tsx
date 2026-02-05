'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface StyleReport {
  primaryStyle: string;
  secondaryInfluences: string[];
  designRules: string[];
  decisionLocks: string[];
  designConsequences: string[];
  contradictions: string;
  avoidList: string[];
  clientSummary: string;
}

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<StyleReport | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedReport = window.sessionStorage.getItem('styleReport');
      if (storedReport) {
        setReport(JSON.parse(storedReport));
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    }
  }, [router]);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const reportElement = document.getElementById('report-content');
      if (!reportElement) return;

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('design-alignment-contract.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top nav */}
        <div className="mb-6 flex justify-between items-center">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-700 font-medium">
            ← New Analysis
          </button>
          <button
            onClick={exportToPDF}
            disabled={exporting}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {exporting ? 'Generating PDF...' : 'Export to PDF'}
          </button>
        </div>

        {/* The printable contract */}
        <div id="report-content" className="bg-white shadow-xl rounded-lg overflow-hidden">

          {/* Header */}
          <div className="bg-gray-900 text-white px-10 py-8 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Confidential</p>
            <h1 className="text-3xl font-bold tracking-tight">Design Alignment Contract</h1>
            <p className="text-gray-400 mt-1 text-sm">This document defines the approved design direction for your project.</p>
            <p className="text-gray-500 text-xs mt-3">Significant deviations from this direction may require re-quotation or timeline adjustment.</p>
          </div>

          <div className="p-10 space-y-10">

            {/* Primary Style */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="inline-block w-1 h-6 bg-blue-600 rounded mr-3"></span>
                Primary Style Direction
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{report.primaryStyle}</p>
            </section>

            {/* Secondary Influences */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="inline-block w-1 h-6 bg-blue-400 rounded mr-3"></span>
                Secondary Influences
              </h2>
              <div className="space-y-2">
                {report.secondaryInfluences.map((item, i) => (
                  <div key={i} className="flex items-start bg-blue-50 px-4 py-2 rounded">
                    <span className="text-blue-500 font-bold mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Decision Locks */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                <span className="inline-block w-1 h-6 bg-indigo-600 rounded mr-3"></span>
                🔒 Locked Decisions
              </h2>
              <p className="text-xs text-gray-500 mb-3 ml-4">These decisions are approved and locked. Changes require written re-agreement.</p>
              <div className="border border-indigo-200 rounded-lg overflow-hidden">
                {report.decisionLocks.map((item, i) => (
                  <div key={i} className={`flex items-center px-4 py-3 ${i % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}`}>
                    <span className="text-indigo-600 font-bold mr-3">🔐</span>
                    <span className="text-gray-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Design Rules */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                <span className="inline-block w-1 h-6 bg-green-600 rounded mr-3"></span>
                Design Rules
              </h2>
              <p className="text-xs text-gray-500 mb-3 ml-4">Concrete rules — not suggestions. Every decision in this project must follow these.</p>
              <div className="space-y-2">
                {report.designRules.map((rule, i) => (
                  <div key={i} className="flex items-start bg-green-50 border border-green-200 px-4 py-3 rounded">
                    <span className="text-green-600 font-bold mr-3 mt-0.5">✓</span>
                    <span className="text-gray-800">{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Design Consequences */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                <span className="inline-block w-1 h-6 bg-red-500 rounded mr-3"></span>
                ⚠️ Design Consequences
              </h2>
              <p className="text-xs text-gray-500 mb-3 ml-4">If the approved direction is changed mid-project, these are the likely impacts:</p>
              <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                {report.designConsequences.map((item, i) => (
                  <div key={i} className={`flex items-start px-4 py-3 ${i !== 0 ? 'border-t border-red-200' : ''}`}>
                    <span className="text-red-500 font-bold mr-3 mt-0.5">⚡</span>
                    <span className="text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Contradictions */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="inline-block w-1 h-6 bg-yellow-500 rounded mr-3"></span>
                Contradictions & Resolutions
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 px-5 py-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{report.contradictions}</p>
              </div>
            </section>

            {/* Avoid List */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="inline-block w-1 h-6 bg-red-600 rounded mr-3"></span>
                🚫 Avoid List
              </h2>
              <div className="space-y-2">
                {report.avoidList.map((item, i) => (
                  <div key={i} className="flex items-start bg-gray-50 border border-gray-200 px-4 py-2 rounded">
                    <span className="text-red-600 font-bold mr-3">✗</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Divider */}
            <hr className="border-gray-300" />

            {/* Client Approval */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">Client Approval</h2>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <p className="text-gray-800 leading-relaxed text-base text-center">{report.clientSummary}</p>

                <div className="mt-6 pt-5 border-t border-blue-200">
                  <p className="text-xs text-gray-600 text-center mb-1 font-semibold">
                    By signing below, I approve this design direction.
                  </p>
                  <p className="text-xs text-gray-500 text-center mb-5">
                    This document defines the approved design direction. Significant deviations may require re-quotation or timeline adjustment.
                  </p>
                  <div className="flex space-x-8">
                    <div className="flex-1">
                      <div className="border-b-2 border-gray-400 pb-2 mb-2"></div>
                      <p className="text-xs text-gray-500">Client Signature</p>
                    </div>
                    <div className="w-40">
                      <div className="border-b-2 border-gray-400 pb-2 mb-2"></div>
                      <p className="text-xs text-gray-500">Date</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t px-10 py-4 text-center">
            <p className="text-xs text-gray-400">Generated by AI Style Matching — Design Alignment Contract v1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
