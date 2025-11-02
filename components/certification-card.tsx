import { Calendar, Award } from "lucide-react";

interface CertificationCardProps {
  title: string;
  issuer: string;
  description: string;
  validUntil?: string;
  icon?: React.ReactNode;
}

export function CertificationCard({ 
  title, 
  issuer, 
  description, 
  validUntil,
  icon 
}: CertificationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
            {icon ? (
              <div className="h-10 w-10 flex items-center justify-center">
                {icon}
              </div>
            ) : (
              <Award className="h-10 w-10 text-orange-600" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600">{issuer}</p>
          </div>
        </div>
        <p className="mt-4 text-gray-600">
          {description}
        </p>
        {validUntil && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Valid Until: {validUntil}</span>
          </div>
        )}
      </div>
    </div>
  );
}