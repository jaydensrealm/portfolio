"use client"

import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [activeSection, setActiveSection] = useState("section1")
  const portalRef = useRef<HTMLDivElement>(null)

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
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }

    let animationId: number

    function updateTransforms() {
      currentX = lerp(currentX, targetX, 0.5)
      currentY = lerp(currentY, targetY, 0.5)
      currentRotateX = lerp(currentRotateX, targetRotateX, 0.1)
      currentRotateY = lerp(currentRotateY, targetRotateY, 0.1)

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
    languages: ["Java", "Python", "Rust", "Go", "SQL", "Junit"],
    methods: ["Agile", "CI/CD", "DevOps", "Scrum", "Microservices", "Design Patterns"],
    frontend: ["React", "Redux", "Next.JS", "Svelte", "Plain"],
    backend: ["Spring", "Express", "AWS", "REST"],
  }

  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.querySelector("#section3")
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      <nav className="nav-wrap" id="navscroller">
        <ul className="nav">
          {navItems.map((item) => (
            <li key={item.id} className={activeSection === item.id ? "active" : ""}>
              <a href={`#${item.id}`}>
                <span className="nav-counter">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="portal-container" ref={portalRef}>
        <div className="section section1" id="section1">
          <div className="overflow-hidden-wrapper">
            <div className="section1-content content-container mousetransform">
              <div className="heading-container mousetransform">
                <h1 className="heading-name">{"I'm Jayden"}</h1>
                <div className="heading-socials">
                  <a href="#" aria-label="GitHub">
                    <i className="fa-brands fa-github"></i>
                  </a>
                  <a href="#" aria-label="LinkedIn">
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                  <a href="#" aria-label="Code">
                    <i className="fa-solid fa-code"></i>
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

        <div className="section section2" id="section2">
          <a href="#section3" className="skip-portfolio" onClick={handleSkipClick}>
            {"Skip to portfolio ->"}
          </a>
          <div className="section2-content">
            <div className="box skills-header"><h1>Languages</h1></div>
            {skills.languages.map((skill) => (
              <div key={skill} className="box"><h1>{skill}</h1></div>
            ))}

            <div className="box skills-header"><h1>Methods</h1></div>
            {skills.methods.map((skill) => (
              <div key={skill} className="box"><h1>{skill}</h1></div>
            ))}

            <div className="box skills-header"><h1>Frontend</h1></div>
            {skills.frontend.map((skill) => (
              <div key={skill} className="box"><h1>{skill}</h1></div>
            ))}

            <div className="box skills-header"><h1>Backend</h1></div>
            {skills.backend.map((skill) => (
              <div key={skill} className="box"><h1>{skill}</h1></div>
            ))}
          </div>
        </div>

        <div className="section section3" id="section3">
          <div className="section3-wrapper">
            <div className="section3-content">
              <div className="portfolio-scroll">
                <div className="portfolio-item">Project 1</div>
                <div className="portfolio-item">Project 2</div>
                <div className="portfolio-item">Project 3</div>
                <div className="portfolio-item">Project 4</div>
              </div>
            </div>
          </div>
        </div>

        <div className="section section4" id="section4">
          <div className="section4-content content-container">
            <h1>Contact</h1>
            <p>{"Get in touch!"}</p>
          </div>
        </div>
      </div>
    </>
  )
}
