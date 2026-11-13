const skillGroups = Object.freeze([
  {
    name: 'Frontend',
    level: 'Experienced',
    skills: Object.freeze([
      'Angular',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Angular Material',
      'AG-Grid',
      'RxJS',
      'ng-bootstrap',
      'ngx-datatable',
    ]),
  },
  {
    name: 'Backend & Serverless',
    level: 'Capable',
    skills: Object.freeze([
      'Node.js',
      'Express',
      'AWS Lambda',
      'PHP',
      'Slim Framework',
      'CodeIgniter',
      'REST APIs',
    ]),
  },
  {
    name: 'Databases & DevOps',
    level: 'Capable',
    skills: Object.freeze([
      'PostgreSQL',
      'MySQL',
      'Git',
      'Ubuntu',
      'Linux server administration',
      'Schema evolution (DDL/DML)',
    ]),
  },
  {
    name: 'AI-Assisted Development',
    level: 'Practical',
    skills: Object.freeze([
      'GitHub Copilot',
      'Gemini',
      'AI-assisted code generation',
      'AI-assisted debugging',
      'AI-assisted documentation',
    ]),
  },
  {
    name: 'Testing & CI/CD',
    level: 'Familiar',
    skills: Object.freeze([
      'Jasmine',
      'Karma',
      'Jenkins',
      'SonarQube',
      'Production incident remediation',
    ]),
  },
  {
    name: 'Legacy Java',
    level: 'Historical',
    skills: Object.freeze([
      'Java EE 6',
      'Struts',
      'GWT',
      'JSP',
      'MVC',
    ]),
  },
]);

const roles = Object.freeze([
  Object.freeze({
    title: 'Developer',
    company: 'TCS',
    period: 'Sept 2022 - Present',
    outcome:
      'Full-stack Angular and Node.js development for a major insurance company, including AWS Lambda serverless endpoints, Angular Material and AG-Grid interfaces, and PostgreSQL schema and production data work.',
  }),
  Object.freeze({
    title: 'Centers Sr Developer',
    company: 'NTT Data',
    period: 'Sept 2021 - Sept 2022',
    outcome:
      'Angular payment gateway wizard with RxJS and microservices, plus fraud detection dashboard modules and automated testing with Karma, Jasmine, Jenkins, and SonarQube.',
  }),
  Object.freeze({
    title: 'Programmer A',
    company: 'Poder Judicial del Estado de Colima',
    period: 'Jun 2014 - Sept 2021',
    outcome:
      'Directed the Desarrollo Tecnologico department, building REST APIs with Slim Framework and Angular clients, an electronic notifications platform with digital signatures, and MySQL and Ubuntu server operations.',
  }),
]);

const certifications = Object.freeze([
  'Microsoft Certified: Azure Fundamentals',
  'Web Application Developer (APTECH)',
]);

const languages = Object.freeze([
  Object.freeze({ name: 'Spanish', level: 'Native' }),
  Object.freeze({ name: 'English', level: 'Professional' }),
]);

const cvProfile = Object.freeze({
  name: 'JuanPablo Dev',
  headline:
    'Systems Engineer with 12+ years of experience delivering enterprise web development solutions',
  yearsOfExperience: 12,
  availability: 'Open to frontend and full-stack engineering roles',
  skillGroups,
  roles,
  certifications,
  languages,
});

export function serializeProfile() {
  const lines = [
    `Candidate: ${cvProfile.name}`,
    `Headline: ${cvProfile.headline}`,
    `Years of experience: ${cvProfile.yearsOfExperience}+`,
    `Availability: ${cvProfile.availability}`,
    '',
    'Skill groups:',
  ];

  for (const group of cvProfile.skillGroups) {
    lines.push(`- ${group.name} (${group.level}): ${group.skills.join(', ')}`);
  }

  lines.push('', 'Recent roles:');

  for (const role of cvProfile.roles) {
    lines.push(`- ${role.title} at ${role.company} (${role.period}): ${role.outcome}`);
  }

  lines.push(
    '',
    `Certifications: ${cvProfile.certifications.join('; ')}`,
    `Languages: ${cvProfile.languages
      .map((language) => `${language.name} (${language.level})`)
      .join(', ')}`,
  );

  return lines.join('\n');
}

export { cvProfile };
export default cvProfile;
