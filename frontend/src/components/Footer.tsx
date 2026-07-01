import { Book } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Book className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-lg font-bold">Noor-ul-Quran</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your digital companion for reading, studying, and connecting with the Holy Quran.
            </p>
          </div>

          <div>
            <h3 id="footer-quick-links" className="font-semibold mb-3">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground" aria-labelledby="footer-quick-links">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 id="footer-contact" className="font-semibold mb-3">Contact</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground" aria-labelledby="footer-contact">
              <li>support@noorulquran.com</li>
              <li>Made with love for the global Muslim community</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Noor-ul-Quran. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
