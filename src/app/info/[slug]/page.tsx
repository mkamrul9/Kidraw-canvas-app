/* eslint-disable react/no-unescaped-entities */
import { ArrowLeft, FileText, Lock, Cookie, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import GlobalNavbar from "@/shared/components/GlobalNavbar";

function getPolicyContent(slug: string) {
    switch (slug) {
        case 'privacy-policy':
            return {
                title: "Privacy Policy",
                icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
                content: (
                    <>
                        <p><strong>Effective Date:</strong> January 1, 2024</p>
                        
                        <p>Kidraw ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application and use our real-time collaborative canvas services. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the application.</p>
                        
                        <h3>1. Information We Collect</h3>
                        <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
                        <ul>
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application. We rely on OAuth providers (such as GitHub and Google) to provide secure authentication.</li>
                            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your native actions that are integral to the Application, including drawing strokes, shapes created, and documents uploaded to the canvas.</li>
                            <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Application. We store only very limited, if any, financial information that we collect.</li>
                        </ul>

                        <h3>2. Use of Your Information</h3>
                        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
                        <ul>
                            <li>Create and manage your account.</li>
                            <li>Enable real-time synchronization of your collaborative canvas data across multiple devices and users.</li>
                            <li>Process transactions and send related information, including confirmations and invoices.</li>
                            <li>Resolve disputes and troubleshoot problems.</li>
                            <li>Respond to customer service requests.</li>
                            <li>Send you a newsletter or other administrative information.</li>
                        </ul>

                        <h3>3. Disclosure of Your Information</h3>
                        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                        <ul>
                            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services (e.g., Vercel), customer service, and database management (e.g., NeonDB).</li>
                        </ul>

                        <h3>4. Data Security and Retention</h3>
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

                        <h3>5. Your Privacy Rights</h3>
                        <p>Depending on your location, you may have the right to request access to the personal data we collect from you, change that information, or delete it in some circumstances (e.g., GDPR, CCPA). To request to review, update, or delete your personal information, please submit a request to our Data Protection Officer.</p>

                        <h3>6. Contact Us</h3>
                        <p>If you have questions or comments about this Privacy Policy, please contact us at: <strong>legal@kidraw.com</strong></p>
                    </>
                )
            };
        case 'terms-of-service':
            return {
                title: "Terms of Service",
                icon: <FileText className="w-5 h-5 text-blue-400" />,
                content: (
                    <>
                        <p><strong>Last Updated:</strong> January 1, 2024</p>

                        <p>Welcome to Kidraw. These Terms of Service ("Terms") govern your access to and use of the Kidraw website, application, and real-time collaboration services (collectively, the "Service"). Please read these Terms carefully before using the Service.</p>

                        <h3>1. Acceptance of Terms</h3>
                        <p>By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you disagree with any part of the terms, you may not access the Service.</p>

                        <h3>2. Description of Service</h3>
                        <p>Kidraw provides a web-based, infinite canvas designed for real-time visual collaboration, mind mapping, diagramming, and wireframing. The Service includes software, data, text, images, and other content made available through the application.</p>

                        <h3>3. User Accounts and Security</h3>
                        <p>To use certain features of the Service, you must register for an account using supported OAuth providers (Google, GitHub). You are responsible for safeguarding the password and credentials that you use to access the Service and for any activities or actions under your password. You agree to notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

                        <h3>4. Acceptable Use Policy</h3>
                        <p>You agree not to use the Service to:</p>
                        <ul>
                            <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, or obscene.</li>
                            <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                            <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
                            <li>Attempt to gain unauthorized access to any portion of the Service or any other accounts, computer systems, or networks connected to the Service.</li>
                        </ul>

                        <h3>5. Intellectual Property Rights</h3>
                        <p><strong>Your Content:</strong> You retain all right, title, and interest in and to the content you create, upload, or display on your canvases ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute such content strictly for the purpose of providing the Service.</p>
                        <p><strong>Kidraw's Property:</strong> The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Kidraw and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

                        <h3>6. Limitation of Liability</h3>
                        <p>In no event shall Kidraw, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.</p>

                        <h3>7. Governing Law</h3>
                        <p>These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
                    </>
                )
            };
        case 'cookie-policy':
            return {
                title: "Cookie Policy",
                icon: <Cookie className="w-5 h-5 text-amber-400" />,
                content: (
                    <>
                        <p><strong>Effective Date:</strong> January 1, 2024</p>
                        
                        <p>This Cookie Policy explains how Kidraw ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our application. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>

                        <h3>1. What are cookies?</h3>
                        <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by online service providers in order to (for example) make their websites or services work, or to work more efficiently, as well as to provide reporting information.</p>

                        <h3>2. Why do we use cookies?</h3>
                        <p>We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Application to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Application.</p>

                        <h3>3. Types of Cookies We Use</h3>
                        <ul>
                            <li><strong>Strictly Necessary Cookies:</strong> These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site via NextAuth.js. Without these cookies, services like secure login and real-time socket connections cannot be provided.</li>
                            <li><strong>Performance and Analytics Cookies:</strong> These cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized.</li>
                            <li><strong>Functionality Cookies:</strong> These cookies allow a website to remember choices you have made in the past, like what language you prefer, what region you log in from, or what your preferred application theme is (e.g., dark mode).</li>
                        </ul>

                        <h3>4. How can I control cookies?</h3>
                        <p>You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted (for example, you may not be able to log in).</p>

                        <h3>5. Updates to this Cookie Policy</h3>
                        <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
                    </>
                )
            };
        case 'security-policy':
            return {
                title: "Security Policy",
                icon: <Lock className="w-5 h-5 text-red-400" />,
                content: (
                    <>
                        <p>At Kidraw, the security of your data and collaborative workspaces is our highest priority. This document outlines the security measures, practices, and protocols we employ to protect our infrastructure and your information.</p>

                        <h3>1. Data Center and Infrastructure Security</h3>
                        <p>Kidraw is hosted on world-class, secure cloud infrastructure. Our primary application servers are hosted by Vercel, and our databases are managed by NeonDB (built on AWS infrastructure). These providers maintain strict physical security measures, including 24/7 surveillance, biometric access controls, and redundant power systems. They are compliant with industry standards including ISO 27001, SOC 2, and PCI-DSS.</p>

                        <h3>2. Data Encryption</h3>
                        <ul>
                            <li><strong>Encryption in Transit:</strong> All communications between your client application and our servers, including real-time WebSocket traffic, are encrypted using TLS 1.2 or higher. We employ strong cipher suites and HTTP Strict Transport Security (HSTS) to ensure data cannot be intercepted.</li>
                            <li><strong>Encryption at Rest:</strong> All data stored in our primary databases, including user account information, canvas metadata, and drawing vectors, are encrypted at rest using AES-256 block-level encryption.</li>
                        </ul>

                        <h3>3. Application Security</h3>
                        <p>We employ a defense-in-depth strategy to secure the application layer:</p>
                        <ul>
                            <li><strong>Authentication:</strong> We do not store user passwords. Authentication is handled securely via OAuth 2.0 and OpenID Connect protocols using providers like Google and GitHub, implemented through NextAuth.js.</li>
                            <li><strong>Authorization:</strong> Strict Role-Based Access Control (RBAC) ensures that only authorized users can view or modify specific workspaces. WebSocket connections are authenticated and bound to specific session tokens.</li>
                            <li><strong>Protection against common vulnerabilities:</strong> Our application architecture strictly adheres to OWASP guidelines, protecting against Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and SQL Injection.</li>
                        </ul>

                        <h3>4. Incident Response and Monitoring</h3>
                        <p>We maintain continuous, 24/7 monitoring of our application performance and security logs. In the event of a security anomaly or breach, our Incident Response Team is immediately alerted. We have established protocols for identifying, containing, eradicating, and recovering from security incidents, as well as notifying affected users in accordance with applicable laws.</p>

                        <h3>5. Vulnerability Disclosure Program</h3>
                        <p>We welcome reports from security researchers and experts about potential vulnerabilities. If you believe you have discovered a security issue in Kidraw, please responsibly disclose it to us at <strong>security@kidraw.com</strong>. We ask that you do not publicly disclose the vulnerability until we have had a reasonable timeframe to address it.</p>
                    </>
                )
            };

        default:
            return null;
    }
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const policy = getPolicyContent(resolvedParams.slug);

    if (!policy) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-violet-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="flex-1 max-w-4xl w-full mx-auto p-8 py-20 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs font-bold text-foreground mb-6 shadow-sm">
                    {policy.icon} Kidraw Information
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-8 tracking-tight">{policy.title}</h1>

                <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-violet-400 hover:prose-a:text-violet-300 prose-li:text-muted-foreground">
                    {policy.content}
                    
                    <div className="h-[1px] bg-secondary/50 my-12 w-full"></div>
                    <p className="text-muted-foreground font-medium text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </main>
        </div>
    );
}