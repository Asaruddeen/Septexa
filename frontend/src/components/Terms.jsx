import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
          <h1 className="text-4xl font-bold font-['Space_Grotesk'] mb-6">Terms of Service</h1>
          <p className="text-[#9297a6] text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">1. Acceptance of Terms</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                By accessing or using Septexa, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">2. Description of Service</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                Septexa provides a platform that indexes and routes users to various AI tools and services. We do not host or provide the AI models themselves but act as a discovery and routing layer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">3. User Accounts</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">4. User Conduct</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                You agree not to use Septexa for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service. You may not attempt to gain unauthorized access to any part of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">5. Intellectual Property</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                The Septexa platform, including its design, logo, and content, is owned by Septexa and protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">6. Third-Party Links</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                Septexa contains links to third-party AI tools and services. We are not responsible for the content, privacy policies, or practices of these third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">7. Disclaimer of Warranties</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                Septexa is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. We are not responsible for the accuracy or reliability of third-party AI tools.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">8. Limitation of Liability</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                To the maximum extent permitted by law, Septexa shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">9. Termination</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                We reserve the right to suspend or terminate your access to Septexa at any time, with or without cause, and with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">10. Governing Law</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Septexa operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">11. Changes to Terms</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page and updating the date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-['Space_Grotesk'] mb-3 text-white">12. Contact Us</h2>
              <p className="text-[#9297a6] text-sm leading-relaxed">
                If you have questions about these Terms, please contact us at <a href="mailto:legal@septexa.ai" className="text-[#2dd4ff] hover:underline">legal@septexa.ai</a>.
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
              <Link to="/privacy" className="text-xs text-[#5c6070] hover:text-[#2dd4ff] transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Terms;