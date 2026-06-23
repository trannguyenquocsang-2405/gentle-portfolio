import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronDown, X } from 'lucide-react';
import { profileService, skillService, projectService, blogService, socialLinkService, experienceService, resumeService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const getSmartUrl = (platform: string, input: string) => {
  if (!input) return '#';
  const val = input.trim();
  const lowerPlatform = platform.toLowerCase();

  if (lowerPlatform.includes('gmail') || lowerPlatform.includes('mail')) {
    const email = val.replace(/^mailto:/i, '');
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
  }
  if (lowerPlatform.includes('zalo')) {
    // If it's just a phone number, prefix it with zalo.me
    if (/^[\d\s\.\-\+]+$/.test(val)) return `https://zalo.me/${val.replace(/[^\d\+]/g, '')}`;
    if (!val.startsWith('http')) return `https://zalo.me/${val}`;
  }
  if (lowerPlatform.includes('phone') || lowerPlatform.includes('call')) {
    if (!val.startsWith('tel:')) return `tel:${val.replace(/[^\d\+]/g, '')}`;
  }

  if (!/^(https?|mailto|tel):/i.test(val)) {
    return `https://${val}`;
  }
  return val;
};

const getDisplayText = (platform: string, input: string) => {
  if (!input) return platform;
  const lowerPlatform = platform.toLowerCase();

  // Hiển thị cả tên và giá trị đối với Số điện thoại, Zalo, Email
  if (
    lowerPlatform.includes('gmail') ||
    lowerPlatform.includes('mail') ||
    lowerPlatform.includes('zalo') ||
    lowerPlatform.includes('phone') ||
    lowerPlatform.includes('call')
  ) {
    return `${platform}: ${input}`;
  }

  // Với link web bình thường thì chỉ hiện tên Platform
  return platform;
};

export function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCVDropdown, setShowCVDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const { t, tData } = useLanguage();

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject]);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
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
        setProfile(profileRes[0]);
        setSkills(skillsRes);
        setProjects(projectsRes);
        setBlogs(blogsRes);
        setSocialLinks(socialRes);
        setExperiences(expRes);
        setResumes(resRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#121212] px-6 text-center space-y-4">
        <div className="animate-pulse w-12 h-12 rounded-full bg-[#A3B18A] opacity-50"></div>
        <p className="text-[#6B6B6B] dark:text-[#B0B0B0] text-sm animate-pulse">
          Backend may take 30-60s to wake up on first request...
        </p>
      </div>
    );
  }

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const calculateDuration = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate);
    const end = isCurrent || !endDate ? new Date() : new Date(endDate);

    let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    if (totalMonths < 1) totalMonths = 1;

    if (totalMonths < 12) {
      return `${totalMonths} mo${totalMonths > 1 ? 's' : ''}`;
    }
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (months === 0) return `${years} yr${years > 1 ? 's' : ''}`;
    return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto space-y-32">
      {/* Hero / About Section */}
      <section id="about" className="flex flex-col-reverse md:flex-row items-center gap-12 pt-10 scroll-mt-28">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] dark:text-[#EAEAEA] leading-tight">
            {tData(profile?.greeting) || "Hello, I am a Developer."}
          </h1>
          <p className="text-lg text-[#6B6B6B] dark:text-[#B0B0B0] leading-relaxed">
            {tData(profile?.about) || "I craft digital experiences with a focus on simplicity and elegance."}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <a href="#contact" className="inline-block px-8 py-3 bg-[#A3B18A] text-white font-medium rounded-full hover:bg-[#8B9973] transition-colors shadow-sm">
              {t('hero.getInTouch')}
            </a>

            {/* Download CV */}
            {resumes.length > 0 && (
              <div className="relative" onMouseEnter={() => setShowCVDropdown(true)} onMouseLeave={() => setShowCVDropdown(false)}>
                {resumes.length === 1 ? (
                  <a href={resumes[0].fileUrl.replace('/upload/', '/upload/fl_attachment/')} download target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-3 border-2 border-[#A3B18A] text-[#A3B18A] dark:text-[#EAEAEA] font-medium rounded-full hover:bg-[#A3B18A] hover:text-white dark:hover:text-[#121212] transition-colors shadow-sm">
                    <Download size={20} /> {t('hero.downloadCV')}
                  </a>
                ) : (
                  <>
                    <button className="flex items-center gap-2 px-8 py-3 border-2 border-[#A3B18A] text-[#A3B18A] dark:text-[#EAEAEA] font-medium rounded-full hover:bg-[#A3B18A] hover:text-white dark:hover:text-[#121212] transition-colors shadow-sm">
                      <Download size={20} /> {t('hero.downloadCV')} <ChevronDown size={18} />
                    </button>
                    {showCVDropdown && (
                      <div className="absolute top-full left-0 pt-2 z-50">
                        <div className="w-56 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-[#E5E5E5] dark:border-[#333333] overflow-hidden flex flex-col py-2">
                          {resumes.map(cv => (
                            <a key={cv.id} href={cv.fileUrl.replace('/upload/', '/upload/fl_attachment/')} download target="_blank" rel="noreferrer" className="px-4 py-3 hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] transition-colors text-sm text-[#4A4A4A] dark:text-[#EAEAEA] border-b border-[#E5E5E5] dark:border-[#333333] last:border-b-0 text-left">
                              {tData(cv.title)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
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
      <section id="skills" className="space-y-10 scroll-mt-28">
        <h2 className="text-3xl font-serif text-center">{t('skills.title')}</h2>

        {Array.isArray(skills) && skills.length > 0 ? (
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
            {Object.entries(
              skills.reduce((acc, skill) => {
                const cat = skill.category?.name || 'Other';
                const catKey = typeof cat === 'object' ? JSON.stringify(cat) : cat;
                if (!acc[catKey]) acc[catKey] = [];
                acc[catKey].push(skill);
                return acc;
              }, {} as Record<string, any[]>)
            ).map(([catStr, catSkills]) => {
              const catObj = catStr.startsWith('{') ? JSON.parse(catStr) : catStr;
              return (
              <div key={catStr} className="flex flex-col md:flex-row border-b border-[#E5E5E5] dark:border-[#333333] last:border-b-0">
                <div className="md:w-1/3 bg-gray-50/50 dark:bg-[#2A2A2A]/50 p-6 flex items-center md:border-r border-[#E5E5E5] dark:border-[#333333]">
                  <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#EAEAEA]">{tData(catObj)}</h3>
                </div>
                <div className="md:w-2/3 p-6 flex flex-wrap gap-3">
                  {(catSkills as any[]).map((skill: any) => (
                    <div key={skill.id} className="flex items-center gap-2 px-4 py-2 bg-[#FAF9F6] dark:bg-[#121212] rounded-lg border border-[#E5E5E5] dark:border-[#333333] hover:border-[#A3B18A] dark:hover:border-[#A3B18A] hover:bg-white dark:hover:bg-[#2A2A2A] hover:shadow-md transition-all group cursor-default">
                      {skill.iconUrl && <img src={skill.iconUrl} alt={tData(skill.name)} className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />}
                      <span className="font-medium text-sm">{tData(skill.name)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )})}
          </div>
        ) : (
          <p className="text-[#6B6B6B] dark:text-[#B0B0B0] text-center">{t('skills.empty')}</p>
        )}
      </section>

      {/* Experience Section */}
      <section id="experience" className="space-y-10 scroll-mt-28">
        <h2 className="text-3xl font-serif text-center text-[#4A4A4A] dark:text-[#EAEAEA]">{t('experience.title')}</h2>

        {Array.isArray(experiences) && experiences.length > 0 ? (
          <div className="relative border-l border-[#E5E5E5] dark:border-[#333333] ml-4 md:ml-8 space-y-12">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-8 md:pl-12">
                {/* Timeline dot */}
                <div className="absolute -left-2 top-1.5 w-4 h-4 bg-[#A3B18A] rounded-full ring-4 ring-[#FAF9F6] dark:ring-[#121212]"></div>

                <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-[#E5E5E5] dark:border-[#333333] hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-serif text-[#4A4A4A] dark:text-[#EAEAEA]">{tData(exp.role)}</h3>
                      <p className="text-[#A3B18A] font-medium text-lg">{exp.company}</p>
                    </div>
                    <div className="text-sm text-[#888888] dark:text-[#888888] font-medium bg-[#F5F5F5] dark:bg-[#2A2A2A] px-3 py-1 rounded-full self-start">
                      {formatMonthYear(exp.startDate)} - {exp.isCurrent ? t('experience.present') : (exp.endDate ? formatMonthYear(exp.endDate) : t('experience.present'))}
                      <span className="text-[#6B6B6B] dark:text-[#B0B0B0] ml-2 font-normal">
                        ({calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)})
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-[#6B6B6B] dark:text-[#B0B0B0] whitespace-pre-wrap leading-relaxed">
                      {tData(exp.description)}
                    </p>
                  )}
                  {exp.productUrl && (
                    <a href={exp.productUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#A3B18A] hover:text-[#8A9A73] transition-colors">
                      🌐 {t('experience.demo')} <span className="text-lg leading-none">&rarr;</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#6B6B6B] dark:text-[#B0B0B0] text-center">{t('experience.empty')}</p>
        )}
      </section>

      {/* Projects Section */}
      <section id="projects" className="space-y-8 scroll-mt-28">
        <h2 className="text-3xl font-serif text-center">{t('projects.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.isArray(projects) && projects.length > 0 ? projects.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-[#E5E5E5] dark:border-[#333333] flex flex-col cursor-pointer hover:-translate-y-1"
            >
              {project.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img src={project.imageUrl} alt={tData(project.title)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div>
                  <h3 className="text-xl font-serif text-[#4A4A4A] dark:text-[#EAEAEA]">{tData(project.title)}</h3>
                  <p className="text-[#6B6B6B] dark:text-[#B0B0B0] mt-2">{tData(project.description)}</p>
                </div>
                <div className="mt-auto pt-4 flex gap-4" onClick={(e) => e.stopPropagation()}>
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-medium text-[#A3B18A] hover:text-[#8A9A73] transition-colors">
                      🌐 {t('projects.liveDemo')} <span className="text-lg leading-none">&rarr;</span>
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-medium text-[#A3B18A] hover:text-[#8A9A73] transition-colors">
                      💻 {t('projects.sourceCode')} <span className="text-lg leading-none">&rarr;</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <p className="text-[#6B6B6B] dark:text-[#B0B0B0] text-center w-full">{t('projects.empty')}</p>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="space-y-8 scroll-mt-28">
        <h2 className="text-3xl font-serif text-center">{t('blog.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(blogs) && blogs.length > 0 ? blogs.map(blog => (
            <Link key={blog.id} to={`/blog/${blog.id}`} className="block bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#E5E5E5] dark:border-[#333333] group">
              <h3 className="text-xl font-serif text-[#4A4A4A] dark:text-[#EAEAEA] group-hover:text-[#A3B18A] dark:group-hover:text-[#A3B18A] transition-colors">{tData(blog.title)}</h3>
              <p className="text-sm text-[#888888] dark:text-[#888888] mt-2">{new Date(blog.createdAt).toLocaleDateString()}</p>
            </Link>
          )) : (
            <p className="text-[#6B6B6B] dark:text-[#B0B0B0] text-center w-full">{t('blog.empty')}</p>
          )}
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="text-center pt-10 pb-6 border-t border-[#E5E5E5] dark:border-[#333333] scroll-mt-28">
        <h2 className="text-2xl font-serif mb-6 text-[#4A4A4A] dark:text-[#EAEAEA]">{t('contact.title')}</h2>
        <div className="flex justify-center flex-wrap gap-6">
          {Array.isArray(socialLinks) && socialLinks.length > 0 ? socialLinks.map(link => (
            <a key={link.id} href={getSmartUrl(link.platform, link.url)} target="_blank" rel="noreferrer" className="px-5 py-3 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#E5E5E5] dark:border-[#333333] flex items-center gap-3 text-[#4A4A4A] dark:text-[#EAEAEA] hover:border-[#A3B18A] dark:hover:border-[#A3B18A] hover:shadow-md hover:text-[#A3B18A] dark:hover:text-[#A3B18A] transition-all group">
              {link.iconUrl && <img src={link.iconUrl} alt={link.platform} className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />}
              <span className="font-medium">{getDisplayText(link.platform, link.url)}</span>
            </a>
          )) : (
            <p className="text-[#888888] dark:text-[#888888]">{t('contact.empty')}</p>
          )}
        </div>
        <p className="text-sm text-[#888888] dark:text-[#666666] mt-10">© {new Date().getFullYear()} Sang Tran. Software Developer • Flutter Developer.</p>
      </footer>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedProject(null)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-[#1E1E1E] w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>

              <div className="overflow-y-auto no-scrollbar flex-1">
              {selectedProject.imageUrl && (
                <div className="w-full h-64 sm:h-80 relative shrink-0">
                  <img src={selectedProject.imageUrl} alt={tData(selectedProject.title)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h2 className="absolute bottom-6 left-6 right-6 text-3xl sm:text-4xl font-serif text-white font-bold tracking-wide">
                    {tData(selectedProject.title)}
                  </h2>
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-8">
                {!selectedProject.imageUrl && (
                  <h2 className="text-3xl sm:text-4xl font-serif text-[#4A4A4A] dark:text-[#EAEAEA] font-bold tracking-wide">
                    {tData(selectedProject.title)}
                  </h2>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-[#4A4A4A] dark:text-[#EAEAEA]">{t('modal.overview')}</h3>
                  <p className="text-[#6B6B6B] dark:text-[#B0B0B0] text-lg leading-relaxed">
                    {tData(selectedProject.description)}
                  </p>
                </div>

                {selectedProject.details && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-[#4A4A4A] dark:text-[#EAEAEA]">{t('modal.whatIdid')}</h3>
                    <p className="text-[#6B6B6B] dark:text-[#B0B0B0] whitespace-pre-wrap leading-relaxed">
                      {tData(selectedProject.details)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Footer for Links */}
            {(selectedProject.demoUrl || selectedProject.sourceUrl) && (
              <div className="p-6 bg-[#FAF9F6] dark:bg-[#121212] border-t border-[#E5E5E5] dark:border-[#333333] shrink-0 flex flex-wrap gap-4">
                {selectedProject.demoUrl && (
                  <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className="flex-1 min-w-[140px] text-center px-6 py-3 bg-[#A3B18A] text-white font-medium rounded-xl hover:bg-[#8B9973] transition-colors shadow-sm">
                    🌐 {t('projects.liveDemo')}
                  </a>
                )}
                {selectedProject.sourceUrl && (
                  <a href={selectedProject.sourceUrl} target="_blank" rel="noreferrer" className="flex-1 min-w-[140px] text-center px-6 py-3 border-2 border-[#A3B18A] text-[#A3B18A] dark:text-[#EAEAEA] font-medium rounded-xl hover:bg-[#A3B18A] hover:text-white dark:hover:text-[#121212] transition-colors">
                    💻 {t('projects.sourceCode')}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
