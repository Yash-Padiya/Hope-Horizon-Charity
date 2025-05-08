import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; 
const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <div className="text-6xl font-bold  mb-4">404</div>
      <div className="text-lg  mb-6">Oops! The page you're looking for doesn't exist.</div>
      
      <Link to="/">
        <Button variant="default" className=" px-6 py-3 rounded-md">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
