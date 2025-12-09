import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ImageItem {
    url: string;
    title?: string;
    description?: string;
}

interface Gallery1Props {
    images?: ImageItem[];
    layout?: 'grid' | 'carousel';
    autoScroll?: boolean;
    scrollSpeed?: number;
    columns?: number;
    spacing?: number;
    viewport?: 'mobile' | 'desktop';
}

export default function Gallery1({
    images = [
        { url: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=400', title: 'Project One', description: 'Modern workspace' },
        { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', title: 'Project Two', description: 'Tech innovation' },
        { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', title: 'Project Three', description: 'Digital solutions' },
        { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', title: 'Project Four', description: 'Team collaboration' },
    ],
    layout = 'grid',
    autoScroll = false,
    scrollSpeed = 3000,
    columns = 2,
    spacing = 12,
    viewport
}: Gallery1Props) {
    const isMobile = viewport ? viewport === 'mobile' : screenWidth < 768;
    const scrollViewRef = React.useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Auto-scroll for carousel
    React.useEffect(() => {
        if (layout === 'carousel' && autoScroll && images.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
                scrollViewRef.current?.scrollTo({
                    x: ((currentIndex + 1) % images.length) * (screenWidth - 48),
                    animated: true,
                });
            }, scrollSpeed);
            return () => clearInterval(interval);
        }
    }, [layout, autoScroll, scrollSpeed, currentIndex, images.length]);

    if (layout === 'carousel') {
        // On mobile, limit cards per slide to max 2 to ensure they are viewable
        const cardsPerSlide = isMobile ? Math.min(columns || 1, 2) : (columns || 1);
        const totalSlides = Math.ceil(images.length / cardsPerSlide);

        return (
            <View style={{ padding: isMobile ? 16 : 24 }}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={!autoScroll}
                >
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                        const startIdx = slideIndex * cardsPerSlide;
                        const slideImages = images.slice(startIdx, startIdx + cardsPerSlide);

                        return (
                            <View
                                key={slideIndex}
                                style={{
                                    width: screenWidth - (isMobile ? 32 : 48),
                                    marginRight: spacing,
                                    flexDirection: 'row',
                                    gap: spacing,
                                }}
                            >
                                {slideImages.map((item, cardIndex) => (
                                    <View
                                        key={startIdx + cardIndex}
                                        style={{
                                            flex: 1,
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item.url }}
                                            style={{
                                                width: '100%',
                                                height: isMobile ? 250 : 400,
                                                borderRadius: 16,
                                            }}
                                            resizeMode="cover"
                                        />
                                        {/* Conditional Title and Description */}
                                        {(item.title || item.description) && (
                                            <View style={{ paddingTop: 12 }}>
                                                {item.title && item.title.trim() && (
                                                    <Text style={{
                                                        fontSize: isMobile ? 16 : 18,
                                                        fontWeight: '600',
                                                        color: '#111827',
                                                        marginBottom: 4,
                                                    }}>
                                                        {item.title}
                                                    </Text>
                                                )}
                                                {item.description && item.description.trim() && (
                                                    <Text style={{
                                                        fontSize: isMobile ? 13 : 14,
                                                        color: '#6b7280',
                                                        lineHeight: isMobile ? 18 : 20,
                                                    }}>
                                                        {item.description}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Carousel Indicators */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 8 }}>
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: currentIndex === index ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: currentIndex === index ? '#6366f1' : '#d1d5db',
                            }}
                        />
                    ))}
                </View>
            </View>
        );
    }

    // Grid Layout
    const effectiveColumns = isMobile ? Math.min(columns, 2) : columns;

    return (
        <View style={{ padding: isMobile ? 16 : 24 }}>
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: spacing,
                }}
            >
                {images.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            width: `${(100 / effectiveColumns) - (spacing * (effectiveColumns - 1)) / effectiveColumns}%`,
                        }}
                    >
                        <Image
                            source={{ uri: item.url }}
                            style={{
                                width: '100%',
                                height: isMobile ? 150 : 250,
                                borderRadius: 12,
                            }}
                            resizeMode="cover"
                        />
                        {/* Conditional Title and Description */}
                        {(item.title || item.description) && (
                            <View style={{ paddingTop: 8 }}>
                                {item.title && item.title.trim() && (
                                    <Text style={{
                                        fontSize: isMobile ? 14 : 16,
                                        fontWeight: '600',
                                        color: '#111827',
                                        marginBottom: 4,
                                    }}>
                                        {item.title}
                                    </Text>
                                )}
                                {item.description && item.description.trim() && (
                                    <Text style={{
                                        fontSize: isMobile ? 12 : 13,
                                        color: '#6b7280',
                                        lineHeight: isMobile ? 16 : 18,
                                    }}>
                                        {item.description}
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}
