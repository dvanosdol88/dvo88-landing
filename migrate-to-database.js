// Script to migrate localStorage data to PostgreSQL database
// Run this in the browser console at dvo88.com

async function migrateToDatabase() {
    console.log('Starting migration from localStorage to database...');
    
    // Get data from localStorage
    const STORAGE_KEY = 'dvo88-project-dashboard';
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (!saved) {
        console.error('No data found in localStorage!');
        return;
    }
    
    try {
        const projects = JSON.parse(saved);
        console.log(`Found ${projects.length} projects to migrate`);
        
        // Check if API is available
        if (typeof ProjectAPI === 'undefined') {
            console.error('ProjectAPI not available. Make sure you\'re on dvo88.com');
            return;
        }
        
        const api = new ProjectAPI();
        
        // Get existing projects from database
        const existingProjects = await api.getAllProjects();
        
        if (existingProjects && existingProjects.length > 0) {
            console.warn(`Database already has ${existingProjects.length} projects.`);
            const confirm = window.confirm('Database already has projects. Do you want to continue? This will ADD to existing projects.');
            if (!confirm) {
                console.log('Migration cancelled');
                return;
            }
        }
        
        // Migrate each project
        let successCount = 0;
        for (const project of projects) {
            try {
                console.log(`Migrating project: ${project.title}`);
                
                // Create the project
                const newProject = await api.createProject({
                    title: project.title,
                    color: project.color || 'teal',
                    tasks: project.tasks || [],
                    forLaterTasks: project.forLaterTasks || [],
                    links: project.links || {}
                });
                
                if (newProject) {
                    successCount++;
                    console.log(`✅ Successfully migrated: ${project.title}`);
                }
            } catch (error) {
                console.error(`❌ Failed to migrate ${project.title}:`, error);
            }
        }
        
        console.log(`\nMigration complete! ${successCount}/${projects.length} projects migrated successfully.`);
        
        if (successCount === projects.length) {
            console.log('🎉 All projects migrated successfully!');
            console.log('Refreshing page to load from database...');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
        
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

// Run the migration
migrateToDatabase();