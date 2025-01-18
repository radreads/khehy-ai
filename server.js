const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const marked = require('marked');
const matter = require('gray-matter');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { defaultMetadata, pageMetadata, baseUrl } = require('./config/metadata');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as templating engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Blog functionality
async function getBlogPosts() {
    const blogDir = path.join(__dirname, 'content', 'blog');
    console.log('Reading blog directory:', blogDir);
    
    try {
        const files = await fs.readdir(blogDir);
        console.log('Found files:', files);
        
        const posts = await Promise.all(
            files.filter(file => file.endsWith('.md')).map(async file => {
                const filePath = path.join(blogDir, file);
                console.log('Reading file:', filePath);
                const content = await fs.readFile(filePath, 'utf-8');
                const { data, content: markdownContent } = matter(content);
                return {
                    ...data,
                    slug: file.replace('.md', ''),
                    content: marked.parse(markdownContent)
                };
            })
        );
        
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error in getBlogPosts:', error);
        throw error;
    }
}

// Routes
app.get('/', (req, res) => {
    const metadata = {
        ...defaultMetadata,
        ...pageMetadata.home,
        currentUrl: `${baseUrl}/`
    };
    res.render('index', { metadata });
});

app.get('/about', (req, res) => {
    try {
        const metadata = {
            ...defaultMetadata,
            ...pageMetadata.about,
            currentUrl: `${baseUrl}/about`
        };
        res.render('about', { metadata });
    } catch (error) {
        console.error('Error rendering about:', error);
        res.status(500).send('Error rendering page');
    }
});

app.get('/contact', (req, res) => {
    const metadata = {
        ...defaultMetadata,
        ...pageMetadata.contact,
        currentUrl: `${baseUrl}/contact`
    };
    res.render('contact', { metadata });
});

// Blog routes
app.get('/blog', async (req, res) => {
    try {
        const posts = await getBlogPosts();
        const metadata = {
            ...defaultMetadata,
            ...pageMetadata.blog,
            currentUrl: `${baseUrl}/blog`
        };
        res.render('blog', { posts, metadata });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        res.status(500).send('Error loading blog posts');
    }
});

app.get('/blog/:slug', async (req, res) => {
    try {
        const posts = await getBlogPosts();
        const post = posts.find(p => p.slug === req.params.slug);
        
        if (!post) {
            return res.status(404).send('Post not found');
        }
        
        const metadata = {
            ...defaultMetadata,
            title: post.title,
            description: post.description,
            type: 'article',
            currentUrl: `${baseUrl}/blog/${post.slug}`,
            author: post.author || defaultMetadata.author,
            date: post.date
        };
        
        res.render('blog-post', { post, metadata });
    } catch (error) {
        console.error('Error loading blog post:', error);
        res.status(500).send('Error loading blog post');
    }
});

// ConvertKit subscription endpoint
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    const apiUrl = `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`;
    
    try {
        console.log('Attempting to subscribe:', email);
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_key: process.env.CONVERTKIT_API_KEY,
                email: email,
                first_name: '' // Optional but good to include
            })
        });

        const data = await response.json();
        console.log('ConvertKit API Response:', data);
        
        if (response.ok) {
            res.json({ success: true, message: 'Successfully subscribed!' });
        } else {
            console.error('Subscription failed:', data);
            res.status(400).json({ 
                success: false, 
                message: 'Subscription failed: ' + (data.message || 'Unknown error')
            });
        }
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Only listen when not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// Export for Vercel
module.exports = app; 