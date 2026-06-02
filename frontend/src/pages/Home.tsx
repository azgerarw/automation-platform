import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import CookieBanner from '../components/CookieBanner';
import { useAuth } from '../context/authContext';

const extractRegionFromLocale = (locale: string) => {
  const match = locale.match(/[-_](\w{2})$/);
  return match?.[1]?.toUpperCase() ?? null;
};

const inferCurrencyFromLocale = (locale: string) => {
  const region = extractRegionFromLocale(locale);
  const currencyMap: Record<string, string> = {
    US: 'USD',
    GB: 'GBP',
    DE: 'EUR',
    FR: 'EUR',
    ES: 'EUR',
    MX: 'MXN',
    CA: 'CAD',
    AU: 'AUD',
    JP: 'JPY',
    IN: 'INR',
  };

  return region ? currencyMap[region] ?? null : null;
};

const getBrowserName = (userAgent: string) => {
  if (/Edg\//.test(userAgent)) return 'Edge';
  if (/OPR\//.test(userAgent)) return 'Opera';
  if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) return 'Chrome';
  if (/Firefox\//.test(userAgent)) return 'Firefox';
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return 'Safari';
  return 'Unknown';
};

const getDeviceType = (userAgent: string) => {
  if (/Mobi|Android/i.test(userAgent)) return 'Mobile';
  if (/Tablet|iPad/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
};

const collectConsentData = async () => {
  const userAgent = navigator.userAgent;
  const language = navigator.language || 'unknown';
  const languages = navigator.languages || [language];
  const region = extractRegionFromLocale(language);
  const currency = inferCurrencyFromLocale(language);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;

  let ip: string | null = null;
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ip = data?.ip ?? null;
  } catch {
    ip = null;
  }

  return {
    language,
    languages,
    currency,
    region,
    ip,
    browser: getBrowserName(userAgent),
    device: getDeviceType(userAgent),
    platform: navigator.platform,
    userAgent,
    timeZone,
    screen: `${window.screen.width}x${window.screen.height}`,
    vendor: navigator.vendor,
    deviceMemory: (navigator as any).deviceMemory ?? null,
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    connectionType: (navigator as any).connection?.effectiveType ?? null,
    visitedWebsites: null,
    browserHistory: null,
    notes:
      'Visited websites and browser history are not accessible from browser JavaScript for privacy/security reasons.',
  };
};

const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string) => {
  const cookieMatch = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`));
  return cookieMatch ? decodeURIComponent(cookieMatch.split('=')[1]) : null;
};

export default function Home() {
  const howItWorksRef = useRef<HTMLHeadingElement>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const { userID, userSession } = useAuth();
  useEffect(() => {

    console.log('userID:', userID, 'userSession:', userSession);
    const cookieAccepted = getCookie('cookiesAccepted');
    if (cookieAccepted !== 'true') {
      setShowCookieBanner(true);
    }
    else {
      const consentData = getCookie('cookieConsentData');
      console.log('Existing cookie consent data:', consentData ? JSON.parse(consentData) : null);
    }
  }, []);

  const acceptCookies = async () => {
    const consentData = await collectConsentData();
    setCookie('cookiesAccepted', 'true');
    setCookie('cookieConsentData', JSON.stringify(consentData));
    setShowCookieBanner(false);
    console.log('Cookie consent collected:', consentData);
  };

  const declineCookies = () => {
    setCookie('cookiesAccepted', 'false');
    setShowCookieBanner(false);
    console.log('User declined cookies. No data collected.');
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const data = {
    features: {
        "Secure Authentication": {
        icon: "🔐",
        description: "JWT-based authentication with role-based access control and token refresh mechanisms."
        },
        "Real-Time Execution": {
        icon: "⚡",
        description: "Event-driven architecture that processes and executes rules instantly with automatic retries."
        },
        "Rule Management": {
        icon: "📋",
        description: "Create, manage, and evaluate complex business rules with an intuitive interface."
        },
        "Webhook Integration": {
        icon: "🔗",
        description: "Public endpoints to receive events from external systems and trigger automations."
        },
        "API Gateway": {
        icon: "📊",
        description: "Centralized routing with rate limiting and request validation for all services."
        },
        "Scalable Architecture": {
        icon: "🚀",
        description: "Microservices-based design that grows with your needs and handles complex workflows."
        }
    },
    stepsToUse: { 
        "1": { 
        title: "Define Your Rules", 
        description: "Create business rules that define when and how actions should be executed based on incoming events." 
        }, 
        "2": { 
        title: "Receive Events", 
        description: "Events are sent to your webhook endpoints or triggered through the API, setting the automation in motion." 
        },
        "3": {
        title: "Evaluate & Execute",
        description: "The execution engine evaluates your rules in real-time and executes the corresponding actions instantly."
        },
        "4": {
        title: "Monitor & Optimize",
        description: "Track execution history, monitor performance, and optimize your rules based on real-world results."
        }
    }
  }
  
  return (
    <div className="bg-white text-black w-full">
      {showCookieBanner && <CookieBanner onAccept={acceptCookies} onDecline={declineCookies} />}

      {/* Hero Section */}
      <section className="py-20 px-4 text-center flex flex-col items-center">
        <h2 className="text-5xl font-bold mb-6">Automate Your Workflows</h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          A powerful task automation platform that evaluates rules in real-time and executes actions seamlessly across your infrastructure.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/login" 
            className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            Get Started
          </Link>
          <button 
            onClick={scrollToHowItWorks}
            className="border-2 border-black text-black px-8 py-3 rounded font-semibold hover:bg-gray-100 transition cursor-pointer"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16">Powerful Features</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(data.features).map(([feature, { icon, description }]) => (
              <div key={feature} className="bg-white p-8 border-2 border-black rounded">
                <div className="text-4xl font-bold mb-4">
                  {icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{feature}</h4>
                <p className="text-gray-700">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 ref={howItWorksRef} className="text-4xl font-bold text-center mb-16">How It Works</h3>
          
          <div className="space-y-8">
            
            {Object.entries(data.stepsToUse).map(([step, { title, description }]) => (
                <div key={step}>
                  <div>
                      <h4 className="text-xl font-bold">{title}</h4>
                  </div>
                  <div className="flex gap-6 items-center">
                      <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {step}
                      </div>
                      <p className="text-gray-700">
                        {description}
                      </p>
                  </div>
                </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white text-center">
        <h3 className="text-4xl font-bold mb-6">Ready to Automate?</h3>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Start building your first automation workflow today. No credit card required.
        </p>
        <Link 
          to="/register" 
          className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition inline-block"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}