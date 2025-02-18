import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import userDataReducer from "./slices/userDataSlice";
import promoReducer from "./slices/promoSlice";
import storeReducer from "./slices/storeSlice";
import brandReducer from "./slices/brandSlice";
import transactionReducer from "./slices/transaction";
import tierReducer from "./slices/tierSlice";
import pointReducer from "./slices/pointSlice";
import pointExpiredReducer from "./slices/pointExpiredSlice";
import historyTierReducer from "./slices/historyTierSlice";
import voucherReducer from "./slices/voucherSlice";
import voucherListReducer from "./slices/voucherListSlice";
import rewardsReducer from "./slices/rewardsSlice";
import luckyReducer from "./slices/luckySlice";
import luckyListReducer from "./slices/luckyListSlice";
import categoryPromoReducer from "./slices/categoryPromoSlice";
import tierInfoSementara from "./slices/tierInfoSementara";
import contact from "./slices/contactSlice";
import faqReducer from "./slices/faqSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    userData: userDataReducer,
    brand: brandReducer,
    promo: promoReducer,
    store: storeReducer,
    transaction: transactionReducer,
    tier: tierReducer,
    point: pointReducer,
    pointExpired: pointExpiredReducer,
    tierHistory: historyTierReducer,
    voucher: voucherReducer,
    voucherList: voucherListReducer,
    rewards: rewardsReducer,
    lucky: luckyReducer,
    luckyList: luckyListReducer,
    categoryPromo: categoryPromoReducer,
    tierInfoSementara: tierInfoSementara,
    contact: contact,
    faq: faqReducer,
  },
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
