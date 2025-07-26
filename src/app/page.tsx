'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlienCursorFollower from "@/components/AlienCursorFollower";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    setScanning(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("https://fe665a5ae7a4.ngrok-free.app/analyze/scanme.nmap.org");
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Scan failed");
        }

        setResult(data);
        // Save to database
        await saveScanResult(data);
      } else {
        const html = await response.text();
        setError(`__HTML__${html}`);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setScanning(false);
    }
  };

  // Function to save scan results to database
  const saveScanResult = async (scanData: any) => {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .insert([
          {
            target: scanData.target,
            scan_result: scanData.scan_result,
            analysis: scanData.analysis,
            timestamp: new Date().toISOString(),
            status: 'completed'
          }
        ])
        .select()

      if (error) {
        console.error('Error saving to database:', error)
      } else {
        console.log('Scan result saved:', data)
      }
    } catch (err) {
      console.error('Database error:', err)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 text-white">
      {/* Background Image */}
      <div className="fixed inset-0 -z-20 w-full h-full">
        <img
          src="/j.jpg"
          alt="background"
          className="w-full h-full object-cover object-center"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
          draggable={false}
        />
      </div>

      {/* Header */}
      <motion.h1
        className="text-5xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_#38bdf8]"
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: [0.9, 1.05, 1], opacity: [0.7, 1, 1] }}
        transition={{ duration: 1.2 }}
      >
        Sentinel AI Dashboard
      </motion.h1>

      <motion.p className="mb-6 text-gray-400 text-center max-w-xl">
        Run a network scan and instantly get expert AI insights.
      </motion.p>

      {/* Scan Button */}
      <motion.button
        className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg relative overflow-hidden"
        onClick={handleScan}
        disabled={scanning}
        whileHover={{ scale: 1.07, boxShadow: "0 0 24px #38bdf8" }}
        animate={{
          boxShadow: scanning
            ? "0 0 32px 8px #38bdf8, 0 0 64px 16px #0ea5e9"
            : "0 2px 8px #0004"
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="relative z-10">{scanning ? "Scanning..." : "Scan Now"}</span>
        {scanning && (
          <motion.span
            className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-40"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          />
        )}
      </motion.button>

      {/* Loading Message */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            className="mt-8 text-lg text-blue-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Scanning in progress... Please wait.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Results */}
      {result && (
        <div className="mt-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-800/70 backdrop-blur-md border border-blue-400/20 shadow-xl rounded-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-green-400 mb-2">Target</h2>
            <p className="text-gray-300 text-sm">{result.target}</p>
          </motion.div>

          <motion.div
            className="bg-gray-800/70 backdrop-blur-md border border-yellow-400/20 shadow-xl rounded-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">Raw Nmap Output</h2>
            <pre className="text-xs whitespace-pre-wrap text-gray-300 overflow-x-auto max-h-64">
              {result.scan_result}
            </pre>
          </motion.div>

          <motion.div
            className="bg-gray-800/70 backdrop-blur-md border border-purple-400/20 shadow-xl rounded-xl md:col-span-2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-2">AI Analysis & Recommendations</h2>
            <div className="whitespace-pre-wrap text-sm text-gray-200">
              {result.analysis}
            </div>
          </motion.div>
        </div>
      )}

      {/* Fallback HTML Error */}
      {error.startsWith("__HTML__") && (
        <div
          className="mt-10 w-full max-w-5xl bg-gray-800 p-6 rounded-lg shadow-md text-white text-sm overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: error.replace("__HTML__", "") }}
        />
      )}

      {/* Error Text */}
      {error && !error.startsWith("__HTML__") && (
        <div className="mt-6 text-red-400 font-semibold">
          ❌ Error: {error}
        </div>
      )}

      {/* SVG particle animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="absolute inset-0" style={{ filter: 'blur(1.5px)' }}>
          {/* Floating dots */}
          <circle cx="10%" cy="20%" r="2" fill="#38bdf8">
            <animate attributeName="cy" values="20%;80%;20%" dur="8s" repeatCount="indefinite" />
          </circle>
          {/* More circles below... (skipped here for brevity) */}
        </svg>
      </div>

      {/* 👽 Alien spaceship that follows the cursor */}
      <AlienCursorFollower />
    </div>
  );
}
