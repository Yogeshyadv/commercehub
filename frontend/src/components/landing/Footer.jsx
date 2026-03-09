import React from 'react';
import { Link } from 'react-router-dom';
import { TwitterIcon, LinkedinIcon, InstagramIcon, YoutubeIcon } from 'lucide-react';

const columns = [
  {
    heading: 'Start',
    links: [
      { name: 'Start free trial',   path: '/register'  },
      { name: 'Pricing',            path: '/pricing'   },
      { name: 'CommerceHub vs. others', path: '/compare' },
      { name: 'Free tools',         path: '/tools'     },
    ],
  },
  {
    heading: 'Sell',
    links: [
      { name: 'Online store',       path: '/product/catalogue'  },
      { name: 'Point of sale',      path: '/product/native-app' },
      { name: 'Cataloguing',        path: '/product/cataloguing' },
      { name: 'Live Analytics',     path: '/product/analytics'  },
      { name: 'Enterprise',         path: '/enterprise'         },
    ],
  },
  {
    heading: 'Market',
    links: [
      { name: 'Email marketing',    path: '/marketing/email'    },
      { name: 'Social media',       path: '/marketing/social'   },
      { name: 'SEO tools',          path: '/marketing/seo'      },
      { name: 'Analytics',          path: '/analytics'          },
    ],
  },
  {
    heading: 'Support',
    links: [
      { name: 'Merchant support',   path: '/support'            },
      { name: 'Community forums',   path: '/community'          },
      { name: 'Hire a partner',     path: '/partners'           },
      { name: 'Blog',               path: '/blog'               },
    ],
  },
  {
    heading: 'CommerceHub',
    links: [
      { name: 'About us',           path: '/about'              },
      { name: 'Careers',            path: '/careers'            },
      { name: 'Customers',          path: '/customers'          },
      { name: 'Press & media',      path: '/press'              },
      { name: 'Investors',          path: '/investors'          },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { name: 'Privacy policy',     path: '/privacy'    },
      { name: 'Terms of service',   path: '/terms'      },
      { name: 'Cookie policy',      path: '/cookies'    },
      { name: 'Accessibility',      path: '/accessibility' },
    ],
  },
];

const socials = [
  { icon: TwitterIcon,   label: 'Twitter',   href: '#' },
  { icon: LinkedinIcon,  label: 'LinkedIn',  href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: YoutubeIcon,   label: 'YouTube',   href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] text-white border-t border-white/[0.06]">

      {/* ── Top strip: wordmark + tagline ── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-white/[0.06]">
        <div>
          <Link to="/" className="inline-flex items-center gap-0.5 font-black text-3xl tracking-tight text-white">
            Commerce<span className="text-[#DC2626]">Hub</span>
            <span className="w-2 h-2 rounded-full bg-[#DC2626] ml-1 mb-1 inline-block" />
          </Link>
          <p className="mt-3 text-gray-500 text-sm font-medium max-w-xs leading-relaxed">
            The commerce platform behind millions of businesses worldwide.
          </p>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/25 transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      {/* ── Link columns ── */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
        {columns.map(col => (
          <div key={col.heading}>
            <p className="text-white font-black text-xs uppercase tracking-[0.18em] mb-5">
              {col.heading}
            </p>
            <ul className="space-y-3">
              {col.links.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-white text-sm font-medium transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 py-7 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-700 text-xs font-medium">
          &copy; {year} CommerceHub Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Sitemap'].map(label => (
            <Link
              key={label}
              to={`/${label.toLowerCase()}`}
              className="text-gray-700 hover:text-gray-400 text-xs font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
