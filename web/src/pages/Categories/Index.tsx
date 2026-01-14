import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Plus, Tag, Utensils, type LucideIcon } from "lucide-react";
import { CreateCategoryDialog } from "./components/CreateCategoryDialog"
import { useState } from "react";
import { useQuery } from "@apollo/client/react"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories";
import type { Category } from "@/types";
import { SummaryCard } from "./components/SummaryCard";
import { CategoryCard } from "./components/CategoryCard";
import { colorMap, iconMap } from "@/lib/utils";


export function Categories() {

    const [openDialog, setOpenDioalog] = useState(false);
    const { data, loading, refetch } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES);
    const categories = data?.listCategories || [];

    console.log(categories);

    const totalTransactions = categories.reduce((acc, cat) => acc + (cat.countTransactions || 0), 0);
    const mostUsed = [...categories].sort((a, b) => (b.countTransactions || 0) - (a.countTransactions || 0))[0];

    const MostUsedIcon = (mostUsed ? iconMap[mostUsed.icon] : Tag) as LucideIcon;
    const mostUsedColors = mostUsed ? colorMap[mostUsed.color] : { icon: "#6366f1", background: "#f5f3ff" };

    return (
        <Page>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <Label className="text-3xl font-medium">
                            Categorias
                        </Label>
                        <Label className="text-sm text-muted-foreground">
                            Organize suas transações por categorias
                        </Label>
                    </div>
                    <div>
                        <Button
                            onClick={() => { setOpenDioalog(true) }}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4" />
                            Nova categoria
                        </Button>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <SummaryCard title="Total de Categorias" value={categories.length}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg text-gray-700">
                            <Tag className="h-6 w-6" />
                        </div>
                    </SummaryCard>
                    <SummaryCard title="Total de Transações" value={totalTransactions}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg"
                            style={{
                                color: colorMap['purple'].icon
                            }}>
                            <ArrowUpDown className="h-6 w-6" />
                        </div>
                    </SummaryCard>
                    <SummaryCard
                        title="Categoria mais utilizada"
                        value={mostUsed?.title || "N/A"}
                    >
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-lg"
                            style={{
                                color: mostUsedColors.icon
                            }}
                        >
                            <MostUsedIcon className="h-6 w-6" />
                        </div>
                    </SummaryCard>
                </div>
                <div className="pr-2 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                title={category.title}
                                description={category.description}
                                iconName={category.icon}
                                colorName={category.color}
                                count={category.countTransactions || 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <CreateCategoryDialog open={openDialog} onOpenChange={setOpenDioalog} />
        </Page>
    )
}