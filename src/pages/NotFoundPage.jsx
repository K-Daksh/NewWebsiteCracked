import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const NotFoundPage = ({ onGoHome }) => {
  return (
    <>
      <Helmet>
        <title>404: Page Not Found | Cracked Digital</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-lg mx-auto"
        >
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 tracking-tighter">
                404
            </h1>
            
            <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Lost in the Void?
                </h2>
                <p className="text-white/50 text-lg">
                    The page you're looking for seems to have drifted into digital oblivion.
                </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={onGoHome}
                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                    <Home size={20} />
                    Back to Home
                </button>
            </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
