import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AccountActionsProps {
    onSignOut: () => void
}

export function AccountActions({ onSignOut }: AccountActionsProps) {
    const navigate = useNavigate()

    return (
        <Card>
            <CardHeader>
                <CardTitle>계정 관리</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => navigate('/orders')}>
                    내 주문 보기
                </Button>
                <Button variant="outline" onClick={onSignOut}>
                    로그아웃
                </Button>
            </CardContent>
        </Card>
    )
}
