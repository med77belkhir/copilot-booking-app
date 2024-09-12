// components/Layout.tsx
'use client';

import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="py-10">
      {children}
    </div>
  );
};

export default Layout;