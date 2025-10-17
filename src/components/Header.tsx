import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import logoSymbol from "@/assets/logo-symbol.png";

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoSymbol} alt="IDEA on Action Logo" className="h-10 w-10" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">IDEA on Action</span>
            <span className="text-xs text-muted-foreground">생각과행동</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/services" className="text-foreground/80 hover:text-foreground transition-colors">
            서비스
          </Link>
          {isHomePage ? (
            <>
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
                기술
              </a>
              <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
                회사소개
              </a>
              <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">
                문의
              </a>
            </>
          ) : (
            <>
              <Link to="/#features" className="text-foreground/80 hover:text-foreground transition-colors">
                기술
              </Link>
              <Link to="/#about" className="text-foreground/80 hover:text-foreground transition-colors">
                회사소개
              </Link>
              <Link to="/#contact" className="text-foreground/80 hover:text-foreground transition-colors">
                문의
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/services">
            <Button variant="default" className="hidden md:inline-flex bg-gradient-primary hover:opacity-90">
              시작하기
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
