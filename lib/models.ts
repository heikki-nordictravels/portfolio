// Define types for all content types in your portfolio

export type SkillCategory = 'professional' | 'languages' | 'technologies';

export type Skill = {
  id?: string;  // Make id optional for new entries
  icon: string;
  label: string;
  category: SkillCategory;
  iconSize?: string;
};

export type ExperienceType = 'education' | 'work';

export type Experience = {
  id?: string;  // Make id optional for new entries
  title: string;
  company: string;
  period: string;
  type: ExperienceType;
  description?: string;
};

export type Project = {
  id?: string;  // Make id optional for new entries
  title: string;
  year: string;
  description: string;
  tools_used: string[];
  image?: string;
  link?: string;
  featured?: boolean;
};

// Responses for API endpoints
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};