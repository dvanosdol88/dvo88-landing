// Fix template variable bug in project dashboard
// This script removes broken template variable entries from localStorage

const STORAGE_KEY = 'project-dashboard-data';

// Load current data
let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

console.log('Before cleanup:', data.length, 'projects');
data.forEach((project, index) => {
    console.log(`${index + 1}. "${project.title}"`);
});

// Remove entries with template variables
const cleanedData = data.filter(project => {
    return !project.title.includes('${') && 
           !project.title.includes('projectName') && 
           !project.title.includes('projectData');
});

console.log('\nAfter cleanup:', cleanedData.length, 'projects');
cleanedData.forEach((project, index) => {
    console.log(`${index + 1}. "${project.title}"`);
});

// Save cleaned data
localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedData));

console.log('\n✅ Template variable bug fixed!');
console.log('Reload the page to see the cleaned dashboard.');