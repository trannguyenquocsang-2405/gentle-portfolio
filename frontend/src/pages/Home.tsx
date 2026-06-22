import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, projectsRes, blogsRes, socialRes] = await Promise.all([
          axios.get(`${API_URL}/profile`),
          axios.get(`${API_URL}/skill`),
          axios.get(`${API_URL}/project`),
          axios.get(`${API_URL}/blog`),
          axios.get(`${API_URL}/social-link`),
        ]);
        setProfile(profileRes.data[0]);
        setSkills(skillsRes.data);
        setProjects(projectsRes.data);
        setBlogs(blogsRes.data);
        setSocialLinks(socialRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto space-y-32">
      {/* Hero / About Section */}
      <section id="about" className="flex flex-col-reverse md:flex-row items-center gap-12 pt-10">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] leading-tight">
            {profile?.greeting || "Hello, I am a Developer."}
          </h1>
          <p className="text-lg text-[#6B6B6B] leading-relaxed">
            {profile?.about || "I craft digital experiences with a focus on simplicity and elegance."}
          </p>
          <a href="#contact" className="inline-block mt-4 px-8 py-3 bg-[#A3B18A] text-white rounded-full hover:bg-[#8A9A73] transition-colors shadow-sm">
            Get in touch
          </a>
        </div>
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-sm border-4 border-white">
          <img 
            src={profile?.avatar || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="space-y-8">
        <h2 className="text-3xl font-serif text-center">My Skills</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {Array.isArray(skills) && skills.length > 0 ? skills.map(skill => (
            <div key={skill.id} className="px-6 py-3 bg-white rounded-full shadow-sm text-[#4A4A4A] border border-[#E5E5E5] hover:border-[#A3B18A] transition-colors">
              {skill.name}
            </div>
          )) : (
            <p className="text-[#6B6B6B]">Loading skills...</p>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="space-y-8">
        <h2 className="text-3xl font-serif text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.isArray(projects) && projects.length > 0 ? projects.map(project => (
            <a key={project.id} href={project.link} target="_blank" rel="noreferrer" className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#E5E5E5]">
              {project.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-serif">{project.title}</h3>
                <p className="text-[#6B6B6B]">{project.description}</p>
              </div>
            </a>
          )) : (
            <p className="text-[#6B6B6B] text-center w-full">Loading projects...</p>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="space-y-8">
        <h2 className="text-3xl font-serif text-center">Latest Notes</h2>
        <div className="space-y-6">
          {Array.isArray(blogs) && blogs.length > 0 ? blogs.map(blog => (
            <Link key={blog.id} to={`/blog/${blog.id}`} className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#E5E5E5] group">
              <h3 className="text-xl font-serif group-hover:text-[#A3B18A] transition-colors">{blog.title}</h3>
              <p className="text-sm text-[#888888] mt-2">{new Date(blog.createdAt).toLocaleDateString()}</p>
            </Link>
          )) : (
            <p className="text-[#6B6B6B] text-center w-full">Loading blogs...</p>
          )}
        </div>
      </section>
      
      {/* Footer / Contact */}
      <footer id="contact" className="text-center pt-10 pb-6 border-t border-[#E5E5E5]">
        <h2 className="text-2xl font-serif mb-6">Let's Connect</h2>
        <div className="flex justify-center flex-wrap gap-6">
          {Array.isArray(socialLinks) && socialLinks.length > 0 ? socialLinks.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#A3B18A] transition-colors group">
              {link.iconUrl && <img src={link.iconUrl} alt={link.platform} className="w-6 h-6 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />}
              <span>{link.platform}</span>
            </a>
          )) : (
            <p className="text-[#888888]">No contact info available.</p>
          )}
        </div>
        <p className="text-sm text-[#888888] mt-10">© {new Date().getFullYear()} MyPortfolio. Designed with simplicity.</p>
      </footer>
    </div>
  );
}
