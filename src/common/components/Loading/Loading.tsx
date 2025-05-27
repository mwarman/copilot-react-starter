import { cn } from "../../../common/utils/css";

export interface LoadingProps {
  className?: string;
  testId?: string;
}

/**
 * A loading spinner component used during lazy loading of routes.
 */
const Loading = ({ className, testId = "loading" }: LoadingProps): JSX.Element => {
  return (
    <div className={cn("flex justify-center items-center min-h-[50vh]", className)} data-testid={testId}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
};

export default Loading;
