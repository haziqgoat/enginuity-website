"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, RotateCcw } from "lucide-react";
// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";

interface CostEstimateResultProps {
  estimate: {
    totalCostRange: {
      min: number;
      max: number;
      currency: string;
    };
    breakdown: {
      materials: number;
      labor: number;
      overhead: number;
      miscellaneous: number;
    };
    explanation: string;
  };
  projectDetails: {
    projectGoal: string;
    projectSize: string;
    materialsQuality: string;
    estimatedDuration: string;
    projectLocation: string;
    additionalNotes?: string;
  };
  onReset: () => void;
}

export function CostEstimateResult({ estimate, projectDetails, onReset }: CostEstimateResultProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(22);
      doc.text("HNZ Consult - Project Cost Estimate", 105, 20, { align: "center" });
      
      // Add project details
      doc.setFontSize(12);
      doc.text("Project Details", 20, 40);
      
      const projectDetailsBody = [
        ['Project Goal', projectDetails.projectGoal],
        ['Project Size', projectDetails.projectSize],
        ['Materials Quality', projectDetails.materialsQuality],
        ['Estimated Duration', projectDetails.estimatedDuration],
        ['Project Location', projectDetails.projectLocation],
      ];
      
      // Add additional notes if provided
      if (projectDetails.additionalNotes) {
        projectDetailsBody.push(['Additional Notes', projectDetails.additionalNotes]);
      } else {
        projectDetailsBody.push(['Additional Notes', 'None provided']);
      }
      
      autoTable(doc, {
        startY: 45,
        head: [['Field', 'Value']],
        body: projectDetailsBody,
      });
      
      // Add cost estimate
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      
      doc.text("Cost Estimate", 20, finalY + 15);
      
      autoTable(doc, {
        startY: finalY + 20,
        head: [['Category', 'Amount (RM)']],
        body: [
          ['Materials', estimate.breakdown.materials.toString()],
          ['Labor', estimate.breakdown.labor.toString()],
          ['Overhead', estimate.breakdown.overhead.toString()],
          ['Miscellaneous', estimate.breakdown.miscellaneous.toString()],
          ['Total (Min)', estimate.totalCostRange.min.toString()],
          ['Total (Max)', estimate.totalCostRange.max.toString()]
        ],
      });
      
      // Add explanation
      const finalY2 = (doc as any).lastAutoTable.finalY || finalY + 100;
      doc.text("Explanation", 20, finalY2 + 15);
      doc.setFontSize(10);
      doc.text(estimate.explanation, 20, finalY2 + 25, { maxWidth: 170 });
      
      // Save the PDF
      doc.save("cost-estimate.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Cost Estimate Results</CardTitle>
              <Badge variant="secondary" className="text-xs">
                BETA
              </Badge>
            </div>
            <CardDescription>
              Detailed cost breakdown for your project
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={generatePDF} disabled={isGeneratingPDF} variant="outline">
              {isGeneratingPDF ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
            <Button onClick={onReset} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        <div className="pt-2">
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
            <p className="text-sm text-orange-800">
              <span className="font-medium">Beta Notice:</span> This tool is currently in beta testing. 
              Estimates are AI-generated and should be used as a reference only. Actual costs may vary.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Project Details Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Project Goal</p>
              <p className="font-medium">{projectDetails.projectGoal}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Project Size</p>
              <p className="font-medium">{projectDetails.projectSize}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Materials Quality</p>
              <p className="font-medium">{projectDetails.materialsQuality}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Duration</p>
              <p className="font-medium">{projectDetails.estimatedDuration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Project Location</p>
              <p className="font-medium">{projectDetails.projectLocation}</p>
            </div>
            {projectDetails.additionalNotes && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Additional Notes</p>
                <p className="font-medium">{projectDetails.additionalNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cost Estimate */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Cost Estimate</h3>
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Estimated Total Cost Range</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(estimate.totalCostRange.min)} - {formatCurrency(estimate.totalCostRange.max)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Malaysian Ringgit (RM)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-lg border text-center">
                <p className="text-sm text-muted-foreground">Materials</p>
                <p className="font-semibold text-lg">{formatCurrency(estimate.breakdown.materials)}</p>
              </div>
              <div className="bg-background p-4 rounded-lg border text-center">
                <p className="text-sm text-muted-foreground">Labor</p>
                <p className="font-semibold text-lg">{formatCurrency(estimate.breakdown.labor)}</p>
              </div>
              <div className="bg-background p-4 rounded-lg border text-center">
                <p className="text-sm text-muted-foreground">Overhead</p>
                <p className="font-semibold text-lg">{formatCurrency(estimate.breakdown.overhead)}</p>
              </div>
              <div className="bg-background p-4 rounded-lg border text-center">
                <p className="text-sm text-muted-foreground">Miscellaneous</p>
                <p className="font-semibold text-lg">{formatCurrency(estimate.breakdown.miscellaneous)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Explanation</h3>
          <div className="p-6 bg-background rounded-lg border">
            <p className="text-muted-foreground">{estimate.explanation}</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            This estimate is generated by AI and should be used as a reference only. 
            Actual costs may vary based on specific project requirements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}