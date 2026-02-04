class ScrollEffects {
	constructor(wrapper, nav) {
		this.wrapper = wrapper;
		this.nav = nav;
		this.sections = Array.from(wrapper.querySelectorAll(".section"));
		this.navItems = Array.from(nav.querySelectorAll("li"));
		this.portfolioSection = document.querySelector(".section3-content");
		this.portfolioTrack = this.portfolioSection
			? this.portfolioSection.querySelector(".portfolio-scroll")
			: null;
		this.progressFill = document.querySelector("#portfolio-progress");

		this.init();
	}

	init() {
		this.onScroll = this.onScroll.bind(this);
		window.addEventListener("scroll", this.onScroll);
		this.onScroll();
	}

	transformPortfolioScroll() {
		if (!this.portfolioSection || !this.portfolioTrack) {
			return;
		}

		const section = this.portfolioSection.closest(".section3");
		if (!section) {
			return;
		}

		const sectionTop = section.offsetTop;
		const sectionHeight = section.offsetHeight - window.innerHeight;
		if (sectionHeight <= 0) {
			this.portfolioTrack.style.transform = "translate3d(0, 0, 0)";
			if (this.progressFill) this.progressFill.style.width = "0%";
			return;
		}

		const progress = Math.min(
			Math.max((window.scrollY - sectionTop) / sectionHeight, 0),
			1
		);

		// Update progress bar
		if (this.progressFill) {
			this.progressFill.style.width = `${progress * 100}%`;
		}

		const viewportWidth = section.clientWidth;
		const trackWidth = this.portfolioTrack.scrollWidth;
		const maxTranslate = Math.max(trackWidth - viewportWidth, 0);
		const translateX = maxTranslate > 0 ? Math.min(progress * maxTranslate, maxTranslate) : 0;

		this.portfolioTrack.style.transform = `translate3d(${-translateX}px, 0, 0)`;
	}

	onScroll() {
		const scrollPosition = window.scrollY;
		const windowHeight = window.innerHeight;

		let currentSection = this.sections[0];
		this.sections.forEach((section) => {
			const sectionTop = section.offsetTop;
			if (scrollPosition >= sectionTop - windowHeight / 3) {
				currentSection = section;
			}
		});

		this.navItems.forEach((item) => {
			const anchor = item.querySelector("a");
			const href = anchor.getAttribute("href");
			if (href === `#${currentSection.id}`) {
				item.classList.add("active");
			} else {
				item.classList.remove("active");
			}
		});

		this.transformPortfolioScroll();
	}
}


class MouseParallax {
	constructor(elements, options = {}) {
		this.elements = elements;
		this.moveForce = options.moveForce || 10;
		this.rotateForce = options.rotateForce || 7;
		this.lerpSpeed = options.lerpSpeed || 0.08;
		this.rotateLerpSpeed = options.rotateLerpSpeed || 0.06;
		
		this.currentX = 0;
		this.currentY = 0;
		this.currentRotateX = 0;
		this.currentRotateY = 0;
		this.targetX = 0;
		this.targetY = 0;
		this.targetRotateX = 0;
		this.targetRotateY = 0;
		
		this.init();
	}
	
	lerp(start, end, t) {
		return start * (1 - t) + end * t;
	}
	
	isInViewport(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= -200 &&
			rect.left >= -200 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 200 &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 200
		);
	}
	
	init() {
		document.addEventListener("mousemove", (e) => {
			const docX = document.documentElement.clientWidth;
			const docY = document.documentElement.clientHeight;

			this.targetX = ((e.pageX - docX / 2) / (docX / 2)) * -this.moveForce;
			this.targetY = ((e.pageY - docY / 2) / (docY / 2)) * -this.moveForce;

			this.targetRotateY = (e.pageX / docX) * this.rotateForce * 2 - this.rotateForce;
			this.targetRotateX = -((e.pageY / docY) * this.rotateForce * 2 - this.rotateForce);
		});
		
		this.animate();
	}
	
	animate() {
		this.currentX = this.lerp(this.currentX, this.targetX, this.lerpSpeed);
		this.currentY = this.lerp(this.currentY, this.targetY, this.lerpSpeed);
		this.currentRotateX = this.lerp(this.currentRotateX, this.targetRotateX, this.rotateLerpSpeed);
		this.currentRotateY = this.lerp(this.currentRotateY, this.targetRotateY, this.rotateLerpSpeed);

		this.elements.forEach((el) => {
			if (this.isInViewport(el)) {
				el.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0) rotateX(${this.currentRotateX}deg) rotateY(${this.currentRotateY}deg)`;
			}
		});

		requestAnimationFrame(() => this.animate());
	}
}


class SkillBoxEffects {
	constructor() {
		this.boxes = document.querySelectorAll(".skill-box");
		this.init();
	}
	
	init() {
		this.boxes.forEach((box, index) => {
			// Staggered entrance animation
			box.style.opacity = "0";
			box.style.transform = "translateY(20px)";
			
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setTimeout(() => {
							box.style.transition = "opacity 0.5s ease, transform 0.5s ease";
							box.style.opacity = "1";
							box.style.transform = "translateY(0)";
						}, index * 50);
						observer.unobserve(box);
					}
				});
			}, { threshold: 0.1 });
			
			observer.observe(box);
		});
	}
}


class PortfolioCardEffects {
	constructor() {
		this.cards = document.querySelectorAll(".portfolio-item");
		this.init();
	}
	
	init() {
		this.cards.forEach((card) => {
			card.addEventListener("mouseenter", () => this.onEnter(card));
			card.addEventListener("mouseleave", () => this.onLeave(card));
			card.addEventListener("mousemove", (e) => this.onMove(e, card));
		});
	}
	
	onEnter(card) {
		card.style.transition = "transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease";
	}
	
	onLeave(card) {
		card.style.transition = "transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease";
		card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
	}
	
	onMove(e, card) {
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		
		const rotateX = (y - centerY) / 20;
		const rotateY = (centerX - x) / 20;
		
		card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
	}
}


class SmoothScroll {
	constructor() {
		this.init();
	}
	
	init() {
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener("click", (e) => {
				e.preventDefault();
				const targetId = anchor.getAttribute("href");
				const target = document.querySelector(targetId);
				
				if (target) {
					target.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
				}
			});
		});
	}
}


// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	const wrapper = document.querySelector(".portal-container");
	const nav = document.querySelector("#navscroller");
	
	// Core effects
	new ScrollEffects(wrapper, nav);
	new SmoothScroll();
	
	// Mouse parallax for elements with .mousetransform class
	const parallaxElements = document.querySelectorAll(".mousetransform");
	if (parallaxElements.length > 0) {
		new MouseParallax(parallaxElements);
	}
	
	// Skill box entrance animations
	new SkillBoxEffects();
	
	// Portfolio card 3D hover effects
	new PortfolioCardEffects();
	
	// Terminal typing effect
	const typingElement = document.querySelector(".typing-effect");
	if (typingElement) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					typingElement.style.animation = "typing 2s steps(30) forwards";
					observer.unobserve(typingElement);
				}
			});
		}, { threshold: 0.5 });
		
		observer.observe(typingElement);
	}
	
	console.log("Portfolio initialized");
});
