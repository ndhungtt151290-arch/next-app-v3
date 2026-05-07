/**
 * Final patch: fill remaining nulls in dangerScenarioGroups
 * Run: node scripts/patch-danger-final.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN = path.join(__dirname, "../app/data/questions.vi.json");

const data = JSON.parse(fs.readFileSync(IN, "utf8"));

// Only fill nulls - maps partId -> {textVi?, explanationVi?}
const fixTranslations = {
  // 11_1_1 - textVi null in dangerScenarioGroups (group index 0)
  "menkyogentsuki_gentsuki_11_1_1": {
    textVi: "Đi ở mép trái đường và tăng tốc để tiến lên.",
  },
  // 11_16_1 - explanationVi null
  "menkyogentsuki_gentsuki_11_16_1": {
    explanationVi: "Tại ngã tư, người đi bộ qua đường có quyền ưu tiên. Không được nghĩ rằng người đi bộ sẽ dừng lại.",
  },
  // 11_20_3 - explanationVi null
  "menkyogentsuki_gentsuki_11_20_3": {
    explanationVi: "Ở đường cong, có nguy cơ đâm vào xe đối diện, nên không được đi sát vạch giữa đường.",
  },
  // 11_21_1 - explanationVi null
  "menkyogentsuki_gentsuki_11_21_1": {
    explanationVi: "Trẻ em có thể có hành động không thể đoán trước, nên cần chú ý.",
  },
  // 11_21_3 - explanationVi null
  "menkyogentsuki_gentsuki_11_21_3": {
    explanationVi: "Không vì có xe phía sau mà cần phải rẽ phải gấp.",
  },
  // 11_24_1 - explanationVi null
  "menkyogentsuki_gentsuki_11_24_1": {
    explanationVi: "Người thường bất ngờ chạy ra từ bóng xe đỗ.",
  },
  // 11_25_2 - explanationVi null
  "menkyogentsuki_gentsuki_11_25_2": {
    explanationVi: "Thay đổi làn đường gấp là nguy hiểm.",
  },
  // 11_26_2 - explanationVi null
  "menkyogentsuki_gentsuki_11_26_2": {
    explanationVi: "Không được tùy tiện bấm còi.",
  },
  // 11_26_3 - explanationVi null
  "menkyogentsuki_gentsuki_11_26_3": {
    explanationVi: "Tránh phanh gấp.",
  },
  // 11_27_1 - explanationVi null
  "menkyogentsuki_gentsuki_11_27_1": {
    explanationVi: "Không được tăng tốc rẽ phải. Nên ưu tiên xe hai bánh.",
  },
  // 11_27_2 - explanationVi null
  "menkyogentsuki_gentsuki_11_27_2": {
    explanationVi: "Xe máy nhìn xa hơn thực tế, nên cần chú ý.",
  },
  // 11_27_3 - explanationVi null
  "menkyogentsuki_gentsuki_11_27_3": {
    explanationVi: "Xe phía sau có thể đi thẳng hoặc rẽ trái, thì đợi rồi mới rẽ phải.",
  },
  // 11_28_1 - explanationVi null
  "menkyogentsuki_gentsuki_11_28_1": {
    explanationVi: "Bình thường thì mình được ưu tiên, nhưng khi xe đối diện đã bắt đầu rẽ phải thì nhường xe đối diện đi trước.",
  },
  // 11_28_2 - explanationVi null
  "menkyogentsuki_gentsuki_11_28_2": {
    explanationVi: "Khi đi qua ngã tư, không được bỏ qua việc xác nhận an toàn.",
  },
  // 11_29_3 - explanationVi null
  "menkyogentsuki_gentsuki_11_29_3": {
    explanationVi: "Vì xe phía sau đang bật đèn báo rẽ nên nhường xe phía sau vượt.",
  },
  // 11_30_1 - explanationVi null
  "menkyogentsuki_gentsuki_11_30_1": {
    explanationVi: "Hiện tượng chói mắt là gì? Đó là khi ánh sáng chói làm mất tầm nhìn.",
  },
  // 11_30_2 - explanationVi null
  "menkyogentsuki_gentsuki_11_30_2": {
    explanationVi: "Ban đêm tầm nhìn kém, nên bắt buộc phải giảm tốc độ so với ban ngày.",
  },
};

// Apply
let updated = 0;
for (const group of data.dangerScenarioGroups) {
  for (const sub of group.subs) {
    const fix = fixTranslations[sub.partId];
    if (fix) {
      if (fix.textVi !== undefined && sub.textVi === null) {
        sub.textVi = fix.textVi;
        updated++;
      }
      if (fix.explanationVi !== undefined && sub.explanationVi === null) {
        sub.explanationVi = fix.explanationVi;
        updated++;
      }
    }
  }
}

fs.writeFileSync(IN, JSON.stringify(data, null, 2), "utf8");
console.log(`Updated ${updated} remaining nulls in dangerScenarioGroups`);
