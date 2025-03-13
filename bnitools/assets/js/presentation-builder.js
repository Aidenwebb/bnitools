// presentation-builder.js

// Default headings and template
const defaultHeadings = {
    introduction: "Introduction & Category",
    category: "Category",
    story: "Story",
    referralRequest: "Referral Request"
  };
  
  const defaultTemplate = `
    {{#opener}}<h4>Opener</h4>{{/opener}}
    {{#opener}}<p>{{opener}}</p>{{/opener}}
    <h4>{{introductionHeading}}</h4>
    <p>Good morning!</p>
    <p>My name is <strong>{{yourName}}</strong> and my business is <strong>{{businessName}}</strong>.</p>
    <p>We are <strong>{{yourCategory}}</strong></p>
                   
    <h4>{{referralRequestHeading}}</h4>
    {{#isCustomer}}
    <p>Who do you know that... {{problemStatement}}</p>
    {{/isCustomer}}
    {{#isReferralPartner}}
    <p>I’m looking to connect with <strong>{{position}}s</strong> in the <strong>{{industry}}</strong> industry.</p>
    <p>If you know <strong>{{specificPerson}}</strong>, the <strong>{{position}}</strong> at <strong>{{companyName}}</strong> — I’d love an introduction.</p>
    {{/isReferralPartner}}
  
    <h4>{{storyHeading}}</h4>
    <p>because I can help them like I helped... {{yourStory}}</p>
  
    {{#closer}}<h4>Closer</h4>{{/closer}}
    {{#closer}}<p>{{closer}}</p>{{/closer}}
  `;
  
  function loadDefaultTemplate() {
    const templateField = document.getElementById('template');
    templateField.value = defaultTemplate;
    generatePresentation();
  }
  
  function loadExampleText() {
    document.getElementById('opener').value = "Did you know that 60% of small businesses go out of business within six months of a major cyber attack?";
    document.getElementById('yourName').value = "Aiden Arnkels-Webb";
    document.getElementById('businessName').value = "Rootwire";
    document.getElementById('yourCategory').value = "Cybersecurity and IT Solutions Experts";
    document.getElementById('problemStatement').value = "hates that their computer is always crashing.";
    document.getElementById('industry').value = "Insurance";
    document.getElementById('companyName').value = "Insurance4U";
    document.getElementById('position').value = "Business Owner";
    document.getElementById('specificPerson').value = "Dan James";
    document.getElementById('yourStory').value = "Fred at Fred's Insurance. They were facing repeated network outages and security concerns that disrupted work. By implementing a proactive monitoring solution and optimizing their network security, we reduced his downtime by 80%. Now his team can focus on their work without IT disruptions.";
    
    generatePresentation();
  }
  
  function clearFields() {
    document.getElementById('opener').value = "";
    document.getElementById('yourName').value = "";
    document.getElementById('businessName').value = "";
    document.getElementById('yourCategory').value = "";
    document.getElementById('problemStatement').value = "";
    document.getElementById('industry').value = "";
    document.getElementById('companyName').value = "";
    document.getElementById('position').value = "";
    document.getElementById('specificPerson').value = "";
    document.getElementById('yourStory').value = "";
    
    document.getElementById('presentationText').innerHTML = "Your presentation will appear here...";
    document.getElementById('estimatedTime').innerText = "Approximate Speaking Time: --";
  }
  
  function addInputListeners() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => input.addEventListener('input', generatePresentation));
    document.querySelectorAll('input[name="referralType"]').forEach(radio =>
      radio.addEventListener('change', toggleReferralFields)
    );
    document.querySelectorAll('input[name="customiseHeadings"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.getElementById("customHeadingsSection").style.display = radio.value === "yes" ? "block" : "none";
        generatePresentation();
      });
    });
  }
  
  function toggleReferralFields() {
    const isCustomer = document.getElementById("customerRadio").checked;
    document.getElementById("problemStatementSection").style.display = isCustomer ? "block" : "none";
    document.getElementById("referralPartnerFields").style.display = isCustomer ? "none" : "block";
    generatePresentation();
  }
  
  function generatePresentation() {
    const useCustomHeadings = document.querySelector('input[name="customiseHeadings"]:checked').value === "yes";
    const data = {
      introductionHeading: useCustomHeadings ? document.getElementById('introductionHeading').value || defaultHeadings.introduction : defaultHeadings.introduction,
      categoryHeading: useCustomHeadings ? document.getElementById('categoryHeading').value || defaultHeadings.category : defaultHeadings.category,
      storyHeading: useCustomHeadings ? document.getElementById('storyHeading').value || defaultHeadings.story : defaultHeadings.story,
      referralRequestHeading: useCustomHeadings ? document.getElementById('referralRequestHeading').value || defaultHeadings.referralRequest : defaultHeadings.referralRequest,
      opener: document.getElementById('opener').value,
      closer: document.getElementById('closer').value,
      yourName: document.getElementById('yourName').value,
      businessName: document.getElementById('businessName').value,
      yourCategory: document.getElementById('yourCategory').value,
      yourStory: document.getElementById('yourStory').value,
      problemStatement: document.getElementById('problemStatement').value,
      industry: document.getElementById('industry').value,
      companyName: document.getElementById('companyName').value,
      position: document.getElementById('position').value,
      specificPerson: document.getElementById('specificPerson').value,
      isCustomer: document.getElementById("customerRadio").checked,
      isReferralPartner: document.getElementById("partnerRadio").checked
    };
  
    const template = document.getElementById('template').value.trim() || defaultTemplate;
    const output = Mustache.render(template, data);
    document.getElementById('presentationText').innerHTML = output;
    updateEstimatedTime();
  }
  
  function countWords(text) {
    return text.trim().split(/\s+/).length;
  }
  
  function updateEstimatedTime() {
    const presentationText = document.getElementById('presentationText').innerText;
    const wordCount = countWords(presentationText);
    const wpm = parseInt(document.getElementById('wpm').value, 10) || 130;
    const seconds = Math.round((wordCount / wpm) * 60);
    document.getElementById('estimatedTime').innerText = `Approximate Speaking Time: ${seconds} seconds`;
  }
  
  function printPresentation() {
    printJS({
      printable: 'presentationText',
      type: 'html',
      css: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
      style: 'body { font-family: Arial, sans-serif; margin: 20px; } h3 { text-align: center; }',
      scanStyles: false
    });
  }
  
  // Initialize on page load
  document.addEventListener("DOMContentLoaded", function() {
    addInputListeners();
    toggleReferralFields();
    generatePresentation();
    document.getElementById('wpm').addEventListener('input', updateEstimatedTime);
  });
  