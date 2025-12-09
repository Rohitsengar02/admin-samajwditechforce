import Gallery1 from './Gallery1';
import Gallery2 from './Gallery2';

export const GALLERY_COMPONENTS: any = {
    1: Gallery1,
    2: Gallery2,
};

export const GALLERY_TEMPLATES = [
    {
        id: 1,
        name: 'Simple Grid',
        description: 'Clean minimal grid layout',
        preview: 'Standard grid with rounded corners',
        defaults: {
            images: [
                { url: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=400', title: 'Project One', description: 'Modern workspace' },
                { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', title: 'Project Two', description: 'Tech innovation' },
                { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', title: 'Project Three', description: 'Digital solutions' },
                { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', title: 'Project Four', description: 'Team collaboration' },
            ],
            layout: 'grid',
            autoScroll: false,
            scrollSpeed: 3000,
            columns: 2,
            spacing: 12,
        }
    },
    {
        id: 2,
        name: 'Card Gallery',
        description: 'Elevated cards with shadows',
        preview: 'Professional card design',
        defaults: {
            images: [
                { url: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=400', title: 'Innovation Hub', description: 'Creating the future' },
                { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', title: 'Tech Summit', description: 'Leading solutions' },
                { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', title: 'Digital Era', description: 'Transform digitally' },
                { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', title: 'Team Success', description: 'Together we grow' },
            ],
            layout: 'grid',
            autoScroll: false,
            scrollSpeed: 3000,
            columns: 3,
            spacing: 16,
        }
    },
];

export default GALLERY_COMPONENTS;
