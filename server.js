const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const marked = require('marked');
const matter = require('gray-matter');
const app = express();
require('dotenv').config();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

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
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// Blog routes
app.get('/blog', async (req, res) => {
    try {
        const posts = await getBlogPosts();
        res.render('blog', { posts });
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
        
        res.render('blog-post', { post });
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}); 