/// <reference path="../types/fileSystem.d.ts" />

import { exifMetadataManager, ProjectMetadata, ProjectData, ObservationData } from './exifMetadataManager';

export class ExifFileService {
  private static instance: ExifFileService;
  private directoryHandle: FileSystemDirectoryHandle | null = null;

  static getInstance(): ExifFileService {
    if (!ExifFileService.instance) {
      ExifFileService.instance = new ExifFileService();
    }
    return ExifFileService.instance;
  }

  // Check if File System Access API is supported
  isSupported(): boolean {
    return 'showDirectoryPicker' in window;
  }

  // Initialize the working directory - automatically prompt user to select project root
  async initializeWorkingDirectory(): Promise<void> {
    if (!this.isSupported()) {
      console.warn('File System Access API not supported. Files will be downloaded instead.');
      return;
    }

    try {
      // Prompt user to select the project root directory where images should be stored
      this.directoryHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents'
      });
      console.log('Working directory initialized:', this.directoryHandle.name);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Directory selection was cancelled. Please select a directory to save images.');
      }
      console.error('Failed to initialize working directory:', error);
      throw new Error('Failed to access file system. Please ensure you have the necessary permissions.');
    }
  }

  // Create directory structure: Organization/Project/InspectionStation/
  private async createDirectoryStructure(projectData: ProjectData): Promise<FileSystemDirectoryHandle> {
    if (!this.directoryHandle) {
      await this.initializeWorkingDirectory();
    }

    if (!this.directoryHandle) {
      throw new Error('No directory handle available');
    }

    // Validate project data
    if (!projectData.organisationName || !projectData.projectName || !projectData.inspectionStation) {
      console.error('Invalid project data:', projectData);
      throw new Error('Missing required project data. Please ensure Organization Name, Project Name, and Inspection Station are all filled in.');
    }

    // Create organization directory
    const orgHandle = await this.directoryHandle.getDirectoryHandle(
      this.sanitizeFileName(projectData.organisationName),
      { create: true }
    );

    // Create project directory
    const projectHandle = await orgHandle.getDirectoryHandle(
      this.sanitizeFileName(projectData.projectName),
      { create: true }
    );

    // Create inspection station directory
    const stationHandle = await projectHandle.getDirectoryHandle(
      this.sanitizeFileName(projectData.inspectionStation),
      { create: true }
    );

    // Create images directory (no separate metadata directory needed)
    await stationHandle.getDirectoryHandle('images', { create: true });

    return stationHandle;
  }

  // Sanitize filename to remove invalid characters
  private sanitizeFileName(name: string): string {
    if (!name || typeof name !== 'string') {
      console.error('Invalid filename provided to sanitizeFileName:', name);
      throw new Error('Invalid filename: expected a non-empty string');
    }
    return name.replace(/[<>:"/\\|?*]/g, '_').trim();
  }

  // Save images with embedded EXIF metadata
  async saveImagesWithEmbeddedMetadata(
    images: File[],
    imageData: Record<number, any>,
    templates: any[],
    projectData: ProjectData
  ): Promise<void> {
    try {
      console.log('Saving images with project data:', projectData);
      console.log('Project data type check:', {
        organisationName: typeof projectData.organisationName,
        projectName: typeof projectData.projectName,
        inspectionStation: typeof projectData.inspectionStation,
        cameraName: typeof projectData.cameraName
      });
      
      if (this.isSupported()) {
        await this.saveWithFileSystemAPI(images, imageData, templates, projectData);
      } else {
        await this.saveWithDownloads(images, imageData, templates, projectData);
      }
    } catch (error) {
      console.error('Failed to save images with embedded metadata:', error);
      throw error;
    }
  }

  // Save using File System Access API with EXIF metadata
  private async saveWithFileSystemAPI(
    images: File[],
    imageData: Record<number, any>,
    templates: any[],
    projectData: ProjectData
  ): Promise<void> {
    const stationHandle = await this.createDirectoryStructure(projectData);
    const imagesHandle = await stationHandle.getDirectoryHandle('images');

    // Convert imageData to observations format for each image
    const imageObservations: Record<number, ObservationData[]> = {};
    
    for (let i = 0; i < images.length; i++) {
      const currentImageData = imageData[i] || {};
      const observations: ObservationData[] = [];
      
      // Convert observations from template format to our structure
      if (currentImageData.observations) {
        for (const [templateId, value] of Object.entries(currentImageData.observations)) {
          const template = templates.find(t => t.id === templateId);
          if (template && value !== undefined && value !== '') {
            observations.push({
              observationName: template.name,
              observationType: template.type === 'boolean' ? 'bool' : template.type,
              observationValue: value as string | number | boolean
            });
          }
        }
      }
      
      imageObservations[i] = observations;
    }

    // Process images with metadata embedding
    const { processedImages, metadata } = await exifMetadataManager.processImagesWithMetadata(
      images,
      imageObservations,
      projectData
    );

    // Save processed images with embedded metadata
    for (let i = 0; i < processedImages.length; i++) {
      const processedImage = processedImages[i];
      const imageMetadata = metadata[i];
      const originalFile = images[i];
      const fileExtension = originalFile.name.split('.').pop() || 'jpg';
      const imageFileName = `${imageMetadata.image_metadata.id}.${fileExtension}`;

      // Save image file with embedded metadata
      const imageFileHandle = await imagesHandle.getFileHandle(imageFileName, { create: true });
      const imageWritable = await imageFileHandle.createWritable();
      await imageWritable.write(processedImage);
      await imageWritable.close();
    }

    // No summary file needed - all metadata is embedded in images
    console.log(`Successfully saved ${images.length} images with embedded EXIF metadata. No separate metadata files created.`);
  }

  // Fallback: Save using downloads with EXIF metadata
  private async saveWithDownloads(
    images: File[],
    imageData: Record<number, any>,
    templates: any[],
    projectData: ProjectData
  ): Promise<void> {
    // Convert imageData to observations format for each image
    const imageObservations: Record<number, ObservationData[]> = {};
    
    for (let i = 0; i < images.length; i++) {
      const currentImageData = imageData[i] || {};
      const observations: ObservationData[] = [];
      
      // Convert observations from template format to our structure
      if (currentImageData.observations) {
        for (const [templateId, value] of Object.entries(currentImageData.observations)) {
          const template = templates.find(t => t.id === templateId);
          if (template && value !== undefined && value !== '') {
            observations.push({
              observationName: template.name,
              observationType: template.type === 'boolean' ? 'bool' : template.type,
              observationValue: value as string | number | boolean
            });
          }
        }
      }
      
      imageObservations[i] = observations;
    }

    // Process images with metadata embedding
    const { processedImages, metadata } = await exifMetadataManager.processImagesWithMetadata(
      images,
      imageObservations,
      projectData
    );

    // Download processed images with embedded metadata
    for (let i = 0; i < processedImages.length; i++) {
      const processedImage = processedImages[i];
      const imageMetadata = metadata[i];
      const originalFile = images[i];
      const fileExtension = originalFile.name.split('.').pop() || 'jpg';
      const imageFileName = `${imageMetadata.image_metadata.id}.${fileExtension}`;

      // Download image with embedded metadata
      const url = URL.createObjectURL(processedImage);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Small delay between downloads to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Successfully prepared ${images.length} images with embedded EXIF metadata for download. No separate metadata files needed - all metadata is embedded in the images.`);
  }

  // Read metadata from images in a directory
  async readMetadataFromImages(imageFiles: File[]): Promise<ProjectMetadata[]> {
    const metadataList: ProjectMetadata[] = [];

    for (const imageFile of imageFiles) {
      try {
        const metadata = await exifMetadataManager.extractJsonMetadata(imageFile);
        if (metadata) {
          // Check if it's the new structured format or old flat format
          if (metadata.image_metadata && metadata.project && metadata.organization) {
            // New structured format - use as is
            metadataList.push(metadata);
          } else if ((metadata as any).id && (metadata as any).organisationName) {
            // Old flat format - convert to new structured format
            const oldMetadata = metadata as any;
            const convertedMetadata: ProjectMetadata = {
              version: "1.0",
              organization: oldMetadata.organisationName || 'Unknown',
              project: {
                id: `PROJ-${Date.now()}-legacy`,
                name: oldMetadata.projectName || 'Unknown Project',
                phase: "Image Classification",
                inspectionStation: oldMetadata.inspectionStation || 'Unknown Station',
                cameraName: oldMetadata.cameraName || 'Unknown Camera',
                organizationType: "Industrial"
              },
              image_metadata: {
                id: oldMetadata.id || imageFile.name,
                category: "general",
                tags: [],
                status: "processed",
                created_date: oldMetadata.timestamp || new Date().toISOString(),
                last_modified: oldMetadata.timestamp || new Date().toISOString(),
                title: oldMetadata.imageFile || imageFile.name,
                description: "",
                original_filename: imageFile.name,
                file_size: imageFile.size,
                dimensions: undefined
              },
              observations: oldMetadata.observations || {},
              custom_fields: {}
            };
            metadataList.push(convertedMetadata);
          } else {
            // Unknown format - create a basic structure
            console.warn(`Unknown metadata format in ${imageFile.name}:`, metadata);
            const basicMetadata: ProjectMetadata = {
              version: "1.0",
              organization: 'Unknown',
              project: {
                id: `PROJ-${Date.now()}-unknown`,
                name: 'Unknown Project',
                phase: "Image Classification",
                inspectionStation: 'Unknown Station',
                cameraName: 'Unknown Camera',
                organizationType: "Industrial"
              },
              image_metadata: {
                id: imageFile.name,
                category: "general",
                tags: [],
                status: "unknown",
                created_date: new Date().toISOString(),
                last_modified: new Date().toISOString(),
                title: imageFile.name,
                description: "",
                original_filename: imageFile.name,
                file_size: imageFile.size,
                dimensions: undefined
              },
              observations: metadata || {},
              custom_fields: {}
            };
            metadataList.push(basicMetadata);
          }
        }
      } catch (error) {
        console.error(`Failed to read metadata from ${imageFile.name}:`, error);
      }
    }

    return metadataList;
  }

  // Update metadata in an existing image
  async updateImageMetadata(
    imageFile: File,
    updates: Partial<ProjectMetadata>
  ): Promise<Blob> {
    return await exifMetadataManager.updateJsonMetadata(imageFile, updates);
  }

  // Validate that an image has embedded metadata
  async hasEmbeddedMetadata(imageFile: File): Promise<boolean> {
    const metadata = await exifMetadataManager.extractJsonMetadata(imageFile);
    return metadata !== null;
  }

  // Extract just the project info from embedded metadata
  async getProjectInfoFromImage(imageFile: File): Promise<ProjectData | null> {
    const metadata = await exifMetadataManager.extractJsonMetadata(imageFile);
    if (metadata) {
      return {
        organisationName: metadata.organization,
        projectName: metadata.project.name,
        inspectionStation: metadata.project.inspectionStation,
        cameraName: metadata.project.cameraName
      };
    }
    return null;
  }
}

export const exifFileService = ExifFileService.getInstance(); 