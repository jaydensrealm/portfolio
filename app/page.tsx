"use client"

import { useEffect, useRef } from "react"

export default function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Dynamically inject the Font Awesome script
    const script = document.createElement("script")
    script.src = "https://kit.fontawesome.com/7ec2dc835f.js"
    script.crossOrigin = "anonymous"
    document.head.appendChild(script)

    const initEffects = () => {
      const wrapper = wrapperRef.current
      const nav = navRef.current
      if (!wrapper || !nav) return

      const sections = Array.from(wrapper.querySelectorAll(".section")) as HTMLElement[]
      const navItems = Array.from(nav.querySelectorAll("li")) as HTMLElement[]
      const portfolioSection = document.querySelector(".section3-content") as HTMLElement | null
      const portfolioTrack = portfolioSection?.querySelector(".portfolio-scroll") as HTMLElement | null
      const progressFill = document.querySelector("#portfolio-progress") as HTMLElement | null
      const experienceSection = document.querySelector(".section-experience") as HTMLElement | null
      const experienceCards = experienceSection ? Array.from(experienceSection.querySelectorAll(".exp-card")) as HTMLElement[] : []

      const transformPortfolioScroll = () => {
        if (!portfolioSection || !portfolioTrack) return
        const section = portfolioSection.closest(".section3") as HTMLElement | null
        if (!section) return
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight - window.innerHeight
        if (sectionHeight <= 0) {
          portfolioTrack.style.transform = "translate3d(0, 0, 0)"
          if (progressFill) progressFill.style.width = "0%"
          return
        }
        const progress = Math.min(Math.max((window.scrollY - sectionTop) / sectionHeight, 0), 1)
        if (progressFill) progressFill.style.width = `${progress * 100}%`
        const viewportWidth = section.clientWidth
        const trackWidth = portfolioTrack.scrollWidth
        const maxTranslate = Math.max(trackWidth - viewportWidth, 0)
        const translateX = maxTranslate > 0 ? Math.min(progress * maxTranslate, maxTranslate) : 0
        portfolioTrack.style.transform = `translate3d(${-translateX}px, 0, 0)`
      }

      const transformExperienceCards = () => {
        if (!experienceSection || experienceCards.length === 0) return
        const sectionRect = experienceSection.getBoundingClientRect()
        const windowHeight = window.innerHeight
        experienceCards.forEach((card, index) => {
          const cardOffset = index * windowHeight * 0.6
          const cardProgress = Math.min(Math.max((-sectionRect.top + cardOffset) / (windowHeight * 0.6), 0), 1)
          const scale = 0.8 + cardProgress * 0.2
          const opacity = 0.2 + cardProgress * 0.8
          const translateY = (1 - cardProgress) * 150
          card.style.transform = `scale(${scale}) translateY(${translateY}px)`
          card.style.opacity = `${opacity}`
        })
      }

      const onScroll = () => {
        const scrollPosition = window.scrollY
        const windowHeight = window.innerHeight
        let currentSection = sections[0]
        sections.forEach((section) => {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop - windowHeight / 3) {
            currentSection = section
          }
        })
        navItems.forEach((item) => {
          const anchor = item.querySelector("a")
          const href = anchor?.getAttribute("href")
          if (href === `#${currentSection.id}`) {
            item.classList.add("active")
          } else {
            item.classList.remove("active")
          }
        })
        transformPortfolioScroll()
        transformExperienceCards()
      }

      window.addEventListener("scroll", onScroll)
      onScroll()

      // Mouse Parallax
      const parallaxElements = document.querySelectorAll(".mousetransform") as NodeListOf<HTMLElement>
      if (parallaxElements.length > 0) {
        let currentX = 0, currentY = 0, currentRotateX = 0, currentRotateY = 0
        let targetX = 0, targetY = 0, targetRotateX = 0, targetRotateY = 0
        const moveForce = 10, rotateForce = 7, lerpSpeed = 0.08, rotateLerpSpeed = 0.06
        const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t
        const isInViewport = (element: HTMLElement) => {
          const rect = element.getBoundingClientRect()
          return rect.top >= -200 && rect.left >= -200 && rect.bottom <= window.innerHeight + 200 && rect.right <= window.innerWidth + 200
        }
        document.addEventListener("mousemove", (e) => {
          const docX = document.documentElement.clientWidth
          const docY = document.documentElement.clientHeight
          targetX = ((e.pageX - docX / 2) / (docX / 2)) * -moveForce
          targetY = ((e.pageY - docY / 2) / (docY / 2)) * -moveForce
          targetRotateY = (e.pageX / docX) * rotateForce * 2 - rotateForce
          targetRotateX = -((e.pageY / docY) * rotateForce * 2 - rotateForce)
        })
        const animateParallax = () => {
          currentX = lerp(currentX, targetX, lerpSpeed)
          currentY = lerp(currentY, targetY, lerpSpeed)
          currentRotateX = lerp(currentRotateX, targetRotateX, rotateLerpSpeed)
          currentRotateY = lerp(currentRotateY, targetRotateY, rotateLerpSpeed)
          parallaxElements.forEach((el) => {
            if (isInViewport(el)) {
              el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`
            }
          })
          requestAnimationFrame(animateParallax)
        }
        animateParallax()
      }

      // Skill Box Effects
      const skillBoxes = document.querySelectorAll(".skill-box") as NodeListOf<HTMLElement>
      skillBoxes.forEach((box, index) => {
        box.style.opacity = "0"
        box.style.transform = "translateY(20px)"
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                box.style.transition = "opacity 0.5s ease, transform 0.5s ease"
                box.style.opacity = "1"
                box.style.transform = "translateY(0)"
              }, index * 50)
              observer.unobserve(box)
            }
          })
        }, { threshold: 0.1 })
        observer.observe(box)
      })

      // Portfolio Card Effects
      const portfolioCards = document.querySelectorAll(".portfolio-item") as NodeListOf<HTMLElement>
      portfolioCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.style.transition = "transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease"
        })
        card.addEventListener("mouseleave", () => {
          card.style.transition = "transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease"
          card.style.transform = "translateY(0) rotateX(0) rotateY(0)"
        })
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const rotateX = (y - centerY) / 20
          const rotateY = (centerX - x) / 20
          card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        })
      })

      // Smooth Scroll
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault()
          const targetId = anchor.getAttribute("href")
          const target = targetId ? document.querySelector(targetId) : null
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      })

      return () => window.removeEventListener("scroll", onScroll)
    }

    const timeout = setTimeout(initEffects, 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <div className="scanlines" aria-hidden="true"></div>
      <div className="noise-overlay" aria-hidden="true"></div>
      <div className="vortex-bg" aria-hidden="true">
        <div className="vortex-ring vortex-ring-1"></div>
        <div className="vortex-ring vortex-ring-2"></div>
        <div className="vortex-ring vortex-ring-3"></div>
      </div>

      <nav className="nav-wrap" id="navscroller" ref={navRef}>
        <ul className="nav">
          <li className="active"><a href="#section1"><span className="nav-counter">/ Intro</span></a></li>
          <li><a href="#section2"><span className="nav-counter">/ Skills</span></a></li>
          <li><a href="#section-experience"><span className="nav-counter">/ Journey</span></a></li>
          <li><a href="#section3"><span className="nav-counter">/ Portfolio</span></a></li>
          <li><a href="#section4"><span className="nav-counter">/ Contact</span></a></li>
        </ul>
      </nav>

      <div className="portal-container" ref={wrapperRef}>
        {/* SECTION 1 - INTRO */}
        <div className="section section1" id="section1">
          <div className="overflow-hidden-wrapper">
            <div className="section1-content content-container mousetransform">
              <div className="matrix-rain" aria-hidden="true">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="matrix-column" style={{ left: `${i * 5}%`, animationDelay: `${Math.random() * 5}s` }}>
                    {["0", "1", "{", "}", "<", ">", "/", "*", "=", "+"][Math.floor(Math.random() * 10)]}
                  </div>
                ))}
              </div>
              <div className="code-fragments" aria-hidden="true">
                <span className="fragment fragment-1">{"const dev = () => {"}</span>
                <span className="fragment fragment-2">{"return <Innovation />"}</span>
                <span className="fragment fragment-3">{"}"}</span>
                <span className="fragment fragment-4">{"// Building the future"}</span>
                <span className="fragment fragment-5">{"async function create() {"}</span>
              </div>
              <div className="heading-container mousetransform">
                <h1 className="heading-name glitch-text" data-text="I'm Jayden">{"I'm Jayden"}</h1>
                <div className="heading-socials">
                  <a href="https://github.com/jaydensrealm" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                    <i className="fa-brands fa-github"></i><span className="link-glow"></span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                    <i className="fa-brands fa-linkedin"></i><span className="link-glow"></span>
                  </a>
                  <a href="#section3" className="social-link" aria-label="View Projects">
                    <i className="fa-solid fa-code"></i><span className="link-glow"></span>
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
        </div>

        {/* SECTION 2 - SKILLS */}
        <div className="section section2" id="section2">
          <a href="#section3" className="skip-portfolio">Skip to portfolio <span className="skip-arrow">{">>>"}</span></a>
          <div className="section2-content">
            <div className="box skills-header"><h1>Languages</h1><div className="header-underline"></div></div>
            <div className="box skill-box"><i className="fa-brands fa-java skill-icon" aria-hidden="true"></i><h1>Java</h1></div>
            <div className="box skill-box"><i className="fa-brands fa-python skill-icon" aria-hidden="true"></i><h1>Python</h1></div>
            <div className="box skill-box"><i className="fa-brands fa-rust skill-icon" aria-hidden="true"></i><h1>Rust</h1></div>
            <div className="box skill-box"><i className="fa-brands fa-golang skill-icon" aria-hidden="true"></i><h1>Go</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-database skill-icon" aria-hidden="true"></i><h1>SQL</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-vial skill-icon" aria-hidden="true"></i><h1>Junit</h1></div>
            <div className="box skills-header"><h1>Methods</h1><div className="header-underline"></div></div>
            <div className="box skill-box"><i className="fa-solid fa-arrows-spin skill-icon" aria-hidden="true"></i><h1>Agile</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-infinity skill-icon" aria-hidden="true"></i><h1>CI/CD</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-gears skill-icon" aria-hidden="true"></i><h1>DevOps</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-users skill-icon" aria-hidden="true"></i><h1>Scrum</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-cubes skill-icon" aria-hidden="true"></i><h1>Microservices</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-diagram-project skill-icon" aria-hidden="true"></i><h1>Design Patterns</h1></div>
            <div className="box skills-header"><h1>Frontend</h1><div className="header-underline"></div></div>
            <div className="box skill-box"><i className="fa-brands fa-react skill-icon" aria-hidden="true"></i><h1>React</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-layer-group skill-icon" aria-hidden="true"></i><h1>Redux</h1></div>
            <div className="box skill-box"><i className="fa-brands fa-node-js skill-icon" aria-hidden="true"></i><h1>Next.JS</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-bolt skill-icon" aria-hidden="true"></i><h1>Svelte</h1></div>
            <div className="box skill-box"><i className="fa-brands fa-html5 skill-icon" aria-hidden="true"></i><h1>Plain</h1></div>
            <div className="box skills-header"><h1>Backend</h1><div className="header-underline"></div></div>
            <div className="box skill-box"><i className="fa-solid fa-leaf skill-icon" aria-hidden="true"></i><h1>Spring</h1></div>
            <div className="box skill-box"><i className="fa-brands fa-node skill-icon" aria-hidden="true"></i><h1>Express</h1></div>
            <div className="box skill-box"><i className="fa-brands fa-aws skill-icon" aria-hidden="true"></i><h1>AWS</h1></div>
            <div className="box skill-box"><i className="fa-solid fa-plug skill-icon" aria-hidden="true"></i><h1>REST</h1></div>
          </div>
        </div>

        {/* NEW SECTION - EXPERIENCE JOURNEY */}
        <div className="section section-experience" id="section-experience">
          <div className="exp-wrapper">
            <div className="exp-header">
              <h2 className="exp-title glitch-text" data-text="THE JOURNEY">THE JOURNEY</h2>
              <div className="exp-timeline-line"></div>
            </div>
            <div className="exp-stack">
              <div className="exp-card exp-card-1">
                <div className="exp-card-glow"></div>
                <div className="exp-year">2024</div>
                <div className="exp-content">
                  <span className="exp-role">Senior Developer</span>
                  <h3 className="exp-company">Enterprise Solutions</h3>
                  <p className="exp-desc">Leading architecture decisions for distributed systems. Building microservices that handle millions of requests daily.</p>
                  <div className="exp-tech-stack"><span>Java</span><span>Spring</span><span>Kafka</span><span>K8s</span></div>
                </div>
                <div className="exp-card-number">01</div>
              </div>
              <div className="exp-card exp-card-2">
                <div className="exp-card-glow"></div>
                <div className="exp-year">2022</div>
                <div className="exp-content">
                  <span className="exp-role">Full Stack Developer</span>
                  <h3 className="exp-company">Tech Startup</h3>
                  <p className="exp-desc">Built real-time collaboration tools from scratch. Implemented WebSocket systems and reactive frontends.</p>
                  <div className="exp-tech-stack"><span>React</span><span>Node.js</span><span>PostgreSQL</span><span>Redis</span></div>
                </div>
                <div className="exp-card-number">02</div>
              </div>
              <div className="exp-card exp-card-3">
                <div className="exp-card-glow"></div>
                <div className="exp-year">2020</div>
                <div className="exp-content">
                  <span className="exp-role">Junior Developer</span>
                  <h3 className="exp-company">Agency Work</h3>
                  <p className="exp-desc">Cut my teeth on client projects. Learned to ship fast, iterate faster, and communicate effectively.</p>
                  <div className="exp-tech-stack"><span>JavaScript</span><span>PHP</span><span>MySQL</span><span>AWS</span></div>
                </div>
                <div className="exp-card-number">03</div>
              </div>
              <div className="exp-card exp-card-4">
                <div className="exp-card-glow"></div>
                <div className="exp-year">2018</div>
                <div className="exp-content">
                  <span className="exp-role">The Beginning</span>
                  <h3 className="exp-company">Self-Taught Journey</h3>
                  <p className="exp-desc">Started with curiosity and Stack Overflow. Built terrible projects that taught me everything.</p>
                  <div className="exp-tech-stack"><span>HTML</span><span>CSS</span><span>JavaScript</span><span>Curiosity</span></div>
                </div>
                <div className="exp-card-number">04</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 - PORTFOLIO */}
        <div className="section section3" id="section3">
          <div className="section3-wrapper">
            <div className="section3-header">
              <h2 className="portfolio-title" data-text="PROJECTS">PROJECTS</h2>
              <div className="progress-container">
                <div className="progress-bar"><div className="progress-fill" id="portfolio-progress"></div></div>
                <span className="progress-text">Scroll to explore</span>
              </div>
            </div>
            <div className="section3-content">
              <div className="portfolio-scroll">
                <div className="portfolio-item">
                  <div className="project-number" aria-hidden="true">01</div>
                  <div className="project-content">
                    <span className="project-status">Production</span>
                    <h3 className="project-title">Project Alpha</h3>
                    <p className="project-description">A distributed microservices architecture for real-time data processing with event-driven design.</p>
                    <div className="project-tech">
                      <span className="tech-tag">Java</span><span className="tech-tag">Spring</span><span className="tech-tag">Kafka</span><span className="tech-tag">Redis</span>
                    </div>
                  </div>
                  <div className="project-actions"><a href="#" className="project-btn"><span>View Project</span><i className="fa-solid fa-arrow-right"></i></a></div>
                  <div className="card-corner tl"></div><div className="card-corner tr"></div><div className="card-corner bl"></div><div className="card-corner br"></div>
                </div>
                <div className="portfolio-item">
                  <div className="project-number" aria-hidden="true">02</div>
                  <div className="project-content">
                    <span className="project-status">Active</span>
                    <h3 className="project-title">Project Beta</h3>
                    <p className="project-description">Full-stack web application with reactive frontend and serverless backend architecture.</p>
                    <div className="project-tech">
                      <span className="tech-tag">React</span><span className="tech-tag">TypeScript</span><span className="tech-tag">AWS Lambda</span><span className="tech-tag">DynamoDB</span>
                    </div>
                  </div>
                  <div className="project-actions"><a href="#" className="project-btn"><span>View Project</span><i className="fa-solid fa-arrow-right"></i></a></div>
                  <div className="card-corner tl"></div><div className="card-corner tr"></div><div className="card-corner bl"></div><div className="card-corner br"></div>
                </div>
                <div className="portfolio-item">
                  <div className="project-number" aria-hidden="true">03</div>
                  <div className="project-content">
                    <span className="project-status">Open Source</span>
                    <h3 className="project-title">Project Gamma</h3>
                    <p className="project-description">High-performance CLI tool built for system automation and infrastructure monitoring.</p>
                    <div className="project-tech">
                      <span className="tech-tag">Rust</span><span className="tech-tag">tokio</span><span className="tech-tag">serde</span>
                    </div>
                  </div>
                  <div className="project-actions"><a href="#" className="project-btn"><span>View Project</span><i className="fa-solid fa-arrow-right"></i></a></div>
                  <div className="card-corner tl"></div><div className="card-corner tr"></div><div className="card-corner bl"></div><div className="card-corner br"></div>
                </div>
                <div className="portfolio-item">
                  <div className="project-number" aria-hidden="true">04</div>
                  <div className="project-content">
                    <span className="project-status">Research</span>
                    <h3 className="project-title">Project Delta</h3>
                    <p className="project-description">Machine learning pipeline for predictive analytics in e-commerce platforms.</p>
                    <div className="project-tech">
                      <span className="tech-tag">Python</span><span className="tech-tag">TensorFlow</span><span className="tech-tag">FastAPI</span><span className="tech-tag">PostgreSQL</span>
                    </div>
                  </div>
                  <div className="project-actions"><a href="#" className="project-btn"><span>View Project</span><i className="fa-solid fa-arrow-right"></i></a></div>
                  <div className="card-corner tl"></div><div className="card-corner tr"></div><div className="card-corner bl"></div><div className="card-corner br"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 - CONTACT */}
        <div className="section section4" id="section4">
          <div className="section4-content content-container">
            <div className="contact-header">
              <h2 className="contact-title glitch-text" data-text="LET'S CONNECT">{"LET'S CONNECT"}</h2>
              <p className="contact-subtitle">Ready to build something extraordinary?</p>
            </div>
            <div className="contact-grid">
              <a href="mailto:hello@jaydensrealm.com" className="contact-card">
                <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
                <span className="contact-label">Email</span>
                <span className="contact-value">hello@jaydensrealm.com</span>
                <div className="card-corner tl"></div><div className="card-corner br"></div>
              </a>
              <a href="https://github.com/jaydensrealm" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="contact-icon"><i className="fa-brands fa-github"></i></div>
                <span className="contact-label">GitHub</span>
                <span className="contact-value">@jaydensrealm</span>
                <div className="card-corner tl"></div><div className="card-corner br"></div>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="contact-icon"><i className="fa-brands fa-linkedin"></i></div>
                <span className="contact-label">LinkedIn</span>
                <span className="contact-value">Jayden</span>
                <div className="card-corner tl"></div><div className="card-corner br"></div>
              </a>
            </div>
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
                <p><span className="terminal-prompt">$</span> ./hire-jayden.sh</p>
                <p className="terminal-output typing-effect">Initializing collaboration...</p>
                <p><span className="terminal-prompt">$</span> <span className="terminal-cursor">_</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
