"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings, ChevronDown, Shield, Users, FileText, Mail } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useContactMessagesCount } from "@/hooks/use-contact-messages-count"
import { usePendingApplicationsCount } from "@/hooks/use-pending-applications-count"
import { useCombinedNotificationCount } from "@/hooks/use-combined-notification-count"
import { UserRole, getRoleDisplayName, getRoleBadgeColor } from "@/lib/roles"
import { isMobile } from "@/lib/responsive"

const NAVIGATION_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Projects" },
  { href: "/certifications", label: "Certifications" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout, getUserRole, isAdmin, isStaff } = useAuth()
  const { unreadCount } = useContactMessagesCount()
  const { pendingCount } = usePendingApplicationsCount()
  const { totalCount: combinedNotificationCount } = useCombinedNotificationCount()
  const pathname = usePathname()
  const profileRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the dropdown trigger and the dropdown itself
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const getNavLinkClass = (href: string) => 
    `relative px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-300 ease-out hover:bg-white/10 hover:backdrop-blur-sm ${
      pathname === href 
        ? "text-orange-400 bg-white/10 backdrop-blur-sm" 
        : "text-white/90 hover:text-white"
    }`

  const renderNavigationLinks = (isMobileView = false) => 
    NAVIGATION_ITEMS.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={
          isMobileView 
            ? `block px-3 py-2.5 md:px-4 md:py-3 rounded-xl font-medium transition-all duration-300 ease-out hover:bg-white/10 hover:translate-x-1 ${
                pathname === item.href 
                  ? "bg-orange-500/20 text-orange-400 translate-x-1" 
                  : "text-white/90 hover:text-white"
              }`
            : getNavLinkClass(item.href)
        }
        onClick={isMobileView ? closeMobileMenu : undefined}
      >
        {item.label}
        {pathname === item.href && !isMobileView && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
        )}
      </Link>
    ))

  // Profile Dropdown Component
  const ProfileDropdown = () => (
    <div 
      ref={dropdownRef}
      className={`absolute top-full right-2 mt-2 w-56 md:w-64 bg-blue-950/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ease-out transform ${
        isProfileOpen 
          ? 'opacity-100 scale-100 translate-y-0 max-h-[70vh]' 
          : 'opacity-0 scale-95 -translate-y-4 max-h-0 pointer-events-none'
      } overflow-y-auto custom-scrollbar`}
      onClick={(e) => e.stopPropagation()} // Prevent click from closing dropdown
    >
      {/* Profile Header */}
      <div className="p-3 md:p-4 border-b border-white/20 bg-blue-900/50">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="relative">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-orange-500/20 flex items-center justify-center ring-2 ring-orange-500/30 transition-all duration-300 hover:ring-orange-500/50">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <User className="h-4 w-4 md:h-6 md:w-6 text-orange-400" />
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-2.5 h-2.5 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-semibold text-white truncate">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="text-[0.65rem] md:text-xs text-blue-200/70 truncate">
              {user?.email}
            </p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full text-[0.65rem] md:text-xs font-medium transition-all duration-300 hover:scale-105 ${
                getRoleBadgeColor(getUserRole())
              }`}>
                {getRoleDisplayName(getUserRole())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="p-1.5 md:p-2 bg-blue-900/30 max-h-[50vh] overflow-y-auto custom-scrollbar">
        <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
          <div className="w-full flex items-center px-2.5 py-2 md:px-3 md:py-2.5 text-xs md:text-sm text-blue-100 hover:bg-white/10 rounded-lg transition-all duration-300 ease-out cursor-pointer group hover:translate-x-1">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-900/50 flex items-center justify-center mr-2 md:mr-3 group-hover:bg-blue-800/70 transition-colors duration-300">
              <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
            </div>
            <span className="font-medium">Profile Settings</span>
          </div>
        </Link>
        
        {/* Admin Dashboard Link */}
        {isAdmin() && (
          <Link href="/admin" onClick={() => setIsProfileOpen(false)}>
            <div className="w-full flex items-center px-2.5 py-2 md:px-3 md:py-2.5 text-xs md:text-sm text-blue-100 hover:bg-white/10 rounded-lg transition-all duration-300 ease-out cursor-pointer group hover:translate-x-1">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-orange-900/50 flex items-center justify-center mr-2 md:mr-3 group-hover:bg-orange-800/70 transition-colors duration-300">
                <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-300 group-hover:text-orange-200 transition-colors duration-300" />
              </div>
              <span className="font-medium">Admin Dashboard</span>
            </div>
          </Link>
        )}
        
        {/* Staff Panel Link */}
        {(isStaff() || isAdmin()) && (
          <Link href="/staff" onClick={() => setIsProfileOpen(false)}>
            <div className="w-full flex items-center px-2.5 py-2 md:px-3 md:py-2.5 text-xs md:text-sm text-blue-100 hover:bg-white/10 rounded-lg transition-all duration-300 ease-out cursor-pointer group hover:translate-x-1">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-700/50 flex items-center justify-center mr-2 md:mr-3 group-hover:bg-slate-600/70 transition-colors duration-300">
                <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-300 group-hover:text-slate-200 transition-colors duration-300" />
              </div>
              <span className="font-medium">Staff Panel</span>
            </div>
          </Link>
        )}
        
        {/* Job Applications Link */}
        {(isStaff() || isAdmin()) && (
          <Link href="/applications" onClick={() => setIsProfileOpen(false)}>
            <div className="w-full flex items-center px-2.5 py-2 md:px-3 md:py-2.5 text-xs md:text-sm text-blue-100 hover:bg-white/10 rounded-lg transition-all duration-300 ease-out cursor-pointer group hover:translate-x-1 relative">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-900/50 flex items-center justify-center mr-2 md:mr-3 group-hover:bg-indigo-800/70 transition-colors duration-300">
                <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-indigo-300 group-hover:text-indigo-200 transition-colors duration-300" />
              </div>
              <span className="font-medium">Job Applications</span>
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 md:top-2 md:right-2 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex items-center justify-center rounded-full bg-red-500 text-[0.6rem] md:text-xs text-white font-bold h-4 w-4 md:h-5 md:w-5">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                </span>
              )}
            </div>
          </Link>
        )}
        
        {/* Contact Messages Link */}
        {(isStaff() || isAdmin()) && (
          <Link href="/contact-messages" onClick={() => setIsProfileOpen(false)}>
            <div className="w-full flex items-center px-2.5 py-2 md:px-3 md:py-2.5 text-xs md:text-sm text-blue-100 hover:bg-white/10 rounded-lg transition-all duration-300 ease-out cursor-pointer group hover:translate-x-1 relative">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-900/50 flex items-center justify-center mr-2 md:mr-3 group-hover:bg-purple-800/70 transition-colors duration-300">
                <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </div>
              <span className="font-medium">Contact Management</span>
              {combinedNotificationCount > 0 && (
                <span className="absolute top-1 right-1 md:top-2 md:right-2 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex items-center justify-center rounded-full bg-red-500 text-[0.6rem] md:text-xs text-white font-bold h-4 w-4 md:h-5 md:w-5">
                    {combinedNotificationCount > 99 ? '99+' : combinedNotificationCount}
                  </span>
                </span>
              )}
            </div>
          </Link>
        )}
        
        {/* Divider */}
        <div className="my-1.5 md:my-2 border-t border-white/20"></div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-2.5 py-2 md:px-3 md:py-2.5 text-xs md:text-sm text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-300 ease-out group hover:translate-x-1"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-900/50 flex items-center justify-center mr-2 md:mr-3 group-hover:bg-red-800/70 transition-colors duration-300">
            <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )

  const renderAuthSection = (isMobileView = false) => {
    if (isAuthenticated) {
      if (isMobileView) {
        return (
          <div className="space-y-2">
            <div className="text-xs md:text-sm text-primary-foreground/80 px-2 py-1.5 md:px-3 md:py-2">
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </div>
            <div className="px-2 py-1 md:px-3 md:py-1">
              <span className={`inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[0.65rem] md:text-xs font-medium ${
                getRoleBadgeColor(getUserRole())
              }`}>
                {getRoleDisplayName(getUserRole())}
              </span>
            </div>
            <Link href="/profile" onClick={closeMobileMenu}>
              <div className="w-full flex items-center px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-primary-foreground hover:bg-primary/80 rounded-md cursor-pointer">
                <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Profile Settings
              </div>
            </Link>
            {isAdmin() && (
              <Link href="/admin" onClick={closeMobileMenu}>
                <div className="w-full flex items-center px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-primary-foreground hover:bg-primary/80 rounded-md cursor-pointer">
                  <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                  Admin Dashboard
                </div>
              </Link>
            )}
            {(isStaff() || isAdmin()) && (
              <Link href="/staff" onClick={closeMobileMenu}>
                <div className="w-full flex items-center px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-primary-foreground hover:bg-primary/80 rounded-md cursor-pointer">
                  <Users className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                  Staff Panel
                </div>
              </Link>
            )}
            {(isStaff() || isAdmin()) && (
              <Link href="/applications" onClick={closeMobileMenu}>
                <div className="w-full flex items-center px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-primary-foreground hover:bg-primary/80 rounded-md cursor-pointer relative">
                  <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                  <span>Job Applications</span>
                  {pendingCount > 0 && (
                    <span className="absolute top-1 right-1 md:top-2 md:right-2 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex items-center justify-center rounded-full bg-red-500 text-[0.6rem] md:text-xs text-white font-bold h-4 w-4 md:h-5 md:w-5">
                        {pendingCount > 99 ? '99+' : pendingCount}
                      </span>
                    </span>
                  )}
                </div>
              </Link>
            )}
            {(isStaff() || isAdmin()) && (
              <Link href="/contact-messages" onClick={closeMobileMenu}>
                <div className="w-full flex items-center px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-primary-foreground hover:bg-primary/80 rounded-md cursor-pointer relative">
                  <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                  <span>Contact Management</span>
                  {combinedNotificationCount > 0 && (
                    <span className="absolute top-1 right-1 md:top-2 md:right-2 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex items-center justify-center rounded-full bg-red-500 text-[0.6rem] md:text-xs text-white font-bold h-4 w-4 md:h-5 md:w-5">
                        {combinedNotificationCount > 99 ? '99+' : combinedNotificationCount}
                      </span>
                    </span>
                  )}
                </div>
              </Link>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="w-full flex items-center text-xs md:text-sm py-1.5 md:py-2"
            >
              <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              Logout
            </Button>
          </div>
        )
      }

      return (
        <div className="flex items-center space-x-3 md:space-x-4" ref={profileRef}>
          {/* Profile Dropdown Trigger */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 md:space-x-3 px-3 py-1.5 md:px-4 md:py-2 hover:bg-white/10 rounded-xl transition-all duration-300 ease-out group relative"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden bg-orange-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-orange-500/30 ring-2 ring-transparent group-hover:ring-orange-500/30">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <User className="h-4 w-4 md:h-5 md:w-5 text-orange-400 transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>
            <span className="max-w-[100px] md:max-w-[120px] truncate text-white font-medium transition-all duration-300 group-hover:text-orange-200 text-sm md:text-base">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-all duration-300 ease-out ${
              isProfileOpen 
                ? 'rotate-180 text-orange-400 scale-110' 
                : 'rotate-0 text-white/70 group-hover:text-white group-hover:scale-105'
            }`} />
            
            {/* Active indicator */}
            {isProfileOpen && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Desktop Profile Dropdown - Always render but conditionally visible */}
          <ProfileDropdown />
        </div>
      )
    }

    return (
      <div className={isMobileView ? "flex flex-col space-y-2" : "flex items-center space-x-3 md:space-x-4"}>
        <Link href="/login" onClick={isMobileView ? closeMobileMenu : undefined}>
          <Button
            variant="outline"
            size={isMobileView ? "sm" : "default"}
            className="border-white/30 text-white hover:bg-white hover:text-slate-900 bg-transparent transition-all duration-300 hover:scale-105 w-full backdrop-blur-sm text-xs md:text-sm py-1.5 md:py-2"
          >
            Login
          </Button>
        </Link>
        <Link href="/signup" onClick={isMobileView ? closeMobileMenu : undefined}>
          <Button 
            size={isMobileView ? "sm" : "default"} 
            className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0 transition-all duration-300 hover:scale-105 shadow-lg text-xs md:text-sm py-1.5 md:py-2 ${isMobileView ? "w-full" : ""}`}
          >
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group" onClick={closeMobileMenu}>
              <div className="transition-transform duration-300 ease-out group-hover:scale-105">
                <Image
                  src="/hnz-main-logo.png"
                  alt="HNZ Consult Sdn Bhd"
                  width={140}
                  height={32}
                  className="h-7 w-auto md:h-10"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 md:space-x-2">
            {renderNavigationLinks()}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center">
            {renderAuthSection()}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-1.5 md:p-2 rounded-xl transition-all duration-300 hover:scale-110"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-5 h-5 md:w-6 md:h-6">
                <span className={`absolute inset-0 transition-all duration-300 ease-out ${
                  isMenuOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'
                }`}>
                  <Menu className="h-5 w-5 md:h-6 md:w-6" />
                </span>
                <span className={`absolute inset-0 transition-all duration-300 ease-out ${
                  isMenuOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                }`}>
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen ? 'max-h-[85vh] opacity-100 pb-3' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 py-2 space-y-1 border-t border-white/10 bg-white/5 backdrop-blur-md overflow-y-auto max-h-[calc(100vh-8rem)]">
            {renderNavigationLinks(true)}
            <div className="pt-3 border-t border-white/10 mt-2">
              {renderAuthSection(true)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}