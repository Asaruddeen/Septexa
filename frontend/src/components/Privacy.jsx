import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#030304] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#2dd4ff] opacity-[0.04] top-[-15%] left-[-10%] blur-[100px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#e94ec4] opacity-[0.04] bottom-[-15%] right-[-10%] blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto px-6 py-8">
        {/* Navbar */}
        <nav className="flex justify-between items-center py-4 border-b border-[#17171f]">
          <Link to="/" className="flex items-center gap-3">
            <img src="/septexa-logo.png" alt="Septexa" className="h-8 w-auto" />
            <span className="text-lg font-bold text-white font-['Space_Grotesk']">Septexa</span>
          </Link>
          <Link 
            to="/" 
            className="px-5 py-2 rounded-lg font-bold text-sm bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] text-[#050208] hover:brightness-110 transition-all"
          >
            ← Back to home
          </Link>
        </nav>

        {/* Content */}
        <div className="py-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-['Space_Grotesk'] mb-6">Privacy Policy</h1>
          <p className="text-[#9297a6] text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">1. Information We Collect</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                Septexa collects information you provide directly, such as when you create an account, use our services, or communicate with us. This may include your name, email address, and usage data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">2. How We Use Your Information</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                We use your information to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to communicate with you about products, services, and events.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">3. Data Security</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">4. Data Sharing</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website and conducting our business.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">5. Your Rights</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">6. Cookies</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">7. Changes to This Policy</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">8. Contact Us</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@septexa.ai" className="text-[#2dd4ff] hover:underline">privacy@septexa.ai</a>.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#17171f] py-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/septexa-logo.png" alt="Septexa" className="h-5 w-auto" />
              <span className="text-xs text-[#5c6070]">© {new Date().getFullYear()} Septexa</span>
            </div>
            <div className="flex gap-6">
              <Link to="/" className="text-xs text-[#5c6070] hover:text-[#2dd4ff] transition-colors">Home</Link>
              <Link to="/terms" className="text-xs text-[#5c6070] hover:text-[#2dd4ff] transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Privacy;