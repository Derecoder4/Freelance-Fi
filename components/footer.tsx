import Image from "next/image"
import { ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/creat-a-professional-logo-for-a-feelance-csr5jyl-q0gmk8l4x-ai0a-yaeaxig5rpytcsdtj8ioda.jpeg"
              alt="Freelance-Fi"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="text-sm text-muted-foreground">Built by Josh for ARC</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://docs.arc.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              Arc Docs
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <span>Powered by Arc Network</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
