const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  user_id: string;
  name: string;
  role: 'mentor' | 'mentee';
  industries: string[];
  about?: string;
  created_at: string;
  updated_at: string;
}

interface MentorshipRequest {
  id: string;
  mentee_id: string | Profile;
  mentor_id: string | Profile;
  proposal: string;
  preferred_time: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

interface Session {
  id: string;
  request_id: string | MentorshipRequest;
  meeting_link: string;
  scheduled_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  todos: Todo[];
  status: 'active' | 'completed' | 'archived';
  progress: number;
  created_at: string;
  updated_at: string;
}

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTodos: number;
  completedTodos: number;
  averageProgress: number;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Authentication methods
  async register(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.data.token;
    localStorage.setItem('authToken', this.token);
    
    return response.data;
  }

  async login(email: string, password: string): Promise<{ user: User; profile?: Profile; token: string }> {
    const response = await this.request<{ user: User; profile?: Profile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.data.token;
    localStorage.setItem('authToken', this.token);
    
    return response.data;
  }

  async getCurrentUser(): Promise<{ user: User; profile?: Profile }> {
    const response = await this.request<{ user: User; profile?: Profile }>('/auth/me');
    return response.data;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Profile methods
  async createProfile(name: string, role: 'mentor' | 'mentee', industries?: string[], about?: string): Promise<Profile> {
    const response = await this.request<Profile>('/profiles', {
      method: 'POST',
      body: JSON.stringify({ name, role, industries, about }),
    });
    return response.data;
  }

  async getProfile(): Promise<Profile> {
    const response = await this.request<Profile>('/profiles/me');
    return response.data;
  }

  async updateProfile(name: string, role: 'mentor' | 'mentee', industries?: string[], about?: string): Promise<Profile> {
    const response = await this.request<Profile>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify({ name, role, industries, about }),
    });
    return response.data;
  }

  async getMentors(): Promise<Profile[]> {
    const response = await this.request<Profile[]>('/profiles/mentors');
    return response.data;
  }

  async getMentor(id: string): Promise<Profile> {
    const response = await this.request<Profile>(`/profiles/mentors/${id}`);
    return response.data;
  }

  async getMentees(): Promise<Profile[]> {
    const response = await this.request<Profile[]>('/profiles/mentees');
    return response.data;
  }

  async getProfileById(id: string): Promise<Profile> {
    const response = await this.request<Profile>(`/profiles/${id}`);
    return response.data;
  }

  // Mentorship request methods
  async createMentorshipRequest(
    mentorId: string,
    proposal: string,
    preferredTime: string
  ): Promise<MentorshipRequest> {
    const response = await this.request<MentorshipRequest>('/mentorship/requests', {
      method: 'POST',
      body: JSON.stringify({
        mentor_id: mentorId,
        proposal,
        preferred_time: preferredTime,
      }),
    });
    return response.data;
  }

  async getMentorshipRequests(): Promise<MentorshipRequest[]> {
    const response = await this.request<MentorshipRequest[]>('/mentorship/requests/me');
    return response.data;
  }

  async getMentorshipRequest(id: string): Promise<MentorshipRequest> {
    const response = await this.request<MentorshipRequest>(`/mentorship/requests/${id}`);
    return response.data;
  }

  async acceptMentorshipRequest(id: string): Promise<MentorshipRequest> {
    const response = await this.request<MentorshipRequest>(`/mentorship/requests/${id}/accept`, {
      method: 'PUT',
    });
    return response.data;
  }

  async declineMentorshipRequest(id: string): Promise<MentorshipRequest> {
    const response = await this.request<MentorshipRequest>(`/mentorship/requests/${id}/decline`, {
      method: 'PUT',
    });
    return response.data;
  }

  async cancelMentorshipRequest(id: string): Promise<void> {
    await this.request(`/mentorship/requests/${id}`, {
      method: 'DELETE',
    });
  }

  // Session methods
  async createSession(
    requestId: string,
    meetingLink: string,
    scheduledTime: string
  ): Promise<Session> {
    const response = await this.request<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify({
        request_id: requestId,
        meeting_link: meetingLink,
        scheduled_time: scheduledTime,
      }),
    });
    return response.data;
  }

  async getSessions(): Promise<Session[]> {
    const response = await this.request<Session[]>('/sessions/me');
    return response.data;
  }

  async getSession(id: string): Promise<Session> {
    const response = await this.request<Session>(`/sessions/${id}`);
    return response.data;
  }

  async updateSession(
    id: string,
    meetingLink: string,
    scheduledTime: string
  ): Promise<Session> {
    const response = await this.request<Session>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        meeting_link: meetingLink,
        scheduled_time: scheduledTime,
      }),
    });
    return response.data;
  }

  async updateSessionStatus(id: string, status: 'scheduled' | 'completed' | 'cancelled'): Promise<Session> {
    const response = await this.request<Session>(`/sessions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  }

  async deleteSession(id: string): Promise<void> {
    await this.request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    const response = await this.request<Project[]>('/projects');
    return response.data;
  }

  async createProject(name: string, description: string): Promise<Project> {
    const response = await this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    return response.data;
  }

  async updateProject(id: string, updates: Partial<{ name: string; description: string; status: string }>): Promise<Project> {
    const response = await this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async addTodo(projectId: string, text: string): Promise<Project> {
    const response = await this.request<Project>(`/projects/${projectId}/todos`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data;
  }

  async updateTodo(projectId: string, todoId: string, updates: Partial<{ text: string; completed: boolean }>): Promise<Project> {
    const response = await this.request<Project>(`/projects/${projectId}/todos/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteTodo(projectId: string, todoId: string): Promise<Project> {
    const response = await this.request<Project>(`/projects/${projectId}/todos/${todoId}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  async getProjectStats(): Promise<ProjectStats> {
    const response = await this.request<ProjectStats>('/projects/stats');
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export a singleton instance
export const api = new ApiClient();

// Export types for use in components
export type { User, Profile, MentorshipRequest, Session, Project, Todo, ProjectStats, ApiResponse };
