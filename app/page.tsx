"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export default function Home() {
  const [activeSection, setActiveSection] = useState("section1")
  const [portfolioProgress, setPortfolioProgress] = useState(0)
  const portalRef = useRef<HTMLDivElement>(null)
  const portfolioTrackRef = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)

  // Scroll handling for nav + portfolio
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section")
      const windowHeight = window.innerHeight
      const scrollPosition = window.scrollY

      let currentSection = "section1"
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        if (scrollPosition >= sectionTop - windowHeight / 3) {
          currentSection = section.id
        }
      })
      setActiveSection(currentSection)

      // Portfolio horizontal scroll
      if (section3Ref.current && portfolioTrackRef.current) {
        const section = section3Ref.current
        const track = portfolioTrackRef.current
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight - windowHeight
        
        if (sectionHeight > 0) {
          const progress = Math.min(Math.max((scrollPosition - sectionTop) / sectionHeight, 0), 1)
          setPortfolioProgress(progress)
          
          const viewportWidth = section.clientWidth
          const trackWidth = track.scrollWidth
          const maxTranslate = Math.max(trackWidth - viewportWidth, 0)
          const translateX = maxTranslate > 0 ? Math.min(progress * maxTranslate, maxTranslate) : 0
          
          track.style.transform = `translate3d(${-translateX}px, 0, 0)`
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mouse parallax effect
  useEffect(() => {
    const moveForce = 10
    const rotateForce = 7

    const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t

    let currentX = 0, currentY = 0
    let currentRotateX = 0, currentRotateY = 0
    let targetX = 0, targetY = 0
    let targetRotateX = 0, targetRotateY = 0

    const mousawares = document.querySelectorAll(".mousetransform")

    const handleMouseMove = (e: MouseEvent) => {
      const docX = document.documentElement.clientWidth
      const docY = document.documentElement.clientHeight

      targetX = ((e.pageX - docX / 2) / (docX / 2)) * -moveForce
      targetY = ((e.pageY - docY / 2) / (docY / 2)) * -moveForce

      targetRotateY = (e.pageX / docX) * rotateForce * 2 - rotateForce
      targetRotateX = -((e.pageY / docY) * rotateForce * 2 - rotateForce)
    }

    document.addEventListener("mousemove", handleMouseMove)

    function isInViewport(element: Element) {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= -200 &&
        rect.left >= -200 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 200 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 200
      )
    }

    let animationId: number

    function updateTransforms() {
      currentX = lerp(currentX, targetX, 0.08)
      currentY = lerp(currentY, targetY, 0.08)
      currentRotateX = lerp(currentRotateX, targetRotateX, 0.06)
      currentRotateY = lerp(currentRotateY, targetRotateY, 0.06)

      mousawares.forEach((popup) => {
        if (isInViewport(popup)) {
          (popup as HTMLElement).style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`
        }
      })

      animationId = requestAnimationFrame(updateTransforms)
    }
    updateTransforms()

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const navItems = [
    { id: "section1", label: "/ Intro" },
    { id: "section2", label: "/ Skills" },
    { id: "section3", label: "/ Portfolio" },
    { id: "section4", label: "/ Contact" },
  ]

  const skills = {
    languages: [
      { name: "Java", icon: "fa-brands fa-java" },
      { name: "Python", icon: "fa-brands fa-python" },
      { name: "Rust", icon: "fa-brands fa-rust" },
      { name: "Go", icon: "fa-brands fa-golang" },
      { name: "SQL", icon: "fa-solid fa-database" },
      { name: "Junit", icon: "fa-solid fa-vial" },
    ],
    methods: [
      { name: "Agile", icon: "fa-solid fa-arrows-spin" },
      { name: "CI/CD", icon: "fa-solid fa-infinity" },
      { name: "DevOps", icon: "fa-solid fa-gears" },
      { name: "Scrum", icon: "fa-solid fa-users" },
      { name: "Microservices", icon: "fa-solid fa-cubes" },
      { name: "Design Patterns", icon: "fa-solid fa-diagram-project" },
    ],
    frontend: [
      { name: "React", icon: "fa-brands fa-react" },
      { name: "Redux", icon: "fa-solid fa-layer-group" },
      { name: "Next.JS", icon: "fa-brands fa-node-js" },
      { name: "Svelte", icon: "fa-solid fa-bolt" },
      { name: "Plain", icon: "fa-brands fa-html5" },
    ],
    backend: [
      { name: "Spring", icon: "fa-solid fa-leaf" },
      { name: "Express", icon: "fa-brands fa-node" },
      { name: "AWS", icon: "fa-brands fa-aws" },
      { name: "REST", icon: "fa-solid fa-plug" },
    ],
  }

  const projects = [
    {
      title: "Project Alpha",
      description: "A distributed microservices architecture for real-time data processing",
      tech: ["Java", "Spring", "Kafka", "Redis"],
      status: "Production"
    },
    {
      title: "Project Beta",
      description: "Full-stack web application with reactive frontend and serverless backend",
      tech: ["React", "TypeScript", "AWS Lambda", "DynamoDB"],
      status: "Active Development"
    },
    {
      title: "Project Gamma",
      description: "High-performance CLI tool built for system automation and monitoring",
      tech: ["Rust", "tokio", "serde"],
      status: "Open Source"
    },
    {
      title: "Project Delta",
      description: "Machine learning pipeline for predictive analytics in e-commerce",
      tech: ["Python", "TensorFlow", "FastAPI", "PostgreSQL"],
      status: "Research"
    },
  ]

  const handleSkipClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.querySelector("#section3")
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const target = document.querySelector(`#${sectionId}`)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  return (
    <>
      {/* Scanline overlay for CRT effect */}
      <div className="scanlines" aria-hidden="true" />
      
      <nav className="nav-wrap" id="navscroller">
        <ul className="nav">
          {navItems.map((item) => (
            <li key={item.id} className={activeSection === item.id ? "active" : ""}>
              <a href={`#${item.id}`} onClick={(e) => handleNavClick(e, item.id)}>
                <span className="nav-counter">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="portal-container" ref={portalRef}>
        {/* SECTION 1 - INTRO */}
        <section className="section section1" id="section1">
          <div className="overflow-hidden-wrapper">
            <div className="section1-content content-container mousetransform">
              <div className="heading-container mousetransform">
                <h1 className="heading-name" data-text="I'm Jayden">{"I'm Jayden"}</h1>
                <div className="heading-socials">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-link">
                    <i className="fa-brands fa-github"></i>
                    <span className="social-glitch" aria-hidden="true"></span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                    <i className="fa-brands fa-linkedin"></i>
                    <span className="social-glitch" aria-hidden="true"></span>
                  </a>
                  <a href="#section3" aria-label="View Code" className="social-link">
                    <i className="fa-solid fa-code"></i>
                    <span className="social-glitch" aria-hidden="true"></span>
                  </a>
                </div>
                <span className="heading-subtext">Full Stack Developer</span>
                <span className="heading-location">Nashville, TN.</span>
              </div>
              <div className="scrolldown-container">
                <div className="chevron"></div>
                <div className="chevron"></div>
                <div className="chevron"></div>
                <span className="scroll-text">Scroll down</span>
              </div>
            </div>
          </div>
          {/* Floating code fragments */}
          <div className="code-fragments" aria-hidden="true">
            <span className="fragment fragment-1">{"const dev = () => {"}</span>
            <span className="fragment fragment-2">{"return <Innovation />"}</span>
            <span className="fragment fragment-3">{"}"}</span>
          </div>
        </section>

        {/* SECTION 2 - SKILLS */}
        <section className="section section2" id="section2">
          <a href="#section3" className="skip-portfolio" onClick={handleSkipClick}>
            Skip to portfolio <span className="skip-arrow">{">>>"}</span>
          </a>
          <div className="section2-content">
            <div className="box skills-header">
              <h2>Languages</h2>
              <div className="header-accent" aria-hidden="true"></div>
            </div>
            {skills.languages.map((skill, idx) => (
              <div key={skill.name} className="box skill-box" style={{ animationDelay: `${idx * 0.05}s` }}>
                <i className={`${skill.icon} skill-icon`} aria-hidden="true"></i>
                <h3>{skill.name}</h3>
              </div>
            ))}

            <div className="box skills-header">
              <h2>Methods</h2>
              <div className="header-accent" aria-hidden="true"></div>
            </div>
            {skills.methods.map((skill, idx) => (
              <div key={skill.name} className="box skill-box" style={{ animationDelay: `${idx * 0.05}s` }}>
                <i className={`${skill.icon} skill-icon`} aria-hidden="true"></i>
                <h3>{skill.name}</h3>
              </div>
            ))}

            <div className="box skills-header">
              <h2>Frontend</h2>
              <div className="header-accent" aria-hidden="true"></div>
            </div>
            {skills.frontend.map((skill, idx) => (
              <div key={skill.name} className="box skill-box" style={{ animationDelay: `${idx * 0.05}s` }}>
                <i className={`${skill.icon} skill-icon`} aria-hidden="true"></i>
                <h3>{skill.name}</h3>
              </div>
            ))}

            <div className="box skills-header">
              <h2>Backend</h2>
              <div className="header-accent" aria-hidden="true"></div>
            </div>
            {skills.backend.map((skill, idx) => (
              <div key={skill.name} className="box skill-box" style={{ animationDelay: `${idx * 0.05}s` }}>
                <i className={`${skill.icon} skill-icon`} aria-hidden="true"></i>
                <h3>{skill.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 - PORTFOLIO */}
        <section className="section section3" id="section3" ref={section3Ref}>
          <div className="section3-wrapper">
            <div className="section3-header">
              <h2 className="portfolio-title" data-text="PROJECTS">PROJECTS</h2>
              <div className="progress-bar" aria-label={`Portfolio scroll progress: ${Math.round(portfolioProgress * 100)}%`}>
                <div className="progress-fill" style={{ width: `${portfolioProgress * 100}%` }}></div>
              </div>
            </div>
            <div className="section3-content">
              <div className="portfolio-scroll" ref={portfolioTrackRef}>
                {projects.map((project, index) => (
                  <article key={project.title} className="portfolio-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
                    <div className="project-content">
                      <span className="project-status">{project.status}</span>
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                      <div className="project-tech">
                        {project.tech.map((tech) => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className="project-actions">
                      <button className="project-btn" aria-label={`View ${project.title} details`}>
                        <span>View Project</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                    <div className="card-noise" aria-hidden="true"></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 - CONTACT */}
        <section className="section section4" id="section4">
          <div className="section4-content content-container">
            <div className="contact-header">
              <h2 className="contact-title" data-text="LET'S CONNECT">{"LET'S CONNECT"}</h2>
              <p className="contact-subtitle">Ready to build something extraordinary?</p>
            </div>
            
            <div className="contact-grid">
              <a href="mailto:hello@jaydensrealm.com" className="contact-card">
                <div className="contact-icon">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <span className="contact-label">Email</span>
                <span className="contact-value">hello@jaydensrealm.com</span>
                <div className="card-corner" aria-hidden="true"></div>
              </a>
              
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="contact-icon">
                  <i className="fa-brands fa-github"></i>
                </div>
                <span className="contact-label">GitHub</span>
                <span className="contact-value">@jaydensrealm</span>
                <div className="card-corner" aria-hidden="true"></div>
              </a>
              
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="contact-icon">
                  <i className="fa-brands fa-linkedin"></i>
                </div>
                <span className="contact-label">LinkedIn</span>
                <span className="contact-value">Jayden</span>
                <div className="card-corner" aria-hidden="true"></div>
              </a>
            </div>

            <div className="contact-cta">
              <div className="terminal-window">
                <div className="terminal-header">
                  <span className="terminal-dot red"></span>
                  <span className="terminal-dot yellow"></span>
                  <span className="terminal-dot green"></span>
                  <span className="terminal-title">contact.sh</span>
                </div>
                <div className="terminal-body">
                  <p><span className="terminal-prompt">$</span> echo $AVAILABILITY</p>
                  <p className="terminal-output">Open to new opportunities</p>
                  <p><span className="terminal-prompt">$</span> cat skills.txt | wc -l</p>
                  <p className="terminal-output">21 battle-tested technologies</p>
                  <p><span className="terminal-prompt">$</span> <span className="terminal-cursor">_</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
