# khehy-ai

## Site Architecture

This site uses EJS (Embedded JavaScript) as its template engine, allowing for HTML with embedded JavaScript, reusable components (partials), and server-side data passing.

### File Structure

### Key Components

1. **Template System**
   - EJS for server-side rendering
   - Partials for reusable components (header, nav, footer)
   - Clean separation of concerns

2. **CSS Architecture**
   - Class-based styling system
   - Semantic naming conventions
   - Container-based layout structure

3. **Content Structure**
   - Semantic HTML5 elements
   - Clear content hierarchy
   - Accessible markup patterns

### Server Setup
The site runs on Express.js with EJS as the view engine. Static assets are served from the public directory.

### Best Practices
- Separation of concerns through partials
- Semantic HTML for accessibility
- Modular component structure
- Server-side rendering for performance
- Clean, maintainable code architecture

### Development
To run the site locally:
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Visit `http://localhost:3000`
