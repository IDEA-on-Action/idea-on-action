import { UseFormReturn } from 'react-hook-form'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Search } from 'lucide-react'
import { CheckoutFormValues } from '@/pages/Checkout'

interface CheckoutFormProps {
    form: UseFormReturn<CheckoutFormValues>
    onPostcodeOpen: () => void
}

export function CheckoutForm({ form, onPostcodeOpen }: CheckoutFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>배송 정보</CardTitle>
                <CardDescription>상품을 받으실 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="shippingName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>받는 사람</FormLabel>
                                <FormControl>
                                    <Input placeholder="홍길동" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="shippingPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>받는 사람 연락처</FormLabel>
                                <FormControl>
                                    <Input placeholder="010-1234-5678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="postcode"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-3">
                                    <FormLabel>우편번호</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="12345" {...field} readOnly />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onPostcodeOpen}
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            검색
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>주소</FormLabel>
                                <FormControl>
                                    <Input placeholder="서울시 강남구 테헤란로 123" {...field} readOnly />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="addressDetail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>상세주소</FormLabel>
                                <FormControl>
                                    <Input placeholder="101동 202호" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="shippingNote"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>배송 요청사항</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="문 앞에 놓아주세요 (선택사항)"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>배송 시 요청사항을 입력해주세요</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">주문자 정보</h3>

                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>이메일</FormLabel>
                                    <FormControl>
                                        <Input placeholder="hong@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>연락처</FormLabel>
                                    <FormControl>
                                        <Input placeholder="010-1234-5678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
