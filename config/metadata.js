const baseUrl = process.env.BASE_URL || 'https://khehy.ai';

const defaultMetadata = {
    title: 'Khe Hy',
    description: 'Exploring productivity, wealth building, and living an examined life',
    type: 'website',
    image: '/images/social-card.jpg',  // Default social card
    twitterHandle: '@khemaridh',
    author: 'Khe Hy'
};

const pageMetadata = {
    home: {
        title: 'Home',
        description: 'Welcome to Khe Hy\'s digital garden'
    },
    about: {
        title: 'About',
        description: 'Learn more about Khe Hy'
    },
    contact: {
        title: 'Contact',
        description: 'Get in touch with Khe Hy'
    },
    blog: {
        title: 'Blog',
        description: 'Thoughts on productivity, wealth building, and living an examined life',
        type: 'website'
    }
};

module.exports = {
    baseUrl,
    defaultMetadata,
    pageMetadata
}; 