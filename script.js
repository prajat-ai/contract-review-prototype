document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const pasteTap = document.getElementById('paste-tab');
    const uploadTab = document.getElementById('upload-tab');
    const pasteContent = document.getElementById('paste-content');
    const uploadContent = document.getElementById('upload-content');

    pasteTap.addEventListener('click', function() {
        pasteTap.classList.add('active');
        uploadTab.classList.remove('active');
        pasteContent.classList.add('active');
        uploadContent.classList.remove('active');
    });

    uploadTab.addEventListener('click', function() {
        uploadTab.classList.add('active');
        pasteTap.classList.remove('active');
        uploadContent.classList.add('active');
        pasteContent.classList.remove('active');
    });

    // File upload handling
    const fileInput = document.getElementById('contract-file');
    const textArea = document.getElementById('contract-text');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // For prototype, just read as text
            const reader = new FileReader();
            reader.onload = function(e) {
                textArea.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });

    // Analyze button functionality
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results');

    analyzeBtn.addEventListener('click', function() {
        const contractText = textArea.value.trim();
        
        if (contractText === '') {
            alert('Please enter or upload contract text first.');
            return;
        }
        
        // Process the contract
        analyzeContract(contractText);
        
        // Show results
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });
});

function analyzeContract(contractText) {
    // Split text into paragraphs
    const paragraphs = contractText.split(/\n\s*\n/);
    
    // Generate random number of issues (between 3 and 7 for prototype)
    const numIssues = Math.floor(Math.random() * 5) + 3;
    
    // Update issue count in UI
    document.getElementById('issue-count').textContent = numIssues;
    
    // Clear previous results
    const highlightedContract = document.getElementById('highlighted-contract');
    const commentsList = document.getElementById('comments-list');
    
    highlightedContract.innerHTML = '';
    commentsList.innerHTML = '';
    
    // Sample concern types and comments
    const concernTypes = [
        { type: 'Liability Clause', comment: 'This liability clause seems overly broad and may expose you to significant risk.' },
        { type: 'Termination Terms', comment: 'The termination conditions appear to favor the other party. Consider negotiating more balanced terms.' },
        { type: 'Payment Terms', comment: 'Payment terms are vague and may lead to disputes. Request more specific payment milestones.' },
        { type: 'Intellectual Property', comment: 'This IP clause may grant more rights to the other party than necessary. Consider limiting the scope.' },
        { type: 'Confidentiality', comment: 'The confidentiality period extends well beyond industry standards. You might want to negotiate a shorter timeframe.' },
        { type: 'Non-Compete', comment: 'This non-compete clause is quite restrictive and may limit future opportunities. Consider narrowing its scope.' },
        { type: 'Indemnification', comment: 'This indemnification clause is one-sided. Request mutual indemnification provisions.' },
        { type: 'Governing Law', comment: 'The jurisdiction selected may not be favorable to your interests. Consider a neutral jurisdiction.' }
    ];
    
    // Select random paragraphs to highlight (without duplicates)
    const paragraphIndices = [];
    while (paragraphIndices.length < numIssues && paragraphIndices.length < paragraphs.length) {
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        if (!paragraphIndices.includes(randomIndex) && paragraphs[randomIndex].length > 30) {
            paragraphIndices.push(randomIndex);
        }
    }
    
    // Create HTML for contract with highlights
    paragraphs.forEach((paragraph, index) => {
        const p = document.createElement('p');
        
        if (paragraphIndices.includes(index)) {
            // This is a paragraph to highlight
            p.innerHTML = `<span class="highlight" data-index="${paragraphIndices.indexOf(index)}">${paragraph}</span>`;
        } else {
            p.textContent = paragraph;
        }
        
        highlightedContract.appendChild(p);
    });
    
    // Create comments
    paragraphIndices.forEach((paragraphIndex, i) => {
        // Select a random concern type
        const concernIndex = Math.floor(Math.random() * concernTypes.length);
        const concern = concernTypes[concernIndex];
        
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.setAttribute('data-index', i);
        
        commentItem.innerHTML = `
            <h4>${concern.type}</h4>
            <p>${concern.comment}</p>
        `;
        
        commentsList.appendChild(commentItem);
    });
    
    // Add interaction between highlights and comments
    const highlights = document.querySelectorAll('.highlight');
    const comments = document.querySelectorAll('.comment-item');
    
    highlights.forEach(highlight => {
        highlight.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            
            // Remove active class from all highlights and comments
            highlights.forEach(h => h.classList.remove('active'));
            comments.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked highlight and corresponding comment
            this.classList.add('active');
            document.querySelector(`.comment-item[data-index="${index}"]`).classList.add('active');
            
            // Scroll to the comment
            document.querySelector(`.comment-item[data-index="${index}"]`).scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    comments.forEach(comment => {
        comment.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            
            // Remove active class from all highlights and comments
            highlights.forEach(h => h.classList.remove('active'));
            comments.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked comment and corresponding highlight
            this.classList.add('active');
            document.querySelector(`.highlight[data-index="${index}"]`).classList.add('active');
            
            // Scroll to the highlight
            document.querySelector(`.highlight[data-index="${index}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}
