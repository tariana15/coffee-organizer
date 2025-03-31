declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export const Search: FC<SVGProps<SVGSVGElement>>;
  export const Coffee: FC<SVGProps<SVGSVGElement>>;
  export const CupSoda: FC<SVGProps<SVGSVGElement>>;
  export const Cherry: FC<SVGProps<SVGSVGElement>>;
  export const Croissant: FC<SVGProps<SVGSVGElement>>;
}

declare module '@/components/AppLayout' {
  import { FC, ReactNode } from 'react';
  
  interface AppLayoutProps {
    children: ReactNode;
    title: string;
    showBackButton?: boolean;
  }
  
  const AppLayout: FC<AppLayoutProps>;
  export default AppLayout;
} 