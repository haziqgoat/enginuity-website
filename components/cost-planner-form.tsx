"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CostEstimateResult } from "@/components/cost-estimate-result";

// Updated schema with budget range removed
const costPlannerFormSchema = z.object({
  projectGoal: z.string().min(1, "Project goal is required"),
  projectSize: z.string().min(1, "Project size is required"),
  materialsQuality: z.string().min(1, "Materials quality is required"),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
  projectLocation: z.string().min(1, "Project location is required"),
  additionalNotes: z.string().optional(),
});

type CostPlannerFormValues = z.infer<typeof costPlannerFormSchema>;

// Options for the dropdown fields
const projectGoals = [
  "Home renovation",
  "New building",
  "Interior design",
  "Office setup",
  "Maintenance or repair",
  "Consultation only"
];

const projectSizes = [
  "Small (room / shop lot)",
  "Medium (house / office floor)",
  "Large (building / warehouse)"
];

const materialsQualities = [
  "Basic",
  "Standard",
  "Premium"
];

const estimatedDurations = [
  "Less than 1 month",
  "1–3 months",
  "3–6 months",
  "More than 6 months"
];

export function CostPlannerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const form = useForm<CostPlannerFormValues>({
    resolver: zodResolver(costPlannerFormSchema),
    defaultValues: {
      projectGoal: "",
      projectSize: "",
      materialsQuality: "",
      estimatedDuration: "",
      projectLocation: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: CostPlannerFormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/cost-estimator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to get cost estimate");
      }

      const result = await response.json();
      setEstimateResult(result);
      setShowResult(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setShowResult(false);
    setEstimateResult(null);
  };

  if (showResult && estimateResult) {
    return (
      <CostEstimateResult 
        estimate={estimateResult} 
        onReset={handleReset}
        projectDetails={form.getValues()}
      />
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle>Project Cost Estimator</CardTitle>
            <Badge variant="secondary" className="text-xs">
              BETA
            </Badge>
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
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Goal */}
            <FormField
              control={form.control}
              name="projectGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectGoals.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the closest option if unsure</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Project Size */}
            <FormField
              control={form.control}
              name="projectSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the closest option if unsure</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Materials Quality */}
            <FormField
              control={form.control}
              name="materialsQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Materials Quality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select materials quality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {materialsQualities.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the closest option if unsure</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Estimated Duration */}
            <FormField
              control={form.control}
              name="estimatedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select estimated duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estimatedDurations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the closest option if unsure</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Project Location */}
            <FormField
              control={form.control}
              name="projectLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project location" {...field} />
                  </FormControl>
                  <FormDescription>Enter the city or area where the project will be located</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional information about the project (optional)"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Include any special requirements or details about your project</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Calculate Cost Estimate
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}