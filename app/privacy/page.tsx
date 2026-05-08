import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - ShitchatAI",
  description: "Privacy policy for ShitchatAI - Your data stays on your device",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to ShitchatAI
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">Last Updated: 03/05/2026</p>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to ShitchatAI ("we," "our," or "us"). This Privacy
                Policy explains how we handle your information when you use our
                web application. Your privacy is important to us, and we are
                committed to being transparent about our data practices.
              </p>
            </section>

            {/* Information We Do NOT Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Do NOT Collect
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold mb-2">
                  We want to be very clear: ShitchatAI is designed with privacy
                  as a core principle.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-3">We do NOT:</h3>
                <ul className="list-disc list-inside text-red-700 space-y-2">
                  <li>Collect any personal identification information</li>
                  <li>Require user registration or accounts</li>
                  <li>
                    Store your conversations, characters, or settings on our
                    servers
                  </li>
                  <li>Use tracking cookies or analytics services</li>
                  <li>Access your messages or chat content</li>
                  <li>
                    Share any user data with third parties, except when you
                    explicitly send data to third-party APIs you configure
                  </li>
                </ul>
              </div>
            </section>

            {/* Information Stored Locally */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Information Stored Locally
              </h2>
              <p className="text-gray-700 mb-4">
                The following data is stored{" "}
                <strong>only on your device</strong> using your browser's local
                storage:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Chat Data Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">
                    3.1 Chat Data
                  </h3>
                  <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>
                      Character profiles (names, personalities, scenarios)
                    </li>
                    <li>Chat conversations and messages</li>
                    <li>Chat titles and organization</li>
                    <li>Character images and thumbnails</li>
                  </ul>
                </div>

                {/* User Settings Card */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-3">
                    3.2 User Settings
                  </h3>
                  <ul className="list-disc list-inside text-purple-700 space-y-1 text-sm">
                    <li>Your display name and pronouns</li>
                    <li>User description</li>
                    <li>User profile images</li>
                    <li>
                      API settings (e.g., API keys, endpoints, and model
                      configuration provided by you)
                    </li>
                    <li>System prompts and preferences</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    3.3 External Content
                  </h3>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                    <li>Image URLs you provide are stored locally</li>
                    <li>External images are cached by your browser</li>
                    <li>We do not modify or re-host external images</li>
                  </ul>
                </div>
                {/* Add to your existing grid in Section 3 */}
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="font-semibold text-pink-800 mb-3">
                    3.4 User Presets
                  </h3>
                  <ul className="list-disc list-inside text-pink-700 space-y-1 text-sm">
                    <li>Saved display names and pronouns</li>
                    <li>User descriptions and bios</li>
                    <li>Profile image preferences</li>
                    <li>Custom preset configurations</li>
                    <li>Preset names and organization</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Legal Basis for Processing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Legal Basis for Processing
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700">We process your data based on:</p>
                <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
                  <li>
                    <strong>Consent:</strong> You explicitly agreed to data
                    storage through our consent banner
                  </li>
                  <li>
                    <strong>Legitimate Interest:</strong> Providing core chat
                    functionality you requested
                  </li>
                  <li>
                    <strong>Contractual Necessity:</strong> Fulfilling the
                    service you actively use
                  </li>
                </ul>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Third-Party Services & Data Transfers
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-yellow-800 mb-3">
                  5.1 User-Configured AI Services
                </h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-2">
                  <li>
                    Your messages and conversation context are sent directly to
                    the API endpoint you configure (e.g., OpenRouter or any
                    compatible provider)
                  </li>
                  <li>We do not intercept, store, or log these API requests</li>
                  <li>
                    API keys and endpoint settings are stored locally on your
                    device and are never sent to our servers
                  </li>
                  <li>
                    Data handling depends on the third-party service you choose
                    to use
                  </li>
                  <li>
                    You are responsible for reviewing the privacy policy of your
                    selected provider to understand how they handle your data
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">
                  5.2 Data Transmission
                </h3>
                <ul className="list-disc list-inside text-green-700 space-y-2">
                  <li>
                    All communication between your device and configured APIs is
                    performed directly from your browser
                  </li>
                  <li>
                    Requests are typically encrypted via HTTPS (depending on the
                    endpoint you use)
                  </li>
                  <li>
                    We do not operate backend servers that process or relay your
                    chat data
                  </li>
                  <li>
                    Your conversations are transmitted only between your device
                    and the third-party service you configure
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  5.3 External Image Hosts
                </h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                  <li>
                    Image URLs you provide are loaded directly by your browser
                  </li>
                  <li>
                    External servers may receive your IP address and referrer
                    information
                  </li>
                  <li>
                    We do not proxy or cache external images on our servers
                  </li>
                </ul>
              </div>
              We do not control, endorse, or assume responsibility for any
              third-party APIs or services you connect to. Your use of such
              services is at your own risk. Please review their privacy policies
              and terms of service before integrating them with ShitchatAI.
            </section>

            {/* Your Data Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Your Data Rights
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    ✅ Right to Access
                  </h3>
                  <p className="text-green-700 text-sm">
                    View all your data in browser developer tools under
                    Application → Local Storage
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    ✅ Right to Erasure
                  </h3>
                  <p className="text-green-700 text-sm">
                    Clear browser data or use delete buttons in the app
                    interface
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    ✅ Right to Portability
                  </h3>
                  <p className="text-green-700 text-sm">
                    Export localStorage data via browser developer tools
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    ✅ Right to Object
                  </h3>
                  <p className="text-green-700 text-sm">
                    Stop using the service and clear your browser data
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-700">
                  Your data is retained indefinitely in your browser's local
                  storage until you:
                </p>
                <ul className="list-disc list-inside text-purple-700 mt-2 space-y-1">
                  <li>
                    Manually delete chats/characters using the app interface
                  </li>
                  <li>Clear your browser data for this site</li>
                  <li>Use browser privacy modes that don't persist data</li>
                  <li>Withdraw consent using the reset function in settings</li>
                </ul>
              </div>
            </section>

            {/* Security Measures */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Security Measures
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Data is transmitted directly to user-configured endpoints,
                    typically over HTTPS (depending on the provider)
                  </li>
                  <li>
                    Local storage isolation by domain (same-origin policy)
                  </li>
                  <li>No server-side data storage or processing</li>
                  <li>Client-side data processing only</li>
                  <li>Explicit user consent required for data storage</li>
                </ul>
              </div>
            </section>

            {/* Image Processing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Image Processing
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Images are processed entirely in your browser</li>
                  <li>No images are uploaded to our servers</li>
                  <li>Images are converted to Base64 and stored locally</li>
                  <li>
                    We use WebP format when supported for better compression
                  </li>
                </ul>
              </div>
            </section>

            {/* External Image Loading */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. External Image Loading
              </h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-3">
                  Image URL Feature
                </h3>
                <p className="text-orange-700 mb-3">
                  When you provide an image URL, your browser will download the
                  image directly from the external server.
                </p>
                <ul className="list-disc list-inside text-orange-700 space-y-2">
                  <li>
                    The external server may see your IP address and browser
                    information
                  </li>
                  <li>
                    We have no control over how external sites handle your data
                  </li>
                  <li>External images are cached locally in your browser</li>
                  <li>We recommend using trusted image hosting services</li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                  <p className="text-yellow-800 text-sm">
                    <strong>Privacy Tip:</strong> Use direct image links from
                    privacy-respecting services or self-hosted images to
                    minimize data exposure.
                  </p>
                </div>
              </div>
            </section>

            {/* User Presets */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. User Presets
              </h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3">
                  Preset Storage
                </h3>
                <p className="text-purple-700 mb-3">
                  The preset feature allows you to save and reuse your preferred
                  settings:
                </p>
                <ul className="list-disc list-inside text-purple-700 space-y-2">
                  <li>Display name and pronouns</li>
                  <li>User description/bio</li>
                  <li>Profile images or image URLs</li>
                  <li>Custom preset names and configurations</li>
                  <li>Any other settings you choose to save</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Control:</strong> You can manage, edit, or delete
                    your presets at any time through the app interface. All
                    preset data is stored locally in your browser.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Control Over Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Your Control Over Data
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold mb-3">
                  You have complete control over your data:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      In-App Controls:
                    </h4>
                    <ul className="list-disc list-inside text-blue-600 space-y-1 text-sm">
                      <li>Delete chats/characters using interface buttons</li>
                      <li>Remove or replace character/profile images</li>
                      <li>Edit or modify all stored data</li>
                      <li>Withdraw consent in settings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      Browser Controls:
                    </h4>
                    <ul className="list-disc list-inside text-blue-600 space-y-1 text-sm">
                      <li>Clear browser storage for our site</li>
                      <li>Use developer tools to export localStorage data</li>
                      <li>Manage site permissions and data</li>
                      <li>Block site storage entirely</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Children's Privacy
              </h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-700">
                  ShitchatAI is not intended for children under 13. We do not
                  knowingly collect any personal information from children. Our
                  age verification gate prevents under-13 users from accessing
                  the service in compliance with COPPA and GDPR-K.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Data Requests & Contact
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 mb-3">
                  <strong>Important:</strong> Since ShitchatAI stores all data
                  locally in your browser, we do not have access to your chats,
                  characters, or settings.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                  <p className="text-blue-800 text-sm">
                    <strong>For data access/deletion:</strong> Use the in-app
                    controls or clear your browser data. We cannot access or
                    modify your local storage.
                  </p>
                </div>
                <p className="text-green-700">
                  For privacy questions or concerns, contact us via{" "}
                  <a
                    href="https://forms.gle/q7BPmeVXnuoAJvkg7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    our feedback form
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by updating the "Last Updated" date at
                the top of this policy. Continued use of ShitchatAI after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                16. Security
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3">
                  While we implement security measures in our application:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Your data security depends on your device and browser
                    security
                  </li>
                  <li>
                    We recommend using secure devices and keeping your browser
                    updated
                  </li>
                  <li>
                    Your API keys and endpoint configurations are stored in
                    localStorage — protect access to your device
                  </li>
                  <li>
                    Use browser privacy modes if you don't want data persistence
                  </li>
                </ul>
              </div>
            </section>

            {/* Acceptance */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                17. Acceptance
              </h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-700">
                  By using ShitchatAI, you signify your acceptance of this
                  Privacy Policy. If you do not agree to this policy, please do
                  not use our application.
                </p>
              </div>
            </section>

            {/* Important Note */}
            <section className="mt-12 pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Important Note:</strong> This privacy policy reflects
                  the current architecture of ShitchatAI as a client-side
                  application. If we later add server-side components, user
                  accounts, or data storage, this policy will be updated
                  accordingly.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Return to ShitchatAI
          </Link>
        </div>
      </div>
    </div>
  );
}
