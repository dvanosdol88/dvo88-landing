// Script to restore all projects from screenshot
// Run this in the browser console on your dashboard

const projectsData = [
  {
    title: "Personal Dashboard",
    color: "teal",
    tasks: [
      { text: "Later: Improve UI", checked: false, accentColor: "blue" },
      { text: "DVO: Test camera successfully", checked: false, accentColor: "blue" },
      { text: "Test AI placing documents from camera/phone into onedrive folders", checked: false, accentColor: "blue" },
      { text: "Confirm that AI is using the NATIVE ChatGPT app, not custom", checked: false, accentColor: "blue" },
      { text: "Not seeing the camera app on the dashboard", checked: false, accentColor: "blue" },
      { text: "AI said it couldn't access my Google Drive", checked: false, accentColor: "blue" },
      { text: "No emails loading in dashboard", checked: false, accentColor: "blue" }
    ],
    forLaterTasks: [],
    links: { live: "", github: "", render: "" },
    isFlipped: false
  },
  {
    title: '"Operations Center"',
    color: "emerald",
    tasks: [
      { text: 'Create Live "Operations" dashboard so I can see all of our "INTERNAL" agents and who\'s online and accurate', checked: false, accentColor: "blue" },
      { text: 'for above, show the "health" of each one, when', checked: false, accentColor: "blue" },
      { text: 'What tasks are in the queue for each agent, and what has already been accomplished (similar to this dashboard)', checked: false, accentColor: "blue" }
    ],
    forLaterTasks: [],
    links: { live: "", github: "", render: "" },
    isFlipped: false
  },
  {
    title: "Interactive Resume",
    color: "cyan",
    tasks: [
      { text: "DVO: upload video to get AI Interactive and incorporate those changes", checked: false, accentColor: "blue" },
      { text: "DVO: have site specific language", checked: false, accentColor: "blue" },
      { text: 'DVO: Change the "tertiary" boxes, "Personal", etc.', checked: false, accentColor: "blue" }
    ],
    forLaterTasks: [],
    links: { live: "", github: "", render: "" },
    isFlipped: false
  },
  {
    title: "Car_Dodge",
    color: "purple",
    tasks: [
      { text: "Upload new mobile file so it plays in iOS", checked: false, accentColor: "blue" },
      { text: "improve 'resize/crop' /drawing/uploading", checked: false, accentColor: "blue" },
      { text: "Improve 'hard signs' to look more realistic", checked: false, accentColor: "blue" },
      { text: "later: see if Claude can 'upload vehicles (cars) can't come at once and make it impossible to get by", checked: false, accentColor: "blue" },
      { text: 'Decrease the "crash area" of the other vehicles, especially the very REAR of the vehicle', checked: false, accentColor: "blue" },
      { text: "Improve the sizing/range/crop of the trees", checked: false, accentColor: "blue" }
    ],
    forLaterTasks: [],
    links: { live: "", github: "", render: "" },
    isFlipped: false
  },
  {
    title: "THIS Page",
    color: "lime",
    tasks: [
      { text: "Allow me 'flip over' to reveal ????TODO", checked: false, accentColor: "blue" },
      { text: "Record UI process on DVO", checked: false, accentColor: "blue" },
      { text: "Deploy to production", checked: false, accentColor: "blue" },
      { text: "Make the buttons bolder when they have links", checked: false, accentColor: "blue" },
      { text: "Delete if 'delete' on more visible if they are 2 populated", checked: false, accentColor: "blue" }
    ],
    forLaterTasks: [],
    links: { live: "", github: "", render: "" },
    isFlipped: false
  },
  {
    title: "Maestro Dashboard",
    color: "sky",
    tasks: [
      { text: "Ensure all AIs from the old a2a-system/LiveOne dashboard. At scrolling screen view to show the icon movement when working", checked: false, accentColor: "blue" },
      { text: "Draft email newsletter", checked: false, accentColor: "blue" },
      { text: "Schedule blog posts", checked: false, accentColor: "blue" },
      { text: 'Maestro agents "power on" after countdown "9:00...8:59...8:58..."', checked: false, accentColor: "blue" }
    ],
    forLaterTasks: [],
    links: { live: "", github: "", render: "" },
    isFlipped: false
  }
];

// Function to restore all projects
function restoreAllProjects() {
  // Clear any existing data first
  localStorage.removeItem('dvo88-project-dashboard');
  
  // Save the new data
  localStorage.setItem('dvo88-project-dashboard', JSON.stringify(projectsData));
  
  console.log('✅ Restored', projectsData.length, 'projects!');
  console.log('🔄 Refreshing page...');
  
  // Refresh the page to load the restored data
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Run the restore
restoreAllProjects();