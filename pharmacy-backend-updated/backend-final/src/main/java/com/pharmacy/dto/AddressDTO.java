package com.pharmacy.dto;

public class AddressDTO {
    private Long id;
    private String fullName;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String phone;
    private boolean isDefault;
    private Double latitude;
    private Double longitude;

    public AddressDTO() {}

    public AddressDTO(Long id, String fullName, String street, String city, String state, String zipCode, String country, String phone, boolean isDefault) {
        this.id = id;
        this.fullName = fullName;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
        this.phone = phone;
        this.isDefault = isDefault;
    }

    public AddressDTO(Long id, String fullName, String street, String city, String state, String zipCode, String country, String phone, boolean isDefault, Double latitude, Double longitude) {
        this(id, fullName, street, city, state, zipCode, country, phone, isDefault);
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }

    // Alias for JSON serialization (frontend expects "default" property)
    public boolean getDefault() { return isDefault; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
