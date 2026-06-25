import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

export const authService = {
  login: (data: any) => api.post('/auth/login', data).then(res => res.data),
};

export const uploadService = {
  uploadImage: (file: File) => {
    const data = new FormData();
    data.append('file', file);
    return api.post('/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },
};

export const profileService = {
  get: () => api.get('/profile').then(res => res.data),
  update: (id: number, data: any) => api.patch(`/profile/${id}`, data).then(res => res.data),
};

export const skillCategoryService = {
  getAll: () => api.get('/skill-category').then(res => res.data),
  create: (data: any) => api.post('/skill-category', data).then(res => res.data),
  delete: (id: number) => api.delete(`/skill-category/${id}`).then(res => res.data),
};

export const skillService = {
  getAll: () => api.get('/skill').then(res => res.data),
  create: (data: any) => api.post('/skill', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/skill/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/skill/${id}`).then(res => res.data),
};

export const projectService = {
  getAll: () => api.get('/project').then(res => res.data),
  create: (data: any) => api.post('/project', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/project/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/project/${id}`).then(res => res.data),
};

export const blogService = {
  getAll: () => api.get('/blog').then(res => res.data),
  getById: (id: string | number) => api.get(`/blog/${id}`).then(res => res.data),
  create: (data: any) => api.post('/blog', data).then(res => res.data),
  update: (id: string | number, data: any) => api.patch(`/blog/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/blog/${id}`).then(res => res.data),
};

export const socialLinkService = {
  getAll: () => api.get('/social-link').then(res => res.data),
  create: (data: any) => api.post('/social-link', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/social-link/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/social-link/${id}`).then(res => res.data),
};

export const experienceService = {
  getAll: () => api.get('/experience').then(res => res.data),
  create: (data: any) => api.post('/experience', data).then(res => res.data),
  update: (id: number, data: any) => api.patch(`/experience/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/experience/${id}`).then(res => res.data),
};

export const resumeService = {
  getAll: () => api.get('/resume').then(res => res.data),
  create: (data: any) => api.post('/resume', data).then(res => res.data),
  delete: (id: number) => api.delete(`/resume/${id}`).then(res => res.data),
};
