import CategoryPage from '../../../components/CategoryPage';

export default function LogsPage() {
    return (
        <CategoryPage
            category="log"
            title="Download Logs"
            subtitle="Track resource downloads"
            gradientColors={['#3b82f6', '#2563eb']}
        />
    );
}
