import Link from "next/link"

const footerLinks = {
  Quran: [
    { href: "/surahs", label: "All Surahs" },
    { href: "/juz", label: "Juz" },
    { href: "/reciters", label: "Reciters" },
    { href: "/favorites", label: "Favorites" },
  ],
  Resources: [
    { href: "/bookmarks", label: "Bookmarks" },
    { href: "/history", label: "History" },
    { href: "/downloads", label: "Downloads" },
    { href: "/settings", label: "Settings" },
  ],
  Legal: [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Contact" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80">
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-islamic-green to-islamic-green-dark shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6V6z"/>
                  </svg>
                </div>
                <span className="font-bold text-sm">Quran Audio</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                A beautiful digital platform for reading, listening, and connecting with the Holy Quran.
              </p>
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Quran Audio. All rights reserved.
              </p>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-3">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs text-muted-foreground hover:text-islamic-green transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-muted-foreground/60">
              Made with devotion to the Holy Quran. Quran Audio is not affiliated with any specific religious organization.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground/40">Powered by Al Quran Cloud API</span>
              <Link href="https://github.com" className="text-muted-foreground/40 hover:text-islamic-green transition-colors">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
