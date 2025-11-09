/**
 * PageLayout Component
 * 
 * 페이지 전체 레이아웃 래퍼 컴포넌트
 * - 일관된 페이지 구조 제공
 * - Header/Footer 포함 여부 선택 가능
 */

import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PageLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const PageLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  className = "",
}: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

