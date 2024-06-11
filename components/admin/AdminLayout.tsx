import Navigation from "./Navigation";

interface AdminLayoutProps {
    page: AdminPage;
    children: React.ReactNode;
};

export default function AdminLayout({ page, children }: AdminLayoutProps) {
    return (
        <div className="w-screen flex flex-row h-screen">
            <Navigation page={page} />
            {children}
        </div>
    )
}