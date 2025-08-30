import { useLocation, Link } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/issue-batch': 'Issue Batch',
  '/my-batches': 'My Batches',
  '/marketplace': 'Marketplace',
  '/approvals': 'Pending Approvals',
  '/approved-batches': 'Approved Batches',
  '/certificates': 'Certificates',
  '/compliance': 'Compliance Overview',
  '/audit-trail': 'Audit Trail',
  '/portfolio': 'My Portfolio',
  '/retire': 'Retire Credits',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbItems = [
    { name: 'Home', href: '/', current: pathnames.length === 0 }
  ];

  // Build breadcrumb items based on current path
  if (pathnames.length > 0) {
    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      const isLast = index === pathnames.length - 1;
      
      breadcrumbItems.push({
        name: pageTitles[currentPath] || name.charAt(0).toUpperCase() + name.slice(1),
        href: currentPath,
        current: isLast
      });
    });
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href}>
            {index > 0 && (
              <svg
                className="h-5 w-5 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.current ? (
              <span className="text-sm font-medium text-gray-900" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

