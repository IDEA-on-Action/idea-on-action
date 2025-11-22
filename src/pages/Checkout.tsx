/**
 * Checkout Page
 *
 * 주문 생성 페이지 (장바구니 → 주문 전환)
 */

import { Helmet } from 'react-helmet-async'
import DaumPostcode from 'react-daum-postcode'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { TermsAgreement } from '@/components/checkout/TermsAgreement'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { useCheckout, CheckoutFormValues } from '@/components/checkout/useCheckout'

export type { CheckoutFormValues }

export default function Checkout() {
  const {
    form,
    user,
    cart,
    isCartLoading,
    isCreatingOrder,
    serviceItems,
    isPostcodeOpen,
    setIsPostcodeOpen,
    handlePostcodeComplete,
    handleAllAgree,
    isAllAgreed,
    subtotal,
    tax,
    total,
    isEmpty,
    onSubmit,
    navigate
  } = useCheckout()

  // 로그인 체크
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>주문하려면 로그인이 필요합니다.</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/login')} className="mt-4">
            로그인하기
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  // 장바구니 비어있음
  if (!isCartLoading && isEmpty) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Helmet>
          <title>주문하기 - IDEA on Action</title>
        </Helmet>
        <Header />
        <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>장바구니가 비어있습니다.</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/services')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            서비스 보러가기
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>주문하기 - IDEA on Action</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Header />

        <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              뒤로가기
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 주문 폼 */}
            <div className="lg:col-span-2 space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <CheckoutForm form={form} onPostcodeOpen={() => setIsPostcodeOpen(true)} />
                  <TermsAgreement
                    form={form}
                    isAllAgreed={isAllAgreed}
                    onAllAgree={handleAllAgree}
                  />
                </form>
              </Form>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <OrderSummary
                cart={cart}
                serviceItems={serviceItems}
                subtotal={subtotal}
                tax={tax}
                total={total}
                isCreatingOrder={isCreatingOrder}
                isAllAgreed={isAllAgreed}
                onSubmit={form.handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </main>

        <Footer />

        {/* 우편번호 검색 Dialog */}
        <Dialog open={isPostcodeOpen} onOpenChange={setIsPostcodeOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>우편번호 검색</DialogTitle>
            </DialogHeader>
            <DaumPostcode onComplete={handlePostcodeComplete} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
