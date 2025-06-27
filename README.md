# Industrial Image Management System

## Overview

A streamlined web application for managing industrial inspection images with embedded EXIF metadata. This system allows organizations to classify, organize, and view inspection images with rich metadata that travels with the image files.

## 🚀 Key Features

### EXIF Metadata Embedding

- **Self-Contained Images**: Metadata is embedded directly into image EXIF data using the UserComment tag
- **No Separate Files**: Eliminates the need for separate JSON metadata files
- **Industry Standard**: Uses standard EXIF format compatible with existing tools
- **Data Integrity**: Metadata cannot be separated from images

### Image Classification & Management

- **Project Organization**: Structured by Organization → Project → Inspection Station
- **Rich Metadata**: Comprehensive project info, image details, observations, and custom fields
- **Bulk Processing**: Handle multiple images simultaneously
- **Version Tracking**: Automatic timestamps and modification history

### Advanced Viewing & Export

- **EXIF Metadata Viewer**: Built-in tool to read and display embedded metadata
- **Structured Display**: View metadata in organized, tabular format
- **Raw JSON Display**: View complete metadata in formatted JSON
- **JSON Export**: Download metadata for external processing
- **Error Resilience**: Robust handling of different metadata formats

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Build Tool**: Vite
- **EXIF Libraries**:
  - `exifr` - Reading EXIF data
  - `piexifjs` - Writing EXIF data
- **File System**: File System Access API with fallback support

## 📁 Project Structure

```
src/
├── components/
│   ├── classify/
│   │   ├── ImageCategorization.tsx    # Main classification interface
│   │   ├── MetadataViewer.tsx         # EXIF metadata viewer
│   │   ├── ProjectSetup.tsx           # Project configuration
│   │   └── ...
├── lib/
│   ├── exifMetadataManager.ts         # Core EXIF operations
│   ├── exifFileService.ts             # File management with EXIF
│   └── ...
├── pages/
│   ├── Index.tsx                      # Main dashboard
│   ├── Classify.tsx                   # Classification workflow
│   ├── MetadataViewer.tsx             # Metadata viewing page
│   └── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome/Edge recommended for full File System API support)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Dependencies

```json
{
  "exifr": "^7.1.3", // EXIF reading
  "piexifjs": "^1.0.6", // EXIF writing
  "@types/piexifjs": "^1.0.4" // TypeScript definitions
}
```

## 📖 Usage Guide

### Main Dashboard

The system provides two core functionalities:

- **Classify New Images**: Process and embed metadata into inspection images
- **View EXIF Metadata**: Read and display embedded metadata from processed images

### 1. Classify New Images

1. Navigate to "Classify New Images" from the dashboard
2. Set up project details:
   - Organization name
   - Project name
   - Inspection station
   - Camera name
3. Upload images (supports bulk upload)
4. Add metadata for each image:
   - Title and description
   - Observations and measurements
   - Custom fields
5. Save - images are processed with embedded EXIF metadata

### 2. View EXIF Metadata

1. Navigate to "View EXIF Metadata" from the dashboard
2. Upload images with embedded metadata
3. Click "Read All Metadata" to extract embedded data
4. View metadata in two formats:
   - **Structured View**: Organized sections with project info, image details, observations
   - **Raw JSON View**: Complete metadata in formatted JSON
5. Download individual metadata as JSON files

### 3. File Organization

The system automatically creates organized directory structures:

```
[Selected Directory]/
├── [Organization]/
│   ├── [Project]/
│   │   ├── [Inspection Station]/
│   │   │   └── images/
│   │   │       ├── img-001.jpg (with embedded metadata)
│   │   │       ├── img-002.png (with embedded metadata)
│   │   │       └── ...
```

**Note**: All metadata is embedded directly in the image files - no separate JSON files are created.

## 🔧 Metadata Structure

### Updated Nested Structure

The system now uses a comprehensive nested metadata structure:

```json
{
  "version": "1.0",
  "organization": "ITC Limited",
  "project": {
    "id": "PROJ-1703123456789-abc123def",
    "name": "Pipeline Inspection Q4 2024",
    "phase": "Image Classification",
    "inspectionStation": "Station Alpha",
    "cameraName": "Thermal Camera 01",
    "organizationType": "Industrial"
  },
  "image_metadata": {
    "id": "img-001",
    "category": "thermal",
    "tags": ["pipeline", "joint", "inspection"],
    "status": "processed",
    "created_date": "2024-12-19T10:30:00.000Z",
    "last_modified": "2024-12-19T10:30:00.000Z",
    "title": "Pipeline Joint Thermal Analysis",
    "description": "Thermal imaging of pipeline joint",
    "original_filename": "thermal_001.jpg",
    "file_size": 2048576,
    "dimensions": { "width": 1920, "height": 1080 }
  },
  "observations": {
    "temperature_max": 85.5,
    "temperature_min": 22.1,
    "anomaly_detected": true,
    "inspection_notes": "Hot spot detected at joint connection"
  },
  "custom_fields": {
    "inspector_id": "INS-001",
    "weather_conditions": "Clear, 15°C"
  }
}
```

### Backward Compatibility

The system includes fallback support for legacy metadata formats, automatically converting old flat structures to the new nested format when reading metadata.

## 🌐 Browser Compatibility

### Full Support (Chrome/Edge)

- File System Access API for direct directory saving
- Complete EXIF reading and writing
- Optimal user experience

### Partial Support (Firefox/Safari)

- Download-based file saving
- Full EXIF reading and metadata viewing
- Graceful degradation

## 📚 Documentation

- **[EXIF_METADATA_SYSTEM.md](./EXIF_METADATA_SYSTEM.md)** - Comprehensive technical documentation
- **[STORAGE_CHANGES.md](./STORAGE_CHANGES.md)** - Migration notes from previous system

## 🔄 Migration from Previous System

The system has been completely redesigned to use EXIF metadata embedding instead of separate JSON files:

### Previous System ❌

- Separate JSON metadata files
- Complex directory structure
- Risk of metadata/image separation
- Multiple workflow options

### New System ✅

- Metadata embedded in image EXIF data
- Simplified directory structure
- Self-contained image files
- Streamlined workflow (Classify → View)

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Static Hosting

The built application can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔧 Recent Updates

### Version 2.0 Changes

- **Simplified Interface**: Reduced from 4 main features to 2 core functionalities
- **Enhanced Metadata Viewer**:
  - Removed "Test First Image" button
  - Added inline JSON display alongside structured view
  - Improved error handling and fallback support
- **Better User Experience**:
  - Summary sections for quick overview
  - Prominent download buttons
  - Cleaner visual hierarchy
- **Robust Error Handling**: Prevents page crashes with malformed metadata
- **Backward Compatibility**: Supports both new and legacy metadata formats

## 📄 License

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- EXIF libraries (exifr, piexifjs)

## 🔗 Additional Resources

- **Documentation**: [EXIF_METADATA_SYSTEM.md](./EXIF_METADATA_SYSTEM.md)
- **Migration Guide**: [STORAGE_CHANGES.md](./STORAGE_CHANGES.md)
