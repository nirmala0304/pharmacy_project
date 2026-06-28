package com.pharmacy.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartDTO {
    private Long cartId;
    private List<CartItemDTO> items;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal grandTotal;
    private String appliedCouponCode;
    private String couponMessage;

    public static class CartItemDTO {
        private Long cartItemId;
        private Long medicineId;
        private String medicineName;
        private String medicineBrand;
        private BigDecimal unitPrice;
        private Integer quantity;
        private boolean requiresPrescription;
        private Long prescriptionId;
        private String prescriptionStatus;

        public Long getCartItemId() { return cartItemId; }
        public void setCartItemId(Long cartItemId) { this.cartItemId = cartItemId; }

        public Long getMedicineId() { return medicineId; }
        public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }

        public String getMedicineName() { return medicineName; }
        public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

        public String getMedicineBrand() { return medicineBrand; }
        public void setMedicineBrand(String medicineBrand) { this.medicineBrand = medicineBrand; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public boolean isRequiresPrescription() { return requiresPrescription; }
        public void setRequiresPrescription(boolean requiresPrescription) { this.requiresPrescription = requiresPrescription; }

        public Long getPrescriptionId() { return prescriptionId; }
        public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

        public String getPrescriptionStatus() { return prescriptionStatus; }
        public void setPrescriptionStatus(String prescriptionStatus) { this.prescriptionStatus = prescriptionStatus; }
    }

    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }

    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public String getAppliedCouponCode() { return appliedCouponCode; }
    public void setAppliedCouponCode(String appliedCouponCode) { this.appliedCouponCode = appliedCouponCode; }

    public String getCouponMessage() { return couponMessage; }
    public void setCouponMessage(String couponMessage) { this.couponMessage = couponMessage; }
}
