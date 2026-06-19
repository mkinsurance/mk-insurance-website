(function(){"use strict";const phoneNumber="8076436396";const header=document.getElementById("siteHeader");const year=document.getElementById("year");const leadForm=document.getElementById("lead-form");const callbackForm=document.getElementById("callbackForm");const callbackTab=document.getElementById("callbackTab");const callbackWidget=document.getElementById("callbackWidget");const closeCallback=document.getElementById("closeCallback");const exitModalEl=document.getElementById("exitIntentModal");const policyModalEl=document.getElementById("policyModal");const policyModalTitle=document.getElementById("policyModalTitle");const policyModalBody=document.getElementById("policyModalBody");if(year)year.textContent=new Date().getFullYear();const setHeaderState=()=>{if(header)header.classList.toggle("is-scrolled",window.scrollY>8)};setHeaderState();window.addEventListener("scroll",setHeaderState,{passive:true});document.querySelectorAll('a[href^="#"]').forEach(link=>{link.addEventListener("click",event=>{const targetId=link.getAttribute("href");if(!targetId||targetId==="#")return;const target=document.querySelector(targetId);if(!target)return;event.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"})})});const observer="IntersectionObserver"in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}})},{threshold:.14}):null;document.querySelectorAll(".reveal").forEach(element=>{observer?observer.observe(element):element.classList.add("is-visible")});const counterObserver="IntersectionObserver"in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;animateCounter(entry.target);counterObserver.unobserve(entry.target)})},{threshold:.5}):null;document.querySelectorAll("[data-count]").forEach(counter=>{counterObserver?counterObserver.observe(counter):counter.textContent=Number(counter.dataset.count||0).toLocaleString("en-IN")+"+"});function animateCounter(element){const target=Number(element.dataset.count||0);const duration=1200;const start=performance.now();const tick=now=>{const progress=Math.min((now-start)/duration,1);const eased=1-Math.pow(1-progress,3);element.textContent=Math.round(target*eased).toLocaleString("en-IN")+"+";if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}function normalizeLead(form){const data=new FormData(form);return{fullName:String(data.get("fullName")||"").trim(),mobile:String(data.get("mobile")||"").trim(),email:String(data.get("email")||"").trim(),city:String(data.get("city")||"").trim(),insuranceType:String(data.get("insuranceType")||"").trim()}}

// VALIDATION LOGIC FIXED YAHAN HAI
function validateForm(form,onValid){form.addEventListener("submit",event=>{event.preventDefault();event.stopPropagation();form.classList.add("was-validated");if(!form.checkValidity()){const firstInvalid=form.querySelector(":invalid");if(firstInvalid)firstInvalid.focus();return}onValid(form)})}

// 1. MAIN FORM (QUICK ENQUIRY) WITH VALIDATION LOCK
if(leadForm){
  validateForm(leadForm,form=>{
    const lead=normalizeLead(form);
    const formData = new FormData(form);
    formData.append("form-name", "QuickEnquiry");
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      sessionStorage.setItem("mkInsuranceLead",JSON.stringify({...lead,submittedAt:new Date().toISOString()}));
      const params=new URLSearchParams({name:lead.fullName,type:lead.insuranceType,city:lead.city});
      window.location.href=`thank-you.html?${params.toString()}`;
    })
    .catch((error) => {
      console.error("Netlify Submission Error:", error);
      window.location.href=`thank-you.html`;
    });
  });
}

// 2. CALLBACK FORM WITH VALIDATION LOCK
if(callbackForm){
  validateForm(callbackForm,(form)=>{
    const formData = new FormData(form);
    if(!formData.has("form-name")){
      formData.append("form-name", "callbackForm");
    }
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      alert("Thank you! We will call you back shortly.");
      form.reset();
      form.classList.remove("was-validated"); // Reset error classes
      toggleCallback(false);
    })
    .catch((error) => {
      console.error("Callback Form Error:", error);
      window.location.href=`tel:+91${phoneNumber}`;
    });
  });
}

function toggleCallback(open){if(!callbackWidget||!callbackTab)return;callbackWidget.classList.toggle("is-open",open);callbackTab.setAttribute("aria-expanded",String(open))}if(callbackTab){callbackTab.addEventListener("click",()=>toggleCallback(!callbackWidget.classList.contains("is-open")))}if(closeCallback){closeCallback.addEventListener("click",()=>toggleCallback(false))}let exitShown=sessionStorage.getItem("mkExitIntentShown")==="true";const showExitIntent=()=>{if(exitShown||!exitModalEl||typeof bootstrap==="undefined")return;exitShown=true;sessionStorage.setItem("mkExitIntentShown","true");bootstrap.Modal.getOrCreateInstance(exitModalEl).show()};document.addEventListener("mouseleave",event=>{if(event.clientY<=0)showExitIntent()});setTimeout(()=>{if(window.scrollY>400)showExitIntent()},45000);const policyContent={privacy:{title:"Privacy Policy",body:"We collect enquiry details only to contact you about insurance consultation, quotes and service support. We do not sell personal information. Data shared through forms, calls or WhatsApp is used for advisory, policy processing and claim assistance as requested by you."},terms:{title:"Terms & Conditions",body:"Consultation is provided to help you compare insurance options. Final premium, issuance, benefits and claim settlement are subject to insurer underwriting, policy terms, exclusions, documentation and regulatory requirements."},disclaimer:{title:"Disclaimer",body:"MK Insurance and Financial Solutions provides insurance advisory and assistance. Insurance is a subject matter of solicitation. Please read policy wording, exclusions, waiting periods and benefit limits carefully before purchase."}};document.querySelectorAll("[data-policy]").forEach(link=>{link.addEventListener("click",event=>{event.preventDefault();const content=policyContent[link.getAttribute("data-policy")];if(!content||!policyModalEl||typeof bootstrap==="undefined")return;policyModalTitle.textContent=content.title;policyModalBody.textContent=content.body;bootstrap.Modal.getOrCreateInstance(policyModalEl).show()})});window.MKInsurance={phoneNumber}})();
