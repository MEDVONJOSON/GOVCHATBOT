'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
className = "mt-4 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--sl-blue)] transition-all"
    />
                    </div >

    {/* Scammer Information Section */ }
    < div className = "bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4" >
                        <h3 className="text-lg font-bold text-white mb-4">🔍 Scammer Information</h3>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Phone Number Used by Scammer</label>
                            <input
                                type="text"
                                name="scammerPhone"
                                value={formData.scammerPhone}
                                onChange={handleChange}
                                placeholder="+232 XX XXX XXXX"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--sl-blue)] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Account Number (if applicable)</label>
                            <input
                                type="text"
                                name="scammerAccount"
                                value={formData.scammerAccount}
                                onChange={handleChange}
                                placeholder="Mobile money account, bank account, etc."
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--sl-blue)] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Platform</label>
                            <select
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--sl-blue)] transition-all"
                            >
                                <option value="whatsapp">WhatsApp</option>
                                <option value="sms">SMS</option>
                                <option value="facebook">Facebook</option>
                                <option value="email">Email</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Date of Incident</label>
                            <input
                                type="date"
                                name="incidentDate"
                                value={formData.incidentDate}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--sl-blue)] transition-all"
                            />
                        </div>
                    </div >

    {/* Reporter Identity Section */ }
    < div className = "bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4" >
                        <h3 className="text-lg font-bold text-white mb-4">👤 Reporter Identity (Optional)</h3>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isAnonymous"
                                checked={formData.isAnonymous}
                                onChange={handleChange}
                                className="w-5 h-5 rounded bg-black/40 border border-white/10 focus:ring-2 focus:ring-[var(--sl-blue)]"
                            />
                            <label className="text-sm text-gray-300">I want to submit this report anonymously.</label>
                        </div>

{
    !formData.isAnonymous && (
        <div className="space-y-4 mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500">Authorities can reach out only if needed.</p>
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Name</label>
                <input
                    type="text"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--sl-blue)] transition-all"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email or Phone Number</label>
                <input
                    type="text"
                    name="reporterContact"
                    value={formData.reporterContact}
                    onChange={handleChange}
                    placeholder="Your email or phone"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--sl-blue)] transition-all"
                />
            </div>
        </div>
    )
}
                    </div >

    {/* Submit Button */ }
    < button
type = "submit"
disabled = { loading }
className = "w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
{
    loading?(
                            <span className = "flex items-center justify-center gap-2" >
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Submitting Report...
                            </span>
                        ) : (
    '🚨 SUBMIT REPORT'
)}
                    </button >

                </form >

    <div className="mt-8 text-center text-sm text-gray-500">
        <p>Your report will be reviewed by our cybersecurity team securely.</p>
    </div>

            </div >

    <Footer />
        </main >
    );
}
