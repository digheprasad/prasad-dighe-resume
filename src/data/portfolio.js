const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;

export const portfolio = {
  name: "Prasad Tanaji Dighe",
  firstName: "Prasad",
  title: "Computer Science Student | Aspiring Software Developer",
  location: "Solapur, Maharashtra, India",
  email: "digheprasad33@gmail.com",
  linkedin: "https://www.linkedin.com/in/prasad-dighe-387a52379/",
  profileImage: publicAsset("profile.jpeg"),
  objective:
    "Computer Science student aspiring to begin a career in software development and contribute to building thoughtful, useful software.",
  about:
    "I’m a computer science student based in Solapur, Maharashtra, and an aspiring software developer. I’m interested in software development and the craft of creating useful digital experiences.",
  education: [
    {
      degree: "Bachelor of Science (B.Sc.) in Computer Science",
      institution: "Sangola Mahavidyalaya, Sangola, Maharashtra",
      year: "2026 – 2029",
      status: "Pursuing",
    },
    {
      degree: "Higher Secondary Certificate (HSC) – Science",
      institution: "Maharashtra State Board",
      details: "12th Standard · 62.00%",
    },
    {
      degree: "Secondary School Certificate (SSC)",
      institution: "Maharashtra State Board",
      details: "10th Standard . 79.60%",
    },
  ],
  skillGroups: [
    {
      category: "Programming Languages",
      skills: [
        { name: "Python", level: "Intermediate" },
        { name: "C", level: "Intermediate" },
        { name: "C++", level: "Intermediate" },
      ],
    },
    {
      category: "Web Development",
      skills: [
        { name: "HTML5", level: "Intermediate" },
        { name: "CSS3", level: "Intermediate" },
        { name: "JavaScript", level: "Intermediate" },
        { name: "jQuery", level: "Beginner" },
        { name: "Bootstrap", level: "Beginner" },
      ],
    },
    {
      category: "Database Management",
      skills: [
        { name: "SQL / DBMS", level: "Intermediate" },
        { name: "Oracle Database", level: "Beginner" },
      ],
    },
    {
      category: "Development Tools",
      skills: [
        { name: "Git", level: "Beginner" },
        { name: "GitHub", level: "Beginner" },
      ],
    },
  ],
  softSkills: [
    {
      name: "Self-Learning",
      description: "I enjoy learning new things and prefer trying them independently.",
      example: "I practice new programming concepts on my own.",
    },
    {
      name: "Problem Solving",
      description: "I explore different solutions when facing challenges.",
      example: "I try different approaches to fix coding errors.",
    },
    {
      name: "Planning & Organization",
      description: "I prefer organizing tasks before starting work.",
      example: "I plan tasks before implementing group projects.",
    },
    {
      name: "Growth Mindset",
      description: "I believe in continuous learning and improvement.",
      example: "I explore new programming languages and technologies.",
    },
    {
      name: "Independent Thinking",
      description: "I like finding solutions through my own thinking.",
      example: "I explore possible solutions before asking for help.",
    },
  ],
  projects: [
    {
      name: "Pyai — Python Learning Assistant",
      description:
        "A beginner-friendly Python learning assistant that explains core concepts with code examples and practical tips, and offers basic debugging guidance.",
      technologies: ["Python", "Flask", "HTML", "CSS", "JavaScript"],
      github: "https://github.com/digheprasad/aiapp",
    },
  ],
  certifications: [
    {
      name: "Certificate",
      image: publicAsset("certificates/cer.jpeg"),
    },
    {
      name: "Certificate",
      image: publicAsset("certificates/par.jpeg"),
    },
  ],
  achievements: [],
  socialLinks: [],
};
