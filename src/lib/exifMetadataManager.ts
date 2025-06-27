import * as EXIFR from 'exifr';
import * as piexif from 'piexifjs';

// Simplified metadata structure matching the user's requirements
export interface ObservationData {
  observationName: string;
  observationType: 'numeric' | 'bool' | 'string';
  observationValue: number | boolean | string;
}

// Updated metadata structure to match component expectations
export interface ProjectMetadata {
  version: string;
  organization: string;
  project: {
    id: string;
    name: string;
    phase: string;
    inspectionStation: string;
    cameraName: string;
    organizationType: string;
  };
  image_metadata: {
    id: string;
    category: string;
    tags: string[];
    status: string;
    created_date: string;
    last_modified: string;
    title?: string;
    description?: string;
    original_filename: string;
    file_size: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  observations: Record<string, any>;
  custom_fields?: Record<string, any>;
}

export interface ProjectData {
  organisationName: string;
  projectName: string;
  inspectionStation: string;
  cameraName: string;
}

export class ExifMetadataManager {
  private static instance: ExifMetadataManager;
  private readonly COMMENT_TAG = piexif.ExifIFD.UserComment;

  static getInstance(): ExifMetadataManager {
    if (!ExifMetadataManager.instance) {
      ExifMetadataManager.instance = new ExifMetadataManager();
    }
    return ExifMetadataManager.instance;
  }

