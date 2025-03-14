
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, []);

  const handleBackClick = () => {
    // Navigate back rather than using a direct link
    // This preserves the authentication state
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6 math-card max-w-md">
        <h1 className="text-2xl font-bold mb-4">Coming soon!</h1>
        <p className="text-xl text-gray-600 mb-6">We'll let you know when this feature is ready</p>
        <Button 
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
