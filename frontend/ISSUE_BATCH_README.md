# Issue Batch Page - GreenChain Frontend

## Overview
The Issue Batch page allows producers to submit new batches of GreenChain H2 Credits for certification. This page includes comprehensive form validation, file upload capabilities, IPFS integration simulation, and blockchain submission functionality.

## Features

### 1. File Upload for Production Reports
- **Supported Formats**: JSON, PDF, TXT files
- **Drag & Drop Interface**: User-friendly file selection
- **File Validation**: Checks file size and type
- **Visual Feedback**: Shows file details after upload

### 2. Form Fields
- **Batch ID**: Unique identifier for the batch (required)
- **Amount**: Quantity in kilograms (required)
- **Carbon Intensity**: CO2 emissions per kg of H2 (required)
- **Production Method**: Dropdown with common H2 production methods
- **Description**: Optional additional details

### 3. Metadata Preview
- **Real-time Updates**: Shows all form data before submission
- **IPFS Hash Generation**: Simulates IPFS hash creation
- **Timestamp**: Records upload time
- **Producer Information**: Links to current user role

### 4. IPFS Upload Progress
- **Progress Bar**: Visual indicator of upload progress
- **Status Updates**: Real-time progress percentage
- **Simulated Upload**: Demonstrates IPFS integration workflow

### 5. Blockchain Submission
- **Submit Button**: Only enabled after IPFS upload
- **Loading States**: Shows submission progress
- **Success Feedback**: Confirms successful blockchain submission
- **Form Reset**: Automatically clears form after success

## User Workflow

1. **Upload File**: Select production report file (JSON/PDF/TXT)
2. **Fill Form**: Complete all required batch information
3. **Review Metadata**: Preview all data before submission
4. **IPFS Upload**: File is uploaded to IPFS (simulated)
5. **Blockchain Submit**: Submit batch to blockchain for certification

## Technical Implementation

### State Management
- Uses React hooks for form state
- Real-time validation and error handling
- File upload state management
- Upload progress tracking

### Form Validation
- Required field validation
- Numeric value validation
- File upload validation
- Real-time error display

### File Handling
- File input with ref
- File type and size validation
- File metadata extraction
- Upload progress simulation

### UI Components
- Responsive grid layout
- Card-based design
- Progress indicators
- Status badges
- Interactive buttons

## Integration Points

### Current Implementation
- **Simulated IPFS**: Uses mock upload progress
- **Mock Blockchain**: Simulates blockchain submission
- **Sample Data**: Uses placeholder data for demonstration

### Future Integration
- **Real IPFS**: Connect to actual IPFS network
- **Blockchain API**: Integrate with smart contracts
- **File Processing**: Parse actual production reports
- **Data Validation**: Server-side validation

## Navigation

The page is accessible via:
- **URL**: `/issue-batch`
- **Dashboard**: Quick action button for producers
- **Breadcrumbs**: Navigation breadcrumb trail

## Styling

- **Tailwind CSS**: Modern, responsive design
- **Component Library**: Consistent with dashboard design
- **Interactive Elements**: Hover effects and transitions
- **Mobile Responsive**: Works on all device sizes

## Error Handling

- **Form Validation**: Clear error messages
- **File Upload Errors**: File type and size validation
- **Network Errors**: Simulated error handling
- **User Feedback**: Success and error notifications

## Security Considerations

- **File Type Validation**: Restricts uploads to safe formats
- **Input Sanitization**: Prevents injection attacks
- **Role-based Access**: Producer role verification
- **Data Validation**: Client and server-side validation

## Testing

To test the functionality:
1. Navigate to `/issue-batch`
2. Upload a sample file
3. Fill out the form fields
4. Watch the IPFS upload simulation
5. Submit to blockchain (simulated)
6. Verify form reset and success message

## Dependencies

- **React**: Core framework
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Recharts**: Chart components (if needed for future features)

## Future Enhancements

- **Real IPFS Integration**: Connect to actual IPFS network
- **Blockchain Integration**: Smart contract interaction
- **File Parsing**: Extract data from uploaded reports
- **Batch Management**: View and edit existing batches
- **Approval Workflow**: Integration with certification process