  /**
   * Embed JSON metadata into image EXIF UserComment tag
   */
  async embedJsonMetadata(
    imageFile: File,
    metadataDict: ProjectMetadata
  ): Promise<Blob> {
    try {
      // Convert metadata to JSON string
      const jsonString = JSON.stringify(metadataDict, null, 2);
      
      // Check if metadata is too large for EXIF (EXIF has size limitations)
      if (jsonString.length > 65000) { // Conservative limit for EXIF UserComment
        throw new Error('Metadata is too large. Please reduce the amount of observation data.');
      }
      
      // Convert to bytes for EXIF UserComment
      const commentBytes = new TextEncoder().encode(jsonString);
      
      return await this.embedMetadataBytes(imageFile, commentBytes);
    } catch (error) {
      console.error('Error embedding metadata:', error);
      throw new Error(`Failed to embed metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Helper method to embed metadata bytes into image
   */
  private async embedMetadataBytes(imageFile: File, commentBytes: Uint8Array): Promise<Blob> {
    // Use FileReader to read the image as data URL directly
    const imageDataUrl = await this.fileToDataUrl(imageFile);
    
    // Load existing EXIF or create new
    let exifDict: any;
    try {
      const exifData = piexif.load(imageDataUrl);
      exifDict = exifData;
    } catch (error) {
      // Create new EXIF structure if none exists
      exifDict = {
        "0th": {},
        "Exif": {},
        "GPS": {},
        "1st": {}
      };
    }
    
    // Convert the JSON bytes back to string for piexifjs
    const jsonString = new TextDecoder().decode(commentBytes);
    
    console.log('Embedding UserComment as string:', {
      type: typeof jsonString,
      length: jsonString.length,
      startsWithBrace: jsonString.startsWith('{'),
      endsWithBrace: jsonString.endsWith('}'),
      preview: jsonString.substring(0, 100) + (jsonString.length > 100 ? '...' : '')
    });
    
    // Add JSON string directly to UserComment tag
    exifDict["Exif"][this.COMMENT_TAG] = jsonString;
    
    // Dump EXIF data
    const exifBytes = piexif.dump(exifDict);
    
    // Insert EXIF into image
    const newImageDataUrl = piexif.insert(exifBytes, imageDataUrl);
    
    // Convert data URL back to blob
    const blob = this.dataUrlToBlob(newImageDataUrl);
    
    return blob;
  }

  /**
   * Convert File to data URL using FileReader (more memory efficient)
   */
  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as data URL'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extract JSON metadata from image EXIF UserComment tag
   */
  async extractJsonMetadata(imageFile: File): Promise<ProjectMetadata | null> {
    try {
      console.log(`Attempting to extract metadata from: ${imageFile.name}`);
      
      // Read EXIF data using exifr with proper UserComment configuration
      const exifData = await EXIFR.parse(imageFile, {
        userComment: true,  // Enable UserComment parsing
        exif: true,
        tiff: true,
        mergeOutput: false,  // Keep segments separate for debugging
        translateKeys: false,  // Use raw tag numbers for more reliable access
        translateValues: false,  // Keep raw values
        reviveValues: false,  // Don't convert values
        sanitize: false  // Don't sanitize to preserve all data
      });
      
      console.log(`EXIF data for ${imageFile.name}:`, {
        hasExifData: !!exifData,
        exifKeys: exifData ? Object.keys(exifData) : [],
        hasExifSegment: !!(exifData && exifData.exif),
        exifSegmentKeys: exifData?.exif ? Object.keys(exifData.exif) : [],
        hasUserComment: !!(exifData && exifData.exif && exifData.exif[0x9286]), // UserComment tag number
        userCommentRaw: exifData?.exif?.[0x9286],
        userCommentType: exifData?.exif?.[0x9286] ? typeof exifData.exif[0x9286] : 'undefined',
        userCommentLength: exifData?.exif?.[0x9286] instanceof Uint8Array ? exifData.exif[0x9286].length : 
                          exifData?.exif?.[0x9286] ? String(exifData.exif[0x9286]).length : 0
      });
      
      // Try to get UserComment from different possible locations
      let userComment = null;
      
      // Check in exif segment with tag number 0x9286 (UserComment)
      if (exifData?.exif?.[0x9286]) {
        userComment = exifData.exif[0x9286];
      }
      // Check with string key
      else if (exifData?.exif?.UserComment) {
        userComment = exifData.exif.UserComment;
      }
      // Check in merged output
      else if (exifData?.UserComment) {
        userComment = exifData.UserComment;
      }
      // Check with tag number in merged output
      else if (exifData?.[0x9286]) {
        userComment = exifData[0x9286];
      }
      
      if (userComment) {
        console.log(`Found UserComment in ${imageFile.name}:`, {
          type: typeof userComment,
          isUint8Array: userComment instanceof Uint8Array,
          length: userComment instanceof Uint8Array ? userComment.length : String(userComment).length,
          preview: userComment instanceof Uint8Array ? 
            new TextDecoder().decode(userComment.slice(0, 100)) : 
            String(userComment).substring(0, 100)
        });
        
        // Handle different UserComment formats
        let commentString: string;
        
        if (typeof userComment === 'string') {
          commentString = userComment;
        } else if (userComment instanceof Uint8Array) {
          // UserComment in EXIF has a specific format:
          // First 8 bytes are character code, rest is the actual comment
          if (userComment.length > 8) {
            // Skip the first 8 bytes (character code) and decode the rest
            const commentBytes = userComment.slice(8);
            commentString = new TextDecoder('utf-8', { ignoreBOM: true }).decode(commentBytes);
          } else {
            // If too short, try to decode the whole thing
            commentString = new TextDecoder('utf-8', { ignoreBOM: true }).decode(userComment);
          }
        } else {
          // Try to convert to string
          commentString = String(userComment);
        }
        
        // Clean up the string (remove null bytes and trim)
        commentString = commentString.replace(/\0/g, '').trim();
        
        console.log(`Extracted comment string from ${imageFile.name}:`, {
          length: commentString.length,
          startsWithBrace: commentString.startsWith('{'),
          endsWithBrace: commentString.endsWith('}'),
          preview: commentString.substring(0, 100) + (commentString.length > 100 ? '...' : '')
        });
        
        // Try to parse as JSON
        if (commentString.startsWith('{') && commentString.endsWith('}')) {
          try {
            const parsed = JSON.parse(commentString);
            console.log(`Successfully parsed metadata from ${imageFile.name}`);
            return parsed;
          } catch (parseError) {
            console.error(`JSON parse error for ${imageFile.name}:`, parseError);
            console.log(`Raw comment string that failed to parse:`, commentString);
            return null;
          }
        } else {
          console.warn(`UserComment in ${imageFile.name} does not appear to be JSON format. Content:`, commentString);
        }
      } else {
        console.warn(`No UserComment found in EXIF data for ${imageFile.name}`);
      }
      
      return null;
    } catch (error) {
      console.error(`Error extracting metadata from ${imageFile.name}:`, error);
      return null;
    }
  }

  /**
   * Update existing JSON metadata in image
   */
  async updateJsonMetadata(
    imageFile: File,
    updates: Partial<ProjectMetadata>
  ): Promise<Blob> {
    try {
      // Get existing metadata
      const existingData = await this.extractJsonMetadata(imageFile);
      
      let updatedData: ProjectMetadata;
      
      if (existingData) {
        // Merge updates with existing data
        updatedData = {
          ...existingData,
          ...updates,
          // Always update last_modified when modifying
          image_metadata: {
            ...existingData.image_metadata,
            ...(updates.image_metadata || {}),
            last_modified: new Date().toISOString()
          },
          // Merge observations if both exist
          observations: updates.observations || existingData.observations
        };
      } else {
        // If no existing data, use updates as base (should include required fields)
        updatedData = updates as ProjectMetadata;
      }
      
      // Embed updated metadata
      return await this.embedJsonMetadata(imageFile, updatedData);
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error(`Failed to update metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create metadata structure from project data and image information
   */
  async createMetadataFromProject(
    projectData: ProjectData,
    imageFile: File,
    imageIndex: number,
    observations: ObservationData[] = []
  ): Promise<ProjectMetadata> {
    const timestamp = new Date().toISOString();
    const imageId = this.generateImageId(imageIndex);
    
    // Convert observations array to record format
    const observationsRecord: Record<string, any> = {};
    observations.forEach(obs => {
      observationsRecord[obs.observationName] = obs.observationValue;
    });
    
    return {
      version: "1.0",
      organization: projectData.organisationName,
      project: {
        id: `PROJ-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name: projectData.projectName,
        phase: "Image Classification",
        inspectionStation: projectData.inspectionStation,
        cameraName: projectData.cameraName,
        organizationType: "Industrial"
      },
      image_metadata: {
        id: imageId,
        category: "general",
        tags: [],
        status: "processed",
        created_date: timestamp,
        last_modified: timestamp,
        title: imageFile.name,
        description: "",
        original_filename: imageFile.name,
        file_size: imageFile.size,
        dimensions: undefined // Will be filled later if needed
      },
      observations: observationsRecord,
      custom_fields: {}
    };
  }

  /**
   * Process multiple images with metadata embedding
   */
  async processImagesWithMetadata(
    images: File[],
    imageObservations: Record<number, ObservationData[]>,
    projectData: ProjectData
  ): Promise<{ processedImages: Blob[], metadata: ProjectMetadata[] }> {
    const processedImages: Blob[] = [];
    const metadata: ProjectMetadata[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const observations = imageObservations[i] || [];
      
      try {
        // Create metadata for this image
        const imageMetadata = await this.createMetadataFromProject(
          projectData,
          image,
          i,
          observations
        );
        
        // Embed metadata into image
        const processedImage = await this.embedJsonMetadata(image, imageMetadata);
        
        processedImages.push(processedImage);
        metadata.push(imageMetadata);
      } catch (error) {
        console.error(`Failed to process image ${image.name}:`, error);
        // Continue with other images even if one fails
        throw new Error(`Failed to process image "${image.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { processedImages, metadata };
  }

  /**
   * Generate unique image ID
   */
  private generateImageId(index: number): string {
    return `img-${String(index + 1).padStart(3, '0')}`;
  }

  /**
   * Convert data URL back to Blob
   */
  private dataUrlToBlob(dataUrl: string): Blob {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].split(':')[1].split(';')[0];
    const binaryString = atob(parts[1]);
    
    // Create Uint8Array more efficiently for large data
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([arrayBuffer], { type: mimeType });
  }
}

export const exifMetadataManager = ExifMetadataManager.getInstance(); 