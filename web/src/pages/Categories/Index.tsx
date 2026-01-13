import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { CreateCategoryDialog } from "./components/CreateCategoryDialog"
import { useState } from "react";


export function Categories() {

    const [openDialog, setOpenDioalog] = useState(false);


    return (
        <Page>
            <div className="space-y-6">
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
            </div>
            <CreateCategoryDialog open={openDialog} onOpenChange={setOpenDioalog} />
        </Page>
    )
}