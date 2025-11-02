# AI Cost Planner Guide

## Overview
The AI Cost Planner is a tool that helps estimate project costs for civil and structural engineering projects. Users can input project details and receive an AI-generated cost estimate with breakdown.

## How to Use

### Accessing the Cost Planner
1. Navigate to the "Cost Planner" link in the main navigation menu
2. Or click the "Cost Planner" button on the homepage hero section

### Using the Cost Planner Form
1. Fill in all required fields:
   - **Project Goal**: Select from dropdown (Home renovation, New building, Interior design, etc.)
   - **Project Size**: Select from dropdown (Small, Medium, Large with descriptions)
   - **Preferred Materials Quality**: Select from dropdown (Basic, Standard, Premium)
   - **Estimated Duration**: Select from dropdown (Less than 1 month, 1-3 months, etc.)
   - **Project Location**: Text input for project location
   - **Additional Notes**: Any additional project information (optional)

2. Click "Calculate Cost Estimate" to generate the AI-powered estimate

### Viewing Results
The results will display:
- Total estimated cost range
- Breakdown of costs (materials, labor, overhead, miscellaneous)
- Explanation of the estimate

### Downloading PDF
Click the "Download PDF" button to save the cost estimate as a PDF document.

### Starting Over
Click "New Estimate" to reset the form and enter new project details.

## Technical Implementation

### API Route
The cost estimation is powered by an API route at `/api/cost-estimator` which uses Google's Gemini AI to generate estimates.

### Components
- `CostPlannerForm`: The main form component
- `CostEstimateResult`: Displays the results and handles PDF generation

### Dependencies
- `jspdf`: For PDF generation
- `jspdf-autotable`: For creating tables in PDFs

## Customization
To modify the cost estimation logic, update the system instruction in `/app/api/cost-estimator/route.ts`.