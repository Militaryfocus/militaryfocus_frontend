// Основные типы для Mobile Legends Community Platform

export interface Hero {
  id: number;
  name: string;
  role: string;
  specialty: string;
  lane: string[];
  durability?: number;
  offense?: number;
  control?: number;
  difficulty?: number;
  passive_skill?: Skill;
  first_skill?: Skill;
  second_skill?: Skill;
  ultimate_skill?: Skill;
  release_date?: string;
  price?: {
    bp: number;
    diamond: number;
  };
  image_url?: string;
  avatar_url?: string;
  win_rate?: number;
  pick_rate?: number;
  ban_rate?: number;
  created_at: string;
  updated_at?: string;
}

export interface Skill {
  name: string;
  description: string;
  cooldown?: number;
  mana_cost?: number;
  damage?: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  ign?: string;
  current_rank?: string;
  main_heroes?: number[];
  role: 'User' | 'Content Creator' | 'Moderator' | 'Admin';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BuildGuide {
  id: number;
  hero_id: number;
  author_id: number;
  title: string;
  description?: string;
  emblems?: EmblemSetup;
  battle_spell?: string;
  item_build?: ItemBuild;
  skill_priority?: number[];
  play_style?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  views: number;
  likes: number;
  rating: number;
  rating_count: number;
  is_published: boolean;
  version: string;
  created_at: string;
  updated_at?: string;
}

export interface EmblemSetup {
  type: string;
  level: number;
  talents: {
    talent1: string;
    talent2: string;
    talent3: string;
  };
}

export interface ItemBuild {
  early_game: number[];
  mid_game: number[];
  late_game: number[];
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stats: Record<string, number>;
  passive_effect?: string;
  active_effect?: string;
  image_url?: string;
}

export interface Emblem {
  id: number;
  name: string;
  type: string;
  level: number;
  stats: Record<string, number>;
  talents: Record<string, any>;
  image_url?: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  summary?: string;
  author_id: number;
  category?: string;
  tags?: string[];
  image_url?: string;
  views: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Comment {
  id: number;
  guide_id: number;
  author_id: number;
  content: string;
  parent_id?: number;
  likes: number;
  is_approved: boolean;
  created_at: string;
  updated_at?: string;
}

export interface GuideRating {
  id: number;
  guide_id: number;
  user_id: number;
  rating: number;
  review?: string;
  created_at: string;
}

export interface HeroCounter {
  id: number;
  hero_id: number;
  counter_hero_id: number;
  counter_type: 'strong_against' | 'weak_against';
  win_rate?: number;
}

export interface HeroSynergy {
  id: number;
  hero_id: number;
  synergy_hero_id: number;
  synergy_type: 'good_with' | 'combo';
  win_rate?: number;
}

// API Response типы
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SearchResponse {
  query: string;
  total_results: number;
  heroes: Hero[];
  guides: BuildGuide[];
  users: User[];
}

// Auth типы
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  ign?: string;
  current_rank?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile extends User {
  guides_count?: number;
  total_views?: number;
  total_likes?: number;
  average_rating?: number;
}

// Filter типы
export interface HeroFilters {
  role?: string;
  difficulty?: string;
  search?: string;
}

export interface GuideFilters {
  hero_id?: number;
  author_id?: number;
  difficulty?: string;
  play_style?: string;
  tags?: string;
}

export interface NewsFilters {
  category?: string;
  featured?: boolean;
  search?: string;
}

// UI типы
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Error типы
export interface ApiError {
  detail: string;
  status_code: number;
}

export interface ValidationError {
  field: string;
  message: string;
}