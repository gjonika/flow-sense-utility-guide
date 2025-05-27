
import { useEffect } from 'react';
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

interface UsePageTitleProps {
  survey?: Survey | StoredSurvey;
  pageType?: 'dashboard' | 'survey-details' | 'survey-form' | 'projects' | 'analytics';
  customTitle?: string;
}

export const usePageTitle = ({ survey, pageType, customTitle }: UsePageTitleProps) => {
  useEffect(() => {
    let title = 'HullCheck - Marine Survey Platform';

    if (customTitle) {
      title = `${customTitle} | HullCheck`;
    } else if (survey) {
      const shipName = survey.ship_name || 'Unnamed Ship';
      const status = survey.status || 'draft';
      const statusLabel = status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      title = `${shipName} Survey - ${statusLabel} | HullCheck`;
    } else if (pageType) {
      switch (pageType) {
        case 'dashboard':
          title = 'Survey Dashboard | HullCheck';
          break;
        case 'projects':
          title = 'Survey Projects | HullCheck';
          break;
        case 'analytics':
          title = 'Survey Analytics | HullCheck';
          break;
        case 'survey-form':
          title = 'New Survey Project | HullCheck';
          break;
        default:
          title = 'HullCheck - Marine Survey Platform';
      }
    }

    document.title = title;
  }, [survey, pageType, customTitle]);
};
