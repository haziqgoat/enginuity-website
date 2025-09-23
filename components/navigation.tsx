"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/hnz-main-logo.png"
                alt="HNZ Consult Sdn Bhd"
                width={180}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-accent transition-colors">
              About Us
            </Link>
            <Link href="/projects" className="hover:text-accent transition-colors">
              Projects
            </Link>
            <Link href="/careers" className="hover:text-accent transition-colors">
              Careers
            </Link>
            <Link href="/contact" className="hover:text-accent transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user?.user_metadata?.name || user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-foreground hover:bg-primary/80"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-primary-foreground/20">
              <Link href="/" className="block px-3 py-2 hover:bg-primary/80 rounded-md">
                Home
              </Link>
              <Link href="/about" className="block px-3 py-2 hover:bg-primary/80 rounded-md">
                About Us
              </Link>
              <Link href="/projects" className="block px-3 py-2 hover:bg-primary/80 rounded-md">
                Projects
              </Link>
              <Link href="/careers" className="block px-3 py-2 hover:bg-primary/80 rounded-md">
                Careers
              </Link>
              <Link href="/contact" className="block px-3 py-2 hover:bg-primary/80 rounded-md">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 px-3 py-2">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="text-sm text-primary-foreground/80">
                      Welcome, {user?.user_metadata?.name || user?.email}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="secondary" size="sm" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
