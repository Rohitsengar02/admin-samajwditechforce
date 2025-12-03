import CategoryPage from '../../../components/CategoryPage';

export default function PostersPage() {
    return (
        <CategoryPage
            category="poster"
            title="Posters"
            subtitle="Campaign graphics & posters"
            gradientColors={['#6366f1', '#8b5cf6']}
        />
    );
}
