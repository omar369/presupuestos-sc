'use client'

import * as React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type AlertState = {
    open: boolean
    title: string
    description: string
}

export function useAlert() {
    const [alert, setAlert] = React.useState<AlertState>({
        open: false,
        title: '',
        description: '',
    })

    const showAlert = React.useCallback((title: string, description: string) => {
        setAlert({ open: true, title, description })
    }, [])

    const hideAlert = React.useCallback(() => {
        setAlert(prev => ({ ...prev, open: false }))
    }, [])

    const AlertComponent = React.useMemo(
        () => (
            <AlertDialog open={alert.open} onOpenChange={hideAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alert.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alert.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={hideAlert}>Aceptar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        ),
        [alert, hideAlert]
    )

    return { showAlert, AlertComponent }
}
