
import { useEffect } from 'react';

export interface UsePageTitleProps {
  title: string;
  suffix?: string;
}

export const usePageTitle = (titleOrProps: string | UsePageTitleProps) => {
  useEffect(() => {
    const originalTitle = document.title;
    
    let newTitle: string;
    if (typeof titleOrProps === 'string') {
      newTitle = `${titleOrProps} | Survey Assistant`;
    } else {
      const { title, suffix = 'Survey Assistant' } = titleOrProps;
      newTitle = `${title} | ${suffix}`;
    }
    
    document.title = newTitle;
    
    return () => {
      document.title = originalTitle;
    };
  }, [titleOrProps]);
};
