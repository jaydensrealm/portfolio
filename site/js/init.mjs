class ScrollEffects {
	constructor(wrapper, nav) {
		this.wrapper = wrapper;
		this.nav = nav;
		this.sections = Array.from(wrapper.querySelectorAll(".section"));
		this.navItems = Array.from(nav.querySelectorAll("li"));
		this.portfolioSection = document.querySelector(".section3-content");

		// Initialize
		this.init();
	}

	init() {
		// Set up scrollspy
		this.onScroll = this.onScroll.bind(this);

		window.addEventListener("scroll", this.onScroll);
		this.onScroll(); // Initial check
	}

	// scroll transform
	transformPortfolioScroll() {
		const offsetTopOfScroll = this.portfolioSection.parentElement.parentElement.offsetTop;
		console.log("offset, ", offsetTopOfScroll);
		let percentage = (window.scrollY - offsetTopOfScroll) / window.innerHeight * 100;
		console.log("percent 1, ", percentage);
		percentage = percentage < 0 ? 0 : percentage > 200 ? 200 : percentage;
		console.log("percent 2, ", percentage);
		this.portfolioSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`;
	}

	onScroll() {
		const scrollPosition = window.scrollY;
		const windowHeight = window.innerHeight;

		// Find the current section
		let currentSection = this.sections[0];
		this.sections.forEach((section) => {
			const sectionTop = section.offsetTop;
			// Adjust the offset to trigger slightly before reaching the section
			if (scrollPosition >= sectionTop - windowHeight / 3) {
				currentSection = section;
			}
		});

		// Update navigation
		this.navItems.forEach((item) => {
			const anchor = item.querySelector("a");
			const href = anchor.getAttribute("href");
			if (href === `#${currentSection.id}`) {
				item.classList.add("active");
			} else {
				item.classList.remove("active");
			}
		});

		// Update portfolio scroll
		this.transformPortfolioScroll();
	}
}


document.addEventListener("DOMContentLoaded", async () => {
	// Get the root element
	var root = document.querySelector(":root");


	const wrapper = document.querySelector(".portal-container");
	const nav = document.querySelector("#navscroller");
	new ScrollEffects(wrapper, nav);

	const moveForce = 10; // max popup movement in pixels
	var rotateForce = 7; // max popup rotation in deg

	// Add lerp helper
	const lerp = (start, end, t) => start * (1 - t) + end * t;
	
	// Current state
	let currentX = 0, currentY = 0;
	let currentRotateX = 0, currentRotateY = 0;
	let targetX = 0, targetY = 0;
	let targetRotateX = 0, targetRotateY = 0;

	const mousawares = document.querySelectorAll(".mousetransform");
	
	document.addEventListener("mousemove", (e) => {
		const docX = document.documentElement.clientWidth;
		const docY = document.documentElement.clientHeight;

		targetX = ((e.pageX - docX / 2) / (docX / 2)) * -moveForce;
		targetY = ((e.pageY - docY / 2) / (docY / 2)) * -moveForce;

		targetRotateY = (e.pageX / docX) * rotateForce * 2 - rotateForce;
		targetRotateX = -((e.pageY / docY) * rotateForce * 2 - rotateForce);
	});

	// Helper function to check if an element is in the viewport
	function isInViewport(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	// Animation loop
	function updateTransforms() {
		// Smooth interpolation
		currentX = lerp(currentX, targetX, 0.5);
		currentY = lerp(currentY, targetY, 0.5);
		currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
		currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

		mousawares.forEach((popup) => {
			if (isInViewport(popup)) {
				popup.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
			}
		});

		requestAnimationFrame(updateTransforms);
	}
	updateTransforms();

	console.log("Initialized");
	alert("This portfolio is still being developed. Please excuse the mess.");
});
