import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src', 'pages');
const appDir = path.join(process.cwd(), 'src', 'app');

if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

const pageMapping: Record<string, string> = {
  'Home.tsx': 'page.tsx',
  'Login.tsx': 'login/page.tsx',
  'SignUp.tsx': 'signup/page.tsx',
  'Dashboard.tsx': 'dashboard/page.tsx',
  'Book.tsx': 'book/page.tsx',
  'Admin.tsx': 'admin/page.tsx',
  'AdminSpaces.tsx': 'admin/spaces/page.tsx',
  'AdminBookings.tsx': 'admin/bookings/page.tsx',
  'AdminMembers.tsx': 'admin/members/page.tsx',
  'AdminReports.tsx': 'admin/reports/page.tsx',
  'AdminSettings.tsx': 'admin/settings/page.tsx',
  'UserMembership.tsx': 'membership/page.tsx',
  'UserSpaces.tsx': 'spaces/page.tsx',
  'UserMembers.tsx': 'members/page.tsx',
  'UserInvoices.tsx': 'invoices/page.tsx',
  'UserSettings.tsx': 'settings/page.tsx',
};

function processFileContent(content: string): string {
  let newContent = content;
  
  // Add 'use client' if it has hooks or event handlers
  if (newContent.includes('useNavigate') || newContent.includes('useLocation') || newContent.includes('useState') || newContent.includes('useEffect') || newContent.includes('onClick') || newContent.includes('onSubmit')) {
    newContent = `'use client';\n\n` + newContent;
  }

  // Replace react-router-dom imports
  newContent = newContent.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];/g, (match, imports) => {
    let result = '';
    if (imports.includes('Link')) {
      result += `import Link from 'next/link';\n`;
    }
    
    let navImports = [];
    if (imports.includes('useNavigate')) navImports.push('useRouter');
    if (imports.includes('useLocation')) navImports.push('usePathname');
    
    if (navImports.length > 0) {
      result += `import { ${navImports.join(', ')} } from 'next/navigation';\n`;
    }
    return result;
  });

  // Replace <Link to="..."> with <Link href="...">
  newContent = newContent.replace(/<Link([^>]+)to=/g, '<Link$1href=');

  // Replace useNavigate with useRouter
  newContent = newContent.replace(/const\s+(\w+)\s*=\s*useNavigate\(\)/g, 'const $1 = useRouter()');
  // Replace navigate('/path') with router.push('/path')
  // We assume the variable is named 'navigate'
  newContent = newContent.replace(/navigate\(/g, 'navigate.push(');

  // Replace useLocation with usePathname
  newContent = newContent.replace(/const\s+(\w+)\s*=\s*useLocation\(\)/g, 'const $1 = usePathname()');
  // Replace location.pathname with pathname
  // We assume the variable is named 'location'
  newContent = newContent.replace(/location\.pathname/g, 'location');

  return newContent;
}

// Process pages
for (const [oldFile, newPath] of Object.entries(pageMapping)) {
  const oldFilePath = path.join(pagesDir, oldFile);
  if (fs.existsSync(oldFilePath)) {
    const content = fs.readFileSync(oldFilePath, 'utf-8');
    const newContent = processFileContent(content);
    
    const newFilePath = path.join(appDir, newPath);
    fs.mkdirSync(path.dirname(newFilePath), { recursive: true });
    fs.writeFileSync(newFilePath, newContent);
    console.log(`Converted ${oldFile} to ${newPath}`);
  }
}

// Process layouts
const componentsDir = path.join(process.cwd(), 'src', 'components');
const layoutFiles = ['Layout.tsx', 'DashboardLayout.tsx'];

for (const file of layoutFiles) {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = processFileContent(content);
    
    // Replace <Outlet /> with {children}
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];/g, (match, imports) => {
      // already processed by processFileContent, but Outlet might be left if we didn't handle it
      return match;
    });
    
    // Actually processFileContent removes the whole import if it only had Link/useNavigate. 
    // Let's do a custom replace for Outlet
    content = content.replace(/import\s+\{([^}]*Outlet[^}]*)\}\s+from\s+['"]react-router-dom['"];/g, '');
    content = content.replace(/<Outlet\s*\/>/g, '{children}');
    
    // Add children to props
    content = content.replace(/export default function (\w+)\(\)\s*\{/, 'export default function $1({ children }: { children: React.ReactNode }) {');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}

console.log('Done converting files!');
