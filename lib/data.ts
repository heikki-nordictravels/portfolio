import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Skill, Experience, Project, ApiResponse } from './models';

// Define the data directory path
const dataDirectory = path.join(process.cwd(), 'data');

// Make sure the data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(dataDirectory);
  } catch (error) {
    try {
      await fs.mkdir(dataDirectory, { recursive: true });
    } catch (mkdirError: any) {
      console.error("Error creating data directory:", mkdirError);
      throw new Error(`Could not create data directory: ${mkdirError.message}`);
    }
  }
}

// Generic function to get data from a JSON file
export async function getData<T>(filename: string, defaultData: T[]): Promise<ApiResponse<T[]>> {
  try {
    await ensureDataDirectory();
    const filePath = path.join(dataDirectory, `${filename}.json`);
    
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      return {
        data: JSON.parse(fileData),
        success: true
      };
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create it with default data
        try {
          await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
          return {
            data: defaultData,
            success: true
          };
        } catch (writeError: any) {
          console.error(`Error creating ${filename}.json:`, writeError);
          return {
            error: `Failed to create file: ${writeError.message}`,
            success: false
          };
        }
      }
      
      console.error(`Error reading ${filename}.json:`, error);
      return {
        error: `Failed to read data: ${error.message}`,
        success: false
      };
    }
  } catch (error: any) {
    console.error(`General error accessing data:`, error);
    return {
      error: `Error accessing data: ${error.message}`,
      success: false
    };
  }
}

// Generic function to save data to a JSON file
export async function saveData<T>(filename: string, data: T[]): Promise<ApiResponse<null>> {
  console.log(`Attempting to save ${filename} data:`, data);
  try {
    await ensureDataDirectory();
    const filePath = path.join(dataDirectory, `${filename}.json`);
    
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Successfully saved ${filename} data`);
      return {
        success: true
      };
    } catch (error: any) {
      console.error(`Error writing to ${filename}.json:`, error);
      return {
        error: `Failed to write data: ${error.message}`,
        success: false
      };
    }
  } catch (error: any) {
    console.error(`Error saving data to ${filename}.json:`, error);
    return {
      error: `Failed to save data: ${error.message}`,
      success: false
    };
  }
}

// Helper function to ensure each item has an ID
export function ensureId<T extends { id?: string }>(item: T): T & { id: string } {
  if (item.id) {
    return item as T & { id: string };
  }
  return {
    ...item,
    id: uuidv4()
  };
}

// Specific helper functions for skills
export async function getSkills(): Promise<ApiResponse<Skill[]>> {
  return getData<Skill>('skills', []);
}

export async function saveSkills(skills: Skill[]): Promise<ApiResponse<null>> {
  // Make sure all skills have IDs
  const skillsWithIds = skills.map(skill => ensureId(skill));
  return saveData<Skill>('skills', skillsWithIds);
}

// Specific helper functions for experiences
export async function getExperiences(): Promise<ApiResponse<Experience[]>> {
  return getData<Experience>('experiences', []);
}

export async function saveExperiences(experiences: Experience[]): Promise<ApiResponse<null>> {
  const experiencesWithIds = experiences.map(exp => ensureId(exp));
  return saveData<Experience>('experiences', experiencesWithIds);
}

// Specific helper functions for projects
export async function getProjects(): Promise<ApiResponse<Project[]>> {
  return getData<Project>('projects', []);
}

export async function saveProjects(projects: Project[]): Promise<ApiResponse<null>> {
  const projectsWithIds = projects.map(project => ensureId(project));
  return saveData<Project>('projects', projectsWithIds);
}