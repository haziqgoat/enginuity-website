import { CostPlannerForm } from "@/components/cost-planner-form";
import { AuthRequired } from "@/components/auth-required"; // Added import

export default function CostPlannerPage() {
  return (
    <AuthRequired>
      <div className="container mx-auto py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">AI Cost Planner</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get an instant cost estimate for your engineering project by providing key details below.
          </p>
        </div>
        <CostPlannerForm />
      </div>
    </AuthRequired>
  );
}