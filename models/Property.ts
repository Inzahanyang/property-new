import { PropertyCardProps } from "@/types";
import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema<PropertyCardProps>(
  {
    owner: {
      type: String,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    location: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipcode: { type: String, required: true, trim: true },
    },
    beds: {
      type: Number,
      required: true,
      min: 1,
    },
    baths: {
      type: Number,
      required: true,
      min: 1,
    },
    square_feet: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: [
      {
        type: String,
      },
    ],
    rates: {
      nightly: { type: Number, min: 0 },
      weekly: { type: Number, min: 0 },
      monthly: { type: Number, min: 0 },
    },
    seller_info: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
      },
      phone: {
        type: String,
        required: true,
        match: [
          /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          "Please enter a valid phone number",
        ],
      },
    },
    images: [
      {
        type: String,
      },
    ],
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Property = models.Property || model("Property", PropertySchema);

// // 공개적으로 노출할 데이터만 반환하는 메서드
// // owner 정보와 같은 민감한 정보는 제외하고 반환
// PropertySchema.methods.toPublicJSON = function () {
//   const obj = this.toObject();
//   delete obj.owner; // owner 정보 삭제
//   return obj;
// };

// // 월세 기준 평당 가격을 계산하는 가상 필드
// // rates.monthly가 있으면 월세/면적, 없으면 0 반환
// PropertySchema.virtual("price_per_sqft").get(function () {
//   return this.rates.monthly ? this.rates.monthly / this.square_feet : 0;
// });

// // 매물이 최근 7일 이내에 등록되었는지 확인하는 가상 필드
// // 현재 시간 - 생성 시간이 7일(밀리초) 미만이면 true
// PropertySchema.virtual("isNew").get(function () {
//   return Date.now() - this.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000; // 7일을 밀리초로 변환
// });

// // 연간 임대 수입을 계산하는 가상 필드
// // 월세 * 12개월로 계산, 월세가 없으면 0 반환
// PropertySchema.virtual("annualIncome").get(function () {
//   return this.rates.monthly ? this.rates.monthly * 12 : 0;
// });

// // 매물의 예약 가능 여부를 확인하는 메서드
// // TODO: 실제 예약 시스템과 연동 필요
// // 현재는 항상 true 반환 (예시용)
// PropertySchema.methods.isAvailable = function () {
//   return true;
// };

// // 임대료가 적절한지 검증하는 메서드
// // 월세가 주당 임대료의 4배를 초과하지 않는지 확인
// // 즉, 월세가 주당 임대료 * 4 보다 작거나 같아야 함
// PropertySchema.methods.validateRates = function () {
//   return this.rates.monthly && this.rates.weekly
//     ? this.rates.monthly <= this.rates.weekly * 4 // 월세가 주당 임대료의 4배 이하여야 함
//     : true; // rates 정보가 없으면 true 반환
// };

// 검색 성능 향상을 위한 인덱스
PropertySchema.index({ name: "text", description: "text" });
PropertySchema.index({ "location.city": 1, "location.state": 1 });
PropertySchema.index({ is_featured: 1 });

export default Property;
