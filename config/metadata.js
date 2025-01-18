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
        title: 'Hi, I\'m Khe Hy. Follow my AI experiments.',
        description: 'Follow Khe Hy\'s AI experiments.'
    },
    about: {
        title: 'About Khe Hy',
        description: 'Learn more about Khe Hy'
    },
    contact: {
        title: 'Contact Khe Hy',
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