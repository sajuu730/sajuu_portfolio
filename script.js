const menuButton=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".nav-links");
if(menuButton&&navigation){
  menuButton.addEventListener("click",()=>{
    const open=navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(open));
  });
  navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded","false");
  }));
}
const year=document.querySelector("#year");
if(year)year.textContent=new Date().getFullYear();
const progress=document.querySelector("#scrollProgress");
const nav=document.querySelector("#siteNav");
const navLinks=[...document.querySelectorAll(".nav-links a[href^='#']")];
const sections=navLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
function updateScroll(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  if(progress)progress.style.transform="scaleX("+(max>0?window.scrollY/max:0)+")";
  if(nav)nav.classList.toggle("scrolled",window.scrollY>12);
  let current=null;
  sections.forEach(section=>{if(section.getBoundingClientRect().top<window.innerHeight*.38)current=section.id});
  navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+current));
}
let scrollQueued=false;
window.addEventListener("scroll",()=>{
  if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{updateScroll();scrollQueued=false})}
},{passive:true});
window.addEventListener("resize",updateScroll);
updateScroll();
const revealTargets=document.querySelectorAll(".section-heading,.about-grid,.timeline-card,.project-card,.evidence-card,.skill-card,.contact-panel");
if("IntersectionObserver"in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  revealTargets.forEach(element=>element.classList.add("reveal"));
  const observer=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");obs.unobserve(entry.target)}});
  },{threshold:.12});
  revealTargets.forEach(element=>observer.observe(element));
}
if(window.matchMedia("(hover:hover)").matches&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  document.querySelectorAll(".project-card").forEach(card=>card.addEventListener("pointermove",event=>{
    const rect=card.getBoundingClientRect();
    card.style.setProperty("--mx",(event.clientX-rect.left)+"px");
    card.style.setProperty("--my",(event.clientY-rect.top)+"px");
  },{passive:true}));
}