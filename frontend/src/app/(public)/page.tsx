import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { profileService, skillService, projectService, blogService, socialLinkService, experienceService, resumeService } from '@/services/api';

export const revalidate = 60; // ISR: Tự động cập nhật cache mỗi 60 giây

export const metadata: Metadata = {
  title: 'Tran Nguyen Quoc Sang',
  description: 'Software Developer • Flutter Developer',
  openGraph: {
    title: 'Tran Nguyen Quoc Sang',
    description: 'Software Developer • Flutter Developer',
    type: 'website',
  }
};

export default async function Page() {
  let initialData: any = {
    profile: null,
    skills: [],
    projects: [],
    blogs: [],
    socialLinks: [],
    experiences: [],
    resumes: []
  };

  try {
    const [profileRes, skillsRes, projectsRes, blogsRes, socialRes, expRes, resRes] = await Promise.all([
      profileService.get(),
      skillService.getAll(),
      projectService.getAll(),
      blogService.getAll(),
      socialLinkService.getAll(),
      experienceService.getAll(),
      resumeService.getAll(),
    ]);

    initialData = {
      profile: profileRes[0],
      skills: skillsRes,
      projects: projectsRes,
      blogs: blogsRes,
      socialLinks: socialRes,
      experiences: expRes,
      resumes: resRes
    };
  } catch (error: any) {
    console.log(error.response?.config?.url);
    console.log(error.response?.status);
  }

  return <HomeClient initialData={initialData} />;
}
