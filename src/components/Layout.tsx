import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const items = [
        {
            title: "Radix Sort",
            url: "/",
        },
        {
            title: "Comparison Sort",
            url: "/comparison",
        },
    ];

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Sort Visualizer
                        </Link>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-6">
                            {items.map((item) => (
                                <Link
                                    key={item.title}
                                    to={item.url}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        location.pathname === item.url
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="flex flex-col space-y-4 mt-6">
                                    {items.map((item) => (
                                        <Link
                                            key={item.title}
                                            to={item.url}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "text-sm font-medium transition-colors hover:text-primary",
                                                location.pathname === item.url
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto pt-2 pb-6 px-4 md:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};
