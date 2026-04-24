import { useLocation, useNavigate, useParams } from "react-router";
import { ComponentType } from "react";

export interface WithRouterProps {
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
  params: ReturnType<typeof useParams>;
}

export function withRouter<P extends object>(
  Component: ComponentType<P & WithRouterProps>
) {
  return function ComponentWithRouterProp(props: P) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    
    return (
      <Component
        {...props}
        location={location}
        navigate={navigate}
        params={params}
      />
    );
  };
}
