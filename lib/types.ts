// Core EngiHub Types

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  college: string;
  branch: 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'IT' | 'AIML' | 'OTHER';
  year: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  is_pro: boolean;
  ai_uses_today: number;
  language_pref: 'en' | 'ta' | 'both';
  created_at: string;
}

export interface Doubt {
  id: string;
  user_id: string;
  image_url?: string;
  question_text: string;
  response: string;
  response_tamil?: string;
  created_at: string;
}

export interface PYQ {
  id: number;
  subject: string;
  branch: string;
  year: number;
  semester: number;
  question: string;
  marks: 2 | 5 | 10 | 15;
  importance: 'high' | 'medium' | 'low';
  year_asked: string;
}

export interface ProjectIdea {
  id: number;
  title: string;
  description: string;
  branch: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tech_stack: string[];
  estimated_cost_inr: string;
  madurai_price_range: string;
  components: string[];
  code_snippet?: string;
  report_template_url?: string;
}

export interface Challenge {
  id: number;
  type: 'aptitude' | 'coding' | 'reasoning';
  company?: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
}

export interface AttendanceRecord {
  subject: string;
  present: number;
  total: number;
  percentage: number;
}
