import { UseFormReturn } from 'react-hook-form'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { ExternalLink } from 'lucide-react'
import { CheckoutFormValues } from '@/pages/Checkout'

interface TermsAgreementProps {
    form: UseFormReturn<CheckoutFormValues>
    isAllAgreed: boolean | undefined
    onAllAgree: (checked: boolean | 'indeterminate') => void
}

export function TermsAgreement({ form, isAllAgreed, onAllAgree }: TermsAgreementProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">약관 동의</h3>

            {/* 전체 동의 */}
            <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                <Checkbox
                    id="allAgree"
                    checked={isAllAgreed}
                    onCheckedChange={onAllAgree}
                />
                <label
                    htmlFor="allAgree"
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                    전체 동의
                </label>
            </div>

            {/* 개별 약관 동의 */}
            <div className="space-y-3 pl-2">
                <FormField
                    control={form.control}
                    name="termsAgreed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="flex-1 space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                    [필수] 이용약관 동의
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        보기
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="privacyAgreed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="flex-1 space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                    [필수] 개인정보처리방침 동의
                                    <a
                                        href="/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        보기
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="refundAgreed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="flex-1 space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                    [필수] 환불정책 동의
                                    <a
                                        href="/refund-policy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        보기
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="electronicFinanceAgreed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="flex-1 space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                    [필수] 전자금융거래약관 동의
                                    <a
                                        href="/electronic-finance-terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        보기
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="digitalServiceWithdrawalAgreed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="flex-1 space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                    [필수] 디지털 서비스 청약철회 제한 동의
                                    <a
                                        href="/refund-policy#digital-services"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        보기
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </FormLabel>
                                <FormDescription className="text-xs text-muted-foreground">
                                    디지털 콘텐츠는 다운로드/실행 시점부터 청약철회가 제한됩니다. 무료 체험판을 먼저 이용하시기 바랍니다.
                                </FormDescription>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
