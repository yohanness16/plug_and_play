const resolveBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.BACKEND_URL || 'http://localhost:3000';
  }
  return process.env.NEXT_PUBLIC_API_URL || '/api';
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'writer' | 'user';
  profilePhoto?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  authorName?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  authorName?: string;
  authorAvatar?: string;
  replies?: Comment[];
}

export interface Reaction {
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike';
}

export interface Share {
  total: number;
  perPlatform: Record<string, number>;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const base = resolveBaseUrl();
    const url = `${base}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // Auth endpoints
  async signup(data: { email: string; password: string; name: string; role?: string }) {
    return this.request<{ message: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{
      message: string;
      access_token: string;
      refresh_token: string;
      user: User;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(data: { email: string }) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Posts endpoints
  async getPosts(params?: {
    page?: number;
    limit?: number;
    q?: string;
    status?: string;
    authorId?: string;
    categoryId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }

    return this.request<{ data: Post[]; page: number; limit: number }>(
      `/posts?${searchParams.toString()}`
    );
  }

  async getPost(slug: string) {
    return this.request<Post>(`/posts/${slug}`);
  }

  async createPost(data: {
    title: string;
    content: string;
    slug?: string;
    coverImage?: string;
    categories?: string[];
    status?: 'draft' | 'published' | 'archived';
  }) {
    return this.request<{ message: string; id: string; slug: string }>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: string, data: {
    title?: string;
    content?: string;
    slug?: string;
    coverImage?: string;
    categories?: string[];
    status?: 'draft' | 'published' | 'archived';
  }) {
    return this.request<{ message: string; id: string }>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: string, hard?: boolean) {
    return this.request<{ message: string }>(`/posts/${id}?hard=${hard}`, {
      method: 'DELETE',
    });
  }

  // Categories endpoints (backend path is '/catagories')
  async getCategories() {
    return this.request<{ data: Category[] }>('/catagories');
  }

  async getCategory(slug: string) {
    return this.request<{ category: Category; posts: Post[] }>(`/catagories/${slug}`);
  }

  async createCategory(data: { name: string; slug?: string }) {
    return this.request<{ message: string; id: string; slug: string }>('/catagories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: { name?: string; slug?: string }) {
    return this.request<{ message: string; id: string }>(`/catagories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request<{ message: string }>(`/catagories/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments endpoints
  async getComments(postId: string) {
    return this.request<{ count: number; comments: Comment[] }>(`/comments/post/${postId}`);
  }

  async createComment(data: { postId: string; content: string; parentId?: string }) {
    return this.request<{ message: string; id: string; parentId: string | null }>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateComment(id: string, data: { content: string }) {
    return this.request<{ message: string }>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteComment(id: string) {
    return this.request<void>(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  // Reactions endpoints
  async getPostReactions(postId: string) {
    return this.request<Reaction>(`/posts/${postId}/reactions`);
  }

  async reactToPost(postId: string, type: 'like' | 'dislike') {
    return this.request<{ ok: boolean } & Reaction>(`/posts/${postId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async getCommentReactions(commentId: string) {
    return this.request<Reaction>(`/comments/${commentId}/reactions`);
  }

  async reactToComment(commentId: string, type: 'like' | 'dislike') {
    return this.request<{ ok: boolean } & Reaction>(`/comments/${commentId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // Shares endpoints (backend base route is '/share')
  async getPostShares(postIdOrSlug: string) {
    return this.request<{ totals: Share }>(`/share/${postIdOrSlug}/shares`);
  }

  async sharePost(postIdOrSlug: string, platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'copy_link') {
    return this.request<{ message: string; url: string; totals: Share }>(`/share/${postIdOrSlug}/share`, {
      method: 'POST',
      body: JSON.stringify({ platform }),
    });
  }
}

export const api = new ApiClient();
